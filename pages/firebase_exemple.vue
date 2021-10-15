<template>
    <div>
        <v-btn @click="getData">Get Data</v-btn>
        <v-btn @click="getProfile">Get Profile</v-btn>
        <v-btn outlined fab @click="login" color="#4285F4"><v-icon>fab fa-google</v-icon></v-btn>
        <v-btn outlined fab @click="logout" color="#4285F4">logout</v-btn>
        
        <div>
            <div>{{$store.state.auth.user.email}}</div>
            <div>{{$store.state.auth.user.displayName}}</div>
            <img :src="$store.state.auth.user.photoURL" />
            <div>{{$store.state.auth.user.uid}}</div>
        </div>
    </div>
</template>
<script>

import { ACTIONS } from "../store/auth.js";

export default {

    methods: {
        async getData() {
            const ref = await this.$fire.firestore.collection("test").doc("a4i0czW8SAsmuBtqpt2r");
            const snapshot = await ref.get();
            const doc = snapshot.data();
            console.log(doc.name);
            console.log(this.$store.state.localStorage.users);
        },
        async login(){
            console.log(this.$fire);
            this.provider = new this.$fireModule.auth.GoogleAuthProvider();
            this.$fireModule.auth().signInWithPopup(this.provider).then(result => {
                const newUser = {
                    email: result.user.email,
                    displayName: result.user.displayName,
                    photoURL: result.user.photoURL,
                    uid: result.user.uid
                };
                this.$store.dispatch(ACTIONS.LOGIN, newUser).then(() => {
                    this.$cookies.set('uid', newUser.uid, {
                        path: '/',
                        maxAge: 60 * 60 * 24 * 7
                    });
                });
                console.log(result.user.email);
            });
        },
        async logout(){
            this.$fireModule.auth().signOut();
            this.$store.dispatch(ACTIONS.LOGOUT);
            this.$cookies.remove('uid');
        },
        async getProfile(){
            console.log(this.$store.state.auth.user);
        }
    },
    middleware: 'disconnect'
    
}
</script>