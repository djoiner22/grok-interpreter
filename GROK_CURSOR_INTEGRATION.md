# Grok-Cursor Integration for Open Interpreter

This documentation explains how to use the new Grok-Cursor integration in Open Interpreter, which enables a powerful workflow where Grok AI generates project outlines and Cursor editor implements them automatically.

## Overview

The integration provides three main features:

1. **Grok API Integration** - Use Grok models for AI operations
2. **Cursor Communication** - Automated project creation and file management with Cursor
3. **Complete Workflow** - End-to-end project generation from idea to implementation

## Prerequisites

### 1. Grok API Access

You'll need access to the Grok API (xAI). You can get access through:
- [OpenRouter](https://openrouter.ai/) (recommended for easy access)
- [AI/ML API](https://aimlapi.com/) 
- Direct xAI API access

### 2. Cursor Editor

Install [Cursor](https://cursor.sh/) - the AI-first code editor.

### 3. API Key Configuration

Set your API key as an environment variable or pass it via command line:

```bash
# For OpenRouter (recommended)
export OPENAI_API_KEY="your_openrouter_key"
export OPENAI_API_BASE="https://openrouter.ai/api/v1"

# Or for direct xAI access
export XAI_API_KEY="your_xai_key"
```

## Quick Start

### Complete Workflow (Grok + Cursor)

Create a complete project from a description:

```bash
# Basic usage
interpreter --grok-project "Create a todo app with React and Node.js backend"

# With custom workspace
interpreter --grok-project "Build a Python web scraper" --workspace-path ~/projects

# Force Grok model usage
interpreter --grok-project "Create a REST API with FastAPI" --use-grok
```

### Outline-Only Generation

Generate just the project outline with Grok:

```bash
interpreter --grok-outline "Create a machine learning project for image classification"
```

This will:
1. Generate a detailed project outline using Grok
2. Display the outline
3. Ask if you want to implement it with Cursor

## Usage Examples

### Example 1: Web Application

```bash
interpreter --grok-project "Create a full-stack e-commerce website with React frontend, Node.js backend, and MongoDB database. Include user authentication, product catalog, shopping cart, and payment integration."
```

**What happens:**
1. Grok generates a comprehensive project structure
2. Creates directories: `frontend/`, `backend/`, `database/`, `docs/`
3. Generates starter files with proper configurations
4. Opens the project in Cursor for further development

### Example 2: Python Data Science Project

```bash
interpreter --grok-project "Build a data analysis project that processes CSV files, performs statistical analysis, and generates visualizations using pandas, matplotlib, and seaborn"
```

**What happens:**
1. Creates project structure with `src/`, `data/`, `notebooks/`, `tests/`
2. Generates Python files with data processing templates
3. Creates requirements.txt with necessary packages
4. Includes Jupyter notebook templates

### Example 3: Mobile App Backend

```bash
interpreter --grok-project "Create a REST API backend for a mobile fitness app with user profiles, workout tracking, and social features using FastAPI and PostgreSQL"
```

## Command Line Options

| Option | Short | Description |
|--------|-------|-------------|
| `--grok-project` | `-gp` | Create complete project with Grok outline + Cursor implementation |
| `--grok-outline` | `-go` | Generate project outline only using Grok |
| `--use-grok` | `-ug` | Force use of Grok model for AI operations |
| `--workspace-path` | `-wp` | Specify workspace directory for project creation |

## Programmatic Usage

You can also use the integration programmatically:

```python
from interpreter import interpreter

# Complete workflow
result = interpreter.create_project_with_grok(
    "Create a Python web scraper for news articles",
    workspace_path="/home/user/projects"
)

print(f"Project created at: {result['summary']['project_path']}")

# Outline only
outline = interpreter.generate_outline_with_grok(
    "Build a machine learning model for sentiment analysis"
)

# Implement existing outline
implementation = interpreter.implement_with_cursor(outline)
```

## Model Selection

The integration supports various Grok models:

```bash
# Use specific Grok model
interpreter --model grok-3-beta --grok-project "Your project description"

# Available models:
# - grok-beta (latest stable)
# - grok-3-beta (most advanced)
# - grok-3-mini-beta (faster, lighter)
```

## Configuration

### Environment Variables

```bash
# API Configuration
export OPENAI_API_KEY="your_api_key"
export OPENAI_API_BASE="https://openrouter.ai/api/v1"  # for OpenRouter

# Workspace Configuration
export GROK_CURSOR_WORKSPACE="~/projects"

# Cursor Configuration
export CURSOR_COMMAND="cursor"  # or "code" if using VS Code
```

### Custom Workspace

```bash
# Create projects in specific directory
interpreter --grok-project "Your project" --workspace-path /path/to/workspace
```

## Project Structure Generated

A typical generated project includes:

```
project-name/
├── README.md                 # Project documentation
├── requirements.txt          # Dependencies (Python)
├── package.json             # Dependencies (Node.js)
├── src/                     # Source code
│   ├── main.py|index.js     # Entry point
│   ├── models/              # Data models
│   ├── services/            # Business logic
│   └── utils/               # Utilities
├── tests/                   # Test files
├── docs/                    # Documentation
├── config/                  # Configuration files
└── .grok-cursor-workflow.json  # Workflow metadata
```

## Advanced Features

### Custom Instructions

You can add custom instructions to influence the project generation:

```bash
interpreter --grok-project "Create a web app" --custom-instructions "Use TypeScript, follow clean architecture principles, include comprehensive tests"
```

### Template Integration

The system can detect and use project templates:

```python
# Custom project template
template = {
    "name": "microservice-template",
    "directories": ["src", "tests", "docker", "docs"],
    "files": {
        "Dockerfile": {"content": "..."},
        "docker-compose.yml": {"content": "..."}
    }
}

result = interpreter.create_project_with_grok(
    "Create a microservice",
    template=template
)
```

## Troubleshooting

### Common Issues

1. **API Key Not Set**
   ```
   Error: No API key provided
   ```
   **Solution:** Set your API key environment variable

2. **Cursor Not Found**
   ```
   Error: Cursor command not found
   ```
   **Solution:** Install Cursor or set CURSOR_COMMAND environment variable

3. **Project Creation Failed**
   ```
   Error: Failed to create project structure
   ```
   **Solution:** Check workspace permissions and available disk space

### Debug Mode

Enable verbose logging for troubleshooting:

```bash
interpreter --grok-project "Your project" --verbose --debug
```

## Tips for Best Results

1. **Be Specific**: Provide detailed project descriptions for better outlines
2. **Include Tech Stack**: Mention preferred technologies and frameworks
3. **Specify Requirements**: Include features, constraints, and requirements
4. **Use Examples**: Reference similar projects or patterns

### Good Project Descriptions

✅ **Good:** "Create a REST API for a book library system using FastAPI and PostgreSQL. Include user authentication with JWT, CRUD operations for books and authors, search functionality, and rate limiting. Use SQLAlchemy for ORM and include comprehensive API documentation with Swagger."

❌ **Poor:** "Make a web app"

## Integration with Other Tools

### Git Integration

Projects are created with git initialization:

```bash
cd generated-project
git add .
git commit -m "Initial project setup by Grok-Cursor workflow"
```

### Docker Support

Many generated projects include Docker configuration:

```bash
cd generated-project
docker-compose up  # If docker-compose.yml was generated
```

### CI/CD Templates

Request CI/CD configuration in your project description:

```bash
interpreter --grok-project "Create a Python web app with GitHub Actions CI/CD pipeline, automated testing, and deployment to Heroku"
```

## Contributing

To contribute to the Grok-Cursor integration:

1. Fork the repository
2. Create your feature branch
3. Add tests for new functionality
4. Submit a pull request

## Support

For issues and support:

1. Check this documentation
2. Enable debug mode for detailed logs
3. Open an issue on GitHub with logs and reproduction steps

## Changelog

### v1.0.0
- Initial Grok API integration
- Cursor communication system
- Complete workflow implementation
- Command-line interface
- Programmatic API

---

**Happy coding with Grok and Cursor! 🚀**