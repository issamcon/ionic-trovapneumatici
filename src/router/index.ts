import { createRouter, createWebHistory } from '@ionic/vue-router';
import Tabs from '../views/Tabs.vue'
import { RouteRecordRaw, RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import { auth } from '../main'
//import { store } from "../store";
//import { computed } from "vue";

//const isAuth = computed(() => { return store.state.auth && store.state.auth.isAuth })

const guard = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  try {
    if (auth.currentUser?.uid) {
      //console.log("Guard check OK:", from, to,auth.currentUser?.displayName )
      next();
    }
    else {
      //console.log("Guard check KO:", from, to,auth.currentUser?.displayName )
      next("/login")
    }
  } catch (error) {
    next("/")
  }
}

/*const guard2 = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  try {
    if (isAuth.value) {
      //console.log("Guard check OK:", from, to,auth.currentUser?.displayName )
      next();
    }
    else {
      console.log(isAuth);
      console.log(isAuth.value);
      console.log("Guard check KO:");
      console.log(from);
      console.log(to);
      console.log(store.state.auth);
      next("/login")
    }
  } catch (error) {
    next("/")
  }
}*/


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/tab1'
  },
  {
    path: '/login',
    component: () => import('@/views/Auth.vue')
  },
  {
    path: '/tabs/',
    component: Tabs,
    children: [
      {
        path: '',
        redirect: '/tabs/tab1'
      },
      {
        path: 'tab1',
        component: () => import('@/views/Tab1.vue'),
        beforeEnter: guard
      },
      {
        path: 'tab1/results',
        component: () => import('@/views/Results.vue'),
        beforeEnter: guard
      },
      {
        path: 'tab1/detail/:id',
        component: () => import('@/views/Detail.vue'),
        //beforeEnter: guard
      },
      {
        path: 'tab2',
        component: () => import('@/views/Tab2.vue'),
        beforeEnter: guard
      },
      {
        path: 'tab3',
        component: () => import('@/views/Tab3.vue'),
        beforeEnter: guard
      },
      {
        path: 'tab4',
        component: () => import('@/views/TabInfo.vue'),
        beforeEnter: guard
      }
    ]
  },

]


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
