
import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { store, key } from './store'
import { IonicVue } from '@ionic/vue';


//import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

const firebaseConfig = {
  apiKey: "AIzaSyCUuebQe0uONUx8rJS6_XrqEmfuxKgb3Mo",
  authDomain: "aldilapp-ae56b.firebaseapp.com",
  projectId: "aldilapp-ae56b",
  storageBucket: "aldilapp-ae56b.appspot.com",
  messagingSenderId: "504740849427",
  appId: "1:504740849427:web:4c5dfc1f916c44ffbadce6",
  measurementId: "G-54C0FBC8QV"
}

firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();
export const auth = firebase.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const appleProvider = new firebase.auth.OAuthProvider('apple');

auth.languageCode = 'it';

/* Theme variables */
import './theme/variables.css';
import './theme/aldilapp.css';

const app = createApp(App)
  .use(IonicVue)
  //  .use(BootstrapVue)
  //  .use(IconsPlugin)
  .use(store, key)
  .use(router);

router.isReady().then(() => {
  app.mount('#app');
});