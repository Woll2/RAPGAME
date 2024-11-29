# RAP Token Presale

This repository contains the smart contracts for the RAP token presale on TON blockchain.

## Overview

Instead of using a separate presale contract, we utilize a specialized Jetton wallet contract that handles the presale functionality. This approach provides better transparency and security:

- The presale wallet will hold exactly 20,000 RAP tokens
- Users can directly send TON to purchase RAP tokens
- All purchases are tracked and limited per wallet
- Automatic token distribution upon payment

## Contract Details

### Presale Wallet Contract (`contracts/rap-presale-wallet.fc`)

A specialized Jetton wallet contract that:
- Holds the presale tokens (20,000 RAP)
- Accepts TON and automatically sends RAP tokens
- Tracks purchases per wallet
- Enforces purchase limits

Parameters:
- Price: 1 TON = 1 RAP
- Minimum purchase: 0.5 TON
- Maximum purchase: 1000 TON per wallet
- Total supply: 20,000 RAP

### Main Addresses

- RAP Token Contract: `EQAdgc5lDTT02t1jLT6gr_L26kv4HILWZYiVRBhcJX2lgZ6Y`
- Owner Address: `UQDZVD1WEazw8ypx7kZ6UCHuQkgXRIgnMW3ttPskoxyYdaDO`

## How to Purchase

1. Send TON to the presale wallet address
2. You will automatically receive RAP tokens
3. Minimum purchase is 0.5 TON
4. Maximum purchase is 1000 TON per wallet

## Development

### Prerequisites

```bash
npm install
```

### Build

```bash
npm run build
```

### Deploy

```bash
npm run deploy
```

## Security Features

1. Purchase Limits:
   - Minimum: 0.5 TON
   - Maximum: 1000 TON per wallet
   - Total supply: 20,000 RAP

2. Automatic Processing:
   - Tokens are sent immediately upon payment
   - TON is forwarded to owner
   - Failed transactions are automatically refunded

3. Transparency:
   - Fixed token supply in wallet
   - All purchases are recorded on-chain
   - Public get-methods for checking status

## Get Methods

1. `get_presale_data()`:
   - Returns (balance, price, total_sold, available)
   - Shows current presale status

2. `get_wallet_purchases(address)`:
   - Returns total purchases for a specific wallet
   - Used to check individual limits

## License

MIT License
