<template>
    <div>
        <div class="row">
            <div class="lefttab" :style="{ width: isCollapse ? 'auto' : '200px' }">
                <el-menu :collapse="isCollapse" :default-active="active" background-color="#545c64" text-color="#fff" active-text-color="#FFFF00" :router="true">
                    <template v-for="(item, index) in menuList">
                        <el-submenu :key="index" index="basicdata">
                            <template slot="title">
                                <em class="el-icon-location" />
                                <span>{{ item.menu_name }}</span>
                            </template>
                            <template v-for="(item1, subIndex) in item.children">
                                <el-submenu v-if="item1.children.length != 0" :key="subIndex">
                                    <template slot="title">
                                        <em class="el-icon-location" />
                                        <span>{{ item1.menu_name }}</span>
                                    </template>
                                    <template v-for="(item2, childIndex) in item1.children">
                                        <el-menu-item v-if="item2.children.length == 0" :key="childIndex" index="">
                                            {{ item2.menu_name }}
                                        </el-menu-item>
                                    </template>
                                </el-submenu>
                            </template>
                            <template v-for="(item1, subIndex) in item.children">
                                <el-menu-item v-if="item1.children.length == 0" :key="subIndex" index="orgStructure">
                                    {{ item1.menu_name }}
                                </el-menu-item>
                            </template>
                        </el-submenu>
                    </template>
                    <!--<el-submenu index="basicdata">-->
                    <!--<template slot="title">-->
                    <!--<em class="el-icon-location"></em>-->
                    <!--<span>基础数据</span>-->
                    <!--</template>-->
                    <!--<el-menu-item index="orgStructure">组织架构</el-menu-item>-->
                    <!--<el-menu-item index="">容器管理</el-menu-item>-->
                    <!--<el-menu-item index="">物料管理</el-menu-item>-->
                    <!--</el-submenu>-->
                    <!--<el-submenu index="systemsetup">-->
                    <!--<template slot="title">-->
                    <!--<em class="el-icon-menu"></em>-->
                    <!--<span slot="title">系统设置</span>-->
                    <!--</template>-->
                    <!--<el-menu-item index="">-->
                    <!--<em class="el-icon-menu"></em>-->
                    <!--<span slot="title">参数维护</span>-->
                    <!--</el-menu-item>-->
                    <!--<el-menu-item index="">-->
                    <!--<em class="el-icon-menu"></em>-->
                    <!--<span slot="title">角色管理</span>-->
                    <!--</el-menu-item>-->
                    <!--<el-menu-item index="">-->
                    <!--<em class="el-icon-menu"></em>-->
                    <!--<span slot="title">用户管理</span>-->
                    <!--</el-menu-item>-->
                    <!--</el-submenu>-->
                    <!--<el-menu-item index="">-->
                    <!--<em class="el-icon-document"></em>-->
                    <!--<span slot="title">数据录入</span>-->
                    <!--</el-menu-item>-->
                    <!--<el-menu-item index="">-->
                    <!--<em class="el-icon-setting"></em>-->
                    <!--<span slot="title">生管审核</span>-->
                    <!--</el-menu-item>-->
                    <!--<el-menu-item index="">-->
                    <!--<em class="el-icon-setting"></em>-->
                    <!--<span slot="title">工资核算</span>-->
                    <!--</el-menu-item>-->
                    <!--<el-menu-item index="">-->
                    <!--<em class="el-icon-setting"></em>-->
                    <!--<span slot="title">报表管理</span>-->
                    <!--</el-menu-item>-->
                </el-menu>
            </div>
            <div class="rightmain">
                <div class="headfa">
                    <div class="head">
                        <p
                            @click="
                                () => {
                                    if (isCollapse) {
                                        isCollapse = false;
                                    } else {
                                        isCollapse = true;
                                    }
                                }"
                        >
                            <em class="el-icon-menu" />
                        </p>
                    </div>
                </div>
                <router-view id="childrenRouter" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Index',
    data() {
        return {
            active: '',
            menuList: [],
            isCollapse: false
        };
    },
    mounted() {
        this.menuList = JSON.parse(window.sessionStorage.getItem('menuList'));
        this.active = this.$route.path.substring(1, this.$route.path.length);
    },
    methods: {}
};
</script>

<style lang="scss" scoped>
.row {
    display: flex;
    width: 100%;
    height: 100%;
    .lefttab {
        min-width: 160px;
        max-width: 200px;
        overflow: auto;
        background: #545c64;
    }
    .lefttab::-webkit-scrollbar {
        display: none;
    }
    .rightmain {
        flex: 1;
        height: 100%;
        .headfa {
            position: relative;
            width: 100%;
        }
        .head {
            position: absolute;
            width: 100%;
            height: 50px;
            padding: 10px;
            line-height: 30px;
            background: white;
            box-shadow: 0 1px 4px 0 rgba(0, 21, 41, 0.12);
        }
        #childrenRouter {
            height: 100%;
            padding-top: 50px;
            overflow: auto;
            background: #f0f2f5;
        }
    }
}
</style>
