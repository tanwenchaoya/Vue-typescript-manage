<template>
    <div>
        欢迎使用权限管理系统
    </div>
</template>

<script lang="ts">

    import {Vue,Component} from 'vue-property-decorator'
    @Component({
        name:"Welcome",
        components:{}
    })
    export default class Welcome extends Vue {

    }
</script>
<style lang="scss" scoped>
    div{
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 30px;
    }
</style>