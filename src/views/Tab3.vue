<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab 3</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 3</ion-title>
        </ion-toolbar>
      </ion-header>
      <pre>{{ state }}</pre>
      <!--<ExploreContainer name="Tab 3 page" />-->
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from "@ionic/vue";
import { useStore } from "vuex";
import { key } from "../store";

//import ExploreContainer from '@/components/ExploreContainer.vue';

export default defineComponent({
  name: "Tab3",
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage },
  setup() {
    const store = useStore(key);

    return {
      state: computed(() => store.state),
    };
  },
});
</script>