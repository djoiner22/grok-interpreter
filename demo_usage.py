#!/usr/bin/env python3
"""
Demo Usage Examples for Grok-Cursor Integration

This file demonstrates how to use the new Grok-Cursor integration features
in Open Interpreter.
"""

# ====================================================================
# Command Line Usage Examples
# ====================================================================

"""
Basic Usage Examples:

1. Create a complete project with Grok outline + Cursor implementation:
   
   interpreter --grok-project "Create a todo app with React and Node.js backend"
   
   interpreter --grok-project "Build a Python web scraper for news articles" --workspace-path ~/projects

2. Generate only a project outline with Grok:
   
   interpreter --grok-outline "Create a machine learning project for image classification"

3. Use specific Grok model:
   
   interpreter --model grok-3-beta --grok-project "Create a REST API with FastAPI"

4. Advanced usage with custom workspace:
   
   interpreter --grok-project "Build an e-commerce platform" --workspace-path /home/user/projects --use-grok

"""

# ====================================================================
# Programmatic Usage Examples  
# ====================================================================

def example_complete_workflow():
    """Example of complete Grok-Cursor workflow."""
    
    # NOTE: This requires the full Open Interpreter installation with dependencies
    # from interpreter import interpreter
    
    print("""
    # Complete Workflow Example
    
    from interpreter import interpreter
    
    # Create a complete project using Grok + Cursor
    result = interpreter.create_project_with_grok(
        "Create a Python web scraper for news articles with beautiful soup and requests",
        workspace_path="/home/user/projects"
    )
    
    if result['success']:
        print(f"Project created at: {result['summary']['project_path']}")
        print(f"Model used: {result['summary']['model_used']}")
        print(f"Project name: {result['summary']['project_name']}")
    else:
        print(f"Error: {result['message']}")
    """)

def example_outline_only():
    """Example of generating outline only."""
    
    print("""
    # Outline Generation Example
    
    from interpreter import interpreter
    
    # Generate project outline with Grok
    outline = interpreter.generate_outline_with_grok(
        "Build a machine learning model for sentiment analysis using scikit-learn"
    )
    
    if outline['success']:
        print("Generated outline:")
        print(outline['raw_outline'])
        
        # Optionally implement with Cursor
        implementation = interpreter.implement_with_cursor(outline)
        if implementation['success']:
            print(f"Project implemented at: {implementation['project_path']}")
    """)

def example_manual_workflow():
    """Example of manual workflow control."""
    
    print("""
    # Manual Workflow Control Example
    
    from interpreter import interpreter
    
    # Step 1: Get workflow instance
    workflow = interpreter.get_grok_cursor_workflow(workspace_path="~/projects")
    
    # Step 2: Generate outline with specific settings
    outline_result = workflow.generate_project_outline(
        "Create a Discord bot with Python and discord.py",
        use_grok=True
    )
    
    # Step 3: Review and modify outline if needed
    if outline_result['success']:
        print("Review the outline:")
        print(outline_result['raw_outline'])
        
        # Optionally modify the structured outline
        structured = outline_result['structured_outline']
        structured['files']['config.py'] = {
            'content': 'BOT_TOKEN = "your_token_here"\\n',
            'description': 'Bot configuration'
        }
        
        # Step 4: Implement with modifications
        modified_outline = {
            'success': True,
            'structured_outline': structured
        }
        
        implementation = workflow.implement_project_with_cursor(modified_outline)
        if implementation['success']:
            print(f"Custom project created at: {implementation['project_path']}")
    """)

def example_model_configuration():
    """Example of model configuration."""
    
    print("""
    # Model Configuration Examples
    
    from interpreter import interpreter
    
    # Use specific Grok model
    interpreter.llm.model = "grok-3-beta"
    
    # Available Grok models:
    # - "grok" or "grok-beta" -> maps to "x-ai/grok-beta"
    # - "grok-3" or "grok-3-beta" -> maps to "x-ai/grok-3-beta"
    
    # Set API key and base URL for OpenRouter (recommended)
    interpreter.llm.api_key = "your_openrouter_key"
    interpreter.llm.api_base = "https://openrouter.ai/api/v1"
    
    # Now use Grok for project generation
    result = interpreter.create_project_with_grok("Create a web app")
    """)

def example_cursor_client_direct():
    """Example of using CursorClient directly."""
    
    print("""
    # Direct CursorClient Usage
    
    from interpreter.core.cursor.cursor_client import CursorClient
    
    # Create cursor client
    cursor_client = CursorClient(workspace_path="~/projects")
    
    # Create project structure from outline
    project_outline = {
        "name": "my-awesome-project",
        "description": "An awesome project",
        "directories": ["src", "tests", "docs"],
        "files": {
            "README.md": {
                "content": "# My Awesome Project\\n\\nThis is amazing!",
                "description": "Project documentation"
            },
            "src/main.py": {
                "content": "def main():\\n    print('Hello World!')\\n\\nif __name__ == '__main__':\\n    main()",
                "description": "Main application file"
            },
            "requirements.txt": {
                "content": "requests>=2.25.0\\npandas>=1.3.0\\n",
                "description": "Python dependencies"
            }
        }
    }
    
    # Create the project
    success = cursor_client.create_project_structure(project_outline)
    if success:
        print("Project structure created!")
        
        # Open in Cursor
        cursor_client.open_project_in_cursor("my-awesome-project")
        print("Project opened in Cursor!")
    """)

# ====================================================================
# Real-World Project Examples
# ====================================================================

def real_world_examples():
    """Real-world project examples."""
    
    examples = {
        "Web Development": [
            "Create a full-stack e-commerce website with React frontend, Node.js backend, and MongoDB database. Include user authentication, product catalog, shopping cart, and payment integration.",
            "Build a blog platform using Next.js and Prisma with user management, post creation, commenting system, and SEO optimization.",
            "Develop a real-time chat application with Socket.io, Express.js, and PostgreSQL including private messaging, group chats, and file sharing."
        ],
        
        "Data Science": [
            "Build a data analysis project that processes CSV files, performs statistical analysis, and generates visualizations using pandas, matplotlib, and seaborn.",
            "Create a machine learning pipeline for predicting house prices using scikit-learn, including data preprocessing, feature engineering, and model evaluation.",
            "Develop a sentiment analysis tool for social media data using NLTK, transformers, and streamlit for the web interface."
        ],
        
        "Mobile Backend": [
            "Create a REST API backend for a mobile fitness app with user profiles, workout tracking, and social features using FastAPI and PostgreSQL.",
            "Build a backend for a food delivery app with restaurant management, order processing, and real-time tracking using Django and Redis.",
            "Develop a social media API with user authentication, post management, and recommendation system using Flask and MongoDB."
        ],
        
        "DevOps & Tools": [
            "Create a CI/CD pipeline setup with GitHub Actions, Docker, and Kubernetes for automated testing and deployment.",
            "Build a monitoring and logging system using Prometheus, Grafana, and ELK stack with alerting capabilities.",
            "Develop a backup and disaster recovery solution with automated scheduling and cloud storage integration."
        ],
        
        "Game Development": [
            "Create a 2D platformer game using Pygame with collision detection, scoring system, and multiple levels.",
            "Build a text-based RPG with character creation, combat system, and story progression using Python.",
            "Develop a multiplayer quiz game with real-time scoring and room management using Socket.io."
        ]
    }
    
    print("Real-World Project Examples for Grok-Cursor Integration:")
    print("=" * 60)
    
    for category, projects in examples.items():
        print(f"\n{category}:")
        print("-" * len(category))
        
        for i, project in enumerate(projects, 1):
            print(f"\n{i}. {project}")
            print(f"   Command: interpreter --grok-project \"{project}\"")

# ====================================================================
# Configuration Examples
# ====================================================================

def configuration_examples():
    """Configuration examples."""
    
    print("""
Configuration Examples:

1. Environment Variables:
   
   # For OpenRouter (recommended)
   export OPENAI_API_KEY="your_openrouter_key"
   export OPENAI_API_BASE="https://openrouter.ai/api/v1"
   
   # For direct xAI access
   export XAI_API_KEY="your_xai_key"
   
   # Custom workspace
   export GROK_CURSOR_WORKSPACE="~/projects"

2. Custom Instructions:
   
   interpreter --grok-project "Create a web app" \\
       --custom-instructions "Use TypeScript, follow clean architecture principles, include comprehensive tests"

3. Advanced Configuration:
   
   interpreter --grok-project "Build an API" \\
       --model grok-3-beta \\
       --workspace-path /custom/path \\
       --verbose \\
       --auto-run

4. Model Selection:
   
   # Use fastest Grok model
   interpreter --model grok-3-mini-beta --grok-project "Quick prototype"
   
   # Use most advanced Grok model  
   interpreter --model grok-3-beta --grok-project "Complex enterprise app"
""")

# ====================================================================
# Troubleshooting Examples
# ====================================================================

def troubleshooting_examples():
    """Troubleshooting examples."""
    
    print("""
Troubleshooting Common Issues:

1. API Key Issues:
   
   # Check if API key is set
   echo $OPENAI_API_KEY
   
   # Test with a simple model call
   interpreter --model grok-beta "Hello world"

2. Cursor Not Found:
   
   # Check if Cursor is installed
   which cursor
   
   # Install Cursor if needed
   # Download from https://cursor.sh/

3. Project Creation Failed:
   
   # Check workspace permissions
   ls -la ~/projects
   
   # Create workspace directory
   mkdir -p ~/projects
   
   # Run with verbose logging
   interpreter --grok-project "Test project" --verbose --debug

4. Import Errors:
   
   # Install dependencies
   pip install open-interpreter
   
   # Or in development mode
   pip install -e .

5. Model Not Available:
   
   # Check model availability
   interpreter --model grok-3-beta "test"
   
   # Try alternative model
   interpreter --model grok-beta "test"
""")

# ====================================================================
# Main Demo Function
# ====================================================================

def main():
    """Main demo function."""
    print("🚀 Grok-Cursor Integration Demo")
    print("=" * 50)
    
    print("\n1. Command Line Examples:")
    print(__doc__)
    
    print("\n2. Programmatic Examples:")
    example_complete_workflow()
    example_outline_only()
    example_manual_workflow()
    example_model_configuration()
    example_cursor_client_direct()
    
    print("\n3. Real-World Project Examples:")
    real_world_examples()
    
    print("\n4. Configuration Examples:")
    configuration_examples()
    
    print("\n5. Troubleshooting Examples:")
    troubleshooting_examples()
    
    print("\n🎉 Demo completed! Check GROK_CURSOR_INTEGRATION.md for full documentation.")

if __name__ == "__main__":
    main()