# Register Domain SA - Subdomain Setup Guide

## 🇿🇦 Register Domain SA + cPanel Setup

### **Step 1: Access Your cPanel**

1. **Login to Register Domain SA**
   - Go to: `https://www.registerdomainsa.co.za`
   - Login to your client area
   - Look for "cPanel" or "Control Panel" button

2. **Alternative cPanel Access**
   - Direct URL format: `https://cpanel.your-server.co.za:2083`
   - Or: `https://marinaglen.co.za:2083`
   - Use your hosting login credentials

### **Step 2: Create Subdomain in cPanel**

#### Navigate to Subdomains
1. **Find the Domains Section**
   - Look for "Domains" section in cPanel
   - Click on "Subdomains" icon
   - Icon looks like a folder with branches

#### Create the Subdomain
1. **Fill in Subdomain Details:**
   ```
   Subdomain: booking
   Domain: marinaglen.co.za (should auto-select)
   Document Root: public_html/booking
   ```

2. **Click "Create"**
   - cPanel will automatically create the folder
   - DNS records will be added automatically

### **Step 3: Verify Creation**

#### Check in File Manager
1. **Open File Manager** (in cPanel)
2. **Navigate to public_html/**
3. **Look for new folder**: `booking/`
4. **Folder should be empty** (ready for WordPress)

#### Test Subdomain Access
1. **Wait 5-10 minutes** for DNS propagation
2. **Visit**: `http://booking.marinaglen.co.za`
3. **Expected Results**:
   - Default cPanel page
   - "Index of /" directory listing
   - "It works!" message
   - Or 404 error (this is normal for empty folder)

### **Step 4: Register Domain SA Specific Notes**

#### DNS Propagation
- **Local DNS**: Usually 5-15 minutes
- **International**: Can take up to 2 hours
- **South African ISPs**: Generally very fast

#### File Structure After Creation
```
public_html/
├── index.html (your main site)
├── styles/
├── scripts/ 
├── images/
└── booking/ (NEW - for WordPress)
    └── [empty folder]
```

#### SSL Certificate
- Register Domain SA usually provides **free SSL**
- May need to be **manually activated** for subdomain
- We'll address this after WordPress installation

### **Step 5: Troubleshooting Register Domain SA**

#### Common Issues

**"Subdomain Already Exists"**
- Check if `booking` folder already exists
- Delete old folder if needed
- Try again

**"Permission Denied"**
- Contact Register Domain SA support
- They may need to enable subdomain creation

**DNS Not Resolving**
- South African DNS can be slower
- Try different DNS servers (8.8.8.8, 1.1.1.1)
- Wait up to 2 hours maximum

#### Register Domain SA Support
- **Email**: support@registerdomainsa.co.za
- **Phone**: Check their website for current number
- **Live Chat**: Available during business hours (SAST)
- **Support Hours**: Usually 8AM-5PM SAST (Monday-Friday)

### **Step 6: Verification Commands (Windows)**

#### Test DNS Resolution
```powershell
nslookup booking.marinaglen.co.za
```

#### Test Website Response
```powershell
curl -I http://booking.marinaglen.co.za
```

#### Ping Test
```powershell
ping booking.marinaglen.co.za
```

### **Step 7: Success Indicators**

#### ✅ Subdomain Ready When:
- [ ] `booking.marinaglen.co.za` loads in browser
- [ ] DNS lookup returns IP address
- [ ] `booking/` folder exists in cPanel File Manager
- [ ] No "domain not found" errors

#### Expected Responses:
```
✅ Good: "Index of /" page
✅ Good: Default cPanel page  
✅ Good: "It works!" message
✅ Good: 404 error (empty folder)
❌ Bad: "Domain not found"
❌ Bad: Connection timeout
```

## 🚀 Next Steps After Subdomain Works

1. **Install WordPress** in `/booking/` folder
2. **Activate SSL** for `booking.marinaglen.co.za`
3. **Install VikBookings Plugin**
4. **Configure Booking System**

## 📞 Register Domain SA Contact Template

```
Subject: Subdomain Creation Assistance

Hi Register Domain SA Support,

I need help creating a subdomain for my website:

Main Domain: marinaglen.co.za
Subdomain Needed: booking.marinaglen.co.za
Purpose: WordPress booking system
cPanel Access: [Confirm I have access]

Please confirm:
1. Subdomain creation process in cPanel
2. If SSL is automatically included
3. Any special configuration needed

Account: [Your account reference]
Thank you!
```

---

**Ready to proceed once subdomain is working!**