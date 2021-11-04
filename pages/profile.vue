<template>
    <div>
        <v-btn outlined fab @click="logout" color="#4285F4">logout</v-btn>
        <div>
            <div>{{$store.state.auth.user.email}}</div>
            <div>{{$store.state.auth.user.displayName}}</div>
            <img :src="$store.state.auth.user.photoURL" />
            <h2>Liste Des planètes de l'utilisateur</h2>
            <div v-for="(p, i) in planets"
            :key="i"
            exact>
                <UserPlanet :planetId="p" />
            </div>
        </div>
    </div>
</template>
<script>

import { ACTIONS } from "../store/auth.js";

export default {
    data: () => ({
        planets: null,
        user: null,
    }),
    middleware: 'disconnect',
    methods: {
        async getData() {
            if(this.user){
                const ref = await this.$fire.firestore.collection("users").doc(this.user);
                const snapshot = await ref.get();
                const doc = snapshot.data();
                this.planets = doc.planets;
            }else{
                this.user = this.$store.state.auth.user.uid;
                setTimeout(() => {
                    this.getData();
                }, 100);
            }
        },
        async logout(){
            await this.$fireModule.auth().signOut();
            this.$store.dispatch(ACTIONS.LOGOUT);
            this.$cookies.remove('uid');
            this.$router.push('/login');
        }
    },
    async mounted(){
        await this.getData();
    }
}
</script>
