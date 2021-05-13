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
              <ion-item button @click="logout()" lines="full">
                <ion-icon :icon="logOutOutline" slot="start"></ion-icon>
                <ion-label>
                  {{ lang.Side.Logout }}
                </ion-label>
              </ion-item>
            </ion-menu-toggle>
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
} from "@ionic/vue";
import { computed, defineComponent, onBeforeMount } from "vue";
import { auth } from "@/main";
import { languageOutline, logOutOutline } from "ionicons/icons";
import { useStore } from "vuex";
import { key, Platform } from "./store";
import { StorageService } from "@/services/storage.service";
import { useRouter } from "vue-router";
import firebase from "firebase/app";
import "firebase/auth";
import { Plugins } from "@capacitor/core";
const { Device, NativeMarket } = Plugins;
//import aldSidebar from "@/components/aldilapp/shared/ald-sidebar.vue";

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
    //aldSidebar
  },

  setup() {
    const store = useStore(key);
    const router = useRouter();
    const appSettings = computed(() => store.state.appSettings);
    const lang = computed(() => store.state.lang);
    const routeAfterSignIn = computed(() => store.state.auth?.routeAfterSignIn ?? "/tabs/tab1") 

    if (!store.state.lang) {
      const lang = StorageService.getLang();
      store.dispatch("selectLang", lang ?? "it");
      StorageService.saveLang(lang ?? "it");
      console.log("Caricamento lingua:", lang ?? "it");
    }

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

    onBeforeMount(async () => {
      const info = await Device.getInfo();
      console.log("info", info);
      const platformObj: Platform = {
        appVerNumber: info.appVersion,
        appVerCode: info.appBuild,
        os: info.platform,
      };
      console.log("info", platformObj);

      
      //chek new version
      await store.dispatch("loadAppSettings");
      console.log("appSettings", appSettings.value);
      if (appSettings.value) {
        if (info.platform == "android") {
          const currentVerCode = platformObj.appVerCode;
          const lastVerCode = appSettings.value.lastAndroidVerCode;
          const appName = appSettings.value.androidAppId;
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

      console.log(firebase.auth().currentUser);
      if (firebase.auth().currentUser != null) {
        console.log("Utente già loggato: " + auth.currentUser?.displayName);
        router.push("/tabs/tab1");
      }

      auth.onAuthStateChanged((user) => {
        if (user) {
          store
            .dispatch("setAuth", { user: user, platform: platformObj })
            .then(() => {
              //onsole.log('Current route',router.currentRoute.value);
              //console.log('Route to', routeAfterSignIn.value)
              if (router.currentRoute.value.fullPath != routeAfterSignIn.value){
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
    });

    return {
      isAnonymous: computed(() => store.state.auth?.user?.isAnonymous ?? false),
      nome: computed(
        () =>
          store.state.auth?.user?.displayName ?? store.state.lang.Auth.Anonimo
      ),
      photoURL: computed(
        () =>
          store.state.auth?.user?.photoURL ??
          require("/public/assets/logo/logo-aldilapp-social-512x512.png")
      ),
      email: computed(() => store.state.auth?.user?.email ?? ""),
      languageOutline,
      logOutOutline,
      currentLang: computed(() => store.state.currentLang),
      allLangs: store.state.langs,
      user: auth.currentUser,
      logout,
      onLangChange,
      lang,
      //router,
    };
  },
});
</script>