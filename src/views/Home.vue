<template>
  <div class="home">
    首页
    {{data}}
    {{count}}
    {{msg}}
    <Son :parentCount="count" @parentIncre = "increment"></Son>
  </div>
</template>

<script>
  // import Vue from 'vue'
  // import Component from 'vue-class-component'
  import {Vue,Component,Watch} from 'vue-property-decorator'
  import Son from '../components/Son'
  @Component({
    //以前的name，component等都可以写在这里面
    name:'Home',
    components:{
      Son
    }
  })
  export default class Home extends Vue {
    //属性就是data
    count = 10
    data = 0
    str="12345"
    // 类中的方法就是过去methds定义的方法
    increment(data) {
      this.count++
      this.data = data
    }

    decrement() {
      this.count--
    }
    //类中的getter方法就是以前的计算属性
    get msg(){
      return this.str.split('').reverse().join('');
    }
    //第一个参数：需要监听的属性
    //第二个：可选参数,如果deep为true表示深度监听
    @Watch("count",{deep:true})
    countChange(newValue,okdValue){
      console.log(newValue,okdValue);
    }
    //传递参数给子组件

  }
</script>
