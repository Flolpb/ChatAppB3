export const ACTIONS = {
  GET_PLANETS: 'planets/getPlanets',
  GET_NEXT_PLANETS: 'planets/getNextPlanets',
  GET_BEFORE_PLANETS: 'planets/getBeforePlanets',
  GET_PLANET_BY_ID: 'planets/getPlanetById',
  ADD_PLANET: 'planets/addPlanet',
}

export const state = () => ({
  planets: null,
  planet: {},
  nbPages: 1,
})

export const mutations = {
  GET_PLANETS: async (state, data) => {
    state.planets = data.planets;
    state.nbPages = data.nbPages;
  },
  GET_PLANET_BY_ID: async (state, planet) => {
    state.planet = planet;
  },
}

export const actions = {
  async getPlanets({commit}){
    let snap = await this.$fire.firestore.collection("planets").orderBy("id");
    let countSnap = await snap.get();
    let count = countSnap.size;
    let nbPages = Math.ceil(count / 25);
    let lastSnap = snap.limit(25);
    let planets = await lastSnap.get().then(
      (r) => r.docs.map(doc => doc.data())
    );
    let data = {
      planets: planets,
      nbPages: nbPages,
    }
    commit("GET_PLANETS", data);
  },
  async getNextPlanets({commit}){
    let snap = await this.$fire.firestore.collection("planets").orderBy("id");
    let lastSnap = await snap.startAfter(this.state.planets.planets[this.state.planets.planets.length - 1].id);
    let planets = await lastSnap.limit(25).get().then(
      (r) => r.docs.map(doc => doc.data())
    );
    let data = {
      planets: planets,
      nbPages: this.state.nbPages,
    }
    commit("GET_PLANETS", data);
  },
  async getBeforePlanets({commit}){
    let snap = await this.$fire.firestore.collection("planets").orderBy("id");
    let beforeSnap = await snap.endBefore(this.state.planets.planets[0].id);
    let planets = await beforeSnap.limitToLast(25).get().then(
      (r) => r.docs.map(doc => doc.data())
    );
    let data = {
      planets: planets,
      nbPages: this.state.nbPages,
    }
    commit("GET_PLANETS", data);
  }
  ,
  async getPlanetById({commit}, id){
    const ref = await this.$fire.firestore.collection("planets").doc(id)
    const snapshot = await ref.get();
    const data = snapshot.data();
    commit("GET_PLANET_BY_ID", data);
  },
  async addPlanet({commit}, planet) {
    let ref = this.$fire.firestore.collection("planets").doc();
    planet.id = ref.id;
    await ref.set(planet)
    return planet.id;
  }
}
