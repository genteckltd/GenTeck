#!/bin/bash

# GenTeck Website Development Server Setup
# This script sets up the development environment

echo "🚀 Setting up GenTeck Website Development Environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create dist directory if it doesn't exist
if [ ! -d "dist" ]; then
    mkdir -p dist/css
    mkdir -p dist/js
    mkdir -p dist/images
    echo "✅ Created dist directory structure"
fi

# Build CSS
echo "🎨 Building CSS..."
npm run build:css

# Start development server
echo "🌐 Starting development server..."
echo "📱 Your website will be available at: http://localhost:3000"
echo "🔄 The server will automatically reload when you make changes"
echo ""
echo "Press Ctrl+C to stop the server"

npm run dev
