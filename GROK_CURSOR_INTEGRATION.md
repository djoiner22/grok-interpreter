# Grok'ed-Interpreter: Grok-Cursor Integration

Complete integration guide for using **Grok'ed-Interpreter** (Grokit) with Grok AI models and Cursor editor automation.

## 🚀 Overview

**Grok'ed-Interpreter** seamlessly combines the power of:
- **Grok AI** (by xAI) - Advanced language models with real-time knowledge
- **Cursor Editor** - AI-powered code editor with intelligent automation
- **Grokit Core** - Enhanced Open Interpreter with workflow orchestration

This integration enables you to:
1. **Generate project outlines** using Grok's intelligence
2. **Create complete projects** with proper file structure
3. **Automatically open projects** in Cursor for implementation
4. **Orchestrate workflows** between AI planning and code execution

## 🔧 Installation

### Prerequisites
- Python 3.8+
- Node.js 16+ (for React UI)
- [Cursor Editor](https://cursor.sh) installed and accessible

### Install Grokit
```bash
pip install grokit
```

### Install with All Features
```bash
pip install grokit[server,ui,local,os]
```

## 🔑 API Configuration

### Option 1: OpenRouter (Recommended)
```bash
export OPENROUTER_API_KEY="your_openrouter_api_key"
```

### Option 2: AI/ML API
```bash
export AIMLAPI_API_KEY="your_aimlapi_key"
```

### Option 3: Direct xAI API (When Available)
```bash
export XAI_API_KEY="your_xai_api_key"
```

## 📋 Available Grok Models

| Model | Description | Use Case |
|-------|-------------|----------|
| `grok-3-beta` | Latest Grok 3 Beta | Complex reasoning, code generation |
| `grok-beta` | Grok 1 Beta | General tasks, conversations |
| `grok-3-mini-beta` | Grok 3 Mini | Faster responses, simpler tasks |

## 🎯 Usage Examples

### Command Line Interface

#### 1. Create a Complete Project
```bash
grokit --grok-project "Create a modern React dashboard with authentication, user management, and real-time analytics"
```

#### 2. Generate Project Outline
```bash
grokit --grok-outline "Build a Python microservice with FastAPI, PostgreSQL, and Docker"
```

#### 3. Interactive Chat with Grok
```bash
grokit --use-grok --model grok-3-beta
```

### Python API

#### Basic Usage
```python
import grokit

# Initialize with Grok
interpreter = grokit.new_interpreter()
interpreter.llm.model = "grok-3-beta"

# Generate code
interpreter.chat("Create a web scraper that extracts product data from e-commerce sites")

# Create project with Grok-Cursor workflow
result = interpreter.create_project_with_grok(
    "Build a modern blog platform with Next.js and Supabase",
    workspace_path="~/projects",
    open_in_cursor=True
)
```

#### Advanced Workflow
```python
from grokit.workflows import GrokCursorWorkflow

# Initialize workflow
workflow = GrokCursorWorkflow(interpreter)

# Run complete workflow
result = workflow.run_complete_workflow(
    "Create a multi-tenant SaaS application with React, Node.js, and PostgreSQL",
    use_grok=True
)

if result["success"]:
    print(f"Project created: {result['summary']['project_path']}")
    print(f"Outline generated with: {result['summary']['model_used']}")
```

## 🌐 Web Interface

### Start the Server
```bash
grok-server
```

### Access the UI
Open http://localhost:8080 in your browser

### Features
- **Real-time Chat** with Grok models
- **Project Wizard** with step-by-step creation
- **Visual Project Browser** with integrated file management
- **Model Configuration** with easy switching
- **Live System Monitoring** with performance metrics

## 🔄 Workflow Examples

### 1. Full-Stack Web Application
```python
# Description
description = """
Create a modern e-commerce platform with:
- React frontend with TypeScript
- Node.js backend with Express
- PostgreSQL database with Prisma ORM
- Stripe payment integration
- Admin dashboard
- User authentication with JWT
- Real-time notifications
- Docker containerization
"""

# Generate outline
outline = workflow.generate_project_outline(description, use_grok=True)

# Implement with Cursor
implementation = workflow.implement_project_with_cursor(outline)
```

### 2. Machine Learning Pipeline
```python
description = """
Build a complete ML pipeline for sentiment analysis:
- Data ingestion from multiple sources
- Feature engineering pipeline
- Model training with scikit-learn
- REST API for predictions
- Monitoring and logging
- Deployment with Docker
- CI/CD pipeline
"""

result = workflow.run_complete_workflow(description, use_grok=True)
```

### 3. Mobile App Backend
```python
description = """
Create a backend for a social media mobile app:
- GraphQL API with Apollo Server
- Real-time subscriptions
- Image upload to AWS S3
- User authentication and authorization
- Push notifications
- PostgreSQL database
- Redis caching
- Comprehensive testing
"""

result = workflow.run_complete_workflow(description, use_grok=True)
```

## 🎨 Custom Project Templates

### Create Custom Templates
```python
from grokit.workflows import GrokCursorWorkflow

workflow = GrokCursorWorkflow(interpreter)

# Define custom template
workflow.add_template("microservice", {
    "description": "Containerized microservice with FastAPI",
    "structure": {
        "app/": ["main.py", "models.py", "routes.py", "database.py"],
        "tests/": ["test_main.py", "test_routes.py"],
        "docker/": ["Dockerfile", "docker-compose.yml"],
        "docs/": ["README.md", "API.md"]
    },
    "dependencies": [
        "fastapi>=0.104.0",
        "uvicorn>=0.24.0",
        "sqlalchemy>=2.0.0",
        "pytest>=7.4.0"
    ],
    "cursor_config": {
        "extensions": ["python", "docker", "rest-client"],
        "settings": {
            "python.defaultInterpreterPath": "./venv/bin/python"
        }
    }
})

# Use the template
result = workflow.create_project(
    "user-service",
    template="microservice",
    features=["authentication", "database", "monitoring"]
)
```

## 🔧 Configuration

### Environment Variables
```bash
# API Configuration
export OPENROUTER_API_KEY="your_key"
export XAI_API_KEY="your_key"
export OPENAI_API_KEY="your_key"
export ANTHROPIC_API_KEY="your_key"

# Default Model
export DEFAULT_MODEL="grok-3-beta"

# Workspace Configuration
export GROKIT_WORKSPACE="~/grokit-projects"
export CURSOR_PATH="/usr/local/bin/cursor"

# Server Configuration
export GROKIT_HOST="0.0.0.0"
export GROKIT_PORT="8080"
```

### Configuration File
Create `~/.grokit/config.yaml`:
```yaml
models:
  default: "grok-3-beta"
  providers:
    openrouter:
      api_key: "${OPENROUTER_API_KEY}"
      base_url: "https://openrouter.ai/api/v1"
    xai:
      api_key: "${XAI_API_KEY}"
      base_url: "https://api.x.ai/v1"

workspace:
  default_path: "~/grokit-projects"
  auto_open_cursor: true
  confirm_before_run: true

cursor:
  command: "cursor"
  extensions:
    - "ms-python.python"
    - "ms-vscode.vscode-typescript-next"
    - "bradlc.vscode-tailwindcss"

server:
  host: "0.0.0.0"
  port: 8080
  debug: false
```

## 🚀 Advanced Features

### Model Switching
```python
# Switch models dynamically
interpreter.llm.model = "grok-3-beta"      # For creative tasks
interpreter.chat("Build a game engine")

interpreter.llm.model = "grok-3-mini-beta"  # For quick tasks
interpreter.chat("Fix this bug")

interpreter.llm.model = "gpt-4"            # For detailed analysis
interpreter.chat("Analyze this codebase")
```

### Batch Processing
```python
# Process multiple projects
projects = [
    "Create a React component library",
    "Build a Python CLI tool",
    "Generate a REST API documentation site"
]

for project in projects:
    result = workflow.run_complete_workflow(project, use_grok=True)
    print(f"Created: {result['summary']['project_name']}")
```

### Custom Hooks
```python
# Add custom hooks to the workflow
def pre_generation_hook(description):
    """Custom preprocessing before outline generation"""
    enhanced_description = f"""
    {description}
    
    Additional Requirements:
    - Include comprehensive error handling
    - Add logging and monitoring
    - Follow security best practices
    - Include unit and integration tests
    """
    return enhanced_description

def post_generation_hook(result):
    """Custom processing after project generation"""
    if result["success"]:
        # Add custom files or configurations
        project_path = result["summary"]["project_path"]
        
        # Add custom README
        readme_path = f"{project_path}/README.md"
        with open(readme_path, "a") as f:
            f.write("\n\n## Generated with Grok'ed-Interpreter\n")
            f.write("This project was created using Grokit's AI-powered workflow.\n")

# Register hooks
workflow.register_hook("pre_generation", pre_generation_hook)
workflow.register_hook("post_generation", post_generation_hook)
```

## 🐛 Troubleshooting

### Common Issues

1. **Grok API Not Accessible**
   ```bash
   # Check API key
   curl -H "Authorization: Bearer $OPENROUTER_API_KEY" \
        "https://openrouter.ai/api/v1/models"
   
   # Test with grokit
   grokit --test-grok
   ```

2. **Cursor Not Opening**
   ```bash
   # Check cursor command
   which cursor
   cursor --version
   
   # Test cursor integration
   grokit --test-cursor
   ```

3. **Project Creation Fails**
   ```bash
   # Check workspace permissions
   ls -la ~/grokit-projects
   
   # Check disk space
   df -h
   
   # Enable debug mode
   grokit --debug --grok-project "test project"
   ```

### Debug Commands
```bash
# Check system status
grokit --status

# Test all integrations
grokit --test-all

# Enable verbose logging
grokit --verbose --grok-project "test"

# Check configuration
grokit --config-check
```

## 📊 Performance Optimization

### Model Selection
- **grok-3-beta**: Best for complex reasoning and large projects
- **grok-3-mini-beta**: Faster for simple tasks and quick iterations
- **grok-beta**: Balanced performance for general use

### Caching
```python
# Enable response caching
interpreter.llm.cache_enabled = True
interpreter.llm.cache_ttl = 3600  # 1 hour

# Use cached responses
result = interpreter.chat("Create a React component")  # Cached
```

### Parallel Processing
```python
import asyncio

async def create_multiple_projects():
    projects = [
        "React dashboard",
        "Python API",
        "Vue.js app"
    ]
    
    tasks = [
        workflow.run_complete_workflow(project, use_grok=True)
        for project in projects
    ]
    
    results = await asyncio.gather(*tasks)
    return results
```

## 🔐 Security

### API Key Management
```python
# Use environment variables
import os
from grokit.config import Config

config = Config()
config.set_api_key("openrouter", os.getenv("OPENROUTER_API_KEY"))

# Use key rotation
config.rotate_api_keys()
```

### Safe Code Execution
```python
# Enable safe mode
interpreter.safe_mode = True
interpreter.confirm_before_run = True

# Restrict file operations
interpreter.restrict_file_operations = True
interpreter.allowed_paths = ["~/grokit-projects"]
```

## 🤝 Contributing

### Development Setup
```bash
# Clone repository
git clone https://github.com/your-username/grokit.git
cd grokit

# Install in development mode
pip install -e .[dev]

# Run tests
pytest tests/

# Start development server
grok-server --dev
```

### Creating Extensions
```python
# Create custom extension
from grokit.extensions import Extension

class CustomExtension(Extension):
    def __init__(self):
        super().__init__("custom", "1.0.0")
    
    def initialize(self, interpreter):
        # Add custom functionality
        pass
    
    def handle_command(self, command, args):
        # Handle custom commands
        pass

# Register extension
interpreter.register_extension(CustomExtension())
```

## 📚 Resources

- **Documentation**: [grokit.readthedocs.io](https://grokit.readthedocs.io)
- **Examples**: [github.com/grokit/examples](https://github.com/grokit/examples)
- **Community**: [discord.gg/grokit](https://discord.gg/grokit)
- **Issues**: [github.com/grokit/issues](https://github.com/grokit/issues)

---

**Built with ❤️ by the Grok'ed-Interpreter community**

For more information, visit: [grokit.ai](https://grokit.ai)