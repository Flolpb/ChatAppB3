<template>
  <div>
    <div v-if="loading" class="d-flex justify-center" style="margin-top: 40vh; transform: translateY(-50%);" >
      <v-progress-circular
        indeterminate
        color="#ede3e8"
        :size="200"
        :width="10"
      ></v-progress-circular>
    </div>
    <div class="text-center">
      <SidebarMenu v-if="!loading" :items="sidebarItems"/>
      <canvas class="text-center" ref="canvas" id="canvas"></canvas>
    </div>
  </div>
</template>

<script>
import SidebarMenu from "../../components/SidebarMenu";
import {ACTIONS as ACTIONS_PLANET } from "../../store/planets";
import {ACTIONS as ACTIONS_AUTH } from "../../store/auth";
import {checkInCircle, getDistance, random} from "../../utils/commonFunctions"
import {colors} from "../../assets/colors";
export default {
  name: "index",
  components: {SidebarMenu},
  middleware: 'disconnect',
  data: () => ({
    sidebarItems: [],
    planets: [],
    canvasData: {},
    ellipses: [],
    PLANET_RADIUS: 0,
    RING_RADIUS_X: 0,
    RING_RADIUS_Y: 0,
    GLOBAL_PLANET_RADIUS: 0,
    CANVAS_MARGIN_X: 0,
    FPS: 0,
  }),
  async mounted() {
    // Récupération des planètes
    await this.$store.dispatch(ACTIONS_PLANET.GET_PLANETS);

    // Radius de chaque rond / planète
    this.PLANET_RADIUS = 80;
    // Radius en X de chaque anneau
    this.RING_RADIUS_X = 120;
    // Radius en Y de chaque anneau
    this.RING_RADIUS_Y = 15;
    // Radius global d'une planète et de ses anneaux (plus grand que RING_RADIUS_X pour laisser de la place pour le nom de la planète)
    this.GLOBAL_PLANET_RADIUS = 150;
    // Marge du canvas en X
    this.CANVAS_MARGIN_X = 200;
    // FPS pour les animations
    this.FPS = 60;

    // On remplit le tableau quand le composant est initialisé, sinon les appels de fonction depuis les composants enfants
    // ne marche pas car les fonctions n'ont pas le temps de charger et de s'ajouter à la méthode click
    this.sidebarItems = [
      { title: 'Nouvelle planète', route:'/planets/create', class_color: 'blue--text' },
      { title: 'Profil', route:'/profile' },
      { title: 'Amis', route:'/friends' },
      { title: 'Paramètres', route:'/parameter' },
      { title: 'Se déconnecter', click: () => this.logout(), class_color: 'red--text'}
    ];

    // Copie du tableau enregistré dans le state
    this.planets = JSON.parse(JSON.stringify(this.$store.state.planets.planets));
    this.updateCanvasHeight();

    // Ajout d'un évènement onClick sur le canvas pour entrer dans une planète
    this.$refs.canvas.addEventListener('click', (e) => {
      let clickedPlanet = this.ellipses.find((ellipse) => checkInCircle(e.offsetX, e.offsetY, ellipse.x, ellipse.y, this.RING_RADIUS_X));
      clickedPlanet && (this.redirectToPlanet(clickedPlanet.id))
    });

    this.$refs.canvas.addEventListener('mousemove', (e) => {
      let mousedPlanet = this.ellipses.find((ellipse) => checkInCircle(e.offsetX, e.offsetY, ellipse.x, ellipse.y, this.RING_RADIUS_X));
      let canvas = document.getElementById('canvas');
      mousedPlanet ? canvas.classList.add('canvas-cursor') : canvas.classList.remove('canvas-cursor');
    });

  },
  destroyed() {
    clearInterval(this.cyclicRedraw)
  },
  methods: {
    async logout() {
      // await this.$fireModule.auth().signOut();
      this.$store.dispatch(ACTIONS_AUTH.LOGOUT);
      // this.$cookies.remove('uid');
      this.$router.push('/login');
    },
    redirectToPlanet(planetId) {
      this.$router.push(`/planets/${planetId}`)
    },
    // Adapte la taille du canvas en fonction du nombre de planètes avant de commencer le dessin
    updateCanvasHeight() {
      if (process.browser) {
        // (Nb de planètes * Aire pour une planète (218 868 px²)) / (largeur de l'écran - marge du canvas)
        let height = (this.planets.length * 218868) / (window.innerWidth - this.CANVAS_MARGIN_X)
        this.canvasData = {
          width: window.innerWidth - this.CANVAS_MARGIN_X,
          // Si la hauteur calculée pour un nombre de planètes donné est inférieur à celle de l'écran, on prend celle de l'écran
          // et inversement
          height: height > window.innerHeight ? height : window.innerHeight
        }
        let ctx = this.$refs.canvas.getContext('2d');
        ctx.canvas.width = this.canvasData.width
        ctx.canvas.height = this.canvasData.height
      }
      this.launchDrawing();
    },
    launchDrawing() {
      let ctx = this.$refs.canvas.getContext('2d');
      this.cyclicRedraw = setInterval(() => {
        ctx.clearRect(0, 0, this.canvasData.width, this.canvasData.height);
        if (!this.ellipses.length) {
          this.drawPlanets();
        } else {
          this.ellipses.map((ellipse) => {
            ellipse.rings = ellipse.rings.map((e) => {
              // On ajoute une valeur à la rotation en fonction de la vitesse pour faire tourner les anneaux
              return {
                color: e.color,
                rot: e.rot += e.celerity * 0.001,
                lineWidth: e.lineWidth,
                celerity: e.celerity,
              }});
            this.generatePlanet(ellipse);
          });
        }
      }, 1000/this.FPS)
    },
    // Fonction de dessin de toutes les planètes
    drawPlanets() {
      // Flush des ellipses (si on recommence le dessin du canvas)
      this.ellipses = [];
      // Variable de limite pour éviter le crash si le canvas n'a pas assez de place
      let limit = 0;
      // On limite à 10000 essais de génération de coordonnées
      for (let i = 0; i < this.planets.length && limit < 10000; i++) {
        // On crée une objet avec des coordonnées aléatoire
        let newEllipse = {
          id: this.planets[i].id,
          name: this.planets[i].name,
          x: random(this.GLOBAL_PLANET_RADIUS, this.canvasData.width - this.GLOBAL_PLANET_RADIUS),
          y: random(this.GLOBAL_PLANET_RADIUS, this.canvasData.height - this.GLOBAL_PLANET_RADIUS),
          start_color: this.planets[i].skin.start_color,
          end_color: this.planets[i].skin.end_color,
          rings: this.planets[i].skin.rings ? this.planets[i].skin.rings : [],
        };

        // On vérifie parmi toutes les coordonnées déjà générées pour le nombre de planète récupéré si en fonction
        // du radius maximal par défaut des ellipses (RING_RADIUS_X, le plus grand radius, celui des anneaux) la
        // nouvelle ellipse chevauche une autre selon la fonction distance = element1.radius + element2.radius
        let overlapping = this.ellipses.some((ellipse) => getDistance(newEllipse.x, newEllipse.y, ellipse.x, ellipse.y) < this.GLOBAL_PLANET_RADIUS * 2);

        // Si chevauchement il y a, on refait le même tour de boucle pour la planète donnée
        if (overlapping) {
          i--; limit++;
        // Sinon on ajoute les nouvelles coordonnées dans le tableau ellipses pour la vérification des autres coordonnées
        // à générer et on dessine la nouvelle planète
        } else {
          this.ellipses.push(newEllipse);
          this.generatePlanet(newEllipse);
        }
      }
    },
    // Fonction de dessin d'une planète (ellipse ronde)
    // @param color => utile lors de la mise à jour de la planète pour garder la même couleur à chaque frame
    drawMainEllipse(ellipse) {
      let ctx = this.$refs.canvas.getContext('2d');
      ctx.beginPath();
      ctx.shadowColor = ellipse.start_color;
      ctx.shadowBlur = 15;

      // Création du gradient de la planète
      let grd = ctx.createLinearGradient(ellipse.x - this.GLOBAL_PLANET_RADIUS, ellipse.y - this.GLOBAL_PLANET_RADIUS, ellipse.x + this.GLOBAL_PLANET_RADIUS, ellipse.y + this.GLOBAL_PLANET_RADIUS);
      grd.addColorStop(0, ellipse.start_color);
      grd.addColorStop(1, ellipse.end_color);
      ctx.fillStyle = grd;

      // De 0 à 2PI, cercle trigonométrique
      ctx.ellipse(ellipse.x, ellipse.y, this.PLANET_RADIUS, this.PLANET_RADIUS, 0,  0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
    },
    // Fonction de dessin d'un anneau (ellipse ovale partielle)
    drawRing(ellipse, ring) {
      let ctx = this.$refs.canvas.getContext('2d');
      ctx.beginPath();

      // Ajoute une ombre
      ctx.shadowColor = ring.color;
      ctx.shadowBlur = 5;

      // Ajoute la couleur de l'ellipse
      ctx.strokeStyle = ring.color;

      // Modifie la largeur de l'ellipse
      ctx.lineWidth = ring.lineWidth;

      // Dessine l'ellipse
      // Angle de rotation aléatoire
      ctx.ellipse(ellipse.x, ellipse.y, this.RING_RADIUS_X, this.RING_RADIUS_Y, ring.rot,  -0.27 * Math.PI, 1.27 * Math.PI);
      ctx.stroke();
      ctx.closePath();
    },
    drawPlanetName(ellipse) {
      let ctx = this.$refs.canvas.getContext('2d');
      ctx.beginPath();
      ctx.shadowColor = "";
      ctx.shadowBlur = 0;
      ctx.fillStyle = colors.main_white;
      ctx.font = "18px HelveticaNowText-Medium";
      ctx.textAlign = "center";
      ctx.fillText(ellipse.name, ellipse.x, ellipse.y + this.GLOBAL_PLANET_RADIUS);
      ctx.closePath();
    },
    // Fonction de dessin d'une planète
    generatePlanet(ellipse) {
      // Dessine la partie principale de la planète
      this.drawMainEllipse(ellipse);
      this.drawPlanetName(ellipse);
      ellipse.rings.map((ring) => this.drawRing(ellipse, ring))
    },
  },
}
</script>

<style scoped lang="scss">
  .canvas-cursor {
    cursor: pointer;
  }
</style>
