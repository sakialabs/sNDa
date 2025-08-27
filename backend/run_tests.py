#!/usr/bin/env python
"""
sNDa Backend API Test Runner

This script provides convenient commands for running the comprehensive test suite.
"""

import os
import sys
import subprocess
from pathlib import Path

def run_command(cmd, description):
    """Run a command and handle errors gracefully."""
    print(f"\n🔄 {description}")
    print(f"Running: {cmd}")
    print("-" * 50)
    
    result = subprocess.run(cmd, shell=True, capture_output=False)
    
    if result.returncode == 0:
        print(f"✅ {description} - PASSED")
    else:
        print(f"❌ {description} - FAILED")
        return False
    return True

def main():
    """Main test runner with different options."""
    
    # Ensure we're in the backend directory
    if not Path("manage.py").exists():
        print("❌ Please run this script from the backend directory")
        sys.exit(1)
    
    if len(sys.argv) < 2:
        print("""
🧪 sNDa Backend Test Runner

Usage:
    python run_tests.py <command>

Commands:
    all         - Run all tests with coverage
    quick       - Run all tests without coverage  
    auth        - Test authentication endpoints
    crud        - Test CRUD operations (cases, people, volunteers)
    uploads     - Test file upload functionality
    dashboard   - Test analytics and dashboard
    ai          - Test Boba AI features
    public      - Test public APIs
    health      - Test health check endpoint
    coverage    - Generate HTML coverage report
    
Examples:
    python run_tests.py all
    python run_tests.py quick
    python run_tests.py crud
        """)
        sys.exit(1)
    
    command = sys.argv[1].lower()
    
    # Test commands mapping
    commands = {
        'all': 'python -m pytest --cov=api --cov=users --cov-report=term-missing --cov-report=html',
        'quick': 'python -m pytest --no-cov -q',
        'auth': 'python -m pytest api/tests/test_auth_and_health.py users/test_me.py -v --no-cov',
        'crud': 'python -m pytest api/tests/test_cases.py api/tests/test_people.py api/tests/test_volunteers.py -v --no-cov',
        'uploads': 'python -m pytest api/tests/test_media.py -v --no-cov',
        'dashboard': 'python -m pytest api/tests/test_dashboard.py api/tests/test_community.py -v --no-cov',
        'ai': 'python -m pytest api/tests/test_boba.py -v --no-cov',
        'public': 'python -m pytest api/tests/test_public_stories.py api/tests/test_intake.py -v --no-cov',
        'health': 'python -m pytest api/tests/test_auth_and_health.py::test_health -v --no-cov',
        'coverage': 'python -m pytest --cov=api --cov=users --cov-report=html --cov-report=term',
    }
    
    if command not in commands:
        print(f"❌ Unknown command: {command}")
        print("Run 'python run_tests.py' to see available commands")
        sys.exit(1)
    
    # Run the selected test command
    success = run_command(commands[command], f"Running {command} tests")
    
    if command in ['all', 'coverage']:
        print(f"\n📊 Coverage report generated in: htmlcov/index.html")
    
    if success:
        print(f"\n🎉 All {command} tests completed successfully!")
        if command == 'all':
            print("\n📋 Full test report available in: API_TEST_REPORT.md")
    else:
        print(f"\n💥 Some {command} tests failed. Check the output above.")
        sys.exit(1)

if __name__ == "__main__":
    main()