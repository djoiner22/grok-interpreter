#!/usr/bin/env python3
"""
Grok'ed-Interpreter WebSocket Server

This server provides a WebSocket-based interface for the Grok'ed-Interpreter,
enabling real-time communication between the React frontend and the interpreter core.
"""

import os
import sys
import logging
import json
import asyncio
import traceback
from datetime import datetime
from typing import Dict, Any, Optional, List

from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit, disconnect
from flask_cors import CORS

# Add the project root to the Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from interpreter import interpreter
    from interpreter.core.grok_cursor_workflow import GrokCursorWorkflow
    from interpreter.core.cursor.cursor_client import CursorClient
except ImportError as e:
    print(f"Error importing interpreter modules: {e}")
    print("Please ensure you're running this from the project root directory")
    sys.exit(1)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('grok_interpreter_server.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class GrokInterpreterServer:
    def __init__(self):
        self.app = Flask(__name__)
        self.app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'grok-interpreter-secret-key-change-in-production')
        
        # Enable CORS for all routes
        CORS(self.app, origins=["http://localhost:3000", "http://127.0.0.1:3000"])
        
        # Initialize SocketIO with CORS settings
        self.socketio = SocketIO(
            self.app,
            cors_allowed_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
            logger=True,
            engineio_logger=True,
            async_mode='eventlet'
        )
        
        # Initialize components
        self.interpreter = interpreter
        self.workflow = GrokCursorWorkflow(interpreter)
        self.cursor_client = CursorClient()
        
        # Store active connections
        self.active_connections: Dict[str, Any] = {}
        
        # Configure interpreter
        self.setup_interpreter()
        
        # Register routes and event handlers
        self.register_routes()
        self.register_socket_events()
        
        logger.info("Grok'ed-Interpreter server initialized successfully")
    
    def setup_interpreter(self):
        """Configure the interpreter with default settings"""
        # Set up default model (can be overridden via environment variables)
        default_model = os.environ.get('DEFAULT_MODEL', 'gpt-4')
        self.interpreter.llm.model = default_model
        
        # Configure API keys
        if os.environ.get('OPENAI_API_KEY'):
            self.interpreter.llm.api_key = os.environ.get('OPENAI_API_KEY')
        
        if os.environ.get('ANTHROPIC_API_KEY'):
            self.interpreter.llm.api_key = os.environ.get('ANTHROPIC_API_KEY')
        
        if os.environ.get('OPENROUTER_API_KEY'):
            self.interpreter.llm.api_key = os.environ.get('OPENROUTER_API_KEY')
            self.interpreter.llm.api_base = "https://openrouter.ai/api/v1"
        
        # Configure interpreter settings
        self.interpreter.auto_run = False  # Always ask for confirmation
        self.interpreter.offline = False   # Enable online features
        
        logger.info(f"Interpreter configured with model: {self.interpreter.llm.model}")
    
    def register_routes(self):
        """Register HTTP routes"""
        
        @self.app.route('/')
        def index():
            return jsonify({
                'name': 'Grok\'ed-Interpreter Server',
                'version': '1.0.0',
                'status': 'running',
                'description': 'WebSocket server for Grok\'ed-Interpreter UI',
                'endpoints': {
                    'health': '/health',
                    'status': '/status',
                    'models': '/models',
                    'websocket': '/socket.io'
                }
            })
        
        @self.app.route('/health')
        def health_check():
            return jsonify({
                'status': 'healthy',
                'timestamp': datetime.now().isoformat(),
                'server': 'Grok\'ed-Interpreter',
                'version': '1.0.0'
            })
        
        @self.app.route('/status')
        def status():
            return jsonify({
                'server': 'Grok\'ed-Interpreter',
                'status': 'running',
                'active_connections': len(self.active_connections),
                'interpreter': {
                    'model': self.interpreter.llm.model,
                    'provider': getattr(self.interpreter.llm, 'provider', 'unknown'),
                    'auto_run': self.interpreter.auto_run,
                    'offline': self.interpreter.offline
                },
                'features': {
                    'grok_integration': True,
                    'cursor_automation': True,
                    'project_wizard': True,
                    'code_execution': True
                }
            })
        
        @self.app.route('/models')
        def get_models():
            """Get available models"""
            models = [
                # Grok models
                {'id': 'grok-beta', 'name': 'Grok Beta', 'provider': 'xai', 'type': 'chat'},
                {'id': 'grok-3-beta', 'name': 'Grok 3 Beta', 'provider': 'xai', 'type': 'chat'},
                {'id': 'grok-3-mini-beta', 'name': 'Grok 3 Mini Beta', 'provider': 'xai', 'type': 'chat'},
                
                # OpenAI models
                {'id': 'gpt-4', 'name': 'GPT-4', 'provider': 'openai', 'type': 'chat'},
                {'id': 'gpt-4-turbo', 'name': 'GPT-4 Turbo', 'provider': 'openai', 'type': 'chat'},
                {'id': 'gpt-4o', 'name': 'GPT-4O', 'provider': 'openai', 'type': 'chat'},
                {'id': 'gpt-3.5-turbo', 'name': 'GPT-3.5 Turbo', 'provider': 'openai', 'type': 'chat'},
                
                # Anthropic models
                {'id': 'claude-3-opus', 'name': 'Claude 3 Opus', 'provider': 'anthropic', 'type': 'chat'},
                {'id': 'claude-3-sonnet', 'name': 'Claude 3 Sonnet', 'provider': 'anthropic', 'type': 'chat'},
                {'id': 'claude-3-haiku', 'name': 'Claude 3 Haiku', 'provider': 'anthropic', 'type': 'chat'},
                {'id': 'claude-3.5-sonnet', 'name': 'Claude 3.5 Sonnet', 'provider': 'anthropic', 'type': 'chat'},
            ]
            
            return jsonify({
                'models': models,
                'current_model': self.interpreter.llm.model,
                'providers': ['xai', 'openai', 'anthropic']
            })
    
    def register_socket_events(self):
        """Register WebSocket event handlers"""
        
        @self.socketio.on('connect')
        def handle_connect():
            session_id = request.sid
            self.active_connections[session_id] = {
                'connected_at': datetime.now().isoformat(),
                'last_activity': datetime.now().isoformat()
            }
            
            logger.info(f"Client connected: {session_id}")
            
            # Send initial connection data
            emit('connection_established', {
                'session_id': session_id,
                'server': 'Grok\'ed-Interpreter',
                'version': '1.0.0',
                'timestamp': datetime.now().isoformat(),
                'features': {
                    'grok_integration': True,
                    'cursor_automation': True,
                    'project_wizard': True,
                    'code_execution': True
                }
            })
        
        @self.socketio.on('disconnect')
        def handle_disconnect():
            session_id = request.sid
            if session_id in self.active_connections:
                del self.active_connections[session_id]
            logger.info(f"Client disconnected: {session_id}")
        
        @self.socketio.on('chat_message')
        def handle_chat_message(data):
            """Handle chat messages from the frontend"""
            session_id = request.sid
            message = data.get('message', '')
            
            if not message:
                emit('error', {'message': 'Empty message received'})
                return
            
            try:
                # Update last activity
                if session_id in self.active_connections:
                    self.active_connections[session_id]['last_activity'] = datetime.now().isoformat()
                
                # Check for special commands
                if message.startswith('/grok-project'):
                    self.handle_grok_project_command(message[14:].strip())
                elif message.startswith('/grok-outline'):
                    self.handle_grok_outline_command(message[14:].strip())
                elif message.startswith('/cursor-open'):
                    self.handle_cursor_open_command(message[13:].strip())
                else:
                    # Regular chat message
                    self.handle_regular_chat(message)
                    
            except Exception as e:
                logger.error(f"Error handling chat message: {e}")
                logger.error(traceback.format_exc())
                emit('error', {
                    'message': 'An error occurred while processing your message',
                    'details': str(e)
                })
        
        @self.socketio.on('configure_model')
        def handle_model_configuration(data):
            """Handle model configuration requests"""
            try:
                model = data.get('model')
                api_key = data.get('api_key')
                api_base = data.get('api_base')
                
                if model:
                    self.interpreter.llm.model = model
                
                if api_key:
                    self.interpreter.llm.api_key = api_key
                
                if api_base:
                    self.interpreter.llm.api_base = api_base
                
                emit('model_configured', {
                    'model': self.interpreter.llm.model,
                    'api_base': getattr(self.interpreter.llm, 'api_base', None),
                    'status': 'success'
                })
                
                logger.info(f"Model configured: {model}")
                
            except Exception as e:
                logger.error(f"Error configuring model: {e}")
                emit('error', {
                    'message': 'Failed to configure model',
                    'details': str(e)
                })
        
        @self.socketio.on('get_system_info')
        def handle_system_info():
            """Get system information"""
            try:
                import platform
                import psutil
                
                system_info = {
                    'system': platform.system(),
                    'platform': platform.platform(),
                    'python_version': platform.python_version(),
                    'cpu_count': psutil.cpu_count(),
                    'memory_total': psutil.virtual_memory().total,
                    'memory_available': psutil.virtual_memory().available,
                    'disk_usage': psutil.disk_usage('/').percent,
                    'grok_interpreter_version': '1.0.0'
                }
                
                emit('system_info', system_info)
                
            except Exception as e:
                logger.error(f"Error getting system info: {e}")
                emit('error', {
                    'message': 'Failed to get system information',
                    'details': str(e)
                })
    
    def handle_regular_chat(self, message: str):
        """Handle regular chat messages"""
        try:
            # Emit thinking status
            emit('ai_thinking', {'status': 'thinking', 'message': 'Processing your request...'})
            
            # Process the message with the interpreter
            responses = []
            
            # Use the interpreter to process the message
            result = self.interpreter.chat(message, display=False, stream=False)
            
            # Handle different response types
            if result:
                # If result is a string, emit it as a message
                if isinstance(result, str):
                    responses.append(result)
                    emit('ai_response_chunk', {
                        'content': result,
                        'type': 'message',
                        'timestamp': datetime.now().isoformat()
                    })
                elif isinstance(result, list):
                    # If result is a list of messages, process each
                    for item in result:
                        if isinstance(item, dict):
                            content = item.get('content', '')
                            if content:
                                responses.append(content)
                                emit('ai_response_chunk', {
                                    'content': content,
                                    'type': 'message',
                                    'timestamp': datetime.now().isoformat()
                                })
                        elif isinstance(item, str):
                            responses.append(item)
                            emit('ai_response_chunk', {
                                'content': item,
                                'type': 'message',
                                'timestamp': datetime.now().isoformat()
                            })
            
            # Emit completion
            emit('ai_response_complete', {
                'timestamp': datetime.now().isoformat(),
                'message_count': len(responses)
            })
            
        except Exception as e:
            logger.error(f"Error in regular chat: {e}")
            logger.error(traceback.format_exc())
            emit('error', {
                'message': 'An error occurred while processing your message',
                'details': str(e)
            })
    
    def handle_grok_project_command(self, project_description: str):
        """Handle Grok project creation command"""
        try:
            emit('ai_thinking', {'status': 'thinking', 'message': 'Creating project with Grok...'})
            
            # Use the workflow to create a project
            result = self.workflow.run_complete_workflow(
                project_description,
                use_grok=True
            )
            
            emit('project_created', {
                'project_name': result.get('summary', {}).get('project_name'),
                'project_path': result.get('summary', {}).get('project_path'),
                'files_created': result.get('files_created', []),
                'outline': result.get('outline', {}).get('raw_outline'),
                'timestamp': datetime.now().isoformat()
            })
            
        except Exception as e:
            logger.error(f"Error creating Grok project: {e}")
            emit('error', {
                'message': 'Failed to create project with Grok',
                'details': str(e)
            })
    
    def handle_grok_outline_command(self, project_description: str):
        """Handle Grok outline generation command"""
        try:
            emit('ai_thinking', {'status': 'thinking', 'message': 'Generating project outline with Grok...'})
            
            # Generate outline using Grok
            outline = self.workflow.generate_project_outline(project_description)
            
            emit('project_outline_generated', {
                'outline': outline,
                'description': project_description,
                'timestamp': datetime.now().isoformat()
            })
            
        except Exception as e:
            logger.error(f"Error generating Grok outline: {e}")
            emit('error', {
                'message': 'Failed to generate project outline with Grok',
                'details': str(e)
            })
    
    def handle_cursor_open_command(self, project_path: str):
        """Handle Cursor open command"""
        try:
            emit('ai_thinking', {'status': 'thinking', 'message': 'Opening project in Cursor...'})
            
            # Open project in Cursor
            success = self.cursor_client.open_project_in_cursor(project_path)
            
            if success:
                emit('cursor_opened', {
                    'project_path': project_path,
                    'timestamp': datetime.now().isoformat()
                })
            else:
                emit('error', {
                    'message': 'Failed to open project in Cursor',
                    'details': 'Cursor may not be installed or accessible'
                })
                
        except Exception as e:
            logger.error(f"Error opening Cursor: {e}")
            emit('error', {
                'message': 'Failed to open project in Cursor',
                'details': str(e)
            })
    
    def run(self, host='0.0.0.0', port=8080, debug=False):
        """Run the server"""
        logger.info(f"Starting Grok'ed-Interpreter server on {host}:{port}")
        logger.info("Frontend should be available at http://localhost:3000")
        logger.info("Backend API available at http://localhost:8080")
        
        try:
            self.socketio.run(
                self.app,
                host=host,
                port=port,
                debug=debug,
                use_reloader=False,
                log_output=True
            )
        except KeyboardInterrupt:
            logger.info("Server shutting down...")
        except Exception as e:
            logger.error(f"Server error: {e}")
            logger.error(traceback.format_exc())

def run_server():
    """Entry point for running the server"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Grok\'ed-Interpreter WebSocket Server')
    parser.add_argument('--host', default='0.0.0.0', help='Host to bind to')
    parser.add_argument('--port', type=int, default=8080, help='Port to bind to')
    parser.add_argument('--debug', action='store_true', help='Enable debug mode')
    
    args = parser.parse_args()
    
    # Create and run the server
    server = GrokInterpreterServer()
    server.run(host=args.host, port=args.port, debug=args.debug)

if __name__ == '__main__':
    run_server()