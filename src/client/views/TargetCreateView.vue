<script setup lang="ts">
import { useRouter } from 'vue-router';
import TargetForm from '@/client/components/TargetForm.vue';
import { TTarget } from '@/types';
const router = useRouter();

function handleSubmit(data: TTarget) {
  console.log('Form submitted:', data);
  router.push({ name: 'home' });
}

function handleClose() {
  console.log('Form canceled');
  router.push({ name: 'home' });
}
</script>

<template>
  <div class="c-targetcreateview">
    <TargetForm @close="handleClose"/>
  </div>
</template>

<style scoped></style>
