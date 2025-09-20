#!/bin/bash

# GenTeck Website Build Script
# This script builds the production-ready version of the website

echo "🏗️  Building GenTeck Website for Production..."

# Create dist directory
rm -rf dist
mkdir -p dist/{css,js,images,fonts}

echo "📁 Created distribution directory structure"

# Copy HTML files
cp index.html dist/
echo "✅ Copied HTML files"

# Build and minify CSS
echo "🎨 Building and minifying CSS..."
npx tailwindcss -i ./assets/css/main.css -o ./dist/css/main.min.css --minify

# Minify JavaScript
echo "📜 Minifying JavaScript..."
npx terser ./assets/js/main.js -o ./dist/js/main.min.js --compress --mangle
npx terser ./assets/js/tailwind-config.js -o ./dist/js/tailwind-config.min.js --compress --mangle

# Optimize images
echo "🖼️  Optimizing images..."
if [ -d "assets/images" ]; then
    cp -r assets/images/* dist/images/ 2>/dev/null || echo "No images to copy"
fi

# Copy fonts
if [ -d "assets/fonts" ]; then
    cp -r assets/fonts/* dist/fonts/ 2>/dev/null || echo "No fonts to copy"
fi

# Update HTML to use minified assets
echo "🔄 Updating HTML to use minified assets..."
sed -i.bak 's|./assets/css/main.css|./css/main.min.css|g' dist/index.html
sed -i.bak 's|./assets/js/main.js|./js/main.min.js|g' dist/index.html
sed -i.bak 's|./assets/js/tailwind-config.js|./js/tailwind-config.min.js|g' dist/index.html
rm dist/index.html.bak

# Create a simple server file for testing
cat > dist/server.js << 'EOF'
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    if (filePath === './') filePath = './index.html';
    
    const extname = path.extname(filePath);
    let contentType = 'text/html';
    
    switch (extname) {
        case '.css': contentType = 'text/css'; break;
        case '.js': contentType = 'text/javascript'; break;
        case '.png': contentType = 'image/png'; break;
        case '.jpg': contentType = 'image/jpg'; break;
        case '.gif': contentType = 'image/gif'; break;
    }
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            res.writeHead(404);
            res.end('File not found');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Production server running at http://localhost:${PORT}`);
});
EOF

echo "✅ Build completed successfully!"
echo "📁 Production files are in the 'dist' directory"
echo "🌐 To test the production build, run: cd dist && node server.js"
echo "📦 To deploy, upload the contents of the 'dist' directory to your web server"
