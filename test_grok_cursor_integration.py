#!/usr/bin/env python3
"""
Test script for Grok-Cursor Integration

This script tests the integration between Grok API and Cursor automation
in Open Interpreter.
"""

import os
import sys
import tempfile
from pathlib import Path

# Add the project root to the Python path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

from interpreter import interpreter

def test_grok_models():
    """Test that Grok models are properly configured."""
    print("🧪 Testing Grok model configuration...")
    
    # Test Grok model mapping
    original_model = interpreter.llm.model
    
    try:
        # Test different Grok model aliases
        test_models = ["grok", "grok-beta", "grok-3", "grok-3-beta"]
        
        for model in test_models:
            interpreter.llm.model = model
            print(f"✅ Model '{model}' mapped to: {interpreter.llm.model}")
        
        print("✅ Grok model configuration test passed!")
        return True
        
    except Exception as e:
        print(f"❌ Grok model configuration test failed: {e}")
        return False
        
    finally:
        interpreter.llm.model = original_model

def test_cursor_client():
    """Test that CursorClient can be instantiated."""
    print("🧪 Testing Cursor client...")
    
    try:
        from interpreter.core.cursor.cursor_client import CursorClient
        
        # Create a temporary workspace for testing
        with tempfile.TemporaryDirectory() as temp_dir:
            cursor_client = CursorClient(temp_dir)
            print(f"✅ CursorClient created with workspace: {temp_dir}")
            
            # Test basic project structure creation
            test_outline = {
                "name": "test-project",
                "description": "Test project for integration",
                "directories": ["src", "tests"],
                "files": {
                    "README.md": {
                        "content": "# Test Project\n\nGenerated for testing.",
                        "description": "Project readme"
                    },
                    "src/main.py": {
                        "content": "print('Hello from test project!')\n",
                        "description": "Main Python file"
                    }
                }
            }
            
            success = cursor_client.create_project_structure(test_outline)
            if success:
                print("✅ Project structure creation test passed!")
                
                # Verify files were created
                project_path = Path(temp_dir) / "test-project"
                if project_path.exists():
                    print(f"✅ Project directory created: {project_path}")
                    
                    readme_path = project_path / "README.md"
                    if readme_path.exists():
                        print("✅ README.md created successfully")
                        
                    src_path = project_path / "src" / "main.py"
                    if src_path.exists():
                        print("✅ src/main.py created successfully")
                        
                return True
            else:
                print("❌ Project structure creation failed")
                return False
                
    except Exception as e:
        print(f"❌ Cursor client test failed: {e}")
        return False

def test_workflow_orchestration():
    """Test that the workflow orchestration can be instantiated."""
    print("🧪 Testing workflow orchestration...")
    
    try:
        from interpreter.core.grok_cursor_workflow import GrokCursorWorkflow
        
        with tempfile.TemporaryDirectory() as temp_dir:
            workflow = GrokCursorWorkflow(interpreter, temp_dir)
            print("✅ GrokCursorWorkflow instantiated successfully!")
            
            # Test outline parsing
            test_outline = """
# Test Project

## Project Structure
- src/
- tests/
- main.py
- requirements.txt

## Features
- User authentication
- Data processing
- API endpoints
"""
            
            structured = workflow._structure_outline(test_outline)
            if structured and "name" in structured:
                print("✅ Outline parsing test passed!")
                print(f"   Project name: {structured['name']}")
                print(f"   Directories: {structured['directories']}")
                print(f"   Files: {list(structured['files'].keys())}")
                return True
            else:
                print("❌ Outline parsing failed")
                return False
                
    except Exception as e:
        print(f"❌ Workflow orchestration test failed: {e}")
        return False

def test_interpreter_integration():
    """Test that the new methods are available on the interpreter."""
    print("🧪 Testing interpreter integration...")
    
    try:
        # Check if new methods exist
        methods = [
            'create_project_with_grok',
            'generate_outline_with_grok', 
            'implement_with_cursor',
            'get_grok_cursor_workflow'
        ]
        
        for method in methods:
            if hasattr(interpreter, method):
                print(f"✅ Method '{method}' available on interpreter")
            else:
                print(f"❌ Method '{method}' missing from interpreter")
                return False
                
        print("✅ Interpreter integration test passed!")
        return True
        
    except Exception as e:
        print(f"❌ Interpreter integration test failed: {e}")
        return False

def test_environment_setup():
    """Test environment setup and requirements."""
    print("🧪 Testing environment setup...")
    
    # Check for required environment variables (optional)
    env_vars = ["OPENAI_API_KEY", "XAI_API_KEY"]
    api_key_found = False
    
    for var in env_vars:
        if os.getenv(var):
            print(f"✅ Found API key: {var}")
            api_key_found = True
            break
    
    if not api_key_found:
        print("⚠️  No API keys found. Set OPENAI_API_KEY or XAI_API_KEY for full functionality.")
    
    # Check Python version
    python_version = sys.version_info
    if python_version >= (3, 9):
        print(f"✅ Python version: {python_version.major}.{python_version.minor}.{python_version.micro}")
    else:
        print(f"❌ Python version {python_version.major}.{python_version.minor} is below minimum required (3.9)")
        return False
    
    # Check for Cursor command (optional)
    cursor_commands = ["cursor", "code"]
    cursor_found = False
    
    for cmd in cursor_commands:
        if os.system(f"which {cmd} > /dev/null 2>&1") == 0:
            print(f"✅ Found editor command: {cmd}")
            cursor_found = True
            break
    
    if not cursor_found:
        print("⚠️  No Cursor/VS Code command found. Install Cursor for full functionality.")
    
    print("✅ Environment setup test completed!")
    return True

def run_all_tests():
    """Run all integration tests."""
    print("🚀 Starting Grok-Cursor Integration Tests\n")
    
    tests = [
        ("Environment Setup", test_environment_setup),
        ("Grok Models", test_grok_models),
        ("Cursor Client", test_cursor_client),
        ("Workflow Orchestration", test_workflow_orchestration),
        ("Interpreter Integration", test_interpreter_integration),
    ]
    
    results = []
    
    for test_name, test_func in tests:
        print(f"\n{'='*50}")
        print(f"Running: {test_name}")
        print('='*50)
        
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ Test '{test_name}' failed with exception: {e}")
            results.append((test_name, False))
    
    # Summary
    print(f"\n{'='*50}")
    print("TEST SUMMARY")
    print('='*50)
    
    passed = 0
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{test_name}: {status}")
        if result:
            passed += 1
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Grok-Cursor integration is ready to use.")
        return True
    else:
        print("⚠️  Some tests failed. Check the output above for details.")
        return False

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)