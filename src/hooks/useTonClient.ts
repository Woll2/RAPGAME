import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient } from "ton";
import { useAsyncInitialize } from "./useAsyncInitialize";

export function useTonClient() {
  const { result: client, loading } = useAsyncInitialize(
    async () => {
      try {
        const endpoint = await getHttpEndpoint({ network: "mainnet" });
        return new TonClient({ endpoint });
      } catch (error) {
        console.error('Error initializing TonClient:', error);
        return undefined;
      }
    }
  );

  return { client, loading };
}
