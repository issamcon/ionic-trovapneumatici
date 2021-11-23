<template>
  <ion-img alt="logo" :src="image" class="logo"></ion-img>
</template>


<script lang="ts">
import { IonImg } from '@ionic/vue'
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'aldLogo',
  components: { IonImg },
  setup() {
    const image = computed(() => require('/public/assets/logo/logo_tp_h100.png'))

    return {
      image,
    }
  }
})
</script>

<style scoped>
.logo{
  height: 75px;
  padding: 5px;

}
</style>