<script setup xmlns="http://www.w3.org/1999/html">

import {RouterLink} from 'vue-router'
import InvoicesTable from "@/components/InvoicesTable.vue";

// give dummy data for now
const invoices = [
  {
    status: 'Draft',
    salesOrderNumber: 'SO-0001',
    soDate: '2021-10-01',
    customerName: 'John Doe',
    salesPerson: 'Jane Doe',
    terms: 'Net 30',
    netTotal: 1000,
    remarks: 'This is a test'
  }
]

// add to table
const addInvoice = () => {
  invoices.push({
    status: 'Draft',
    salesOrderNumber: 'SO-0002',
    soDate: '2021-10-02',
    customerName: 'Jane Doe',
    salesPerson: 'John Doe',
    terms: 'Net 30',
    netTotal: 2000,
    remarks: 'This is a test'
  })
}
</script>

<template>
  <main>
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h1 mb-0">Sales Invoices</h1>
        <!-- Add Sales Order button -->
        <RouterLink class="btn btn-outline-secondary" to="/invoices/create">
          <i class="bi bi-plus"></i> Add Sales Order
        </RouterLink>
      </div>

      <!-- Search input field -->
      <div class="col-6">
        <div class="input-group mb-3">
          <input type="text" class="form-control" placeholder="Search" aria-label="Search"
                 aria-describedby="button-addon2">
          <button class="btn btn-outline-secondary" type="button" id="button-addon2">
            <i class="bi bi-search"></i>
          </button>
        </div>
      </div>

      <InvoicesTable/>
    </div>
  </main>
</template>

<style scoped>

</style>