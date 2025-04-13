<script setup lang="ts">

import Indicator from "@/client/ui/Indicator.vue";
import Time from "@/client/ui/Time.vue";
import History from "@/client/components/History.vue";
import { useQueryList, useQueryOne } from '@/client/query/common'
import { useRoute, useRouter } from 'vue-router';
import type { TLot, TTarget } from "@/types";

const route = useRoute();
const targetId = route.params.id as string;
const { data: target, isPending: targetIsPending, error: targetError } = useQueryOne<TTarget>("targets", targetId);
const { data: lots, isPending: lotsIsPending, error: lotsErrors } = useQueryList<TLot>("lots", { target: targetId });

</script>

<template>
  <div class="c-targetviewview">
    <Indicator :isPending="targetIsPending || lotsIsPending" :error="targetError || lotsErrors" />
    <div v-if="target" class="flex gap-8">
      <div class="rounded-box shadow-md p-4 grow-1">
        <div class="font-bold">Источник: {{ target.source }}</div>
        <div>Интервал: {{ target.interval }}</div>
        <div>Запущено: <Time :time="target.last_run" /></div>
      </div>
      <div>
        <RouterLink :to="{ name: 'home' }" class="btn btn-neutral">Закрыть</RouterLink>
      </div>
    </div>
    <div v-if="lots">
      <h2 class="mb-0">Лоты<span v-if="lots">: {{ lots.length }}</span></h2>
      <ul v-if="lots" class="list bg-base-100 rounded-box shadow-md text-base px-4">
        <li v-for="lot in lots" :key="lot.id" class="list-row">
          <div class="font-bold"> {{ lot.key }}</div>
          <pre class="bg-base-300 text-black !my-0">{{ JSON.stringify(lot.data, null, 2) }}</pre>
        </li>
      </ul>
    </div>
    <History :targetId="targetId"/>
    <div>
      <RouterLink :to="{ name: 'home' }" class="btn btn-neutral">Закрыть</RouterLink>
    </div>
  </div>
</template>

<style scoped></style>
