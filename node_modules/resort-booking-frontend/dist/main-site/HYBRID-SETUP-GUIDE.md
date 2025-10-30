# Marina Glen Holiday Resort - Hybrid System Setup Guide

## 🎯 Overview
This guide explains how to set up the hybrid booking system that allows you to:
- Keep editing your main website in VS Code (HTML/CSS/JS)
- Add professional booking system with VikBookings (WordPress)

## 🏗️ Architecture

### Main Website (VS Code Editable)
- **Domain**: `marinaglen.co.za`
- **Technology**: HTML, CSS, JavaScript
- **Editing**: Full VS Code control
- **Content**: Resort information, gallery, attractions

### Booking System (WordPress)
- **Domain**: `booking.marinaglen.co.za`
- **Technology**: WordPress + VikBookings plugin
- **Editing**: WordPress admin + optional VS Code theme editing
- **Content**: Room availability, reservations, payments

## 📋 Setup Steps

### Phase 1: Prepare Hosting
1. **Subdomain Setup**
   - Create subdomain: `booking.marinaglen.co.za`
   - Point to separate hosting folder
   - Install SSL certificate

2. **WordPress Installation**
   - Install WordPress on subdomain
   - Create admin account
   - Update to latest version

### Phase 2: VikBookings Configuration
1. **Install VikBookings Plugin**
   - Purchase VikBookings license
   - Install and activate plugin
   - Run initial setup wizard

2. **Configure Resort Settings**
   - Add your resort details
   - Set timezone to South Africa
   - Configure email settings

3. **Set Up Accommodation**
   - Add "4 Sleeper Unit" room type
   - Add "6 Sleeper Unit" room type
   - Set room quantities and pricing
   - Upload room photos

4. **Payment Gateway**
   - Configure PayFast (South African)
   - Test payment processing
   - Set up confirmation emails

### Phase 3: Integration
1. **Update Main Website Links**
   - All "Book Now" buttons point to: `https://booking.marinaglen.co.za`
   - Navigation link added
   - Hero section updated

2. **Styling Consistency**
   - Match WordPress theme to main website colors
   - Use same fonts and styling
   - Consistent logo and branding

### Phase 4: Testing
1. **Booking Flow Test**
   - Test complete booking process
   - Verify payment processing
   - Check confirmation emails
   - Test mobile responsiveness

2. **Integration Test**
   - Click all booking links from main site
   - Ensure seamless transition
   - Test back navigation

## 🔧 Maintenance Workflow

### Main Website Updates (Daily)
```
1. Edit files in VS Code ✅
2. Update content, images, styles ✅
3. Upload via FTP/hosting panel ✅
4. Changes live immediately ✅
```

### Booking System Updates (Weekly)
```
1. Log into WordPress admin
2. Update availability calendar
3. Adjust pricing if needed
4. Review booking reports
5. Manage customer communications
```

## 📂 File Structure

### Main Website (VS Code)
```
marinaglen.co.za/
├── index.html (✅ Edit in VS Code)
├── attractions.html (✅ Edit in VS Code)
├── styles/
│   └── main.css (✅ Edit in VS Code)
├── scripts/
│   └── main.js (✅ Edit in VS Code)
└── images/ (✅ Add images via FTP)
```

### Booking System (WordPress)
```
booking.marinaglen.co.za/
├── WordPress core files
├── wp-content/
│   ├── themes/
│   │   └── marina-glen-theme/ (Optional: Edit in VS Code)
│   └── plugins/
│       └── vikbooking/
└── Database (Managed via WordPress admin)
```

## 🎨 Design Consistency

### Colors to Match in WordPress
- Primary: #0891b2 (Ocean blue)
- Secondary: #f97316 (Sunset orange)
- Accent: #20b2aa (Seafoam)
- Background: Ocean background image

### Fonts to Use
- Font Family: 'Inter', sans-serif
- Same font weights as main site

## 📞 Support & Updates

### For Main Website Issues
- Edit directly in VS Code
- Immediate changes possible
- Full control over all elements

### For Booking System Issues
- WordPress admin dashboard
- VikBookings plugin support
- Hosting provider support

## 🚀 Going Live Checklist

### Before Launch
- [ ] Subdomain configured and SSL installed
- [ ] WordPress installed and secured
- [ ] VikBookings plugin configured
- [ ] Room types and pricing set
- [ ] Payment gateway tested
- [ ] Email confirmations working
- [ ] Main website links updated
- [ ] Mobile responsiveness verified
- [ ] Full booking test completed

### After Launch
- [ ] Monitor booking system performance
- [ ] Check email deliverability
- [ ] Review booking analytics
- [ ] Update availability regularly
- [ ] Maintain both websites

## 💡 Benefits of This Setup

✅ **Keep VS Code Workflow**: Main website fully editable in VS Code
✅ **Professional Booking**: Hotel-grade reservation system
✅ **Easy Maintenance**: Two separate, manageable systems
✅ **Scalable**: Can add more features to either system
✅ **Cost Effective**: No need to rebuild everything
✅ **SEO Friendly**: Main site stays fast and indexable
✅ **Security**: Booking system isolated from main site

## 🔗 Key URLs After Setup

- Main Website: https://marinaglen.co.za
- Booking System: https://booking.marinaglen.co.za
- WordPress Admin: https://booking.marinaglen.co.za/wp-admin
- VikBookings Dashboard: https://booking.marinaglen.co.za/wp-admin/admin.php?page=vikbooking

---

*This hybrid approach gives you the best of both worlds: full control over your main website design and professional booking functionality.*