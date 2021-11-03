<template>
    <div>
    <span class="dot-gray" v-if="status == 'disconnected'"></span>
    <span class="dot-orange" v-if="status == 'away'"></span>
    <span class="dot-green" v-if="status == 'connected'"></span>
        {{username}} 
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
        const userRef = await this.$fire.firestore.collection("users").doc(this.uid);
        const snapshot = await userRef.get();
        const doc = snapshot.data();
        if(doc != null){
            this.username = doc.displayName;
            this.photoUrl = doc.photoURL;
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
  height: 25px;
  width: 25px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
}.dot-orange {
  height: 25px;
  width: 25px;
  background-color: #FFA500;
  border-radius: 50%;
  display: inline-block;
}.dot-green {
  height: 25px;
  width: 25px;
  background-color: #97b968;
  border-radius: 50%;
  display: inline-block;
}


</style>