import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';

export type PresaleConfig = {
    owner: Address;
    tokenPrice: bigint;
    minPurchase: bigint;
    maxPurchase: bigint;
};

export function presaleConfigToCell(config: PresaleConfig): Cell {
    return beginCell()
        .storeAddress(config.owner)
        .storeCoins(config.tokenPrice)
        .storeCoins(config.minPurchase)
        .storeCoins(config.maxPurchase)
        .endCell();
}

export class Presale implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Presale(address);
    }

    static createFromConfig(config: PresaleConfig, code: Cell, workchain = 0) {
        const data = presaleConfigToCell(config);
        const init = { code, data };
        return new Presale(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendPurchase(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x123456, 32) // op code for purchase
                .endCell(),
        });
    }
}
