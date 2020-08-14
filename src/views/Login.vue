<template>
    <div class="login_container">
        <div class="login_box">
            <h1>欢迎登录</h1>
            <el-form ref="form" :model="loginData" :rules="loginRules">
                <el-form-item label="" prop="username">
                    <el-input v-model="loginData.username" prefix-icon="el-icon-user"></el-input>
                </el-form-item>
                <el-form-item label="" prop="password">
                    <el-input type="password" v-model="loginData.password" prefix-icon="el-icon-lock"></el-input>
                </el-form-item>
                <el-form-item prop="captcha">
                    <el-row :gutter=10>
                        <el-col :span="17">
                            <el-input v-model="loginData.captcha" prefix-icon="el-icon-view"></el-input>
                        </el-col>
                        <el-col :span="7" id="col-captcha">
                            <img src=" http://127.0.0.1:7001/ImageCode" alt="" class="captcha" ref="captchaImage" @click="undateCaptcha">
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script lang="ts">

    import {Vue, Component, Ref} from 'vue-property-decorator'
    import {ElForm} from "element-ui/types/form";
    import {loginUser} from "../api/index";
    import da from "element-ui/src/locale/lang/da";
    @Component({
        name:"Login",
        components:{}
    })
    export default class Login extends Vue {
        private loginData={
            username:'',
            email:'',
            phone:'',
            password:'',
            captcha:'',
            registerType:''
        };
        private validateName = (rule:any, value:string, callback:any) => {
            const normalReg = /^[A-Za-z0-9.]{6,20}$/;
            const emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
            const phoneReg = /^1[345678]\d{9}$/;
            if (value === '') {
                callback(new Error('请输入用户名'));
            } else if (emailReg.test(value)) {
                this.loginData.email = this.loginData.username;
                this.loginData.username = '';
                this.loginData.registerType = 'email';
                callback(new Error(''));
            }else if (phoneReg.test(value)){
                this.loginData.phone = this.loginData.username;
                this.loginData.username = '';
                this.loginData.registerType = 'phone';
            }else if (normalReg.test(value)){
                this.loginData.registerType = 'normal';
                callback();
            } else {
                callback('用户名不符合格式');
            }
        };
        private validatePassword=(rule:any, value:string, callback:any) => {
            const reg = /^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9.]{8,20}$/;
            if (value === '') {
                callback(new Error('请输入密码'));
            } else if (value.length<8){
                callback(new Error('密码至少是8位'));
            } else if (!reg.test(value)) {
                callback(new Error('密码需包括字母和数字且不能包括特殊字符'));
            } else {
                callback();
            }
        };
        private validateCaptcha=(rule:any, value:string, callback:any) => {
            const reg = /^[a-zA-Z0-9]{4}$/;
            if (value === '') {
                callback(new Error('请输入验证码'));
            }  else if (!reg.test(value)) {
                callback(new Error('验证码错误'));
            } else {
                callback();
            }
        };
        private loginRules={
            username: [
                { validator: this.validateName, trigger: 'blur' }
            ],
            password:[
                { validator: this.validatePassword, trigger: 'blur' }
            ],
            captcha:[
                { validator: this.validateCaptcha, trigger: 'blur' }
            ]
        }
        @Ref() readonly form!: ElForm;
        private onSubmit(){
            this.form.validate((flag:any)=>{
                if (flag){
                    loginUser(this.loginData).then((data:any)=>{
                        if (data.code === 200){
                            console.log(data);
                            let token = data.data.token;
                            window.sessionStorage.setItem('token',token)
                            // this.$router.push('/admin')
                        }else {
                            (this as any).$message.error(data.message);
                            this.undateCaptcha();
                        }
                    })
                        .catch((err:any)=>{
                            (this as any).$message.error(err.message);
                            console.log(err.message)
                            this.undateCaptcha();
                        })
                }else {
                    (this as any).$message.error("数据格式不正确");
                }
            })
        }
        @Ref() readonly captchaImage!: HTMLImageElement
        private undateCaptcha(){
            this.captchaImage.src=`http://127.0.0.1:7001/ImageCode?t=${Math.random()}`
        }
    }
</script>
<style lang="scss" scoped>
    .login_container{
        width: 100%;
        height: 100%;
        background-color: #ccccff;
        background-image: url("../assets/images/bg.jpg");
        background-size: cover;
        display: flex;
        justify-content: center;
        align-items: center;
        .login_box{
            width: 500px;
            height: 400px;
            background: #f7f7f7;
            border-radius: 15px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            h1{
                margin: 40px 0 40px 0;
            }
        }
    }
</style>