import { useEffect, useState } from 'react';
import { Address, fromNano, toNano } from 'ton-core';
import { useTonClient } from './useTonClient';
import { useTonConnect } from './useTonConnect';
import { IntermediateWallet, OWNER_ADDRESS } from '../contracts/intermediateWallet';
import { useQuery, useMutation } from '@tanstack/react-query';
import { TonClient } from 'ton';

export function useIntermediateWallet() {
    const { client } = useTonClient();
    const { sender } = useTonConnect();
    const [contract, setContract] = useState<IntermediateWallet | null>(null);
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        if (!client) return;
        
        const intermediateWalletAddress = Address.parse('EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c');
        const intermediateWallet = IntermediateWallet.createFromAddress(intermediateWalletAddress);
        setContract(intermediateWallet);
    }, [client]);

    useEffect(() => {
        if (!sender?.address) return;
        setIsOwner(sender.address.equals(OWNER_ADDRESS));
    }, [sender?.address]);

    const { data: balance, isLoading: balanceLoading } = useQuery(
        ['intermediateWalletBalance'],
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

    const { data: isActive, isLoading: isActiveLoading } = useQuery(
        ['intermediateWalletActive'],
        async () => {
            if (!client || !contract) return false;
            try {
                const provider = client.provider(contract.address, {
                    code: null,
                    data: null
                });
                return await contract.isActive(provider);
            } catch (error) {
                console.error('Error checking active status:', error);
                return false;
            }
        },
        { enabled: !!client && !!contract }
    );

    const { mutateAsync: sendToPresale, isLoading: sendLoading } = useMutation(
        async (amount: string) => {
            if (!client || !sender || !contract) throw new Error('Client, sender or contract not initialized');
            if (!isActive) throw new Error('Presale is currently paused');
            
            const value = toNano(amount);
            const provider = client.provider(contract.address, {
                code: null,
                data: null
            });
            await contract.sendToPresale(provider, sender, value);
        }
    );

    const { mutateAsync: togglePresale, isLoading: toggleLoading } = useMutation(
        async () => {
            if (!client || !sender || !contract) throw new Error('Client, sender or contract not initialized');
            if (!isOwner) throw new Error('Only owner can toggle presale');
            
            const provider = client.provider(contract.address, {
                code: null,
                data: null
            });
            await contract.togglePresale(provider, sender);
        }
    );

    const { mutateAsync: refund, isLoading: refundLoading } = useMutation(
        async ({ address, amount }: { address: string; amount: string }) => {
            if (!client || !sender || !contract) throw new Error('Client, sender or contract not initialized');
            if (!isOwner) throw new Error('Only owner can refund');
            
            const provider = client.provider(contract.address, {
                code: null,
                data: null
            });
            await contract.refundTransaction(
                provider,
                sender,
                Address.parse(address),
                toNano(amount)
            );
        }
    );

    const { mutateAsync: withdraw, isLoading: withdrawLoading } = useMutation(
        async (toAddress: string) => {
            if (!client || !sender || !contract) throw new Error('Client, sender or contract not initialized');
            if (!isOwner) throw new Error('Only owner can withdraw');
            
            const provider = client.provider(contract.address, {
                code: null,
                data: null
            });
            await contract.withdrawEmergency(provider, sender, Address.parse(toAddress));
        }
    );

    return {
        balance,
        isActive,
        isOwner,
        sendToPresale,
        togglePresale,
        refund,
        withdraw,
        contract,
        sender,
        loading: balanceLoading || sendLoading || toggleLoading || refundLoading || withdrawLoading || isActiveLoading
    };
}
