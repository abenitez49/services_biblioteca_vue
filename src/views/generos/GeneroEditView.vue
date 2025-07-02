<template>
  <div class="row mt-3">
    <div class="col-md-6 offset-md-3">
      <div class="card">
        <div class="card-header bg-dark text-white text-center">Editar Género</div>
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
      id: 0,
      nombre: '',
      baseUrl: process.env.VUE_APP_API_BASE_URL,
      token: localStorage.getItem('token') || ''
    }
  },
  mounted() {
    this.id = this.$route.params.id
    this.getGenero()
  },
  methods: {
    async getGenero() {
      try {
        const response = await axios.get(`${this.baseUrl}/generos/${this.id}`, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })
        if (response.data.success) {
          this.nombre = response.data.data.nombre
        } else {
          show_alerta('No se pudo obtener los datos del género', 'error')
        }
      } catch (error) {
        console.error(error)
        show_alerta('Error al cargar el género', 'error')
      }
    },
    async guardar(event) {
      event.preventDefault()

      if (this.nombre.trim() === '') {
        show_alerta('Escribe el nombre del género', 'warning', 'nombre')
        return
      }

      try {
        const response = await axios.put(
          `${this.baseUrl}/generos/${this.id}`,
          { nombre: this.nombre.trim() },
          {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          }
        )

        if (response.data.success) {
          show_alerta('Género actualizado correctamente', 'success')
          this.$router.push('/generos')
        } else {
          show_alerta('No se pudo actualizar el género', 'error')
        }
      } catch (error) {
        console.error(error)
        show_alerta('Error al actualizar el género', 'error')
      }
    }
  }
}
</script>
