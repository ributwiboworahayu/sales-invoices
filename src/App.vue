<script setup>
import {RouterView} from 'vue-router'
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import 'startbootstrap-simple-sidebar/dist/css/styles.css'
import 'startbootstrap-simple-sidebar/dist/js/scripts.js'
import 'bootstrap-icons/font/bootstrap-icons.css'

const title = document.title.split(' | ')[0]
</script>

<template>
  <div class="d-flex" id="wrapper">
    <Sidebar :title="title"/>
    <div id="page-content-wrapper">
      <Navbar :title="title"/>
      <RouterView/>
    </div>
  </div>
</template>

<style scoped>

</style>
