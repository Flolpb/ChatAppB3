<template>
    <div v-if="isUser && isIntersecting">
    <transition name="slide-fade">
      <div v-if="animate" class="d-flex justify-start">
        <div>
          <img style="margin-left: 4px; margin-right: 1rem; margin-top: 0px;border-radius: 50%; height: 2rem;" :src="photoUrl" />
        </div>
        <div style="max-width: 50%">
          <div class="message">
            <div class="text">
              {{text}}
            </div>
          </div>
          <div class="d-flex justify-space-between">
            <div>{{username}}</div>
            <div style="width: 2rem;"></div>
            <div>{{time}} {{date}}</div>
          </div>
        </div>
      </div>
    </transition>
    </div>
    <div v-else-if="isIntersecting">
      <transition name="slide-fade">
        <div v-if="animate" class="d-flex justify-end">
          <div style="max-width: 50%">
            <div class="message" >
              <div class="text">
                {{text}}
              </div>
            </div>
            <div class="d-flex justify-end">
              <div>{{time}} {{date}}</div>
            </div>
          </div>
          <div>
            <img style="border-radius: 50%; height: 2rem; margin-left: 1rem; margin-right: 4px;margin-top: 0px;" :src="$store.state.auth.user.photoURL" />
          </div>
        </div>
      </transition>
    </div>
    <div class="d-flex justify-start" v-else-if="isUser">
      <v-progress-circular v-intersect="onIntersect"
        indeterminate
        color="#ede3e8"
      >
      </v-progress-circular>
    </div>
    <div class="d-flex justify-end" v-else>
      <v-progress-circular v-intersect="onIntersect"
        indeterminate
        color="#ede3e8"
      >
      </v-progress-circular>
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
      month: null,
      photoUrl: null,
      isIntersecting: false,
      animate: false,
    }),
    props: [
      "id",
      "uid",
      "planetId",
      "text",
      "isUser",
      "createdAt"
    ],
    metaInfo () {
      return {
        id: this.id,
        uid: this.uid,
        planetId: this.planetId,
        text: this.text,
        isUser: this.isUser,
        createdAt: this.createdAt,
      }
    },
    methods: {
      onIntersect (entries, observer) {
        setTimeout(() => {
          this.isIntersecting = entries[0].isIntersecting
          this.animate = this.isIntersecting
        }, 100)
      },
      async getData(){
        const userRef = await this.$fire.firestore.collection("users").doc(this.uid);
        const snapshot = await userRef.get();
        const doc = snapshot.data();
        if(doc != null){
          this.username = doc.displayName;
          this.photoUrl = doc.photoURL;
        }
        if(this.createdAt != null){
          this.created = new Date(this.createdAt.seconds * 1000);
          this.hours = this.created.getHours();
          if(this.hours < 10){
            this.hours = "0" + this.hours
          }
          this.minutes = this.created.getMinutes();
          if(this.minutes < 10){
            this.minutes = "0" + this.minutes
          }
          this.seconds = this.created.getSeconds();
          if(this.seconds < 10){
            this.seconds = "0" + this.seconds
          }
          this.time = this.hours + ":"+ this.minutes + ":" + this.seconds;
          this.date = this.created.getDate();
          if(this.date < 10){
            this.date = "0" + this.date
          }
          this.month = this.created.getMonth();
          this.month++;
          if(this.month < 10){
            this.month = "0" + this.month
          }

          this.date += "/" + this.month;
          console.log(this.time);
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
    border-radius: 15px;
  }

  .text{
    color: black;
    padding: 0.5rem 1rem 0.5rem 1rem;
  }
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active below version 2.1.8 */ {
    transform: translateX(50px);
    opacity: 0;
  } 

</style>