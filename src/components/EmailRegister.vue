<template>
    <el-form ref="form" :model="registerData" :rules="registerRules">
        <el-form-item label="" prop="email">
            <el-input v-model="registerData.email" prefix-icon="el-icon-message"></el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
            <el-input type="password" v-model="registerData.password" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <el-form-item prop="captcha">
            <el-row :gutter=5>
                <el-col :span="14">
                    <el-input v-model="registerData.captcha" prefix-icon="el-icon-view"></el-input>
                </el-col>
                <el-col :span="10" id="col-captcha">
                    <el-button @click="sendEmaliCode">发送验证码</el-button>
                </el-col>
            </el-row>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">立即注册</el-button>
        </el-form-item>
    </el-form>
</template>

<script lang="ts">
    import {Vue,Component,Ref} from 'vue-property-decorator'
    import {ElForm} from 'element-ui/types/form'
    import {registerUser,sendEmailCode} from '../api/index'
    @Component({
        name:"EmailRegister",
        components:{}
    })
    export default class EmailRegister extends Vue {
        private registerData={
            email:'',
            password:'',
            captcha:'',
            registerType:'email'
        };
        private validateEmail = (rule:any, value:string, callback:any) => {
            const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
            if (value === '') {
                callback(new Error('请输入邮箱'));
            } else if (!reg.test(value)) {
                callback(new Error('邮箱格式不正确'));
            } else {
                callback();
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
        private registerRules={
            email: [
                { validator: this.validateEmail, trigger: 'blur' }
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
                    registerUser(this.registerData).then((data:any)=>{
                        console.log(data);
                        if (data.code === 200){
                            (this as any).$router.push('/login')
                        }else {
                            (this as any).$message.error(data.message);
                            (this as any).undateCaptcha();
                        }

                    })
                        .catch((err)=>{
                            (this as any).$message.error(err.message);
                            (this as any).undateCaptcha();
                        })
                }else {
                    (this as any).$message.error("数据格式不正确");
                }
            })
        }
        private sendEmaliCode(){
            sendEmailCode({email:this.registerData.email})
            .then((data:any)=>{
                if (data.code === 200){
                    (this as any).$message.success('验证码已经发送');
                }else {
                    (this as any).$message.error(data.message);
                }
            })
            .catch((err)=>{
                (this as any).$message.error(err);
            })
        }
        public resetForm(){
            this.form.resetFields()
        }
    }
</script>
<style lang="scss" scoped>
    .el-tabs__nav-scroll{
        display: flex;
        justify-content: center;
    }
    .el-button{
        width: 100%;
    }
</style>