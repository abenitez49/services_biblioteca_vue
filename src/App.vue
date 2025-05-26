<template>
  <!-- NAVBAR -->
  <nav class="navbar navbar-expand-lg navbar-dark bg-success ">
    <div class="container-fluid container">
      <a class="navbar-brand" href="#">Biblioteca</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Opciones
            </a>
            <ul class="dropdown-menu">
              <li>
                <router-link class="dropdown-item" to="/">Mostrar</router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/create">Crear</router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/grafica">Gráfica</router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/reporte">Reporte</router-link>
              </li>
            </ul>
          </li>



          <li class="nav-item">
            <router-link to="/generos" class="nav-link">Géneros</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/autores" class="nav-link">Autores</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/libros" class="nav-link">Libros</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/calificaciones" class="nav-link">Calificaciones</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <!-- CONTENIDO DE RUTAS -->
  <div class="container-fluid mt-3">
    <router-view />
  </div>

  <!-- MODAL DE LOGIN -->
  <LoginModal v-if="mostrarLogin" @cerrar="mostrarLogin = false" />
</template>

<script>
import LoginModal from './components/LoginModal.vue'

export default {
  components: { LoginModal },
  data() {
    return {
      mostrarLogin: false
    }
  },
  mounted() {
    // Escucha evento lanzado cuando expira token (interceptor axios)
    window.addEventListener('jwt-expired', () => {
      this.mostrarLogin = true
      localStorage.removeItem('token') // Borra token vencido
    })

    // Si no hay token, mostrar login directamente
    if (!localStorage.getItem('token')) {
      this.mostrarLogin = true
    }
  }
}
</script>
