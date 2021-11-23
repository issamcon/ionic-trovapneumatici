<template>
  <ion-page>
    

    <ion-header >
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>{{ lang.Results.Title }} per {{filter.w}}/{{filter.h}} R {{filter.d}}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding" color="light">
      <!--<div id="container"></div>-->
     

      <!--<ion-card
        class="itemCard has-card-footer"
        button="true"
        v-for="d in results"
        :key="d.ItemId"
        :router-link="'/tabs/tab1/detail/' + d.ItemId"
      >-->
      <ion-card
        class="itemCard has-card-footer"
        v-for="d in results"
        :key="d.ItemId"
      >
        
        <ion-card-header class="ion-text-right">
          <ion-button v-if="isFavorite(d.ItemId)" @click="setFavorite(d.ItemId, false)" size="small" color="light" shape="round" class="myround">
            <ion-icon :src="heart" size="default" color="primary" slot="icon-only"></ion-icon>
          </ion-button>
          <ion-button v-if="!isFavorite(d.ItemId)" @click="setFavorite(d.ItemId, true)" size="small" color="light" shape="round" class="myround">
            <ion-icon :src="heartOutline" size="default" color="primary" slot="icon-only"></ion-icon>
          </ion-button>
          <ion-button class="alert-button myround" v-if="isAlert(d.ItemId)" @click="setAlert(d.ItemId, false)" size="small" color="light" shape="round" >
            <ion-icon :src="notifications" size="default" color="warning" slot="icon-only"></ion-icon>
          </ion-button>
          <ion-button class="alert-button myround" v-if="!isAlert(d.ItemId)" @click="setAlert(d.ItemId, true)" size="small" color="light" shape="round" >
            <ion-icon :src="notificationsOutline" size="default" color="warning" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-card-header>
        <ion-card-content class="card-contet">
          <!--<div class="fav-div ion-text-right">
            
            <ion-button shape="round" v-if="isFavorite(d.ItemId)" @click="setFavorite(d.ItemId, false)" fill="clear" class="fav-button" size="small">
              <ion-icon :src="heart" size="large"></ion-icon>
            </ion-button>
            <ion-button shape="round" v-if="!isFavorite(d.ItemId)" @click="setFavorite(d.ItemId, true)" fill="clear" class="fav-button" size="small">
              <ion-icon :src="heartOutline" size="large"></ion-icon>
            </ion-button>
          </div>-->
          <ion-grid class="ion-no-margin">
            <ion-row>
              <ion-col size="4">
                <ion-img
                  v-if="d.ProductImageUrl"
                  :src="d.ProductImageUrl + '?tr=w-400'"
                  :alt="d.Title"
                />
                <ion-img
                  v-if="!d.ProductImageUrl"
                  :src="defaultImage"
                  :alt="d.Title"
                />
              </ion-col>
              <ion-col>
                <h2>{{ d.Brand }}</h2>
                <p>
                  <b>{{ d.Model }}</b>
                </p>
                <p>
                  <small>{{ d.Size }}</small>
                </p>

                <p v-if="d.Season == 'Invernali'">
                  <img class="stag" :src="wImage" alt="Gomme Invernali" />
                  {{ d.Season }}
                </p>
                <p v-if="d.Season == 'Estive'">
                  <img class="stag" :src="sImage" alt="Gomme Invernali" />
                  {{ d.Season }}
                </p>
                <p v-if="d.Season == 'Allseason'">
                  <img class="stag" :src="aImage" alt="Gomme Invernali" />
                  {{ d.Season }}
                </p>

                <ul
                  v-if="
                    d.LabelFuel != '' &&
                    d.LabelWet != '' &&
                    d.LabelDecibels != ''
                  "
                  class="proprieta"
                >
                  <li class="dett2">
                    <img
                      class="inlineimage"
                      :src="fuelImage"
                      alt="Consumo di carburante"
                      title="Indice consumo di carburante"
                    />
                    {{ d.LabelFuel }}
                  </li>
                  <li class="dett3">
                    <img
                      class="inlineimage"
                      :src="wetImage"
                      alt="Efficienza sul bagnato"
                      title="Indice di efficienza sul bagnato"
                    />
                    {{ d.LabelWet }}
                  </li>
                  <li class="dett3">
                    <img
                      class="inlineimage"
                      :src="noiseImage"
                      alt="Rumorosità"
                      title="Classe di rumorosità"
                    />
                    {{ d.LabelDecibels }} dB
                  </li>
                </ul>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-card-content>

        <ion-row class="card-footer ion-no-padding">
          <ion-grid class="ion-no-padding">
            <ion-row>
              <ion-col>
                <table class="offers">
                  <tr class="best">
                    <td class="offer-name">
                      <img
                        class="offer-logo"
                        :src="d.BestStoreLogoUrl"
                        :alt="'logo ' + d.BestStoreName"
                      />
                    </td>
                    <td class="offer-price">{{ d.BestPrice.toFixed(2) }} €</td>
                    <td class="offer-button">
                      <ion-button
                        color="secondary"
                        size="small"
                        :href="d.BestStoreOfferUrl"
                        @click="openOffer(d.BestOfferId, d.BestStoreOfferUrl, 1)"
                        rel="nofollow"
                        target="_blank"
                        strong="true"
                        >APRI</ion-button
                      >
                    </td>
                  </tr>
                </table>
              </ion-col>
            </ion-row>
            <ion-row
              :class="{
                slideup: !isShowOthers(d.ItemId),
                slidedown: isShowOthers(d.ItemId),
              }"
              class="others"
            >
              <ion-col>
                <table class="offers">
                  <tr
                    v-for="(o, index) in d.Offers.slice(1)"
                    :key="o.OfferId"
                    class="nobest"
                  >
                    <!--<td v-if="o.StoreLogoUrl && o.StoreLogoUrl != ''" class="offer-name"><img
                        class="offer-logo"
                        :src="o.StoreLogoUrl"
                        :alt="'logo ' + o.StoreName"
                      /></td>
                    <td v-if="!o.StoreLogoUrl || o.StoreLogoUrl == ''" class="offer-name">{{ o.StoreName }}</td>-->
                    <td class="offer-name">{{ o.StoreName }}</td>
                    <td class="offer-price">{{ o.Price.toFixed(2) }} €</td>
                    <td class="offer-button">
                      <ion-button
                        class="primary"
                        size="small"
                        @click="openOffer(o.OfferId, o.StoreOfferUrl, index + 2)"
                        rel="nofollow"
                        target="_blank"
                        >Apri</ion-button
                      >
                    </td>
                  </tr>
                </table>
              </ion-col>
            </ion-row>
            <ion-row v-if="d.OffersCount > 1">
              <ion-col class="ion-text-center">
                <ion-button
                  v-if="!isShowOthers(d.ItemId)"
                  @click="setShowOthersStatus(d.ItemId, true)"
                  class="slide-button"
                  fill="outline"
                  color="secondary"
                  size="small"
                >
                  <ion-icon :icon="caretDownOutline" slot="end"></ion-icon>
                  + altre {{ d.OffersCount - 1 }} offerte
                </ion-button>
                <ion-button
                  v-if="isShowOthers(d.ItemId)"
                  @click="setShowOthersStatus(d.ItemId, false)"
                  class="slide-button"
                  fill="outline"
                  color="secondary"
                  size="small"
                >
                  <ion-icon :icon="caretUpOutline" slot="end"></ion-icon>
                  Chiudi le altre offerte
                </ion-button>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-row>
      </ion-card>

      <div class="ion-text-center" v-if="loadOtherEnabled">
        <ion-button v-if="!isLoading" @click="loadOther()"
          >Altri risultati</ion-button
        >
        <ion-button v-if="isLoading" disabled="true">
          <ion-spinner slot="start" name="crescent"></ion-spinner>
          Caricamento...
        </ion-button>
      </div>
      <div v-if="!loadOtherEnabled" class="ion-text-center">
        Non ci sono altri risultati! 🧐
      </div>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button class="my-button" color="primary" @click="openMenuFilters()">
          <ion-icon :icon="funnelOutline"></ion-icon>
        </ion-fab-button>
      </ion-fab>
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
  //IonList,
  //IonItem,
  IonSpinner,
  //IonMenu,
  //IonItemDivider,
  //IonLabel,
  //IonToggle,
  IonImg,
  IonButtons,
  IonButton,
  //IonMenuButton,
  IonBackButton,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  //IonCardTitle,
  IonCardHeader,
  IonFab,
  IonFabButton,
  //IonListHeader,
  alertController,
  toastController,
  menuController,
  modalController
} from "@ionic/vue";
import { computed, defineComponent, ref, reactive } from "vue";
//import aldLogo from "@/components/aldilapp/shared/ald-logo.vue";
import ModalAlert from "@/components/ModalAlert.vue";
import { useStore, mapActions } from "vuex";
import { key } from "../store";
import { useRouter } from "vue-router";
import {
  caretDownOutline,
  caretUpOutline,
  heart,
  heartOutline,
  funnelOutline,
  notifications,
  notificationsOutline
} from "ionicons/icons";
import { ResultItem, Click } from "@/models";
import { Plugins } from '@capacitor/core';
const { Browser } = Plugins;

export default defineComponent({
  name: "Results",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonImg,
    IonSpinner,
    IonGrid,
    IonRow,
    IonCol,
    //IonItemGroup,
    //IonItemDivider,
    IonButton,
    IonButtons,
    //IonMenuButton,
    IonBackButton,
    //aldLogo,
    IonCard,
    IonCardContent,
    IonIcon,
    //IonCardTitle,
    IonFab,
    IonFabButton,
    IonCardHeader,
  },
  methods: {
    ...mapActions([
      "loadOtherResults",
      "addToFavorites",
      "removeFromFavorites",
      "startAlert",
      "stopAlert",
      "registerClick"
    ]),

    gotoDetail(id: number): void {
      const route = "/tabs/tab1/detail/" + id;
      this.router.push(route);
    },

    async PresentAlertError(
      title: string,
      msg: string,
      buttons: Array<any> | null
    ) {
      if (!buttons || buttons.length === 0) {
        buttons = ["OK"];
      }
      const alert = await alertController.create({
        cssClass: "my-alert-class",
        header: title,
        subHeader: "",
        message: msg,
        buttons: buttons,
      });
      await alert.present();
      const { role } = await alert.onDidDismiss();
      console.log("onDidDismiss resolved with role", role);
    },

    async loadOther() {
      this.setIsLoading(true);
      console.log("loadOther");
      const res = await this.loadOtherResults();
      if (!res ) {
        /*this.PresentAlertError(
          this.lang.Search.ErrorTitle,
          this.lang.Search.ErrorGen,
          null
        );*/
        this.setOtherEnabled(false);
      }
      this.setIsLoading(false);
    },

    async setFavorite(itemId: number, status: boolean) {
      if (!status && this.isFavorite(itemId)) {
        await this.setFavoriteStatus(itemId, false);
        await this.removeFromFavorites(itemId);
      } else if (status && !this.isFavorite(itemId)) {
        if (!this.isAuth) {
          const buttons: Array<any> = [
            {
              text: this.lang.Detail.CancelButton ?? "Annulla",
              role: "cancel",
              handler: () => {
                console.log("Cancel clicked");
              },
            },
            {
              text: this.lang.Detail.LoginButton ?? "Accedi",
              handler: () => {
                this.router.push("/login");
              },
            },
          ];
          this.PresentAlertError(
            this.lang.Detail.WarnAnonimoTitle ?? "ATTENZIONE!",
            this.lang.Detail.WarnAnonimoText ??
              "Questa funzione è abilitata solo per gli utenti registrati.",
            buttons
          );
        } else {
          await this.setFavoriteStatus(itemId, true);
          await this.addToFavorites(itemId);
        }
      }
    },

    async setAlert(itemId: number, status: boolean) {
      if (!status && this.isAlert(itemId)) {
        await this.setAlertStatus(itemId, false);
        await this.stopAlert(itemId);
      } else if (status && !this.isAlert(itemId)) {
        if (!this.isAuth) {
          const buttons: Array<any> = [
            {
              text: this.lang.Detail.CancelButton ?? "Annulla",
              role: "cancel",
              handler: () => {
                console.log("Cancel clicked");
              },
            },
            {
              text: this.lang.Detail.LoginButton ?? "Accedi",
              handler: () => {
                this.router.push("/login");
              },
            },
          ];
          this.PresentAlertError(
            this.lang.Detail.WarnAnonimoTitle ?? "ATTENZIONE!",
            this.lang.Detail.WarnAnonimoText ??
              "Questa funzione è abilitata solo per gli utenti registrati.",
            buttons
          );
        } else {
          
            const filtered = this.results.filter((i: ResultItem) => { return i.ItemId === itemId});
            const product = filtered[0];
            const modal = await modalController.create({
              component: ModalAlert,
              cssClass: "my-alert-modal",
              swipeToClose: true,
              showBackdrop: true,
              presentingElement: this.$el,
              componentProps: {
                artName: product.Title,
                alertToEveryChange: false, 
                currentPrice: product.BestPrice,
                priceThreshold: product.BestPrice  - 2,
                autoDisablingDays: 30,
                itemId: itemId
              },
            });
           
            modal.onDidDismiss().then(event =>  {
              console.log('Dismiss success:', event.data);
              if (event.data && event.data.success && event.data.alert)
              {
                    this.setAlertStatus(itemId, true);
                    this.startAlert(event.data.alert);
              }
              else
              {
                
                //do nothing...
              }
            });

            return modal.present();
          //await this.addToFavorites(itemId);
        }
      }
    },

    openMenuFilters() {
      menuController.enable(true, 'menuFilter');
      menuController.open('menuFilter');
    },

    openFirst() {
      menuController.enable(true, 'first');
      menuController.open('first');
    },

    async openOffer(id: number, urlToOpen: string, position: number){
        await Browser.open({ url: urlToOpen });
        const clickData: Click = { OfferId: id, Position: position, Source: "App", UserId: "" };
        await this.registerClick(clickData);
    }

  },
  setup() {
    const store = useStore(key);
    const router = useRouter();
    const isLoading = ref(false);
    const loadOtherEnabled = ref(true);
    const interfaceState = reactive({
      showOthers: new Array<number>(),
      favorites: store.state.myFavorites.map((i) => i.ItemId),
      alerts: store.state.myAlerts.map((i) => i.TyreId)   
    });

    const isAuth = computed(() => {
      return (
        store.state.auth &&
        store.state.auth.user &&
        !store.state.auth.user.isAnonymous
      );
    });

    const setIsLoading = (state: boolean) => (isLoading.value = state);
    const setOtherEnabled = (state: boolean) => (loadOtherEnabled.value = state);

    const isShowOthers = (itemId: number): boolean => {
      const filtered = interfaceState.showOthers.filter((i: number) => {
        return i == itemId;
      });
      return filtered && filtered.length > 0;
    };

    const setShowOthersStatus = (itemId: number, state: boolean) => {
      const filtered = interfaceState.showOthers.filter((i: number) => {
        return i == itemId;
      });
      if (filtered && filtered.length > 0) {
        if (!state) {
          //remove
          interfaceState.showOthers = interfaceState.showOthers.filter(
            (i) => i !== itemId
          );
        }
      } else {
        if (state) {
          //insert
          interfaceState.showOthers.push(itemId);
        }
      }
    };

    //interfaceState.favorites  = store.state.myFavorites;

    const isFavorite = (itemId: number): boolean => {
      const filtered = interfaceState.favorites.filter((i: number) => {
        return i == itemId;
      });
      return filtered && filtered.length > 0;
    };
    const isAlert = (itemId: number): boolean => {
      const filtered = interfaceState.alerts.filter((i: number) => {
        return i == itemId;
      });
      return filtered && filtered.length > 0;
    };

    const openToast = async (message: string, css: string) => {
      const toast = await toastController.create({
        message: message,
        duration: 2000,
        position: "bottom",
        cssClass: css,
      });
      return toast.present();
    };

    const setFavoriteStatus = async (itemId: number, state: boolean) => {
      const filtered = interfaceState.favorites.filter((i: number) => {
        return i == itemId;
      });
      if (filtered && filtered.length > 0) {
        if (!state) {
          //remove
          interfaceState.favorites = interfaceState.favorites.filter(
            (i) => i !== itemId
          );
          await openToast(
            "Prodotto rimosso da i tuoi Favoriti",
            "success-toast"
          );
        }
      } else {
        if (state) {
          //insert
          interfaceState.favorites.push(itemId);
          await openToast(
            "Prodotto inserito trai i tuoi Favoriti",
            "success-toast"
          );
        }
      }
    };

    const setAlertStatus = async (itemId: number, state: boolean) => {
      const filtered = interfaceState.alerts.filter((i: number) => {
        return i == itemId;
      });
      if (filtered && filtered.length > 0) {
        if (!state) {
          //remove
          interfaceState.alerts = interfaceState.alerts.filter(
            (i) => i !== itemId
          );
          await openToast(
            "Disabiliato il monitoraggio prezzo sul prodotto",
            "success-toast"
          );
        }
      } else {
        if (state) {
          //insert
          interfaceState.alerts.push(itemId);
          await openToast(
            "Abilitato il monitoraggio prezzo sul prodotto",
            "success-toast"
          );
        }
      }
    };

    

    return {
      resultsCount: computed(() => store.state.searchResultsCount),
      results: computed(() => store.state.results),
      filter: computed(() => store.state.filter),
      favorites: computed(() => store.state.myFavorites),
      lang: computed(() => store.state.lang),
      defaultImage: require("/public/assets/img/foto-penumatico-dimostrativa.png"),
      wImage: require("/public/assets/img/W.png"),
      sImage: require("/public/assets/img/S.png"),
      aImage: require("/public/assets/img/A.png"),
      fuelImage: require("/public/assets/img/rolling.jpg"),
      wetImage: require("/public/assets/img/wet.jpg"),
      noiseImage: require("/public/assets/img/etichetta-rumore.png"),
      router,
      isLoading,
      setIsLoading,
      setShowOthersStatus,
      isShowOthers,
      caretDownOutline,
      caretUpOutline,
      heart,
      heartOutline,
      isFavorite,
      setFavoriteStatus,
      isAuth,
      funnelOutline,
      interfaceState,
      loadOtherEnabled,
      setOtherEnabled,
      notifications,
      notificationsOutline,
      isAlert,
      setAlertStatus
    };
  },
});
</script>

<style scoped>
.myContent {
  --ion-background-color: #fafafa;
}
.itemCard {
  --background: #ffffff;
  margin-bottom: 25px;
}
.proprieta {
  width: 100%;
  height: 22px;
  margin: 8px 0;
  padding: 0px;
}
.proprieta li {
  vertical-align: top;
  display: inline-block;
  height: 24px;
  line-height: 26px;
  vertical-align: middle;
  margin-right: 8px;
  font-size: 12px;
  text-transform: uppercase;
  color: #000000;
  margin-right: 4px;
}
.proprieta img,
.stag {
  height: 24px;
  vertical-align: middle;
  border-style: none;
}

.card-footer {
  bottom: 0;
  width: 100%;
  border-top: 1px solid #ddd;
  background: #fafafa90;
  padding: 5px;
  position: relative;
}

.card-footer tr {
  line-height: 1.8em;
}

.has-card-footer {
  padding-bottom: 0px;
}

.offers {
  padding: 10px;
  width: 100%;
}

.others {
  margin-top: 15px;
}

.offers tr.best {
  font-weight: bold;
  font-size: larger;
  padding: 5px;
  /*background: #CCFFCF;
  border-bottom: 3px solid #AAFEBF;*/
}

.offers tr.best td {
  padding: 4px;
}

.offer-name {
  text-align: left;
}
.offer-price {
  text-align: right;
}
.offer-button {
  text-align: right;
}
.offer-logo {
  max-height: 35px;
  max-width: 155px;
}

h1 {
  text-transform: uppercase;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
  margin-left: 10px;
}

.slideup,
.slidedown {
  overflow: hidden;
}

.slidedown {
  max-height: 100%;
  transition: max-height 0.4s ease-in;
}
.slideup {
  max-height: 0;
  transition: max-height 0.2s ease-out;
}

.show-other-button-container {
  position: absolute;
  bottom: -10px;
}

.card-content {
  position: relative;
}
.fav-div {
  position: absolute;
  top: -10px;
  right: 0px;
}
.success-toast {
  --background: green;
  --color: white;
}

ion-card-header{
  padding: 2px 7px 0px 7px;
  margin-bottom: -15px;  
}

.alert-button{
  margin-left: 10px;
  font-weight: bold;
}

.myround{
  --padding-start:9px;
  --padding-end:9px;
}
</style>