<template>
  <ion-app>
    <ion-split-pane content-id="content1" when="lg">
      <ion-menu side="start" menuId="first" contentId="content1">
        <ion-header>
          <ion-toolbar>
            <ion-title>{{ lang.Side.Title }}</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <ion-list>
            <ion-item lines="none">
              <ion-thumbnail slot="start">
                <ion-img
                  :src="photoURL"
                  :referrerpolicy="'no-referrer'"
                ></ion-img>
              </ion-thumbnail>
              <ion-text
                ><h6>{{ nome }}</h6>
                {{ email }}</ion-text
              >
            </ion-item>

            <ion-item lines="none" />
            <ion-item lines="none" />

            <ion-menu-toggle auto-hide="false">
              <ion-item routerDirection="forward">
                <ion-icon :icon="languageOutline" slot="start"></ion-icon>
                <ion-label>
                  {{ lang.Side.Lingua }}
                </ion-label>
                <ion-select
                  value="it"
                  @ionChange="onLangChange($event)"
                  v-model="currentLang"
                >
                  <ion-select-option value="it">{{
                    lang.Side.it
                  }}</ion-select-option>
                  <ion-select-option value="en">{{
                    lang.Side.en
                  }}</ion-select-option>
                </ion-select>
              </ion-item>
            </ion-menu-toggle>
            <!--<ion-item routerDirection="forward">
            <ion-icon name="heart" slot="start"></ion-icon>
            TERMINI E CONDIZIONI
          </ion-item>-->
            <ion-menu-toggle auto-hide="false">
              <ion-item button @click="openModal()" lines="full">
                <ion-icon :icon="documentTextOutline" slot="start"></ion-icon>
                <ion-label>{{ lang.Side.Terms }}</ion-label>
              </ion-item>
              <ion-item
                v-if="!isAnonymous"
                button
                @click="logout()"
                lines="full"
              >
                <ion-icon :icon="logOutOutline" slot="start"></ion-icon>
                <ion-label>
                  {{ lang.Side.Logout }}
                </ion-label>
              </ion-item>
              <ion-item
                v-if="isAnonymous"
                button
                @click="logout()"
                lines="full"
              >
                <ion-icon :icon="logInOutline" slot="start"></ion-icon>
                <ion-label>
                  {{ lang.Auth.Title }}
                </ion-label>
              </ion-item>
            </ion-menu-toggle>
          </ion-list>
        </ion-content>
      </ion-menu>

      <ion-menu
        side="start"
        menu-id="menuFilter"
        content-id="content1"
        @ionWillClose="onMenuFilterClose"
      >
        <ion-header>
          <ion-toolbar color="primary">
            <ion-title>Filtri</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <ion-list>
            <ion-list-header lines="inset">
              <ion-label>STAGIONE</ion-label>
            </ion-list-header>
            <ion-item>
              <ion-label>Estive</ion-label>
              <ion-toggle
                color="secondary"
                slot="start"
                name="seasonS"
                value="S"
                :checked="isSeasonOptionActive('S')"
                @ionChange="toggleSeason($event)"
              ></ion-toggle>
            </ion-item>
            <ion-item>
              <ion-label>Invernali</ion-label>
              <ion-toggle
                color="secondary"
                slot="start"
                name="seasonW"
                value="W"
                :checked="isSeasonOptionActive('W')"
                @ionChange="toggleSeason($event)"
              ></ion-toggle>
            </ion-item>
            <ion-item>
              <ion-label>Quattro stagioni</ion-label>
              <ion-toggle
                color="secondary"
                slot="start"
                name="seasonA"
                value="A"
                :checked="isSeasonOptionActive('A')"
                @ionChange="toggleSeason($event)"
              ></ion-toggle>
            </ion-item>

            <ion-item lines="none"></ion-item>

            <ion-list-header lines="inset">
              <ion-label>MARCA</ion-label>
            </ion-list-header>
            <ion-item>
              <ion-label>Marche TOP</ion-label>
              <ion-toggle
                color="secondary"
                slot="start"
                name="brandP"
                value="P"
                :checked="isBrandOptionActive('P')"
                @ionChange="toggleBrand($event)"
              ></ion-toggle>
            </ion-item>
            <ion-item>
              <ion-label>Marche MEDIE</ion-label>
              <ion-toggle
                color="secondary"
                slot="start"
                name="brandM"
                value="M"
                :checked="isBrandOptionActive('M')"
                @ionChange="toggleBrand($event)"
              ></ion-toggle>
            </ion-item>
            <ion-item>
              <ion-label>Marche ECONOMICHE</ion-label>
              <ion-toggle
                color="secondary"
                slot="start"
                name="brandE"
                value="E"
                :checked="isBrandOptionActive('E')"
                @ionChange="toggleBrand($event)"
              ></ion-toggle>
            </ion-item>

            <!--<ion-item lines="none"></ion-item>
          <div class="ion-text-center" v-if="additionalFilter.isChanged">
          <ion-button color="primary">APPLICA FILTRI</ion-button>
          </div>-->
          </ion-list>
        </ion-content>
      </ion-menu>

      <ion-router-outlet id="content1" />
    </ion-split-pane>
  </ion-app>
</template>
  
<script lang="ts">
import {
  IonApp,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonContent,
  IonMenu,
  IonThumbnail,
  IonImg,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonMenuToggle,
  IonText,
  alertController,
  IonSplitPane,
  IonListHeader,
  IonToggle,
  modalController,
  //menuController
  //IonButton
} from "@ionic/vue";
import { computed, defineComponent, onBeforeMount, reactive } from "vue";
import { auth } from "./main";
import {
  languageOutline,
  logOutOutline,
  logInOutline,
  documentTextOutline,
} from "ionicons/icons";
import { useStore } from "vuex";
import { key, Platform } from "./store";
import { StorageService } from "./services/storage.service";
import { useRouter } from "vue-router";
import firebase from "firebase/app";
import "firebase/auth";
import { Plugins } from "@capacitor/core";
const { Device, NativeMarket, SplashScreen } = Plugins;
import ModalTerms from "@/components/ModalTerms.vue";

export default defineComponent({
  name: "App",
  components: {
    IonApp,
    IonRouterOutlet,
    IonTitle,
    IonToolbar,
    IonHeader,
    IonIcon,
    IonItem,
    IonList,
    IonContent,
    IonMenu,
    IonThumbnail,
    IonImg,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonMenuToggle,
    IonText,
    IonSplitPane,
    IonListHeader,
    IonToggle,
    //IonButton
    //aldSidebar
  },
  methods: {
    async openModal() {
      const modal = await modalController.create({
        component: ModalTerms,
        //cssClass: "my-custom-modal-css",
        swipeToClose: true,
        showBackdrop: true,
        presentingElement: this.$el,
      });
      return modal.present();
    },
  },
  setup() {
    const store = useStore(key);
    const router = useRouter();
    const appSettings = computed(() => store.state.appSettings);
    const lang = computed(() => store.state.lang);
    const routeAfterSignIn = computed(
      () => store.state.auth?.routeAfterSignIn ?? "/tabs/tab1"
    );
    const additionalFilter = computed(() => store.state.additionalFilter);
    console.log("initial additionFilter", additionalFilter.value.season);
    const filterMenuStatus = reactive({
      season: store.state.additionalFilter.season,
      brandLevel: store.state.additionalFilter.brandLevel,
    });

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

    const checkAppVersion = async (info: any, platformObj: Platform) => {
      //chek new version
      await store.dispatch("loadAppSettings");
      console.log(appSettings.value);
      if (appSettings.value) {
        if (info.platform == "android") {
          const currentVerCode = platformObj.appVerCode;
          const lastVerCode = appSettings.value.lastAndroidVerCode;
          const appName = appSettings.value.androidAppId;
          if (currentVerCode < lastVerCode) {
            console.log(
              "Request update curr.ver:",
              currentVerCode,
              " - last ver:",
              lastVerCode
            );
            console.log(appName);
            const buttons = [
              {
                text: lang.value.App.AggiornaButton,
                handler: () => {
                  NativeMarket.openStoreListing({
                    appId: appName,
                  });
                },
              },
            ];
            await PresentAlertError(
              lang.value.App.AggiornaTitle,
              lang.value.App.AggiornaText,
              buttons
            );
          }
        } else if (info.platform == "ios") {
          const currentVerCode = platformObj.appVerCode;
          const lastVerCode = appSettings.value.lastIosVerCode;
          const appName = appSettings.value.iosAppId;
          if (currentVerCode < lastVerCode) {
            const buttons = [
              {
                text: lang.value.App.AggiornaButton,
                handler: () => {
                  NativeMarket.openStoreListing({
                    appId: appName,
                  });
                },
              },
            ];
            await PresentAlertError(
              lang.value.App.AggiornaTitle,
              lang.value.App.AggiornaText,
              buttons
            );
          }
        }
      }
    };

    const initApp = async () => {
      //menuController.enable(true, 'first');
      //menuController.open('first');

      if (!store.state.lang) {
        const lang = StorageService.getLang();
        store.dispatch("selectLang", lang ?? "it");
        StorageService.saveLang(lang ?? "it");
        console.log("Caricamento lingua:", lang ?? "it");
      }

      const info = await Device.getInfo();
      console.log("info", info);
      const platformObj: Platform = {
        appVerNumber: info.appVersion,
        appVerCode: info.appBuild,
        os: info.platform,
      };
      console.log("Platform info", platformObj);

      //Authentication
      auth.onAuthStateChanged((user) => {
        if (user) {
          store
            .dispatch("setAuth", { user: user, platform: platformObj })
            .then((): void => {
             
                  if (
                    router.currentRoute.value.fullPath != routeAfterSignIn.value
                  ) {
                    router.push(routeAfterSignIn.value);
                  }
                });
              
        } else {
          // User is signed out
          store.dispatch("resetUser").then(() => {
            router.push("/login");
          });
        }
      });

      const currentUser = firebase.auth().currentUser;
      if (currentUser) {
        console.log("Utente già loggato: " + auth.currentUser?.displayName);
        router.push("/tabs/tab1");
         SplashScreen.hide().then( async(): Promise<void> => {
               await checkAppVersion(info, platformObj)
         });
      } else {
        console.log("Utente non loggato!");
        router.push("/login");
        SplashScreen.hide().then( async(): Promise<void> => {
                checkAppVersion(info, platformObj)
         });
      }

      store.dispatch('loadFeeds');
    };

    const logout = async () => {
      await auth.signOut();
      store.dispatch("resetUser");
      console.log("User logged out");
      router.push("/login");
    };

    const onLangChange = (event: Event & { target: HTMLInputElement }) => {
      const l = event.target.value;
      console.log("Cambio lingua:", l);
      store.dispatch("selectLang", l);
      StorageService.saveLang(l);
    };

    const onMenuFilterClose = async (): Promise<void> => {
      if (additionalFilter.value.isChanged) {
        await store.dispatch("applyAdditionalFilter");
      }
    };

    const toggleSeason = (event: Event & { target: HTMLInputElement }) => {
      const value = event.target.value;
      store.dispatch("toggleSeason", value);
    };

    const isSeasonOptionActive = (value: string): boolean => {
      return filterMenuStatus.season.indexOf(value) !== -1;
    };

    const toggleBrand = (event: Event & { target: HTMLInputElement }) => {
      const value = event.target.value;
      store.dispatch("toggleBrandLevel", value);
    };

    const isBrandOptionActive = (value: string): boolean => {
      return filterMenuStatus.brandLevel.indexOf(value) !== -1;
    };

    onBeforeMount(async () => {
      initApp();
    });

    return {
      isAnonymous: computed(() => store.state.auth?.user?.isAnonymous ?? false),
      nome: computed(
        () =>
          store.state.auth?.user?.displayName ?? store.state.lang.Auth.Anonimo
      ),
      photoURL: computed(
        (): any =>
          store.state.auth?.user?.photoURL ??
          require("/public/assets/logo/profilo_512.jpg")
      ),
      email: computed(() => store.state.auth?.user?.email ?? ""),
      additionalFilter,
      filterMenuStatus,
      languageOutline,
      logOutOutline,
      logInOutline,
      documentTextOutline,
      currentLang: computed(() => store.state.currentLang),
      allLangs: store.state.langs,
      user: auth.currentUser,
      logout,
      onLangChange,
      lang,
      toggleSeason,
      isSeasonOptionActive,
      toggleBrand,
      isBrandOptionActive,
      onMenuFilterClose,
      //router,
    };
  },
});
</script>