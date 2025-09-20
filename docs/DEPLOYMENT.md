# Deployment Guide

This guide covers different deployment methods for the GenTeck Technology website.

## 🌐 Deployment Options

### 1. GitHub Pages (Recommended)

**Prerequisites:**
- GitHub repository
- GitHub Pages enabled

**Steps:**
1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy to GitHub Pages:
   ```bash
   npm run deploy
   ```

3. Configure custom domain (optional):
   - Add CNAME file to repository root
   - Configure DNS settings

**Automatic Deployment:**
Set up GitHub Actions for automatic deployment on push to main branch.

### 2. Netlify

**Manual Deployment:**
1. Build the project: `npm run build`
2. Drag and drop `dist` folder to Netlify

**Continuous Deployment:**
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy

**Configuration:**
Create `netlify.toml`:
```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. Vercel

**Steps:**
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts

**Configuration:**
Create `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "cleanUrls": true,
  "trailingSlash": false
}
```

### 4. Traditional Web Hosting

**Steps:**
1. Build the project:
   ```bash
   npm run build
   ```

2. Upload `dist` folder contents to your web server

3. Configure web server (if needed):
   - Set up redirects for SPA behavior
   - Configure compression
   - Set cache headers

## 🔧 Environment Configuration

### Production Environment Variables
```env
NODE_ENV=production
GOOGLE_ANALYTICS_ID=your_ga_id
FORMSPREE_ENDPOINT=your_formspree_endpoint
```

### Build Optimization
- CSS and JS minification
- Image optimization
- Asset compression
- Tree shaking

## 🚀 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build
      run: npm run build
      
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## 📊 Monitoring

### Performance Monitoring
- Set up Lighthouse CI
- Monitor Core Web Vitals
- Track loading speeds

### Error Monitoring
- Implement error tracking
- Monitor console errors
- Set up alerts

### Analytics
- Google Analytics setup
- Track user interactions
- Monitor conversion rates

## 🔒 Security

### HTTPS
- Ensure SSL certificate
- Force HTTPS redirects
- Set security headers

### Content Security Policy
Add CSP headers:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' cdn.tailwindcss.com; style-src 'self' 'unsafe-inline' cdnjs.cloudflare.com;
```

## 🎯 Post-Deployment Checklist

- [ ] All pages load correctly
- [ ] Contact form works
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility
- [ ] Performance metrics
- [ ] SEO tags
- [ ] Analytics tracking
- [ ] Error monitoring
- [ ] SSL certificate
- [ ] Custom domain (if applicable)

## 🔧 Troubleshooting

### Common Issues

**Build Failures:**
- Check Node.js version
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall

**Deployment Issues:**
- Verify build command
- Check file permissions
- Ensure proper directory structure

**Performance Issues:**
- Optimize images
- Minify assets
- Enable compression
- Use CDN

## 📞 Support

For deployment assistance:
- Email: genteckmind@gmail.com
- Documentation: Check repository wiki
- Issues: Create GitHub issue
