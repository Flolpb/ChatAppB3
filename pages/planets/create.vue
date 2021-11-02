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

          <CustomButton :title="'Créer une nouvelle planète'" :button-click="createPlanet" :disabled="!valid"/>
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
            this.valid = this.$refs.form.validate();
            if (this.valid) {
              await this.planetRef.set({
                id: this.planetRef.id,
                name: this.planet.name,
                theme: this.planet.theme
              }).then(r => {
                this.$router.push("/planets/" + this.planetRef.id);
              });
            }
          },
          resetValidation() {
            this.$refs.form.resetValidation();
            this.valid = true;
          }
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
