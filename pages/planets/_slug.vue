<template>
    <div>
        <div>Name: {{planet.name}}</div>
        <div>Theme: {{planet.theme}}</div>
        <div id="content">
            <ul id="scrollableContent" v-if="messages.length">
                <li v-for="(m, i) in messages"
                :key="i"
                exact>
                    <UserMessage :id="m[0]" :uid="m[1].userId" :text="m[1].text" :createdAt="m[1].createdAt" :isUser="false" v-if="m[1].userId == $store.state.auth.user.uid"/>
                    <UserMessage :id="m[0]" :uid="m[1].userId" :text="m[1].text" :createdAt="m[1].createdAt" :isUser="true" v-else />
                    <div style="height: 1rem;"></div>
                </li>
            </ul>
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
            <v-btn @click="scrollToBottom">Scroll</v-btn>
        </v-form>
    </div>
</template>

<script>

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
    methods: {
        async getPlanet(){
            const ref = await this.$fire.firestore.collection("planets").doc(this.planet.id);
            const snapshot = await ref.get();
            const doc = snapshot.data();
            if(doc != null){
                this.planet.name = doc.name;
                this.planet.theme = doc.theme;
                this.message.planetId = this.planet.id;
                document.title = this.planet.name + " - " + this.planet.theme;
            }
            else{
                this.$router.push('/');
            }
        },
        async getMessages(){
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
        async sendMessage(){
            const messageRef = await this.$fire.firestore.collection("messages").doc();
            await messageRef.set({
                id: messageRef.id,
                text: this.message.text,
                userId: this.message.userId,
                planetId: this.message.planetId,
                createdAt: this.$fireModule.firestore.FieldValue.serverTimestamp(),
            });
            this.message.text = "";
            this.message.createdAt = "";
        },
        scrollToBottom() {
            if(this.$el){
                const el = this.$el.querySelector("#scrollableContent");
                if (el) {
                    el.scrollTop = 9999999999 + el.scrollHeight;
                }
            }
        }
    },
    async mounted(){
        this.planet.id = this.$route.params.slug;
        await this.getPlanet();
        await this.getMessages().then(() => {
            this.message.userId = this.$store.state.auth.user.uid;
            window.addEventListener('blur', () => {document.title = "Vous êtes absent !"});
            window.addEventListener('focus', () => {document.title = "Vous êtes connecté !"});
        });
    },
    updated(){
        setTimeout(() => {
            this.scrollToBottom()
        }, 500)
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
    watchQuery: true,
}
</script>

<style scoped lang="scss">
    #scrollableContent{
        height: 100%;
        margin: 0em;
        overflow-y: auto;
        scroll-behavior: smooth;
    }
    #content{
        height: 80vh;
    }

    li{
        list-style-type: none;
    }
</style>
