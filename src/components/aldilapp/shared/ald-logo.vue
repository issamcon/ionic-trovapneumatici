<template>
  <ion-img alt="logo aldilapp" :src="image" class="logo"></ion-img>
</template>


<script lang="ts">
import { IonImg } from '@ionic/vue'
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'aldLogo',
  components: { IonImg },
  setup() {
    const image = computed(() => require('/public/assets/logo/logo_app_neg.png'))

    return {
      image,
    }
  }
})
</script>

<style scoped>
.logo{
  height: 50px;
  padding: 10px;
}
</style>