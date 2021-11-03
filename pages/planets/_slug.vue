<template>
    <div class="d-flex justify-space-between">
        <div class="chat">
            <div class="titre">{{planet.name}}</div>
            <div class="sous-titre">{{planet.theme}}</div>
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
        <div class="colonie">
            <div class="titre">Colonie</div>
            <hr />
            <div>
                <div v-for="(u, i) in users"
                :key="i"
                exact>
                <UserConnected :id="u[0]" :uid="u[1].userId" :pid="u[1].planetId" :status="u[1].connected"/>
                <hr />
                </div>
            </div>
        </div>
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
        messages: [],
        users: []
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
        },
        async getUserConnected(){
            const usersStatus = await this.$fire.firestore.collection('usersStatut');
            const snapshot = await usersStatus.where('planetId', '==', this.planet.id).get();
            let i = 0;
            console.log(snapshot);
            snapshot.forEach((doc) => {
                const docData = doc.data();
                console.log(doc);
                if(this.users.length != 0){
                    const id = this.users.findIndex((u) => {
                        return u[0] == doc.id;
                    });
                    if(id == -1){
                        this.users.push([]);
                        if(this.users[i] != undefined){
                            this.users[i].push(doc.id);
                            this.users[i].push(docData);
                        }
                        i++;
                    }else{
                        console.log("test");
                        this.users[id][1].connected = docData.connected;
                    }
                }else{
                    this.users.push([]);
                    this.users[i].push(doc.id);
                    this.users[i].push(docData);
                    i++;
                }
            });
        },
        async addUserConnected(status){
            const usersStatus = await this.$fire.firestore.collection('usersStatut');
            const snapshot = await usersStatus.get();
            let achieve = false;
            if(snapshot.empty){
                console.log("empty");
            }else{
                snapshot.forEach((doc) => {
                    let docId = doc.id;
                    const docData = doc.data();
                    if(docData.userId == this.message.userId){
                        if(docData.planetId == this.message.planetId){
                            achieve = true;
                            if(docData.connected != status){
                                let setDoc = this.$fire.firestore.collection('usersStatut').doc(docId);
                                setDoc.set(
                                    {
                                        userId: docData.userId,
                                        planetId: docData.planetId,
                                        connected: status,
                                    }
                                );
                            }
                        }
                    } 
                });
            }
            if(!achieve){
                const newUserRef = await this.$fire.firestore.collection('usersStatut').doc();
                newUserRef.set({
                    userId: this.message.userId,
                    planetId: this.message.planetId,
                    connected: status,
                });
            }

            document.title = this.planet.name + " - " + this.planet.theme;
            this.getUserConnected();
        }
    },
    async mounted(){
        this.planet.id = this.$route.params.slug;
        await this.getPlanet();
        await this.getMessages();
        this.message.userId = this.$store.state.auth.user.uid;
        await this.getUserConnected().then(() => {
            window.addEventListener('blur', () => {this.addUserConnected("away")});
            window.addEventListener('focus', () => {this.addUserConnected("connected")});
        })
    },
    updated(){
        setTimeout(() => {
            this.scrollToBottom()
        }, 500)
    },
    
    async fetch() {
        this.getUserConnected();
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

    .titre{
        font-size: 4rem;
        text-align: center;
    }

    .chat{
        min-width: 60vw;
    }

    .colonie{
        min-width: 40vw;
    }

    .sous-titre{
        font-size: 2rem;
        text-align: center;
    }

    #scrollableContent{
        height: 100%;
        margin: 0em;
        overflow-y: scroll;
        scroll-behavior: smooth;
    }

    #content{
        height: 70vh;
    }

    li{
        list-style-type: none;
    }
</style>
