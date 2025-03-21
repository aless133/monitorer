<script setup lang="ts">
import { ref } from "vue";
import Indicator from "@/client/ui/Indicator.vue";
import { useQueryList } from '@/client/query/common'
import type { IItem } from "@/types";
const { data: items, isPending, error } = useQueryList<IItem>("items");
</script>

<template>
  <Indicator :isPending="isPending" :error="error"/>
  <div class="c-items">
    <div v-if="items" class="min-h-16">
      список айтемов
    </div>
    <div class="text-center">
      <button class="btn btn-primary md:btn-md lg:btn-lg xl:btn-xl">Добавить</button>
    </div>
  </div>
</template>

<style scoped></style>
