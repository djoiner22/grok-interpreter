# Grok'ed-Interpreter React Web UI

A modern, feature-rich React web interface for **Grok'ed-Interpreter**, providing an intuitive way to interact with AI-powered development tools.

## 🌟 Features

- **Real-time AI Chat** - Interactive conversation with Grok and other AI models
- **Project Wizard** - Step-by-step project creation with AI assistance
- **Grok Integration** - Direct access to xAI's Grok models for intelligent code generation
- **Cursor Automation** - Seamless integration with Cursor editor for project implementation
- **Modern UI** - Beautiful Material-UI design with dark/light theme support
- **Real-time Updates** - WebSocket-based communication for instant feedback
- **Code Execution** - Safe, sandboxed environment for running AI-generated code
- **File Management** - Integrated workspace and project management

## 🚀 Getting Started

### Prerequisites

- Node.js 16.0 or higher
- npm or yarn package manager
- Python 3.8+ with Grok-Interpreter installed

### Installation

1. **Install Grok-Interpreter**:
   ```bash
   pip install grok-interpreter
   ```

2. **Install UI Dependencies**:
   ```bash
   cd ui
   npm install --legacy-peer-deps
   ```

3. **Start the Backend Server**:
   ```bash
   # From project root
   grok-server
   ```

4. **Start the Frontend Development Server**:
   ```bash
   # In ui directory
   npm start
   ```

5. **Access the Application**:
   Open http://localhost:3000 in your browser

## 🎯 Core Components

### Dashboard
- **System Status** - Real-time server and AI model status
- **Activity Overview** - Recent projects and chat activity
- **Quick Actions** - Fast access to common tasks
- **Performance Metrics** - CPU, memory, and disk usage

### AI Chat Interface
- **Multi-Model Support** - Switch between Grok, GPT-4, Claude, and more
- **Code Generation** - AI-powered code creation with syntax highlighting
- **Special Commands** - Use `/grok-project` and `/grok-outline` for specific tasks
- **Conversation History** - Persistent chat sessions

### Project Wizard
- **Technology Selection** - Choose from popular frameworks and languages
- **Feature Configuration** - Select specific features for your project
- **AI-Powered Outline** - Generate comprehensive project plans
- **Automatic Setup** - Create and configure projects with one click

### Workspace Manager
- **File Browser** - Navigate and manage project files
- **Project Overview** - View all active projects
- **Integration Status** - Monitor Cursor and AI connections

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# API Keys
OPENROUTER_API_KEY=your_openrouter_key_here
XAI_API_KEY=your_xai_key_here
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here

# Server Configuration
DEFAULT_MODEL=grok-3-beta
SECRET_KEY=your-secret-key-here

# Development
NODE_ENV=development
```

### Model Configuration

The UI supports multiple AI models:

- **Grok Models**: `grok-3-beta`, `grok-beta`, `grok-3-mini-beta`
- **OpenAI Models**: `gpt-4`, `gpt-4-turbo`, `gpt-4o`, `gpt-3.5-turbo`
- **Anthropic Models**: `claude-3-opus`, `claude-3-sonnet`, `claude-3-haiku`

## 📱 User Interface

### Navigation
- **Dashboard** - Main overview and system status
- **Chat** - AI conversation interface
- **Projects** - Project wizard and browser
- **Workspace** - File and project management
- **Settings** - Configuration and preferences
- **Models** - AI model selection and configuration

### Theme Support
- **Light Theme** - Clean, professional appearance
- **Dark Theme** - Comfortable for extended use
- **System Theme** - Automatic theme detection

### Responsive Design
- **Mobile Support** - Optimized for tablets and phones
- **Adaptive Layout** - Adjusts to different screen sizes
- **Touch-Friendly** - Optimized for touch interactions

## 🛠️ Development

### Project Structure

```
ui/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Loading/
│   │   ├── Sidebar/
│   │   └── TopBar/
│   ├── pages/              # Main application pages
│   │   ├── Dashboard/
│   │   ├── ChatInterface/
│   │   ├── ProjectWizard/
│   │   └── ...
│   ├── contexts/           # React contexts for state management
│   │   ├── AppContext.js
│   │   └── SocketContext.js
│   ├── App.js              # Main application component
│   └── index.js            # React entry point
├── package.json
└── README.md
```

### State Management

The UI uses React Context for state management:

- **AppContext** - Global application state, user settings, projects
- **SocketContext** - WebSocket connection and real-time communication

### API Integration

The frontend communicates with the backend via:

- **HTTP REST API** - Configuration and status endpoints
- **WebSocket** - Real-time chat and updates
- **Event-Driven** - Reactive updates based on backend events

## 🔄 WebSocket Events

### Client → Server
- `chat_message` - Send message to AI
- `configure_model` - Change AI model settings
- `get_system_info` - Request system information

### Server → Client
- `connection_established` - Initial connection data
- `ai_response_chunk` - Streaming AI responses
- `ai_response_complete` - Response finished
- `project_created` - Project generation complete
- `system_info` - System status update

## 🎨 Customization

### Themes

Customize the appearance by modifying theme files:

```javascript
// src/theme.js
export const lightTheme = {
  palette: {
    primary: { main: '#7C3AED' },    // Grok purple
    secondary: { main: '#06B6D4' },   // Cursor blue
    // ... other colors
  }
};
```

### Components

Add custom components in the `src/components/` directory:

```javascript
// src/components/MyComponent/MyComponent.js
import React from 'react';
import { Box, Typography } from '@mui/material';

const MyComponent = () => {
  return (
    <Box>
      <Typography variant="h6">Custom Component</Typography>
    </Box>
  );
};

export default MyComponent;
```

## 🐛 Troubleshooting

### Common Issues

1. **Connection Failed**
   - Ensure the backend server is running on port 8080
   - Check firewall settings
   - Verify WebSocket support in your browser

2. **AI Models Not Working**
   - Verify API keys are set correctly
   - Check model availability in your region
   - Ensure sufficient API credits

3. **Project Creation Fails**
   - Verify Cursor is installed and accessible
   - Check workspace permissions
   - Ensure sufficient disk space

### Debug Mode

Enable verbose logging:

```bash
# Start server with debug mode
grok-server --debug

# Start UI with debug logging
REACT_APP_DEBUG=true npm start
```

## 📄 API Documentation

### REST Endpoints

- `GET /` - Server information
- `GET /health` - Health check
- `GET /status` - System status
- `GET /models` - Available AI models

### WebSocket Events

See the full event documentation in the source code comments.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Development Setup

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build
```

## 📚 Libraries Used

- **React** 18.2.0 - UI framework
- **Material-UI** 5.x - Component library
- **Socket.IO** - WebSocket communication
- **React Router** - Navigation
- **Prism.js** - Code syntax highlighting
- **Recharts** - Data visualization

## 🔐 Security

- **API Key Protection** - Keys are stored server-side only
- **Input Validation** - All user inputs are sanitized
- **CORS Protection** - Configured for development and production
- **Rate Limiting** - Prevents API abuse

## 🚀 Deployment

### Production Build

```bash
# Build the UI
npm run build

# Serve static files
npm install -g serve
serve -s build -l 3000
```

### Docker Deployment

```dockerfile
# Dockerfile for UI
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📊 Performance

- **Bundle Size** - Optimized for fast loading
- **Code Splitting** - Lazy loading for better performance
- **Caching** - Efficient resource caching
- **WebSocket** - Real-time updates without polling

## 🔗 Links

- **Grok-Interpreter Documentation** - [grok-interpreter.readthedocs.io](https://grok-interpreter.readthedocs.io)
- **Grok AI** - [x.ai](https://x.ai)
- **Cursor Editor** - [cursor.sh](https://cursor.sh)
- **Material-UI** - [mui.com](https://mui.com)

---

Built with ❤️ by the Grok'ed-Interpreter community