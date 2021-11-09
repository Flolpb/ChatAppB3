<template>
    <div class="d-flex justify-space-start">
        <div style="position: relative">
          <img style="margin-top: 0.5rem;border-radius: 50%; height: 2rem;" :src="photoUrl" />
          <span class="dot-gray" v-if="status == 'disconnected'"></span>
          <span class="dot-orange" v-if="status == 'away'"></span>
          <span class="dot-green" v-if="status == 'connected'"></span>
        </div>
        <span class="username">{{username}}</span>
    </div>
</template>
<script>
export default {
    data: () => ({
        username: null,
        photoUrl: null
    }),
    props: [
        "id",
        "uid",
        "pid",
        "status"
    ],
    metaInfo () {
      return {
        id: this.id,
        uid: this.uid,
        pid: this.pid,
        status: this.status,
      }
    },
    methods: {
      async getData(){
        if(this.uid != null){
          const userRef = await this.$fire.firestore.collection("users").doc(this.uid);
          const snapshot = await userRef.get();
          const doc = snapshot.data();
          if(doc != null){
              this.username = doc.displayName;
              this.photoUrl = doc.photoURL;
          }
        }
        
      } 
    },
    async mounted () {
        await this.getData();
    }
}
</script>
<style scoped lang="scss">
  .dot-gray {
  height: 0.2rem;
  width: 0.2rem;
  background-color: #bbb;
  border-radius: 50%;
  position: absolute;
  left: 1.3rem;
  top: 1.8rem;
}.dot-orange {
  height: 0.8rem;
  width: 0.8rem;
  background-color: #FFA500;
  border-radius: 50%;
  position: absolute;
  left: 1.3rem;
  top: 1.8rem;
}.dot-green {
  height: 0.8rem;
  width: 0.8rem;
  background-color: #97b968;
  border-radius: 50%;
  position: absolute;
  left: 1.3rem;
  top: 1.8rem;
}

.username{
  font-size: 2rem;
  margin-left: 2rem;
}


</style>