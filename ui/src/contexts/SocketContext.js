import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useApp } from './AppContext';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { state, actions } = useApp();
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const reconnectTimeoutRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    const initSocket = () => {
      // Create socket connection
      socketRef.current = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080', {
        transports: ['websocket', 'polling'],
        timeout: 10000,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        maxReconnectionAttempts: 5,
      });

      const socket = socketRef.current;

      // Connection events
      socket.on('connect', () => {
        console.log('Connected to Open Interpreter backend');
        setConnected(true);
        setReconnecting(false);
        actions.setBackendStatus('connected');
        toast.success('Connected to Open Interpreter');
      });

      socket.on('disconnect', (reason) => {
        console.log('Disconnected from backend:', reason);
        setConnected(false);
        actions.setBackendStatus('disconnected');
        
        if (reason === 'io server disconnect') {
          // Server disconnected, try to reconnect
          toast.error('Connection lost. Attempting to reconnect...');
          setReconnecting(true);
        }
      });

      socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        setConnected(false);
        actions.setBackendStatus('error');
        
        if (!reconnecting) {
          toast.error('Failed to connect to Open Interpreter backend');
        }
      });

      socket.on('reconnect', (attemptNumber) => {
        console.log('Reconnected after', attemptNumber, 'attempts');
        setReconnecting(false);
        toast.success('Reconnected to Open Interpreter');
      });

      socket.on('reconnect_error', (error) => {
        console.error('Reconnection error:', error);
      });

      socket.on('reconnect_failed', () => {
        console.error('Failed to reconnect to backend');
        setReconnecting(false);
        toast.error('Unable to reconnect to backend. Please refresh the page.');
      });

      // Chat message events
      socket.on('chat_message', (message) => {
        actions.addMessage({
          id: Date.now(),
          role: 'assistant',
          content: message.content,
          timestamp: new Date(),
          type: message.type || 'text',
          metadata: message.metadata || {},
        });
        actions.setTyping(false);
      });

      socket.on('chat_typing', (data) => {
        actions.setTyping(data.typing);
      });

      socket.on('chat_error', (error) => {
        actions.setError(error.message || 'Chat error occurred');
        actions.setTyping(false);
      });

      // Code execution events
      socket.on('code_output', (data) => {
        actions.addMessage({
          id: Date.now(),
          role: 'system',
          content: data.output,
          timestamp: new Date(),
          type: 'code_output',
          metadata: {
            language: data.language,
            exitCode: data.exitCode,
          },
        });
      });

      socket.on('code_error', (data) => {
        actions.addMessage({
          id: Date.now(),
          role: 'system',
          content: data.error,
          timestamp: new Date(),
          type: 'error',
          metadata: {
            language: data.language,
          },
        });
      });

      // Project events
      socket.on('project_created', (project) => {
        actions.addProject(project);
        toast.success(`Project "${project.name}" created successfully`);
      });

      socket.on('project_error', (error) => {
        actions.setError(error.message || 'Project operation failed');
      });

      socket.on('project_status', (status) => {
        // Update project status in real-time
        console.log('Project status:', status);
      });

      // Grok-Cursor workflow events
      socket.on('grok_outline_generated', (data) => {
        actions.addMessage({
          id: Date.now(),
          role: 'assistant',
          content: `Generated project outline:\n\n${data.outline}`,
          timestamp: new Date(),
          type: 'outline',
          metadata: {
            model: data.model,
            structured: data.structured,
          },
        });
      });

      socket.on('cursor_project_opened', (data) => {
        actions.addMessage({
          id: Date.now(),
          role: 'system',
          content: `Project opened in Cursor: ${data.projectPath}`,
          timestamp: new Date(),
          type: 'system',
          metadata: {
            projectPath: data.projectPath,
          },
        });
      });

      socket.on('workflow_progress', (data) => {
        // Handle workflow progress updates
        console.log('Workflow progress:', data);
        
        if (data.step === 'outline_generation') {
          actions.addMessage({
            id: Date.now(),
            role: 'system',
            content: '🤖 Generating project outline with Grok...',
            timestamp: new Date(),
            type: 'status',
          });
        } else if (data.step === 'project_creation') {
          actions.addMessage({
            id: Date.now(),
            role: 'system',
            content: '⚡ Creating project structure...',
            timestamp: new Date(),
            type: 'status',
          });
        } else if (data.step === 'cursor_launch') {
          actions.addMessage({
            id: Date.now(),
            role: 'system',
            content: '🚀 Opening project in Cursor...',
            timestamp: new Date(),
            type: 'status',
          });
        }
      });

      // Model configuration events
      socket.on('model_changed', (data) => {
        actions.setSelectedModel(data.model);
      });

      socket.on('model_error', (error) => {
        actions.setError(error.message || 'Model configuration error');
      });

      // File system events
      socket.on('file_created', (data) => {
        console.log('File created:', data.path);
        // Update workspace files if needed
      });

      socket.on('file_updated', (data) => {
        console.log('File updated:', data.path);
        // Update workspace files if needed
      });

      socket.on('workspace_updated', (data) => {
        actions.setWorkspaceFiles(data.files);
      });

      // Health check events
      socket.on('health_status', (status) => {
        actions.setBackendStatus(status.status);
      });
    };

    initSocket();

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [actions]);

  // Socket API methods
  const socketAPI = {
    // Chat methods
    sendMessage: (message) => {
      if (socketRef.current && connected) {
        socketRef.current.emit('chat_message', {
          content: message,
          timestamp: new Date(),
          model: state.models.selected,
        });
        
        // Add user message to chat immediately
        actions.addMessage({
          id: Date.now(),
          role: 'user',
          content: message,
          timestamp: new Date(),
          type: 'text',
        });
        
        actions.setTyping(true);
      } else {
        toast.error('Not connected to backend');
      }
    },

    // Project methods
    createGrokProject: (description, options = {}) => {
      if (socketRef.current && connected) {
        socketRef.current.emit('create_grok_project', {
          description,
          options: {
            workspace: state.workspace.path,
            model: state.models.selected,
            ...options,
          },
        });
      } else {
        toast.error('Not connected to backend');
      }
    },

    generateGrokOutline: (description, options = {}) => {
      if (socketRef.current && connected) {
        socketRef.current.emit('generate_grok_outline', {
          description,
          options: {
            model: state.models.selected,
            ...options,
          },
        });
      } else {
        toast.error('Not connected to backend');
      }
    },

    implementWithCursor: (outline, options = {}) => {
      if (socketRef.current && connected) {
        socketRef.current.emit('implement_with_cursor', {
          outline,
          options: {
            workspace: state.workspace.path,
            ...options,
          },
        });
      } else {
        toast.error('Not connected to backend');
      }
    },

    // Model methods
    setModel: (model) => {
      if (socketRef.current && connected) {
        socketRef.current.emit('set_model', { model });
      } else {
        toast.error('Not connected to backend');
      }
    },

    updateModelConfig: (config) => {
      if (socketRef.current && connected) {
        socketRef.current.emit('update_model_config', config);
      } else {
        toast.error('Not connected to backend');
      }
    },

    // File system methods
    getWorkspaceFiles: (path) => {
      if (socketRef.current && connected) {
        socketRef.current.emit('get_workspace_files', { path });
      } else {
        toast.error('Not connected to backend');
      }
    },

    createFile: (path, content) => {
      if (socketRef.current && connected) {
        socketRef.current.emit('create_file', { path, content });
      } else {
        toast.error('Not connected to backend');
      }
    },

    readFile: (path) => {
      if (socketRef.current && connected) {
        socketRef.current.emit('read_file', { path });
      } else {
        toast.error('Not connected to backend');
      }
    },

    // System methods
    checkHealth: () => {
      if (socketRef.current && connected) {
        socketRef.current.emit('health_check');
      }
    },

    // Utility methods
    disconnect: () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    },

    reconnect: () => {
      if (socketRef.current) {
        socketRef.current.connect();
        setReconnecting(true);
      }
    },
  };

  const value = {
    socket: socketRef.current,
    connected,
    reconnecting,
    ...socketAPI,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export default SocketContext;