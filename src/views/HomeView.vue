<script setup>
import axios from "axios"
import {onBeforeUnmount, onMounted, ref} from "vue"
import cookies from "vue-cookies"
import router from "@/router/index.js";
import {baseApiUrl} from "../../config.js";

// Initialize msg from localStorage if available
let msg = ref(localStorage.getItem('msg') || 'Loading...')

const fetchData = async () => {
  try {
    const response = await axios.get(`${baseApiUrl}dashboard`, {
      headers: {
        'Authorization': 'Bearer ' + cookies.get('token')
      }
    })

    if (response.data.code === 401) {
      await router.push('/login')
      return
    } else {
      msg.value = response.data.data
    }

    // Save msg to localStorage
    localStorage.setItem('msg', msg.value)
  } catch (error) {
    console.log(error)
    msg.value = 'An error occurred'
    // Save error message to localStorage
    localStorage.setItem('msg', msg.value)
  }
}

// Fetch data when component mounts
onMounted(() => {
  if (!localStorage.getItem('msg')) {
    fetchData()
  }

  // Add event listener to clear localStorage on page unload
  window.addEventListener('beforeunload', clearLocalStorage)
})

// Remove event listener when component unmounts
onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', clearLocalStorage)
})

const clearLocalStorage = () => {
  localStorage.removeItem('msg')
}
</script>

<template>
  <main>
    <div class="container">
      <h1 class="h1 mb-4">Dashboard</h1>
      <div class="alert alert-secondary" role="alert">
        {{ msg }}
      </div>
    </div>
  </main>
</template>

<style scoped>
/* Add your styles here */
</style>
