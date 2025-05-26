<template>
  <div class="container mt-5">
    <div class="card shadow-sm border-0">
      <!-- CABECERA -->
      <div class="card-header bg-light border-bottom d-flex justify-content-between align-items-center">
        <h5 class="mb-0 text-primary fw-semibold">📚 Lista de Géneros</h5>
        <input
          v-model="busqueda"
          class="form-control w-50"
          type="text"
          placeholder="🔍 Buscar por nombre..."
        />
      </div>

      <!-- CUERPO -->
      <div class="card-body bg-white p-0">
        <!-- Cargando -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
          <div class="mt-2 text-muted">Cargando géneros...</div>
        </div>

        <!-- Tabla -->
        <div v-else class="table-responsive" style="max-height: 500px; overflow-y: auto;">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-primary bg-opacity-10 text-primary">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Usuario Creador</th>
                <th>Fecha Creación</th>
                <th>Última Modificación</th>
                <th class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="genero in generosFiltrados" :key="genero.id">
                <td>{{ genero.id }}</td>
                <td>{{ genero.nombre }}</td>
                <td>{{ genero.usuario_creador }}</td>
                <td>{{ formatFecha(genero.fecha_creacion) }}</td>
                <td>{{ formatFecha(genero.fecha_modificacion) }}</td>
                <td class="text-center">
                  <button @click="irEditar(genero.id)" class="btn btn-sm btn-outline-primary me-2">
                    ✏️ Editar
                  </button>
                  <button @click="eliminarGenero(genero.id)" class="btn btn-sm btn-outline-danger">
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
              <tr v-if="generosFiltrados.length === 0">
                <td colspan="6" class="text-center text-muted py-3">
                  No se encontraron resultados.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/api'

export default {
  data() {
    return {
      generos: [],
      busqueda: '',
      loading: true
    }
  },
  computed: {
    generosFiltrados() {
      const term = this.busqueda.toLowerCase()
      return this.generos.filter(g => g.nombre.toLowerCase().includes(term))
    }
  },
  methods: {
    async fetchGeneros() {
      
      console.log('Token en localStorage:', localStorage.getItem('token'))

      try {
        const { data } = await api.get('/generos')
        if (data.success) {
          this.generos = data.data
        } else {
          console.warn('La API no devolvió success = true')
        }
      } catch (error) {
        console.error('Error al obtener los géneros:', error)
      } finally {
        this.loading = false
      }
    },
    formatFecha(fecha) {
      return new Date(fecha).toLocaleString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    irEditar(id) {
      this.$router.push(`/generos/editar/${id}`)
    },
    async eliminarGenero(id) {
      if (!confirm('¿Estás seguro de eliminar este género?')) return
      try {
        const res = await api.delete(`/generos/${id}`)
        if (res.data.success) {
          this.generos = this.generos.filter(g => g.id !== id)
        } else {
          console.warn('No se pudo eliminar el género')
        }
      } catch (error) {
        console.error('Error al eliminar género:', error)
      }
    }
  },
  mounted() {
    this.fetchGeneros()
  }
}
</script>

<style scoped>
.table-hover tbody tr:hover {
  background-color: #e9f5ff;
  transition: background-color 0.2s ease-in-out;
}
.card {
  border-radius: 1rem;
}
</style>
