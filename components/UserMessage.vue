<template>
    <div v-if="isUser" class="d-flex justify-start">
      <div>
        <img style="border-radius: 50%; height: 2rem;" :src="photoUrl" />
      </div>
      <div>
        <div class="message">
          <div class="text">
            {{text}}
          </div>
        </div>
        <div class="d-flex justify-space-between">
          <div>{{username}}</div>
          <div></div>
          <div>{{time}}</div>
        </div>
      </div>
    </div>
    <div class="d-flex justify-end" v-else>
      <div>
        <div class="message">
          <div class="text">
            {{text}}
          </div>
        </div>
        <div>{{time}}</div>
      </div>
      <div>
        <img style="border-radius: 50%; height: 2rem;" :src="$store.state.auth.user.photoURL" />
      </div>
    </div>
</template>

<script>
export default {
    data:  () => ({
      username: null,
      created: null,
      hours: null,
      minutes: null,
      seconds: null,
      time: null,
      date: null,
      photoUrl: null,

    }),
    props: [
        "id",
        "uid",
        "text",
        "isUser",
        "createdAt"
    ],
    metaInfo () {
      return {
        id: this.id,
        uid: this.uid,
        text: this.text,
        isUser: this.isUser,
        createdAt: this.createdAt,
      }
    },
    methods: {
      async getData(){
        const userRef = await this.$fire.firestore.collection("users").doc(this.uid);
        const snapshot = await userRef.get();
        const doc = snapshot.data();
        if(doc != null){
          this.username = doc.displayName;
          this.photoUrl = doc.photoURL;
          if(this.createdAt != null){  
            this.created = new Date(this.createdAt.seconds);
            this.hours = this.created.getHours();
            this.minutes = this.created.getMinutes();
            this.seconds = this.created.getSeconds();
            this.time = this.hours +":"+ this.minutes + ":" + this.seconds;
          }
        }
        
      } 
    },
    async mounted () {
      await this.getData();

    },

}
</script>

<style scoped lang="scss">
  .message{
    background: #EDE3E8;
    border-radius: 8%;
  }

  .text{
    
    color: black;
    padding: 0.5rem 2rem 0.5rem 2rem;
  }

</style>