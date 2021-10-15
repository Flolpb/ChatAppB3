<template>
    <div>
        <div>Id: {{planet.id}}</div>
        <div>Name: {{planet.name}}</div>
        <div>Theme: {{planet.theme}}</div>

        <div v-for="(m, i) in messages"
        :key="i"
        exact>
            <div>msg: {{m[1].text}}</div>
        </div>

        <v-form ref="form" v-model="valid" lazy-validation>
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
export default {

    data: () => ({
        planet: {
            id: null,
            name: null,
            theme: null,
        },
        messages: [],
        message: {
            text: "",
            userId: "",
            planetId: "",
            createdAt: '',
        },
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
            }
            else{
                this.$router.push('/');
            }
        },
        async getMessages(){
            const messagesRef = await this.$fire.firestore.collection('messages');
            const query = messagesRef.orderBy("createdAt");
            query.get().then((snap) => {
                console.log(this.messages.length);
                let i = 0;
                if(this.messages.length != 0){
                    i = this.messages.length;
                }
                snap.forEach((doc) => {
                    const docData = doc.data();
                    if(docData.planetId == this.planet.id){
                        if(this.messages.length != 0){
                            const id = this.messages.find((m) => {
                                m[0] == doc.id;
                            });
                            if(id == undefined){
                                this.messages.push([]);
                                this.messages[i].push(doc.id);
                                this.messages[i].push(docData);
                            }
                        }else{
                            this.messages.push([]);
                            this.messages[i].push(doc.id);
                            this.messages[i].push(docData);
                        }
                        i++;
                        
                    }
                })
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

        }
    },
    async mounted(){
        this.planet.id = this.$route.params.slug;
        await this.getPlanet();
        await this.getMessages();
        this.message.userId = this.$store.state.auth.user.uid;
    },
    async asyncData({$fire, messages, planet}) {
        const messagesRef = await $fire.firestore.collection('messages');
        const query = messagesRef.orderBy("createdAt");
        query.onSnapshot((querySnapshot) => {
            let i = 0;
            if(messages.length != 0){
                i = messages.length;
            }
            querySnapshot.forEach((doc) => {
                const docData = doc.data();
                if(docData.planetId == planet.id){
                    if(messages.length != 0){
                        const id = messages.find((m) => {
                            m[0] == doc.id;
                        });
                        if(id == undefined){
                            messages.push([]);
                            messages[i].push(doc.id);
                            messages[i].push(docData);
                        }
                    }else{
                        messages.push([]);
                        messages[i].push(doc.id);
                        messages[i].push(docData);
                    }
                    i++;
            };
        });
    });
    },
}
</script>