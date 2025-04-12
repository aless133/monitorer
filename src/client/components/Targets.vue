<script setup lang="ts">
import type { TTarget } from "@/types";
import { refetchInterval } from "@/globals";
import Indicator from "@/client/ui/Indicator.vue";
import Time from "@/client/ui/Time.vue";
import { useRouter } from 'vue-router';
import { useQueryList, useMutationUpdate } from '@/client/query/common'
const { data: targets, isPending, error } = useQueryList<TTarget>("targets", undefined, { refetchInterval });

const router = useRouter();
function handleClick(id: string) {
  router.push({ name: 'target-update', params: { id } });
}

const update = useMutationUpdate<TTarget>("targets");
async function toggleActive(target: TTarget) {
  update.mutate({ id: target.id, data: { active: !target.active } })
};


</script>

<template>
  <div class="c-targets">
    <Indicator :isPending="isPending" :error="error" />
    <div v-if="targets" class="min-h-16">
      <div class="flex justify-between my-5">
        <h1 class="mb-0">Список целей</h1>
        <RouterLink :to="{ name: 'target-create' }" class="btn btn-primary">Добавить</RouterLink>
      </div>
      <ul class="list bg-base-100 rounded-box shadow-md text-base px-4">
        <li v-for="target in targets" :key="target.id" class="list-row">
          <div class="list-col-grow">
            <div class="font-semibold text-xl">{{ target.source }}</div>
            <div v-if="target.url" class="break-all opacity-60">{{ target.url }}</div>
            <a v-if="target.url" :href="target.url">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
              </svg>
            </a>
          </div>
          <div>
            Интервал: {{ target.interval }}<br>
            Запущено: <Time :time="target.last_run" />
          </div>
          <button class="btn btn-square btn-ghost" @click="() => handleClick(target.id)">
            <svg class="size-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
              stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
          </button>
          <div class="p-1">
            <input type="checkbox" class="toggle toggle-primary" :checked="target.active"
              @change="toggleActive(target)" />
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
