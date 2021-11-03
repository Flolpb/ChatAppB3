<template>
<div>
    <p v-if="$fetchState.pending">Fetching Planet...</p>
    <p v-else-if="$fetchState.error">An error occurred :(</p>
    <div v-else class="d-flex justify-space-between">
        <div class="chat">
            <div class="titre">{{planet.name}}</div>
            <div class="sous-titre">{{planet.theme}}</div>
            <div id="content">
                <ul id="scrollableContent" v-if="messages.length">
                    <li v-for="(m, i) in messages"
                    :key="i"
                    exact>
                        <UserMessage :uid="m.userId" :text="m.text" :createdAt="m.createdAt" :isUser="false" v-if="m.userId == $store.state.auth.user.uid"/>
                        <UserMessage :uid="m.userId" :text="m.text" :createdAt="m.createdAt" :isUser="true" v-else />
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
        users: [],
        planetRef: null,
    }),
    middleware: 'disconnect',
    methods: {
        async getPlanet(){
            this.planetRef = await this.$fire.firestore.collection("planets").doc(this.$route.params.slug);
            const snapshot = await this.planetRef.get();
            const doc = snapshot.data();
            if(doc != null){
                this.planet.name = doc.name;
                this.planet.theme = doc.theme;
                this.message.planetId = this.planet.id;
                if(document != null){
                    document.title = this.planet.name + " - " + this.planet.theme;
                }
                          
            }
            else{
                this.$router.push('/');
            }
        },
        async getMessages(){
            const planetRef = await this.$fire.firestore.collection("planets").doc(this.$route.params.slug);
            const observer = planetRef.onSnapshot((doc) => {
                const data = doc.data();
                if(data != null){
                    data.messages.sort(function(a,b){
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    });
                    let i = this.messages.length;
                    data.messages.forEach((msg) => {
                        if(i != 0){
                            const id = this.messages.find((m) => {
                                return m.id == msg.id;
                            });
                            if(id == undefined){
                                this.messages.push(msg);
                                i++;
                            }
                        }else{
                            this.messages.push(msg);
                            i++;
                        }
                    })                
                }
            })
            
        },
        async sendMessage(){
            this.$fire.firestore.collection("planets").doc(this.$route.params.slug).update({
                messages: this.$fireModule.firestore.FieldValue.arrayUnion({
                    id: this.messages.length,
                    text: this.message.text,
                    userId: this.message.userId,
                    planetId: this.message.planetId,
                    createdAt: this.$fireModule.firestore.Timestamp.now(),
                }),
                lastMsg: this.message.text,
            });
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
            let i = this.users.length;
            const observer = await usersStatus.where('planetId', '==', this.planet.id).onSnapshot((querySnap) => {
                querySnap.forEach((doc) => {
                    const docData = doc.data();
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
                            this.users[id][1].connected = docData.connected;
                        }
                    }else{
                        this.users.push([]);
                        this.users[i].push(doc.id);
                        this.users[i].push(docData);
                        i++;
                    }
                });
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
            this.scrollToBottom();
        }, 500)
    },
    async fetch() {
        await this.getMessages();
        await this.getUserConnected();
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
