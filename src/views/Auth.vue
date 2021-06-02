<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar color="primary">
        <ion-buttons slot="end">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>
          <ald-logo></ald-logo>
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="map-backgorund">
      <div id="container"></div>
      <ion-card>
        <ion-card-header>
          <ion-card-subtitle>{{ lang.Auth.WelcomeText }}</ion-card-subtitle>
          <ion-card-title>{{ lang.Auth.Title }}</ion-card-title>
        </ion-card-header>

        <!--<ald-login-base goToRoute="/tabs/tab1"></ald-login-base>-->

        <ald-login-oauth goToRoute="/tabs/tab1" anonymousEnabled="true"></ald-login-oauth>

        <!--<div class="p-3">
          <ion-text>
            <h6>Cerca con semplicità i tuoi defunti all'interno di un cimitero </h6>
          </ion-text>
          <p>
            Quando sei in un cimitero alla ricerca di un tuo caro, tramite un semplice ricerca nominativa puoi scoprire il punto esatto in
            cui è sepolto. 
          </p>
          <p>Tanti altri interessanti servizi verranno a breve integrati nell app.</p>
        </div>-->
        <div class="p-3" v-html="lang.Auth.PresentationText">

        </div>
      </ion-card>
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
  IonCard,
  IonCardSubtitle,
  IonCardTitle,
  IonCardHeader,
  IonButtons,
  IonMenuButton
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
    IonCard,
    IonCardSubtitle,
    IonCardTitle,
    IonCardHeader,
    aldLogo,
    aldLoginOauth,
    IonButtons,
    IonMenuButton
  },
  methods: {
    ...mapActions(["selectLang"]),
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
#container {
  position: absolute;
  height: 120px;
  width: 100%;
  left: 0px;
  top: 0px;
  background-color: #3b85c6;
}

ion-content {
  --background: url("/assets/img/mappa.jpg") 0 0/100% 100% no-repeat;
}
</style>