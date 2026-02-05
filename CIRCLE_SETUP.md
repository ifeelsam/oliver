# Circle Programmable Wallets Setup Guide

This guide will help you set up **real** Circle Programmable Wallets integration (not a mock).

## 🔑 Prerequisites

1. **Circle Developer Account**
   - Sign up at [https://console.circle.com](https://console.circle.com)
   - Navigate to "Programmable Wallets" section
   - Create a new User-Controlled Wallet application

2. **Get Your Credentials**
   - **App ID**: Found in the Programmable Wallets dashboard
   - **API Key**: Generate from the API Keys section

## 📝 Environment Setup

Add these to your `.env` file:

```env
# Circle Programmable Wallets Configuration
NEXT_PUBLIC_CIRCLE_APP_ID=your_app_id_here
CIRCLE_API_KEY=your_api_key_here

# Other configurations
ANTHROPIC_API_KEY=your_anthropic_key
DATABASE_URL=postgresql://user:password@localhost:5432/treasuryflow
```

## 🏗️ How It Works

### Architecture Flow

```
User clicks "Connect Wallet"
    ↓
Frontend calls /api/circle/authenticate
    ↓
Backend authenticates user with Circle API
    ↓
Circle returns userToken + encryptionKey
    ↓
Frontend initializes Circle SDK with tokens
    ↓
SDK shows PIN/Biometric challenge
    ↓
User completes challenge
    ↓
Wallet is created/accessed
```

### Components

1. **Frontend Hook** (`src/hooks/useCircleWallet.ts`)
   - Initializes Circle SDK
   - Manages wallet connection state
   - Handles SDK authentication

2. **Backend API** (`src/app/api/circle/authenticate/route.ts`)
   - Calls Circle's REST API
   - Creates/authenticates users
   - Returns session tokens securely

3. **Connect Button** (`src/components/wallet/circle-connect-button.tsx`)
   - UI component for wallet connection
   - Shows connection status and errors

## 🚀 Testing the Integration

### Step 1: Verify Environment Variables

```bash
# Check if variables are set
echo $NEXT_PUBLIC_CIRCLE_APP_ID
echo $CIRCLE_API_KEY
```

### Step 2: Start the Development Server

```bash
bun run dev
```

### Step 3: Test Wallet Connection

1. Open [http://localhost:3000](http://localhost:3000)
2. Click "Connect Wallet" button
3. The SDK will:
   - Initialize with your App ID
   - Call your backend for authentication
   - Show Circle's PIN/Biometric UI
   - Create a wallet for the user

### Step 4: Monitor the Console

Check browser console for:
- SDK initialization messages
- Authentication flow logs
- Any error messages

## 🔧 Customization

### Change Authentication Method

Circle supports multiple authentication methods:

```typescript
// In useCircleWallet.ts, you can configure:
sdk.setAppSettings({
  appId: appId,
  // Optional: Customize UI
  // Optional: Set authentication method
});
```

### Add Social Login

Integrate with your existing auth (Google, Email, etc.):

```typescript
// In /api/circle/authenticate/route.ts
const { userId, email, provider } = await req.json();

// Map your user to Circle user
const circleUserId = `${provider}_${userId}`;
```

## 📚 Additional Resources

- [Circle Programmable Wallets Docs](https://developers.circle.com/wallets)
- [Web SDK Reference](https://developers.circle.com/wallets/modular/web-sdk)
- [API Reference](https://developers.circle.com/api-reference/wallets)

## ⚠️ Important Notes

1. **Backend Required**: Circle SDK requires server-side API calls for security
2. **HTTPS Only**: Circle SDK only works on HTTPS in production (localhost is OK for dev)
3. **User Privacy**: Circle uses end-to-end encryption - you never see user's private keys
4. **Testnet First**: Start with testnet before going to mainnet

## 🐛 Troubleshooting

### "Circle App ID not configured"
- Ensure `NEXT_PUBLIC_CIRCLE_APP_ID` is set in `.env`
- Restart your dev server after adding env vars

### "Failed to create Circle user"
- Check that `CIRCLE_API_KEY` is correct
- Verify your Circle account is active
- Check Circle API status page

### "Backend integration required"
- This means the frontend is working but needs the backend API
- Ensure `/api/circle/authenticate` endpoint is accessible
- Check backend logs for errors

## 🎯 Next Steps

Once working, you can:
- Add wallet creation flow
- Implement transaction signing
- Add multi-chain support
- Integrate with Circle Arc for cross-chain transfers
