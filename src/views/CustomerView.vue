<script setup>

import {onMounted, ref} from "vue";
import cookies from "vue-cookies";
import axios from "axios";
import router from "@/router/index.js";
import {baseApiUrl} from "../../config.js";

const customers = ref([])
const loading = ref(true)

const mountDataCustomer = async () => {
  await axios.get(`${baseApiUrl}customers`, {
    headers: {
      Authorization: `Bearer ${cookies.get('token')}`
    }
  }).catch(error => {
    console.log(error);
    if (error.response.status === 401) {
      alert('Unauthorized. Please login again');
      router.push('/login')
    } else {
      alert('Something went wrong: ' + error)
    }
  }).then(response => {
    customers.value = response.data.data
  }).finally(() => {
    loading.value = false
  })
}

onMounted(() => {
  mountDataCustomer()
})
</script>

<template>
  <div class="container d-flex justify-content-center align-items-center mt-2">
    <div class="card col-lg mx-2 my-2 shadow">
      <div class="mx-2 mt-2">
        <RouterLink class="btn btn-outline-secondary" to="/customers/add">
          <i class="bi bi-plus"></i> Add New Customer
        </RouterLink>
      </div>
      <div class="card mx-2 my-2">
        <div class="card-body">

          <div class="container mt-3">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Address</th>
                  <th scope="col">Created At</th>
                  <th scope="col">Updated At</th>
                </tr>
                </thead>
                <tbody>
                <tr v-if="loading">
                  <td colspan="7" class="text-center align-middle">
                    <div class="spinner-border text-primary" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
                <tr v-else v-for="customer in customers" :key="customer.id">
                  <td>{{ customer.id }}</td>
                  <td>{{ customer.name }}</td>
                  <td>{{ customer.email }}</td>
                  <td>{{ customer.phone }}</td>
                  <td>{{ customer.address }}</td>
                  <td>{{ new Date(customer.created_at).toLocaleString() }}</td>
                  <td>{{ new Date(customer.updated_at).toLocaleString() }}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>