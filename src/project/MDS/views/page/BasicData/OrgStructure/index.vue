<template>
    <el-col>
        <el-card class="main">
            <el-row :gutter="20">
                <div style="margin-bottom: 10px; padding-left: 10px;">
                    <el-input v-model="filterText" placeholder="部门名称" size="small" style="width: 300px;">
                        <i slot="prefix" class="el-input__icon el-icon-search" />
                    </el-input>
                </div>
                <el-col :span="8">
                    <el-card id="orgcard" class="orgcard">
                        <div slot="header" class="clearfix">
                            <span>组织架构一览</span>
                        </div>
                        <el-tree
                            v-if="isAuth('sys:dept:save')"
                            ref="tree2"
                            :data="orgTree"
                            node-key="deptId"
                            :default-expanded-keys="arrList"
                            :filter-node-method="filterNode"
                            :expand-on-click-node="false"
                            :current-node-key="2"
                            @node-contextmenu="showmMenuFromRightClick"
                            @node-click="showOrgDetail"
                        />
                        <el-tree v-else ref="tree2" :data="OrgTree" node-key="deptId" :default-expanded-keys="arrList" :filter-node-method="filterNode" :expand-on-click-node="false" @node-click="showOrgDetail" />
                    </el-card>
                </el-col>
                <el-col :span="16">
                    <el-card class="orgcard">
                        <div slot="header" class="clearfix">
                            <span>组织详细信息</span>
                        </div>
                        <div>
                            <el-form ref="orgDetail" :model="orgDetail" size="small" label-width="150px" :rules="dataRules" :inline-message="true">
                                <el-form-item label="部门编码：">
                                    <span>{{ orgDetail.deptCode }}</span>
                                </el-form-item>
                                <el-form-item label="部门名称：" prop="deptName">
                                    <span v-if="update">{{ orgDetail.deptName }}</span>
                                    <el-input v-else v-model="orgDetail.deptName" />
                                </el-form-item>
                                <el-form-item label="上级部门：">
                                    <span>{{ orgDetail.parentName }}</span>
                                </el-form-item>
                                <el-form-item label="生产调度员：" prop="dispatchMan">
                                    <span v-if="update">{{ orgDetail.dispatchMan }}</span>
                                    <el-input v-else v-model="orgDetail.dispatchMan" />
                                </el-form-item>
                                <el-form-item label="部门类型：">
                                    <span v-if="update">{{ orgDetail.deptTypeName }}</span>
                                    <el-select v-else v-model="orgDetail.deptType">
                                        <el-option v-for="(item, index) in dictList" :key="index" :label="item.value" :value="item.code" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item v-if="orgDetail.deptType === 'proLine'" label="产线属性：" prop="properties">
                                    <span v-if="update">{{ orgDetail.properties }}</span>
                                    <el-select v-else v-model="orgDetail.properties" placeholder="请选择部门类型" style="width: 100%;">
                                        <el-option label="普通产线" value="普通产线" />
                                        <el-option label="二合一&礼盒产线" value="二合一&礼盒产线" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item v-if="orgDetail.deptType === 'proLine'" label="成本中心：" prop="costCenter">
                                    <span v-if="update">{{ orgDetail.costCenter }}</span>
                                    <el-input v-else v-model="orgDetail.costCenter" auto-complete="off" />
                                </el-form-item>
                                <el-form-item v-if="orgDetail.deptType === 'proLine'" label="产线图片：">
                                    <img v-if="update" :src="'data:image/gif;base64,' + orgDetail.img" alt="" class="pkgImg">
                                    <el-upload v-else :action="FILE_API" :limit="1" :http-request="httpRequest" :headers="heads" list-type="picture" :file-list="fileList" :on-success="addfile2">
                                        <el-button size="small" type="primary">
                                            选取文件
                                        </el-button>
                                    </el-upload>
                                </el-form-item>
                                <el-form-item label="联系人：" prop="lxr">
                                    <span v-if="update">{{ orgDetail.lxr }}</span>
                                    <el-input v-else v-model="orgDetail.lxr" />
                                </el-form-item>
                                <el-form-item label="电话：" prop="phone">
                                    <span v-if="update">{{ orgDetail.phone }}</span>
                                    <el-input v-else v-model="orgDetail.phone" />
                                </el-form-item>
                                <el-form-item label="备注：">
                                    <span v-if="update">{{ orgDetail.remark }}</span>
                                    <el-input v-else v-model="orgDetail.remark" type="textarea" />
                                </el-form-item>
                                <div style=" margin-top: 30px; text-align: center;">
                                    <el-button v-show="update && isAuth('sys:dept:update')" type="primary" size="small" @click="update = !update">
                                        编辑
                                    </el-button>
                                    <el-button v-if="!update && isAuth('sys:dept:update')" type="primary" size="small" @click="saveOrgDatail('orgDetail')">
                                        保存
                                    </el-button>
                                    <el-button v-if="isAuth('sys:dept:delete')" type="danger" size="small" @click="deleteOrgDetail">
                                        删除
                                    </el-button>
                                </div>
                            </el-form>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <el-dialog id="adddepform" :close-on-click-modal="false" :visible.sync="dialogFormVisible" :title="sibling ? '新增同级' : '新增下级'" @close="closeAddOrgForm('addDep')">
                <el-form ref="addDep" :model="addDep" :rules="dataRules" size="small" label-position="left" label-width="125px">
                    <el-form-item label="部门编号：" prop="deptCode" :inline-message="true">
                        <el-input v-model.number="addDep.deptCode" auto-complete="off" />
                    </el-form-item>
                    <el-form-item label="部门名称：" prop="deptName">
                        <el-input v-model="addDep.deptName" auto-complete="off" />
                    </el-form-item>
                    <el-form-item label="上级部门：">
                        <span v-if="sibling">{{ addDep.parentName }}</span>
                        <span v-if="!sibling">{{ addDep.parentName }}</span>
                    </el-form-item>
                    <el-form-item label="生产调度员：" prop="dispatchMan">
                        <el-input v-model="addDep.dispatchMan" />
                    </el-form-item>
                    <el-form-item label="部门类型：" prop="deptType">
                        <el-select v-model="addDep.deptType" placeholder="请选择部门类型" style="width: 100%;">
                            <el-option v-for="(item, index) in dictList" :key="index" :label="item.value" :value="item.code" />
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="addDep.deptType == 'proLine'" label="产线属性：" prop="propertie">
                        <el-select v-model="addDep.properties" placeholder="请选择产线属性" style="width: 100%;" prop="properties">
                            <el-option label="普通产线" value="普通产线" />
                            <el-option label="二合一&礼盒产线" value="二合一&礼盒产线" />
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="addDep.deptType == 'proLine'" label="成本中心：" prop="costCenter">
                        <el-input v-model="addDep.costCenter" auto-complete="off" />
                    </el-form-item>
                    <el-form-item v-if="addDep.deptType == 'proLine'" label="产线图片：">
                        <el-upload :action="FILE_API" :limit="1" :http-request="httpRequest" list-type="picture" :headers="heads" :on-success="addfile">
                            <el-button size="small" type="primary">
                                选取文件
                            </el-button>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="联系人：" prop="lxr">
                        <el-input v-model="addDep.lxr" auto-complete="off" />
                    </el-form-item>
                    <el-form-item label="电话：" prop="phone">
                        <el-input v-model="addDep.phone" auto-complete="off" />
                    </el-form-item>
                    <el-form-item label="备注：">
                        <el-input v-model="addDep.remark" type="textarea" />
                    </el-form-item>
                    <div style="text-align: center;">
                        <el-button @click="openAddOrgFrom('addDep')">
                            保存
                        </el-button>
                        <el-button @click="closeAddOrgForm('addDep')">
                            关闭
                        </el-button>
                    </div>
                </el-form>
            </el-dialog>
            <ul v-show="menuVisible" id="menu">
                <li
                    v-if="isAddSibling"
                    class="menuli"
                    @click="
                        dialogFormVisible = true;
                        sibling = true;
                        menuVisible = false;"
                >
                    新增同级
                </li>
                <li
                    v-if="isAddChildren"
                    class="menuli"
                    @click="
                        dialogFormVisible = true;
                        sibling = false;
                        menuVisible = false;
                        addDep.parentName = clickTreeNode.deptName;"
                >
                    新增下级
                </li>
            </ul>
        </el-card>
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
            dialogFormVisible: false,
            heads: [],
            sibling: true,
            update: true,
            orgTree: [],
            orgDetail: {},
            addDep: {},
            clickTreeNode: {},
            fileReader: {},
            dataRules: {
                deptCode: [
                    { required: true, message: '请输入编号', trigger: 'blur' },
                    { type: 'number', message: '必须为数字值' }
                ],
                deptName: [
                    { required: true, message: '请输入部门名称', trigger: 'blur' }
                ],
                dispatchMan: [
                ],
                deptType: [
                    { required: true, message: '请选择部门类型', trigger: 'change' }
                ],
                properties: [
                ],
                costCenter: [
                ]
            },
            isAddSibling: true,
            isAddChildren: true
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
        this.getOrgTree(true);
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
        getOrgTree(type) {
            this.$http(`${BASICDATA_API.ORGSTRUCTURE_API}`, 'GET', {}).then(({ data }) => {
                if (data.code === 0) {
                    this.orgTree = data.deptList;
                    this.arrList = [this.orgTree[0].children[0].deptId];
                    if (type) {
                        this.showOrgDetail(this.orgTree[0].children[0]);
                    }
                } else {
                    this.$errorToast(data.msg);
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
                    this.$errorToast(data.msg);
                }
            });
        },
        // 表格自定义序号
        indexMethod(index) {
            return index + 1;
        },
        // 设置组织详情
        showOrgDetail(paras) {
            this.menuVisible = false; // 关闭选单
            this.row = paras;
            this.update = true;
            this.$http(`${BASICDATA_API.ORGDETAIL_API}/${paras.deptId}`, 'GET').then(({ data }) => {
                if (data.code === 0) {
                    this.orgDetail = data.dept;
                    if (this.orgDetail.img) {
                        this.fileList[0] = {};
                        this.fileList[0].name = '';
                        this.fileList[0].url = 'http://10.8.4.153:50080' + this.orgDetail.img;
                    } else {
                        this.fileList = [];
                    }
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 右键菜单 (event, object, value, element)
        showmMenuFromRightClick(event, object, target) {
            if (target.parent.id !== 0) {
                this.isAddSibling = true
            } else {
                this.isAddSibling = false
            }
            this.clickTreeNode = object;
            this.menuVisible = true;
            const menu = document.querySelector('#menu');
            menu.style.left = event.clientX + 'px';
            menu.style.top = event.clientY + 'px';
            this.addDep.parentName = target.parent.label;
        },
        // 上传图片
        beforeAvatarUpload(file) {
            const isLt2M = file.size / 1024 / 1024 < 50;
            if (!isLt2M) {
                this.$warningToast('上传文件大小不能超过 10MB!');
            }
            return isLt2M;
        },
        // 上传图片图片回调 新增 (res, file)
        addfile(res) {
            this.addDep.img = res;
        },
        // 上传图片回调 修改 (res, file)
        addfile2(res) {
            this.orgDetail.img = res;
        },
        // 关闭新增选单
        closeAddOrgForm(formName) {
            this.dialogFormVisible = false;
            this.$refs[formName].resetFields();
        },
        // 查询
        query() {
            this.showOrgDetail({ deptId: this.form.name });
        },
        // 搜索
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        // 保存
        saveOrgDatail(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$confirm('确认修改部门, 是否继续?', '修改部门', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$http(`${BASICDATA_API.SAVEORG_API}`, 'POST', this.orgDetail).then(({ data }) => {
                            if (data.code === 0) {
                                this.$successToast('操作成功');
                                this.orgDetail = {};
                                this.fileList = [{}];
                                this.update = true;
                                this.showOrgDetail(this.row);
                            } else {
                                this.$errorToast(data.msg);
                            }
                        });
                    }).catch(() => {
                        // this.$infoToast('已取消删除');
                    });
                } else {
                    return false;
                }
            });
        },
        //  删除
        deleteOrgDetail() {
            this.$confirm('确认删除部门, 是否继续?', '删除部门', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http(`${BASICDATA_API.DELETEORG_API}`, 'GET', {
                    deptId: this.orgDetail.deptId
                }).then(({ data }) => {
                    if (data.code === 0) {
                        this.$successToast('操作成功');
                        this.getOrgTree();
                        this.orgDetail = {};
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            }).catch(() => {
                // this.$infoToast('已取消删除');
            });
        },
        //  新增
        openAddOrgFrom(formName) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
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
                        this.$successToast('操作成功');
                        this.getOrgTree();
                        this.addDep = {}
                        this.dialogFormVisible = false;
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            } else {
                return false;
            }
            });

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
    padding: 13px 20px;
    color: black;
    font-weight: 600;
    font-size: 14px;
    background-color: #f9f9f9;
}
.head {
    width: 100%;
    padding: 20px 24px 0;
    background: white;
    h3 {
        font-weight: 600;
        font-size: 20px;
        line-height: 50px;
    }
}
.rightmain {
    flex: 1;
}
#menu {
    position: fixed;
    z-index: 99;
    margin: 0;
    padding: 10px;
    list-style: none;
    background: white;
    border-radius: 5px;
    box-shadow: 2px 2px 25px 5px rgba(213, 221, 238, 0.45);
    cursor: pointer;
    li {
        line-height: 28px;
    }
}
#adddepform {
    .el-form-item {
        margin-bottom: 5px;
    }
}

.orgcard .el-card__body {
    height: 450px;
    overflow: auto;
}
.orgcard .el-form-item--mini.el-form-item,
.orgcard .el-form-item--small.el-form-item {
    margin-bottom: 5px;
}
.el-form-item__error {
    position: absolute;
    top: 30%;
    right: 0;
    bottom: 0;
    left: auto;
    width: 200px;
}
.el-form-item.is-success .el-input__inner {
    border: 1px solid #dcdfe6;
}
</style>
