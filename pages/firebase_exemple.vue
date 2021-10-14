<template>
    <div>
        <v-btn @click="getData">Get Data</v-btn>
        <v-btn @click="login">Connect with google</v-btn>
    </div>
</template>
<script>
export default {
    methods: {
        async getData() {
            const ref = await this.$fire.firestore.collection("test").doc("a4i0czW8SAsmuBtqpt2r");
            const snapshot = await ref.get();
            const doc = snapshot.data();
            console.log(doc.name);
        },
        async login(){
            this.provider = new this.$fire.auth.GoogleAuthProvider()
            this.$fire.auth().signInWithPopup(this.provider).then(result => {
                this.$router.push('/')
            }).catch(e => {
                this.$snotify.error(e.message)
                console.log(e)
            })
        }
    }
    
}
</script>