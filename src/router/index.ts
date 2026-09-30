import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ExploreView from '../views/ExploreView.vue'
import CreatePlanetView from '../views/CreatePlanetView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import PlanetView from '../views/PlanetView.vue'
import { useUserStore } from '../stores/user'
import CreateObjectView from '../views/CreateObjectView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
  path: '/minhas-criacoes',
  name: 'minhas-criacoes',
  component: () => import('../views/MyCreationsView.vue'),
},
      {
      path: '/explorar',
      name: 'explorar',
      component: ExploreView,
    },
      {
        path: '/criar-planeta',
        name: 'criar-planeta',
        component: CreatePlanetView,
    },
    {
  path: '/criar-objeto',
  name: 'criar-objeto',
  component: CreateObjectView,
},
{
  path: '/criar-objeto/:type',
  name: 'criar-objeto-tipo',
  component: () => import('../views/CreateObjectTypeView.vue'),
},
    
{
  path: '/planeta/:id',
  name: 'planeta',
  component: PlanetView
},

{
  path: '/objeto/:id',
  name: 'objeto',
  component: () => import('../views/SpaceObjectView.vue'),
},

    {
  path: '/login',
  name: 'login',
  component: LoginView,
},

{
  path: '/cadastro',
  name: 'cadastro',
  component: RegisterView,
},
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})
router.beforeEach((to) => {
  const userStore = useUserStore()

 if (
  (to.path === '/criar-planeta' ||
    to.path === '/criar-objeto' ||
    to.path.startsWith('/criar-objeto/')) &&
  !userStore.isLoggedIn
) {
  return '/login'
}

  return true
})

export default router
