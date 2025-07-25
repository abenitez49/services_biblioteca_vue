import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import CreateView from '../views/CreateView.vue';
import EditView from '../views/EditView.vue';
import AboutView from '../views/AboutView.vue';
import GraficaView from '../views/GraficaView.vue';
import ReporteView from '../views/ReporteView.vue';
import GeneroView from '../views/generos/GeneroView.vue';
import AutoresView from '../views/autores/AutoresView.vue';
import AutorEditView from '../views/autores/AutorEditView.vue';
import LibroView from '../views/libros/LibroView.vue';
import LibroCreateView from '../views/libros/LibroCreateView.vue';
import CalificacionesView from '../views/calificaciones/CalificacionesView.vue';
import GeneroEditView from '../views/generos/GeneroEditView.vue';
import GeneroCreateView from '../views/generos/GeneroCreateView.vue';





const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/create',
    name: 'create',
    component: CreateView
  }
  ,
  {
    path: '/edit/:id',
    name: 'edit',
    component: EditView
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  },
  {
    path: '/grafica',
    name: 'grafica',
    component: GraficaView
  },
  {
    path: '/reporte',
    name: 'reporte',
    component: ReporteView
  },
  {
    path: '/generos',
    name: 'genero',
    component: GeneroView
  },
  {
    path: '/autores',
    name: 'autores',
    component: AutoresView
  },
  {
    path: '/autores/:id',
    name: 'autor_edit',
    component: AutorEditView
  },
  {
    path: '/libros',
    name: 'libros',
    component: LibroView
  },
  {
    path: '/libros/crear',
    name: 'libro_crear',
    component: LibroCreateView
  },
  {
    path: '/calificaciones',
    name: 'calificaciones',
    component: CalificacionesView
  },
  {
    path: '/generos/:id',
    name: 'genero_edit',
    component: GeneroEditView
  },
  {
    path: '/generos/crear',
    name: 'genero_crear',
    component: GeneroCreateView
  }
  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: 'active', 
  linkExactActiveClass: 'active',
})

export default router
