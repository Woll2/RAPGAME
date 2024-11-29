# RAP Token Presale

This repository contains the smart contracts for the RAP token presale on TON blockchain.

## Overview

Instead of using a separate presale contract, we utilize a specialized Jetton wallet contract that handles the presale functionality. This approach provides better transparency and security:

- The presale wallet will hold exactly 20,000 RAP tokens
- Users can directly send USDT to purchase RAP tokens
- All purchases are tracked and limited per wallet
- Automatic token distribution upon payment

### Main Addresses

- RAP Token Contract: `EQAdgc5lDTT02t1jLT6gr_L26kv4HILWZYiVRBhcJX2lgZ6Y`
- Owner Address: `UQDZVD1WEazw8ypx7kZ6UCHuQkgXRIgnMW3ttPskoxyYdaDO`

## How to Purchase

1. Send TON to the presale wallet address
2. You will automatically receive RAP tokens
3. Minimum purchase is 1 USDT
4. Maximum purchase is 1000 USDT per wallet

## Get Methods

1. `get_presale_data()`:
   - Returns (balance, price, total_sold, available)
   - Shows current presale status

2. `get_wallet_purchases(address)`:
   - Returns total purchases for a specific wallet
   - Used to check individual limits

## License

MIT License
