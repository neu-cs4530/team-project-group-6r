import { useState } from "react";

export default function useApi<RequestType, ResponseType>(apiFunc: (arg: RequestType) => Promise<ResponseType>) {
    const [data, setData] = useState<ResponseType>();
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);

    async function request(args: RequestType,
        onCallback?: (arg: ResponseType) => void,
        onError?: (arg: string) => void): Promise<void> {
        setLoading(true);
        try {
            const result = await apiFunc(args);
            setData(result);
            if (onCallback) onCallback(result);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message)
                if (onError !== undefined) onError(err.message);
            }
        } finally {
            setLoading(false);
        }
    }

    return {
        data,
        error,
        loading,
        request,
    }
}