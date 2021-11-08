<template>
  <v-container fill-height fluid class="container">
    <v-row align="center" justify="center" class="row fill-height">
      <v-col cols="10" align="center" id="row-form">
        <CustomTitle
          :back-icon-click="() => this.$router.push('/planets')"
          :back-message="'Retour à la liste des planètes'"
          :title="'Nouvelle planète'" />
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            class="text-field"
            background-color="#1B1B3A"
            color="#EDE3E8"
            v-model="planet.name"
            :rules="planet.nameRules"
            label="Nom"
            @change="resetValidation"
            required
            rounded
            solo
          ></v-text-field>

          <v-text-field
            class="text-field"
            background-color="#1B1B3A"
            color="#EDE3E8"
            v-model="planet.theme"
            :rules="planet.themeRules"
            label="Thème"
            @change="resetValidation"
            required
            rounded
            solo
          ></v-text-field>

          <v-progress-circular
            v-if="spinner"
            indeterminate
            color="#272753"
          ></v-progress-circular>
          <CustomButton v-else :title="'Créer une nouvelle planète'" :button-click="createPlanet" :disabled="!valid"/>
        </v-form>
      </v-col>
      <v-col cols="10" align="center" id="row-canvas">
        <canvas class="text-center" ref="canvas" id="canvas"></canvas>
      </v-col>
    </v-row>
  </v-container>

</template>

<script>
  import CustomButton from "../../components/CustomButton";
  import CustomTitle from "../../components/CustomTitle";
  import { random, getRandomColor } from "../../utils/commonFunctions";
  import {ACTIONS as ACTIONS_PLANET} from "../../store/planets";
  export default {
    components: {CustomTitle, CustomButton},
    middleware: 'disconnect',
    data: () => ({
      spinner: false,
      valid: true,
      planet: {
        name: "",
        nameRules: [(v) => !!v || "Le nom est requis"],
        theme: "",
        themeRules: [(v) => !!v || "Le thème est requis"],
      },
      PLANET_RADIUS: 0,
      RING_RADIUS_X: 0,
      RING_RADIUS_Y: 0,
      GLOBAL_PLANET_RADIUS: 0,
      FPS: 0,
    }),
      methods: {
        async createPlanet(){
          this.spinner = true;
          try {
            this.valid = this.$refs.form.validate()
            if (this.valid) {
              let planet = {
                name: this.planet.name,
                theme: this.planet.theme,
                skin: this.generatePlanetSkin(),
              }
              this.$store.dispatch(ACTIONS_PLANET.ADD_PLANET, planet).then(planetId => {
                this.formToCanvasTransition();
                this.updateCanvasHeight(planet);
                this.launchDrawing(planet);
                setTimeout(() => {
                  this.$router.push("/planets/" + planetId);
                  // Ligne commentée car on ne réinitialise pas le spinner au moment de la redirection (plus propre visuellement)
                  //this.spinner = false;
                }, 7000);
              });
            }
          } catch (e) {
            this.spinner = false;
          }
        },
        resetValidation() {
          this.$refs.form.resetValidation();
          this.valid = true;
        },
        generatePlanetSkin() {
          return {
            start_color: getRandomColor(),
            end_color: getRandomColor(),
            rings: this.generateRings(),
          }
        },
        generateRings() {
          let rings = [];
          for (let i = 1; i <= 6; i++) {
            if (random(0, i >= 3 ? i * 3 : i * 2) === 0) {
              rings.push({
                color: getRandomColor(),
                rot: random(0,180),
                lineWidth: random(8, 14),
                celerity: random(1,3),
              })
            }
          }
          return rings;
        },
        formToCanvasTransition() {
          let rowForm = document.getElementById('row-form');
          let rowCanvas = document.getElementById('row-canvas');
          rowForm.classList.toggle('change');
          setTimeout(() => {
            rowForm.style.display = 'none'
            rowCanvas.style.display = 'inline'
          }, 1001)
          setTimeout(() => {
            rowCanvas.classList.toggle('reverse-change');
          }, 2000)
        },
        updateCanvasHeight(planet) {
          if (process.browser) {
            this.canvasData = {
              x: window.innerWidth / 2,
              y: window.innerHeight / 2,
              width: window.innerWidth,
              height: window.innerHeight,
            }

            let ctx = this.$refs.canvas.getContext('2d');
            ctx.canvas.width = this.canvasData.width
            ctx.canvas.height = this.canvasData.height
            ctx.canvas.style.position = 'absolute';
            ctx.canvas.style.left = '0px';
            ctx.canvas.style.top = '0px';

            planet.skin.x = this.canvasData.width / 2;
            planet.skin.y = this.canvasData.height / 2;
          }
        },
        launchDrawing(planet) {
          let ctx = this.$refs.canvas.getContext('2d');
          this.cyclicRedraw = setInterval(() => {
            this.updateCanvasHeight(planet)
            ctx.clearRect(0, 0, this.canvasData.width, this.canvasData.height);
            planet.skin.rings = planet.skin.rings.map((e) => {
              // On ajoute une valeur à la rotation en fonction de la vitesse pour faire tourner les anneaux
              return {
                color: e.color,
                rot: e.rot += e.celerity * 0.001,
                lineWidth: e.lineWidth,
                celerity: e.celerity,
              }});
            this.generatePlanet(planet);
          }, 1000/this.FPS)
        },
        drawMainEllipse(ellipse) {
          if (this.$refs.canvas) {
            let skin = ellipse.skin;
            let ctx = this.$refs.canvas.getContext('2d');
            ctx.beginPath();
            ctx.shadowColor = skin.start_color;
            ctx.shadowBlur = 15;

            // Création du gradient de la planète
            let grd = ctx.createLinearGradient(skin.x - this.GLOBAL_PLANET_RADIUS, skin.y - this.GLOBAL_PLANET_RADIUS, skin.x + this.GLOBAL_PLANET_RADIUS, skin.y + this.GLOBAL_PLANET_RADIUS);
            grd.addColorStop(0, skin.start_color);
            grd.addColorStop(1, skin.end_color);
            ctx.fillStyle = grd;

            // De 0 à 2PI, cercle trigonométrique
            ctx.ellipse(skin.x, skin.y, this.PLANET_RADIUS, this.PLANET_RADIUS, 0,  0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
          }
        },
        // Fonction de dessin d'un anneau (ellipse ovale partielle)
        drawRing(ellipse, ring) {
          let skin = ellipse.skin;
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
          ctx.ellipse(skin.x, skin.y, this.RING_RADIUS_X, this.RING_RADIUS_Y, ring.rot,  -0.27 * Math.PI, 1.27 * Math.PI);
          ctx.stroke();
          ctx.closePath();
        },
        drawPlanetName(ellipse) {
          let skin = ellipse.skin;
          let ctx = this.$refs.canvas.getContext('2d');
          ctx.beginPath();
          ctx.shadowColor = "";
          ctx.shadowBlur = 0;
          ctx.fillStyle = "#000";
          let fontSize = 50
          ctx.font = `${fontSize}px HelveticaNowText-Medium`;
          ctx.textAlign = "center";
          ctx.fillText(ellipse.name, skin.x, skin.y + this.GLOBAL_PLANET_RADIUS + fontSize);

          ctx.font = `80px HelveticaNowText-Medium`;
          ctx.textAlign = "center";
          ctx.fillText("Vous avez crée ...", skin.x, skin.y - this.GLOBAL_PLANET_RADIUS);

          ctx.closePath();
        },
        // Fonction de dessin d'une planète
        generatePlanet(ellipse) {
          // Dessine la partie principale de la planète
          this.drawMainEllipse(ellipse);
          this.drawPlanetName(ellipse);
          ellipse.skin.rings.map((ring) => this.drawRing(ellipse, ring))
        },
      },
      mounted(){
        // Radius de chaque rond / planète
        this.PLANET_RADIUS = 120;
        // Radius en X de chaque anneau
        this.RING_RADIUS_X = 180;
        // Radius en Y de chaque anneau
        this.RING_RADIUS_Y = 20;
        // Radius global d'une planète et de ses anneaux (plus grand que RING_RADIUS_X pour laisser de la place pour le nom de la planète)
        this.GLOBAL_PLANET_RADIUS = 220;
        // FPS pour les animations
        this.FPS = 60;
      },
      destroyed() {
        clearInterval(this.cyclicRedraw);
      }
  }
</script>

<style scoped lang="scss">
  .container {
    width: 80vw;
  }
  .row {
    min-height: 80vh;
    background: #EDE3E8;
    box-sizing: border-box;
    border-radius: 90px;
    margin: 0;
  }
  .text-field {
    margin-bottom: 2em;
  }
  #row-form {
    opacity: 1;
  }
  #row-form.change {
    opacity: 0;
    transition: all 1s;
  }
  #row-canvas {
    opacity: 0;
    display: none;
  }
  #row-canvas.reverse-change {
    opacity: 1;
    display: block;
    transition: all 1s;
  }
</style>
