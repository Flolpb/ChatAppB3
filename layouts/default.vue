<template>
  <v-app class="section">
    <v-main>
      <transition name="slide-fade"><Nuxt /></transition>
    </v-main>
  </v-app>
</template>

<script>

import { ACTIONS } from "../store/auth.js";
export default {
  mounted() {
    const user = this.$fireModule.auth().currentUser;
    if( user != null){
      this.$cookies.set('uid', user.uid, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7
      });
      const currentUser = {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        uid: user.uid
      }
      this.$store.dispatch(ACTIONS.LOGIN, currentUser);
    }else{
      this.$cookies.remove('uid');
    }
    
  }
}

</script>

<style scoped lang="scss">
  .section {
    height: 100%;
    background: #272753;
    background: -webkit-linear-gradient(180deg, #272753 0%, rgba(27, 27, 58, 0.79) 53.54%);
    background: linear-gradient(180deg, #272753 0%, rgba(27, 27, 58, 0.79) 53.54%);
  }

  .slide-fade-enter-active {
      transition: all .8s ease;
  }
  .slide-fade-leave-active {
      transition: all 0s ease;
  }
  .slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active below version 2.1.8 */ {
      transform: translateY(-100px);
      opacity: 0;
  }

</style>
