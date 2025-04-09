<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { z } from 'zod';
import { getSourcesClient } from '@/server/sources';
import { TargetNewSchema, TargetSchema } from '@/types';
import type { TTarget } from '@/types';

const props = defineProps<{
  initialData?: Partial<TTarget>;
}>();

const sources = getSourcesClient();

const emit = defineEmits<{
  (e: 'submit', data: TTarget): void;
}>();

// Form state
const formData = ref<Partial<TTarget>>({
  ...props.initialData,
  url: props.initialData?.url || undefined,
});

// Form errors
const errors = ref<Record<string, string>>({});

// Computed property to check if URL is needed
const needsUrl = computed(() => {
  const selectedSource = sources.find((s) => s.name === formData.value.source);
  return selectedSource?.needsUrl ?? false;
});

function clearUrlIfNotNeeded() {
  if (!needsUrl.value) {
    formData.value.url = undefined;
  }
}

function validate(): boolean {
  try {
    if (!props.initialData) TargetNewSchema.parse(formData.value);
    else TargetSchema.parse(formData.value);
    errors.value = {};
    console.log('validated');
    return true;
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      errors.value = Object.fromEntries(error.issues.map((issue) => [issue.path[0], issue.message]));
    }
    return false;
  }
}

function handleSubmit() {
  console.log('validate');
  if (validate()) {
    console.log('emit', formData.value);
    emit('submit', formData.value as TTarget);
  }
}

// Watch for initialData changes (for edit mode)
watch(
  () => props.initialData,
  (newValue) => {
    formData.value = { ...newValue };
  },
  { deep: true }
);
</script>

<template>
  <form @submit.prevent="handleSubmit" class="c-targetform card bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title">
        {{ initialData?.id ? 'Редактировать цель' : 'Добавить цель' }}
      </h2>

      <!-- Hidden ID field for edits -->
      <input v-if="initialData?.id" type="hidden" v-model="formData.id" />

      <!-- Source Select -->
      <div class="form-control">
        <label class="label">
          <span class="label-text">Source</span>
        </label>
        <select
          v-model="formData.source"
          :class="`select select-bordered ${errors.source ? 'select-error' : ''}`"
          @change="clearUrlIfNotNeeded"
        >
          <option disabled value="">Select a source</option>
          <option v-for="source in sources" :key="source.name" :value="source.name">
            {{ source.name }}
          </option>
        </select>
        <label v-if="errors.source" class="label">
          <span class="label-text-alt text-error">{{ errors.source }}</span>
        </label>
      </div>

      <!-- Conditional URL Field -->
      <div v-if="needsUrl" class="form-control">
        <label class="label">
          <span class="label-text">URL</span>
        </label>
        <input
          v-model="formData.url"
          type="url"
          placeholder="https://example.com"
          :class="`input input-bordered ${errors.url ? 'input-error' : ''}`"
        />
        <label v-if="errors.url" class="label">
          <span class="label-text-alt text-error">{{ errors.url }}</span>
        </label>
      </div>

      <div class="card-actions justify-end mt-4">
        <button type="submit" class="btn btn-primary">Сохранить</button>
      </div>
    </div>
  </form>
</template>
