export const state = () => ({
    login: false,
    user: {
        email: null,
        displayName: null,
        photoURL: null,
        uid: null
    }
})

export const mutations = {
    LOGIN: (state, user) => {state.user = user; state.login = true},
    LOGOUT: (state) => {
        state.user.email = null,
        state.user.displayName = null,
        state.user.photoURL = null,
        state.user.uid = null,
        state.login = false
    },
}

export const ACTIONS = {
    LOGIN: 'auth/login',
    LOGOUT: 'auth/logout',
}

export const actions = {
    async login({commit}, user){
      const userRef = await this.$fire.firestore.collection("users").doc(user.uid);
      userRef.set({
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      });
      commit("LOGIN", user);
    },
    async logout({commit}){
      await this.$fireModule.auth().signOut();
      this.$cookies.remove('uid');
      commit("LOGOUT");
    },
}
