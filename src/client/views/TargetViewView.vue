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
    <div v-if="target" class="flex gap-8 mb-4">
      <div class="box1-inner text-lg grow-1">
        <div class="font-bold">Источник: {{ target.source }}</div>
        <div>Интервал: {{ target.interval }}</div>
        <div>Запущено: <Time :time="target.last_run" /></div>
        <div>Следующий: <Time :time="target.next_run" /></div>
        <div>Обновлено: <Time :time="target.last_update" /></div>
      </div>
      <div>
        <RouterLink :to="{ name: 'home' }" class="btn btn-neutral">Закрыть</RouterLink>
      </div>
    </div>
    <div v-if="lots" class="box1">
      <h2 class="box1-title">Лоты<span v-if="lots">: {{ lots.length }}</span></h2>
      <ul class="list box1-inner text-base px-4">
        <li v-for="lot in lots" :key="lot.id" class="list-row">
          <div class="font-bold"> {{ lot.key }}</div>
          <div class="bg-base-300 text-black p-2">
            <div v-for="(v,k) in lot.data" :key="k">
              {{ k }}: {{ v }}
            </div>
          </div>
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
