<template>
  <ion-header translucent="true">
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button @click="dismiss">Annulla</ion-button>
      </ion-buttons>
      <ion-buttons slot="end">
        <ion-button @click="save">Salva</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <div>
      <ion-grid>
        <ion-row>
          <ion-col
            ><h1>{{ title }}</h1>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>{{ artName }}</ion-col>
        </ion-row>
        <ion-row>
          <ion-col size="8">Prezzo migliore attuale:</ion-col>
          <ion-col size="4" class="ion-text-right"
            ><b>EUR {{ currentPrice }}</b></ion-col
          >
        </ion-row>
      </ion-grid>
      <ion-list>
        <ion-item>
          <ion-toggle
            color="secondary"
            slot="start"
            :checked="interfaceStatus.toggleAlertToEveryChange"
            @ionChange="toggleAlertToEveryChange()"
          ></ion-toggle>
          Notificami SEMPRE quando il miglior prezzo cambia
        </ion-item>
        <ion-item>
          <ion-toggle
            color="secondary"
            slot="start"
            :checked="interfaceStatus.toggleAlertBelowThreshold"
            @ionChange="toggleAlertBelowThreshold()"
          ></ion-toggle>
          Notificami SE il miglior prezzo raggiunge il prezzo desiderato
        </ion-item>
        <ion-item>
          <ion-label>Prezzo desiderato EUR:</ion-label>
          <ion-input
            class="input-number"
            type="number"
            v-model="interfaceStatus.priceThreshold"
            inputmode="number"
            min="0"
            step="0.01"
            :max="currentPrice"
          ></ion-input>
        </ion-item>
        <ion-item>
          <ion-label>Disattiva tra giorni:</ion-label>
          <ion-input
            class="input-number"
            type="number"
            v-model="interfaceStatus.nday"
            inputmode="number"
            min="0"
            step="1"
            max="90"
          ></ion-input>
        </ion-item>
      </ion-list>
    </div>
  </ion-content>
</template>

<script lang="ts">
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButton,
  IonButtons,
  modalController,
  IonGrid,
  IonRow,
  IonCol,
  IonToggle,
  IonItem,
  IonInput,
  IonList,
  IonLabel,
} from "@ionic/vue";
import { defineComponent, reactive } from "vue";
import { AlertSetting } from "@/models/index";
export default defineComponent({
  name: "ModalAlert",
  props: {
    title: { type: String, default: "Attiva monitoraggio del  prezzo" },
    artName: { type: String, default: "" },
    currentPrice: { type: Number, default: 0 },
    alertToEveryChange: { type: Boolean, default: false },
    alertBelowThreshold: { type: Boolean, default: true },
    priceThreshold: { type: Number, default: 0 },
    autoDisablingDays: { type: Number, default: 30 },
    itemId: { type: Number, default: 0 },
  },
  components: {
    IonContent,
    IonHeader,
    IonToolbar,
    IonButton,
    IonButtons,
    IonRow,
    IonCol,
    IonGrid,
    IonToggle,
    IonItem,
    IonInput,
    IonList,
    IonLabel,
  },
  methods: {
    dismiss() {
      modalController.dismiss({ success: false });
    },
    save() {
      const now = new Date();
      const disableDate = new Date(now);
      disableDate.setDate(now.getDate() + this.interfaceStatus.nday);
      const alertSetting: AlertSetting = {
        TyreId: this.itemId,
        AutodisablingDays: this.interfaceStatus.nday,
        NotifyAllChanges: this.interfaceStatus.toggleAlertToEveryChange,
        Id: 0,
        UserId: "",
        UserEmail: "",
        ProductTitle: "",
        StartPrice: this.currentPrice,
        DesiredPrice: this.interfaceStatus.priceThreshold,
        Created: now,
        DisableDate: disableDate,
        Status: "Active"
      };
      console.log(this.interfaceStatus);
      console.log("Save for: ",alertSetting);
      modalController.dismiss({
        success: true,
        alert: alertSetting,
      });
    }
  },
  setup(props) {
    console.log("MODAL priceThreshold:", props.priceThreshold);
    const interfaceStatus = reactive({
      toggleAlertToEveryChange: props.alertToEveryChange,
      toggleAlertBelowThreshold: props.alertBelowThreshold,
      priceThreshold: props.priceThreshold,
      nday: props.autoDisablingDays,
    });
    const toggleAlertToEveryChange = () =>
      (interfaceStatus.toggleAlertToEveryChange =
        !interfaceStatus.toggleAlertToEveryChange);
    const toggleAlertBelowThreshold = () =>
      (interfaceStatus.toggleAlertBelowThreshold =
        !interfaceStatus.toggleAlertBelowThreshold);

    return {
      interfaceStatus,
      toggleAlertToEveryChange,
      toggleAlertBelowThreshold,
    };
  },
});
</script>

<style scoped>
h1 {
  font-size: 1.35em;
}
img {
  width: 100%;
}

.input-number {
  text-align: right;
  font-weight: bold;
}
</style>