# Complete cPanel Deployment Guide: BK Motors & BK Properties

This guide explains how to deploy the two frontends to distinct domains on cPanel and how to set up Strapi CMS using cPanel's Node.js selector and MySQL database.

---

## Part 1: Deploying the Frontends to Distinct Domains

Because the frontends are built with Vite + React + TypeScript, they compile into production-optimized static HTML, CSS, and JavaScript. This gives maximum speed, zero Node server crashes for the customer-facing websites, and seamless compatibility with Apache or LiteSpeed web servers.

### Step 1: Generate the Build Bundles
On your local machine or build server:
```bash
cd frontend
npm run build:all
```
This produces two isolated output directories:
- `frontend/dist/motors/`
- `frontend/dist/properties/`

Each directory contains its own `index.html`, `assets/`, and the crucial `.htaccess` file.

### Step 2: Upload to cPanel Document Roots

#### Domain 1: BK Motors (e.g., `bkmotors.co.ke`)
1. Log into your cPanel account.
2. Open **File Manager** and navigate to the document root for your motors domain (typically `public_html` or `public_html/bkmotors.co.ke`).
3. Compress the contents of `frontend/dist/motors` into a `.zip` file on your computer.
4. Click **Upload** in cPanel File Manager and upload your zip file.
5. Right-click the zip file and choose **Extract**.
6. Ensure `.htaccess` is present. (If hidden files are disabled in cPanel, click **Settings** in the top right of File Manager and check *"Show Hidden Files (dotfiles)"*).

#### Domain 2: BK Properties (e.g., `bkproperties.co.ke`)
1. In cPanel, under **Domains** $\rightarrow$ **Addon Domains** or **Domains**, verify the document root of your real estate domain (e.g., `public_html/bkproperties.co.ke` or `properties.example.com`).
2. Repeat the upload & extract steps using the contents of `frontend/dist/properties`.

### Step 3: Verify Client-Side Routing
Test navigating to deep links (e.g., `https://bkmotors.co.ke/inventory` or `https://bkproperties.co.ke/properties`) and press browser refresh. The `.htaccess` file will ensure Apache rewrites the request to `index.html` without returning a 404 error.

---

## Part 2: Setting up Strapi CMS on cPanel

Most modern cPanel hosting providers (including Namecheap, Hostinger, cPanel CloudLinux, A2 Hosting, etc.) feature **Setup Node.js App** (powered by Phusion Passenger).

### Step 1: Create a MySQL Database in cPanel
1. In cPanel, go to **Databases** $\rightarrow$ **MySQL Databases**.
2. **Create New Database**: e.g., `yourcpaneluser_strapi`.
3. **Create New User**: e.g., `yourcpaneluser_strapiuser` with a strong password.
4. **Add User to Database**: Grant **ALL PRIVILEGES**. Note down the full database name, username, and password.

### Step 2: Upload the Strapi CMS Files
1. Create a directory outside `public_html`, for example `/home/youruser/strapi-cms`.
2. Upload the contents of the `cms/` folder:
   - `src/` (with API schemas for `car`, `property`, and `inquiry`)
   - `config/`
   - `public/`
   - `package.json`
   - `server.js`

### Step 3: Configure "Setup Node.js App" in cPanel
1. In cPanel, click **Setup Node.js App** (under Software).
2. Click **Create Application**.
3. Fill in the fields:
   - **Node.js version**: Select `20.x` or `18.x`.
   - **Application mode**: `Production`.
   - **Application root**: `strapi-cms` (or the folder path where you placed Strapi).
   - **Application URL**: `api.bkmotors.co.ke` (or a subdomain created for your backend).
   - **Application startup file**: `server.js`.
4. Click **Create**.

### Step 4: Add Environment Variables in cPanel
In the Node.js application settings interface, add the following Environment Variables:
```env
NODE_ENV=production
DATABASE_CLIENT=mysql
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=yourcpaneluser_strapi
DATABASE_USERNAME=yourcpaneluser_strapiuser
DATABASE_PASSWORD=YourDatabasePassword
ADMIN_JWT_SECRET=your_custom_admin_jwt_secret_32_chars_min
API_TOKEN_SALT=your_custom_api_token_salt_32_chars_min
APP_KEYS=keyA_random32chars,keyB_random32chars,keyC_random32chars,keyD_random32chars
TRANSFER_TOKEN_SALT=your_custom_transfer_salt_32_chars
```

### Step 5: Install Dependencies & Build Admin Panel
1. In the cPanel Node.js App page, click **Enter to the virtual environment** (copy the command provided, e.g., `source /home/user/nodevenv/strapi-cms/20/bin/activate`).
2. Open cPanel **Terminal** or connect via SSH and run:
   ```bash
   cd /home/user/strapi-cms
   npm install
   NODE_ENV=production npm run build
   ```
3. Return to the cPanel Node.js App interface and click **Restart Application**.

### Step 6: Create Strapi Admin & Configure Public Permissions
1. Visit `https://api.bkmotors.co.ke/admin` and follow the on-screen prompts to create your primary administrator account.
2. In Strapi Admin:
   - Go to **Settings** $\rightarrow$ **Users & Permissions Plugin** $\rightarrow$ **Roles** $\rightarrow$ **Public**.
   - Under **Car**: Check `find` and `findOne`.
   - Under **Property**: Check `find` and `findOne`.
   - Under **Inquiry**: Check `create`.
   - Click **Save**.

### Step 7: Connect the Frontends to Your Live Strapi CMS
In `frontend/.env.production` (or before building), set:
```env
VITE_STRAPI_URL=https://api.bkmotors.co.ke
```
And re-run `npm run build:all` to deploy the updated build bundles to your cPanel sites.
