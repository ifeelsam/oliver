# Circle Programmable Wallets Setup Guide

Complete setup guide for integrating Circle Programmable Wallets with Google Social Login.

## 🔑 Prerequisites

1. **Circle Developer Account**
   - Sign up at [https://console.circle.com](https://console.circle.com)
   - Navigate to "Wallets" → "User Controlled" → "Configurator"

2. **Google Cloud Console Account**
   - Access [Google Cloud Console](https://console.cloud.google.com)
   - You'll need this for OAuth setup

## 📝 Step 1: Configure Google OAuth

### 1.1 Create Google Cloud Project

1. Log in to [Google Cloud Console](https://console.cloud.google.com)
2. Click **Select a project** → **New Project**
3. Enter a name (e.g., "TreasuryFlow Auth")
4. Click **Create**

### 1.2 Set Up OAuth Consent Screen

1. Search for **Auth** in the Google Cloud Search Bar
2. Select **Google Auth Platform**
3. Click **Get started** and enter:
   - **App name**: "TreasuryFlow"
   - **User support email**: Your email
   - **Audience**: Select **External**
   - **Contact email addresses**: Your email
4. Click **Create** after agreeing to policies

### 1.3 Create OAuth Client

1. Select **Create OAuth client**
2. Enter:
   - **Application type**: Web application
   - **Client name**: "TreasuryFlow Web Client"
   - **Authorized redirect URIs**: 
     - `http://localhost:3000` (for development)
     - `https://yourdomain.com` (for production)
3. Click **Create**
4. **Copy the Client ID** - you'll need this!

### 1.4 Publish App (Optional)

For production or testing with other users:
1. Go to **Audience** in Google Auth Platform menu
2. Click **Publish app**

Or add test users individually for testing.

## 📝 Step 2: Configure Circle Console

### 2.1 Connect Google OAuth

1. Log in to [Circle Developer Console](https://console.circle.com)
2. Navigate to **Wallets** → **User Controlled** → **Configurator**
3. Click **Authentication Methods** → **Social Logins**
4. Select **Google**
5. Paste your **Google OAuth Client ID** into the **Client ID (Web)** field

### 2.2 Get Your Circle Credentials

1. Go to the **Configurator** page
2. Copy your **App ID** (identifies your wallet configuration)
3. Navigate to **Console** → **Keys** → **Create a key**
4. Select **API key** → **Standard Key**
5. Copy your **API Key** (keep this secret!)

## 📝 Step 3: Configure Environment Variables

Create a `.env` file in your project root:

```bash
cp .env.example .env
```

Update with your credentials:

```env
# Circle Configuration
NEXT_PUBLIC_CIRCLE_APP_ID=your_circle_app_id_here
CIRCLE_API_KEY=your_circle_api_key_here

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id_here

# Other Services
ANTHROPIC_API_KEY=your_anthropic_api_key_here
DATABASE_URL=postgresql://user:password@localhost:5432/treasuryflow
```

**Important:** 
- `NEXT_PUBLIC_*` variables are exposed to the browser
- `CIRCLE_API_KEY` is server-side only (never expose this!)

## 🚀 How It Works

### Architecture Flow

```
1. User clicks "Connect Wallet"
   ↓
2. SDK generates deviceId
   ↓
3. Backend creates deviceToken (POST /api/endpoints)
   ↓
4. SDK redirects to Google OAuth
   ↓
5. User authenticates with Google
   ↓
6. Google redirects back with OAuth code
   ↓
7. SDK sends OAuth to Circle
   ↓
8. Circle validates & returns userToken + encryptionKey
   ↓
9. User clicks "Create Wallet"
   ↓
10. Backend initializes user (POST /api/endpoints)
   ↓
11. Circle returns challengeId
   ↓
12. SDK executes challenge (user approves)
   ↓
13. Wallet created! 🎉
```

### API Endpoints

The app uses a unified `/api/endpoints` route with these actions:

| Action | Description |
|--------|-------------|
| `createDeviceToken` | Creates device-bound session for Google auth |
| `initializeUser` | Initializes user and returns challengeId |
| `listWallets` | Retrieves user's wallets |
| `getTokenBalance` | Gets USDC balance for a wallet |

## 🧪 Testing the Integration

### 1. Start Development Server

```bash
bun run dev
# or
npm run dev
```

### 2. Open the App

Navigate to [http://localhost:3000](http://localhost:3000)

### 3. Connect Wallet

1. Click **"Connect Wallet"** button
2. You'll be redirected to Google login
3. Sign in with your Google account
4. You'll be redirected back to the app
5. Click **"Create Wallet"** button
6. Approve the wallet creation
7. Your wallet address and USDC balance will appear!

### 4. Check Browser Console

You should see logs like:
```
✅ Circle SDK initialized
🔄 Creating device token...
✅ Device token created
🔄 Initiating Google login...
✅ Login successful
🔄 Initializing user...
✅ User initialized, executing challenge...
✅ Wallet created!
```

### 5. Verify in Circle Console

1. Go to [Circle Console](https://console.circle.com)
2. Navigate to **Wallets** → **User Controlled** → **Users**
3. You should see your newly created user!

## 💰 Fund Your Wallet

1. Copy your wallet address from the app
2. Visit [Circle Faucet](https://faucet.circle.com)
3. Select **Polygon Amoy Testnet**
4. Paste your wallet address
5. Click **Send USDC**
6. Refresh the app to see your balance!

## 🎨 UI Components

### CircleConnectButton States

The button shows different states:

1. **Initial**: "Connect Wallet" with gradient
2. **Connecting**: Loading spinner with status
3. **Needs Wallet**: "Create Wallet" button (after Google login)
4. **Connected**: Shows address + USDC balance
5. **Error**: Shows error with retry button

## 🔒 Security Best Practices

1. **Never expose API keys** - Keep `CIRCLE_API_KEY` server-side only
2. **Use HTTPS in production** - Circle SDK requires secure context
3. **Validate user sessions** - Implement proper auth in production
4. **Rate limit API calls** - Prevent abuse of your endpoints
5. **Monitor Circle Console** - Check for suspicious activity

## 🐛 Troubleshooting

### "Circle App ID not configured"
- Ensure `NEXT_PUBLIC_CIRCLE_APP_ID` is in `.env`
- Restart dev server after adding env vars

### "Failed to create device token"
- Check `CIRCLE_API_KEY` is correct
- Verify API key has proper permissions in Circle Console

### "Login failed"
- Verify `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is correct
- Check Google OAuth redirect URI matches your app URL
- Ensure Google OAuth app is published or you're added as test user

### "User already initialized" (Code 155106)
- This is normal! The app will load your existing wallet
- Each Google account can only have one wallet per app

### Wallet not showing after creation
- Wait 2-3 seconds for Circle to index the wallet
- Check browser console for errors
- Verify in Circle Console that user was created

## 📚 Additional Resources

- [Circle Wallets Documentation](https://developers.circle.com/wallets)
- [Circle API Reference](https://developers.circle.com/api-reference/wallets)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Circle Developer Console](https://console.circle.com)

## 🎯 Next Steps

Once your wallet integration is working:

1. ✅ Implement wallet transactions
2. ✅ Add multi-chain support
3. ✅ Integrate Circle Arc for cross-chain transfers
4. ✅ Build invoice financing features
5. ✅ Add treasury management dashboard

---

Built with ❤️ using Circle Programmable Wallets
