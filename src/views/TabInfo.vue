<template>
  <ion-page>
    
    <ion-header >
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Ultime notizie</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-loading
      :is-open="isLoading"
      cssClass="my-custom-class"
      :message="lang.Detail.InCaricamento"
    >
    </ion-loading>

    <ion-content :fullscreen="true">
      <!--<ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 3</ion-title>
        </ion-toolbar>
      </ion-header>-->
      <ion-card class="feed-card"
        v-for="i in iterfaceStatus.items"
        :key="i.guid"
        @click="openModal(i.guid)"
      >
        <img class="header-img" :src="i.imageUrl" />
        <!--<ion-card-header>
          <ion-card-title></ion-card-title>
        </ion-card-header>-->
        <ion-card-content>
          <h2>{{ i.title }}</h2>
          <ion-text>{{ i.snippet }}</ion-text>
          
        </ion-card-content>
        <ion-row class="card-footer">
          <ion-col>
            <ion-text><small><b>Fonte:</b><br/>{{i.source}}</small></ion-text>
          </ion-col>
          <ion-col class="ion-text-right">
            <ion-text><small>pubblicato il<br/>{{ convertDateToString(new Date(i.date)) }}</small></ion-text>
          </ion-col>
        </ion-row>
      </ion-card>

      <!--<ExploreContainer name="Tab 3 page" />-->
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, reactive, ref } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  //IonCardTitle,
  //IonCardHeader,
  IonBackButton,
  //IonMenuButton,
  IonButtons,
  IonLoading,
  IonText,
  IonRow,
  IonCol,
  modalController,
  menuController
} from "@ionic/vue";
import { useStore } from "vuex";
import { key } from "../store";
//import aldLogo from "@/components/aldilapp/shared/ald-logo.vue";
import Parser from "rss-parser";
import { CorsAnyware } from "@/services/corsanyware.service";
import Modal from "@/components/Modal.vue";
import { FeedItem } from "@/models/index";
type CustomFeed = { foo: string };
type CustomItem = {
  pubDate: Date;
  category: string;
  guid: string;
  title: string;
  content: string;
};

export default defineComponent({
  name: "TabNews",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonCard,
    IonCardContent,
    //IonCardTitle,
    //IonCardHeader,
    //aldLogo,
    IonBackButton,
    //IonMenuButton,
    IonButtons,
    IonLoading,
    IonText,
    IonRow,
    IonCol,
  },
  methods: {
    convertDateToString(date: Date): string {
      const dd = String(date.getDate()).padStart(2, "0");
      const mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
      const yyyy = date.getFullYear();
      return dd + "/" + mm + "/" + yyyy;
    },
    async openModal(guid: string) {
      const items = this.iterfaceStatus.items.filter((i: any) => {
        return i.guid === guid;
      });
      if (items && items.length > 0) {
        const item = items[0];
        const modal = await modalController.create({
          component: Modal,
          //cssClass: "my-custom-modal-css",
          swipeToClose: true,
          showBackdrop: true,
          presentingElement: this.$el,
          componentProps: {
            title: item.title,
            content: item.content,
          },
        });
        return modal.present();
      }
    },
    openFirst() {
      menuController.enable(true, 'first');
      menuController.open('first');
    },
  },
  setup() {
    const isLoading = ref(false);
    const store = useStore(key);
    const lang = computed(() => {
      return store.state.lang;
    });
    const feedItems = computed(() => {
      return store.state.feedItems;
    });

    const iterfaceStatus = reactive({ items: feedItems });

    /*const parser: Parser<CustomFeed, CustomItem> = new Parser({
      customFields: {
        //feed: ['foo', 'baz'],
        //            ^ will error because `baz` is not a key of CustomFeed
        item: ['pubDate','category','guid','title','content']
      }
    });*/
   
    const returnFirstImage = (content: string): string => {
      const images = content.split(" ").filter( (w: string) => { return w.endsWith('.jpg') || w.endsWith('.png')});
      return (images && images.length > 0 ? images[0].replace('srcset="','') : '');
    }

    const fecthFeed = async (): Promise<void> => {
      isLoading.value = true;
      const feedUrl = "https://www.gommeblog.it/feed";
      const parser = new Parser();

      const response = await CorsAnyware.get(feedUrl);
      const feed = await parser.parseString(response);
      //console.log(feed.items);
      iterfaceStatus.items = feed.items.map(
        (i) =>
          new FeedItem({
            title: i.title,
            source: feed.link,
            content: i["content:encoded"],
            link: i.link,
            snippet: i.contentSnippet,
            guid: i.guid,
            date: i.isoDate,
            imageUrl: returnFirstImage(i["content:encoded"]),
          })
      );
      isLoading.value = false;
    };

    onBeforeMount(async () => {
      if (feedItems.value.length == 0){
        console.log('Non ci sono feeditems');
        await fecthFeed();
      }
    });
    /*
    const setIsLoading = (state: boolean) => (isLoading.value = state);

    const loadCimitieri = async (): Promise<void> => {
      setIsLoading(true);
      //await store.dispatch("fetchCimiteri");
      setIsLoading(false);
    };

    onBeforeMount(() => {
      if (!cimiteri.value || cimiteri.value.length > 0) {
        loadCimitieri();
      }
    });*/

    return {
      state: computed(() => store.state),
      lang,
      isLoading,
      iterfaceStatus,
    };
  },
});
</script>

<style scoped>
.card-content p {
  padding-bottom: 10px;
}

.card-footer {
  bottom: 0;
  width: 100%;
  border-top: 1px solid #ddd;
  background: #fafafa90;
  padding: 5px;
  position: relative;
}

h1 {
  text-transform: uppercase;
  margin-bottom: 1rem;
  margin-top: 1rem;
  font-size: 1.5rem;
  margin-left: 20px;
}

h2 {
  margin-bottom: 1.3rem;
  font-size: 1.3rem;
  font-weight: 500;
}

.feed-card {
  --background-darker: var(--ion-color-step-200, #e9edf3);

  --text-dark: var(--ion-color-step-850, #27323f);
  --text-darker: var(--ion-color-step-950, #0e151f);

  --text-light: var(--ion-color-step-650, #5b708b);
  --text-lighter: var(--ion-color-step-550, #73849a);
  --text-lightest: var(--ion-color-step-300, #b2becd);
}

.feed-card .header-img {
  width: 100%;
  /*max-height: 220px;*/
  border: 0
}

</style>