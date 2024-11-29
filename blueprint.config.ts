import { Blueprint } from '@ton-community/blueprint';

export const compile: Blueprint = {
    contracts: {
        RapPresaleWallet: {
            data: {
                init: {
                    balance: 0n,
                    owner: '0:0000000000000000000000000000000000000000000000000000000000000000',
                    jettonMaster: '0:0000000000000000000000000000000000000000000000000000000000000000',
                    price: 1000000000n, // 1 TON
                    minPurchase: 500000000n, // 0.5 TON
                    maxPurchase: 1000000000000n, // 1000 TON
                    totalSold: 0n,
                    isActive: true,
                    purchases: new Map()
                }
            }
        }
    }
};
