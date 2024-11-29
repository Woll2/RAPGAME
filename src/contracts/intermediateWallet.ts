import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode, toNano } from 'ton-core';

export const OWNER_ADDRESS = Address.parse('UQDFOGx8jVO3BSEXdlgSjDyE4y0PQf-w8-c4iCx9MRPruBpo');

export type IntermediateWalletConfig = {
    owner: Address;
    presale: Address;
    isActive: boolean;
};

export type Transaction = {
    sender: Address;
    amount: bigint;
    timestamp: number;
    comment: string;
};

export function intermediateWalletConfigToCell(config: IntermediateWalletConfig): Cell {
    return beginCell()
        .storeAddress(config.owner)
        .storeAddress(config.presale)
        .storeBit(config.isActive)
        .endCell();
}

export function generateTransactionComment(sender: Address, amount: bigint): string {
    const timestamp = Math.floor(Date.now() / 1000);
    const randomId = Math.floor(Math.random() * 1000);
    return `T${timestamp}-${randomId}-${sender.toString().slice(0, 6)}`;
}

function encodeComment(comment: string): Cell {
    return beginCell()
        .storeUint(0, 32) // text comment prefix
        .storeBuffer(Buffer.from(comment))
        .endCell();
}

export class IntermediateWallet implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new IntermediateWallet(address);
    }

    static createFromConfig(config: IntermediateWalletConfig, code: Cell, workchain = 0) {
        const data = intermediateWalletConfigToCell(config);
        const init = { code, data };
        return new IntermediateWallet(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendToPresale(provider: ContractProvider, via: Sender, value: bigint) {
        if (!await this.isActive(provider)) {
            throw new Error('Presale is currently paused');
        }

        const comment = generateTransactionComment(via.address!, value);
        const commentCell = encodeComment(comment);
        
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x123456, 32) // op code for sending to presale
                .storeRef(commentCell)
                .endCell(),
        });
    }

    async withdrawEmergency(provider: ContractProvider, via: Sender, toAddress: Address) {
        // Проверяем, что вызывающий - владелец
        if (!via.address?.equals(OWNER_ADDRESS)) {
            throw new Error('Only owner can withdraw emergency');
        }

        const state = await provider.get('get_balance', []);
        const balance = state.stack.readBigNumber();
        const comment = generateTransactionComment(via.address, balance);
        const commentCell = encodeComment(comment);
        
        await provider.internal(via, {
            value: BigInt('100000000'), // 0.1 TON for gas
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x789abc, 32) // op code for emergency withdrawal
                .storeAddress(toAddress)
                .storeRef(commentCell)
                .endCell(),
        });
    }

    async togglePresale(provider: ContractProvider, via: Sender) {
        // Проверяем, что вызывающий - владелец
        if (!via.address?.equals(OWNER_ADDRESS)) {
            throw new Error('Only owner can toggle presale');
        }

        await provider.internal(via, {
            value: BigInt('100000000'), // 0.1 TON for gas
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0xabcdef, 32) // op code for toggling presale
                .endCell(),
        });
    }

    async refundTransaction(provider: ContractProvider, via: Sender, userAddress: Address, amount: bigint) {
        // Проверяем, что вызывающий - владелец
        if (!via.address?.equals(OWNER_ADDRESS)) {
            throw new Error('Only owner can refund transactions');
        }

        const comment = generateTransactionComment(via.address, amount) + '-REFUND';
        const commentCell = encodeComment(comment);
        
        await provider.internal(via, {
            value: amount + BigInt('100000000'), // amount + 0.1 TON for gas
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0xdef123, 32) // op code for refund
                .storeAddress(userAddress)
                .storeCoins(amount)
                .storeRef(commentCell)
                .endCell(),
        });
    }

    async isActive(provider: ContractProvider): Promise<boolean> {
        const state = await provider.get('get_active', []);
        return state.stack.readBoolean();
    }
}
