<template>
  <ion-page color="tertiary">
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="end">
          <ion-menu-button @click="openFirst()"></ion-menu-button>
        </ion-buttons>
        <ion-title>
          
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" >
      
      <!--<ion-card>
        <ion-card-header>
          <ion-card-subtitle>{{ lang.Auth.WelcomeText }}</ion-card-subtitle>
          <ion-card-title>{{ lang.Auth.Title }}</ion-card-title>
        </ion-card-header>

        <ald-login-base goToRoute="/tabs/tab1"></ald-login-base>
        <div class="p-3" v-html="lang.Auth.Slogan"></div>

        <ald-login-oauth goToRoute="/tabs/tab1" anonymousEnabled="true"></ald-login-oauth>
        <div class="p-3" v-html="lang.Auth.PresentationText">

        </div>
      </ion-card>-->
      <div><ald-logo></ald-logo></div>
      
      <div class="px-3 py-3 subtitle">
          {{ lang.Auth.WelcomeText }}
      </div>
      
      <div class="px-3 py-2" v-html="lang.Auth.Slogan"></div>

      <ald-login-oauth goToRoute="/tabs/tab1" anonymousEnabled="true"></ald-login-oauth>
        
      <div class="px-3 py-2" v-html="lang.Auth.PresentationText"></div>

    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  //IonCard,
  //IonCardSubtitle,
  //IonCardTitle,
  //IonCardHeader,
  IonButtons,
  IonMenuButton,
  menuController
} from "@ionic/vue";

import aldLogo from "../components/aldilapp/shared/ald-logo.vue";
//import aldLoginBase from "@/components/aldilapp/shared/ald-login-base.vue";
import aldLoginOauth from "../components/aldilapp/shared/ald-login-oauth.vue";
import { useStore, mapActions } from "vuex";
import { key } from "../store";
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "Authentication",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    //IonCard,
    //IonCardSubtitle,
    //IonCardTitle,
    //IonCardHeader,
    aldLogo,
    aldLoginOauth,
    IonButtons,
    IonMenuButton
  },
  methods: {
    ...mapActions(["selectLang"]),
    openFirst() {
      menuController.enable(true, 'first');
      menuController.open('first');
    },
  },
  created() {
    const store = useStore(key);

    if (!store.state.lang) {
      this.selectLang("it");
      console.log("Caricamento lingua");
    }
  },
  setup() {
    const store = useStore(key);

    return {
      lang: computed(() => store.state.lang),
    };
  },
});
</script>

<style  type="text/css" scoped>
.center {
  display: flex;
  height: 90vh;
  width: 100%;
  align-items: center;
  justify-content: center;
}
.error-message {
  color: #842029;
  background-color: #f8d7da;
  border-color: #f5c2c7;
  text-align: center;
}
/*#container {
  position: absolute;
  height: 120px;
  width: 100%;
  left: 0px;
  top: 0px;
  background-color: #3b85c6;
}

ion-content {
  --background: url("/assets/img/mappa.jpg") 0 0/100% 100% no-repeat;
}*/
</style>