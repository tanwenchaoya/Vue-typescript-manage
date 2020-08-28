<template>
    <el-container>
        <el-header>
            <div class="header-left">
                <img src="../assets/images/logo.png" alt="">
                <p>通用商业权限管理系统</p>
            </div>
            <div class="header-right">
                <img src="../assets/logo.png" alt="">
                <p>谭文超</p>
                <el-button type="info" @click="quit">退出</el-button>
            </div>
        </el-header>
        <el-container>
            <el-aside :width="isToggle?'64px':'200px'">
                <el-menu
                        background-color="#fff"
                        text-color="#000"
                        active-text-color="#2775b6"
                        :unique-opened="true"
                        :collapse="isToggle"
                        :collapse-transition = 'false'
                        :router="true"
                        :default-active="defaultActiveMenu"
                >
                    <div class="toggleMenu" @click="toggleMenu">|||</div>
                    <el-submenu :index="item.menuName" v-for="item in menus" :key="item.menuName">
                        <template slot="title">
                            <i  :class="item.icon"></i>
                            <span>{{item.menuName}}</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item :index="inItem.path" v-for="inItem in item.children" :key="inItem.menuName"
                            @click="changeDefaultActiveMenu(inItem.path)">
                                <template slot="title">
                                    <i :class="inItem.icon"></i>
                                    <span>{{inItem.menuName}}</span>
                                </template>
                            </el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script lang="ts">

    import {Vue,Component} from 'vue-property-decorator'
    import {getUsers} from '../api/index'
    import Cookies from 'js-cookie'
    @Component({
        name:"Admin",
        components:{}
    })
    export default class Admin extends Vue {
        private isToggle=false;
        private defaultActiveMenu='';
        private menus=[
            {
                menuName:'用户管理',
                path:'',
                icon:'el-icon-setting',
                children:[
                    { menuName:'用户列表', path:'/users', icon:'el-icon-user',children:[]}
                ]
            },
            {
                menuName:'权限管理',
                path:'',
                icon:'el-icon-document-checked',
                children:[
                    { menuName:'角色列表', path:'/roles', icon:'el-icon-view',children:[]},
                    { menuName:'权限列表', path:'/rights', icon:'el-icon-unlock',children:[]}
                ]
            }

        ];
        private changeDefaultActiveMenu(path:string){
            this.defaultActiveMenu=path;
            window.sessionStorage.setItem('activeMenu',path);
        };
        created(){
            const activeMenu = window.sessionStorage.getItem('activeMenu');
            this.defaultActiveMenu=activeMenu?activeMenu:'';
        };
        private quit(){
            Cookies.remove('token');
            this.$router.push('/login')
        }
        private toggleMenu(){
            this.isToggle = !this.isToggle;
        }
    }
</script>
<style lang="scss" scoped>
    .el-container{
        width: 100%;
        height: 100%;
        .el-header{
            display: flex;
            justify-content: space-between;
            height: 80px;
            background: rgba(39,117,182,0.7);
            .header-left{
                display: flex;
                align-items: center;
                img{
                    height: 70px;
                }
            }
            .header-right{
                display: flex;
                align-items: center;
                p{
                    /*background: #0f6674;*/
                    /*width: 200px;*/
                    margin: 0 20px;

                }
                img{
                    height: 40px;
                    width: 40px;
                    background: #0f6674;
                    border-radius: 50%;
                }
                .el-button{
                    width: 80px;
                }
            }
        }
        .el-container{
            height: 100%;
            .el-aside{
                .toggleMenu{
                    padding: 5px 0;
                    text-align: center;
                    cursor: pointer;
                }
            }
        }
    }
</style>