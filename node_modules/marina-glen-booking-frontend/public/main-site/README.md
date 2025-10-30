# Marina Glen Holiday Resort Website

A modern, responsive website for Marina Glen Holiday Resort built with HTML5, CSS3, and JavaScript.

## 🏖️ About

Marina Glen Holiday Resort is a luxury accommodation provider located on the beautiful Garden Route of South Africa. This website showcases the resort's amenities, accommodation options, and local attractions with a clean, modern design.

## ✨ Features

- **Responsive Design**: Fully responsive layout that works on all devices
- **Modern UI/UX**: Clean, contemporary design with smooth animations
- **Interactive Elements**: Dynamic navigation, contact form, and scroll effects
- **Accessibility**: Semantic HTML and accessible design patterns
- **Performance Optimized**: Fast loading times and optimized assets
- **Mobile-First**: Designed with mobile users in mind

## 🏗️ Project Structure

```
Website Upgrade/
├── .github/
│   └── copilot-instructions.md    # Development guidelines
├── .vscode/
│   └── tasks.json                 # VS Code tasks
├── images/
│   └── README.md                  # Image requirements guide
├── scripts/
│   └── main.js                    # JavaScript functionality
├── styles/
│   └── main.css                   # CSS styles and responsive design
├── index.html                     # Main HTML file
└── README.md                      # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- VS Code with Live Server extension (included in setup)
- Modern web browser
- Git (for version control)

### Installation

1. Clone or download this repository
2. Open the project folder in VS Code
3. Right-click on `index.html` and select "Open with Live Server"
4. The website will open in your default browser

### Alternative Setup

If you prefer to use a different local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000` in your browser.

## 📱 Responsive Breakpoints

- **Mobile**: 0px - 480px
- **Tablet**: 481px - 768px  
- **Desktop**: 769px and above

## 🎨 Design System

### Colors
- Primary: `#2563eb` (Blue)
- Secondary: `#64748b` (Slate)
- Accent: `#06b6d4` (Cyan)
- Text Dark: `#1e293b`
- Text Light: `#64748b`

### Typography
- Font Family: Inter (Google Fonts)
- Font Weights: 300, 400, 500, 600, 700

### Components
- Navigation with mobile toggle
- Hero section with call-to-action
- Accommodation cards
- Activities grid
- Contact form with validation
- Footer with links

## 📝 Content Sections

1. **Hero**: Main introduction with resort overview
2. **About**: Resort description and features
3. **Accommodation**: Different unit types and amenities
4. **Activities**: Local attractions and activities
5. **Contact**: Contact information and inquiry form

## 🖼️ Adding Images

The website currently uses placeholders for images. To add real images:

1. Add your images to the `images/` directory
2. Update the HTML file to reference the actual image files
3. Follow the guidelines in `images/README.md` for optimal results

## 🛠️ Customization

### Changing Colors
Edit the CSS custom properties in `styles/main.css`:

```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #64748b;
    /* ... other colors */
}
```

### Adding Content
- Edit `index.html` to modify text content
- Update contact information in the contact section
- Modify accommodation details and pricing

### Adding Features
- JavaScript functionality is in `scripts/main.js`
- CSS animations and interactions can be modified in `styles/main.css`

## 📧 Contact Form

The contact form includes:
- Client-side validation
- Responsive design
- Success/error notifications
- Required field indicators

Note: The form currently shows a success message but doesn't actually send emails. To enable email functionality, you'll need to:
1. Set up a backend service (PHP, Node.js, etc.)
2. Configure email sending (SMTP, email service API)
3. Update the form action and method

## 🔧 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- IE 11+ (with some feature limitations)

## 📈 Performance

- Optimized CSS with modern features
- Lazy loading ready (for images)
- Minimal JavaScript footprint
- Fast loading animations
- Efficient resource loading

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test across different devices
5. Submit a pull request

## 📄 License

This project is created for Marina Glen Holiday Resort. All rights reserved.

## 🆘 Support

For technical support or questions about the website:
- Check the browser console for errors
- Ensure all files are properly linked
- Verify Live Server is running correctly
- Test on different browsers and devices

## 🔄 Future Enhancements

Potential improvements for future versions:
- Image gallery with lightbox
- Online booking system integration
- Multilingual support
- Blog/news section
- Social media integration
- SEO optimization
- Google Maps integration
- Weather widget

---

**Marina Glen Holiday Resort**  
*Luxury accommodation on the Garden Route*