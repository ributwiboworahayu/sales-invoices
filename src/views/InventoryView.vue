<script setup>
import {onMounted, ref} from 'vue';
import cookies from 'vue-cookies';
import axios from 'axios';
import router from '@/router/index.js';
import {baseApiUrl} from "../../config.js";

const inventories = ref([]);
const loading = ref(true);

const fetchInventoryData = async () => {
  try {
    const response = await axios.get(`${baseApiUrl}products`, {
      headers: {
        Authorization: `Bearer ${cookies.get('token')}`,
      },
    });
    inventories.value = response.data.data;
  } catch (error) {
    console.error(error);
    if (error.response && error.response.status === 401) {
      alert('Unauthorized. Please login again');
      await router.push('/login');
    } else {
      alert('Something went wrong: ' + error);
    }
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchInventoryData();
});
</script>

<template>
  <div class="container d-flex justify-content-center align-items-center mt-2">
    <div class="card col-lg mx-2 my-2 shadow">
      <div class="mx-2 mt-2">
        <RouterLink class="btn btn-outline-secondary" to="/inventory/add">
          <i class="bi bi-plus"></i> Add New Inventory
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
                  <th scope="col">Description</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Price</th>
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
                <tr v-else v-for="inventory in inventories" :key="inventory.id">
                  <td>{{ inventory.id }}</td>
                  <td>{{ inventory.name }}</td>
                  <td>{{ inventory.quantity }}</td>
                  <td>{{ inventory.price }}</td>
                  <td>{{ inventory.description }}</td>
                  <td>{{ new Date(inventory.updated_at).toLocaleString() }}</td>
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

