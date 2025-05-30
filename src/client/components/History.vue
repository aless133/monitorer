<script setup lang="ts">
import type { THistory, TTarget } from '@/types';
import { refetchInterval } from '@/globals';
import Indicator from '@/client/ui/Indicator.vue';
import Time from '@/client/ui/Time.vue';
import Changes from '@/client/ui/Changes.vue';
import { useQueryList, useQueryRecs } from '@/client/query/common';
import { computed } from 'vue';

const props = defineProps<{
  targetId?: string;
}>();

const { recs: targetsRecs, isPending: targetsIsPending, error: targetsError } = useQueryRecs<TTarget>('targets');
const {
  data: history,
  isPending: historyIsPending,
  error: historyError,
} = useQueryList<THistory>('history', props.targetId ? { target: props.targetId } : {}, { refetchInterval });

const hist = computed(() => {
  if (!history.value) return [];
  return [...history.value].sort((a, b) => b.dt - a.dt);
});
</script>

<template>
  <div class="c-history">
    <Indicator :isPending="targetsIsPending || historyIsPending" :error="targetsError || historyError" />
    <div v-if="history && history.length" class="indicator-ready box1">
      <h2 class="box1-title">Журнал</h2>
      <div class="box1-inner overflow-x-auto">
        <table class="table mt-0 mb-0">
          <thead>
            <tr>
              <th>Время</th>
              <th v-if="!targetId">Цель</th>
              <th>Лот</th>
              <th>Изменения</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="historyItem in hist" :key="historyItem.id">
              <td><Time :time="historyItem.dt" /></td>
              <td v-if="!targetId">{{ targetsRecs[historyItem.target]?.source }}</td>
              <td>{{ historyItem.key }}</td>
              <td>
                <div v-if="!historyItem.old">
                  Добавлено:
                  <div v-for="(v, k) in historyItem.new" :key="k">{{ k }}: {{ v }}</div>
                </div>
                <div v-if="!historyItem.new">
                  Удалено:
                  <div v-for="(v, k) in historyItem.old" :key="k">{{ k }}: {{ v }}</div>
                </div>
                <div v-if="historyItem.new && historyItem.old">
                  <div v-for="(v, k) in historyItem.old" :key="k">{{ k }}: {{ v }} => {{ historyItem.new[k] }}</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
