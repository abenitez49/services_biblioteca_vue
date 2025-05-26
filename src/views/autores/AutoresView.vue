<template>
  <div class="container mt-5">
    <div class="card shadow-sm border-0">
      <!-- CABECERA -->
      <div class="card-header bg-light border-bottom d-flex justify-content-between align-items-center">
        <h5 class="mb-0 text-primary fw-semibold">🧑‍🎓 Lista de Autores</h5>
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
          <div class="mt-2 text-muted">Cargando autores...</div>
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
              <tr v-for="autor in autoresFiltrados" :key="autor.id">
                <td>{{ autor.id }}</td>
                <td>{{ autor.nombre }}</td>
                <td>{{ autor.usuario_creador_username }}</td>
                <td>{{ formatFecha(autor.fecha_creacion) }}</td>
                <td>{{ formatFecha(autor.fecha_modificacion) }}</td>
                <td class="text-center">
                  <button @click="irEditar(autor.id)" class="btn btn-sm btn-outline-primary me-2">
                    ✏️ Editar
                  </button>
                  <button @click="eliminarAutor(autor.id)" class="btn btn-sm btn-outline-danger">
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
              <tr v-if="autoresFiltrados.length === 0">
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
      autores: [],
      busqueda: '',
      loading: true
    }
  },
  computed: {
    autoresFiltrados() {
      const term = this.busqueda.toLowerCase()
      return this.autores.filter(a => a.nombre.toLowerCase().includes(term))
    }
  },
  methods: {
    async fetchAutores() {
      try {
        const { data } = await api.get('/autores')
        if (data.status) {
          this.autores = data.data
        } else {
          console.warn('La API no devolvió status = true')
        }
      } catch (error) {
        console.error('Error al obtener los autores:', error)
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
      this.$router.push(`/autores/${id}`)
    },
    async eliminarAutor(id) {
      if (!confirm('¿Estás seguro de eliminar este autor?')) return
      try {
        const res = await api.delete(`/autores/${id}`)
        if (res.data.success) {
          this.autores = this.autores.filter(a => a.id !== id)
        } else {
          console.warn('No se pudo eliminar el autor')
        }
      } catch (error) {
        console.error('Error al eliminar autor:', error)
      }
    }
  },
  mounted() {
    this.fetchAutores()
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
