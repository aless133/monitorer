import { apiUrl } from '@/globals';
import { useQueryClient, useQuery, useMutation, UseQueryOptions } from '@tanstack/vue-query';
import { computed } from 'vue';

interface QueryParams {
  [key: string]: string | number | boolean | undefined;
}

export const useQueryList = <T>(
  key: string,
  params: QueryParams = {},
  queryOptions: Omit<UseQueryOptions<T[], Error>, 'queryKey' | 'queryFn'> = {}
) => {
  return useQuery({
    queryKey: [key],
    queryFn: async () => {
      const url = new URL(`${apiUrl}/${key}`);
      Object.entries(params).forEach(([key, value]) => {
        if (value != null) url.searchParams.append(key, String(value));
      });
      return request<T[]>(url);
    },
    ...queryOptions,
  });
};

interface Identifiable {
  id: string | number;
}

export const useQueryMap = <T extends Identifiable>(
  key: string,
  params: QueryParams = {},
  queryOptions: Omit<UseQueryOptions<T[], Error>, 'queryKey' | 'queryFn'> = {}
) => {
  const queryResult = useQueryList(key, params, queryOptions);
  const map = computed(() => {
    if (!queryResult.data.value) return new Map<string, T>();
    return new Map(queryResult.data.value.map((item) => [String(item.id), item]));
  });
  return {
    ...queryResult,
    map,
  };
};

export const useQueryRecs = <T extends Identifiable>(
  key: string,
  params: QueryParams = {},
  queryOptions: Omit<UseQueryOptions<T[], Error>, 'queryKey' | 'queryFn'> = {}
) => {
  const queryResult = useQueryList(key, params, queryOptions);
  const recs = computed(() => {
    const rec: Record<string, T> = {};
    if (queryResult.data.value)
      queryResult.data.value.forEach((i) => {
        rec[i.id] = i;
      });
    return rec;
  });
  return {
    ...queryResult,
    recs,
  };
};

export const useQueryOne = <T>(
  key: string,
  id: string,
  queryOptions: Omit<UseQueryOptions<T[], Error>, 'queryKey' | 'queryFn'> = {}
) => {
  return useQuery({
    queryKey: [key, id],
    queryFn: async () => {
      const url = new URL(`${apiUrl}/${key}/${id}`);
      return request<T>(url);
    },
    ...queryOptions,
  });
};

export const useMutationCreate = <T>(key: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<T>) => {
      const url = new URL(`${apiUrl}/${key}`);
      return request<T>(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [key] });
    },
  });
};

export const useMutationUpdate = <T>(key: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { id: string; data: Partial<T> }) => {
      const url = new URL(`${apiUrl}/${key}/${data.id}`);
      return request<T>(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data.data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [key] });
    },
  });
};

export const useMutationDelete = (key: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const url = new URL(`${apiUrl}/${key}/${id}`);
      return request<null>(url, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [key] });
    },
  });
};

export const request = async <T>(url: URL, init?: RequestInit) => {
  const response = await fetch(url.toString(), init);
  if (!response.ok) {
    let errorMessage = `Ошибка запроса ${url.toString()} - ${response.status} ${response.statusText}`;
    const errorText = await response.text();
    if (errorText) {
      errorMessage += `: ${errorText}`;
    }
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
  if (init?.method == 'DELETE') return null;
  return response.json() as Promise<T>;
};
