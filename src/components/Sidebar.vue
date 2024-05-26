<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
})
</script>

<template>
  <!-- Sidebar-->
  <div class="border-end bg-white" id="sidebar-wrapper">
    <div class="sidebar-heading border-bottom bg-light">{{ title }}</div>
    <div class="list-group list-group-flush">
      <RouterLink class="list-group-item list-group-item-action list-group-item-light p-3" to="/">Dashboard</RouterLink>
      <RouterLink class="list-group-item list-group-item-action list-group-item-light p-3" to="/inventory">Inventory
      </RouterLink>
      <RouterLink class="list-group-item list-group-item-action list-group-item-light p-3" to="/customers">Customers
      </RouterLink>
      <RouterLink class="list-group-item list-group-item-action list-group-item-light p-3" to="/invoices">Invoices
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>

</style>