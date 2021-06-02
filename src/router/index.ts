import { createRouter, createWebHistory } from '@ionic/vue-router';
import Tabs from '../views/Tabs.vue';
import Tab1 from '../views/Tab1.vue';
import Tab2 from '../views/Tab2.vue';
import Tab3 from '../views/Tab3.vue';
import TabInfo from '../views/TabInfo.vue';
import Results from '../views/Results.vue';
import Detail from '../views/Detail.vue';
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
    component: () => import('../views/Auth.vue')
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
        component: Tab1,
        beforeEnter: guard
      },
      {
        path: 'tab1/results',
        component: Results,
        beforeEnter: guard
      },
      {
        path: 'tab1/detail/:id',
        component: Detail,
        //beforeEnter: guard
      },
      {
        path: 'tab2',
        component: Tab2,
        beforeEnter: guard
      },
      {
        path: 'tab3',
        component: Tab3,
        beforeEnter: guard
      },
      {
        path: 'tab4',
        component: TabInfo,
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
