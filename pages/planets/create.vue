<template>

<v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field
        v-model="planet.name"
        :rules="planet.nameRules"
        label="Nom"
        required
      ></v-text-field>

      <v-text-field
        v-model="planet.theme"
        label="Thème"
        required
      ></v-text-field>


      <v-btn :disabled="!valid" color="success" class="mr-4" @click="createPlanet">
        Créer une nouvelle planète
      </v-btn>
    </v-form>
    
</template>
<script>
export default {
    data: () => ({
        planetRef: null,
        planet: {
            name: "",
            nameRules: [(v) => !!v || "Le nom est requis"],
            theme: "",
        },
        
    }),
    methods: {
        async createPlanet(){
            await this.planetRef.set({
                id: this.planetRef.id,
                name: this.planet.name,
                theme: this.planet.theme
            });
            this.$router.push("/planets/" + this.planetRef.id);
        },
        reset() {
            this.$refs.form.reset();
        },
    },
    middleware: 'disconnect',
    mounted(){
        this.planetRef = this.$fire.firestore.collection("planets").doc();
    }
}
</script>