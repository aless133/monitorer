<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { z } from 'zod';
import { getSourcesClient } from '@/server/sources';
import { TargetCreateSchema, TargetSchema } from '@/types';
import type { TTarget } from '@/types';
import { useMutationCreate, useMutationUpdate } from '@/client/query/common';
import Indicator from '@/client/ui/Indicator.vue';

const props = defineProps<{
  initialData?: TTarget;
}>();

const sources = getSourcesClient();

const emit = defineEmits<{
  (e: 'submit', data: TTarget): void;
  (e: 'cancel'): void;
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
    if (!props.initialData) TargetCreateSchema.parse(formData.value);
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
    console.log('validated, mutate!');
    if (props.initialData)
      update.mutate(formData.value)
    else
      create.mutate(formData.value);
    // console.log('emit', formData.value);
    // emit('submit', formData.value as TTarget);
  }
}

watch(
  () => props.initialData,
  (newValue) => {
    formData.value = { ...newValue };
  },
  { deep: true }
);

const create = useMutationCreate<TTarget>("targets");
console.log(create);
const update = useMutationUpdate<TTarget>("targets", props.initialData?.id as string);

watch([create.isSuccess,update.isSuccess], ([s1,s2]) => {
  if (s1 || s2) {
    console.log('Mutation succeeded!')
    emit('submit', formData.value as TTarget);
  }
})

</script>

<template>
  <Indicator :isPending="create.isPending.value" :error="create.error.value" />
  <Indicator :isPending="update.isPending.value" :error="update.error.value" />
  <form @submit.prevent="handleSubmit" class="c-targetform card bg-base-100 shadow-xl max-w-sm m-auto">
    <div class="card-body gap-8">
      <h2 class="card-title justify-center">
        {{ initialData?.id ? 'Редактировать цель' : 'Добавить цель' }}
      </h2>

      <input v-if="initialData?.id" type="hidden" v-model="formData.id" />

      <fieldset class="fieldset">
        <legend class="fieldset-legend">Источник</legend>
        <select v-model="formData.source"
          :class="`select select-bordered w-full ${errors.source ? 'select-error' : ''}`" @change="clearUrlIfNotNeeded">
          <option disabled value="">Выберите тип источника</option>
          <option v-for="source in sources" :key="source.name" :value="source.name">
            {{ source.name }}
          </option>
        </select>
        <p v-if="errors.url" class="fieldset-label text-error">{{ errors.source }}</p>
      </fieldset>

      <fieldset v-if="needsUrl" class="fieldset">
        <legend class="fieldset-legend">URL</legend>
        <input v-model="formData.url" type="url" placeholder="https://example.com"
          :class="`input input-bordered w-full ${errors.url ? 'input-error' : ''}`" />
        <p v-if="errors.url" class="fieldset-label text-error">{{ errors.url }}</p>
      </fieldset>

      <div class="card-actions justify-end mt-4">
        <button type="submit" class="btn btn-primary">OK</button>
        <button @click="emit('cancel')" type="button" class="btn btn-neutral">Отмена</button>
      </div>
    </div>
  </form>
</template>
