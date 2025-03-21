<script setup lang="ts">
import Alert from "@/client/ui/Alert.vue";
// import { Ref } from "vue";
const props = defineProps<{
  isPending: boolean, //Ref<false, false> | Ref<true, true>,
  error: Error | null, //Ref<Error, Error> | Ref<null, null>,
}>()
</script>

<template>
  <div v-if="isPending || error" class="c-indicator min-h-16">
    <span v-if="isPending" class="loading loading-spinner loading-xl"></span>
    <Alert v-if="error" type="error" :text="error.message" />
  </div>
</template>

<style scoped></style>