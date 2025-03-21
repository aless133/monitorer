<script setup lang="ts">
import { ref } from "vue";
import { useQueryList } from '@/client/query/common'
import type { IItem } from "@/types";
const { data: items, isPending, error } = useQueryList<IItem>("items");

const count = ref(0);
</script>

<template>
  <div class="c-items h-[50dvh] flex justify-center items-center">
    <div class="text-center">
      <button class="btn btn-primary md:btn-md lg:btn-lg xl:btn-xl">Добавить</button>
    </div>
  </div>
</template>

<style scoped>

</style>
