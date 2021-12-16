<template>
<div id="planetConnect">
    <!--If datas are loading -> show a circular progress-->
    <div v-if="loading" 
    class="d-flex justify-center" style="margin-top: 40vh; transform: translateY(-50%);" >
        <v-progress-circular
              indeterminate
              color="#ede3e8"
              :size="200"
              :width="10"
            ></v-progress-circular>
    </div>
    <!--else -> show the page-->
    <div v-else class="d-flex justify-space-between">
        <div class="chat">
            <div class="d-flex justify-space-between" width="100%">
                <div class="d-flex justify-center" style="margin-left: 2rem;">
                    <!--Flèche retour à la liste des planètes.-->
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon
                                v-bind="attrs"
                                v-on="on"
                                id="icon"
                                @click="() => {addUserConnected('away'); $router.push('/planets');}"
                                color="white"
                                size="80"
                            >mdi-keyboard-backspace
                            </v-icon>
                        </template>
                        <!--Tool Tip for the icon-->
                        <span>Retour à la page planète</span>
                    </v-tooltip>
                </div>
                
                <div class="d-flex justify-center">
                    <div>
                        <div class="titre">{{planet.name}}</div>
                        <div class="sous-titre">{{planet.theme}}</div>
                    </div>
                </div>
                <div></div>
            </div>
            <div id="content">
                <ul id="scrollableContent" v-if="messages.length">
                    <div style="height: 5rem;"></div>
                    <div style="height: 2rem;" id="isUp"></div>
                    <li v-for="(m) in messages"
                    :key="m.id"
                    exact>
                        <!--Component for the Messages -->
                        <transition name="slide-fade">
                            <UserMessage :uid.sync="m.userId" :text.sync="m.text" :createdAt.sync="m.createdAt" :isUser="m.userId != $store.state.auth.user.uid" />
                        </transition>
                        
                        <div style="height: 1rem;"></div>
                    </li>
                </ul>
            </div>


            <v-form ref="form" lazy-validation @submit.prevent="sendMessage">
                <v-text-field
                    style="margin-left: 2rem;"
                    rows="1"
                    v-model="message.text"
                    :append-outer-icon="message ? 'mdi-send' : 'mdi-microphone'"
                    filled
                    clear-icon="mdi-close-circle"
                    clearable
                    type="text"
                    @click:append-outer="sendMessage"
                    @click:clear="clearMessage"
                ></v-text-field>
            </v-form>
        </div>
        <div></div>
        <div class="colonie">
            <div class="titre">Colonie</div>
            <hr />
            <div>
                <div v-for="u in users"
                :key="u[0]"
                exact>
                    <UserConnected :id="u[0]" :uid="u[1].userId" :pid="u[1].planetId" :status="u[1].connected"/>
                </div>
            </div>
        </div>
    </div>
</div>
    
</template>

<script>

export default {

    data: () => ({
        //var for the actual planet
        planet: {
            id: null,
            name: null,
            theme: null,
        },
        //var for the actual message
        message: {
            text: "",
            userId: "",
            planetId: "",
            createdAt: '',
        },
        //stock all the messages
        messages: [],
        //stock the connected users
        users: [],
        planetRef: null,
        //test if the data is loading
        loading: true,
        //the nb of messages loaded
        messagesLoaded: 15,
        loadOnce: false,
        //if the user is scrolling, dont scroll to bottom
        canScroll: true,
    }),
    //we have to be connected to access this page
    middleware: 'disconnect',
    methods: {
        clearMessage(){
            this.message.text = "";
        },
        //get the current planet and change the doc title
        async getPlanet(){
            this.planetRef = await this.$fire.firestore.collection("planets").doc(this.$route.params.slug);
            const snapshot = await this.planetRef.get();
            const doc = snapshot.data();
            if(doc != null){
                this.planet.name = doc.name;
                this.planet.theme = doc.theme;
                this.message.planetId = this.planet.id;
                if(document != null){
                    document.title = this.planet.name;
                }
            }
            else{
                this.$router.push('/');
            }
        },
        //If the user is at the top of the scroll message block return true or false
        isScrolledIntoView() {
            //a remplacer par v-intersect
            const le = document.querySelector("#isUp");
            if(le != null){
                const rect = le.getBoundingClientRect();
                var elemTop = rect.top;
                var elemBottom = rect.bottom;
                var isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
                return isVisible;
            }else{
                //if the element is not loaded, report the function
                setTimeout(() => {
                    this.isScrolledIntoView();
                }, 1000);
            }
        },
        //get messages by planetId 
        async getMessages(){
            // get planet on firestore
            const planetRef = await this.$fire.firestore.collection("planets").doc(this.$route.params.slug);
            // whenever a data is changed in the planetref:
            const observer = planetRef.onSnapshot((doc) => {
                const data = doc.data();
                if(data != null){
                    if(data.messages != null){
                        //try msg by creation time
                        data.messages.sort(function(a,b){
                            return new Date(b.createdAt) - new Date(a.createdAt);
                        });
                        //create a copy of messages with just the last "messagesLoaded" count
                        let messagesLoad = data.messages.slice(data.messages.length - this.messagesLoaded, data.messages.length);
                        let i = this.messages.length;
                        
                        messagesLoad.forEach((msg) => {
                            if(i != 0){
                                //know if the msg is already in the array
                                const id = this.messages.find((m) => {
                                    return m.id == msg.id;
                                });
                                if(id == undefined){
                                    //bool for know if the current msg is inserted
                                    let insert = false;
                                    for(let j = 0; j < this.messages.length; j++){
                                        if(!insert){
                                            //if the current message is before a item of the stocked messages
                                            if(this.messages[j].createdAt > msg.createdAt){
                                                this.messages.splice(j, 0, msg);
                                                insert = true;
                                                //else if this is the last message of the stocked msg
                                            }else if(j == this.messages.length -1){
                                                this.messages.push(msg);
                                                insert = true;
                                            }
                                        }
                                    }
                                    i++;
                                }
                            }else{
                                //if it is the first msg
                                this.messages.push(msg);
                                i++;
                            }
                        });
                    } 
                }
            });
        },
        //when the msg is sent, change the value in the database
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
        //scroll to the bottom of the scroll msg block
        scrollToBottom() {
            if(this.$el){
                if(this.canScroll){
                    const el = this.$el.querySelector("#scrollableContent");
                    if (el) {
                        el.scrollTop = 9999 + el.scrollHeight;
                    }
                }
            }
        },
        //get the users connected
        async getUserConnected(){
            const usersStatus = await this.$fire.firestore.collection('usersStatut');
            let i = this.users.length;
            //observe when a user change their status
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
        //put scroll event at the scroll block messages
        async putScrollEvent(){
            const el = document.querySelector("#scrollableContent");
            if(el != null){
                el.addEventListener("scroll", () => {setTimeout(() => {this.onScrollEvent()}, 500)});
            }else{
                setTimeout(() => {
                    this.putScrollEvent()
                }, 1000);
            }
        },
        async putConnectEvent(){
            window.addEventListener("beforeunload", () => {this.addEventListener("away")});
            window.addEventListener('blur', () => {this.addUserConnected("away")});
            window.addEventListener('focus', () => {this.addUserConnected("connected")});
        },
        //When scrolling at the scroll block msg, if the user go to the top => load more messages
        onScrollEvent(){
            if(this.isScrolledIntoView() && this.canScroll){
                const el = this.$el.querySelector("#scrollableContent");
                if (el) {
                    el.scrollTop = 100;
                }
                this.messagesLoaded += 10;
                this.canScroll = false;
                this.getMessages();
                setTimeout(() => {this.canScroll = true}, 1000);
            }
        },
        //check if the user is connected or not and update the database with
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
            //if the user is not subscribe at the planet
            if(!achieve){
                const newUserRef = await this.$fire.firestore.collection('usersStatut').doc();
                newUserRef.set({
                    userId: this.message.userId,
                    planetId: this.message.planetId,
                    connected: status,
                });
                await this.$fire.firestore.collection('users').doc(this.message.userId).update({
                    planets: this.$fireModule.firestore.FieldValue.arrayUnion(this.message.planetId),
                });
                
                
            }

            document.title = this.planet.name;
        }
    },
    async mounted(){
        //on récupère l'id de la planète via la route
        this.planet.id = this.$route.params.slug;
        //on récupère les données 
        await this.getPlanet();
        await this.getMessages();
        //on met l'id de l'user avec le user enregistré sur le store
        this.message.userId = this.$store.state.auth.user.uid;
        await this.getUserConnected().then(() => {
            this.addUserConnected("connected");
            //loading bar set to false
        });
        await this.putConnectEvent();
        await this.putScrollEvent();
        this.loading = false;
    },
    //if the DOM is updated
    updated(){
        setTimeout(() =>{
            if(!this.loadOnce){
                this.loadOnce = true;
            }
        }, 1000);
        setTimeout(() => {
            this.scrollToBottom();
        }, 500);
    },
    //load data before the page is mounted
    async fetch() {
        await this.getMessages();
        await this.getUserConnected();
    },
    watchQuery: true
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
        margin-right: 2vw;
        min-width: 35vw;
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

    .slide-fade-enter-active {
        transition: all .5s ease;
    }
    .slide-fade-leave-active {
        transition: all 0s ease;
    }
    .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active below version 2.1.8 */ {
        transform: translateY(-50px);
        opacity: 0;
    }

    .input-text{
        background: #272753;
        color: white;
    }

</style>
