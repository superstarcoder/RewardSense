# RewardSense

A fintech demo dashboard that shows users their credit card rewards optimization: what points they earned vs. what they *could* have earned by routing spend to the right card. Built to showcase [Method Financial's](https://methodfi.com) API capabilities (account connectivity, transaction data, card brand).

## Overview

RewardSense analyzes a user's transactions and card portfolio, then surfaces missed rewards opportunities by category (dining, travel, groceries, etc.). The core insight: Method's existing data (MCC codes, card brand, and transaction history) is sufficient to power a "Rewards Intelligence" feature as an API product for fintechs and wallet apps.

## Stack

- **React + Vite**: frontend only, no backend
- **Tailwind CSS + shadcn/ui**: component styling and UI primitives
- **Mock data**: mirrors Method Financial's real API schema exactly
- **Vercel**: single-project deployment

## Project Structure

```
MethodFinancial/
├── client/
│   └── src/
│       ├── data/        Mock data (entity, accounts, transactions, balances, card brands)
│       ├── lib/         Core logic (rewardsConfig.js, mccCategories.js, optimizer.js)
│       ├── api/         API layer (entity.js, accounts.js, transactions.js, insights.js)
│       ├── components/  UI components
│       ├── pages/       Wallet, Transactions, Insights pages
│       └── styles/      Global CSS
└── smoke-test.mjs       Verifies insights output against mock data
```

## Mock Data

One user (Alex Johnson, NYC) with 4 cards and 27 transactions across March 2026:

| Card | Type |
|------|------|
| Chase Sapphire Preferred | 3x dining, 2x travel, 1x base (UR @ 1.25¢) |
| Apple Card | 3x Apple/tech, 2x base (Daily Cash @ 1¢) |
| Citi Double Cash | Flat 2x (ThankYou @ 1¢) |
| Chase Checking | ACH account |

## Pages

- **Wallet**: cards and balances
- **Transactions**: list with category labels derived from MCC codes
- **Insights**: rewards optimization table showing actual vs. optimal earnings
