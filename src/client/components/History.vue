<script setup lang="ts">
import type { THistory, TTarget } from "@/types";
import { refetchInterval } from "@/globals";
import Indicator from "@/client/ui/Indicator.vue";
import Time from "@/client/ui/Time.vue";
import Changes from "@/client/ui/Changes.vue";
import { useQueryList, useQueryRecs } from '@/client/query/common'
import { computed } from "vue";

const props = defineProps<{
  targetId?: string;
}>();

const { recs: targetsRecs, isPending: targetsIsPending, error: targetsError } = useQueryRecs<TTarget>("targets");
const { data: history, isPending: historyIsPending, error: historyError } =
  useQueryList<THistory>("history", props.targetId ? { target: props.targetId } : {}, { refetchInterval });

const hist = computed(() => {
  if (!history.value) return [];
  return [...history.value].sort((a, b) => b.dt-a.dt);
});

</script>

<template>
  <div class="c-history">
    <Indicator :isPending="targetsIsPending || historyIsPending" :error="targetsError || historyError" />
    <div v-if="history" class="min-h-16">
      <h2 class="mb-0">Журнал</h2>
      <div class="overflow-x-auto">
        <table class="table mt-0">
          <thead>
            <tr>
              <th>Время</th>
              <th v-if="!targetId">Цель</th>
              <th>Изменения</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="historyItem in hist" :key="historyItem.id">
              <td><Time :time="historyItem.dt" /></td>
              <td v-if="!targetId">{{ targetsRecs[historyItem.target]?.source }}</td>
              <td>
                <Changes :changes="historyItem.changes" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
