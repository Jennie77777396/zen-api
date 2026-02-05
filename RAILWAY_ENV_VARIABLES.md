# Railway Environment Variables for zen-api

## Required Environment Variables

### 1. DATABASE_URL (Required) ⚠️

**Description:** PostgreSQL database connection string (Supabase Connection Pooling)

**Format:**
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@[POOLER-HOST]:6543/postgres
```

**Example (Connection Pooling - Recommended):**
```
postgresql://postgres.dxueonvaxzhvnebekdbu:00001111222233334444@aws-0-us-west-2.pooler.supabase.com:6543/postgres
```

**Important Notes:**
- ✅ **Must use port `6543`** (Connection Pooling)
- ✅ **Host must contain `pooler`** (e.g., `pooler.supabase.com`)
- ✅ **Username format:** `postgres.[PROJECT-REF]` (Connection Pooling format)
- ❌ **Do NOT use port `5432`** (Direct connection, may fail on Railway)
- ❌ **Do NOT include quotes** in Railway Variables

**How to get:**
1. Go to Supabase Dashboard → Settings → Database
2. Find "Connection string" → Select "URI" tab
3. **Check "Use connection pooling"** or select "Transaction" mode
4. Copy the connection string (port should be `6543`)

---

### 2. NODE_ENV (Required)

**Description:** Node.js environment mode

**Value:**
```
production
```

**Notes:**
- Use `production` for Railway deployment
- This affects CORS configuration and error handling

---

### 3. PORT (Optional)

**Description:** Port number for the server to listen on

**Default:** `3000`

**Value:**
```
3000
```

**Notes:**
- Railway will automatically set this, but you can override it
- The code uses `process.env.PORT ?? 3000`, so it's optional

---

### 4. FRONTEND_URL (Required for Production)

**Description:** Frontend application URL (for CORS configuration)

**Format:**
```
https://your-frontend-domain.vercel.app
```

**Example:**
```
https://guru-drinks-burbon.vercel.app
```

**Notes:**
- This is used in CORS configuration for production
- Should include all Vercel preview domains if needed
- The code also includes hardcoded Vercel domains, but this env var is the primary one

---

## Complete Railway Variables Configuration

Copy and paste this into Railway's **Variables** → **Raw Editor**:

```bash
DATABASE_URL=postgresql://postgres.dxueonvaxzhvnebekdbu:YOUR_PASSWORD@aws-0-us-west-2.pooler.supabase.com:6543/postgres
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://guru-drinks-burbon.vercel.app
```

**⚠️ Important:**
- Replace `YOUR_PASSWORD` with your actual Supabase database password
- Replace `dxueonvaxzhvnebekdbu` with your actual Supabase project reference
- Replace `aws-0-us-west-2.pooler.supabase.com` with your actual pooler hostname
- Replace `guru-drinks-burbon.vercel.app` with your actual Vercel frontend domain
- **Do NOT include quotes** around values
- **Do NOT include spaces** around the `=` sign

---

## Step-by-Step Setup in Railway

### 1. Get Connection Pooling URI from Supabase

1. Login to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **Database**
4. Scroll to **Connection string** section
5. Select **URI** tab
6. **Check "Use connection pooling"** or select **"Transaction"** mode
7. Copy the connection string (should have port `6543`)

### 2. Set Variables in Railway

1. Login to [Railway](https://railway.app)
2. Select your `zen-api` project
3. Go to **Variables** tab
4. Click **Raw Editor** (or use the form)
5. Add all variables (see format above)
6. **Save** (Railway will automatically redeploy)

### 3. Verify Deployment

1. Go to **Deployments** tab
2. Wait for deployment to complete (1-2 minutes)
3. Check logs - should see:
   ```
   🔍 DATABASE CONNECTION DEBUG INFO
   Connection type: ✅ Connection Pooling (recommended for Railway)
   Port: 6543 ✅
   Host: aws-0-us-west-2.pooler.supabase.com ✅
   🚀 Server is running on: http://localhost:3000
   ```

---

## Environment Variable Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | ✅ Yes | - | Supabase Connection Pooling URI (port 6543) |
| `NODE_ENV` | ✅ Yes | - | `production` for Railway |
| `PORT` | ⚪ Optional | `3000` | Server port |
| `FRONTEND_URL` | ✅ Yes | - | Vercel frontend URL (for CORS) |

---

## Troubleshooting

### Error: `ENETUNREACH` with IPv6 address

**Cause:** Using direct connection (port 5432) instead of Connection Pooling (port 6543)

**Solution:**
- ✅ Use Connection Pooling URI (port 6543)
- ✅ Ensure hostname contains `pooler`
- ✅ Verify in Railway logs: `Port: 6543 ✅`

### Error: `DATABASE_URL environment variable is not set`

**Cause:** Environment variable not set in Railway

**Solution:**
- ✅ Check Railway Variables tab
- ✅ Ensure `DATABASE_URL` is set
- ✅ No quotes around the value

### Error: CORS blocked

**Cause:** `FRONTEND_URL` not set or incorrect

**Solution:**
- ✅ Set `FRONTEND_URL` to your Vercel domain
- ✅ Include all Vercel preview domains if needed
- ✅ Check `main.ts` for hardcoded domains

---

## Quick Copy Template

Replace the placeholders with your actual values:

```bash
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@[POOLER-HOST]:6543/postgres
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://[YOUR-VERCEL-DOMAIN].vercel.app
```
