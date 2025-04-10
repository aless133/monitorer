<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  time?: number,
}>();

const localTime = computed(() => {
  if (!props.time) return 'Никогда';
  let dateInMilliseconds:number = props.time;
  if (dateInMilliseconds.toString().length <= 10)
    dateInMilliseconds = dateInMilliseconds * 1000;

  const date = new Date(dateInMilliseconds);
  if (!isNaN(date.getTime())) {
    return date.toLocaleString();
  }
  return '???';
});
</script>

<template>
  <span class="c-time">{{ localTime }}</span>
</template>

<style scoped></style>