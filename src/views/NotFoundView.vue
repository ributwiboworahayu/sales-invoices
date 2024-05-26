<script setup>
$(document).ready(function () {
  // add hidden class to sidebar-wrapper
  $("#sidebar-wrapper").attr("hidden", true)
  $(".navbar").attr("hidden", true)

  // remove hidden when return to home
  $(".back-to-home").click(function () {
    $("#sidebar-wrapper").removeAttr("hidden")
    $(".navbar").removeAttr("hidden")
  });
});
</script>

<template>
  <div class="container text-center pt-5">
    <h1>404 Not Found</h1>
    <p>Sorry, an error has occured, Requested page not found!</p>
    <router-link to="/" class="btn back-to-home btn-outline-secondary">Back to Home</router-link>
  </div>
</template>

<style scoped>

</style>