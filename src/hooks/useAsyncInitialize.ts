import { useEffect, useState } from "react";

export function useAsyncInitialize<T>(
  func: () => Promise<T>,
  deps: any[] = []
): { result: T | undefined; loading: boolean } {
  const [state, setState] = useState<T | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const result = await func();
        setState(result);
      } catch (error) {
        console.error('Error in useAsyncInitialize:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, deps);

  return { result: state, loading };
}
