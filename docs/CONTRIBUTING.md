# Contributing to GenTeck Website

Thank you for your interest in contributing to the GenTeck Technology website! This document provides guidelines and instructions for contributors.

## 🤝 How to Contribute

### Reporting Issues
1. Check existing issues to avoid duplicates
2. Use the issue templates when available
3. Provide clear, detailed descriptions
4. Include screenshots for UI issues

### Pull Requests
1. Fork the repository
2. Create a feature branch from `main`
3. Make your changes
4. Test your changes thoroughly
5. Submit a pull request

## 📋 Development Guidelines

### Code Style
- Follow existing code formatting
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### CSS Guidelines
- Use Tailwind CSS classes when possible
- Keep custom CSS organized and documented
- Follow BEM methodology for custom classes
- Ensure responsive design principles

### JavaScript Guidelines
- Use ES6+ syntax
- Prefer `const` and `let` over `var`
- Use arrow functions where appropriate
- Handle errors gracefully

### HTML Guidelines
- Use semantic HTML elements
- Ensure accessibility standards (WCAG 2.1)
- Optimize for SEO
- Validate markup

## 🔍 Testing

### Before Submitting
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test responsive design on various screen sizes
- [ ] Validate HTML markup
- [ ] Check accessibility with screen readers
- [ ] Run Lighthouse audit
- [ ] Test contact form functionality

### Performance Checklist
- [ ] Images are optimized
- [ ] CSS is minified
- [ ] JavaScript is optimized
- [ ] No console errors
- [ ] Fast loading times

## 📝 Commit Messages

Use conventional commit format:
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:
```
feat(contact): add form validation
fix(nav): resolve mobile menu toggle issue
docs(readme): update installation instructions
```

## 🎨 Design System

### Colors
- Primary: `#00F0FF` (Cyber Blue)
- Secondary: `#7B2CBF` (Cyber Purple)
- Accent: `#FF2D75` (Cyber Pink)
- Background: `#0F172A` (Dark)

### Typography
- Headings: Inter Bold
- Body: Inter Regular
- Code: JetBrains Mono

### Spacing
Use Tailwind's spacing scale (multiples of 0.25rem)

## 🚀 Deployment

The website is automatically deployed when changes are merged to `main` branch.

### Staging
- Test changes in development environment
- Ensure all tests pass
- Get review approval

### Production
- Changes are deployed via GitHub Pages
- Monitor for any issues
- Rollback if necessary

## 📞 Contact

For questions about contributing:
- Email: genteckmind@gmail.com
- Create an issue in the repository
