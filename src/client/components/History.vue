<script setup lang="ts">
import type { THistory, TTarget } from "@/types";
import { refetchInterval } from "@/globals";
import Indicator from "@/client/ui/Indicator.vue";
import Time from "@/client/ui/Time.vue";
import Changes from "@/client/ui/Changes.vue";
import { useRouter } from 'vue-router';
import { useQueryList, useQueryRecs } from '@/client/query/common'
const { recs: targetRecs, isPending: targetsIsPending, error: targetsError } = useQueryRecs<TTarget>("targets");
const { data: log, isPending: logIsPending, error: logError } = useQueryList<THistory>("history", undefined, { refetchInterval });

const router = useRouter();
function handleClick(id: string) {
  router.push({ name: 'target-update', params: { id } });
}

</script>

<template>
  <div class="c-log">
    <Indicator :isPending="targetsIsPending || logIsPending" :error="targetsError || logError" />
    <div v-if="log" class="min-h-16">
      <h2 class="mb-0">Журнал</h2>
      <div class="overflow-x-auto">
        <table class="table mt-0">
          <thead>
            <tr>
              <th>Время</th>
              <th>Цель</th>
              <th>Изменения</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="logItem in log" :key="logItem.id">
              <td><Time :time="logItem.dt" /></td>
              <td>{{ targetRecs[logItem.target].source }}</td>
              <td><Changes :changes="logItem.changes"/></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
