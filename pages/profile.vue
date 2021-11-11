<template>
  <v-container fill-height fluid class="container">
    <v-row align="center" justify="center" class="row fill-height">
      <v-col cols="6" align="center">
        <div class="mb-5">
          <BackArrow :back-icon-click="redirect" :back-message="'Retour à l\'écran des planètes'" />
        </div>
        <v-img class="rounded-circle custom-img mb-5" :src="$store.state.auth.user.photoURL"></v-img>
        <CustomTitle :title="$store.state.auth.user.displayName" :fontSize="3" :marginBottom="0" />
      </v-col>
      <v-col cols="6" align="left">
        <CustomTitle :title="'Informations'" :fontSize="3" :marginBottom="1" />
        <div class="mb-5">
          <p class="custom-text">Identifiant</p>
          <em class="custom-caption">{{$store.state.auth.user.uid}}</em>
        </div>
        <div class="mb-5">
          <p class="custom-text">E-mail</p>
          <em class="custom-caption">{{$store.state.auth.user.email}}</em>
        </div>

        <CustomTitle :title="'Paramètres'" :fontSize="3" :marginBottom="1" />
        <CustomSwitch :name="'animation'" :label="'Animations activées'" :initial-value="animation" @update="onSwitchUpdate" />
        <CustomSwitch :name="'planetNames'" :label="'Nom des planètes affichées'" :initial-value="planetNames" @update="onSwitchUpdate" />

        <h2>Liste Des planètes de l'utilisateur</h2>
        <div v-for="(p, i) in planets"
             :key="i"
             exact>
          <UserPlanet :planetId="p" />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import {ACTIONS} from "../store/auth.js";
import CustomTitle from "../components/CustomTitle";
import CustomSwitch from "../components/CustomSwitch";
import BackArrow from "../components/BackArrow";
import UserPlanet from "../components/UserPlanet";
export default {
  components: {BackArrow, CustomSwitch},
  middleware: 'disconnect',
  data: () => ({
    planets: null,
    animation: null,
    planetNames: null
  }),
  async mounted() {
    await this.getUserPlanets();
    this.animation = this.$store.state.auth.user.parameters.animation;
    this.planetNames = this.$store.state.auth.user.parameters.planetNames;
  },
  methods: {
    async getUserPlanets() {
      if(this.user){
        const ref = await this.$fire.firestore.collection("users").doc(this.user);
        const snapshot = await ref.get();
        const doc = snapshot.data();
        this.planets = doc.planets;
      }else{
        this.user = this.$store.state.auth.user.uid;
        setTimeout(() => {
          this.getUserPlanets();
        }, 100);
      }
    },
    logout() {
      this.$store.dispatch(ACTIONS.LOGOUT);
      this.$router.push('/login');
    },
    // Mise à jour des paramètres depuis les switchs
    onSwitchUpdate(name, value) {
      this[name] = value;
      this.$store.dispatch(ACTIONS.UPDATE_USER_PARAMS, {
        name: name,
        value: value
      });
    },
    redirect() {
      this.$router.push('/planets')
    }
  }
}
</script>

<style scoped lang="scss">
  .container {
    width: 80vw;
  }
  .row {
    min-height: 80vh;
    background: $main-white;
    box-sizing: border-box;
    border-radius: 90px;
    margin: 0;
  }
  .sub-row {
    min-height: 0;
  }
  .custom-img {
    width: 15rem;
    height: 15rem;
  }
  .custom-text {
    color: black;
    font-family: 'HelveticaNowText-Medium', sans-serif;
    font-size: 1.5rem;
    margin: 0;
  }
  .custom-caption {
    color: black;
    font-family: 'HelveticaNowText-Medium', sans-serif;
    font-size: 1.25rem;
  }
</style>
