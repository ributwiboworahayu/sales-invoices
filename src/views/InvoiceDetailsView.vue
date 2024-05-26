<script setup>

import {ref} from 'vue';
import {useRouter} from 'vue-router';
import InvoiceDetails from "@/components/InvoiceDetails.vue"

const router = useRouter();
const invoiceId = ref(router.currentRoute.value.params.invoiceId)
</script>

<template>
  <div class="container d-flex justify-content-center align-items-center mt-2">
    <div class="card col-lg mx-2 my-2 shadow">
      <div class="mx-2 mt-2">
        <RouterLink class="btn btn-outline-secondary" to="/invoices">
          <i class="bi bi-arrow-left"></i> Back
        </RouterLink>
      </div>
      <div class="card mx-2 my-2">
        <div class="card-body">
          <InvoiceDetails :invoiceId="invoiceId"/>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
</style>