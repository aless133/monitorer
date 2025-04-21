<script setup lang="ts">
import { apiUrl } from '@/globals';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const password = ref('');
const error = ref('');

const submitLogin = async () => {
  try {
    const response = await fetch(apiUrl + '/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: password.value }),
      credentials: 'include'
    });

    if (response.ok) {
      router.push('/');
    } else {
      const data = await response.json();
      error.value = data.error || 'Login failed';
    }
  } catch (err) {
    error.value = 'Network error';
  }
};
</script>

<template>
  <div class="c-loginview flex-1 flex flex-col justify-center">
    <form @submit.prevent="submitLogin" class="card bg-base-100 shadow-xl max-w-full w-md mx-auto">
      <div class="card-body gap-8">
        <h1 class="card-title justify-center text-3xl">
          Вход в систему
        </h1>
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Пароль</legend>
          <input :class="`input input-bordered w-full ${error ? 'input-error' : ''}`" id="password" v-model="password"
            type="password" required />
          <p v-if="error" class="fieldset-label text-error">{{ error }}</p>
        </fieldset>
        <div class="card-actions justify-end mt-4">
          <button type="submit" class="btn btn-primary">OK</button>
        </div>
      </div>
    </form>
  </div>
</template>