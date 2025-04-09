<script setup lang="ts">
import { ref } from 'vue';
import TargetForm from '@/client/components/TargetForm.vue';
import { TTarget } from '@/types';

function handleSubmit(data: TTarget) {
  console.log('Form submitted:', data);
  // Handle form submission (API call, etc.)
}
</script>

<template>
  <div class="c-targetnewview">
    <div class="container mx-auto p-4">
      <TargetForm @submit="handleSubmit" />
    </div>
    <RouterLink :to="{ name: 'home' }" class="btn1 !btn-secondary">На главную</RouterLink>
  </div>
</template>

<style scoped></style>