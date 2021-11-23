<template>

  <ion-card-content>
    <ion-button
      v-if="authState.mode === AuthMode.SignIn && showGoogleSignIn"
      expand="block"
      color="danger"
      class="ion-margin-top"
      type="button"
      @click="signInWithGoogleLogin"
    >
      <ion-icon :icon="logoGoogle" class="absolute-icon"></ion-icon>
      {{ lang.Auth.AccediConGoogle }}
    </ion-button>

    <ion-button
      v-if="authState.mode === AuthMode.SignIn && showAppleSignIn"
      expand="block"
      color="dark"
      class="ion-margin-top"
      type="button"
      @click="signInWithAppleLogin"
    >
      <ion-icon :icon="logoApple" class="absolute-icon"></ion-icon>
      {{ lang.Auth.AccediConApple }}
    </ion-button>

    <p
      v-if="
        authState.mode === AuthMode.SignIn && props.anonymousEnabled == 'true'
      "
      class="text-center mt-4"
    >
      {{ lang.Auth.Oppure }}
    </p>

    <ion-button
      expand="block"
      color="secondary"
      class="ion-margin-top"
      v-if="
        authState.mode === AuthMode.SignIn && props.anonymousEnabled == 'true'
      "
      @click="signInAsAnonymus"
    >
      {{ lang.Auth.AccediAnonimo }}
    </ion-button>
    <div class="alert alert-danger error-message" v-if="authState.errorMsg">
    {{ authState.errorMsg }}
  </div>
  </ion-card-content>
</template> 

<script lang="ts">
import { IonCardContent, IonButton, IonIcon, isPlatform, alertController } from "@ionic/vue";
import { computed, defineComponent } from "vue";
import { auth } from "../../../main";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { key, AuthMode } from "../../../store";
import firebase from "firebase/app";
import "firebase/auth";
import { logoGoogle, logoApple } from "ionicons/icons";
//import { logIn, personAdd } from "ionicons/icons";
import "@codetrix-studio/capacitor-google-auth";
import { Plugins, registerWebPlugin } from "@capacitor/core";
import {
  SignInWithApple,
  SignInWithAppleResponse,
  SignInWithAppleOptions,
} from "@capacitor-community/apple-sign-in";

export default defineComponent({
  name: "aldLoginOauth",
  props: {
    goToRoute: {
      type: String,
      default: "/tabs/tab1",
    },
    anonymousEnabled: {
      type: String,
      default: "true",
    },
    googleSingInEnabled: {
      type: String,
      default: "true",
    },
    passwordSingInEnabled: {
      type: String,
      default: "false",
    },
  },
  components: {
    IonCardContent,
    IonButton,
    IonIcon,
  },
  setup(props) {
    
    registerWebPlugin(SignInWithApple);
    const store = useStore(key);
    const router = useRouter();
    const showAppleSignIn = isPlatform("ios") || isPlatform("iphone") || isPlatform("ipad");
    const showGoogleSignIn = !showAppleSignIn;
    const lang = computed(() => store.state.lang);
    const options: SignInWithAppleOptions = {
      clientId: "com.stup1.aldilapp",
      redirectURI: "http://localhost:8100/login",
      scopes: "email name",
      state: "12345",
      nonce: "nonce",
    };
    store.dispatch("setRouteAfterSignIn", props.goToRoute);

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

    const signInAsAnonymus = async (): Promise<void> => {
      auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).then(() =>
        auth
          .signInAnonymously()
          .then(() => {
            console.log("User is signed as anonymus");
            console.log("Go to page: " + props.goToRoute);
            router.push(props.goToRoute);
          })
          .catch((error) => {
            const errorMsg = error.code + " - " + error.message;
            store.dispatch("setFailAuth", errorMsg);
          })
      );
    };

    const signInWithGoogleLogin = async (): Promise<void> => {
      const googleUser = await Plugins.GoogleAuth.signIn();
      const credential = firebase.auth.GoogleAuthProvider.credential(
        googleUser.authentication.idToken
      );
      await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      auth
        .signInWithCredential(credential)
        .then(() => {
          //console.log("Go to page: " + props.goToRoute);
          //router.push(props.goToRoute);
        })
        .catch( async(error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          /*if (errorCode === "auth/invalid-custom-token") {
            alert("The token you provided is not valid.");
          } else {
            console.error(error);
          }*/
          const errorMsg = errorCode + " - " + errorMessage;
          await PresentAlertError(
              lang.value.App.AuthFallitaTitle,
              errorMsg,
              ['Ok']
            );
          store.dispatch("setFailAuth", errorMsg);
        });
    };

    const signInWithAppleLogin = async (): Promise<void> => {
      const options: SignInWithAppleOptions = {
  clientId: 'com.stup1.aldilapp',
  redirectURI: 'https://aldilapp-ae56b.firebaseapp.com/__/auth/handler',
  scopes: 'email name',
  state: '12345',
  nonce: 'nonce',
};
      const appleUser: SignInWithAppleResponse = await Plugins.SignInWithApple.authorize();
      const provider = new firebase.auth.OAuthProvider("apple.com");
      const credential = provider.credential(appleUser.response.identityToken);
      await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      auth
        .signInWithCredential(credential)
        .then(() => {
          //console.log("Go to page: " + props.goToRoute);
          //router.push(props.goToRoute);
        })
        .catch( async(error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          /*if (errorCode === "auth/invalid-custom-token") {
            
          } else {
            console.error(error);
          }*/
          const errorMsg = errorCode + " - " + errorMessage;
          await PresentAlertError(
              lang.value.App.AuthFallitaTitle,
              errorMsg,
              ['Ok']
            );
          store.dispatch("setFailAuth", errorMsg);
        });
    };

    /*const u = reactive<User>({
      userid: "",
      name: "",
      email: "",
      password: "",
      mode: AuthMode.SignIn,
      errorMsg: "",
      isAnonymous: false,
      isAuth: false,
    });

*/
    return {
      //...toRefs(u),
      signInWithGoogleLogin,
      signInWithAppleLogin,
      signInAsAnonymus,
      AuthMode,
      lang,
      authState: computed(() => store.state.auth),
      props,
      router,
      logoGoogle,
      logoApple,
      showAppleSignIn,
      showGoogleSignIn,
      //logIn,
      //personAdd,
    };
  },
});
</script>

<style scoped>
.absolute-icon {
  position: absolute;
  left: var(--padding-start);
}
</style>