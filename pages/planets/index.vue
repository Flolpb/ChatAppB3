<template>
  <div class="text-center">
    <SidebarMenu :items="sidebarItems" />
<!--    <canvas class="text-center" :width="canvasData.width" :height="canvasData.height" ref="canvas" id="canvas" style="overflow-x: hidden;  "></canvas>-->
    <canvas class="text-center"  ref="canvas" id="canvas" style="overflow-x: hidden;  "></canvas>
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
    canvasData: {},
    ellipses: [],
    PLANET_RADIUS: 0,
    RING_RADIUS_X: 0,
    RING_RADIUS_Y: 0,
  }),
  async mounted() {
    this.PLANET_RADIUS = 80;
    this.RING_RADIUS_X = 120;
    this.RING_RADIUS_Y = 15;
    this.CANVAS_MARGIN_X = 200;

    // On remplit le tableau quand le composant est initialisé, sinon les appels de fonction depuis les composants enfants
    // ne marche pas car les fonctions n'ont pas le temps de charger et de s'ajouter à la méthode click
    this.sidebarItems = [
      { title: 'Profil', route:'/profile' },
      { title: 'Amis', route:'/friends' },
      { title: 'Paramètres', route:'/parameter' },
      { title: 'Se déconnecter', click: () => this.logout(), class_color: 'red--text'}
    ]
    this.planets = await this.getPlanets();
    this.updateCanvasHeight();

    // Ajout d'un évènement onClick sur le Canvas
    this.$refs.canvas.addEventListener('click', (e) => {
      let clickedPlanet = this.ellipses.find((ellipse) => {
        return (e.offsetX <= ellipse.x + this.RING_RADIUS_X)
          && (e.offsetX >= ellipse.x - this.RING_RADIUS_X)
          && (e.offsetY >= ellipse.y - this.RING_RADIUS_X)
          && (e.offsetY <= ellipse.y + this.RING_RADIUS_X)
      });
      clickedPlanet && (this.redirectToPlanet(clickedPlanet.id))
    });
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
    // Va adapter la taille du canvas en fonction du nombre de planètes avant de commencer le dessin
    updateCanvasHeight() {
      if (process.browser) {
        this.canvasData = {
          width: window.innerWidth - this.CANVAS_MARGIN_X,
          // (Nb de planètes * Aire pour une planète (104 000 px²)) / (largeur de l'écran - marge du canvas)
          height: (this.planets.length * 117000) / (window.innerWidth - this.CANVAS_MARGIN_X)
        }
        let ctx = this.$refs.canvas.getContext('2d');
        ctx.canvas.width = this.canvasData.width
        ctx.canvas.height = this.canvasData.height
      }
      this.drawPlanets();
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
          x: this.random(this.RING_RADIUS_X, this.canvasData.width - this.RING_RADIUS_X),
          y: this.random(this.RING_RADIUS_X, this.canvasData.height - this.RING_RADIUS_X),
        };

        // On vérifie parmi toutes les coordonnées déjà générées pour le nombre de planète récupéré si en fonction
        // du radius maximal par défaut des ellipses (RING_RADIUS_X, le plus grand radius, celui des anneaux) la
        // nouvelle ellipse chevauche une autre selon la fonction distance = element1.radius + element2.radius
        let overlapping = this.ellipses.some((ellipse) => {
          return this.getDistance(newEllipse.x, newEllipse.y, ellipse.x, ellipse.y) < this.RING_RADIUS_X * 2;
        })

        // Si chevauchement il y a, on refait le même tour de boucle pour la planète donnée
        if (overlapping) {
          i--; limit++;
        // Sinon on ajoute les nouvelles coordonnées dans le tableau ellipses pour la vérification des autres coordonnées
        // à générer et on dessine la nouvelle planète
        } else {
          this.ellipses.push(newEllipse);
          this.generatePlanet(newEllipse.x, newEllipse.y);
        }
      }
    },
    // Fonction de calcule de distance entre deux points x et y
    getDistance(xA, yA, xB, yB) {
      let xDiff = xA - xB;
      let yDiff = yA - yB;
      return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    },
    // Fonction de génération d'une couleur aléatoire
    getRandomColor() {
      var letters = '0123456789ABCDEF'.split('');
      var color = '#';
      for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
      }
      return color;
    },
    // Fonction de dessin d'une planète (ellipse ronde)
    drawMainEllipse(x, y) {
      let ctx = this.$refs.canvas.getContext('2d');
      ctx.beginPath();
      let randomColor = this.getRandomColor();
      ctx.shadowColor = randomColor;
      ctx.shadowBlur = 15;
      ctx.fillStyle = randomColor;
      // De 0 à 2PI, cercle trigonométrique
      ctx.ellipse(x, y, this.PLANET_RADIUS, this.PLANET_RADIUS, 0,  0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
    },
    // drawRandomPeculiarity(x, y) {
    //   let ctx = this.$refs.canvas.getContext('2d');
    //   ctx.beginPath();
    //   ctx.fillStyle = this.getRandomColor();
    //   let randomX = this.random(x - 40, x);
    //   let randomY = this.random(y - 40, y);
    //   ctx.ellipse(randomX, randomY,  this.random(10, 40), this.random(10, 40), 0,  0, 2 * Math.PI);
    //   ctx.fill();
    //   ctx.closePath();
    // },
    // Fonction de dessin d'un anneau (ellipse ovale partielle)
    drawRing(x, y) {
      let ctx = this.$refs.canvas.getContext('2d');
      ctx.beginPath();
      let randomColor = this.getRandomColor();
      // Ajoute une ombre
      ctx.shadowColor = randomColor;
      ctx.shadowBlur = 5;

      // Ajoute la colour de l'ellipse
      ctx.strokeStyle = randomColor;
      ctx.lineWidth = this.random(8, 14);

      // Dessine l'ellipse
      ctx.ellipse(x, y, this.RING_RADIUS_X, this.RING_RADIUS_Y, this.random(0,180),  -0.27 * Math.PI, 1.27 * Math.PI);
      ctx.stroke();
    },
    // Fonction de création d'une planète
    generatePlanet(x, y) {
      // Dessine la partie principale de la planète
      this.drawMainEllipse(x, y);

      // Ajoute un ou plusieurs anneaux à la planète aléatoirement
      for (let i = 1; i <= 6; i++) {
        if (this.random(0, i >= 3 ? i * 2 : i * 3) === 0) {
          this.drawRing(x, y);
        }
      }
    }
  },
}
</script>

<style scoped>
</style>
