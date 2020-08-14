<template>
    <div class="register_container">
        <div class="register_box">
            <h1>欢迎注册</h1>
            <el-tabs class="el-tabs" value="first" @tab-click="handleClick" style="width: 328px">
                <el-tab-pane label="用户名注册" name="first">
                    <NormalRegister ref="normalForm"></NormalRegister>
                </el-tab-pane>
                <el-tab-pane label="邮箱注册" name="second">
                    <EmailRegister ref="emailForm"></EmailRegister>
                </el-tab-pane>
                <el-tab-pane label="手机号注册" name="third">
                    <PhoneRegister ref="phoneForm"></PhoneRegister>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script lang="ts">

    import {Vue,Component,Ref} from 'vue-property-decorator'
    import NormalRegister from '../components/NormalRegister.vue'
    import EmailRegister from '../components/EmailRegister.vue'
    import PhoneRegister from '../components/PhoneRegister.vue'
    @Component({
        name:"Register",
        components:{
            NormalRegister,
            EmailRegister,
            PhoneRegister
        }
    })
    export default class Register extends Vue {
        @Ref() readonly normalForm!: NormalRegister
        @Ref() readonly emailForm!: EmailRegister
        @Ref() readonly phoneForm!: PhoneRegister
        private handleClick(){
            console.log("111");
            this.normalForm.resetForm();
            this.emailForm.resetForm();
            this.phoneForm.resetForm();
        }

    }
</script>
<style lang="scss" scoped>
.register_container{
    width: 100%;
    height: 100%;
    background-color: #ccccff;
    background-image: url("../assets/images/bg.jpg");
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    .register_box{
        width: 500px;
        height: 400px;
        background: #f7f7f7;
        border-radius: 15px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }
}
</style>