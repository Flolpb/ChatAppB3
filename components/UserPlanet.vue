<template>
    <div>
        <div>
            {{planetName}}
        </div>
    </div>
</template>
<script>

import { ACTIONS } from "../store/planets.js";
export default {
    data: () => ({
        planetName: null,
    }),
    props: ["planetId"],
    methods: {
      async getData(){
        await this.$store.dispatch(ACTIONS.GET_PLANET_BY_ID, this.planetId);
        this.planetName = JSON.parse(JSON.stringify(this.$store.state.planets.planet.name));
        console.log(this.planetName);
      } 
    },
    async mounted () {
        await this.getData();
    }
}
</script>>