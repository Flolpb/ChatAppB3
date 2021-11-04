export const ACTIONS = {
  GET_PLANETS: 'planets/getPlanets',
  GET_PLANET_BY_ID: 'planets/getPlanetById',
  ADD_PLANET: 'planets/addPlanet',
}

export const state = () => ({
  planets: null,
  planet: {},
})

export const mutations = {
  GET_PLANETS: async (state, planets) => {
    state.planets = planets
  },
  GET_PLANET_BY_ID: async (state, planet) => {
    state.planet = planet;
  },
}

export const actions = {
  async getPlanets({commit}){
    let planets = await this.$fire.firestore.collection("planets").get().then(
      (r) => r.docs.map(doc => doc.data())
    );
    commit("GET_PLANETS", planets);
  },
  async getPlanetById({commit}, id){
    const ref = await this.$fire.firestore.collection("planets").doc(id)
    const snapshot = await ref.get();
    let data = snapshot.data();
    commit("GET_PLANET_BY_ID", data);
  },
  async addPlanet({commit}, planet) {
    let ref = this.$fire.firestore.collection("planets").doc();
    planet.id = ref.id;
    await ref.set(planet)
    return planet.id;
  }
}
