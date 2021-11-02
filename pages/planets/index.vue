<template>
  <div>
    <SidebarMenu :items="items" />
  </div>

</template>

<script>
import SidebarMenu from "../../components/SidebarMenu";
import {ACTIONS} from "../../store/auth";
export default {
  name: "index",
  components: {SidebarMenu},
  mounted() {
    //On remplit le tableau quand le composant est initialisé, sinon les appels de fonction depuis les composants enfants
    // ne marche pas car les fonctions n'ont pas le temps de charger et de s'ajouter à la méthode click
    this.items = [
      { title: 'Profil', route:'/profile' },
      { title: 'Planètes', route:'/planets' },
      { title: 'Amis', route:'/friends' },
      { title: 'Paramètres', route:'/parameter' },
      { title: 'Se déconnecter', click: () => this.logout(), class_color: 'red--text'}
    ]
  },
  methods: {
    async logout(){
      console.log("call")
      await this.$fireModule.auth().signOut();
      this.$store.dispatch(ACTIONS.LOGOUT);
      this.$cookies.remove('uid');
      this.$router.push('/login');
    },
  },
  data: () => ({
    items: [],
  }),
}
</script>

<style scoped>

</style>
