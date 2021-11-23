<template>
  <ion-page>
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1" href="/tabs/tab1">
          <ion-icon :icon="search" />
          <ion-label>{{lang.Tabs.TitleTab1}}</ion-label>
        </ion-tab-button>
          
        <ion-tab-button tab="tab2" href="/tabs/tab2">
          <ion-icon :icon="heart" />
          <ion-label>{{lang.Tabs.TitleTab2}}</ion-label>
        </ion-tab-button>
        
        <ion-tab-button tab="tab4" href="/tabs/tab4">
          <ion-icon :icon="informationCircleOutline" />
          <ion-label>{{lang.Tabs.TitleTab4}}</ion-label>
        </ion-tab-button>

         <ion-tab-button tab="tab5" @click="openFirst">
          <ion-icon :icon="personOutline" />
          <ion-label>{{lang.Tabs.TitleTab5}}</ion-label>
        </ion-tab-button>
     
        <ion-tab-button v-if="isDeveloperMode" tab="tab3" href="/tabs/tab3">
          <ion-icon :icon="square" />
          <ion-label>Sviluppo</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, menuController } from '@ionic/vue';
import { ellipse, square, triangle, heart, search, informationCircleOutline, personOutline } from 'ionicons/icons';
import { useStore } from "vuex";
import { key } from "../store";
import { computed } from "vue";

export default {
  name: 'Tabs',
  components: { IonLabel, IonTabs, IonTabBar, IonTabButton, IonIcon, IonPage },
  methods: {
    openFirst() {
      menuController.enable(true, 'first');
      menuController.open('first');
    },
  },
  setup() {
    const store = useStore(key);

    return {
      lang: computed(() => store.state.lang),
      isDeveloperMode: computed(() => store.state.auth && store.state.auth.user && store.state.auth.user.email == "luca.monaco@gmail.com"),
      ellipse, 
      square, 
      triangle,
      heart,
      search,
      informationCircleOutline,
      personOutline
    }
  }
}
</script>