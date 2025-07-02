<template>
  <div class="row mt-3">
    <div class="col-md-8 offset-md-2">
      <div class="card">
        <div class="card-header bg-dark text-white text-center">
          Crear Libro
        </div>
        <div class="card-body">
          <form @submit="guardar">
            <!-- Nombre del libro -->
            <div class="input-group mb-3">
              <span class="input-group-text"><i class="fa-solid fa-book"></i></span>
              <input
                type="text"
                v-model="nombre"
                class="form-control"
                placeholder="Nombre del libro"
                required
              />
            </div>

            <!-- Género -->
            <div class="input-group mb-3">
              <label class="input-group-text"><i class="fa-solid fa-tags"></i></label>
              <select v-model="id_genero_fk" class="form-select" required>
                <option disabled value="">Seleccione un género</option>
                <option v-for="genero in generos" :key="genero.id" :value="genero.id">
                  {{ genero.nombre }}
                </option>
              </select>
            </div>

            <!-- Autor -->
            <div class="input-group mb-3">
              <label class="input-group-text"><i class="fa-solid fa-user"></i></label>
              <select v-model="id_autor_fk" class="form-select" required>
                <option disabled value="">Seleccione un autor</option>
                <option v-for="autor in autores" :key="autor.id" :value="autor.id">
                  {{ autor.nombre }}
                </option>
              </select>
            </div>

            <!-- Fecha de lanzamiento -->
            <div class="input-group mb-3">
              <label class="input-group-text"><i class="fa-solid fa-calendar-days"></i></label>
              <input
                type="date"
                v-model="fecha_lanzamiento"
                class="form-control"
                required
              />
            </div>

            <!-- Archivo -->
            <div class="input-group mb-3">
              <label class="input-group-text"><i class="fa-solid fa-file-upload"></i></label>
              <input
                type="file"
                @change="handleArchivo"
                accept=".pdf,.epub"
                class="form-control"
              />
            </div>

            <!-- Botón guardar -->
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
import axios from 'axios'
import { show_alerta } from '@/funciones'


export default {
  data() {
    return {
      nombre: '',
      id_genero_fk: '',
      id_autor_fk: '',
      fecha_lanzamiento: '',
      archivo: null,
      generos: [],
      autores: [],
      baseUrl: process.env.VUE_APP_API_BASE_URL,
      token: localStorage.getItem('token') || ''
    }
  },
  methods: {
    async guardar(event) {
      event.preventDefault()

      if (!this.nombre || !this.id_genero_fk || !this.id_autor_fk || !this.fecha_lanzamiento) {
        show_alerta('Complete todos los campos requeridos', 'warning')
        return
      }

      const formData = new FormData()
      formData.append('nombre', this.nombre)
      formData.append('id_genero_fk', this.id_genero_fk)
      formData.append('id_autor_fk', this.id_autor_fk)
      formData.append('fecha_lanzamiento', this.fecha_lanzamiento)
      if (this.archivo) formData.append('archivo', this.archivo)

      try {
        const res = await axios.post(`${this.baseUrl}/libros`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${this.token}`
          }
        })

        if (res.data.success) {
          show_alerta('Libro creado correctamente', 'success')
          this.$router.push('/libros')
        } else {
          show_alerta('No se pudo crear el libro', 'error')
        }
      } catch (err) {
        console.error(err)
        show_alerta('Error al crear el libro', 'error')
      }
    },
    handleArchivo(event) {
      const file = event.target.files[0]
      if (file) {
        this.archivo = file
      }
    },
    async cargarDatos() {
      try {
        const [resGeneros, resAutores] = await Promise.all([
          axios.get(`${this.baseUrl}/generos`, {
            headers: { Authorization: `Bearer ${this.token}` }
          }),
          axios.get(`${this.baseUrl}/autores`, {
            headers: { Authorization: `Bearer ${this.token}` }
          })
        ])
        this.generos = resGeneros.data.data
        this.autores = resAutores.data.data
      } catch (error) {
        console.error('Error cargando géneros o autores:', error)
      }
    }
  },
  mounted() {
    this.cargarDatos()
  }
}
</script>
