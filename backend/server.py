#!/usr/bin/env python3
"""
Open Interpreter WebSocket API Server

This server provides a WebSocket interface for the React frontend to communicate
with the Open Interpreter Python backend, including Grok-Cursor integration.
"""

import os
import sys
import json
import time
import asyncio
import threading
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, Optional

# Add the parent directory to the path to import interpreter
sys.path.insert(0, str(Path(__file__).parent.parent))

# Flask and SocketIO
from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS

# Open Interpreter
from interpreter import interpreter
from interpreter.core.grok_cursor_workflow import GrokCursorWorkflow

app = Flask(__name__)
app.config['SECRET_KEY'] = 'open-interpreter-secret-key'

# Enable CORS for all domains on all routes
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
        "methods": ["GET", "POST"],
        "allow_headers": ["Content-Type"]
    }
})

# Initialize SocketIO with CORS
socketio = SocketIO(
    app,
    cors_allowed_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    async_mode='threading'
)

# Global state
connected_clients = set()
current_sessions = {}
workflow_manager = None

def initialize_interpreter():
    """Initialize the Open Interpreter with default settings."""
    global workflow_manager
    
    try:
        # Set up basic interpreter configuration
        interpreter.auto_run = True
        interpreter.local = True
        interpreter.model = "grok-3-beta"  # Default to Grok
        
        # Initialize the Grok-Cursor workflow manager
        workflow_manager = GrokCursorWorkflow(interpreter)
        
        print("✅ Open Interpreter initialized successfully")
        print(f"📍 Model: {interpreter.model}")
        print(f"🔧 Auto-run: {interpreter.auto_run}")
        print(f"🏠 Local mode: {interpreter.local}")
        
        return True
    except Exception as e:
        print(f"❌ Failed to initialize Open Interpreter: {e}")
        return False

def emit_to_client(sid, event, data):
    """Safely emit data to a specific client."""
    try:
        socketio.emit(event, data, room=sid)
    except Exception as e:
        print(f"Error emitting to client {sid}: {e}")

def emit_to_all(event, data):
    """Safely emit data to all connected clients."""
    try:
        socketio.emit(event, data)
    except Exception as e:
        print(f"Error emitting to all clients: {e}")

@app.route('/api/health')
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'interpreter_ready': workflow_manager is not None,
        'connected_clients': len(connected_clients)
    })

@app.route('/api/status')
def get_status():
    """Get system status."""
    return jsonify({
        'interpreter': {
            'model': getattr(interpreter, 'model', 'unknown'),
            'auto_run': getattr(interpreter, 'auto_run', False),
            'local': getattr(interpreter, 'local', True),
        },
        'workflow_manager': workflow_manager is not None,
        'connected_clients': len(connected_clients),
        'active_sessions': len(current_sessions)
    })

@socketio.on('connect')
def handle_connect():
    """Handle client connection."""
    client_id = request.sid
    connected_clients.add(client_id)
    current_sessions[client_id] = {
        'id': client_id,
        'connected_at': datetime.now().isoformat(),
        'messages': [],
        'model': interpreter.model if hasattr(interpreter, 'model') else 'grok-3-beta'
    }
    
    print(f"🔌 Client connected: {client_id}")
    print(f"👥 Total connected clients: {len(connected_clients)}")
    
    # Send welcome message
    emit('chat_message', {
        'content': 'Welcome to Open Interpreter! I\'m ready to help you with coding, project creation, and more.',
        'type': 'text',
        'metadata': {
            'model': interpreter.model if hasattr(interpreter, 'model') else 'grok-3-beta',
            'timestamp': datetime.now().isoformat()
        }
    })
    
    # Send current status
    emit('health_status', {
        'status': 'connected',
        'interpreter_ready': workflow_manager is not None,
        'model': interpreter.model if hasattr(interpreter, 'model') else 'grok-3-beta'
    })

@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection."""
    client_id = request.sid
    connected_clients.discard(client_id)
    current_sessions.pop(client_id, None)
    
    print(f"🔌 Client disconnected: {client_id}")
    print(f"👥 Total connected clients: {len(connected_clients)}")

@socketio.on('chat_message')
def handle_chat_message(data):
    """Handle regular chat messages."""
    client_id = request.sid
    message_content = data.get('content', '')
    model = data.get('model', interpreter.model)
    
    if not message_content.strip():
        emit('chat_error', {'message': 'Empty message received'})
        return
    
    # Store user message in session
    if client_id in current_sessions:
        current_sessions[client_id]['messages'].append({
            'role': 'user',
            'content': message_content,
            'timestamp': datetime.now().isoformat()
        })
    
    print(f"💬 Chat message from {client_id}: {message_content[:100]}...")
    
    def process_message():
        try:
            emit_to_client(client_id, 'chat_typing', {'typing': True})
            
            # Set the model if different
            if hasattr(interpreter, 'model') and interpreter.model != model:
                interpreter.model = model
                print(f"🔄 Switched model to: {model}")
            
            # Process the message with Open Interpreter
            response = ""
            for chunk in interpreter.chat(message_content, stream=True):
                if isinstance(chunk, dict):
                    if chunk.get('type') == 'message':
                        response += chunk.get('content', '')
                    elif chunk.get('type') == 'code':
                        # Handle code execution
                        emit_to_client(client_id, 'code_output', {
                            'output': chunk.get('content', ''),
                            'language': chunk.get('format', 'python'),
                            'exitCode': 0
                        })
                else:
                    response += str(chunk)
            
            # Send the complete response
            emit_to_client(client_id, 'chat_message', {
                'content': response,
                'type': 'text',
                'metadata': {
                    'model': model,
                    'timestamp': datetime.now().isoformat()
                }
            })
            
            # Store assistant message in session
            if client_id in current_sessions:
                current_sessions[client_id]['messages'].append({
                    'role': 'assistant',
                    'content': response,
                    'timestamp': datetime.now().isoformat()
                })
            
        except Exception as e:
            print(f"❌ Error processing chat message: {e}")
            emit_to_client(client_id, 'chat_error', {
                'message': f'Error processing message: {str(e)}'
            })
        finally:
            emit_to_client(client_id, 'chat_typing', {'typing': False})
    
    # Run in a separate thread to avoid blocking
    threading.Thread(target=process_message, daemon=True).start()

@socketio.on('create_grok_project')
def handle_create_grok_project(data):
    """Handle Grok project creation requests."""
    client_id = request.sid
    description = data.get('description', '')
    options = data.get('options', {})
    
    if not description.strip():
        emit('project_error', {'message': 'Project description is required'})
        return
    
    print(f"🚀 Creating Grok project for {client_id}: {description}")
    
    def create_project():
        try:
            if not workflow_manager:
                raise Exception("Workflow manager not initialized")
            
            # Emit progress update
            emit_to_client(client_id, 'workflow_progress', {
                'step': 'outline_generation',
                'message': 'Generating project outline with Grok...'
            })
            
            # Create the project using the workflow manager
            result = workflow_manager.create_project_with_grok(
                description,
                workspace_path=options.get('workspace', '~/projects'),
                model=options.get('model', 'grok-3-beta')
            )
            
            if result['success']:
                emit_to_client(client_id, 'project_created', {
                    'name': result.get('project_name', 'New Project'),
                    'path': result.get('project_path', ''),
                    'description': description,
                    'outline': result.get('outline', ''),
                    'timestamp': datetime.now().isoformat()
                })
                
                emit_to_client(client_id, 'chat_message', {
                    'content': f"✅ Project created successfully!\n\n**Project:** {result.get('project_name', 'New Project')}\n**Path:** {result.get('project_path', '')}\n\n{result.get('outline', '')}",
                    'type': 'project_success',
                    'metadata': {
                        'project_path': result.get('project_path', ''),
                        'timestamp': datetime.now().isoformat()
                    }
                })
            else:
                raise Exception(result.get('error', 'Unknown error'))
                
        except Exception as e:
            print(f"❌ Error creating Grok project: {e}")
            emit_to_client(client_id, 'project_error', {
                'message': f'Failed to create project: {str(e)}'
            })
            
            emit_to_client(client_id, 'chat_message', {
                'content': f"❌ Failed to create project: {str(e)}",
                'type': 'error',
                'metadata': {
                    'timestamp': datetime.now().isoformat()
                }
            })
    
    # Run in a separate thread
    threading.Thread(target=create_project, daemon=True).start()

@socketio.on('generate_grok_outline')
def handle_generate_grok_outline(data):
    """Handle Grok outline generation requests."""
    client_id = request.sid
    description = data.get('description', '')
    options = data.get('options', {})
    
    if not description.strip():
        emit('project_error', {'message': 'Project description is required'})
        return
    
    print(f"📋 Generating Grok outline for {client_id}: {description}")
    
    def generate_outline():
        try:
            if not workflow_manager:
                raise Exception("Workflow manager not initialized")
            
            # Generate outline using the workflow manager
            outline = workflow_manager.generate_outline_with_grok(
                description,
                model=options.get('model', 'grok-3-beta')
            )
            
            emit_to_client(client_id, 'grok_outline_generated', {
                'outline': outline,
                'model': options.get('model', 'grok-3-beta'),
                'structured': True
            })
            
            emit_to_client(client_id, 'chat_message', {
                'content': f"📋 **Project Outline Generated**\n\n{outline}",
                'type': 'outline',
                'metadata': {
                    'model': options.get('model', 'grok-3-beta'),
                    'timestamp': datetime.now().isoformat()
                }
            })
            
        except Exception as e:
            print(f"❌ Error generating Grok outline: {e}")
            emit_to_client(client_id, 'project_error', {
                'message': f'Failed to generate outline: {str(e)}'
            })
    
    # Run in a separate thread
    threading.Thread(target=generate_outline, daemon=True).start()

@socketio.on('set_model')
def handle_set_model(data):
    """Handle model configuration changes."""
    client_id = request.sid
    model = data.get('model', '')
    
    if not model:
        emit('model_error', {'message': 'Model name is required'})
        return
    
    try:
        # Update interpreter model
        interpreter.model = model
        
        # Update session model
        if client_id in current_sessions:
            current_sessions[client_id]['model'] = model
        
        print(f"🔄 Model changed to: {model}")
        
        emit_to_client(client_id, 'model_changed', {'model': model})
        emit_to_client(client_id, 'chat_message', {
            'content': f"✅ Model switched to: {model}",
            'type': 'system',
            'metadata': {
                'timestamp': datetime.now().isoformat()
            }
        })
        
    except Exception as e:
        print(f"❌ Error setting model: {e}")
        emit_to_client(client_id, 'model_error', {
            'message': f'Failed to set model: {str(e)}'
        })

@socketio.on('health_check')
def handle_health_check():
    """Handle health check requests."""
    client_id = request.sid
    
    status = {
        'status': 'healthy' if workflow_manager else 'degraded',
        'interpreter_ready': workflow_manager is not None,
        'model': getattr(interpreter, 'model', 'unknown'),
        'timestamp': datetime.now().isoformat()
    }
    
    emit_to_client(client_id, 'health_status', status)

@socketio.on('get_workspace_files')
def handle_get_workspace_files(data):
    """Handle workspace file listing requests."""
    client_id = request.sid
    workspace_path = data.get('path', '~/projects')
    
    try:
        # Expand user path
        path = Path(workspace_path).expanduser()
        files = []
        
        if path.exists() and path.is_dir():
            for item in path.iterdir():
                files.append({
                    'name': item.name,
                    'path': str(item),
                    'type': 'directory' if item.is_dir() else 'file',
                    'size': item.stat().st_size if item.is_file() else 0,
                    'modified': datetime.fromtimestamp(item.stat().st_mtime).isoformat()
                })
        
        emit_to_client(client_id, 'workspace_updated', {'files': files})
        
    except Exception as e:
        print(f"❌ Error listing workspace files: {e}")
        emit_to_client(client_id, 'workspace_updated', {'files': []})

def run_server():
    """Run the WebSocket server."""
    print("🚀 Starting Open Interpreter WebSocket Server...")
    print("=" * 50)
    
    # Initialize the interpreter
    if not initialize_interpreter():
        print("❌ Failed to initialize interpreter. Server will start but some features may not work.")
    
    print(f"🌐 Server starting on http://localhost:8080")
    print(f"🔗 Frontend should connect from http://localhost:3000")
    print(f"💡 API health check: http://localhost:8080/api/health")
    print("=" * 50)
    
    try:
        # Run the server
        socketio.run(
            app,
            host='0.0.0.0',
            port=8080,
            debug=False,
            allow_unsafe_werkzeug=True
        )
    except KeyboardInterrupt:
        print("\n👋 Server shutting down...")
    except Exception as e:
        print(f"❌ Server error: {e}")

if __name__ == '__main__':
    run_server()