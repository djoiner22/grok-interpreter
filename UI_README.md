# Open Interpreter React UI - Grok-Cursor Edition

A beautiful, modern React.js user interface for Open Interpreter with integrated Grok AI and Cursor automation support.

![Open Interpreter UI](https://img.shields.io/badge/React-18.2.0-blue) ![Material-UI](https://img.shields.io/badge/Material--UI-5.15.0-purple) ![WebSocket](https://img.shields.io/badge/WebSocket-Real--time-green)

## 🌟 Features

### Core Features
- **Modern React UI** - Beautiful, responsive interface built with Material-UI
- **Real-time Chat** - WebSocket-powered chat interface with the AI
- **Grok Integration** - Native support for Grok AI models from xAI
- **Cursor Automation** - Automated project creation with Cursor editor integration
- **Project Wizard** - Step-by-step project creation with AI assistance
- **Dark/Light Theme** - Automatic theme switching with user preferences
- **Mobile Responsive** - Works seamlessly on desktop, tablet, and mobile

### Advanced Features
- **Code Execution** - Real-time code execution with syntax highlighting
- **Project Management** - Browse, create, and manage your projects
- **Model Configuration** - Easy switching between AI models (Grok, GPT-4, Claude)
- **Workspace Integration** - File system integration and workspace management
- **Real-time Status** - Live connection status and system health monitoring
- **Chat History** - Persistent chat sessions and conversation history

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm/yarn
- Python 3.8+ (for the backend)
- Git

### 1. Clone and Setup

```bash
# Clone the repository (if you haven't already)
git clone <your-repo-url>
cd open-interpreter

# Install UI dependencies
cd ui
npm install

# Install backend dependencies
cd ../backend
pip install -r requirements.txt

# Install Open Interpreter with Grok-Cursor integration
cd ..
pip install -e .
```

### 2. Configure API Keys

Create a `.env` file in the `ui` directory:

```env
# React App Configuration
REACT_APP_BACKEND_URL=http://localhost:8080
REACT_APP_VERSION=1.0.0

# Backend Configuration (optional)
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
```

For Grok API access, you can use:
- [OpenRouter](https://openrouter.ai/) (recommended)
- [AI/ML API](https://aimlapi.com/)
- Direct xAI access (when available)

### 3. Start the Application

**Option A: Development Mode (Recommended)**

Terminal 1 - Start the backend:
```bash
cd backend
python server.py
```

Terminal 2 - Start the React UI:
```bash
cd ui
npm start
```

**Option B: Production Build**

```bash
# Build the UI
cd ui
npm run build

# Serve the built files (backend will serve them)
cd ../backend
python server.py --serve-static
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Health Check**: http://localhost:8080/api/health

## 📁 Project Structure

```
open-interpreter/
├── ui/                          # React frontend
│   ├── public/                  # Static files
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Sidebar/         # Navigation sidebar
│   │   │   ├── TopBar/          # Application header
│   │   │   └── Loading/         # Loading screens
│   │   ├── contexts/            # React contexts for state
│   │   │   ├── AppContext.js    # Global app state
│   │   │   └── SocketContext.js # WebSocket communication
│   │   ├── pages/               # Main application pages
│   │   │   ├── Dashboard/       # Overview dashboard
│   │   │   ├── ChatInterface/   # AI chat interface
│   │   │   ├── ProjectWizard/   # Project creation wizard
│   │   │   ├── ProjectBrowser/  # Project management
│   │   │   ├── WorkspaceManager/# File system interface
│   │   │   ├── ModelConfiguration/# AI model settings
│   │   │   └── Settings/        # User preferences
│   │   ├── App.js              # Main app component
│   │   ├── index.js            # React entry point
│   │   └── index.css           # Global styles
│   └── package.json            # Dependencies and scripts
├── backend/                     # Python WebSocket server
│   ├── server.py               # Main server file
│   └── requirements.txt        # Python dependencies
├── interpreter/                 # Enhanced Open Interpreter
│   ├── core/
│   │   ├── cursor/             # Cursor integration
│   │   └── grok_cursor_workflow.py # Workflow orchestration
│   └── ...                     # Original Open Interpreter files
└── README.md                   # This file
```

## 🎨 UI Components

### Dashboard
- System status overview
- Recent projects and activity
- Quick action buttons
- Activity charts and analytics

### Chat Interface
- Real-time messaging with AI
- Code execution and output display
- Markdown and syntax highlighting
- Special commands for Grok workflows
- Chat history and sessions

### Project Wizard
- Step-by-step project creation
- Technology stack selection
- Feature configuration
- AI-generated project outlines
- Automatic Cursor integration

### Project Browser
- Grid/list view of projects
- Project search and filtering
- Quick actions (open, delete, clone)
- Project statistics

## 🔧 Configuration

### Model Configuration

The UI supports multiple AI models:

```javascript
// Available models in the UI
const models = [
  'grok-beta',          // Grok Beta
  'grok-3-beta',        // Grok 3 Beta  
  'grok-3-mini-beta',   // Grok 3 Mini
  'gpt-4',              // OpenAI GPT-4
  'gpt-4o',             // OpenAI GPT-4 Omni
  'claude-3.5-sonnet',  // Anthropic Claude
];
```

### Workspace Configuration

```javascript
// Default workspace settings
const workspace = {
  defaultPath: '~/projects',
  autoSave: true,
  autoOpenInCursor: true,
  confirmBeforeRun: true,
};
```

## 🚀 Usage Examples

### Creating a Project with Grok

1. Navigate to the **Project Wizard**
2. Enter project details and description
3. Select technology stack and features
4. Click **"Generate Outline with Grok"**
5. Review the AI-generated outline
6. Click **"Create Project"** to implement

### Chat Commands

The chat interface supports special commands:

```bash
# Create a complete project
/grok-project Create a React todo app with authentication

# Generate project outline only
/grok-outline Build a Python API server with FastAPI

# Regular conversation
Help me understand React hooks
```

### API Integration

The frontend communicates with the backend via WebSocket:

```javascript
// Example: Send a chat message
socket.emit('chat_message', {
  content: 'Hello, AI!',
  model: 'grok-3-beta'
});

// Example: Create a project
socket.emit('create_grok_project', {
  description: 'Build a modern web app',
  options: {
    workspace: '~/projects',
    technology: 'react',
    features: ['auth', 'database']
  }
});
```

## 🛠️ Development

### Available Scripts

```