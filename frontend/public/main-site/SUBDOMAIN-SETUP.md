# Subdomain Setup Guide - Marina Glen Holiday Resort

## 🎯 Goal
Create subdomain: `booking.marinaglen.co.za` for WordPress + VikBookings

## 📋 Before You Start

### Information You'll Need
- **Main Domain**: marinaglen.co.za
- **Subdomain Name**: booking
- **Full Subdomain**: booking.marinaglen.co.za
- **Hosting Control Panel Login**: [Your hosting provider login]

## 🔧 Setup Methods by Hosting Provider

### Method 1: cPanel (Most Common)

#### Access cPanel
1. Go to your hosting provider's website
2. Login to your account
3. Click "cPanel" or "Control Panel"

#### Create Subdomain
1. **Find "Subdomains" Section**
   - Look for "Subdomains" icon in cPanel
   - Usually under "Domains" section

2. **Create New Subdomain**
   - Subdomain: `booking`
   - Domain: `marinaglen.co.za` (should auto-select)
   - Document Root: `public_html/booking` (or similar)
   - Click "Create"

#### Verify Creation
1. Wait 5-10 minutes for DNS propagation
2. Visit `http://booking.marinaglen.co.za`
3. Should see default page or folder listing

### Method 2: Plesk Panel

#### Access Plesk
1. Login to your Plesk panel
2. Go to "Websites & Domains"

#### Create Subdomain
1. Click "Add Subdomain"
2. **Subdomain name**: `booking`
3. **Parent domain**: `marinaglen.co.za`
4. **Document root**: `booking.marinaglen.co.za`
5. Click "OK"

### Method 3: DirectAdmin

#### Access DirectAdmin
1. Login to DirectAdmin panel
2. Go to "Subdomain Management"

#### Create Subdomain
1. Click "Add Subdomain"
2. **Subdomain**: `booking`
3. **Domain**: `marinaglen.co.za`
4. **Directory**: `public_html/booking`
5. Click "Create"

### Method 4: Custom/Other Hosting

#### DNS Management
1. Access your DNS management panel
2. Add A Record:
   - **Name**: `booking`
   - **Type**: `A`
   - **Value**: [Your server IP address]
   - **TTL**: `300` (5 minutes)

#### Web Server Configuration
Contact your hosting provider to:
- Configure web server for subdomain
- Set document root
- Enable subdomain access

## 🔍 Verification Steps

### Test Subdomain Access
1. **Browser Test**
   ```
   Visit: http://booking.marinaglen.co.za
   Expected: Default page, 404, or folder listing
   ```

2. **DNS Propagation Check**
   ```
   Use online tools:
   - whatsmydns.net
   - dnschecker.org
   Search for: booking.marinaglen.co.za
   ```

3. **Ping Test** (Windows)
   ```cmd
   ping booking.marinaglen.co.za
   ```

### Common Issues & Solutions

#### "Subdomain Not Found"
- **Wait**: DNS can take up to 24 hours
- **Check Spelling**: Ensure "booking" is spelled correctly
- **Contact Host**: Some providers need manual activation

#### "Permission Denied"
- **File Permissions**: Check folder permissions
- **Document Root**: Verify correct path setup

#### "SSL Certificate Error"
- **Normal**: SSL needs to be added separately
- **Ignore for Now**: We'll add SSL after WordPress install

## 📁 Expected File Structure After Setup

```
Your Hosting Account/
├── public_html/ (Main website)
│   ├── index.html
│   ├── styles/
│   ├── scripts/
│   └── images/
└── public_html/booking/ (or booking.marinaglen.co.za/)
    └── [Empty folder ready for WordPress]
```

## ✅ Success Indicators

### Subdomain Ready When:
- [ ] `booking.marinaglen.co.za` loads (even if shows error/empty)
- [ ] DNS lookup returns your server IP
- [ ] No "domain not found" errors
- [ ] Folder created in hosting account

## 🚀 Next Steps After Subdomain Works

1. **Install WordPress** on subdomain
2. **Add SSL Certificate** for secure booking
3. **Install VikBookings Plugin**
4. **Configure Booking System**

## 📞 Get Help From Your Host

### Information to Provide Your Hosting Support:
```
"Hi, I need to create a subdomain for my website:

Main Domain: marinaglen.co.za
Subdomain Needed: booking.marinaglen.co.za
Purpose: WordPress installation for booking system
Document Root: booking/ folder

Please help me create this subdomain and confirm it's working.
Thank you!"
```

### Common Hosting Support Contacts:
- **cPanel hosts**: Usually have live chat
- **Shared hosting**: Submit support ticket
- **VPS/Dedicated**: SSH access might be needed

## 🔧 Troubleshooting Commands

### Check if subdomain exists (Windows):
```cmd
nslookup booking.marinaglen.co.za
```

### Check website response:
```cmd
curl -I http://booking.marinaglen.co.za
```

---

**Once your subdomain is working, we'll proceed to WordPress installation!**