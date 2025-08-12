import React, { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';

// Initial state
const initialState = {
  // User settings
  user: {
    name: 'Developer',
    email: null,
    preferences: {
      defaultModel: 'grok-3-beta',
      defaultWorkspace: '~/projects',
      autoSave: true,
      confirmBeforeRun: true,
      theme: 'dark',
    },
  },
  
  // Application state
  app: {
    connected: false,
    loading: false,
    error: null,
    backendStatus: 'disconnected',
    currentPage: 'dashboard',
  },
  
  // Model configuration
  models: {
    available: [
      { id: 'grok-beta', name: 'Grok Beta', provider: 'xAI', description: 'Latest stable Grok model' },
      { id: 'grok-3-beta', name: 'Grok 3 Beta', provider: 'xAI', description: 'Most advanced Grok model' },
      { id: 'grok-3-mini-beta', name: 'Grok 3 Mini', provider: 'xAI', description: 'Fast and efficient Grok model' },
      { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI', description: 'OpenAI GPT-4 model' },
      { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', description: 'OpenAI GPT-4 Omni model' },
      { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', description: 'Anthropic Claude 3.5 Sonnet' },
    ],
    selected: 'grok-3-beta',
    apiKey: '',
    apiBase: 'https://openrouter.ai/api/v1',
    customModels: [],
  },
  
  // Projects
  projects: {
    list: [],
    current: null,
    recentProjects: [],
    templates: [
      {
        id: 'web-app',
        name: 'Web Application',
        description: 'React + Node.js web application',
        tags: ['react', 'nodejs', 'fullstack'],
        icon: '🌐',
      },
      {
        id: 'api-server',
        name: 'API Server',
        description: 'RESTful API with Express.js',
        tags: ['api', 'express', 'backend'],
        icon: '🔌',
      },
      {
        id: 'data-science',
        name: 'Data Science',
        description: 'Python data analysis project',
        tags: ['python', 'pandas', 'jupyter'],
        icon: '📊',
      },
      {
        id: 'mobile-backend',
        name: 'Mobile Backend',
        description: 'Backend for mobile applications',
        tags: ['mobile', 'api', 'database'],
        icon: '📱',
      },
    ],
  },
  
  // Workspace
  workspace: {
    path: '~/projects',
    files: [],
    currentFile: null,
    openFiles: [],
  },
  
  // Chat
  chat: {
    messages: [],
    isTyping: false,
    currentSession: null,
    history: [],
  },
};

// Action types
const actionTypes = {
  // App actions
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_BACKEND_STATUS: 'SET_BACKEND_STATUS',
  SET_CURRENT_PAGE: 'SET_CURRENT_PAGE',
  CLEAR_ERROR: 'CLEAR_ERROR',
  
  // User actions
  UPDATE_USER_PREFERENCES: 'UPDATE_USER_PREFERENCES',
  SET_USER_INFO: 'SET_USER_INFO',
  
  // Model actions
  SET_SELECTED_MODEL: 'SET_SELECTED_MODEL',
  UPDATE_MODEL_CONFIG: 'UPDATE_MODEL_CONFIG',
  ADD_CUSTOM_MODEL: 'ADD_CUSTOM_MODEL',
  REMOVE_CUSTOM_MODEL: 'REMOVE_CUSTOM_MODEL',
  
  // Project actions
  SET_PROJECTS: 'SET_PROJECTS',
  ADD_PROJECT: 'ADD_PROJECT',
  UPDATE_PROJECT: 'UPDATE_PROJECT',
  DELETE_PROJECT: 'DELETE_PROJECT',
  SET_CURRENT_PROJECT: 'SET_CURRENT_PROJECT',
  ADD_RECENT_PROJECT: 'ADD_RECENT_PROJECT',
  
  // Workspace actions
  SET_WORKSPACE_PATH: 'SET_WORKSPACE_PATH',
  SET_WORKSPACE_FILES: 'SET_WORKSPACE_FILES',
  SET_CURRENT_FILE: 'SET_CURRENT_FILE',
  ADD_OPEN_FILE: 'ADD_OPEN_FILE',
  REMOVE_OPEN_FILE: 'REMOVE_OPEN_FILE',
  
  // Chat actions
  ADD_MESSAGE: 'ADD_MESSAGE',
  SET_TYPING: 'SET_TYPING',
  CLEAR_MESSAGES: 'CLEAR_MESSAGES',
  SET_CURRENT_SESSION: 'SET_CURRENT_SESSION',
  ADD_CHAT_HISTORY: 'ADD_CHAT_HISTORY',
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return {
        ...state,
        app: { ...state.app, loading: action.payload },
      };
      
    case actionTypes.SET_ERROR:
      return {
        ...state,
        app: { ...state.app, error: action.payload },
      };
      
    case actionTypes.CLEAR_ERROR:
      return {
        ...state,
        app: { ...state.app, error: null },
      };
      
    case actionTypes.SET_BACKEND_STATUS:
      return {
        ...state,
        app: { ...state.app, backendStatus: action.payload },
      };
      
    case actionTypes.SET_CURRENT_PAGE:
      return {
        ...state,
        app: { ...state.app, currentPage: action.payload },
      };
      
    case actionTypes.UPDATE_USER_PREFERENCES:
      return {
        ...state,
        user: {
          ...state.user,
          preferences: { ...state.user.preferences, ...action.payload },
        },
      };
      
    case actionTypes.SET_USER_INFO:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
      
    case actionTypes.SET_SELECTED_MODEL:
      return {
        ...state,
        models: { ...state.models, selected: action.payload },
      };
      
    case actionTypes.UPDATE_MODEL_CONFIG:
      return {
        ...state,
        models: { ...state.models, ...action.payload },
      };
      
    case actionTypes.ADD_CUSTOM_MODEL:
      return {
        ...state,
        models: {
          ...state.models,
          customModels: [...state.models.customModels, action.payload],
        },
      };
      
    case actionTypes.REMOVE_CUSTOM_MODEL:
      return {
        ...state,
        models: {
          ...state.models,
          customModels: state.models.customModels.filter(
            model => model.id !== action.payload
          ),
        },
      };
      
    case actionTypes.SET_PROJECTS:
      return {
        ...state,
        projects: { ...state.projects, list: action.payload },
      };
      
    case actionTypes.ADD_PROJECT:
      const newProject = { ...action.payload, id: Date.now().toString() };
      return {
        ...state,
        projects: {
          ...state.projects,
          list: [...state.projects.list, newProject],
          recentProjects: [newProject, ...state.projects.recentProjects.slice(0, 4)],
        },
      };
      
    case actionTypes.UPDATE_PROJECT:
      return {
        ...state,
        projects: {
          ...state.projects,
          list: state.projects.list.map(p =>
            p.id === action.payload.id ? { ...p, ...action.payload } : p
          ),
        },
      };
      
    case actionTypes.DELETE_PROJECT:
      return {
        ...state,
        projects: {
          ...state.projects,
          list: state.projects.list.filter(p => p.id !== action.payload),
          recentProjects: state.projects.recentProjects.filter(p => p.id !== action.payload),
        },
      };
      
    case actionTypes.SET_CURRENT_PROJECT:
      return {
        ...state,
        projects: { ...state.projects, current: action.payload },
      };
      
    case actionTypes.ADD_RECENT_PROJECT:
      const project = action.payload;
      const filtered = state.projects.recentProjects.filter(p => p.id !== project.id);
      return {
        ...state,
        projects: {
          ...state.projects,
          recentProjects: [project, ...filtered].slice(0, 5),
        },
      };
      
    case actionTypes.SET_WORKSPACE_PATH:
      return {
        ...state,
        workspace: { ...state.workspace, path: action.payload },
      };
      
    case actionTypes.SET_WORKSPACE_FILES:
      return {
        ...state,
        workspace: { ...state.workspace, files: action.payload },
      };
      
    case actionTypes.SET_CURRENT_FILE:
      return {
        ...state,
        workspace: { ...state.workspace, currentFile: action.payload },
      };
      
    case actionTypes.ADD_OPEN_FILE:
      const file = action.payload;
      if (!state.workspace.openFiles.find(f => f.path === file.path)) {
        return {
          ...state,
          workspace: {
            ...state.workspace,
            openFiles: [...state.workspace.openFiles, file],
          },
        };
      }
      return state;
      
    case actionTypes.REMOVE_OPEN_FILE:
      return {
        ...state,
        workspace: {
          ...state.workspace,
          openFiles: state.workspace.openFiles.filter(f => f.path !== action.payload),
        },
      };
      
    case actionTypes.ADD_MESSAGE:
      return {
        ...state,
        chat: {
          ...state.chat,
          messages: [...state.chat.messages, action.payload],
        },
      };
      
    case actionTypes.SET_TYPING:
      return {
        ...state,
        chat: { ...state.chat, isTyping: action.payload },
      };
      
    case actionTypes.CLEAR_MESSAGES:
      return {
        ...state,
        chat: { ...state.chat, messages: [] },
      };
      
    case actionTypes.SET_CURRENT_SESSION:
      return {
        ...state,
        chat: { ...state.chat, currentSession: action.payload },
      };
      
    case actionTypes.ADD_CHAT_HISTORY:
      return {
        ...state,
        chat: {
          ...state.chat,
          history: [action.payload, ...state.chat.history.slice(0, 9)],
        },
      };
      
    default:
      return state;
  }
};

// Context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load saved state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('openInterpreterState');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.user) {
          dispatch({ type: actionTypes.SET_USER_INFO, payload: parsed.user });
        }
        if (parsed.models) {
          dispatch({ type: actionTypes.UPDATE_MODEL_CONFIG, payload: parsed.models });
        }
        if (parsed.workspace) {
          dispatch({ type: actionTypes.SET_WORKSPACE_PATH, payload: parsed.workspace.path });
        }
      } catch (error) {
        console.error('Failed to load saved state:', error);
      }
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    const stateToSave = {
      user: state.user,
      models: {
        selected: state.models.selected,
        apiKey: state.models.apiKey,
        apiBase: state.models.apiBase,
        customModels: state.models.customModels,
      },
      workspace: {
        path: state.workspace.path,
      },
    };
    localStorage.setItem('openInterpreterState', JSON.stringify(stateToSave));
  }, [state.user, state.models, state.workspace.path]);

  // Action creators
  const actions = {
    // App actions
    setLoading: (loading) => dispatch({ type: actionTypes.SET_LOADING, payload: loading }),
    setError: (error) => {
      dispatch({ type: actionTypes.SET_ERROR, payload: error });
      if (error) {
        toast.error(error);
      }
    },
    clearError: () => dispatch({ type: actionTypes.CLEAR_ERROR }),
    setBackendStatus: (status) => dispatch({ type: actionTypes.SET_BACKEND_STATUS, payload: status }),
    setCurrentPage: (page) => dispatch({ type: actionTypes.SET_CURRENT_PAGE, payload: page }),
    
    // User actions
    updateUserPreferences: (preferences) => dispatch({ type: actionTypes.UPDATE_USER_PREFERENCES, payload: preferences }),
    setUserInfo: (userInfo) => dispatch({ type: actionTypes.SET_USER_INFO, payload: userInfo }),
    
    // Model actions
    setSelectedModel: (model) => {
      dispatch({ type: actionTypes.SET_SELECTED_MODEL, payload: model });
      toast.success(`Switched to ${model}`);
    },
    updateModelConfig: (config) => dispatch({ type: actionTypes.UPDATE_MODEL_CONFIG, payload: config }),
    addCustomModel: (model) => {
      dispatch({ type: actionTypes.ADD_CUSTOM_MODEL, payload: model });
      toast.success(`Added custom model: ${model.name}`);
    },
    removeCustomModel: (modelId) => {
      dispatch({ type: actionTypes.REMOVE_CUSTOM_MODEL, payload: modelId });
      toast.success('Custom model removed');
    },
    
    // Project actions
    setProjects: (projects) => dispatch({ type: actionTypes.SET_PROJECTS, payload: projects }),
    addProject: (project) => {
      dispatch({ type: actionTypes.ADD_PROJECT, payload: project });
      toast.success(`Project "${project.name}" created`);
    },
    updateProject: (project) => dispatch({ type: actionTypes.UPDATE_PROJECT, payload: project }),
    deleteProject: (projectId) => {
      dispatch({ type: actionTypes.DELETE_PROJECT, payload: projectId });
      toast.success('Project deleted');
    },
    setCurrentProject: (project) => {
      dispatch({ type: actionTypes.SET_CURRENT_PROJECT, payload: project });
      if (project) {
        dispatch({ type: actionTypes.ADD_RECENT_PROJECT, payload: project });
      }
    },
    
    // Workspace actions
    setWorkspacePath: (path) => dispatch({ type: actionTypes.SET_WORKSPACE_PATH, payload: path }),
    setWorkspaceFiles: (files) => dispatch({ type: actionTypes.SET_WORKSPACE_FILES, payload: files }),
    setCurrentFile: (file) => dispatch({ type: actionTypes.SET_CURRENT_FILE, payload: file }),
    addOpenFile: (file) => dispatch({ type: actionTypes.ADD_OPEN_FILE, payload: file }),
    removeOpenFile: (filePath) => dispatch({ type: actionTypes.REMOVE_OPEN_FILE, payload: filePath }),
    
    // Chat actions
    addMessage: (message) => dispatch({ type: actionTypes.ADD_MESSAGE, payload: message }),
    setTyping: (typing) => dispatch({ type: actionTypes.SET_TYPING, payload: typing }),
    clearMessages: () => dispatch({ type: actionTypes.CLEAR_MESSAGES }),
    setCurrentSession: (session) => dispatch({ type: actionTypes.SET_CURRENT_SESSION, payload: session }),
    addChatHistory: (session) => dispatch({ type: actionTypes.ADD_CHAT_HISTORY, payload: session }),
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;