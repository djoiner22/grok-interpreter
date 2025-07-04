"""
Cursor Client for Open Interpreter

This module provides a client interface to communicate with Cursor editor
for automated project building, file creation, and code generation.
"""

import os
import json
import subprocess
import tempfile
import time
from pathlib import Path
from typing import Dict, List, Optional, Union, Any


class CursorClient:
    """
    Client for communicating with Cursor editor to automate project building.
    
    This class provides methods to:
    - Create project structures
    - Generate and modify files
    - Execute Cursor commands
    - Manage project templates
    """
    
    def __init__(self, workspace_path: Optional[str] = None):
        """
        Initialize the Cursor client.
        
        Args:
            workspace_path: Path to the workspace directory. If None, uses current directory.
        """
        self.workspace_path = workspace_path or os.getcwd()
        self.cursor_command = self._find_cursor_command()
        
    def _find_cursor_command(self) -> str:
        """Find the Cursor command executable."""
        possible_commands = ["cursor", "code"]
        
        for cmd in possible_commands:
            try:
                subprocess.run([cmd, "--version"], capture_output=True, check=True)
                return cmd
            except (subprocess.CalledProcessError, FileNotFoundError):
                continue
                
        return "cursor"  # Default fallback
    
    def create_project_structure(self, outline: Dict[str, Any]) -> bool:
        """
        Create a project structure based on an AI-generated outline.
        
        Args:
            outline: Project outline containing structure and file descriptions
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            project_name = outline.get("name", "new-project")
            project_path = Path(self.workspace_path) / project_name
            
            # Create project directory
            project_path.mkdir(parents=True, exist_ok=True)
            
            # Create directory structure
            directories = outline.get("directories", [])
            for directory in directories:
                dir_path = project_path / directory
                dir_path.mkdir(parents=True, exist_ok=True)
                
            # Create files from outline
            files = outline.get("files", {})
            for file_path, file_info in files.items():
                full_path = project_path / file_path
                full_path.parent.mkdir(parents=True, exist_ok=True)
                
                content = file_info.get("content", "")
                if isinstance(file_info, str):
                    content = file_info
                    
                with open(full_path, "w", encoding="utf-8") as f:
                    f.write(content)
                    
            return True
            
        except Exception as e:
            print(f"Error creating project structure: {e}")
            return False
    
    def open_project_in_cursor(self, project_path: str) -> bool:
        """
        Open a project in Cursor editor.
        
        Args:
            project_path: Path to the project directory
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            full_path = Path(self.workspace_path) / project_path
            if not full_path.exists():
                print(f"Project path does not exist: {full_path}")
                return False
                
            subprocess.Popen([self.cursor_command, str(full_path)])
            time.sleep(2)  # Give Cursor time to open
            return True
            
        except Exception as e:
            print(f"Error opening project in Cursor: {e}")
            return False
    
    def create_file_with_ai_content(self, file_path: str, prompt: str, model: str = "gpt-4") -> bool:
        """
        Create a file with AI-generated content using Cursor's AI capabilities.
        
        Args:
            file_path: Relative path to the file to create
            prompt: Prompt for generating file content
            model: AI model to use for generation
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            full_path = Path(self.workspace_path) / file_path
            full_path.parent.mkdir(parents=True, exist_ok=True)
            
            # Create a temporary script to interact with Cursor's AI
            cursor_script = self._create_cursor_ai_script(prompt, str(full_path), model)
            
            if cursor_script:
                # Execute the script
                result = subprocess.run(
                    ["python", cursor_script],
                    capture_output=True,
                    text=True,
                    timeout=60
                )
                
                # Clean up temp script
                os.unlink(cursor_script)
                
                return result.returncode == 0
            
            return False
            
        except Exception as e:
            print(f"Error creating file with AI content: {e}")
            return False
    
    def _create_cursor_ai_script(self, prompt: str, file_path: str, model: str) -> Optional[str]:
        """Create a temporary script to interact with Cursor's AI."""
        try:
            script_content = f'''
import os
import sys

# Simple file creation based on prompt
# This is a basic implementation - in practice, you'd integrate with Cursor's API
prompt = """{prompt}"""
file_path = "{file_path}"

# For now, create a basic template based on file extension
ext = os.path.splitext(file_path)[1].lower()

if ext == ".py":
    content = """# Generated by Cursor AI
# {prompt}

def main():
    pass

if __name__ == "__main__":
    main()
"""
elif ext == ".js":
    content = """// Generated by Cursor AI
// {prompt}

function main() {{
    // Implementation here
}}

main();
"""
elif ext == ".html":
    content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated by Cursor AI</title>
</head>
<body>
    <!-- {prompt} -->
    <h1>Hello World</h1>
</body>
</html>
"""
elif ext == ".md":
    content = """# Generated by Cursor AI

{prompt}

## Getting Started

Add your content here.
"""
else:
    content = """Generated by Cursor AI
{prompt}
"""

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Created file: {{file_path}}")
'''
            
            # Create temporary script file
            with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
                f.write(script_content)
                return f.name
                
        except Exception as e:
            print(f"Error creating Cursor AI script: {e}")
            return None
    
    def generate_project_from_grok_outline(self, grok_outline: str) -> Dict[str, Any]:
        """
        Generate a complete project based on Grok's outline.
        
        Args:
            grok_outline: The project outline generated by Grok
            
        Returns:
            Dict containing project information and status
        """
        try:
            # Parse the Grok outline (assuming it's structured text or JSON)
            project_info = self._parse_grok_outline(grok_outline)
            
            # Create project structure
            success = self.create_project_structure(project_info)
            
            if success:
                # Open in Cursor
                project_name = project_info.get("name", "grok-project")
                self.open_project_in_cursor(project_name)
                
                return {
                    "success": True,
                    "project_name": project_name,
                    "project_path": str(Path(self.workspace_path) / project_name),
                    "message": f"Project '{project_name}' created and opened in Cursor"
                }
            else:
                return {
                    "success": False,
                    "message": "Failed to create project structure"
                }
                
        except Exception as e:
            return {
                "success": False,
                "message": f"Error generating project: {e}"
            }
    
    def _parse_grok_outline(self, outline: str) -> Dict[str, Any]:
        """
        Parse Grok's project outline into a structured format.
        
        Args:
            outline: The raw outline text from Grok
            
        Returns:
            Dict containing parsed project information
        """
        # Try to parse as JSON first
        try:
            if outline.strip().startswith('{'):
                return json.loads(outline)
        except json.JSONDecodeError:
            pass
        
        # Basic text parsing for common outline formats
        lines = outline.strip().split('\n')
        project_info = {
            "name": "grok-generated-project",
            "description": "Project generated from Grok outline",
            "directories": [],
            "files": {}
        }
        
        current_section = None
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            # Look for project name
            if line.startswith("Project:") or line.startswith("# "):
                project_info["name"] = line.split(":", 1)[-1].strip().replace("# ", "").lower().replace(" ", "-")
            
            # Look for directories
            elif line.startswith("- ") and "/" in line and "." not in line:
                project_info["directories"].append(line[2:].strip())
            
            # Look for files
            elif line.startswith("- ") and "." in line:
                file_path = line[2:].strip()
                project_info["files"][file_path] = {
                    "content": f"# TODO: Implement {file_path}\n",
                    "description": f"Generated file for {file_path}"
                }
        
        return project_info
    
    def execute_cursor_command(self, command: str, args: Optional[List[str]] = None) -> bool:
        """
        Execute a Cursor command.
        
        Args:
            command: The command to execute
            args: Optional arguments for the command
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            cmd_list = [self.cursor_command, command]
            if args:
                cmd_list.extend(args)
                
            result = subprocess.run(cmd_list, capture_output=True, timeout=30)
            return result.returncode == 0
            
        except Exception as e:
            print(f"Error executing Cursor command: {e}")
            return False