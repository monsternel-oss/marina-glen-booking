# Manual Subdomain Setup - Register Domain SA cPanel

## 🔧 Manual Subdomain Creation (When Subdomain Tool Missing)

### **Method A: File Manager + DNS Zone Editor**

#### Step 1: Create Folder Structure
1. **Open File Manager** in cPanel
2. **Navigate to public_html/**
3. **Create New Folder**: `booking`
4. **Set Permissions**: 755 (should be default)

#### Step 2: Add DNS Record
1. **Find "Zone Editor"** or **"DNS Zone Editor"** in cPanel
2. **Select domain**: marinaglen.co.za
3. **Add A Record**:
   ```
   Name: booking
   Type: A
   Points to: [Same IP as main domain]
   TTL: 300
   ```

#### Step 3: Find Your Server IP
**Option 1: From main domain**
```cmd
nslookup marinaglen.co.za
```

**Option 2: In cPanel**
- Look for "Server Information" or "Account Information"
- Find "Shared IP Address" or "Server IP"

### **Method B: Contact Register Domain SA**

#### Support Request Template
```
Subject: Subdomain Creation - cPanel Interface

Hi Register Domain SA Support,

I need to create a subdomain but cannot find the "Subdomains" option in my cPanel.

Account: [Your account]
Domain: marinaglen.co.za
Subdomain Needed: booking.marinaglen.co.za

Could you please:
1. Create this subdomain for me, OR
2. Tell me where to find the subdomain creation tool in my cPanel

The subdomain is for a WordPress booking system.

Thank you!
```

### **Method C: Alternative cPanel Interfaces**

#### Different cPanel Themes
Register Domain SA might use:
- **Paper Lantern** (newer interface)
- **x3** (older interface)  
- **Custom theme**

#### Look for These Icons/Sections:
```
🌐 Domains
📁 File Manager
🔧 Zone Editor
➕ Addon Domains
📋 Domain Management
🏠 Subdomain Management
```

### **Method D: WordPress Installation Alternative**

#### If Subdomain Creation Fails
We can install WordPress in a **subfolder** instead:
- **URL**: `marinaglen.co.za/booking/`
- **Folder**: `public_html/booking/`
- **Still works** for VikBookings
- **Easier setup** - no DNS needed

#### Pros of Subfolder Approach:
- ✅ No DNS configuration needed
- ✅ Same SSL certificate
- ✅ Easier to manage
- ✅ Still professional looking

#### Cons of Subfolder:
- ❌ Slightly longer URL
- ❌ Not completely separate

## 🔍 Troubleshooting Steps

### **Step 1: Screenshot Request**
Can you take a screenshot of your cPanel main page? Look for:
- Domain-related sections
- Any icons with "domain" in the name
- The overall layout/theme

### **Step 2: Check cPanel Version**
- Look at bottom of cPanel for version info
- Different versions have different layouts

### **Step 3: Account Type Check**
- **Shared Hosting**: Usually has subdomain tools
- **Reseller**: Might have different interface
- **VPS/Dedicated**: Different management tools

## 📞 Register Domain SA Specific Help

### **Their Support is Usually Great:**
- **Email**: support@registerdomainsa.co.za
- **Phone**: Check their website
- **Live Chat**: During SA business hours
- **Response Time**: Usually same day

### **What to Ask Them:**
1. "Where is the subdomain creation tool in my cPanel?"
2. "Can you create booking.marinaglen.co.za for me?"
3. "What's the process for adding subdomains on your hosting?"

---

**Next Steps:**
1. Try finding alternative domain tools in cPanel
2. Take screenshot if needed for further help
3. Contact Register Domain SA if no luck
4. Consider subfolder alternative if needed