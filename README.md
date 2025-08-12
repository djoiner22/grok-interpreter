# Grok'ed-Interpreter

[![PyPI version](https://badge.fury.io/py/grok-interpreter.svg)](https://badge.fury.io/py/grok-interpreter)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)

**The most powerful AI development platform** - combining the best of Grok AI, Cursor automation, and intelligent code execution in one seamless package.

```bash
pip install grok-interpreter
```

<div align="center">
  <img src="https://img.shields.io/badge/Grok-Powered-purple?style=for-the-badge&logo=lightning" alt="Grok Powered" />
  <img src="https://img.shields.io/badge/Cursor-Integrated-blue?style=for-the-badge&logo=cursor" alt="Cursor Integrated" />
  <img src="https://img.shields.io/badge/AI-Enhanced-green?style=for-the-badge&logo=robot" alt="AI Enhanced" />
</div>

---

## 🚀 What is Grok'ed-Interpreter?

Grok'ed-Interpreter is the next evolution of AI-powered development tools. It seamlessly integrates **Grok AI models** with **Cursor editor automation** to provide an unparalleled development experience.

### ✨ Key Features

- 🤖 **Grok AI Integration** - Leverage xAI's powerful Grok models for intelligent code generation
- ⚡ **Cursor Automation** - Automatic project creation and editor integration
- 🎯 **Project Wizard** - AI-guided project setup with best practices
- 💬 **Interactive Chat** - Natural language interface for coding tasks
- 🌐 **Modern Web UI** - Beautiful React interface with real-time updates
- 🔧 **Code Execution** - Safe, sandboxed environment for running AI-generated code
- 📁 **Workspace Management** - Intelligent file and project organization

---

## 🏃‍♂️ Quick Start

### Installation

```bash
# Install Grok-Interpreter
pip install grok-interpreter

# Install with UI support
pip install grok-interpreter[ui]

# Install with all features
pip install grok-interpreter[server,ui,local,os]
```

### Basic Usage

#### Command Line Interface

```bash
# Start interactive chat
grok-interpreter

# Create a project with Grok
grok-interpreter --grok-project "Create a React todo app with authentication"

# Generate project outline
grok-interpreter --grok-outline "Build a Python API server with FastAPI"

# Use specific Grok model
grok-interpreter --use-grok --model grok-3-beta
```

#### Python API

```python
import grok_interpreter

# Initialize with Grok
interpreter = grok_interpreter.new_interpreter()
interpreter.llm.model = "grok-3-beta"

# Generate and execute code
interpreter.chat("Create a web scraper for news articles")

# Create project with Grok-Cursor workflow
result = interpreter.create_project_with_grok(
    "Build a modern dashboard with React and Node.js",
    workspace_path="~/projects",
    open_in_cursor=True
)
```

#### Web UI

```bash
# Start the web interface
grok-server

# Then open http://localhost:8080 in your browser
```

---

## ⚙️ Setup and Environment

- **Use a virtual environment** (recommended):
  ```bash
  python3 -m venv .venv
  source .venv/bin/activate
  python -m pip install --upgrade pip
  ```
- **Install minimal dev/test deps** (to run the core test suite without heavy extras):
  ```bash
  pip install pytest fastapi uvicorn janus shortuuid pydantic starlette websockets websocket-client requests rich yaspin tokentrim litellm inquirer psutil wget toml html2text ipython Pillow jupyter_client ipykernel
  ```
- **Optional features** (install as needed):
  - Browser automation: `pip install selenium webdriver-manager`
  - HTML rendering to image: `pip install html2image`
  - Computer vision/OS automation: `pip install "grok-interpreter[os]"`

### Notes for Debian/Ubuntu (PEP 668)
If you see “externally-managed-environment”, create a venv (above) or pass `--break-system-packages` to pip at your own risk.

### Running tests
```bash
pytest -q
```

### Troubleshooting
- ImportError for optional modules (e.g., Selenium, html2image, matplotlib): these are now lazily imported and won’t block imports. Install the optional package if you need the related feature.
- If Jupyter kernel tools are missing: `pip install jupyter_client ipykernel`.
- If Chrome is required for Selenium, ensure Chrome/Chromedriver is installed or use `webdriver-manager`.

---

## 🎯 Core Workflows

### 1. **Grok Project Creation**

```bash
grok-interpreter --grok-project "Create a machine learning project for image classification"
```

This will:
- 🧠 Use Grok AI to generate a detailed project outline
- 📁 Create the complete project structure
- 📦 Install all necessary dependencies
- 🚀 Automatically open the project in Cursor
- ✨ Generate starter code and documentation

### 2. **Interactive Development**

```bash
grok-interpreter
```

```
You: Help me build a REST API for a blog
Grok'ed-Interpreter: I'll help you create a REST API for a blog. Let me start by setting up a Flask application with the essential endpoints...

[Grok'ed-Interpreter generates and executes code]

✅ Created blog_api.py with:
   - User authentication
   - CRUD operations for posts
   - Database models
   - API documentation

Would you like me to add testing or deploy this to a cloud platform?
```

### 3. **Outline Generation**

```bash
grok-interpreter --grok-outline "Build a mobile app for task management"
```

Generates a comprehensive project plan with:
- Architecture decisions
- Technology stack recommendations
- Implementation roadmap
- File structure
- Deployment strategies

---

## 🌐 Web Interface

Launch the beautiful React web interface:

```bash
grok-server
```

### Features:
- 📊 **Dashboard** - Project overview and system status
- 💬 **AI Chat** - Interactive conversation with Grok
- 🎨 **Project Wizard** - Step-by-step project creation
- 📁 **File Manager** - Integrated workspace management
- ⚙️ **Settings** - Model configuration and preferences
- 🌓 **Dark/Light Mode** - Customizable themes

---

## 🔧 Configuration

### API Keys

Set your API keys for enhanced functionality:

```bash
# For Grok access via OpenRouter (recommended)
export OPENROUTER_API_KEY="your_openrouter_key"

# For direct xAI access (when available)
export XAI_API_KEY="your_xai_key"

# For additional models
export OPENAI_API_KEY="your_openai_key"
export ANTHROPIC_API_KEY="your_anthropic_key"
```

### Model Configuration

```python
import grok_interpreter

# Configure default model
interpreter = grok_interpreter.new_interpreter()
interpreter.llm.model = "grok-3-beta"  # or "grok-beta", "gpt-4", "claude-3.5-sonnet"

# Set custom API base
interpreter.llm.api_base = "https://openrouter.ai/api/v1"
```

### Cursor Integration

Ensure Cursor is installed and accessible:

```bash
# Install Cursor from https://cursor.sh
# Grok'ed-Interpreter will automatically detect and integrate with Cursor
```

---

## 📚 Examples

### Web Application

```python
import grok_interpreter

interpreter = grok_interpreter.new_interpreter()
interpreter.llm.model = "grok-3-beta"

# Create a full-stack web app
interpreter.chat("""
Create a modern web application with:
- React frontend with Material-UI
- Node.js/Express backend
- MongoDB database
- User authentication
- Real-time chat functionality
- Responsive design
""")
```

### Data Science Project

```python
# Generate a complete ML pipeline
interpreter.chat("""
Build a machine learning project that:
- Loads and analyzes a CSV dataset
- Performs data cleaning and visualization
- Trains multiple models (Random Forest, XGBoost, Neural Network)
- Evaluates model performance
- Creates a Streamlit dashboard for predictions
""")
```

### API Development

```python
# Create a production-ready API
interpreter.chat("""
Design a RESTful API for an e-commerce platform:
- FastAPI framework with async support
- PostgreSQL database with SQLAlchemy
- JWT authentication
- Product catalog management
- Order processing
- Payment integration
- Comprehensive testing
- Docker containerization
""")
```

---

## 🎨 Advanced Features

### Custom Workflows

```python
from grok_interpreter.workflows import GrokCursorWorkflow

workflow = GrokCursorWorkflow()

# Define custom project template
workflow.add_template("microservice", {
    "description": "Containerized microservice with FastAPI",
    "structure": {
        "app/": ["main.py", "models.py", "routes.py"],
        "tests/": ["test_main.py"],
        "docker/": ["Dockerfile", "docker-compose.yml"]
    },
    "dependencies": ["fastapi", "uvicorn", "sqlalchemy"],
    "cursor_config": {"extensions": ["python", "docker"]}
})

# Use the template
result = workflow.create_project(
    "payment-service",
    template="microservice",
    features=["authentication", "database", "monitoring"]
)
```

### Model Switching

```python
# Switch between models dynamically
interpreter.llm.model = "grok-3-beta"      # For creative coding
interpreter.chat("Build a game engine")

interpreter.llm.model = "gpt-4"            # For precise analysis  
interpreter.chat("Optimize this algorithm")

interpreter.llm.model = "claude-3.5-sonnet" # For detailed documentation
interpreter.chat("Document this codebase")
```

---

## 🏗️ Architecture

```
Grok'ed-Interpreter
├── 🧠 AI Core
│   ├── Grok Models (grok-3-beta, grok-beta)
│   ├── OpenAI Models (gpt-4, gpt-4o)
│   └── Anthropic Models (claude-3.5-sonnet)
├── ⚡ Execution Engine
│   ├── Code Generation
│   ├── Safe Execution
│   └── Error Handling
├── 🚀 Cursor Integration
│   ├── Project Creation
│   ├── File Management
│   └── Editor Automation
├── 🌐 Web Interface
│   ├── React Frontend
│   ├── WebSocket Communication
│   └── Real-time Updates
└── 🔧 CLI Tools
    ├── Interactive Chat
    ├── Project Wizards
    └── Batch Processing
```

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

```bash
# Clone the repository
git clone https://github.com/your-username/grok-interpreter.git
cd grok-interpreter

# Install in development mode
pip install -e .

# Install development dependencies
pip install -e .[server,ui,local,os]

# Run tests
python -m pytest

# Start development server
grok-server --dev
```

### Development Setup

1. **Frontend Development**:
   ```bash
   cd ui
   npm install
   npm start  # Runs on http://localhost:3000
   ```

2. **Backend Development**:
   ```bash
   cd backend
   python server.py  # Runs on http://localhost:8080
   ```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Grok AI (xAI)** - For the powerful Grok models
- **Cursor** - For the amazing AI-powered editor
- **Open Interpreter** - For the foundational architecture
- **React & Material-UI** - For the beautiful web interface

---

## 🔗 Links

- 📖 **Documentation**: [grok-interpreter.readthedocs.io](https://grok-interpreter.readthedocs.io)
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/your-username/grok-interpreter/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/your-username/grok-interpreter/discussions)
- 🐦 **Twitter**: [@GrokedInterpreter](https://twitter.com/GrokedInterpreter)

---

<div align="center">
  <h3>🌟 If you find Grok'ed-Interpreter useful, please consider giving it a star! 🌟</h3>
  <p><strong>Built with ❤️ by the Grok'ed-Interpreter community</strong></p>
</div>
