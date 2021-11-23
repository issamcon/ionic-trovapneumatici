<template>
  <ion-header translucent="true">
    <ion-toolbar>
      <ion-buttons slot="end">
        <ion-button @click="dismiss">Chiudi</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <h1>{{ title }}</h1>
    <div v-html="content"></div>
  </ion-content>
</template>

<script>
import { IonContent, IonHeader, IonToolbar, IonButton, IonButtons, modalController } from "@ionic/vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "Modal",
  props: {
    title: { type: String, default: "Modal" },
    content: { type: String, default: "Content" },
  },
  components: { IonContent, IonHeader, IonToolbar,IonButton, IonButtons },
  methods: {
    dismiss() {
      modalController.dismiss();
    },
  },
});
</script>

<style scoped>
 h1 {
   font-size: 1.5em;
 }
 img{
    width: 100% !important;
    height: auto !important;
 }
</style>