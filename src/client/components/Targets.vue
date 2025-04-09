<script setup lang="ts">
import Indicator from "@/client/ui/Indicator.vue";
import { useQueryList } from '@/client/query/common'
import { useRouter } from 'vue-router';
import type { TTarget } from "@/types";
const { data: targets, isPending, error } = useQueryList<TTarget>("targets");

const router = useRouter();
function handleClick(id: string) {
  console.log('Form canceled');
  router.push({ name: 'target-update', params: { id } });
}

</script>

<template>
  <div class="c-targets">
    <Indicator :isPending="isPending" :error="error" />
    <div v-if="targets" class="min-h-16">
      <h1 class="text-xl">Список целей</h1>
      <ul class="list bg-base-100 rounded-box shadow-md">
        <li v-for="target in targets" class="list-row">
          <div class="list-col-grow">
            <div>{{ target.source }}</div>
            <div v-if="target.url" class="text-xs uppercase font-semibold opacity-60">{{ target.url }}</div>
          </div>
          <button class="btn btn-square btn-ghost" @click="() => handleClick(target.id)">
            <svg class="size-[2em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
              stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
          </button>
        </li>
      </ul>
      список айтемов
    </div>
    <div class="text-center">
      <RouterLink :to="{ name: 'target-create' }" class="btn1 !btn-primary">Добавить</RouterLink>
    </div>
  </div>
</template>

<style scoped></style>
