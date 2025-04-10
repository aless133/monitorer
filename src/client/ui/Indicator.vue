<script setup lang="ts">
import Alert from "@/client/ui/Alert.vue";

const props = defineProps<{
  isPending: boolean, //Ref<false, false> | Ref<true, true>,
  error: Error | null, //Ref<Error, Error> | Ref<null, null>,
}>()
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