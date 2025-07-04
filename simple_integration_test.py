#!/usr/bin/env python3
"""
Simple integration test for Grok-Cursor features

This test checks the basic code structure without requiring all dependencies.
"""

import os
import sys
from pathlib import Path

def test_file_structure():
    """Test that all the integration files exist."""
    print("🧪 Testing file structure...")
    
    required_files = [
        "interpreter/core/cursor/__init__.py",
        "interpreter/core/cursor/cursor_client.py", 
        "interpreter/core/grok_cursor_workflow.py",
        "GROK_CURSOR_INTEGRATION.md"
    ]
    
    missing_files = []
    
    for file_path in required_files:
        if not Path(file_path).exists():
            missing_files.append(file_path)
        else:
            print(f"✅ Found: {file_path}")
    
    if missing_files:
        print(f"❌ Missing files: {missing_files}")
        return False
    else:
        print("✅ All required files exist!")
        return True

def test_imports():
    """Test that imports work correctly."""
    print("🧪 Testing imports...")
    
    try:
        # Test individual module imports
        sys.path.insert(0, str(Path(__file__).parent))
        
        # Test CursorClient import
        from interpreter.core.cursor.cursor_client import CursorClient
        print("✅ CursorClient import successful")
        
        # Test GrokCursorWorkflow import (without interpreter dependency)
        import interpreter.core.grok_cursor_workflow as workflow_module
        print("✅ Workflow module import successful")
        
        return True
        
    except ImportError as e:
        print(f"❌ Import test failed: {e}")
        return False

def test_class_structure():
    """Test that classes have the expected methods."""
    print("🧪 Testing class structure...")
    
    try:
        from interpreter.core.cursor.cursor_client import CursorClient
        
        # Check CursorClient methods
        expected_methods = [
            'create_project_structure',
            'open_project_in_cursor',
            'create_file_with_ai_content',
            'generate_project_from_grok_outline',
            'execute_cursor_command'
        ]
        
        for method in expected_methods:
            if hasattr(CursorClient, method):
                print(f"✅ CursorClient has method: {method}")
            else:
                print(f"❌ CursorClient missing method: {method}")
                return False
        
        # Test instantiation
        client = CursorClient("/tmp")
        print("✅ CursorClient instantiation successful")
        
        return True
        
    except Exception as e:
        print(f"❌ Class structure test failed: {e}")
        return False

def test_workflow_methods():
    """Test workflow class methods."""
    print("🧪 Testing workflow methods...")
    
    try:
        from interpreter.core.grok_cursor_workflow import GrokCursorWorkflow
        
        expected_methods = [
            'generate_project_outline',
            'implement_project_with_cursor', 
            'run_complete_workflow',
            '_create_outline_prompt',
            '_structure_outline',
            '_generate_file_template'
        ]
        
        for method in expected_methods:
            if hasattr(GrokCursorWorkflow, method):
                print(f"✅ GrokCursorWorkflow has method: {method}")
            else:
                print(f"❌ GrokCursorWorkflow missing method: {method}")
                return False
        
        print("✅ Workflow methods check passed!")
        return True
        
    except Exception as e:
        print(f"❌ Workflow methods test failed: {e}")
        return False

def test_code_modification():
    """Test that core.py was modified correctly."""
    print("🧪 Testing core.py modifications...")
    
    try:
        core_file = Path("interpreter/core/core.py")
        if not core_file.exists():
            print("❌ core.py not found")
            return False
        
        content = core_file.read_text()
        
        # Check for Grok-Cursor integration
        required_patterns = [
            "from .grok_cursor_workflow import GrokCursorWorkflow",
            "def create_project_with_grok",
            "def generate_outline_with_grok",
            "def implement_with_cursor",
            "self.grok_cursor_workflow"
        ]
        
        missing_patterns = []
        for pattern in required_patterns:
            if pattern in content:
                print(f"✅ Found pattern: {pattern}")
            else:
                missing_patterns.append(pattern)
        
        if missing_patterns:
            print(f"❌ Missing patterns: {missing_patterns}")
            return False
        else:
            print("✅ core.py modifications verified!")
            return True
            
    except Exception as e:
        print(f"❌ Core.py test failed: {e}")
        return False

def test_llm_modification():
    """Test that LLM was modified for Grok support."""
    print("🧪 Testing LLM Grok integration...")
    
    try:
        llm_file = Path("interpreter/core/llm/llm.py")
        if not llm_file.exists():
            print("❌ llm.py not found")
            return False
        
        content = llm_file.read_text()
        
        # Check for Grok model mappings
        grok_patterns = [
            "grok-beta",
            "grok-3-beta",
            "x-ai/grok",
            "Add Grok model mappings"
        ]
        
        found_patterns = []
        for pattern in grok_patterns:
            if pattern in content:
                found_patterns.append(pattern)
        
        if len(found_patterns) >= 2:  # Should find at least some Grok patterns
            print(f"✅ Found Grok patterns: {found_patterns}")
            print("✅ LLM Grok integration verified!")
            return True
        else:
            print(f"❌ Insufficient Grok patterns found: {found_patterns}")
            return False
            
    except Exception as e:
        print(f"❌ LLM modification test failed: {e}")
        return False

def test_terminal_interface():
    """Test terminal interface modifications."""
    print("🧪 Testing terminal interface modifications...")
    
    try:
        terminal_file = Path("interpreter/terminal_interface/start_terminal_interface.py")
        if not terminal_file.exists():
            print("❌ start_terminal_interface.py not found")
            return False
        
        content = terminal_file.read_text()
        
        # Check for new command line arguments
        cli_patterns = [
            "grok_project",
            "grok_outline", 
            "use_grok",
            "workspace_path",
            "Grok-Cursor Workflow"
        ]
        
        found_patterns = []
        for pattern in cli_patterns:
            if pattern in content:
                found_patterns.append(pattern)
        
        if len(found_patterns) >= 4:  # Should find most patterns
            print(f"✅ Found CLI patterns: {found_patterns}")
            print("✅ Terminal interface modifications verified!")
            return True
        else:
            print(f"❌ Insufficient CLI patterns found: {found_patterns}")
            return False
            
    except Exception as e:
        print(f"❌ Terminal interface test failed: {e}")
        return False

def run_simple_tests():
    """Run all simple integration tests."""
    print("🚀 Starting Simple Grok-Cursor Integration Tests\n")
    
    tests = [
        ("File Structure", test_file_structure),
        ("Basic Imports", test_imports),
        ("Class Structure", test_class_structure),
        ("Workflow Methods", test_workflow_methods),
        ("Core.py Modifications", test_code_modification),
        ("LLM Grok Integration", test_llm_modification),
        ("Terminal Interface", test_terminal_interface),
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
        print("🎉 All tests passed! Grok-Cursor integration is properly implemented.")
        return True
    else:
        print("⚠️  Some tests failed. Check the output above for details.")
        return False

if __name__ == "__main__":
    success = run_simple_tests()
    sys.exit(0 if success else 1)