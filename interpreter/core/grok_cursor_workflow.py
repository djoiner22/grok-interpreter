"""
Grok-Cursor Workflow Orchestration for Open Interpreter

This module coordinates the workflow between Grok (for generating project outlines)
and Cursor (for implementing the projects).
"""

import json
import os
import time
from typing import Dict, Any, Optional, List
from .cursor.cursor_client import CursorClient
from .llm.llm import Llm


class GrokCursorWorkflow:
    """
    Orchestrates the workflow between Grok outline generation and Cursor implementation.
    
    Workflow:
    1. Use Grok to generate detailed project outlines
    2. Parse and structure the outline
    3. Use Cursor to create and implement the project
    4. Provide status updates and feedback
    """
    
    def __init__(self, interpreter, workspace_path: Optional[str] = None):
        """
        Initialize the workflow orchestrator.
        
        Args:
            interpreter: The OpenInterpreter instance
            workspace_path: Path to the workspace directory
        """
        self.interpreter = interpreter
        self.cursor_client = CursorClient(workspace_path)
        self.workspace_path = workspace_path or os.getcwd()
        
    def generate_project_outline(self, project_description: str, use_grok: bool = True) -> Dict[str, Any]:
        """
        Generate a detailed project outline using Grok.
        
        Args:
            project_description: Description of the project to build
            use_grok: Whether to use Grok model for generation
            
        Returns:
            Dict containing the generated outline and metadata
        """
        try:
            # Configure LLM to use Grok if requested
            if use_grok:
                original_model = self.interpreter.llm.model
                self.interpreter.llm.model = "grok-3-beta"
            
            # Create a detailed prompt for project outline generation
            outline_prompt = self._create_outline_prompt(project_description)
            
            # Generate the outline
            outline_response = ""
            for chunk in self.interpreter.llm.run([
                {"role": "system", "content": "You are an expert software architect and project planner."},
                {"role": "user", "content": outline_prompt}
            ]):
                if chunk.get("type") == "message":
                    outline_response += chunk.get("content", "")
            
            # Restore original model if changed
            if use_grok and 'original_model' in locals():
                self.interpreter.llm.model = original_model
            
            # Parse and structure the outline
            structured_outline = self._structure_outline(outline_response)
            
            return {
                "success": True,
                "raw_outline": outline_response,
                "structured_outline": structured_outline,
                "model_used": "grok-3-beta" if use_grok else self.interpreter.llm.model,
                "description": project_description
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": f"Failed to generate project outline: {e}"
            }
    
    def implement_project_with_cursor(self, outline_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Implement the project using Cursor based on the generated outline.
        
        Args:
            outline_data: The outline data from generate_project_outline
            
        Returns:
            Dict containing implementation results and status
        """
        try:
            if not outline_data.get("success"):
                return {
                    "success": False,
                    "message": "Cannot implement project: invalid outline data"
                }
            
            structured_outline = outline_data.get("structured_outline")
            if not structured_outline:
                return {
                    "success": False,
                    "message": "Cannot implement project: no structured outline found"
                }
            
            # Use Cursor client to generate the project
            result = self.cursor_client.generate_project_from_grok_outline(
                json.dumps(structured_outline, indent=2)
            )
            
            if result.get("success"):
                # Additional setup or configuration can be added here
                self._post_implementation_setup(result)
                
                return {
                    "success": True,
                    "project_path": result.get("project_path"),
                    "project_name": result.get("project_name"),
                    "message": "Project successfully created and opened in Cursor",
                    "outline_source": outline_data.get("model_used", "unknown")
                }
            else:
                return result
                
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": f"Failed to implement project with Cursor: {e}"
            }
    
    def run_complete_workflow(self, project_description: str, use_grok: bool = True) -> Dict[str, Any]:
        """
        Run the complete workflow: Grok outline generation + Cursor implementation.
        
        Args:
            project_description: Description of the project to build
            use_grok: Whether to use Grok for outline generation
            
        Returns:
            Dict containing complete workflow results
        """
        try:
            self.interpreter.display_message("🚀 Starting Grok-Cursor Workflow...")
            
            # Step 1: Generate outline with Grok
            self.interpreter.display_message("🤖 Generating project outline with Grok...")
            outline_result = self.generate_project_outline(project_description, use_grok)
            
            if not outline_result.get("success"):
                return outline_result
            
            self.interpreter.display_message("✅ Project outline generated successfully!")
            
            # Step 2: Implement with Cursor
            self.interpreter.display_message("⚡ Implementing project with Cursor...")
            implementation_result = self.implement_project_with_cursor(outline_result)
            
            if implementation_result.get("success"):
                self.interpreter.display_message("🎉 Project created and opened in Cursor!")
                
                return {
                    "success": True,
                    "workflow_complete": True,
                    "outline": outline_result,
                    "implementation": implementation_result,
                    "summary": {
                        "project_name": implementation_result.get("project_name"),
                        "project_path": implementation_result.get("project_path"),
                        "model_used": outline_result.get("model_used"),
                        "description": project_description
                    }
                }
            else:
                return implementation_result
                
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": f"Workflow failed: {e}"
            }
    
    def _create_outline_prompt(self, project_description: str) -> str:
        """Create a detailed prompt for project outline generation."""
        return f"""
Create a detailed, structured project outline for the following project:

{project_description}

Please provide a comprehensive outline that includes:

1. **Project Overview**
   - Project name (suitable for directory naming)
   - Brief description
   - Main objectives and goals
   - Target audience or use case

2. **Technical Architecture**
   - Technology stack recommendations
   - Key frameworks and libraries
   - Database requirements (if any)
   - Deployment considerations

3. **Project Structure**
   - Directory structure
   - Main files and their purposes
   - Configuration files needed
   - Asset directories

4. **Core Features**
   - List of main features to implement
   - Priority order (MVP vs. nice-to-have)
   - Feature descriptions and requirements

5. **Implementation Plan**
   - Development phases
   - Key milestones
   - Dependencies between components

6. **File Templates**
   - Basic file structures for main components
   - Configuration file templates
   - Documentation templates

Please format your response in a way that can be easily parsed and used to generate a complete project structure. 
Include specific file names, directory names, and basic content for key files.

Make the outline practical and implementable, focusing on creating a working foundation that can be extended.
"""
    
    def _structure_outline(self, raw_outline: str) -> Dict[str, Any]:
        """
        Structure the raw outline into a format suitable for project generation.
        
        Args:
            raw_outline: The raw outline text from Grok
            
        Returns:
            Structured project information
        """
        # This is a simplified parser - in practice, you might want more sophisticated parsing
        lines = raw_outline.strip().split('\n')
        
        project_info = {
            "name": "grok-cursor-project",
            "description": "Project generated by Grok-Cursor workflow",
            "directories": [],
            "files": {},
            "technology_stack": [],
            "features": [],
            "implementation_notes": []
        }
        
        current_section = None
        current_subsection = None
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            # Parse different sections
            if "project name" in line.lower() or line.startswith("# "):
                # Extract project name
                if ":" in line:
                    name = line.split(":", 1)[1].strip()
                else:
                    name = line.replace("#", "").strip()
                
                if name and len(name) < 50:  # Reasonable project name length
                    project_info["name"] = name.lower().replace(" ", "-").replace("_", "-")
            
            elif line.startswith("## ") or line.startswith("**") and line.endswith("**"):
                current_section = line.replace("##", "").replace("**", "").strip().lower()
            
            elif line.startswith("- ") or line.startswith("* "):
                item = line[2:].strip()
                
                # Categorize based on current section and content
                if current_section and "structure" in current_section:
                    if "/" in item and "." not in item:
                        project_info["directories"].append(item)
                    elif "." in item:
                        project_info["files"][item] = self._generate_file_template(item)
                
                elif current_section and "feature" in current_section:
                    project_info["features"].append(item)
                
                elif current_section and ("tech" in current_section or "stack" in current_section):
                    project_info["technology_stack"].append(item)
                
                else:
                    project_info["implementation_notes"].append(item)
        
        # Ensure we have some basic structure
        if not project_info["directories"]:
            project_info["directories"] = ["src", "tests", "docs"]
        
        if not project_info["files"]:
            project_info["files"] = {
                "README.md": self._generate_file_template("README.md"),
                "main.py": self._generate_file_template("main.py"),
                "requirements.txt": self._generate_file_template("requirements.txt")
            }
        
        return project_info
    
    def _generate_file_template(self, file_path: str) -> Dict[str, str]:
        """Generate a basic template for a file based on its extension."""
        ext = os.path.splitext(file_path)[1].lower()
        
        templates = {
            ".py": {
                "content": '"""Generated by Grok-Cursor Workflow"""\n\ndef main():\n    """Main function"""\n    pass\n\nif __name__ == "__main__":\n    main()\n',
                "description": "Python main module"
            },
            ".js": {
                "content": '// Generated by Grok-Cursor Workflow\n\nfunction main() {\n    // Implementation here\n}\n\nmain();\n',
                "description": "JavaScript main module"
            },
            ".html": {
                "content": '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Generated by Grok-Cursor</title>\n</head>\n<body>\n    <h1>Hello World</h1>\n</body>\n</html>\n',
                "description": "HTML template"
            },
            ".md": {
                "content": f'# {file_path.replace(".md", "").replace("_", " ").title()}\n\nGenerated by Grok-Cursor Workflow\n\n## Getting Started\n\nAdd your content here.\n',
                "description": "Markdown documentation"
            },
            ".txt": {
                "content": "# Generated by Grok-Cursor Workflow\n",
                "description": "Text file"
            }
        }
        
        return templates.get(ext, {
            "content": f"# Generated by Grok-Cursor Workflow\n# File: {file_path}\n",
            "description": f"Generated file: {file_path}"
        })
    
    def _post_implementation_setup(self, implementation_result: Dict[str, Any]) -> None:
        """Perform any post-implementation setup tasks."""
        try:
            project_path = implementation_result.get("project_path")
            if project_path and os.path.exists(project_path):
                # Create a workflow info file
                workflow_info = {
                    "generated_by": "Grok-Cursor Workflow",
                    "timestamp": str(time.time()),
                    "project_path": project_path,
                    "implementation_result": implementation_result
                }
                
                info_file = os.path.join(project_path, ".grok-cursor-workflow.json")
                with open(info_file, "w", encoding="utf-8") as f:
                    json.dump(workflow_info, f, indent=2)
                    
        except Exception as e:
            print(f"Warning: Could not create workflow info file: {e}")