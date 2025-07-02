<template>
  <div class="container mt-5">
    <div class="card shadow-sm border-0">
      <!-- CABECERA -->
      <div class="card-header bg-light border-bottom d-flex justify-content-between align-items-center">
        <h5 class="mb-0 text-success fw-semibold">⭐ Lista de Calificaciones</h5>
        <input
          v-model="busqueda"
          class="form-control w-50"
          type="text"
          placeholder="🔍 Buscar por descripción..."
        />
      </div>

      <!-- CUERPO -->
      <div class="card-body bg-white p-0">
        <!-- Cargando -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-success" role="status"></div>
          <div class="mt-2 text-muted">Cargando calificaciones...</div>
        </div>

        <!-- Tabla -->
        <div v-else class="table-responsive" style="max-height: 500px; overflow-y: auto;">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-success bg-opacity-10 text-success">
              <tr>
                <th>ID</th>
                <th>Valor</th>
                <th>Descripción</th>
                <th>ID Libro</th>
                <th>Usuario Creador</th>
                <th>Fecha Creación</th>
                <th>Última Modificación</th>
                <th class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="calificacion in calificacionesFiltradas" :key="calificacion.id">
                <td>{{ calificacion.id }}</td>
                <td>{{ calificacion.valor }}</td>
                <td>{{ calificacion.descripcion }}</td>
                <td>{{ calificacion.libro_nombre }}</td>
                <td>{{ calificacion.usuario_creador_username }}</td>
                <td>{{ formatFecha(calificacion.fecha_creacion) }}</td>
                <td>{{ formatFecha(calificacion.fecha_modificacion) }}</td>
                <td class="text-center">
                  <button @click="irEditar(calificacion.id)" class="btn btn-sm btn-outline-primary me-2">
                    ✏️ Editar
                  </button>
                  <button @click="eliminarCalificacion(calificacion.id)" class="btn btn-sm btn-outline-danger">
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
              <tr v-if="calificacionesFiltradas.length === 0">
                <td colspan="8" class="text-center text-muted py-3">
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
      calificaciones: [],
      busqueda: '',
      loading: true
    }
  },
  computed: {
    calificacionesFiltradas() {
      const term = this.busqueda.toLowerCase()
      return this.calificaciones.filter(c => c.descripcion.toLowerCase().includes(term))
    }
  },
  methods: {
    async fetchCalificaciones() {
      try {
        const { data } = await api.get('/calificaciones')
        if (data.status) {
          this.calificaciones = data.data
        } else {
          console.warn('La API no devolvió status = true')
        }
      } catch (error) {
        console.error('Error al obtener las calificaciones:', error)
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
      this.$router.push(`/calificaciones/${id}`)
    },
    async eliminarCalificacion(id) {
      if (!confirm('¿Estás seguro de eliminar esta calificación?')) return
      try {
        const res = await api.delete(`/calificaciones/${id}`)
        if (res.data.success) {
          this.calificaciones = this.calificaciones.filter(c => c.id !== id)
        } else {
          console.warn('No se pudo eliminar la calificación')
        }
      } catch (error) {
        console.error('Error al eliminar calificación:', error)
      }
    }
  },
  mounted() {
    this.fetchCalificaciones()
  }
}
</script>

<style scoped>
.table-hover tbody tr:hover {
  background-color: #e6f9f0;
  transition: background-color 0.2s ease-in-out;
}
.card {
  border-radius: 1rem;
}
</style>
