#!/usr/bin/env python3
"""
Setup verification script for Gemini Veo Sketch2Video application.
Run this script to check if your environment is configured correctly.
"""

import os
import sys
from dotenv import load_dotenv

def check_environment_variables():
    """Check if all required environment variables are set."""
    print("🔍 Checking environment variables...")
    
    load_dotenv('.env')
    
    required_vars = {
        'GOOGLE_API_KEY': 'Google API Key for Gemini',
        'PROJECT_ID': 'Google Cloud Project ID',
        'GCS_BUCKET_NAME': 'Google Cloud Storage Bucket Name',
        'GOOGLE_CLOUD_REGION': 'Google Cloud Region (optional, defaults to us-central1)'
    }
    
    missing_vars = []
    
    for var, description in required_vars.items():
        value = os.environ.get(var)
        if value:
            # Mask sensitive values
            if 'KEY' in var:
                display_value = f"{value[:8]}...{value[-4:]}" if len(value) > 12 else "***"
            else:
                display_value = value
            print(f"✅ {var}: {display_value}")
        else:
            print(f"❌ {var}: NOT SET ({description})")
            missing_vars.append(var)
    
    if missing_vars:
        print(f"\n❌ Missing environment variables: {', '.join(missing_vars)}")
        return False
    else:
        print("✅ All environment variables are set!")
        return True

def check_dependencies():
    """Check if all required Python packages are installed."""
    print("\n🔍 Checking Python dependencies...")
    
    required_packages = [
        'flask',
        'google.genai',
        'google.cloud.storage',
        'dotenv',
        'PIL',
        'requests'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            if package == 'google.genai':
                from google import genai
            elif package == 'google.cloud.storage':
                from google.cloud import storage
            elif package == 'dotenv':
                from dotenv import load_dotenv
            elif package == 'PIL':
                import PIL
            else:
                __import__(package)
            print(f"✅ {package}: Installed")
        except ImportError:
            print(f"❌ {package}: NOT INSTALLED")
            missing_packages.append(package)
    
    if missing_packages:
        print(f"\n❌ Missing packages: {', '.join(missing_packages)}")
        print("💡 Run: pip install -r requirements.txt")
        return False
    else:
        print("✅ All dependencies are installed!")
        return True

def check_google_cloud_connectivity():
    """Test Google Cloud connectivity."""
    print("\n🔍 Testing Google Cloud connectivity...")
    
    try:
        from google import genai
        from google.cloud import storage
        
        # Test API Key
        api_key = os.environ.get('GOOGLE_API_KEY')
        if api_key:
            try:
                client = genai.Client(api_key=api_key)
                print("✅ Google API Key authentication: SUCCESS")
            except Exception as e:
                print(f"❌ Google API Key authentication: FAILED ({e})")
                return False
        
        # Test Google Cloud Storage
        project_id = os.environ.get('PROJECT_ID')
        bucket_name = os.environ.get('GCS_BUCKET_NAME')
        
        if project_id and bucket_name:
            try:
                storage_client = storage.Client(project=project_id)
                bucket = storage_client.bucket(bucket_name)
                
                # Check if bucket exists
                if bucket.exists():
                    print(f"✅ GCS Bucket '{bucket_name}': EXISTS and ACCESSIBLE")
                else:
                    print(f"❌ GCS Bucket '{bucket_name}': NOT FOUND")
                    return False
            except Exception as e:
                print(f"❌ GCS connectivity: FAILED ({e})")
                print("💡 Make sure you have proper authentication set up")
                return False
        
        return True
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        return False

def check_file_structure():
    """Check if required files and directories exist."""
    print("\n🔍 Checking file structure...")
    
    required_files = [
        'app.py',
        'requirements.txt',
        'templates/index.html',
        'static/style.css',
        'static/script.js'
    ]
    
    missing_files = []
    
    for file_path in required_files:
        if os.path.exists(file_path):
            print(f"✅ {file_path}: EXISTS")
        else:
            print(f"❌ {file_path}: MISSING")
            missing_files.append(file_path)
    
    # Check if static/generated_images directory exists or can be created
    static_dir = 'static/generated_images'
    try:
        os.makedirs(static_dir, exist_ok=True)
        print(f"✅ {static_dir}: EXISTS/CREATED")
    except Exception as e:
        print(f"❌ {static_dir}: CANNOT CREATE ({e})")
        missing_files.append(static_dir)
    
    if missing_files:
        print(f"\n❌ Missing files/directories: {', '.join(missing_files)}")
        return False
    else:
        print("✅ All required files exist!")
        return True

def main():
    """Run all checks."""
    print("🚀 Gemini Veo Sketch2Video Setup Verification")
    print("=" * 50)
    
    checks = [
        ("Environment Variables", check_environment_variables),
        ("Python Dependencies", check_dependencies),
        ("File Structure", check_file_structure),
        ("Google Cloud Connectivity", check_google_cloud_connectivity),
    ]
    
    all_passed = True
    
    for check_name, check_function in checks:
        try:
            result = check_function()
            if not result:
                all_passed = False
        except Exception as e:
            print(f"❌ {check_name}: ERROR ({e})")
            all_passed = False
    
    print("\n" + "=" * 50)
    if all_passed:
        print("🎉 ALL CHECKS PASSED! Your setup is ready.")
        print("💡 You can now run: python app.py")
    else:
        print("❌ SOME CHECKS FAILED. Please fix the issues above.")
        print("💡 Check the README.md for detailed setup instructions.")
        sys.exit(1)

if __name__ == "__main__":
    main() 