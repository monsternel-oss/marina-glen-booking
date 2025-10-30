# Subfolder Booking Setup - Marina Glen Holiday Resort

## 🎯 Subfolder Approach: marinaglen.co.za/booking/

### **Why Subfolder is Great:**
- ✅ **No DNS configuration needed** - Works immediately
- ✅ **Same SSL certificate** - Secure from day one
- ✅ **Easier to manage** - All in one hosting account
- ✅ **Professional** - Major hotels use this approach
- ✅ **Faster setup** - WordPress ready in minutes

### **Final URLs:**
- **Main Website**: `marinaglen.co.za`
- **Booking System**: `marinaglen.co.za/booking/`
- **Admin Panel**: `marinaglen.co.za/booking/wp-admin/`

## 🔧 Step-by-Step Setup

### **Step 1: Create Booking Folder**

#### In cPanel File Manager:
1. **Open File Manager** in cPanel
2. **Navigate to**: `public_html/`
3. **Create New Folder**: `booking`
4. **Folder Structure Should Look Like:**
   ```
   public_html/
   ├── index.html (your main site)
   ├── styles/
   ├── scripts/
   ├── images/
   └── booking/ (NEW - for WordPress)
   ```

### **Step 2: Install WordPress in /booking/ Folder**

#### Option A: cPanel WordPress Auto-Installer
1. **Look for "WordPress" or "Softaculous"** in cPanel
2. **Click WordPress installer**
3. **Installation Settings:**
   ```
   Choose Domain: marinaglen.co.za
   In Directory: booking
   Site Name: Marina Glen Booking System
   Admin Username: [Your choice]
   Admin Password: [Strong password]
   Admin Email: [Your email]
   ```

#### Option B: Manual WordPress Installation
1. **Download WordPress** from wordpress.org
2. **Upload to /booking/ folder** via File Manager
3. **Create database** in cPanel
4. **Run WordPress installer**

### **Step 3: Security & SSL**

#### SSL Certificate
- **Already works!** Same certificate as main site
- **Secure booking URL**: `https://marinaglen.co.za/booking/`

#### Security Setup
1. **WordPress Security Plugin** (Wordfence recommended)
2. **Strong admin password**
3. **Regular updates** (WordPress + plugins)

### **Step 4: Install VikBookings Plugin**

#### After WordPress is Running:
1. **Login to WordPress Admin**: `marinaglen.co.za/booking/wp-admin/`
2. **Go to Plugins > Add New**
3. **Search for**: "VikBookings"
4. **Install & Activate**

### **Step 5: Update Main Website Links**

#### Update index.html Navigation
The "Book Now" button already links correctly:
```html
<a href="https://marinaglen.co.za/booking/" class="booking-btn">Book Now</a>
```

#### Update Hero Section Button
```html
<a href="https://marinaglen.co.za/booking/" class="btn-primary">Book Your Stay</a>
```

## 🎨 Integration with Main Website

### **Seamless User Experience**
1. **User visits**: `marinaglen.co.za`
2. **Clicks "Book Now"**: Taken to `marinaglen.co.za/booking/`
3. **Books accommodation**: VikBookings handles payment
4. **Returns to main site**: Easy navigation back

### **Branding Consistency**
- **Same domain** - Looks professional
- **Consistent SSL** - Green lock throughout
- **Easy navigation** - Simple URL structure

### **WordPress Theme Matching**
1. **Choose simple theme** that matches your site colors
2. **Customize colors** to match your beach theme
3. **Add resort logo** to WordPress header

## 📁 Expected File Structure

```
public_html/
├── index.html (Main website - VS Code editable)
├── attractions.html (VS Code editable)
├── styles/
│   └── main.css (VS Code editable)
├── scripts/
│   └── main.js (VS Code editable)
├── images/ (VS Code editable)
└── booking/ (WordPress - Admin panel managed)
    ├── wp-admin/
    ├── wp-content/
    ├── wp-includes/
    └── index.php
```

## 🔄 Workflow After Setup

### **Main Website Updates (VS Code)**
- ✅ **Edit content**: Direct file editing
- ✅ **Update design**: CSS/JS changes
- ✅ **Add pages**: Create HTML files
- ✅ **Upload images**: Direct file upload

### **Booking System Updates (WordPress)**
- 🖥️ **Manage bookings**: WordPress admin panel
- 💰 **Update pricing**: VikBookings settings
- 📊 **View reports**: Booking analytics
- ⚙️ **System config**: Plugin settings

## 🚀 Quick Start Checklist

### **Phase 1: WordPress Setup** (Today)
- [ ] Create `/booking/` folder in cPanel
- [ ] Install WordPress in booking folder
- [ ] Test WordPress admin access
- [ ] Install VikBookings plugin

### **Phase 2: VikBookings Config** (Next)
- [ ] Configure accommodation types (4-sleeper, 6-sleeper)
- [ ] Set pricing and availability
- [ ] Setup payment gateway
- [ ] Test booking process

### **Phase 3: Integration** (Final)
- [ ] Customize WordPress theme colors
- [ ] Add resort branding to booking site
- [ ] Test complete user journey
- [ ] Go live with booking system

## 📞 Support & Maintenance

### **WordPress Updates**
- **Automatic updates** can be enabled
- **Regular backups** through cPanel
- **Security monitoring** via plugins

### **VikBookings Support**
- **Plugin documentation** available
- **Community support** forums
- **Pro version** available for advanced features

---

**Ready to create the /booking/ folder and install WordPress!**