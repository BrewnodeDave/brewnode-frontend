#!/bin/bash

# Brewnode Frontend - Remote Repository Setup
# This script helps set up a remote git repository for the frontend

echo "🍺 Brewnode Frontend Git Repository Setup"
echo "========================================="
echo ""

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

echo "Current repository status:"
git status --short
echo ""

echo "📋 Remote Repository Options:"
echo ""
echo "1. GitHub (github.com)"
echo "   - Create a new repository at: https://github.com/new"
echo "   - Repository name: brewnode-frontend"
echo "   - Then run:"
echo "     git remote add origin https://github.com/USERNAME/brewnode-frontend.git"
echo "     git branch -M main"  
echo "     git push -u origin main"
echo ""

echo "2. GitLab (gitlab.com)"
echo "   - Create a new repository at: https://gitlab.com/projects/new"
echo "   - Repository name: brewnode-frontend"
echo "   - Then run:"
echo "     git remote add origin https://gitlab.com/USERNAME/brewnode-frontend.git"
echo "     git branch -M main"
echo "     git push -u origin main"
echo ""

echo "3. Custom Git Server"
echo "   - Set up your own git server or use existing one"
echo "   - Then run:"
echo "     git remote add origin YOUR_GIT_SERVER_URL"
echo "     git push -u origin main"
echo ""

echo "📁 Repository Information:"
echo "- Total files: $(git ls-files | wc -l)"
echo "- Repository size: $(du -sh .git | cut -f1)"
echo "- Initial commit: $(git log --oneline | tail -1)"
echo ""

echo "✅ Local git repository is ready!"
echo "Choose one of the options above to add a remote repository."