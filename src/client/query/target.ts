import { apiUrl, ErrAuth } from '@/globals';
import { useQueryClient, useQuery, useMutation, UseQueryOptions } from '@tanstack/vue-query';
import { computed } from 'vue';
import { request } from '@/client/query/common';

interface QueryParams {
  [key: string]: string | number | boolean | undefined;
}

export const useMutationTargetRun = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { id: string }) => {
      const url = new URL(`${apiUrl}/target/${data.id}/run`);
      return request(url, {
        method: 'POST',
      });
    },
    onSuccess: () => {
      console.log('useMutationTargetRun invalidate');
      queryClient.invalidateQueries({ queryKey: ['targets'] });
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
    onError: (error) => {
      console.error('Mutation error:', error);
    },
    onSettled: () => {
      // This runs after success or error
      console.log('Mutation settled');
    }    
  });
};
