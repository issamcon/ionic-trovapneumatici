<template>
  <ion-page>
    <!--<ion-header class="ion-no-border">
      <ion-toolbar color="primary">
        <ion-buttons slot="end">
          <ion-menu-button @click="openFirst()"></ion-menu-button>
        </ion-buttons>
        <ion-title>
          <ald-logo></ald-logo>
        </ion-title>
      </ion-toolbar>
    </ion-header>-->
    <ion-header >
      <ion-toolbar>
        <ion-title>{{lang.Search.Title}} </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="my-content">
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

      <ion-text>
        <h6>{{ lang.Search.SubTitle }}</h6>
      </ion-text>

      <ion-segment
        @ionChange="segmentChanged($event)"
        color="secondary"
        value="auto"
      >
        <ion-segment-button value="auto">
          <ion-label>Auto</ion-label>
        </ion-segment-button>
        <ion-segment-button value="moto">
          <ion-label>Moto</ion-label>
        </ion-segment-button>
        <ion-segment-button value="tutti">
          <ion-label>Tutti</ion-label>
        </ion-segment-button>
      </ion-segment>

      <img
        src="/assets/img/misure_ridotto.png"
        alt="misure pneumatico"
        class="center"
      />

      <!--<v-form v-slot="{ values, errors }" @submit="onSubmit">-->
      <v-form @submit="onSubmit">
        <ion-list lines="full">
          <ion-item>
            <ion-label>{{ lang.Search.WLabel }}</ion-label>
            <ion-button class="btnPicker" @click="openPickerLarghezza">{{
              picked.larghezza == "" ? "SELEZIONA" : picked.larghezza
            }}</ion-button>
          </ion-item>

          <ion-item v-if="picked.larghezza != ''">
            <ion-label>{{ lang.Search.HLabel }}</ion-label>
            <ion-button class="btnPicker" @click="openPickerAltezza">{{
              picked.altezza == "" ? "Seleziona" : picked.altezza
            }}</ion-button>
          </ion-item>

          <ion-item v-if="picked.larghezza != '' && picked.altezza != ''">
            <ion-label>{{ lang.Search.DLabel }}</ion-label>
            <ion-button class="btnPicker" @click="openPickerDiametro">{{
              picked.diametro == "" ? "Seleziona" : picked.diametro
            }}</ion-button>
          </ion-item>

          <!--<ion-item>
            <ion-label>{{ lang.Search.HLabel }}</ion-label>
            <v-field name="h" v-slot="{ field }" :rules="isRequired">
              <ion-input name="h" v-bind="field"></ion-input>
            </v-field>
          </ion-item>
          <v-error-message name="h" class="error" />

          <ion-item>
            <ion-label>{{ lang.Search.DLabel }}</ion-label>
            <v-field name="d" v-slot="{ field }" :rules="isRequired">
              <ion-input name="d" v-bind="field"></ion-input>
            </v-field>
          </ion-item>
          <v-error-message name="d" class="error" />-->

          <!--<ion-item lines="none">
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
                    lang.Search.All
                  }}</ion-select-option>
                  <ion-select-option
                    :value="c.id"
                    v-for="c in allCimiteri"
                    :key="c.id"
                    >{{ c.nome }}</ion-select-option
                  >
                </ion-select>
              </v-field>
            </ion-item>-->
        </ion-list>
        <!--<ion-item lines="none"></ion-item>-->

        <div class="btnContainer">
          <ion-button v-if="!isLoading"
            type="submit"
            color="secondary"
            expand="block"
            size="large"
            class="ion-no-margin"
          >
            {{ lang.Search.SearchButton }}
          </ion-button>

          <ion-button v-if="isLoading" disabled="true" color="secondary"
            expand="block" size="large" class="ion-no-margin" >
            <ion-spinner slot="start" name="crescent"></ion-spinner>
            Caricamento...
          </ion-button>
        </div>
      </v-form>
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
  IonText,
  IonItem,
  IonList,
  //IonSelect,
  //IonSelectOption,
  //IonInput,
  //IonDatetime,
  IonButton,
  //IonMenuButton,
  //IonButtons,
  IonSegment,
  IonSegmentButton,
  alertController,
  //IonCard,
  //IonCardContent,
  //IonCardHeader,
  //IonCardSubtitle,
  //IonCardTitle,
  useBackButton,
  useIonRouter,
  pickerController,
  IonSpinner
  //menuController
} from "@ionic/vue";
import { computed, defineComponent, ref } from "vue";
//import aldLogo from "@/components/aldilapp/shared/ald-logo.vue";
import * as V from "vee-validate/dist/vee-validate";
import { useStore, mapActions } from "vuex";
import { key } from "../store";
import { useRouter } from "vue-router";
import { Plugins } from "@capacitor/core";
import { SizeService } from "@/services/product.service";
import { SearchFilter } from "@/models/index";
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
    //IonInput,
    //IonDatetime,
    IonButton,
    //IonMenuButton,
    //IonButtons,
    IonSegment,
    IonSegmentButton, //,IonLabel,
    IonText,
    IonList,
    //IonCard,
    //IonCardContent,
    //IonCardHeader,
    //IonCardSubtitle,
    //IonCardTitle,
    //aldLogo,
    //IonSelect,
    //IonSelectOption,
    //VField: V.Field,
    VForm: V.Form,
    IonSpinner
    //VErrorMessage: V.ErrorMessage,
    
  },
  data() {
    return {
      picked: {
        tipo: "auto",
        larghezza: "205",
        altezza: "55",
        diametro: "16",
      },
    };
  },
  methods: {
    ...mapActions(["searchProducts"]),
    
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
    async onSubmit(): Promise<void> {
      this.setIsLoading(true);
      const filter: SearchFilter = {
        category: this.picked.tipo,
        w: this.picked.larghezza,
        h: this.picked.altezza,
        d: this.picked.diametro,
        pageNum: 1,
        pageSize: 12
      };
      const res = await this.searchProducts(filter);
      
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
        const id = this.results[0].ItemId;
        const url = "tab1/detail/" + id;
        //this.selectDetail();
        this.router.push(url);
        console.log("GoTo Detail", url);
      } else {
        this.router.push("tab1/results");
        console.log("GoTo Result", "tab1/results");
      }
      this.setIsLoading(false);
    },

    segmentChanged(ev: CustomEvent) {
      console.log("Segment changed", ev.detail.value);
      this.picked.tipo = ev.detail.value;
      this.picked.larghezza = "";
      this.picked.altezza = "";
      this.picked.diametro = "";
    },

    getPickingOptions(values: string[]) {
      const result: any = [];
      values.forEach((item: string) => {
        return result.push({ text: item, value: item });
      });
      return result;
    },

    async openPickerLarghezza() {
      const options = await SizeService.getLarghezze(this.picked.tipo);
      console.log("Larghezze", options);
      const defaultValue = this.picked.tipo == "moto" ? "120" : "205";
      const pickingOptions = {
        name: "Larghezza",
        selectedIndex:
          this.picked.larghezza != ""
            ? options.indexOf(this.picked.larghezza)
            : options.indexOf(defaultValue),
        options: this.getPickingOptions(options),
      };
      const picker = await pickerController.create({
        columns: [pickingOptions],
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
          },
          {
            text: "Confirm",
            handler: (value) => {
              this.picked.larghezza = value.Larghezza.value;
              console.log("Picked larghezza", this.picked.larghezza);
            },
          },
        ],
      });
      await picker.present();
      console.log();
    },

    async openPickerAltezza() {
      const options = await SizeService.getAltezze(this.picked.larghezza);
      const defaultValue = this.picked.tipo == "moto" ? "70" : "55";

      const pickingOptions = {
        name: "Altezza",
        selectedIndex:
          this.picked.altezza != ""
            ? options.indexOf(this.picked.altezza)
            : options.indexOf(defaultValue),
        options: this.getPickingOptions(options),
      };
      const picker = await pickerController.create({
        columns: [pickingOptions],
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
          },
          {
            text: "Confirm",
            handler: (value) => {
              this.picked.altezza = value.Altezza.value;
              console.log("Picked altezza", this.picked.altezza);
            },
          },
        ],
      });
      await picker.present();
      console.log();
    },

    async openPickerDiametro() {
      const defaultValue = this.picked.tipo == "moto" ? "17" : "16";
      const options = await SizeService.getDiametri(
        this.picked.larghezza,
        this.picked.altezza
      );
      const pickingOptions = {
        name: "Diametro",
        selectedIndex:
          this.picked.diametro != ""
            ? options.indexOf(this.picked.diametro)
            : options.indexOf(defaultValue),
        options: this.getPickingOptions(options),
      };
      const picker = await pickerController.create({
        columns: [pickingOptions],
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
          },
          {
            text: "Confirm",
            handler: (value) => {
              this.picked.diametro = value.Diametro.value;
              console.log("Picked diametro", this.picked.diametro);
            },
          },
        ],
      });
      await picker.present();
      console.log();
    },
  },
  setup() {
    const store = useStore(key);
    const router = useRouter();
    const ionRouter = useIonRouter();
    const isLoading = ref(false); 
    const setIsLoading = (state: boolean) => (isLoading.value = state);

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
      isLoading,
      authetication: computed(() => store.state.auth),
      searchSuccess: computed(() => store.state.searchSuccess),
      resultErrorMessage: computed(() => store.state.searchResultMessage),
      resultsCount: computed(() => store.state.searchResultsCount),
      results: computed(() => store.state.results),
      lang: computed(() => store.state.lang),
      setIsLoading
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
  /*position: fixed;
  bottom: 10px;
  left: 0px;*/

  width: 100%;
  padding: 20px 3% 5px 3%;
}
.error {
  color: red;
  font-size: small;
  font-weight: 500;
  font-style: italic;
}

.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 80%;
  margin-top: 15px;
  margin-bottom: 15px;
}

.btnPicker {
  font-size: larger;
  font-weight: 500;
  color: white;
  text-align: center;
  margin: 5px;
  min-height: 1.8em;
  min-width: 3em;
}

.my-content {
  --padding-start: 15px;
  --padding-end: 15px;
  --padding-top: 15px;
  --padding-bottom: 15px;
}

</style>