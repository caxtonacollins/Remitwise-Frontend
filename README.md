# RemitWise Frontend

Frontend application for the RemitWise remittance and financial planning platform.

## Overview

This is a Next.js-based frontend skeleton that provides the UI structure for all RemitWise features. The application is built with:

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library

## Features (Placeholders)

The frontend includes placeholder pages and components for:

1. **Dashboard** - Overview of remittances, savings, bills, and insurance
2. **Send Money** - Remittance sending interface with automatic split preview
3. **Smart Money Split** - Configuration for automatic allocation
4. **Savings Goals** - Goal-based savings tracking and management
5. **Bill Payments** - Bill tracking, scheduling, and payment
6. **Micro-Insurance** - Policy management and premium payments
7. **Family Wallets** - Family member management with roles and spending limits

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Running lint and tests locally

CI runs the same commands on push/PR to `main` and `dev`. To run them locally:

```bash
# Lint
npm run lint

# Unit tests
npm run test
# or
npm run test:unit

# Integration tests (optional; uses .env.test or TEST_* env vars)
npm run test:integration
```

**Test environment:** Use a `.env.test` file in the project root (or set `TEST_*` env vars) for integration tests. Example variables:

- `TEST_SOROBAN_RPC_URL` – Soroban RPC endpoint (optional)
- `TEST_DATABASE_URL` – Database URL for integration tests (optional; skip if not required)

CI loads `.env.test` when present and can use `TEST_SOROBAN_RPC_URL` and `TEST_DATABASE_URL` from GitHub Secrets. The pipeline fails if lint or any test step fails.

## Project Structure

```
remitwise-frontend/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx             # Home page
│   ├── globals.css          # Global styles
│   ├── dashboard/           # Dashboard page
│   ├── send/                # Send money page
│   ├── split/               # Money split configuration
│   ├── goals/               # Savings goals
│   ├── bills/               # Bill payments
│   ├── insurance/           # Insurance policies
│   └── family/              # Family wallets
├── components/              # Reusable components (to be added)
├── public/                  # Static assets
└── package.json
```

## Integration Requirements

### Stellar SDK Integration

1. **Wallet Connection**
   - Integrate Freighter wallet or similar
   - Connect to Stellar network (testnet/mainnet)
   - Handle account authentication

2. **Smart Contract Integration**
   - Connect to deployed Soroban contracts
   - Implement contract function calls
   - Handle transaction signing and submission

3. **Anchor Platform Integration**
   - Integrate with anchor platform APIs for fiat on/off-ramps
   - Handle deposit/withdrawal flows
   - Process exchange rate quotes

4. **Transaction Tracking**
   - Display on-chain transaction history
   - Show transaction status and confirmations
   - Implement real-time updates

### Key Integration Points

- **Send Money Page**: Connect to Stellar SDK for transaction creation and signing
- **Split Configuration**: Call `remittance_split` contract to initialize/update split
- **Savings Goals**: Integrate with `savings_goals` contract for goal management
- **Bills**: Connect to `bill_payments` contract for bill tracking
- **Insurance**: Integrate with `insurance` contract for policy management
- **Family Wallets**: Connect to `family_wallet` contract for member management

## Design Notes

- All forms are currently disabled (placeholders)
- UI uses a blue/indigo color scheme
- Responsive design with mobile-first approach
- Components are structured for easy integration

## Future Enhancements

- Real-time transaction updates
- Push notifications for bill reminders
- Charts and graphs for financial insights
- Multi-language support
- Dark mode
- Mobile app (React Native)

## License

MIT

