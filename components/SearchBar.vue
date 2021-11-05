<template>
<div id="app">
      <v-form>
            <v-flex xs6>
              <v-autocomplete
                v-model="searchString"
                :disabled="isUpdating"
                :items="people"
                solo
                label="Rechercher..."
                item-text="name"
                item-value="name"
                multiple
              >
                
                <div slot="no-data">
                  <v-list-tile>
                    <v-list-tile-title>
                      ...Chercher de nouveaux amis
                    </v-list-tile-title>
                  </v-list-tile>
                </div>
                
                <div
                  slot="selection"
                  slot-scope="data"
                >
                  <v-chip
                    :selected="data.selected"
                    close
                    class="chip--select-multi"
                    @input="data.parent.selectItem(data.item)"
                  >
                    <v-avatar>
                      <img :src="data.item.avatar">
                    </v-avatar>
                    {{ data.item.name }}
                  </v-chip>
                </div>
                <div
                  slot="item"
                  slot-scope="data"
                >
<!--                   <div v-if="typeof data.item !== 'object'">
                    <v-list-tile-content v-text="data.item"></v-list-tile-content>
                  </div> -->
                  <div >
                    <v-list-tile-avatar :tile="data.item.group=='Products'" :size="data.item.group=='Products'?50:40">
                      <img :src="data.item.avatar">
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                      <v-list-tile-sub-title v-if="data.item.group=='Products'" v-html="data.item.seller"></v-list-tile-sub-title>
                    </v-list-tile-content>
                  </div>
                </div>
              </v-autocomplete>
            </v-flex>
      </v-form>
</div>
</template>

<script>

</script>


<style scoped>
.v-select.v-select--is-menu-active .v-input__icon--append .v-icon {
    transform: none;
}
.v-form{
    margin-left: 33%;
    margin-right: auto;
    margin-top: 5%;
}
</style>