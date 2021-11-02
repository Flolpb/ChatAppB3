<template>
    <div>
        <div>Name: {{planet.name}}</div>
        <div>Theme: {{planet.theme}}</div>
        <div id="content">

            <div id="scrollableContent">
                <div v-for="(m, i) in messages"
                :key="i"
                exact>
                    <UserMessage :id="m[0]" :uid="m[1].userId" :text="m[1].text" :createdAt="m[1].createdAt" :isUser="false" v-if="m[1].userId == $store.state.auth.user.uid"/>
                    <UserMessage :id="m[0]" :uid="m[1].userId" :text="m[1].text" :createdAt="m[1].createdAt" :isUser="true" v-else />
                    <div style="height: 1rem;"></div>
                </div>
                <div id="toScroll"></div>
            </div>
        </div>


        <v-form ref="form" lazy-validation>
            <v-text-field
                v-model="message.text"
                label="Message"
                required
            ></v-text-field>

            <v-btn color="success" class="mr-4" @click="sendMessage">
                Send
            </v-btn>
        </v-form>
    </div>
</template>

<script>

import { UserMessage } from '../../components/UserMessage'
export default {

    data: () => ({
        planet: {
            id: null,
            name: null,
            theme: null,
        },
        message: {
            text: "",
            userId: "",
            planetId: "",
            createdAt: '',
        },
        messages: []
    }),
    middleware: 'disconnect',
    mounted: () => {
        const messagesRef = this.$fire.firestore.collection('messages');
        const query = messagesRef.orderBy("createdAt");
        query.onSnapshot((querySnapshot) => {
            let i = this.messages.length;
            querySnapshot.forEach((doc) => {
                const docData = doc.data();
                if(this.messages.length != 0){
                    const id = this.messages.find((m) => {
                        return m[0] == doc.id;
                    });
                    if(id == undefined){
                        this.messages.push([]);
                        if(this.messages[i] != undefined){
                            this.messages[i].push(doc.id);
                            this.messages[i].push(docData);
                        }
                        i++;
                    }
                }else{
                    this.messages.push([]);
                    this.messages[i].push(doc.id);
                    this.messages[i].push(docData);
                    i++;
                }
        });
    });
    },
    methods: {
        async getPlanet(){
            const ref = await this.$fire.firestore.collection("planets").doc(this.planet.id);
            const snapshot = await ref.get();

            const doc = snapshot.data();
            if(doc != null){
                this.planet.name = doc.name;
                this.planet.theme = doc.theme;
                this.message.planetId = this.planet.id;
            }
            else{
                this.$router.push('/');
            }
        },
        async sendMessage(){
            const messageRef = await this.$fire.firestore.collection("messages").doc();
            await messageRef.set({
                id: messageRef.id,
                text: this.message.text,
                userId: this.message.userId,
                planetId: this.message.planetId,
                createdAt: this.$fireModule.firestore.FieldValue.serverTimestamp(),
            });
            this.message = {
                text: "",
                createdAt: "",
            },
            this.scrollToBottom();

        },
        getUser(id){
            const userRef = this.$fire.firestore.collection("users").doc(id);
            let user = "";
            userRef.get().then((snap) => {
                user = snap.data();
            });
            return user.displayName;
        },
        scrollToBottom() {

            const el = this.$el.querySelector("#toScroll")
            if (el) {
                el.scrollIntoView({block: "end", behavior: "smooth"});
            }
        }
    },
    async mounted(){
        this.planet.id = this.$route.params.slug;
        await this.getPlanet();
        this.message.userId = this.$store.state.auth.user.uid;
        setTimeout(this.scrollToBottom(), 4000);
    },
    async fetch() {
        const messagesRef = await this.$fire.firestore.collection('messages');
        const query = messagesRef.orderBy("createdAt");
        query.onSnapshot((querySnapshot) => {
            let i = this.messages.length;
            querySnapshot.forEach((doc) => {
                const docData = doc.data();
                if(this.messages.length != 0){
                    const id = this.messages.find((m) => {
                        return m[0] == doc.id;
                    });
                    if(id == undefined){
                        this.messages.push([]);
                        if(this.messages[i] != undefined){
                            console.log("test");
                            this.messages[i].push(doc.id);
                            this.messages[i].push(docData);
                        }
                        i++;
                    }
                }else{
                    this.messages.push([]);
                    this.messages[i].push(doc.id);
                    this.messages[i].push(docData);
                    i++;
                }
        });
    });
    },
    watchQuery: true
}
</script>

<style scoped lang="scss">
    #scrollableContent{
        height: 100%;
        margin: 0em;
        overflow-y: auto;
    }

    #content{
        height: 80vh;
    }
</style>
