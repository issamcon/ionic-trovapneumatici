<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>
          <ald-logo></ald-logo>
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="map-backgorund">
      <!--<ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ lang.MieiDefunti.Title }}</ion-title>
        </ion-toolbar>
      </ion-header>-->

      <div id="container"></div>

      <div v-if="isEnabled">
        <ion-card>
          <ion-card-header>
            <ion-card-title color="secondary">{{
              lang.MieiDefunti.Title
            }}</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <!--<ion-text color="secondary">
          <h4 class="secondary"></h4>
        </ion-text>-->

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
              <div v-if="defunti && defunti.length > 0">
                <ion-card
                  v-for="d in defunti"
                  :key="d.id"
                  :router-link="'/tabs/tab1/detail/' + d.id"
                >
                  <ion-card-header>
                    <ion-card-subtitle>{{
                      d.posizioneAttuale.cimiteroNome
                    }}</ion-card-subtitle>
                    <ion-card-title>#{{ d.id }} {{ d.nome }} {{ d.cognome }}</ion-card-title>
                  </ion-card-header>

                  <ion-card-content>
                    <!--<ion-item lines="none">
                      <ion-button fill="solid" slot="end" shape="round" color="danger">
                        <ion-icon slot="icon-only" :icon="trashOutline"></ion-icon>
                      </ion-button>
                      <ion-button fill="outline" slot="end">View</ion-button>
                    </ion-item>-->
                    
                  </ion-card-content>
                </ion-card>
              </div>
              <div v-else>
                <ion-text>
                  <p>{{lang.MieiDefunti.NessunDefuntoText1}}</p>
                  <p>{{lang.MieiDefunti.NessunDefuntoText2}}
                  </p>
                </ion-text>
              </div>
            </div>
          </ion-card-content>
        </ion-card>

        <ion-fab vertical="bottom" horizontal="end" slot="fixed">
          <ion-fab-button class="my-button" router-link="/tabs/tab1">
            <ion-icon :icon="personAdd"></ion-icon>
          </ion-fab-button>
        </ion-fab>
      </div>
      <div v-else>
        <ion-card>
          <ion-card-header>
            <ion-card-subtitle
              >{{ lang.MieiDefunti.AccediSubTitle }}
            </ion-card-subtitle>
            <ion-card-title>{{ lang.MieiDefunti.AccediTitle }}</ion-card-title>
          </ion-card-header>
          <!--<ald-login-base goToRoute="/tabs/tab1"></ald-login-base>-->

          <ald-login-oauth goToRoute="/tabs/tab2" anonymousEnabled="false">
          </ald-login-oauth>
        </ion-card>

        <ion-card>
          <ion-card-header>
            <ion-card-subtitle>{{
              lang.MieiDefunti.PresentationTitle
            }}</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <div v-html="lang.MieiDefunti.PresentationHtmlContent"></div>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
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
  //IonButton,
} from "@ionic/vue";
import { useStore } from "vuex";
import { key } from "../store";
import aldLogo from "@/components/aldilapp/shared/ald-logo.vue";
import aldLoginOauth from "@/components/aldilapp/shared/ald-login-oauth.vue";
import { personAdd, trashOutline } from "ionicons/icons";
export default defineComponent({
  name: "Tab2",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    aldLogo,
    IonButtons,
    IonMenuButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
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
    //IonButton,
  },
  setup() {
    const store = useStore(key);
    const isLoading = ref(false);
    const isEnabled = computed(() => {
      return (
        store.state.auth &&
        store.state.auth.user &&
        !store.state.auth.user.isAnonymous &&
        store.state.auth.dbUserId
      );
    });
    const setIsLoading = (state: boolean) => (isLoading.value = state);

    const fetchMieiDefunti = async (): Promise<void> => {
      await store.dispatch("fetchMieiDefunti");
    };

    if (isEnabled.value) {
      setIsLoading(true);
      console.log('Avvio rucupero "Miei defunti"');
      fetchMieiDefunti().then(() => {
        setIsLoading(false);
      });
    }

    return {
      defunti: computed(() => store.state.mieiDefunti),
      lang: computed(() => store.state.lang),
      isLoading,
      isEnabled,
      personAdd,
      trashOutline,
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
</style>