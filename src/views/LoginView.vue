<script setup>
import {ref} from "vue";
import axios from "axios";
import router from "@/router/index.js";
import cookies from 'vue-cookies';
import {baseApiUrl} from "../../config.js";

const emailInput = ref('');
const passwordInput = ref('');
const loading = ref(false);

const submit = () => {
  login();
};

async function login() {
  loading.value = true; // Set loading to true when starting the request
  try {
    const response = await axios.post(`${baseApiUrl}auth/login`, {
      email: emailInput.value,
      password: passwordInput.value
    });

    if (response.data.status === 'success') {
      cookies.set('token', response.data.data.access_token, '1d');
      alert('Login successful');
      await router.push('/');
    } else {
      alert(response.data.message);
    }
  } catch (error) {
    console.error(error);
    alert('Something went wrong: ' + error);
  } finally {
    loading.value = false; // Set loading to false after the request completes (whether successful or not)
  }
}
</script>

<template>
  <div class="container pt-3 px-5">
    <div class="card">
      <div class="card-body mx-3">
        <h3 class="card-title text-center mb-3">Login</h3>

        <form @submit.prevent="submit">
          <!-- Email input -->
          <div data-mdb-input-init class="form-outline mb-2">
            <label class="form-label" for="loginEmailInput">Email address</label>
            <input type="email" id="loginEmailInput" class="form-control" v-model="emailInput" required/>
          </div>

          <!-- Password input -->
          <div data-mdb-input-init class="form-outline mb-4">
            <label class="form-label" for="loginPasswordInput">Password</label>
            <input type="password" id="loginPasswordInput" class="form-control" minlength="6" v-model="passwordInput"
                   required/>
          </div>

          <!-- Submit button with loading indicator -->
          <button type="submit" class="btn btn-primary btn-block mb-4" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            <span v-else>Sign in</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
