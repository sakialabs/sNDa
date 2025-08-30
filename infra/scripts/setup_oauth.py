#!/usr/bin/env python3
"""
OAuth Setup Script for sNDa Platform
Place this in infra/scripts/
"""
import os
import subprocess
import sys
from pathlib import Path

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e.stderr}")
        return False

def main():
    """Main setup function"""
    print("🚀 sNDa OAuth Setup Script")
    print("=" * 40)
    
    # Change to backend directory
    backend_dir = Path(__file__).parent.parent.parent / "backend"
    os.chdir(backend_dir)
    
    print(f"📍 Working directory: {backend_dir}")
    
    # Run setup commands using pip (works with conda)
    commands = [
        ("pip install -r requirements.txt", "Installing Python dependencies"),
        ("python manage.py migrate", "Running database migrations"),
        ("python manage.py setup_oauth", "Setting up OAuth applications"),
    ]
    
    success = True
    for command, description in commands:
        if not run_command(command, description):
            success = False
            break
    
    if success:
        print("\n🎉 OAuth setup complete!")
        print("\n🚀 Next steps:")
        print("1. Configure OAuth providers (see docs)")
        print("2. Start backend: python manage.py runserver")
        print("3. Start frontend: cd ../frontend && npm run dev")
        print("4. Test at: http://localhost:3000")
    else:
        print("\n❌ Setup failed. Please check the errors above.")

if __name__ == "__main__":
    main()
