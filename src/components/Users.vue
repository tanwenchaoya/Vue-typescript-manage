<template>
    <div class="userBox">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item ><a href="/admin" @click="removeDefaultMenu">首页</a></el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
            <el-breadcrumb-item>活动详情</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-row class="user-row" :gutter="5">
                <el-col :span="20">
                    <el-form :inline="true" :model="searchData" class="demo-form-inline">
                        <el-form-item label=''>
                            <el-select v-model="searchData.role" placeholder="所有角色">
                                <el-option label="--所有角色--" value=""></el-option>
                                <el-option label="管理员" value="manage"></el-option>
                                <el-option label="普通用户" value="common"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label=''>
                            <el-select v-model="searchData.origin" placeholder="所有来源">
                                <el-option label="--所有来源--" value=""></el-option>
                                <el-option label="本地登录" value="local"></el-option>
                                <el-option label="github登录" value="github"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label=''>
                            <el-select v-model="searchData.type" placeholder="所有用户">
                                <el-option label="--所有用户--" value=""></el-option>
                                <el-option label="用户名" value="username"></el-option>
                                <el-option label="邮箱" value="email"></el-option>
                                <el-option label="手机号" value="phone"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="">
                            <el-input v-model="searchData.key" placeholder="关键字"></el-input>
                        </el-form-item>
                        <el-form-item >
                            <el-button type="primary" @click="onSubmit" >查询</el-button>
                            <el-button type="primary" @click="exportUsers">导出搜索结果</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="4" >
                    <el-col :span="12">
                        <el-button type="primary" @click="showAddUserDialog">添加用户</el-button>
                    </el-col>
                    <el-col :span="12">
                        <el-upload
                                class="excel-uploader"
                                action="http://127.0.0.1:7001/api/v1/importUsers/"
                                :show-file-list="false"
                                :on-success="handleExcelSuccess"
                                :before-upload="beforeExcelUpload"
                                accept=".xls"
                        >
                            <el-button type="primary" @click="importUsers">导入用户</el-button>
                        </el-upload>
                    </el-col>
                </el-col>
            </el-row>
            <el-table
                    :data="usersData"
                    stripe
                    :border="true"
                    style="width: 100%">
                <el-table-column
                        type="index"
                        width="50">
                </el-table-column>
                <el-table-column
                        prop="username"
                        label="用户名"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="phone"
                        label="手机号"
                        width="180"
                >
                </el-table-column>
                <el-table-column
                        prop="email"
                        label="邮箱"
                >
                </el-table-column>
                <el-table-column label="用户状态" width="150" >
                    <template v-slot="scope">
                        <el-switch
                                v-model="scope.row.userState"
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                @change="changeUserStates(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="roleName"
                        label="角色"
                >
                </el-table-column>
                <el-table-column label="操作" class="operate">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="small" @click="showEditUserDialog(scope.row)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="small " @click="deleteUser(scope.row.id)"></el-button>
                        <el-button type="warning" icon="el-icon-setting" size="small"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="searchData.currentPage"
                    :page-sizes="[5, 10, 20, 30]"
                    :page-size="searchData.pageSize"
                    layout="total,sizes,prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加用户-->
        <el-dialog
                title="添加用户"
                :visible.sync="addDialogVisible"
                width="30%"
                @close="closeAddUserDialog"
        >
            <el-form ref="addUserForm" :model="addUserData" :rules="addUserRules">
                <el-form-item label="" prop="username">
                    <el-input v-model="addUserData.username" prefix-icon="el-icon-user"></el-input>
                </el-form-item>
                <el-form-item label="" prop="password">
                    <el-input type="password" v-model="addUserData.password" prefix-icon="el-icon-lock"></el-input>
                </el-form-item>
                <el-form-item label="" prop="email">
                    <el-input type="email" v-model="addUserData.email" prefix-icon="el-icon-message"></el-input>
                </el-form-item>
                <el-form-item label="" prop="phone">
                    <el-input type="phone" v-model="addUserData.phone" prefix-icon="el-icon-phone"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" @click="addNewUser">添加用户</el-button>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <!--修改用户-->
        <el-dialog
                title="修改用户"
                :visible.sync="editDialogVisible"
                width="30%"
                @close="closeEditUserDialog"
        >
            <el-form ref="addUserForm" :model="editUserData" :rules="addUserRules">
                <el-form-item style="text-align: center">
                    <el-upload
                            class="avatar-uploader"
                            action="http://127.0.0.1:7001/api/v1/posts/"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
<!--获取用户头像需要带上服务器的地址+图片在服务器的地址，为了方便数据库的迁移，我们可以使用sequelize的获取器或者虚拟字段来解决-->
                        <img v-if="editUserData.avatarUrl" :src="editUserData.baseUrl+editUserData.avatarUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="" prop="username">
                    <el-input v-model="editUserData.username" prefix-icon="el-icon-user"></el-input>
                </el-form-item>
                <el-form-item label="" prop="email">
                    <el-input type="email" v-model="editUserData.email" prefix-icon="el-icon-message"></el-input>
                </el-form-item>
                <el-form-item label="" prop="phone">
                    <el-input type="phone" v-model="editUserData.phone" prefix-icon="el-icon-phone"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" @click="editUser">修改用户</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import {Vue,Component,Ref} from 'vue-property-decorator'
    import {getUsers,addNewUser,deleteUser,updateUser} from '../api/index'
    import {ElForm} from "element-ui/types/form";
    import XLSX from 'xlsx'
    import { saveAs } from 'file-saver';
    @Component({
        name:"Users",
        components:{}
    })
    export default class Users extends Vue {
        private addDialogVisible = false;
        private editDialogVisible = false;
        private addUserData = {
            username:'',
            password:'',
            email:'',
            phone:''
        };
        private editUserData = {
            username:'',
            email:'',
            phone:'',
            id:'',
            avatarUrl:''
        }
        private searchData={
            role:'',
            origin:'',
            type:'',
            key:'',
            currentPage:1,
            pageSize:5
        };
        private total = 10;
        private usersData:Array<any>=[]
        private validateUserName = (rule:any, value:string, callback:any) => {
            const reg = /^[a-zA-Z0-9]{6,}$/;
            if (value === '') {
                callback(new Error('请输入用户名'));
            } else if (!reg.test(value)) {
                callback(new Error('用户名为字母和数字且至少6位'));
            } else {
                callback();
            }
        };

        private validateEmail = (rule:any, value:string, callback:any) => {
            const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
            if (value &&!reg.test(value) ) {
                callback(new Error('邮箱格式不正确'));
            } else {
                callback();
            }
        };
        private validatePassword=(rule:any, value:string, callback:any) => {
            const reg = /^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9.]{8,20}$/;
            if (value === '') {
                callback(new Error('请输入密码'));
            } else if (value.length < 8){
                callback(new Error('密码至少是8位'));
            } else if (!reg.test(value)) {
                callback(new Error('密码需包括字母和数字且不能包括特殊字符'));
            } else {
                callback();
            }
        };
        private validatePhone = (rule:any, value:string, callback:any) => {
            const reg = /^1[345678]\d{9}$/;
            if (value&&!reg.test(value)) {
                callback(new Error('手机号格式不正确'));
            } else {
                callback();
            }
        };
        private addUserRules={
            username: [
                { validator: this.validateUserName, trigger: 'blur' }
            ],
            email: [
                { validator: this.validateEmail, trigger: 'blur' }
            ],
            password:[
                { validator: this.validatePassword, trigger: 'blur' }
            ],
            phone:[
                {validator:this.validatePhone,trigger:'blur'}
            ]
        }

        created(){
           this.getUsersList();
        }
        private getUsersList(){
            getUsers(this.searchData)
                .then((response:any)=>{
                    if (response.status === 200){
                        this.usersData = response.data.data.users;
                        this.total = response.data.data.total.count;
                        console.log(response.data.data);

                    }else {
                        (this as any).$message.error(response.data.msg)
                    }
                })
                .catch((error)=>{
                    (this as any).$message.error(error.response.data.msg)
                })
        }
        private  handleSizeChange(newSize:number) {
            this.searchData.pageSize = newSize;
            this.getUsersList();
        }
        //页码值发生变化
        private handleCurrentChange(newPage:number) {
            // console.log(newPage);
            this.searchData.currentPage = newPage;
            this.getUsersList();
        }
        //点击首页移除选中菜单
        private removeDefaultMenu(){
            sessionStorage.removeItem('activeMenu');
        }

        private onSubmit(){
            this.getUsersList();
        }
        private exportUsers(){
            const user = this.usersData.length>0?this.usersData[0]:null;
            const data:Array<any> = [];
            if (user){
                const colTitles = Object.keys(user);
                data.push(colTitles);
                this.usersData.forEach(item=>{
                    const colValue:Array<any> =[]
                   colTitles.forEach(key=>{
                       colValue.push(item[key]);
                   });
                    data.push(colValue);
                })
            }
            //根据二维数组生成表格中的数据
            const sheet = XLSX.utils.aoa_to_sheet(data);
            //创建一个新的表格
            const workbook = XLSX.utils.book_new();
            //将数据添加到表格中，并起一个名字
            XLSX.utils.book_append_sheet(workbook,sheet,'user');
            //从浏览器下载到本地
            const wopts:any = { bookType:'xlsx', bookSST:false, type:'array' };
            const wbout = XLSX.write(workbook,wopts);
            saveAs(new Blob([wbout],{type:"application/octet-stream"}), "users.xls");
        }
        private importUsers(){

        }


        //添加用户相关
        @Ref() readonly addUserForm?: ElForm;
        //点击添加用户按钮弹出窗口
        private showAddUserDialog(){
            this.addDialogVisible = true;
            this.addUserForm?this.addUserForm.resetFields():'';
        }
        //点击添加按钮添加到数据库
        private addNewUser(){
            this.addDialogVisible=false;
            this.addUserForm!.validate((flag:any)=>{
               if (flag){
                   addNewUser(this.addUserData)
                       .then((response:any)=>{
                           if (response.status === 200){
                               const user = response.data.data;
                               this.usersData.push(user);
                               (this as any).$message.success("用户添加成功");
                           }else {
                               (this as any).$message.error("用户添加失败");
                           }
                       })
                       .catch((error)=>{
                           (this as any).$message.error('添加失败')
                       })
               }else {
                   (this as any).$message.error('输入格式不正确')
               }
            })
        }
        //关闭添加
        private closeAddUserDialog(){
            this.addDialogVisible = false;
        }

        //删除用户相关
        private deleteUser(id:string){
            deleteUser(id)
            .then((response:any)=>{
                if (response.status===200){
                    const index = this.usersData.findIndex((obj)=>{
                        return obj.id === id
                    });
                    this.usersData.splice(index,1);
                }else {
                    (this as any).$message.error("用户删除失败");
                }
            }).catch((error)=>{
                    (this as any).$message.error(error.response.data.msg)
                })
        }

        //修改用户相关
        private showEditUserDialog(user:any){
            this.editDialogVisible = true;
            this.addUserForm?this.addUserForm.resetFields():'';
            this.editUserData = {...user};
        }
        private closeEditUserDialog(){
            this.editDialogVisible = false;
        }
        private editUser(){
            this.editDialogVisible=false;
            this.addUserForm!.validate((flag:any)=>{
                updateUser(this.editUserData.id,this.editUserData)
                    .then((response:any)=>{
                        if (response.status === 200){
                            const index = this.usersData.findIndex((item)=>{
                                return item.id === this.editUserData.id;
                            });
                            //直接给数组赋值不会触发vue的更新，
                            // this.usersData[index] = this.editUserData;
                            this.$set(this.usersData,index,this.editUserData);
                            (this as any).$message.success("更新用户成功");
                        }
                    })
                    .catch((error)=>{
                        (this as any).$message.error(error.response.data.msg)
                    })
            })
        }
        //上传用户头像相关
        private handleAvatarSuccess(res:any, file:any) {
            if (res.code === 200){
                this.editUserData.avatarUrl = res.data;
            }
        }
        private beforeAvatarUpload(file:any) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                (this as any).$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                (this as any).$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        }
        //改变用户状态
        private changeUserStates(user:any){
            updateUser(user.id,user)
                .then((response:any)=>{
                    if (response.status === 200){

                        (this as any).$message.success("更新用户成功");
                    }else {
                        user.userState = !user.userState;
                        (this as any).$message.success("更新用户状态失败");
                    }
                })
                .catch((error)=>{
                    user.userState = !user.userState;
                    (this as any).$message.success("更新用户状态失败");
                })
        }
        //导入excel文件相关
        private handleExcelSuccess(res:any, file:any) {
            if (res.code === 200){
                this.editUserData.avatarUrl = res.data;
            }
        }
        private beforeExcelUpload(file:any) {
            const isJPG = file.type === 'application/vnd.ms-excel';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
                (this as any).$message.error('上传头像图片只能是 excel 格式!');
            }
            if (!isLt2M) {
                (this as any).$message.error('上传文件大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        }
    }
</script>
<style lang="scss" scoped>
    .userBox{
        .el-breadcrumb{
            margin-bottom: 20px;
        }
        .box-card{
            box-shadow: 0 0 3px #ccc;
            width: 100%;
            .el-form{
                .el-form-item{
                    width: 170px;
                }
               & .el-form-item:last-of-type{
                   width: 250px;
               }
            }
            .el-pagination{
                margin-top: 20px;
            }
        }
        .el-dialog__body{
            .el-button{
                width: 100%;
            }
        }
        .avatar-uploader  {
            border: 1px dashed #d9d9d9;
            width: 78px;
            height: 78px;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            display: inline-block;
        }
        .avatar-uploader:hover {
            border-color: #409EFF;
        }
        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 78px;
            height: 78px;
            line-height: 178px;
            text-align: center;
        }
        .avatar {
            width: 78px;
            height: 78px;
            display: block;

        }
    }

</style>