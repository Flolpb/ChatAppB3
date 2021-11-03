<template>
    <div>
        {{username}} {{status}}
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