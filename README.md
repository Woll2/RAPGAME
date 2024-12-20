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

1. Go to the app
2. Connect the wallet
3. Enter the amount (minimum purchase is 1 USDT)
4. Press the purchase button (maximum purchase is 1000 USDT per wallet)

## License

MIT License
