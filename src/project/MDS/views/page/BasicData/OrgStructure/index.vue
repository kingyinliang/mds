<template>
    <el-col>
        <div class="main">
            <el-card>
                <el-row :gutter="20">
                    <div style="margin-bottom: 10px; padding-left: 10px;">
                        <el-input v-model="filterText" placeholder="部门名称" size="small" style="width: 300px;">
                            <i slot="prefix" class="el-input__icon el-icon-search" />
                        </el-input>
                    </div>
                    <el-col :span="8">
                        <el-card class="orgcard">
                            <div slot="header" class="clearfix">
                                <span>组织架构一览</span>
                            </div>
                            <el-tree v-if="isAuth('sys:dept:save')" ref="tree2" :data="OrgTree" nodeKey="deptId" :defaultExpandedKeys="arrList" :filterNodeMethod="filterNode" :expandOnClickNode="false" @node-contextmenu="showtab1" @node-click="setdetail" />
                            <el-tree v-else ref="tree2" :data="OrgTree" nodeKey="deptId" :defaultExpandedKeys="arrList" :filterNodeMethod="filterNode" :expandOnClickNode="false" @node-click="setdetail" />
                        </el-card>
                    </el-col>
                    <el-col :span="16">
                        <el-card class="orgcard">
                            <div slot="header" class="clearfix">
                                <span>组织详细信息</span>
                            </div>
                            <div>
                                <el-form :model="OrgDetail" size="small" labelWidth="110px">
                                    <el-form-item label="部门编码：">
                                        <span>{{ OrgDetail.deptCode }}</span>
                                    </el-form-item>
                                    <el-form-item label="部门名称：">
                                        <span v-if="update">{{ OrgDetail.deptName }}</span>
                                        <el-input v-else v-model="OrgDetail.deptName" />
                                    </el-form-item>
                                    <el-form-item label="上级部门：">
                                        <span>{{ OrgDetail.parentName }}</span>
                                    </el-form-item>
                                    <el-form-item label="生产调度员：">
                                        <span v-if="update">{{ OrgDetail.dispatchMan }}</span>
                                        <el-input v-else v-model="OrgDetail.dispatchMan" />
                                    </el-form-item>
                                    <el-form-item label="部门类型：">
                                        <span v-if="update">{{ OrgDetail.deptTypeName }}</span>
                                        <el-select v-else v-model="OrgDetail.deptType">
                                            <el-option v-for="(item, index) in dictList" :key="index" :label="item.value" :value="item.code" />
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item v-if="OrgDetail.deptType === 'proLine'" label="产线属性：">
                                        <span v-if="update">{{ OrgDetail.properties }}</span>
                                        <el-select v-else v-model="OrgDetail.properties" placeholder="请选择部门类型" style="width: 100%;">
                                            <el-option label="普通产线" value="普通产线" />
                                            <el-option label="二合一&礼盒产线" value="二合一&礼盒产线" />
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item v-if="OrgDetail.deptType === 'proLine'" label="成本中心：">
                                        <span v-if="update">{{ OrgDetail.costCenter }}</span>
                                        <el-input v-else v-model="OrgDetail.costCenter" autoComplete="off" />
                                    </el-form-item>
                                    <el-form-item v-if="OrgDetail.deptType === 'proLine'" label="产线图片：">
                                        <img v-if="update" :src="'data:image/gif;base64,' + OrgDetail.img" alt="" class="pkgImg">
                                        <el-upload v-else :action="FILE_API" :limit="1" :httpRequest="httpRequest" :headers="heads" listType="picture" :fileList="fileList" :onSuccess="addfile2">
                                            <el-button size="small" type="primary">
                                                选取文件
                                            </el-button>
                                        </el-upload>
                                    </el-form-item>
                                    <el-form-item label="联系人：">
                                        <span v-if="update">{{ OrgDetail.lxr }}</span>
                                        <el-input v-else v-model="OrgDetail.lxr" />
                                    </el-form-item>
                                    <el-form-item label="电话：">
                                        <span v-if="update">{{ OrgDetail.phone }}</span>
                                        <el-input v-else v-model="OrgDetail.phone" />
                                    </el-form-item>
                                    <el-form-item label="备注：">
                                        <span v-if="update">{{ OrgDetail.remark }}</span>
                                        <el-input v-else v-model="OrgDetail.remark" type="textarea" />
                                    </el-form-item>
                                    <div style="text-align: center; margin-top: 30px;">
                                        <el-button v-if="update && isAuth('sys:dept:update')" type="primary" size="small" @click="update = !update">
                                            编辑
                                        </el-button>
                                        <el-button v-if="isAuth('sys:dept:update')" type="primary" size="small" @click="savedatail">
                                            保存
                                        </el-button>
                                        <el-button v-if="isAuth('sys:dept:delete')" type="danger" size="small" @click="deleteorg">
                                            删除
                                        </el-button>
                                    </div>
                                </el-form>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-dialog id="adddepform" :closeOnClickModal="false" :visible.sync="dialogFormVisible1" :title="sibling ? '新增同级' : '新增下级'" @close="clearForm('addDep')">
                    <el-form :model="addDep" size="small" labelPosition="left" labelWidth="100px">
                        <el-form-item label="部门编号：">
                            <el-input v-model="addDep.deptCode" autoComplete="off" />
                        </el-form-item>
                        <el-form-item label="部门名称：">
                            <el-input v-model="addDep.deptName" autoComplete="off" />
                        </el-form-item>
                        <el-form-item label="上级部门：">
                            <span v-if="sibling">{{ addDep.parentName }}</span>
                            <span v-if="!sibling">{{ addDep.parentName }}</span>
                        </el-form-item>
                        <el-form-item label="生产调度员：">
                            <el-input v-model="addDep.dispatchMan" />
                        </el-form-item>
                        <el-form-item label="部门类型：">
                            <el-select v-model="addDep.deptType" placeholder="请选择部门类型" style="width: 100%;">
                                <el-option v-for="(item, index) in dictList" :key="index" :label="item.value" :value="item.code" />
                            </el-select>
                        </el-form-item>
                        <el-form-item v-if="addDep.deptType == 'proLine'" label="产线属性：">
                            <el-select v-model="addDep.properties" placeholder="请选择产线属性" style="width: 100%;">
                                <el-option label="普通产线" value="普通产线" />
                                <el-option label="二合一&礼盒产线" value="二合一&礼盒产线" />
                            </el-select>
                        </el-form-item>
                        <el-form-item v-if="addDep.deptType == 'proLine'" label="成本中心：">
                            <el-input v-model="addDep.costCenter" autoComplete="off" />
                        </el-form-item>
                        <el-form-item v-if="addDep.deptType == 'proLine'" label="产线图片：">
                            <el-upload :action="FILE_API" :limit="1" :httpRequest="httpRequest" listType="picture" :headers="heads" :onSuccess="addfileaddfile">
                                <el-button size="small" type="primary">
                                    选取文件
                                </el-button>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="联系人：">
                            <el-input v-model="addDep.lxr" autoComplete="off" />
                        </el-form-item>
                        <el-form-item label="电话：">
                            <el-input v-model="addDep.phone" autoComplete="off" />
                        </el-form-item>
                        <el-form-item label="备注：">
                            <el-input v-model="addDep.remark" type="textarea" />
                        </el-form-item>
                        <div style="text-align: center;">
                            <el-button @click="addOrg">
                                保存
                            </el-button>
                            <el-button @click="closethis">
                                关闭
                            </el-button>
                        </div>
                    </el-form>
                </el-dialog>
                <ul v-show="menuVisible" id="menu">
                    <li
                        class="menuli"
                        @click="
                            dialogFormVisible1 = true;
                            sibling = true;
                            addDep.parentName = clickTreeNode.parentName;"
                    >
                        新增同级
                    </li>
                    <li
                        class="menuli"
                        @click="
                            dialogFormVisible1 = true;
                            sibling = false;
                            addDep.parentName = clickTreeNode.deptName;"
                    >
                        新增下级
                    </li>
                </ul>
            </el-card>
        </div>
    </el-col>
</template>

<script>
import { BASICDATA_API, SYSTEMSETUP_API, MAIN_API } from '@/api/api';
export default {
    name: 'Index',
    components: {},
    data() {
        return {
            FILE_API: '',
            filterText: '',
            form: {},
            adddepform: {
                name: ''
            },
            row: {},
            arrList: [],
            dictList: [],
            fileList: [{}],
            menuVisible: false,
            orgid: null,
            dialogFormVisible1: false,
            dialogFormVisible2: false,
            dialogFormVisible3: false,
            dialogFormVisible4: false,
            dialogFormVisible5: false,
            heads: [],
            sibling: true,
            update: true,
            OrgTree: [],
            OrgDetail: {},
            addDep: {},
            clickTreeNode: {},
            submitType: true,
            fileReader: {}
        };
    },
    computed: {},
    watch: {
        filterText(val) {
            this.$refs.tree2.filter(val);
        }
    },
    mounted() {
        this.fileReader = new FileReader();
        this.FILE_API = MAIN_API.FILE_API;
        document.addEventListener('click', e => {
            if (e.target.className !== 'menuli') this.menuVisible = false;
        });
        this.heads = { token: this.$cookie.get('token') };
        this.getTree(true);
        this.getDictList();
    },
    ready() {
        document.addEventListener('click', e => {
            if (!this.$el.contains(e.target)) this.menuVisible = false;
        });
    },
    methods: {
        httpRequest(options) {
            const file = options.file;
            if (file) {
                this.fileReader.readAsDataURL(file);
            }
            this.fileReader.onload = () => {
                const base64Str = this.fileReader.result;
                // this.$http(this.FILE_API, 'POST', {pkgImg: base64Str.split(',')[1]}).then(res => {
                //   options.onSuccess(res, file)
                // }).catch(err => {
                //   options.onError(err)
                // })
                options.onSuccess(base64Str.split(',')[1], file);
            };
        },
        // 获取组织结构树
        getTree(type) {
            this.$http(`${BASICDATA_API.ORGSTRUCTURE_API}`, 'GET', {}).then(({ data }) => {
                if (data.code === 0) {
                    this.OrgTree = data.deptList;
                    this.arrList = [this.OrgTree[0].children[0].deptId];
                    if (type) {
                        this.setdetail(this.OrgTree[0].children[0]);
                    }
                } else {
                    this.$error_SHINHO(data.msg);
                }
            });
        },
        // 组织架构参数下拉
        getDictList() {
            this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {
                type: 'dept_type'
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.dictList = data.dicList;
                } else {
                    this.$error_SHINHO(data.msg);
                }
            });
        },
        // 表格自定义序号
        indexMethod(index) {
            return index + 1;
        },
        // 设置组织详情
        setdetail(paras) {
            this.row = paras;
            this.update = true;
            this.$http(`${BASICDATA_API.ORGDETAIL_API}/${paras.deptId}`, 'GET').then(({ data }) => {
                if (data.code === 0) {
                    this.OrgDetail = data.dept;
                    if (this.OrgDetail.img) {
                        this.fileList[0] = {};
                        this.fileList[0].name = '';
                        this.fileList[0].url = 'http://10.8.4.153:50080' + this.OrgDetail.img;
                    } else {
                        this.fileList = [];
                    }
                } else {
                    this.$error_SHINHO(data.msg);
                }
            });
        },
        // 右键菜单 (event, object, value, element)
        showtab1(event, object) {
            this.clickTreeNode = object;
            this.menuVisible = true;
            const menu = document.querySelector('#menu');
            menu.style.left = event.clientX + 'px';
            menu.style.top = event.clientY + 'px';
        },
        // 上传图片
        beforeAvatarUpload(file) {
            const isLt2M = file.size / 1024 / 1024 < 50;
            if (!isLt2M) {
                this.$warningTost('上传文件大小不能超过 10MB!');
            }
            return isLt2M;
        },
        // 上传图片图片回调 新增 (res, file)
        addfile(res) {
            // console.log(res)
            // this.addDep.img = res.picUrl
            this.addDep.img = res;
        },
        // 上传图片回调 修改 (res, file)
        addfile2(res) {
            // console.log(this.fileList)
            // this.OrgDetail.img = res.picUrl
            this.OrgDetail.img = res;
        },
        closethis() {
            this.dialogFormVisible1 = false;
        },
        // 查询
        query() {
            this.setdetail({ deptId: this.form.name });
        },
        // 搜索
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        // 保存
        savedatail() {
            this.$confirm('确认修改部门, 是否继续?', '修改部门', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http(`${BASICDATA_API.SAVEORG_API}`, 'POST', this.OrgDetail).then(({ data }) => {
                    if (data.code === 0) {
                        this.$success_SHINHO('操作成功');
                        this.OrgDetail = {};
                        this.fileList = [{}];
                        this.update = true;
                        this.setdetail(this.row);
                    } else {
                        this.$error_SHINHO(data.msg);
                    }
                });
            });
        },
        //  删除
        deleteorg() {
            this.$confirm('确认删除部门, 是否继续?', '删除部门', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http(`${BASICDATA_API.DELETEORG_API}`, 'GET', {
                    deptId: this.OrgDetail.deptId
                }).then(({ data }) => {
                    if (data.code === 0) {
                        this.$success_SHINHO('操作成功');
                        this.getTree();
                        this.OrgDetail = {};
                    } else {
                        this.$error_SHINHO(data.msg);
                    }
                });
            });
        },
        //  新增
        addOrg() {
            if (this.submitType) {
                this.submitType = false;
                if (this.sibling) {
                    this.addDep.parentId = this.clickTreeNode.parentId;
                } else {
                    this.addDep.parentId = this.clickTreeNode.deptId;
                }
                if (this.addDep.deptType !== 'proLine') {
                    delete this.addDep.fileName;
                    delete this.addDep.proLine;
                    delete this.addDep.picUrl;
                }
                this.$http(`${BASICDATA_API.ADDORG_API}`, 'POST', this.addDep).then(({ data }) => {
                    if (data.code === 0) {
                        this.$success_SHINHO('操作成功');
                        this.getTree();
                        this.addDep = {};
                        this.dialogFormVisible1 = false;
                        this.submitType = true;
                    } else {
                        this.submitType = true;
                        this.$error_SHINHO(data.msg);
                    }
                });
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.pkgImg {
    width: 100px;
    height: 100px;
}
.el-card__header {
    font-size: 14px;
    padding: 13px 20px;
    background-color: #f9f9f9;
    color: black;
    font-weight: 600;
}
.head {
    width: 100%;
    background: white;
    padding: 20px 24px 0;
    h3 {
        font-size: 20px;
        font-weight: 600;
        line-height: 50px;
    }
}
.rightmain {
    flex: 1;
}
#menu {
    cursor: pointer;
    z-index: 99;
    padding: 10px;
    margin: 0;
    list-style: none;
    position: fixed;
    background: white;
    border-radius: 5px;
    box-shadow: 2px 2px 25px 5px rgba(213, 221, 238, 0.45);
    li {
        line-height: 28px;
    }
}
#adddepform {
    .el-form-item {
        margin-bottom: 5px;
    }
}
</style>
<style>
.orgcard .el-card__body {
    height: 450px;
    overflow: auto;
}
.orgcard .el-form-item--mini.el-form-item,
.orgcard .el-form-item--small.el-form-item {
    margin-bottom: 5px;
}
</style>
