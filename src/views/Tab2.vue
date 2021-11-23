<template>
  <ion-page>
    <ion-header >
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>{{lang.Favorites.Title}}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding" color="light" >
      <!--<ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ lang.MieiDefunti.Title }}</ion-title>
        </ion-toolbar>
      </ion-header>-->

  
      <div v-if="isEnabled">
        

            <div v-if="isLoading">
              <div class="ion-padding custom-skeleton">
                <ion-skeleton-text
                  animated
                  style="width: 60%"
                ></ion-skeleton-text>
                <ion-skeleton-text animated></ion-skeleton-text>
                <ion-skeleton-text
                  animated
                  style="width: 88%"
                ></ion-skeleton-text>
                <ion-skeleton-text
                  animated
                  style="width: 70%"
                ></ion-skeleton-text>
                <ion-skeleton-text
                  animated
                  style="width: 60%"
                ></ion-skeleton-text>
              </div>

              <ion-list>
                <ion-list-header>
                  <ion-label>
                    <ion-skeleton-text
                      animated
                      style="width: 20%"
                    ></ion-skeleton-text>
                  </ion-label>
                </ion-list-header>
                <ion-item>
                  <ion-avatar slot="start">
                    <ion-skeleton-text animated></ion-skeleton-text>
                  </ion-avatar>
                  <ion-label>
                    <h3>
                      <ion-skeleton-text
                        animated
                        style="width: 50%"
                      ></ion-skeleton-text>
                    </h3>
                    <p>
                      <ion-skeleton-text
                        animated
                        style="width: 80%"
                      ></ion-skeleton-text>
                    </p>
                    <p>
                      <ion-skeleton-text
                        animated
                        style="width: 60%"
                      ></ion-skeleton-text>
                    </p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-thumbnail slot="start">
                    <ion-skeleton-text animated></ion-skeleton-text>
                  </ion-thumbnail>
                  <ion-label>
                    <h3>
                      <ion-skeleton-text
                        animated
                        style="width: 50%"
                      ></ion-skeleton-text>
                    </h3>
                    <p>
                      <ion-skeleton-text
                        animated
                        style="width: 80%"
                      ></ion-skeleton-text>
                    </p>
                    <p>
                      <ion-skeleton-text
                        animated
                        style="width: 60%"
                      ></ion-skeleton-text>
                    </p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-skeleton-text
                    animated
                    style="width: 27px; height: 27px"
                    slot="start"
                  ></ion-skeleton-text>
                  <ion-label>
                    <h3>
                      <ion-skeleton-text
                        animated
                        style="width: 50%"
                      ></ion-skeleton-text>
                    </h3>
                    <p>
                      <ion-skeleton-text
                        animated
                        style="width: 80%"
                      ></ion-skeleton-text>
                    </p>
                    <p>
                      <ion-skeleton-text
                        animated
                        style="width: 60%"
                      ></ion-skeleton-text>
                    </p>
                  </ion-label>
                </ion-item>
              </ion-list>
            </div>
           
            <div v-else>
              <div v-if="myFavorites && myFavorites.length > 0">
                
              <ion-card
        class="itemCard has-card-footer"
        v-for="d in myFavorites"
        :key="d.ItemId"
      >
        <div class="fav-div ion-text-right">
          <ion-fab
            vertical="top"
            horizontal="end"
            slot="fixed"
            v-if="isFavorite(d.ItemId)"
          >
            <ion-fab-button
              size="small"
              color="light"
              @click="setFavorite(d.ItemId, false)"
            >
              <ion-icon :src="heart" size="small" color="primary"></ion-icon>
            </ion-fab-button>
          </ion-fab>
          <ion-fab
            vertical="top"
            horizontal="end"
            slot="fixed"
            v-if="!isFavorite(d.ItemId)"
          >
            <ion-fab-button
              size="small"
              color="light"
              @click="setFavorite(d.ItemId, true)"
            >
              <ion-icon
                :src="heartOutline"
                size="small"
                color="primary"
              ></ion-icon>
            </ion-fab-button>
          </ion-fab>
        </div>
        <ion-card-content class="card-contet">
         
          <ion-grid class="ion-no-margin">
            <ion-row>
              <ion-col size="4">
                <ion-img v-if="d.ProductImageUrl"
                  :src="d.ProductImageUrl + '?tr=w-400'"
                  :alt="d.Title"
                />
                <ion-img v-if="!d.ProductImageUrl"
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
                  <img
                    class="stag"
                    :src="wImage"
                    alt="Gomme Invernali"
                  />
                  {{ d.Season }}
                </p>
                <p v-if="d.Season == 'Estive'">
                  <img
                    class="stag"
                    :src="sImage"
                    alt="Gomme Invernali"
                  />
                  {{ d.Season }}
                </p>
                <p v-if="d.Season == 'Allseason'">
                  <img
                    class="stag"
                    :src="aImage"
                    alt="Gomme Invernali"
                  />
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
                    v-for="(o,index) in d.Offers.slice(1)"
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
                  + altre {{ d.OffersCount - 1}} offerte
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

              </div>
              <div v-else>
                <ion-text>
                  <p>{{lang.Favorites.NoFavoritesText1}}</p>
                  <p>{{lang.Favorites.NoFavoritesText2}}
                  </p>
                </ion-text>
              </div>
            </div>
          

        <ion-fab vertical="bottom" horizontal="end" slot="fixed">
          <ion-fab-button class="my-button" router-link="/tabs/tab1"  size="small">
            <ion-icon :icon="addOutline"></ion-icon>
          </ion-fab-button>
        </ion-fab>
      </div>
      <div v-else>
        <ion-card>
          <ion-card-header>
            <ion-card-subtitle
              >{{ lang.Favorites.AccediSubTitle }}
            </ion-card-subtitle>
            <!--<ion-card-title>{{ lang.Favorites.AccediTitle }}</ion-card-title>-->
          </ion-card-header>
          <!--<ald-login-base goToRoute="/tabs/tab1"></ald-login-base>-->

          <ald-login-oauth goToRoute="/tabs/tab2" anonymousEnabled="false">
          </ald-login-oauth>
        </ion-card>

        <ion-card>
          <ion-card-header>
            <ion-card-subtitle>{{
              lang.Favorites.PresentationTitle
            }}</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <div v-html="lang.Favorites.PresentationHtmlContent"></div>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { computed, defineComponent, ref, reactive } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  //IonMenuButton,
  IonCard,
  IonCardHeader,
  //IonCardTitle,
  IonText,
  IonCardSubtitle,
  IonLabel,
  IonSkeletonText,
  IonItem,
  IonList,
  IonAvatar,
  IonThumbnail,
  IonListHeader,
  IonFab,
  IonIcon,
  IonFabButton,
  IonCardContent,
  IonBackButton,
  IonImg,
  IonCol,
  IonRow,
  IonGrid,
  IonButton,
  toastController,
  alertController
} from "@ionic/vue";
import { useStore, mapActions } from "vuex";
import { key } from "../store";
//import aldLogo from "@/components/aldilapp/shared/ald-logo.vue";
import aldLoginOauth from "@/components/aldilapp/shared/ald-login-oauth.vue";
import { addOutline, trashOutline, caretDownOutline,
  caretUpOutline,
  heart,
  heartOutline, } from "ionicons/icons";
import { Click } from "@/models";
import { Plugins } from '@capacitor/core';
const { Browser } = Plugins;

export default defineComponent({
  name: "Tab2",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    //aldLogo,
    IonButtons,
    //IonMenuButton,
    IonCard,
    IonCardHeader,
    //IonCardTitle,
    IonCardSubtitle,
    IonText,
    IonLabel,
    IonSkeletonText,
    IonItem,
    IonList,
    IonAvatar,
    IonThumbnail,
    IonListHeader,
    IonFab,
    IonFabButton,
    IonIcon,
    IonCardContent,
    aldLoginOauth,
    IonBackButton,
    IonButton,
    IonImg,
    IonGrid,
    IonRow,
    IonCol

  },
  methods: {
    ...mapActions([
      "loadOtherResults",
      "addToFavorites",
      "removeFromFavorites",
      "registerClick"
    ]),

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
      if (!res) {
        this.PresentAlertError(
          this.lang.Search.ErrorTitle,
          this.lang.Search.ErrorGen,
          null
        );
      }
      this.setIsLoading(false);
    },

    async setFavorite(itemId: number, status: boolean) {
      if (!status && this.isFavorite(itemId)) {
        await this.setFavoriteStatus(itemId, false);
        await this.removeFromFavorites(itemId);
      } else if (status && !this.isFavorite(itemId)) {
          await this.setFavoriteStatus(itemId, true);
          await this.addToFavorites(itemId);
      }
    },

     async openOffer(id: number, urlToOpen: string, position: number){
        await Browser.open({ url: urlToOpen });
        const clickData: Click = { OfferId: id, Position: position, Source: "App", UserId: "" };
        await this.registerClick(clickData);
    }
  },
  setup() {
    const store = useStore(key);
    const isLoading = ref(false);
    
    const interfaceState = reactive({
      showOthers: new Array<number>(),
      favorites: store.state.myFavorites.map((i) => i.ItemId),
    });

    const isEnabled = computed(() => {
      return (
        store.state.auth &&
        store.state.auth.user &&
        !store.state.auth.user.isAnonymous
      );
    });
    const setIsLoading = (state: boolean) => (isLoading.value = state);

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

    const isFavorite = (itemId: number): boolean => {
      const filtered = interfaceState.favorites.filter((i: number) => {
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
    
    return {
      myFavorites: computed(() => store.state.myFavorites),
      lang: computed(() => store.state.lang),
      isLoading,
      isEnabled,
      addOutline,
      trashOutline,
      isShowOthers,
      setShowOthersStatus,
      setIsLoading,
      setFavoriteStatus,
      isFavorite,
      caretDownOutline,
      caretUpOutline,
      heart,
      heartOutline,
      defaultImage: require("/public/assets/img/foto-penumatico-dimostrativa.png"),
      wImage: require("/public/assets/img/W.png"),
      sImage: require("/public/assets/img/S.png"),
      aImage: require("/public/assets/img/A.png"),
      fuelImage: require("/public/assets/img/rolling.jpg"),
      wetImage: require("/public/assets/img/wet.jpg"),
      noiseImage: require("/public/assets/img/etichetta-rumore.png"),
    };
  },
});
</script>

<style scoped>
.v-container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

.my-button {
  margin-bottom: 60px;
}

.myContent {
  --ion-background-color: #fafafa;
}
.itemCard {
  --background: #ffffff;
 
}
h1 {
  text-transform: uppercase;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
  margin-left:10px
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
</style>