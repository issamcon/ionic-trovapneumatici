<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>
          <ald-logo></ald-logo>
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-loading
      :is-open="isLoading"
      cssClass="my-custom-class"
      :message="lang.Detail.InCaricamento"
    >
    </ion-loading>

    <ion-content :fullscreen="true" class="map-backgorund">
      <!--<ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 3</ion-title>
        </ion-toolbar>
      </ion-header>-->
      <div id="container"></div>

      <ion-card >
        <ion-card-header>
          <ion-card-title>{{ lang.Info.Title }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <div v-html="lang.Info.Html1"></div>
          <div v-html="lang.Info.Html2"></div>
          <ul v-if="cimiteri">
            <li v-for="c in cimiteri" :key="c.id">
              <b>{{ c.nome }}</b>
            </li>
          </ul>
        </ion-card-content>
      </ion-card>

      <!--<ExploreContainer name="Tab 3 page" />-->
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, ref } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonCardHeader,
  IonBackButton,
  IonMenuButton,
  IonButtons,
  IonLoading
} from "@ionic/vue";
import { useStore } from "vuex";
import { key } from "../store";
import aldLogo from "@/components/aldilapp/shared/ald-logo.vue";

//import ExploreContainer from '@/components/ExploreContainer.vue';

export default defineComponent({
  name: "Tab3",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonCard,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    aldLogo,
    IonBackButton,
    IonMenuButton,
    IonButtons,
    IonLoading
  },
  setup() {
    const isLoading = ref(false);
    const store = useStore(key);
    const lang = computed(() => {
      return store.state.lang;
    });
    const cimiteri = computed(() => {
      return store.state.cimiteri;
    });
    const setIsLoading = (state: boolean) => (isLoading.value = state);

    const loadCimitieri = async (): Promise<void> => {
      setIsLoading(true);
      await store.dispatch("fetchCimiteri");
      setIsLoading(false);
    };

    onBeforeMount(() => {
      if (!cimiteri.value || cimiteri.value.length > 0) {
        loadCimitieri();
      }
    });

    return {
      state: computed(() => store.state),
      lang,
      isLoading,
      cimiteri,
    };
  },
});
</script>

<style scoped>
  .card-content p {
        padding-bottom: 10px;
    }
</style>