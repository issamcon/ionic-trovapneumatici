<template>
  <ion-page>
    <ion-header  class="ion-no-border">
      <ion-toolbar color="primary">
        <ion-buttons slot="end">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>
          <ald-logo></ald-logo>
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="map-backgorund">
      
      <!--<ion-header collapse="condense" class="ion-no-border">
        <ion-toolbar color="primary">
          <ion-buttons slot="end">
            <ion-menu-button></ion-menu-button>
          </ion-buttons>
          <ion-title size="large">
            <ald-logo></ald-logo>
          </ion-title>
        </ion-toolbar>
      </ion-header>-->

      <div id="container"></div>

      <ion-card>
        <ion-card-header>
          <ion-card-title color="secondary">
            <h3 class="secondary">{{ lang.Search.Title }}</h3>
          </ion-card-title>
          <ion-card-subtitle>{{ lang.Search.SubTitle }}</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <!--<v-form v-slot="{ values, errors }" @submit="onSubmit">-->
          <v-form @submit="onSubmit">
            <ion-item>
              <ion-label position="stacked">{{
                lang.Search.CognomeLabel
              }}</ion-label>
              <v-field name="cognome" v-slot="{ field }" :rules="isRequired">
                <ion-input name="cognome" v-bind="field"></ion-input>
              </v-field>
            </ion-item>
            <v-error-message name="cognome" class="error" />

            <ion-item>
              <ion-label position="stacked">{{
                lang.Search.NomeLabel
              }}</ion-label>
              <v-field name="nome" v-slot="{ field }" :rules="isRequired">
                <ion-input name="nome" v-bind="field"></ion-input>
              </v-field>
            </ion-item>
            <v-error-message name="nome" class="error" />

            <ion-item>
              <ion-label position="floating">{{
                lang.Search.DataNascitaLabel
              }}</ion-label>
              <v-field name="dataNascita" v-slot="{ field }">
                <ion-datetime
                  v-bind="field"
                  min="1850"
                  display-format="DD/MM/YYYY"
                  placeholder=""
                  :cancel-text="lang.Search.CancelText"
                  :done-text="lang.Search.DoneText"
                ></ion-datetime>
              </v-field>
            </ion-item>

            <ion-item>
              <ion-label position="floating">{{
                lang.Search.DataMorteLabel
              }}</ion-label>
              <v-field name="dataMorte" v-slot="{ field }">
                <ion-datetime
                  v-bind="field"
                  min="1850"
                  display-format="DD/MM/YYYY"
                  placeholder=""
                  :cancel-text="lang.Search.CancelText"
                  :done-text="lang.Search.DoneText"
                ></ion-datetime>
              </v-field>
            </ion-item>

            <ion-item lines="none">
              <ion-label position="floating">{{
                lang.Search.Cimiterolabel
              }}</ion-label>
              <v-field name="cimiteroId" v-slot="{ field }" v-model="comune">
                <ion-select
                  interface="action-sheet"
                  v-bind="field"
                  v-model="comune"
                >
                  <ion-select-option value="0">{{
                    lang.Search.AllCimiteriLabel
                  }}</ion-select-option>
                  <ion-select-option
                    :value="c.id"
                    v-for="c in allCimiteri"
                    :key="c.id"
                    >{{ c.nome }}</ion-select-option
                  >
                </ion-select>
              </v-field>
            </ion-item>
            <!--<ion-item lines="none"></ion-item>-->
            <ion-button
              type="submit"
              color="secondary"
              expand="block"
              size="large"
            >
              {{ lang.Search.SearchButton }}
            </ion-button>

            <!--<div class="btnContainer">
              
            </div>-->
          </v-form>
        </ion-card-content>
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
  IonLabel,
  //IonSegment, IonSegmentButton,
  //IonText,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonDatetime,
  IonButton,
  IonMenuButton,
  IonButtons,
  alertController,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  useBackButton, useIonRouter
} from "@ionic/vue";
import { computed, defineComponent } from "vue";
import aldLogo from "@/components/aldilapp/shared/ald-logo.vue";
import * as V from "vee-validate/dist/vee-validate";
import { useStore, mapActions } from "vuex";
import { key } from "../store";
import { useRouter } from "vue-router";
import { Plugins } from '@capacitor/core';
const { App } = Plugins;

export default defineComponent({
  name: "Tab1",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonItem,
    IonLabel,
    IonInput,
    IonDatetime,
    IonButton,
    IonMenuButton,
    IonButtons,
    //IonSegment, IonSegmentButton,IonLabel,
    //IonText,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    aldLogo,
    IonSelect,
    IonSelectOption,
    VField: V.Field,
    VForm: V.Form,
    VErrorMessage: V.ErrorMessage,
  },
  data() {
    return {};
  },
  methods: {
    ...mapActions(["fetchCimiteri", "searchDefunti", "selectDetail"]),
    async LoadData() {
      await this.fetchCimiteri();
    },
    async PresentAlertError(title: string, msg: string) {
      const alert = await alertController.create({
        cssClass: "my-alert-class",
        header: title,
        subHeader: "",
        message: msg,
        buttons: ["OK"],
      });
      await alert.present();
      const { role } = await alert.onDidDismiss();
      console.log("onDidDismiss resolved with role", role);
    },
    async onSubmit(filter: any): Promise<void> {
      console.log(filter);
      const res = await this.searchDefunti(filter);
      if (!res) {
        this.PresentAlertError(
          this.lang.Search.ErrorTitle,
          this.lang.Search.ErrorGen
        );
      } else if (res && this.resultsCount == 0) {
        this.PresentAlertError(
          this.lang.Search.WarnTitle,
          this.lang.Search.WarnNoData
        );
      } else if (this.resultsCount == 1) {
        const id = this.results[0].defunti[0].id;
        const url = "tab1/detail/" + id;
        //this.selectDetail();
        this.router.push(url);
        console.log("GoTo Detail", url);
      } else {
        this.router.push("tab1/results");
        console.log("GoTo Result", "tab1/results");
      }
    },
  },
  created() {
    const store = useStore(key);
    if (store.state.cimiteri == undefined || store.state.cimiteri.length == 0) {
      this.LoadData();
      console.log("Caricamento anagrafica cimiteri");
    }
  },
  setup() {
    const store = useStore(key);
    const router = useRouter();
    const ionRouter = useIonRouter();
    useBackButton(-1, () => {
      if (!ionRouter.canGoBack()) {
        App.exitApp();
      }
    });
    //const onSubmit = (data: any) => {
    //const result =
    //alert("Submited: " + JSON.stringify(data, null, 2));
    //};
    const isRequired = (value: any) => {
      if (!value) {
        return "Questo è un dato necessario!";
      }
      return true;
    };

    return {
      router,
      isRequired,
      comune: "0",
      authetication: computed(() => store.state.auth),
      allCimiteri: computed(() => store.state.cimiteri),
      searchSuccess: computed(() => store.state.searchSuccess),
      resultErrorMessage: computed(() => store.state.searchResultMessage),
      resultsCount: computed(() => store.state.searchResultsCount),
      results: computed(() => store.state.results),
      lang: computed(() => store.state.lang),

      //...mapGetters([
      //"allCimiteri",
      //'anotherGetter',
      // ...
      //])
    };
  },
});
</script>

<style scoped>

.optionContainer {
  margin: 20px 0px;
}
.btnContainer {
  position: fixed;
  bottom: 0px;
  left: 0px;
  width: 100%;
  padding: 15px;
}
.error {
  color: red;
  font-size: small;
  font-weight: 500;
  font-style: italic;
}





</style>