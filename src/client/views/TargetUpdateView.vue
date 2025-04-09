<script setup lang="ts">

import Indicator from "@/client/ui/Indicator.vue";
import { useQueryOne } from '@/client/query/common'
import { useRoute, useRouter } from 'vue-router';
import type { TTarget } from "@/types";
import TargetForm from '@/client/components/TargetForm.vue';

const route = useRoute();
const router = useRouter();
const { data: target, isPending, error } = useQueryOne<TTarget>("targets", route.params.id as string);

function handleClose() {
  router.push({ name: 'home' });
}
</script>

<template>
  <div class="c-targetupdateview">
    <Indicator :isPending="isPending" :error="error" />
    <TargetForm v-if="target" :initial-data="target" @close="handleClose" />
  </div>
</template>

<style scoped></style>
