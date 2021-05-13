<template>
  <ion-card-content>
    <form
      @submit.prevent="
        mode === AuthMode.SignIn
          ? signInWithEmailAndPassword(email, password)
          : signUpWithEmailAndPassword(name, email, password)
      "
    >
      <ion-item v-if="mode === AuthMode.SignUp">
        <ion-label position="stacked">Name</ion-label>
        <ion-input v-model="name"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="stacked">Email</ion-label>
        <ion-input v-model="email"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="stacked">Password</ion-label>
        <ion-input v-model="password" type="password"></ion-input>
      </ion-item>

      <ion-button
        expand="block"
        color="primary"
        class="ion-margin-top"
        type="submit"
      >
        {{ mode === AuthMode.SignIn ? "Accedi" : "Registrati" }}
        <ion-icon v-if="mode === AuthMode.SignIn" :icon="logIn"></ion-icon>
        <ion-icon v-else :icon="personAdd"></ion-icon>
      </ion-button>
      <ion-button
        expand="block"
        color="secondary"
        class="ion-margin-top"
        @click="
          mode = mode === AuthMode.SignIn ? AuthMode.SignUp : AuthMode.SignIn
        "
      >
        {{ mode === AuthMode.SignIn ? "Registrati" : "Annulla" }}
        <ion-icon v-if="mode === AuthMode.SignIn" :icon="personAdd"></ion-icon>
      </ion-button>
    </form>
    <p v-if="mode === AuthMode.SignIn" class="text-center mt-4">oppure</p>

    <ion-button
      v-if="mode === AuthMode.SignIn"
      expand="block"
      color="danger"
      class="ion-margin-top"
      type="button"
      @click="signInWithGoogleLogin"
    >
      Accedi con Google
    </ion-button>

    <p v-if="mode === AuthMode.SignIn" class="text-center mt-4">oppure</p>

    <ion-button
      expand="block"
      color="tertiary"
      class="ion-margin-top"
      v-if="mode === AuthMode.SignIn"
      @click="signInAsAnonymus"
    >
      Accedi in anonimo
    </ion-button>
  </ion-card-content>
  <ion-card-content v-if="errorMsg" class="error-message">
    {{ errorMsg }}
  </ion-card-content>
</template>


<script lang="ts">
import {
  IonCardContent,
  IonInput,
  IonButton,
  IonLabel,
  IonItem,
  IonIcon,
} from "@ionic/vue";
import { defineComponent, reactive, toRefs } from "vue";
import { auth, db } from "@/main";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { key, AuthMode} from "../../../store";
import { logIn, personAdd } from "ionicons/icons";

export default defineComponent({
  name: "aldLoginBase",
  props: {
    goToRoute: {
      type: String,
      default: "/tabs/tab1",
    },
  },
  components: {
    IonCardContent,
    IonInput,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
  },
  setup(props) {
    const router = useRouter();
    const store = useStore(key);
    const user = reactive<User>({
      userid: "",
      name: "",
      email: "",
      password: "",
      mode: AuthMode.SignIn,
      errorMsg: "",
      isAnonymous: false,
      isAuth: false,
    });

    const signInAsAnonymus = async () => {
      user.isAnonymous = true;
      store.commit("setUser", user);
      router.push(props.goToRoute);
    };

    const signInWithEmailAndPassword = async (
      email: string,
      password: string
    ): Promise<void> => {
      try {
        if (!email || !password) {
          user.errorMsg = "Inserisci Email e Password";
          return;
        }
        const u = await auth.signInWithEmailAndPassword(email, password);

        user.isAuth = true;
        (user.name = email),
          (user.password = password),
          (user.userid = u.user?.uid ?? "");
        user.isAnonymous = false;

        store.commit("setUser", user);

        router.push(props.goToRoute);
      } catch (error) {
        user.errorMsg = error.message;
        user.isAuth = false;
      }
    };

    const signUpWithEmailAndPassword = async (
      name: string,
      email: string,
      password: string
    ) => {
      try {
        if (!name || !email || !password) {
          user.errorMsg = "Inserisci Nome, Email e Password";
          return;
        }

        const authRes = await auth.createUserWithEmailAndPassword(
          email,
          password
        );
        db.collection("users").doc(authRes.user?.uid).set({
          name,
          email,
        });
        user.isAuth = true;
        store.commit("setUser", user);

        router.push("/tabs/tab1");
      } catch (error) {
        user.errorMsg = error.message;
      }
    };

    const isRequired = (value: any) => {
      if (!value) {
        return "Questo è un dato necessario!";
      }
      return true;
    };

    return {
      ...toRefs(user),
      signInWithEmailAndPassword,
      signUpWithEmailAndPassword,
      signInAsAnonymus,
      AuthMode,
      logIn,
      personAdd,
      isRequired
    };
  },
});
</script>

<style scoped>
</style>