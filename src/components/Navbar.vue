<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
})
</script>

<template>
  <!-- Top navigation-->
  <nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
    <div class="container-fluid">
      <button class="btn btn-outline-info" id="sidebarToggle">
        <i class="bi bi-fullscreen-exit"></i>
      </button>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span
          class="navbar-toggler-icon"></span></button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ms-auto mt-2 mt-lg-0">
          <li class="nav-item active">
            <RouterLink to="/" class="nav-link">Home</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/about" class="nav-link">About</RouterLink>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown"
               aria-haspopup="true" aria-expanded="false">
              <i class="bi bi-person-circle"></i>
            </a>
            <div class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              <RouterLink class="dropdown-item" to="/profile">
                <i class="bi bi-person"></i>
                Profile
              </RouterLink>
              <div class="dropdown-divider"></div>
              <RouterLink class="dropdown-item" to="/logout">
                <i class="bi bi-box-arrow-right"></i>
                Logout
              </RouterLink>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>

</style>