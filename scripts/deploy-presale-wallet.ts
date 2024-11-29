import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode, TupleBuilder } from 'ton-core';
import { compile } from '@ton-community/blueprint';

export type PreSaleConfig = {
    owner: Address;
    jettonMaster: Address;
    price: bigint;      // 1 TON
    minBuy: bigint;     // 0.5 TON
    maxBuy: bigint;     // 1000 TON
    totalSupply: bigint; // 20,000 RAP
};

export function presaleConfigToCell(config: PreSaleConfig): Cell {
    return beginCell()
        .storeCoins(0n)                    // Initial balance
        .storeAddress(config.owner)        // Owner address
        .storeAddress(config.jettonMaster) // RAP contract address
        .storeCoins(config.price)          // Price: 1 TON = 1 RAP
        .storeCoins(config.minBuy)         // Min purchase: 0.5 TON
        .storeCoins(config.maxBuy)         // Max purchase: 1000 TON
        .storeCoins(0n)                    // Initial total_sold
        .storeDict(null)                   // Empty purchases dictionary
        .endCell();
}

export class RapPresaleWallet implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell }
    ) {}

    static createFromConfig(config: PreSaleConfig, code: Cell, workchain = 0) {
        const data = presaleConfigToCell(config);
        const init = { code, data };
        return new RapPresaleWallet(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async getPresaleData(provider: ContractProvider) {
        const result = await provider.get('get_presale_data', []);
        const [balance, price, totalSold, available] = result.stack.readTuple();
        return {
            balance: balance.readBigNumber(),
            price: price.readBigNumber(),
            totalSold: totalSold.readBigNumber(),
            available: available.readBigNumber(),
        };
    }

    async getWalletPurchases(provider: ContractProvider, address: Address) {
        const result = await provider.get('get_wallet_purchases', [
            { type: 'slice', cell: beginCell().storeAddress(address).endCell() },
        ]);
        return result.stack.readBigNumber();
    }
}

// Deploy script
async function main() {
    // Compile contract
    const presaleCode = await compile('rap-presale-wallet');

    // Configuration
    const config: PreSaleConfig = {
        owner: Address.parse('UQDZVD1WEazw8ypx7kZ6UCHuQkgXRIgnMW3ttPskoxyYdaDO'),
        jettonMaster: Address.parse('EQAdgc5lDTT02t1jLT6gr_L26kv4HILWZYiVRBhcJX2lgZ6Y'),
        price: 1000000000n,    // 1 TON = 1 RAP
        minBuy: 500000000n,    // 0.5 TON minimum
        maxBuy: 1000000000000n, // 1000 TON maximum
        totalSupply: 20000000000000n // 20,000 RAP
    };

    // Create contract
    const presaleWallet = RapPresaleWallet.createFromConfig(config, presaleCode);

    // Print deployment info
    console.log('Presale Wallet deployment info:');
    console.log('Contract address:', presaleWallet.address.toString());
    console.log('Owner address:', config.owner.toString());
    console.log('RAP contract:', config.jettonMaster.toString());
    console.log('Price: 1 TON = 1 RAP');
    console.log('Min purchase: 0.5 TON');
    console.log('Max purchase: 1000 TON');
    console.log('Total supply: 20,000 RAP');
}

main().catch(console.error);
