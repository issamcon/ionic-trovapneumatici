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
      :message="lang.Detail.InCaricamento"
    >
    </ion-loading>
    <ion-content v-if="!isLoading">
      
      Dettaglio prodotto
      <h3>{{ detail.title }}</h3>

     
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
  //IonText,
  IonMenuButton,
  IonBackButton,
  IonButtons,
  IonLoading,
  //IonLabel,
  //IonList,
  //IonItem,
  //IonCard,
  //IonCardHeader,
  //IonCardContent,
  //IonCardSubtitle,
  //IonCardTitle,
  //IonButton,
  alertController,
} from "@ionic/vue";
import {
  computed,
  defineComponent,
  onBeforeMount,
  onBeforeUpdate,
  ref,
} from "vue";
import aldLogo from "@/components/aldilapp/shared/ald-logo.vue";
import { useStore } from "vuex";
import { key } from "../store";
import { useRoute, useRouter } from "vue-router";

export default defineComponent({
  name: "Results",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    //IonText,
    IonMenuButton,
    IonBackButton,
    IonButtons,
    IonLoading,
    aldLogo,
    //IonLabel,
    //IonList,
    //IonItem,
    //IonCard,
    //IonCardHeader,
    //IonCardContent,
    //IonCardSubtitle,
    //IonCardTitle,
    //IonButton,
  },
  setup() {
    const store = useStore(key);
    const router = useRouter();
    const route = useRoute();
    const { id } = route.params;
    const isLoading = ref(false);
    const isAdding = ref(false);
    const setIsLoading = (state: boolean) => (isLoading.value = state);
    const setIsAdding = (state: boolean) => (isAdding.value = state);
    const lang = computed(() => store.state.lang);

    const PresentAlertError = async (
      title: string,
      msg: string,
      buttons: Array<any>
    ) => {
      const alert = await alertController.create({
        cssClass: "my-alert-class",
        header: title,
        subHeader: "",
        message: msg,
        buttons,
      });
      await alert.present();
      const { role } = await alert.onDidDismiss();
      console.log("onDidDismiss resolved with role", role);
    };

    const loadDetail = async (id: number): Promise<void> => {
      await store.dispatch("selectDetail", id);
      console.log("Caricamento dati dettaglio " + id);  
    };

     const detail = computed(() => store.state.current);
     const state = computed(() => store.state);

/*
    const convertDateToString = (
      date: Date | null,
      culture: string
    ): string => {
      if (date) return new Date(date).toLocaleDateString(culture);
      else return "";
    };*/

    onBeforeMount(() => {
      setIsLoading(true);
      loadDetail(+id);
      setIsLoading(false);
    });

    onBeforeUpdate((): void => {
      if (!detail.value || (detail.value?.ItemId ?? 0) != +id) {
        setIsLoading(true);
        loadDetail(+id);
        setIsLoading(false);
      }
    });

    const isAuth = computed(() => {
      return (
        store.state.auth &&
        store.state.auth.user &&
        !store.state.auth.user.isAnonymous
      );
    });
    const onAddToFavorites = async (): Promise<void> => {
      console.log("isAuth", isAuth.value);
      if (!isAuth.value) {
        const buttons: Array<any> = [
          {
            text: lang.value?.Detail.CancelButton ?? "Annulla",
            role: "cancel",
            handler: () => {
              console.log("Cancel clicked");
            },
          },
          {
            text: lang.value?.Detail.LoginButton ?? "Accedi",
            handler: () => {
              router.push("/login");
            },
          },
        ];
        PresentAlertError(
          lang.value?.Detail.WarnAnonimoTitle ?? "ATTENZIONE!",
          lang.value?.Detail.WarnAnonimoText ??
            "Questa funzione è abilitata solo per gli utenti registrati.",
          buttons
        );
      } else if (
        state.value.myFavorites.filter((i) => i.ItemId == state.value.current?.ItemId).length > 0
      ) {
        const buttons: Array<any> = [
          {
            text: lang.value?.Detail.WarnDefuntoOkButton ?? "OK",
            role: "cancel",
            handler: () => {
              console.log("Cancel clicked");
            },
          },
        ];
        PresentAlertError(
          lang.value?.Detail.WarnDefuntoExistsTitle,
          lang.value?.Detail.WarnDefuntoExistsText,
          buttons
        );
      } else {
        setIsAdding(true);
        await store.dispatch("addToFavorites");
        setIsAdding(false);
        console.log("Aggiunto ai preferiti " + id);
      }
    };

    return {
      detail,
      isLoading,
      isAdding,
      onAddToFavorites,
      lang,
    };
  },
});
</script>

<style scoped>
.btnContainer {
  position: fixed;
  bottom: 0px;
  left: 0px;
  width: 100%;
  padding: 15px;
}
</style>