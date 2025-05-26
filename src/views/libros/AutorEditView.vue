<template>
  <div class="row mt-3">
    <div class="col-md-6 offset-md-3">
      <div class="card">
        <div class="card-header bg-dark text-white text-center">Editar Autor</div>
        <div class="card-body">
          <form @submit="guardar">
            <div class="input-group mb-3">
              <span class="input-group-text"><i class="fa-solid fa-user-pen"></i></span>
              <input
                type="text"
                v-model="nombre"
                id="nombre"
                class="form-control"
                maxlength="100"
                placeholder="Nombre del autor"
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
      token: localStorage.getItem('token') || '',
    }
  },
  mounted() {
    this.id = this.$route.params.id
    this.getAutor()
  },
  methods: {
    async getAutor() {
      try {
        const response = await axios.get(`${this.baseUrl}/autores/${this.id}`, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })
        if (response.data.status) {
          this.nombre = response.data.data.nombre
        } else {
          show_alerta('No se pudo obtener los datos del autor', 'error')
        }
      } catch (error) {
        console.error(error)
        show_alerta('Error al cargar el autor', 'error')
      }
    },
    async guardar(event) {
      event.preventDefault()
      if (this.nombre.trim() === '') {
        show_alerta('Escribe el nombre del autor', 'warning', 'nombre')
        return
      }

      try {
        const response = await axios.put(
          `${this.baseUrl}/autores/${this.id}`,
          { nombre: this.nombre.trim() },
          {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          }
        )
        console.log(response.data);
        
        // Verifica si la respuesta fue exitosa
        if (response.data.status === true) {
          show_alerta('Autor actualizado correctamente', 'success')
          // Redirecciona SOLO si fue exitoso
          this.$router.push('/autores')
        } else {
          show_alerta('No se pudo actualizar el autor', 'error')
        }
      } catch (error) {
        console.error(error)
        show_alerta('Error al actualizar el autor', 'error')
      }

    }
  }
}
</script>
