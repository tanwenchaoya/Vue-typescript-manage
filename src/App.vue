
<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

    import {Vue,Component} from 'vue-property-decorator'
    @Component({
        name:"App",
        components:{}
    })
    export default class App extends Vue {

    }
</script>
<style lang="scss" scoped>

</style>
