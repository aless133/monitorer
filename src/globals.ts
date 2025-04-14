const env = import.meta.env ? import.meta.env : process.env;

export const apiUrl = env.MONITORER_API_URL;
export const loopInterval = env.LOOP_INTERVAL || 999999;
export const refetchInterval = env.MONITORER_REFETCH_INTERVAL || 999999;

export const ErrAuth = "401 Unauthorized";