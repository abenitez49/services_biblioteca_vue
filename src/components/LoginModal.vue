<template>
  <div class="modal-backdrop show">
    <div class="modal d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Sesión Expirada</h5>
          </div>
          <div class="modal-body">
            <input v-model="username" type="text" class="form-control mb-2" placeholder="Usuario" />
            <input v-model="password" type="password" class="form-control mb-2" placeholder="Contraseña" />
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="$emit('cerrar')">Cancelar</button>
            <button class="btn btn-primary" @click="login">Reiniciar sesión</button>
          </div>
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
      username: '',
      password: ''
    }
  },
  methods: {
    async login() {
      try {
        const res = await api.post('/auth/login/', {
          username: this.username,
          password: this.password
        })

        console.log('Respuesta login:', res.data) // para debug

        const token = res.data.access  // Aquí tomas el token access

        if (token) {
          localStorage.setItem('token', token)
          this.$emit('cerrar')
          window.location.reload()
        } else {
          alert('No se recibió token access en la respuesta')
        }
      } catch (err) {
        alert('Credenciales incorrectas')
      }
    }
  }
}
</script>

<style scoped>
.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
