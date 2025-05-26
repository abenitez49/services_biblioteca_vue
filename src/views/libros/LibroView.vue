<template>
  <div class="container mt-5">
    <div class="card shadow-sm border-0">
      <div class="card-header bg-light border-bottom d-flex justify-content-between align-items-center">
        <h5 class="mb-0 text-primary fw-semibold">📚 Lista de Libros</h5>
        <input
          v-model="busqueda"
          class="form-control w-50"
          type="text"
          placeholder="🔍 Buscar por nombre..."
        />

      </div>

      <div class="card-body bg-white p-0">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
          <div class="mt-2 text-muted">Cargando libros...</div>
        </div>

        <div v-else class="table-responsive" style="max-height: 500px; overflow-y: auto;">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-primary bg-opacity-10 text-primary">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Género</th>
                <th>Autor</th>
                <th>Fecha Lanzamiento</th>
                <th>Fecha Creación</th>
                <th>Última Modificación</th>
                <th class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="libro in librosFiltrados" :key="libro.id">
                <td>{{ libro.id }}</td>
                <td>{{ libro.nombre }}</td>
                <td>{{ libro.nombre_genero || '—' }}</td>
                <td>{{ libro.nombre_autor || '—' }}</td>
                <td>{{ formatFecha(libro.fecha_lanzamiento) }}</td>
                <td>{{ formatFecha(libro.fecha_creacion) }}</td>
                <td>{{ formatFecha(libro.fecha_modificacion) }}</td>
                <td class="text-center">
                  <button class="btn btn-sm btn-outline-primary me-1" @click="irEditar(libro.id)">
                    ✏️ Editar
                  </button>
                  <button class="btn btn-sm btn-outline-danger me-1" @click="eliminarLibro(libro.id)">
                    🗑️ Eliminar
                  </button>
                  <button
                    v-if="libro.archivo"
                    class="btn btn-sm btn-outline-success"
                    @click="abrirArchivo(libro.archivo)"
                    title="Abrir archivo"
                  >
                    📖 Abrir
                  </button>
                  <span v-else class="text-muted">Sin archivo</span>
                </td>
              </tr>
              <tr v-if="librosFiltrados.length === 0">
                <td colspan="8" class="text-center text-muted py-3">No se encontraron resultados.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal lectura PDF/EPUB -->
    <div
      class="modal fade"
      tabindex="-1"
      ref="modal"
      role="dialog"
      aria-labelledby="modalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content" style="height: 90vh;">
          <div class="modal-header">
            <h5 class="modal-title" id="modalLabel">{{ archivoNombre }}</h5>
            <button type="button" class="btn-close" @click="cerrarModal"></button>
          </div>
          <div class="modal-body p-0" style="height: calc(100% - 56px);">
            <!-- PDF -->
            <iframe
              v-if="tipoArchivo === 'pdf'"
              :src="archivoUrl"
              style="width: 100%; height: 100%; border: none;"
            ></iframe>

            <!-- EPUB -->
            <div v-else-if="tipoArchivo === 'epub'" ref="epubContainer" style="width: 100%; height: 100%; overflow: auto;"></div>

            <!-- No soportado -->
            <div v-else class="text-center mt-4">Tipo de archivo no soportado.</div>
          </div>

          <!-- Controles EPUB -->
          <div v-if="tipoArchivo === 'epub'" class="modal-footer">
            <button class="btn btn-secondary" @click="prevPage" :disabled="!puedeRetroceder">Anterior</button>
            <button class="btn btn-secondary" @click="nextPage" :disabled="!puedeAvanzar">Siguiente</button>
            <span class="mx-2">Página {{ paginaActual }} / {{ totalPaginas }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/api'
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle'
import ePub from 'epubjs'

export default {
  data() {
    return {
      libros: [],
      busqueda: '',
      loading: true,
      archivoUrl: '',
      archivoNombre: '',
      tipoArchivo: '',
      modalInstance: null,
      libroEPUB: null,
      rendition: null,
      paginaActual: 1,
      totalPaginas: 0,
      puedeRetroceder: false,
      puedeAvanzar: false,
    }
  },
  computed: {
    librosFiltrados() {
      const term = this.busqueda.toLowerCase()
      return this.libros.filter(libro => libro.nombre.toLowerCase().includes(term))
    }
  },
  methods: {
    async fetchLibros() {
      this.loading = true
      try {
        const { data } = await api.get('/libros')
        if (data.success) {
          this.libros = data.data.map(libro => ({
            ...libro,
            nombre_genero: libro.id_genero_fk ? `Género ${libro.id_genero_fk}` : null,
            nombre_autor: libro.id_autor_fk ? `Autor ${libro.id_autor_fk}` : null,
          }))
        } else {
          console.warn('La API no devolvió success = true')
        }
      } catch (error) {
        console.error('Error al obtener libros:', error)
      } finally {
        this.loading = false
      }
    },
    formatFecha(fecha) {
      if (!fecha) return '—'
      return new Date(fecha).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    },
    irEditar(id) {
      this.$router.push(`/edit/${id}`) // Ajusta ruta a tu vista editar libro
    },
    async eliminarLibro(id) {
      if (!confirm('¿Estás seguro de eliminar este libro?')) return
      try {
        const res = await api.delete(`/libros/${id}`)
        if (res.data.success) {
          this.libros = this.libros.filter(l => l.id !== id)
        } else {
          alert('No se pudo eliminar el libro')
        }
      } catch (error) {
        console.error('Error al eliminar libro:', error)
      }
    },
    abrirArchivo(archivoPath) {
      const baseUrl = process.env.VUE_APP_API_URL || 'http://localhost:8000'
      const urlCompleta = `${baseUrl}${archivoPath.startsWith('/') ? '' : '/'}${archivoPath}`

      this.archivoUrl = urlCompleta
      this.archivoNombre = archivoPath.split('/').pop()
      this.tipoArchivo = this.archivoNombre.split('.').pop().toLowerCase()

      this.abrirModal()

      if (this.tipoArchivo === 'epub') {
        // Esperar evento que indica que el modal ya está visible
        this.modalInstance._element.addEventListener('shown.bs.modal', () => {
          this.cargarEPUB(urlCompleta)
        }, { once: true })  // Que escuche solo una vez
      }
    },
    abrirModal() {
      if (!this.modalInstance) {
        this.modalInstance = new bootstrap.Modal(this.$refs.modal)
      }
      this.modalInstance.show()
    },
    cerrarModal() {
      if (this.modalInstance) this.modalInstance.hide()

      // Limpiar EPUB al cerrar
      if (this.rendition) {
        this.rendition.destroy()
        this.rendition = null
      }
      this.libroEPUB = null
      this.paginaActual = 1
      this.totalPaginas = 0
      this.puedeRetroceder = false
      this.puedeAvanzar = false
    },
    cargarEPUB(url) {
      if (this.rendition) {
        this.rendition.destroy()
        this.rendition = null
      }

      this.libroEPUB = ePub(url)
      this.rendition = this.libroEPUB.renderTo(this.$refs.epubContainer, {
        width: '100%',
        height: '100%',
      })

      this.rendition.display()

      this.libroEPUB.ready.then(() => {
        this.libroEPUB.locations.generate(1000).then(() => {
          this.totalPaginas = this.libroEPUB.locations.length()
          this.puedeRetroceder = false
          this.puedeAvanzar = this.totalPaginas > 1
          this.paginaActual = 1
        })
      })

      this.rendition.on('relocated', (location) => {
        this.paginaActual = location.start.location || 1
        this.puedeRetroceder = this.paginaActual > 1
        this.puedeAvanzar = this.paginaActual < this.totalPaginas
      })
    },
    nextPage() {
      if (this.rendition) {
        this.rendition.next()
      }
    },
    prevPage() {
      if (this.rendition) {
        this.rendition.prev()
      }
    }
  },
  mounted() {
    this.fetchLibros()
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
a {
  cursor: pointer;
}
.modal-dialog {
  max-width: 90vw;
}
</style>
