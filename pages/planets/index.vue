<template>
  <div>
    <SidebarMenu :items="sidebarItems" />
    <canvas :width="canvasData.width" :height="canvasData.height" ref="canvas" id="canvas" style="overflow-x: hidden;  "></canvas>
  </div>
</template>

<script>
import SidebarMenu from "../../components/SidebarMenu";
import {ACTIONS} from "../../store/auth";
export default {
  name: "index",
  components: {SidebarMenu},
  data: () => ({
    sidebarItems: [],
    planets: [],
    canvasData: {}
  }),
  created() {
    if (process.browser) {
      this.canvasData = {
        width: window.innerWidth,
        height: window.innerHeight,
      }
    }
  },
  async mounted() {
    // On remplit le tableau quand le composant est initialisé, sinon les appels de fonction depuis les composants enfants
    // ne marche pas car les fonctions n'ont pas le temps de charger et de s'ajouter à la méthode click
    this.sidebarItems = [
      { title: 'Profil', route:'/profile' },
      { title: 'Amis', route:'/friends' },
      { title: 'Paramètres', route:'/parameter' },
      { title: 'Se déconnecter', click: () => this.logout(), class_color: 'red--text'}
    ]
    this.planets = await this.getPlanets();
    this.drawPlanets();
  },
  methods: {
    async logout() {
      await this.$fireModule.auth().signOut();
      this.$store.dispatch(ACTIONS.LOGOUT);
      this.$cookies.remove('uid');
      this.$router.push('/login');
    },
    async getPlanets() {
      const ref = await this.$fire.firestore.collection("planets").get()
      return ref.docs.map(doc => doc.data());
    },
    redirectToPlanet(planetId) {
      this.$router.push(`/planets/${planetId}`)
    },
    random(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min)
    },
    drawPlanets() {
      this.planets.map((planet) => {
        this.generatePlanet(this.random(0, this.canvasData.width), this.random(0, this.canvasData.height));
      })
    },
    generatePlanet(x, y) {
      let context = this.$refs.canvas.getContext('2d');
      context.beginPath();
      context.fillStyle = 'snow';
      // De 0 à 2PI, cercle trigonométrique
      context.ellipse(x, y, 80, 80, 0,  0, 2 * Math.PI);
      context.fill();
    }
  },
}
</script>

<style scoped>
</style>
