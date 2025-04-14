<script setup lang="ts">
import Alert from '@/client/ui/Alert.vue';
import { useRouter } from 'vue-router';
import { ErrAuth } from '@/globals';
import { watch } from 'vue';
const router = useRouter();

const props = defineProps<{
  isPending: boolean; //Ref<false, false> | Ref<true, true>,
  error: Error | null; //Ref<Error, Error> | Ref<null, null>,
}>();

watch(
  () => props.error,
  (e) => {
    if (e && e.message == ErrAuth) {
      console.error('ErrAuth detected');
      router.push('login');
    }
  }
);
</script>

<template>
  <div v-if="isPending || error" class="c-indicator min-h-16">
    <div v-if="isPending" class="text-center">
      <span class="loading loading-spinner loading-xl"></span>
    </div>
    <Alert v-if="error" type="error" :text="error.message" />
  </div>
</template>

<style scoped></style>
