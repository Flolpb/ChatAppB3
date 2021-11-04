<template>
  <v-container fill-height fluid class="container">
    <v-row align="center" justify="center" class="row fill-height">
      <v-col cols="10" align="center">
        <CustomTitle :title="'Nouvelle planète'" />

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
    </v-row>
  </v-container>
</template>

<script>
  import CustomButton from "../../components/CustomButton";
  import CustomTitle from "../../components/CustomTitle";
  export default {
    components: {CustomTitle, CustomButton},
    middleware: 'disconnect',
    data: () => ({
      spinner: false,
      valid: true,
      planetRef: null,
      planet: {
        name: "",
        nameRules: [(v) => !!v || "Le nom est requis"],
        theme: "",
        themeRules: [(v) => !!v || "Le thème est requis"],
      },
      }),
      methods: {
        async createPlanet(){
          this.spinner = true;
          try {
            this.valid = this.$refs.form.validate();
            if (this.valid) {
              await this.planetRef.set({
                id: this.planetRef.id,
                name: this.planet.name,
                theme: this.planet.theme,
                skin: this.generatePlanetSkin(),
              }).then(r => {
                this.$router.push("/planets/" + this.planetRef.id);

                // Ligne commentée car on ne réinitialise pas le spinner au moment de la redirection (plus propre visuellement)
                //this.spinner = false;
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
            color: this.getRandomColor(),
            rings: this.generateRings(),
          }
        },
        generateRings() {
          let rings = [];
          for (let i = 1; i <= 6; i++) {
            if (this.random(0, i >= 3 ? i * 3 : i * 2) === 0) {
              rings.push({
                color: this.getRandomColor(),
                rot: this.random(0,180),
                lineWidth: this.random(8, 14),
                celerity: this.random(1,3),
              })
            }
          }
          return rings;
        },
        random(min, max) {
          return Math.floor(Math.random() * (max - min + 1) + min)
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
      },
      mounted(){
          this.planetRef = this.$fire.firestore.collection("planets").doc();
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
</style>
