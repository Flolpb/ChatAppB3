<template>
  <v-app class="section" v-if="loaded">
    <v-main>
      <transition name="slide-fade">
        <Nuxt />
      </transition>
    </v-main>
  </v-app>
</template>

<script>

import { ACTIONS } from "../store/auth.js";
export default {
  data() {
    return {
      loaded: false
    }
  },
  async created() {
    // lorsque l'utilisateur change de statut de connexion :
    this.$fire.auth.onAuthStateChanged(async () => {
      // On définit l'utilisateur en fonction de son authentification dans la base de donnée.
      const user = this.$fire.auth.currentUser;
      // Si il existe un user :
      if (user) {
        this.$cookies.set('uid', user.uid, {
          path: '/',
          // On garde le cookie pendant une semaine:
          maxAge: 60 * 60 * 24 * 7
        });
        //On définit le user actuel avec le user que l'on a récupéré précédemment.
        const currentUser = {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          uid: user.uid
        }

        //On met le user dans le store.
        await this.$store.dispatch('auth/login', currentUser).then(
          r => this.loaded = true,
          err => this.loaded = true
        )
      } else {
        this.loaded = true;
        // si le user n'est pas connecté =>on remove le cookie
        this.$cookies.remove('uid');
      }
    })
  },
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
