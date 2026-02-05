# TreasuryFlow - AI-Powered Treasury Management

> Autonomous treasury management with RWA-backed invoice financing powered by Circle Wallets and Claude AI

## 🚀 Features

- **🔐 Circle Programmable Wallets** - Secure, user-controlled Web3 wallets
- **🤖 AI-Powered Invoice Verification** - Claude Sonnet 4 analyzes invoices autonomously
- **💰 RWA-Backed Financing** - Convert invoices to NFTs, get instant USDC liquidity
- **🌐 Cross-Chain Treasury** - Manage funds across Ethereum, Polygon, Base, Arbitrum, Optimism
- **⚡ Circle Arc Protocol** - Seamless USDC transfers across chains
- **📊 Real-Time Analytics** - Treasury health monitoring and yield tracking

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Modern styling with custom theme
- **Framer Motion** - Smooth animations
- **Recharts** - Data visualization

### Web3 & Blockchain
- **Circle Programmable Wallets SDK** - User-controlled wallet infrastructure
- **Viem** - TypeScript-first Web3 client
- **Wagmi** - React hooks for Ethereum
- **Circle Arc Protocol** - Cross-chain USDC transfers

### AI & Backend
- **Anthropic Claude Sonnet 4** - AI agent for invoice verification
- **Prisma** - Type-safe database ORM
- **PostgreSQL** - Production database
- **Redis** - Caching layer

## 📦 Installation

### Prerequisites
- Node.js 20+ or Bun 1.3+
- PostgreSQL database
- Circle Developer Account

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/ifeelsam/oliver.git
cd oliver
```

2. **Install dependencies**
```bash
bun install
# or
npm install
```

3. **Configure environment variables**

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Update the following variables:

```env
# Circle Programmable Wallets
NEXT_PUBLIC_CIRCLE_APP_ID=your_circle_app_id
CIRCLE_API_KEY=your_circle_api_key

# AI Configuration
ANTHROPIC_API_KEY=your_anthropic_api_key

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/treasuryflow
```

**Getting Circle Credentials:**
1. Sign up at [Circle Developer Console](https://console.circle.com)
2. Create a new Programmable Wallets project
3. Copy your App ID and API Key

4. **Initialize the database**
```bash
bunx prisma migrate dev
bunx prisma generate
```

5. **Run the development server**
```bash
bun run dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🏗️ Project Structure

```
oliver/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (dashboard)/       # Dashboard routes
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── ui/               # Base UI components
│   │   ├── layout/           # Layout components
│   │   └── wallet/           # Wallet components
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utilities and configs
│   │   └── ai/              # AI agent logic
│   ├── store/               # State management
│   └── types/               # TypeScript types
├── prisma/                  # Database schema
└── public/                  # Static assets
```

## 🎨 UI Features

- **Premium Dark Theme** - Vibrant gradients and glassmorphism
- **Responsive Design** - Mobile-first approach
- **Smooth Animations** - Framer Motion micro-interactions
- **Accessible** - WCAG 2.1 AA compliant

## 🔒 Security

- **User-Controlled Keys** - Circle Programmable Wallets with passkey authentication
- **Encrypted Storage** - Sensitive data encrypted at rest
- **API Key Rotation** - Regular credential updates
- **Multi-Sig Support** - For large transactions

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines first.

## 🔗 Links

- [Circle Wallets Documentation](https://developers.circle.com/wallets)
- [Technical Architecture](./TreasuryFlow_Technical_Architecture.md)
- [Live Demo](#) (Coming soon)

## 💬 Support

For questions or issues:
- Open a GitHub issue
- Contact: [your-email]

---

Built with ❤️ for ETHGlobal HackMoney 2026
