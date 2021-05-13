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

    <ion-content class="map-backgorund">
      <div id="container"></div>

      <ion-card>
        <ion-card-header>
          <ion-card-title color="secondary">
            {{ lang.Results.Title }}
          </ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <!--<ion-text color="secondary"
        ><h3></h3></ion-text
      >-->
          <ion-list>
            <ion-item-group>
              <div v-for="r in results" :key="r.id">
                <ion-item-divider>
                  <ion-label>{{ r.cimiteroName }}</ion-label>
                </ion-item-divider>
                <ion-item
                  button
                  @click="gotoDetail(d.id)"
                  lines="inset"
                  detail="true"
                  v-for="d in r.defunti"
                  :key="d.id"
                >
                  <ion-grid>
                    <ion-row>
                      <ion-col>
                        <ion-text color="primary">
                          <h6>#{{ d.id }} {{ d.cognome }} {{ d.nome }}</h6>
                        </ion-text>
                      </ion-col>
                    </ion-row>
                    <ion-row>
                      <ion-col>
                        <small
                          >{{ lang.Results.NatoLabel }}
                          {{
                            new Date(d.dataNascita).toLocaleDateString("it-IT")
                          }}</small
                        >
                      </ion-col>
                      <ion-col>
                        <small
                          >{{ lang.Results.MortoLabel }}
                          {{
                            new Date(d.dataMorte).toLocaleDateString("it-IT")
                          }}</small
                        >
                      </ion-col>
                    </ion-row>
                  </ion-grid>
                </ion-item>
              </div>
            </ion-item-group>
          </ion-list>
        </ion-card-content>
      </ion-card>
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
  IonList,
  IonItem,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonItemGroup,
  IonItemDivider,
  IonLabel,
  IonButtons,
  IonMenuButton,
  IonBackButton,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonCardHeader,
} from "@ionic/vue";
import { computed, defineComponent } from "vue";
import aldLogo from "@/components/aldilapp/shared/ald-logo.vue";
import { useStore } from "vuex";
import { key } from "../store";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Results",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonList,
    IonItem,
    IonText,
    IonGrid,
    IonRow,
    IonCol,
    IonItemGroup,
    IonItemDivider,
    IonLabel,
    IonButtons,
    IonMenuButton,
    IonBackButton,
    aldLogo,
    IonCard,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
  },
  methods: {
    gotoDetail(id: number): void {
      const route = "/tabs/tab1/detail/" + id;
      this.router.push(route);
    },
  },
  setup() {
    const store = useStore(key);
    const router = useRouter();
    return {
      resultsCount: computed(() => store.state.searchResultsCount),
      results: computed(() => store.state.results),
      lang: computed(() => store.state.lang),
      router,
    };
  },
});
</script>

<style scoped>
</style>