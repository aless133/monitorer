<script setup lang="ts">
import { TChanges } from '@/types';
const props = defineProps<{
  changes: TChanges,
}>();

</script>

<template>
  <div class="c-changes">
    <div v-if="changes.added && changes.added.length">
      Добавлено:
      <span v-for="lot in changes.added" :key="lot.key">
        {{ lot.key  }}<br>
        {{ JSON.stringify(lot.data) }}
      </span>
    </div>
    <div v-if="changes.removed && changes.removed.length">
      Удалено:
      <span v-for="lot in changes.removed" :key="lot.key">
        {{ lot.key  }}<br>
        {{ JSON.stringify(lot.data) }}
      </span>
    </div>
    <div v-if="changes.updated && changes.updated.length">
      Изменено:
      <div v-for="lot in changes.updated" :key="lot.key">
        {{ lot.key  }}
        <div v-for="(v,k) in lot.old" :key="k">
          {{ k }}: {{ v }} => {{ lot.new[k] }}
        </div>
      </div>

    </div>    
    
  </div>
</template>

<style scoped></style>