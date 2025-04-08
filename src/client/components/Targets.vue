<script setup lang="ts">
import { ref } from "vue";
import Indicator from "@/client/ui/Indicator.vue";
import { useQueryList } from '@/client/query/common'
import type { TTarget } from "@/types";
const { data: targets, isPending, error } = useQueryList<TTarget>("targets");
</script>

<template>
  <div class="c-targets">
    <Indicator :isPending="isPending" :error="error"/>
    <div v-if="targets" class="min-h-16">
      список айтемов
    </div>
    <div class="text-center">
      <RouterLink :to="{name:'target-new'}" class="btn1 !btn-primary">Добавить</RouterLink>
    </div>
  </div>
</template>

<style scoped></style>
