export const state = () => ({
    login: false,
    user: {
        email: null,
        displayName: null,
        photoURL: null,
        uid: null,
        parameters: {
          animation: false,
          planetNames: false,
        }
    }
})

export const mutations = {
    LOGIN: (state, user) => {state.user = user; state.login = true},
    LOGOUT: (state) => {
        state.user.email = null,
        state.user.displayName = null,
        state.user.photoURL = null,
        state.user.uid = null,
        state.user.parameters.animation = false,
        state.user.parameters.planetNames = false,
        state.login = false
    },
  UPDATE_USER_PARAMS: (state, parameters) => {
    state.user.parameters = parameters;
  }
}

export const ACTIONS = {
    LOGIN: 'auth/login',
    LOGOUT: 'auth/logout',
    UPDATE_USER_PARAMS: 'auth/updateUserParams',
}

export const actions = {
    async login({commit}, user){
      const userRef = await this.$fire.firestore.collection("users").doc(user.uid);
      const snapshot = await userRef.get();
      let data = snapshot.data();

      if (data.parameters) {
        user.parameters = data.parameters
      } else {
        user.parameters = {
          animation: true,
          planetNames: true
        }
      }
      userRef.set({
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        parameters: {
          animation: user.parameters.animation,
          planetNames: user.parameters.planetNames,
        }
      });
      commit("LOGIN", user);
    },
    async logout({commit}){
      await this.$fireModule.auth().signOut();
      this.$cookies.remove('uid');
      commit("LOGOUT");
    },
    async updateUserParams({commit}, parameters) {
      await this.$fire.firestore.collection("users")
        .doc(this.state.auth.user.uid)
        .update(parameters);
      commit("UPDATE_USER_PARAMS", parameters)
  }
}
