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
    <ion-content class="map-backgorund" v-if="!isLoading">
      <div id="container"></div>

      <ion-card v-if="defunto">
        <ion-card-header>
          <ion-card-title color="secondary">
            #{{ defunto.id }} {{ defunto.nome }} {{ defunto.cognome }}
          </ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <!--<ion-text color="secondary">
            <h3></h3>
          </ion-text>-->
          <ion-list>
            <ion-item>
              <ion-label>{{ lang.Detail.NatoLabel }}</ion-label>
              <ion-label class="ion-text-right">{{ dataNascitaStr }}</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>{{ lang.Detail.MortoLabel }}</ion-label>
              <ion-label class="ion-text-right">{{ dataMorteStr }}</ion-label>
            </ion-item>
            <!--<ion-item>
          <ion-label>{{ lang.Detail.TipoManufatto }}</ion-label>
          <ion-label class="ion-text-right">{{
            defunto.tipoManufatto ?? "-"
          }}</ion-label>
        </ion-item>-->
          </ion-list>

          <ion-card>
            <ion-card-header>
              <ion-card-subtitle>{{
                lang.Detail.PosizioneLabel
              }}</ion-card-subtitle>
              <ion-card-title>{{
                defunto.posizioneAttuale.cimiteroNome
              }}</ion-card-title>
            </ion-card-header>

            <ion-card-content>
              <ion-list>
                <ion-item lines="none">
                  <ion-text
                    ><b>{{ lang.Detail.AreaLabel }}:</b> {{ area }}</ion-text
                  >
                </ion-item>
                <ion-item lines="none">
                  <ion-text
                    ><b>{{ lang.Detail.ZonaLabel }}:</b> {{ zona }}</ion-text
                  >
                </ion-item>
                <ion-item lines="none">
                  <ion-text
                    ><b>{{ lang.Detail.TipoPosizioneLabel }}:</b>
                    {{
                      defunto.posizioneAttuale.tipoPosizione ?? "-"
                    }}</ion-text
                  >
                </ion-item>
                <ion-item lines="none">
                  <ion-text
                    ><b>{{ lang.Detail.GeoLabel }}:</b>
                    {{
                      defunto.posizioneAttuale.latitu ?? lang.Detail.NonDefinita
                    }}</ion-text
                  >
                </ion-item>
              </ion-list>
            </ion-card-content>
          </ion-card>

          <ion-button
            type="button"
            color="secondary"
            expand="block"
            size="normal"
            :disabled="isAdding"
            @click="onAddDefunto"
            >{{ lang.Detail.AddButton }}
          </ion-button>
        </ion-card-content>
      </ion-card>
      <!--<div class="btnContainer"></div>-->
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
  IonText,
  IonMenuButton,
  IonBackButton,
  IonButtons,
  IonLoading,
  IonLabel,
  IonList,
  IonItem,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardSubtitle,
  IonCardTitle,
  IonButton,
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
    IonText,
    IonMenuButton,
    IonBackButton,
    IonButtons,
    IonLoading,
    aldLogo,
    IonLabel,
    IonList,
    IonItem,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardSubtitle,
    IonCardTitle,
    IonButton,
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

    const loadDefunto = async (id: number): Promise<void> => {
      await store.dispatch("selectDetail", id);
      console.log("Caricamento dati defunto " + id);
      setIsLoading(false);
    };

    const defunto = computed(() => store.state.current);
    const state = computed(() => store.state);

    const convertDateToString = (
      date: Date | null,
      culture: string
    ): string => {
      if (date) return new Date(date).toLocaleDateString(culture);
      else return "";
    };

    onBeforeMount(() => {
      setIsLoading(true);
      loadDefunto(+id);
    });

    onBeforeUpdate((): void => {
      if (!defunto.value || (defunto.value?.id ?? 0) != +id) {
        setIsLoading(true);
        loadDefunto(+id);
        console.log("Dati defunto aggiornati");
      }
    });

    const isAuth = computed(() => {
      return (
        store.state.auth &&
        store.state.auth.user &&
        !store.state.auth.user.isAnonymous
      );
    });
    const onAddDefunto = async (): Promise<void> => {
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
        state.value.mieiDefunti.filter((i) => i.id == state.value.current?.id)
          .length > 0
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
        await store.dispatch("addDefunto");
        setIsAdding(false);
        console.log("Aggiunto defunto " + id);
      }
    };

    return {
      id,
      defunto,
      dataNascitaStr: computed(() =>
        convertDateToString(store.state.current?.dataNascita ?? null, "it-IT")
      ),
      dataMorteStr: computed(() =>
        convertDateToString(store.state.current?.dataMorte ?? null, "it-IT")
      ),

      area: computed(() => {
        let ret = "";
        if (store.state.current?.posizioneAttuale.area1 ?? null)
          ret = store.state.current?.posizioneAttuale.area1 ?? "";
        if (store.state.current?.posizioneAttuale.area2 ?? null)
          ret = ret + " - " + store.state.current?.posizioneAttuale.area2 ?? "";
        return ret;
      }),
      zona: computed(() => {
        let ret = "";
        if (store.state.current?.posizioneAttuale.zona1 ?? null)
          ret = store.state.current?.posizioneAttuale.zona1 ?? "";
        if (store.state.current?.posizioneAttuale.zona2 ?? null)
          ret = ret + " - " + store.state.current?.posizioneAttuale.zona2 ?? "";
        if (store.state.current?.posizioneAttuale.zona3 ?? null)
          ret = ret + " - " + store.state.current?.posizioneAttuale.zona3 ?? "";
        return ret;
      }),
      isLoading,
      isAdding,
      convertDateToString,
      onAddDefunto,
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