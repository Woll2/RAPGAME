import { useEffect, useState } from 'react';
import { Address, fromNano, toNano } from 'ton-core';
import { useTonClient } from './useTonClient';
import { useTonConnect } from './useTonConnect';
import { Presale } from '../contracts/presale';
import { useQuery, useMutation } from '@tanstack/react-query';
import { TonClient } from 'ton';

export function usePresaleContract() {
    const { client } = useTonClient();
    const { sender } = useTonConnect();
    const [contract, setContract] = useState<Presale | null>(null);

    useEffect(() => {
        if (!client) return;
        
        // Здесь будет инициализация контракта
        const presaleAddress = Address.parse('YOUR_CONTRACT_ADDRESS');
        const presale = new Presale(presaleAddress);
        setContract(presale);
    }, [client]);

    const { data: balance, isLoading: balanceLoading } = useQuery(
        ['presaleBalance'],
        async () => {
            if (!client || !contract) return '0';
            try {
                const balance = await client.getBalance(contract.address);
                return fromNano(balance);
            } catch (error) {
                console.error('Error fetching balance:', error);
                return '0';
            }
        },
        { enabled: !!client && !!contract }
    );

    const { mutateAsync: purchase, isLoading: purchaseLoading } = useMutation(
        async (amount: string) => {
            if (!client || !sender || !contract) throw new Error('Client, sender or contract not initialized');
            const value = toNano(amount);
            
            // Создаем ContractProvider из TonClient
            const provider = client.provider(contract.address, {
                code: null,
                data: null
            });
            await contract.sendPurchase(provider, sender, value);
        }
    );

    return {
        balance,
        purchase,
        contract,
        sender,
        loading: balanceLoading || purchaseLoading
    };
}
