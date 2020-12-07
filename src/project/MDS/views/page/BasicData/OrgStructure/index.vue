<template>
    <div class="header_main">
        <mds-card title="组织架构" :name="'org'" :pack-up="false" style="margin-bottom: 0; background: #fff;">
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="org-card" :style="siteContentViewHeight">
                        <div class="org-card_title">
                            组织架构一览
                        </div>
                        <div class="filter-input">
                            <el-input v-model="filterText" placeholder="部门名称" size="small">
                                <em slot="prefix" class="el-input__icon el-icon-search" />
                            </el-input>
                        </div>
                        <div class="tree-main SelfScrollbar">
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
                        </div>
                    </div>
                </el-col>
                <el-col :span="16">
                    <div class="org-card" :style="siteContentViewHeight">
                        <div class="org-card_title">
                            组织详细信息
                        </div>
                        <div class="detail-main SelfScrollbar">
                            <div class="detail-main-form">
                                <el-form ref="orgDetail" class="org-detail-form" :model="orgDetail" size="small" label-width="90px" :rules="dataRules">
                                    <el-form-item label="部门编码：">
                                        <el-input v-model="orgDetail.deptCode" :disabled="true" auto-complete="off" style="width: 250px;" />
                                    </el-form-item>
                                    <el-form-item label="部门名称：" prop="deptName">
                                        <el-input v-model="orgDetail.deptName" :disabled="update" auto-complete="off" style="width: 250px;" />
                                    </el-form-item>
                                    <el-form-item label="上级部门：">
                                        <el-input v-model="orgDetail.parentName" :disabled="true" auto-complete="off" style="width: 250px;" />
                                    </el-form-item>
                                    <el-form-item label="生产调度员：" prop="dispatchMan">
                                        <el-input v-model="orgDetail.dispatchMan" :disabled="update" auto-complete="off" style="width: 250px;" />
                                    </el-form-item>
                                    <el-form-item label="部门类型：">
                                        <el-select v-model="orgDetail.deptType" :disabled="update" style="width: 250px;">
                                            <el-option v-for="(item, index) in dictList" :key="index" :label="item.value" :value="item.code" />
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item v-if="orgDetail.deptType === 'proLine'" label="产线属性：" prop="properties">
                                        <el-select v-model="orgDetail.properties" :disabled="update" placeholder="请选择部门类型" style="width: 250px;">
                                            <el-option label="普通产线" value="普通产线" />
                                            <el-option label="二合一&礼盒产线" value="二合一&礼盒产线" />
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item v-if="orgDetail.deptType === 'proLine'" label="成本中心：" prop="costCenter">
                                        <el-input v-model="orgDetail.costCenter" :disabled="update" auto-complete="off" style="width: 250px;" />
                                    </el-form-item>
                                    <el-form-item v-if="orgDetail.deptType === 'proLine'" label="产线图片：">
                                        <div v-if="orgDetail.img" class="org-img-upload el-upload-list el-upload-list--picture-card" style="display: block; width: 250px;">
                                            <div class="el-upload-list__item is-success avatar">
                                                <img class="flex-img__image avatar" :src="'data:image/gif;base64,' + orgDetail.img">
                                                <label class="el-upload-list__item-status-label">
                                                    <em class="el-icon-upload-success el-icon-check" />
                                                </label>
                                                <span class="el-upload-list__item-actions">
                                                    <span class="el-upload-list__item-delete">
                                                        <em class="el-icon-delete" @click.stop="() => { if (!update) { removeFile() } }" />
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                        <el-upload v-show="!orgDetail.img" ref="orgImgUpload" class="org-img-upload" :show-file-list="false" :action="FILE_API" :disabled="update" :limit="1" :http-request="httpRequest" :on-success="addfile2">
                                            <em class="el-icon-plus avatar-uploader-icon" />
                                        </el-upload>
                                    </el-form-item>
                                    <el-form-item label="联系人：" prop="lxr">
                                        <el-input v-model="orgDetail.lxr" :disabled="update" style="width: 250px;" />
                                    </el-form-item>
                                    <el-form-item label="电话：" prop="phone">
                                        <el-input v-model="orgDetail.phone" :disabled="update" style="width: 250px;" />
                                    </el-form-item>
                                    <el-form-item label="备注：">
                                        <el-input v-model="orgDetail.remark" type="textarea" :disabled="update" style="width: 590px;" />
                                    </el-form-item>
                                </el-form>
                            </div>
                            <div class="org-detail-btn" :class="{'org-detail-btn__fix':mainClientHeight > 500}">
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
                        </div>
                    </div>
                </el-col>
            </el-row>
            <el-dialog id="adddepform" :close-on-click-modal="false" :visible.sync="dialogFormVisible" :title="sibling ? '新增同级' : '新增下级'" @close="closeAddOrgForm('addDep')">
                <el-form ref="addDep" :model="addDep" :rules="dataRules" size="small" label-position="left" label-width="125px" style="padding-bottom: 20px;">
                    <el-form-item label="部门编号：" prop="deptCode" :inline-message="true">
                        <el-input v-model="addDep.deptCode" placeholder="格式：ABC123456" auto-complete="off" />
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
                        <el-button size="small" @click="openAddOrgFrom('addDep')">
                            保存
                        </el-button>
                        <el-button size="small" @click="closeAddOrgForm('addDep')">
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
        </mds-card>
    </div>
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
                    { required: true, message: '请输入编号（大写字母+数字）', trigger: 'blur' }
                    // { type: 'number', message: '必须为数字值' }
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
    computed: {
        mainClientHeight: {
            get() {
                return this.$store.state.common.mainClientHeight;
            }
        },
        siteContentViewHeight: {
            get() {
                const height = this.mainClientHeight - 54;
                return { height: height + 'px' };
            }
        }
    },
    watch: {
        filterText(val) {
            this.$refs.tree2.filter(val);
        },
        'addDep.deptCode'() {
            this.addDep.deptCode = this.addDep.deptCode.replace(/[^0-9A-Z]/g, '');
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

<style scoped lang="scss">
    .org-card {
        position: relative;
        display: flex;
        flex-direction: column;
        height: 500px;
        overflow: hidden;
        border: 1px solid rgba(232, 232, 232, 1);
        border-radius: 4px;
        box-shadow: 3px 3px 5px 0 rgba(0, 0, 0, 0.09);

        ::v-deep .el-tree-node__expand-icon { /* stylelint-disable-line */
            color: #487bff;
        }
        ::v-deep .el-tree-node__expand-icon.is-leaf { /* stylelint-disable-line */
            color: transparent;
        }

        .org-card_title {
            height: 40px;
            padding-left: 10px;
            color: white;
            line-height: 40px;
            background: rgba(72, 123, 255, 1);
        }

        .filter-input {
            padding: 6px 10px;
        }

        .tree-main {
            flex: 1;
            overflow-y: scroll;
        }
        .detail-main {
            padding: 16px 10px 0 10px;
            overflow-y: scroll;
        }
    }
</style>
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
// .el-form-item {
//     float: left;
// }
.el-upload-list {
    .avatar {
        display: block;
        width: 58px;
        height: 58px;
    }
}

.org-img-upload {
    width: 250px;
    height: 58px;
    text-align: left;

    ::v-deep .el-upload {/* stylelint-disable-line */
        position: relative;
        overflow: hidden;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
    }
    ::v-deep .el-upload:hover {/* stylelint-disable-line */
        border-color: #409eff;
    }
    ::v-deep .avatar-uploader-icon {/* stylelint-disable-line */
        width: 58px;
        height: 58px;
        color: #8c939d;
        font-size: 28px;
        line-height: 58px;
        text-align: center;
    }

    ::v-deep .avatar {/* stylelint-disable-line */
        display: block;
        width: 58px;
        height: 58px;
    }
    ::v-deep .el-upload--picture-card {/* stylelint-disable-line */
        width: 60px;
        height: 60px;
        line-height: 70px;
    }

    ::v-deep .el-upload-list--picture-card .el-upload-list__item {/* stylelint-disable-line */
        width: 60px;
        height: 60px;
    }
}

.limit-upload {
    ::v-deep .el-upload--picture-card {/* stylelint-disable-line */
        display: none;
    }
}

.org-card {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 500px;
    overflow: hidden;
    border: 1px solid rgba(232, 232, 232, 1);
    border-radius: 4px;
    box-shadow: 3px 3px 5px 0 rgba(0, 0, 0, 0.09);

    ::v-deep .el-tree-node__expand-icon {/* stylelint-disable-line */
        color: #487bff;
    }

    .org-card_title {
        height: 40px;
        padding-left: 10px;
        color: white;
        line-height: 40px;
        background: rgba(72, 123, 255, 1);
    }

    .filter-input {
        padding: 6px 10px;
    }

    .tree-main {
        flex: 1;
        overflow-y: scroll;
    }

    .detail-main {
        padding-top: 20px;

        .detail-main-form {
            margin: auto;
        }

        .org-detail-form {
            display: flex;
            flex-flow: row wrap;
            min-width: 700px;
            margin: auto;
            text-align: center;
        }
    }

    .org-detail-btn {
        float: right;
        padding-bottom: 10px;
    }
    .org-detail-btn__fix {
        position: absolute;
        right: 10px;
        bottom: 10px;
    }
}
</style>
