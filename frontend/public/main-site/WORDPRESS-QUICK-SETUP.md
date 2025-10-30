# WordPress Installation Quick Guide - Marina Glen

## 🚀 **STEP 1: Create Booking Folder** (Do This First)

### **In cPanel File Manager:**
1. **Login to cPanel** at Register Domain SA
2. **Click "File Manager"** 
3. **Navigate to "public_html" folder**
4. **Right-click in empty space**
5. **Select "Create New Folder"**
6. **Name it**: `booking`
7. **Click "Create"**

### ✅ **Success Check:**
Your folder structure should now be:
```
public_html/
├── index.html (your main site)
├── styles/
├── scripts/
├── images/
└── booking/ (NEW - empty folder)
```

## 🎯 **STEP 2: Install WordPress** (Choose Your Method)

### **Method A: Softaculous Auto-Installer** (Easiest)

#### Find WordPress Installer:
1. **Go back to cPanel main page**
2. **Look for "Softaculous" or "WordPress"** icon
3. **Click on WordPress installer**

#### Installation Settings:
```
Choose Protocol: https://
Choose Domain: marinaglen.co.za
In Directory: booking
Site Name: Marina Glen Booking System
Site Description: Online Booking for Marina Glen Holiday Resort
Admin Username: [Choose strong username - NOT 'admin']
Admin Password: [Use strong password]
Admin Email: [Your email address]
Select Language: English
```

#### Click "Install" and Wait:
- Installation takes 2-3 minutes
- You'll get confirmation email
- **Save the login details!**

### **Method B: Manual WordPress Installation** (If no auto-installer)

#### Download WordPress:
1. **Go to**: https://wordpress.org/download/
2. **Download latest WordPress**
3. **Extract the ZIP file**

#### Upload to cPanel:
1. **In File Manager**, go to `public_html/booking/`
2. **Upload WordPress files** to this folder
3. **Extract if needed**

#### Create Database:
1. **In cPanel**, find "MySQL Databases"
2. **Create new database**: `marinaglen_booking`
3. **Create database user** with password
4. **Assign user to database** with all privileges

#### Run WordPress Installer:
1. **Visit**: `https://marinaglen.co.za/booking/`
2. **Follow WordPress setup wizard**
3. **Enter database details**

## ✅ **STEP 3: Test WordPress Installation**

### **Check These URLs Work:**
- **Booking site**: `https://marinaglen.co.za/booking/`
- **Admin login**: `https://marinaglen.co.za/booking/wp-admin/`

### **Expected Results:**
- ✅ WordPress welcome page loads
- ✅ Admin panel accessible
- ✅ SSL certificate works (green lock)
- ✅ No error messages

## 🔌 **STEP 4: Install VikBookings Plugin**

### **In WordPress Admin Panel:**
1. **Login**: `https://marinaglen.co.za/booking/wp-admin/`
2. **Go to**: Plugins → Add New
3. **Search for**: "VikBookings"
4. **Install & Activate** the plugin

### **Basic VikBookings Setup:**
1. **Go to**: VikBookings → Dashboard
2. **Add Room Types**:
   - 4 Sleeper Unit
   - 6 Sleeper Unit
3. **Set Basic Pricing**
4. **Configure Availability**

## 🎨 **STEP 5: Basic Theme Customization**

### **Match Your Main Site:**
1. **Go to**: Appearance → Themes
2. **Choose simple theme** (Twenty Twenty-Three recommended)
3. **Go to**: Appearance → Customize
4. **Update Colors** to match your beach theme:
   - Primary: #007acc (ocean blue)
   - Secondary: #ff6b35 (sunset orange)

## 🔗 **STEP 6: Test Complete User Journey**

### **Full Test Process:**
1. **Visit main site**: `https://marinaglen.co.za`
2. **Click "Book Now"** in navigation
3. **Should open**: `https://marinaglen.co.za/booking/`
4. **Test booking flow** in VikBookings
5. **Return to main site** easily

## 📞 **Need Help?**

### **Register Domain SA Support:**
- **For**: cPanel access, folder creation, WordPress installation
- **Contact**: support@registerdomainsa.co.za

### **WordPress/VikBookings Help:**
- **WordPress Documentation**: wordpress.org/support
- **VikBookings Documentation**: vikwp.com/support

## 🎯 **Quick Checklist:**

### **Phase 1: Foundation** (Today)
- [ ] Create `/booking/` folder in cPanel
- [ ] Install WordPress in booking folder  
- [ ] Test WordPress admin access
- [ ] Verify all booking links work from main site

### **Phase 2: Booking System** (Next)
- [ ] Install VikBookings plugin
- [ ] Configure room types (4-sleeper, 6-sleeper)
- [ ] Set up basic pricing
- [ ] Test booking process

### **Phase 3: Polish** (Final)
- [ ] Customize WordPress theme colors
- [ ] Add resort branding
- [ ] Payment gateway setup
- [ ] Go live!

---

**Start with Step 1 - Create the booking folder in cPanel File Manager!**