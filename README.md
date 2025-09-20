# GenTeck Technology - Company Website

![GenTeck Logo](https://via.placeholder.com/400x100/0F172A/00F0FF?text=GenTeck+Technology)

> **Innovating Tomorrow's Solutions Today**

A modern, responsive company website for GenTeck Technology, showcasing our expertise in AI solutions, cybersecurity services, cloud computing, and innovative technology solutions.

## 🚀 Features

- **Modern Design**: Cyberpunk-inspired aesthetic with smooth animations
- **Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- **Performance Optimized**: Fast loading times with optimized assets
- **SEO Ready**: Comprehensive meta tags and structured data
- **Interactive Elements**: Contact forms, smooth scrolling, and dynamic content
- **Dark/Light Theme**: Toggle between themes for better user experience
- **Progressive Web App**: Service worker ready for offline functionality

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **CSS Framework**: Tailwind CSS
- **Icons**: Font Awesome 6
- **Build Tools**: PostCSS, Autoprefixer
- **Development Server**: Live Server
- **Code Quality**: ESLint, Stylelint
- **Performance**: Lighthouse optimization

## 📁 Project Structure

```
GenTeck/
├── assets/                 # Static assets
│   ├── css/               # Stylesheets
│   │   ├── main.css       # Main styles
│   │   └── tailwind-custom.css
│   ├── js/                # JavaScript files
│   │   ├── main.js        # Main application logic
│   │   └── tailwind-config.js
│   ├── images/            # Image files
│   └── fonts/             # Font files
├── config/                # Configuration files
├── docs/                  # Documentation
├── scripts/               # Build and development scripts
│   ├── dev-setup.sh       # Development setup
│   └── build.sh           # Production build
├── src/                   # Source files
│   └── index-original.html # Original backup
├── index.html             # Main HTML file
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind configuration
├── postcss.config.js      # PostCSS configuration
└── README.md              # This file
```

## 🚦 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/genteckltd/GenTeck.git
   cd GenTeck
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   
   Or use the setup script:
   ```bash
   ./scripts/dev-setup.sh
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📝 Available Scripts

### Development
- `npm run dev` - Start development server with live reload
- `npm run watch:css` - Watch CSS files for changes

### Building
- `npm run build` - Build production-ready files
- `npm run build:css` - Build and minify CSS
- `npm run minify:js` - Minify JavaScript files

### Code Quality
- `npm run lint:css` - Lint CSS files
- `npm run lint:js` - Lint JavaScript files

### Testing & Performance
- `npm test` - Run tests
- `npm run lighthouse` - Run Lighthouse performance audit

### Deployment
- `npm run deploy` - Deploy to GitHub Pages

## 🎨 Customization

### Colors
The website uses a cyberpunk-inspired color scheme defined in `tailwind.config.js`:

```javascript
colors: {
  cyber: {
    blue: '#00F0FF',    // Primary accent
    purple: '#7B2CBF',  // Secondary accent
    pink: '#FF2D75'     // Highlight color
  }
}
```

### Typography
- **Primary Font**: Inter (system fallback: system-ui, sans-serif)
- **Monospace Font**: JetBrains Mono (fallback: Consolas, monospace)

### Animations
Custom animations are defined in the Tailwind config:
- `animate-float` - Floating elements
- `animate-fadeIn` - Fade in with slide up
- `animate-pulse-slow` - Slow pulse effect

## 📱 Sections

1. **Hero Section** - Eye-catching introduction with call-to-action
2. **Clients** - Trusted partners and clients showcase
3. **About** - Company mission, vision, and values
4. **Stats** - Key performance metrics
5. **Services** - Core technology offerings
6. **Portfolio** - Featured projects and case studies
7. **Contact** - Contact form and company information

## 🔧 Configuration

### Environment Variables
Create a `.env` file for environment-specific configurations:

```env
# Analytics
GOOGLE_ANALYTICS_ID=your_ga_id

# Contact Form
FORMSPREE_ENDPOINT=your_formspree_endpoint

# API Keys (if needed)
API_KEY=your_api_key
```

### SEO Configuration
Update meta tags in `index.html`:
- Title and description
- Open Graph tags
- Twitter Card meta
- Schema.org structured data

## 🚀 Deployment

### GitHub Pages
```bash
npm run deploy
```

### Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`

### Vercel
1. Import project from GitHub
2. Vercel will auto-detect settings
3. Deploy with zero configuration

### Traditional Hosting
1. Run `npm run build`
2. Upload `dist/` folder contents to your web server

## 🔍 SEO Features

- ✅ Semantic HTML structure
- ✅ Meta descriptions and keywords
- ✅ Open Graph and Twitter Card tags
- ✅ Schema.org structured data
- ✅ Sitemap ready
- ✅ Robot.txt friendly
- ✅ Lighthouse optimized

## 📊 Performance

The website is optimized for performance:
- Minified CSS and JavaScript
- Optimized images
- Lazy loading
- Critical CSS inlined
- Service worker ready

Target metrics:
- **Performance**: >90
- **Accessibility**: >95
- **Best Practices**: >90
- **SEO**: >95

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- 📧 Email: genteckmind@gmail.com
- 📧 Technical: jarzcyber@gmail.com
- 📞 Phone: +254 (700) 406-269
- 🌐 Website: [gentecktech.com](https://www.gentecktech.com)

## 🏢 About GenTeck Technology

GenTeck Technology is a leading provider of innovative technology solutions, specializing in:
- **AI & Machine Learning** - Custom AI solutions and predictive analytics
- **Cybersecurity** - Comprehensive digital protection and threat prevention
- **Cloud Computing** - Scalable infrastructure and migration services
- **IoT Solutions** - Smart device integration and automation
- **Software Development** - Custom applications and enterprise systems
- **Data Analytics** - Business intelligence and data visualization

---

**Made with ❤️ by GenTeck Technology Team**

*Last updated: January 2025*
