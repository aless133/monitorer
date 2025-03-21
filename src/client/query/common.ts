import { apiUrl } from "@/globals";
import { useQueryClient, useQuery, useMutation } from "@tanstack/vue-query";

interface QueryParams {
  [key: string]: string | number | boolean;
}

export const useQueryList = <T>(key: string, params: QueryParams = {}) => {
  return useQuery({
    queryKey: [key],
    queryFn: async () => {
      const url = new URL(`${apiUrl}/${key}`);
      Object.keys(params).forEach((param) => {
        url.searchParams.append(param, String(params[param]));
      });
      return request<T[]>(url);
    },
  });
};

export const useQueryOne = <T>(key: string, id: string) => {
  return useQuery({
    queryKey: [key, id],
    queryFn: async () => {
      const url = new URL(`${apiUrl}/${key}/${id}`);
      return request<T>(url);
    },
  });
};

export const useMutationCreate = <T>(key: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<T>) => {
      const url = new URL(`${apiUrl}/${key}`);
      return request<T>(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [key] });
    },
  });
};

export const useMutationUpdate = <T>(key: string, id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<T>) => {
      const url = new URL(`${apiUrl}/${key}/${id}`);
      return request<T>(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [key] });
    },
  });
};

export const useMutationDelete = (key: string, id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const url = new URL(`${apiUrl}/${key}/${id}`);
      return request<null>(url, {
        method: "DELETE",
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
  return response.json() as Promise<T>;
};
