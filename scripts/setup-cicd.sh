#!/bin/bash

# Chrome Extension CI/CD Setup Script
# This script helps you set up the necessary secrets for Chrome Web Store deployment

echo "🚀 Chrome Extension CI/CD Setup"
echo "================================"
echo ""

echo "This script will help you set up GitHub Secrets for Chrome Web Store deployment."
echo "You'll need to obtain API credentials from the Chrome Web Store Developer Dashboard."
echo ""

echo "📋 Required Secrets:"
echo "1. CHROME_CLIENT_ID"
echo "2. CHROME_CLIENT_SECRET" 
echo "3. CHROME_REFRESH_TOKEN"
echo "4. CHROME_EXTENSION_ID"
echo ""

echo "🔗 How to get these credentials:"
echo ""

echo "1. CHROME_EXTENSION_ID:"
echo "   - Go to Chrome Web Store Developer Dashboard"
echo "   - Find your extension"
echo "   - Copy the ID from the URL (32-character string)"
echo ""

echo "2. API Credentials (CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN):"
echo "   - Go to Google Cloud Console: https://console.cloud.google.com/"
echo "   - Create a new project or select existing one"
echo "   - Enable Chrome Web Store API"
echo "   - Create OAuth 2.0 credentials"
echo "   - Add https://developers.google.com/oauthplayground to redirect URIs"
echo "   - Go to OAuth Playground: https://developers.google.com/oauthplayground"
echo "   - Use your credentials to get refresh token"
echo ""

echo "3. Add secrets to GitHub:"
echo "   - Go to your repository on GitHub"
echo "   - Settings > Secrets and variables > Actions"
echo "   - Click 'New repository secret'"
echo "   - Add each secret with the exact names above"
echo ""

echo "📚 Detailed Guide:"
echo "https://github.com/fregante/chrome-webstore-upload/blob/main/How%20to%20generate%20API%20keys.md"
echo ""

echo "✅ Workflow Features:"
echo "- Automatic testing on PRs"
echo "- Version management"
echo "- Draft deployment on main branch"
echo "- Production deployment on tags"
echo "- Manual release creation"
echo "- Artifact storage"
echo ""

echo "🎯 Usage:"
echo "1. Push to main branch → Draft deployment"
echo "2. Create release via workflow → Production deployment"
echo "3. Manual workflow dispatch for custom deployments"
echo ""

read -p "Press Enter to continue..."
