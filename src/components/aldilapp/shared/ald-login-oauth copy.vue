<template>
  <ion-card-content>
    <ion-button
      v-if="authState.mode === AuthMode.SignIn"
      expand="block"
      color="danger"
      class="ion-margin-top"
      type="button"
      @click="signInWithGoogleLogin"
    >
      <ion-icon :icon="logoGoogle" class="absolute-icon"></ion-icon>
      {{ lang.Auth.AccediConGoogle }}
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
      color="tertiary"
      class="ion-margin-top"
      v-if="
        authState.mode === AuthMode.SignIn && props.anonymousEnabled == 'true'
      "
      @click="signInAsAnonymus"
    >
      {{ lang.Auth.AccediAnonimo }}
    </ion-button>
  </ion-card-content>
  <ion-card-content v-if="authState.errorMsg" class="error-message">
    {{ authState.errorMsg }}
  </ion-card-content>
</template>


<script lang="ts">
import { IonCardContent, IonButton, IonIcon } from "@ionic/vue";
import { computed, defineComponent } from "vue";
import { auth, googleProvider } from "@/main";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { key, AuthMode } from "../../../store";
import firebase from "firebase/app";
import "firebase/auth";
import {
  logoGoogle,
  //, logoApple
} from "ionicons/icons";
//import { logIn, personAdd } from "ionicons/icons";

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
    const store = useStore(key);
    const router = useRouter();
  

    /*


    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("User logged in: " + user.displayName);
        actions.setAuth(user).then(() => {
          console.log("Go to page: " + props.goToRoute);
          router.push(props.goToRoute);
        });
        // ...
      } else {
        // User is signed out
        actions.resetUser();
      }
    });*/

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
      try {
        // You can add additional scopes to the provider:
        googleProvider.addScope(
          "https://www.googleapis.com/auth/userinfo.email"
        );
        googleProvider.addScope(
          "https://www.googleapis.com/auth/userinfo.profile"
        );
        // Sign in with popup:

        auth
          .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
          .then(function () {
            auth.signInWithPopup(googleProvider).then(
              function (result) {
                if (result.user) {
                  /*const credential = result.credential;

                  if (currentUser && credential) {
                    currentUser
                      .linkWithCredential(credential)
                      .then((usercred) => {
                        const user = usercred.user;
                        console.log(
                          "Anonymous account successfully upgraded",
                          user
                        );
                      })
                      .catch((error) => {
                        console.log("Error upgrading anonymous account", error);
                      });
                  }*/

                  console.log("Go to page: " + props.goToRoute);
                  router.push(props.goToRoute);
                }
              },
              function (error) {
                console.log(error);
                // The provider's account email, can be used in case of
                // auth/account-exists-with-different-credential to fetch the providers
                // linked to the email:
                //var email = error.email;
                // The provider's credential:
                //var credential = error.credential;
                // In case of auth/account-exists-with-different-credential error,
                // you can fetch the providers using this:
                if (
                  error.code === "auth/account-exists-with-different-credential"
                ) {
                  auth
                    .fetchSignInMethodsForEmail(error.email)
                    .then(function (providers) {
                      console.log(providers);
                      // The returned 'providers' is a list of the available providers
                      // linked to the email address. Please refer to the guide for a more
                      // complete explanation on how to recover from this error.
                    });
                }
                const errorMsg = error.code + " - " + error.message;
                throw new Error(errorMsg);
              }
            );
          });
      } catch (error) {
        console.log(error);
        const errorMsg = error.code + " - " + error.message;
        store.dispatch("setFailAuth", errorMsg);
      }
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
      signInAsAnonymus,
      AuthMode,
      lang: computed(() => store.state.lang),
      authState: computed(() => store.state.auth),
      props,
      router,
      logoGoogle,
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