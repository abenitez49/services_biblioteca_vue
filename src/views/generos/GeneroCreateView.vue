<template>
  <div class="row mt-3">
    <div class="col-md-6 offset-md-3">
      <div class="card">
        <div class="card-header bg-dark text-white text-center">
          Crear Género
        </div>
        <div class="card-body">
          <form @submit="guardar">
            <div class="input-group mb-3">
              <span class="input-group-text"><i class="fa-solid fa-book-open"></i></span>
              <input
                type="text"
                v-model="nombre"
                id="nombre"
                class="form-control"
                maxlength="100"
                placeholder="Nombre del género"
                required
              />
            </div>
            <div class="d-grid col-6 mx-auto">
              <button class="btn btn-success">
                <i class="fa-solid fa-floppy-disk"></i> Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { show_alerta } from '@/funciones'
import axios from 'axios'

export default {
  data() {
    return {
      nombre: '',
      baseUrl: process.env.VUE_APP_API_BASE_URL,
      token: localStorage.getItem('token') || ''
    }
  },
  methods: {
    async guardar(event) {
      event.preventDefault()

      if (this.nombre.trim() === '') {
        show_alerta('Escribe el nombre del género', 'warning', 'nombre')
        return
      }

      try {
        const response = await axios.post(
          `${this.baseUrl}/generos`,
          { nombre: this.nombre.trim() },
          {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          }
        )

        if (response.data.success) {
          show_alerta('Género creado correctamente', 'success')
          this.$router.push('/generos')
        } else {
          show_alerta('No se pudo crear el género', 'error')
        }
      } catch (error) {
        console.error(error)
        show_alerta('Error al crear el género', 'error')
      }
    }
  }
}
</script>
