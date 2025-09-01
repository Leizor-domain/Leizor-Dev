#!/bin/bash

# 🚀 leizor Dev Portfolio Deployment Script
# This script helps deploy your transformed portfolio to GitHub

echo "🚀 Starting deployment of leizor Dev Portfolio..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing git repository..."
    git init
    git remote add origin https://github.com/Leizor-domain/Leizor-Dev.git
fi

# Add all files
echo "📦 Adding files to git..."
git add .

# Commit with descriptive message
echo "💾 Committing changes..."
git commit -m "🎨 Complete portfolio transformation: Sophisticated enterprise design

✨ What's New:
- Premium minimalist luxury aesthetic
- Advanced micro-interactions and animations
- Professional enterprise positioning
- Glassmorphism effects and sophisticated typography
- Enhanced user experience and performance
- Responsive design across all devices

🔧 Technical Improvements:
- Modern CSS with custom animations
- Intersection Observer for scroll effects
- Professional form validation
- Optimized performance and accessibility
- Cross-browser compatibility

🎯 Design Philosophy:
- From 'template-like' to 'enterprise-grade'
- Sophisticated color palette and typography
- Premium spacing and visual hierarchy
- Professional animations and interactions"

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push origin main

echo "✅ Deployment complete!"
echo ""
echo "🌐 Your portfolio is now live at:"
echo "   https://leizor-domain.github.io/Leizor-Dev/"
echo ""
echo "📱 To enable GitHub Pages:"
echo "   1. Go to repository Settings → Pages"
echo "   2. Select source branch: main"
echo "   3. Save and wait for deployment"
echo ""
echo "🎉 Your sophisticated portfolio is ready to impress clients!"
