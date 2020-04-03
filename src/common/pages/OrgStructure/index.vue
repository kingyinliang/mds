<template>
    <div class="header_main">
        <mds-card :title="'组织架构'" :name="'org'" :packUp="false" style="background: #fff;">
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="orgCard">
                        <div class="orgCard_title">
                            组织架构一览
                        </div>
                        <div class="filterInput">
                            <el-input v-model="filterText" placeholder="部门名称" size="small">
                                <i slot="suffix" class="el-input__icon el-icon-search" />
                            </el-input>
                        </div>
                        <div class="treeMain SelfScrollbar">
                            <el-tree ref="tree" :data="OrgTree" nodeKey="deptId" :expandOnClickNode="false" :defaultExpandedKeys="arrList" :filterNodeMethod="filterNode" @node-click="setdetail" @node-contextmenu="showMenu" />
                        </div>
                    </div>
                </el-col>
                <el-col :span="16">
                    <div class="orgCard">
                        <div class="orgCard_title">
                            组织详细信息
                        </div>
                        <div class="detailMain">
                            <div class="detailMainForm">
                                <el-form :model="OrgDetail" size="small" :inline="true" labelWidth="90px" class="orgDetailForm">
                                    <el-form-item label="部门编码：">
                                        <el-input v-model="OrgDetail.deptCode" :disabled="true" autoComplete="off" style="width: 250px;" />
                                    </el-form-item>
                                    <el-form-item label="部门名称：">
                                        <el-input v-model="OrgDetail.deptName" :disabled="true" autoComplete="off" style="width: 250px;" />
                                    </el-form-item>
                                    <el-form-item label="上级部门：">
                                        <el-input v-model="OrgDetail.parentName" :disabled="true" autoComplete="off" style="width: 250px;" />
                                    </el-form-item>
                                    <el-form-item label="生产调度员：">
                                        <el-input v-model="OrgDetail.dispatchMan" :disabled="isRedact" autoComplete="off" style="width: 250px;" />
                                    </el-form-item>
                                    <el-form-item label="部门类型：">
                                        <el-select v-model="OrgDetail.deptType" :disabled="isRedact" style="width: 250px;">
                                            <el-option v-for="(item, index) in dictList" :key="index" :label="item.value" :value="item.code" />
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item v-if="OrgDetail.deptType === 'proLine'" label="产线属性：">
                                        <el-select v-model="OrgDetail.properties" placeholder="请选择部门类型" :disabled="isRedact" style="width: 250px;">
                                            <el-option label="普通产线" value="普通产线" />
                                            <el-option label="二合一&礼盒产线" value="二合一&礼盒产线" />
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item v-if="OrgDetail.deptType === 'proLine'" label="成本中心：">
                                        <el-input v-model="OrgDetail.costCenter" autoComplete="off" :disabled="isRedact" style="width: 250px;" />
                                    </el-form-item>
                                    <el-form-item v-if="OrgDetail.deptType === 'proLine'" label="产线图片：" :class="{'limitUpload': fileList.length}">
                                        <el-upload class="orgImgUpload" listType="picture-card" :action="FILE_API" :limit="1" :httpRequest="httpRequest" :fileList="fileList" :onSuccess="addfile" :onRemove="removeFile" :onPreview="handlePictureCardPreview">
                                            <i class="el-icon-plus" />
                                        </el-upload>
                                    </el-form-item>
                                    <el-form-item label="联系人：">
                                        <el-input v-model="OrgDetail.lxr" :disabled="isRedact" style="width: 250px;" />
                                    </el-form-item>
                                    <el-form-item label="电话：">
                                        <el-input v-model="OrgDetail.phone" :disabled="isRedact" style="width: 250px;" />
                                    </el-form-item>
                                    <el-form-item label="备注：">
                                        <el-input v-model="OrgDetail.remark" type="textarea" :disabled="isRedact" style="width: 590px;" />
                                    </el-form-item>
                                </el-form>
                            </div>
                            <div class="orgDetailBtn">
                                <el-button type="primary" size="small" @click="isRedact = !isRedact">
                                    {{ isRedact? '编辑' : '取消' }}
                                </el-button>
                                <el-button v-if="!isRedact" type="primary" size="small" @click="savedatail">
                                    保存
                                </el-button>
                                <el-button v-if="!isRedact" type="danger" size="small" @click="deleteorg">
                                    删除
                                </el-button>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </mds-card>
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" style="margin-bottom: 20px;">
        </el-dialog>
        <el-dialog id="adddepform" width="400px" :closeOnClickModal="false" :visible.sync="dialogFormVisible1" :title="sibling ? '新增同级' : '新增下级'">
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
                    <el-upload :action="FILE_API" :limit="1" :httpRequest="httpRequest" listType="picture" :onSuccess="DeptAddfile">
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
                    <el-button @click="dialogFormVisible1 = false">
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
    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { BASICDATA_API, SYSTEMSETUP_API, MAIN_API } from '@/api/api';

@Component
export default class OrgStructure extends Vue {
    $refs: {tree: HTMLFormElement}
    filterText = ''
    FILE_API = ''
    dialogImageUrl = ''
    fileList: FileObject[] = []
    OrgTree: object[] = []
    sibling = true
    menuVisible = false
    dialogVisible = false
    dialogFormVisible1 = false
    isRedact = true
    arrList: string[] = []
    OrgDetail: DetailObject = {}
    addDep: DetailObject = {}
    clickTreeNode: DetailObject = {}
    dictList: object[] = []

    @Watch('filterText')
    onChangeValue(newVal: string) {
        this.$refs.tree.filter(newVal);
    }

    mounted() {
        this.FILE_API = MAIN_API.FILE_API;
        this.getTree(true);
        this.getDictList();
        document.addEventListener('click', e => {
            const target: Node = e.target as Node
            if (target['className'] !== 'menuli') this.menuVisible = false;
        });
    }

    // 获取组织结构树
    getTree(type = false) {
        this.$http(`${BASICDATA_API.ORGSTRUCTURE_API}`, 'GET', {}).then(({ data }) => {
            if (data.code === 0) {
                this.OrgTree = data.deptList;
                this.arrList = [this.OrgTree[0]['children'][0]['deptId']];
                if (type) {
                    console.log(1)
                }
            } else {
                this.$errorToast(data.msg);
            }
        });
    }

    // 展示详情
    setdetail(row: DeptObject) {
        this.menuVisible = false;
        this.$http(`${BASICDATA_API.ORGDETAIL_API}/${row.deptId}`, 'GET').then(({ data }) => {
            if (data.code === 0) {
                this.OrgDetail = data.dept;
                if (this.OrgDetail.img) {
                    this.fileList = []
                    this.fileList[0] = {};
                    this.fileList[0].name = '';
                    this.fileList[0].url = 'data:image/gif;base64,' + this.OrgDetail.img;
                } else {
                    this.fileList = [];
                }
            } else {
                this.$errorToast(data.msg);
            }
        })
    }

    // 右键菜单
    showMenu(event, object) {
        this.clickTreeNode = object;
        this.menuVisible = true;
        const menu = document.querySelector('#menu') as HTMLDivElement;
        menu.style.left = event.clientX + 'px';
        menu.style.top = event.clientY + 'px';
    }

    // 获取部门类型
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
    }

    // 新增部门
    addOrg() {
        if (this.sibling) {
            this.addDep.parentId = this.clickTreeNode.parentId;
        } else {
            this.addDep.parentId = this.clickTreeNode.deptId;
        }
        this.$http(`${BASICDATA_API.ADDORG_API}`, 'POST', this.addDep).then(({ data }) => {
            if (data.code === 0) {
                this.$successToast('操作成功');
                this.getTree();
                this.addDep = {};
                this.dialogFormVisible1 = false;
            } else {
                this.$errorToast(data.msg);
            }
        });
    }

    // 保存详情
    savedatail() {
        this.$confirm('确认修改部门, 是否继续?', '修改部门', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.$http(`${BASICDATA_API.SAVEORG_API}`, 'POST', this.OrgDetail).then(({ data }) => {
                if (data.code === 0) {
                    this.$successToast('操作成功');
                    this.fileList = [];
                    this.isRedact = true;
                    this.setdetail({ deptId: this.OrgDetail.deptId });
                } else {
                    this.$errorToast(data.msg);
                }
            });
        });
    }

    // 删除
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
                    this.$successToast('操作成功');
                    this.getTree();
                    this.OrgDetail = {};
                } else {
                    this.$errorToast(data.msg);
                }
            });
        });
    }

    // 上传图片前
    httpRequest(options) {
        const fileReader = new FileReader();
        const file = options.file;
        if (file) {
            fileReader.readAsDataURL(file);
        }
        fileReader.onload = () => {
            const base64Str = fileReader.result as string;
            options.onSuccess(base64Str.split(',')[1], file);
        };
    }

    // 上传图片后
    addfile(res) {
        this.fileList = []
        this.fileList[0] = {};
        this.fileList[0].name = '';
        this.fileList[0].url = 'data:image/gif;base64,' + res;
        this.OrgDetail.img = res;
    }

    DeptAddfile(res) {
        this.addDep.img = res;
    }

    // 移出图片
    removeFile() {
        this.fileList = []
    }

    // 查看图片
    handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
    }

    // 搜索
    filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
    }
}

interface DeptObject {
    deptId?: string;
}
interface DetailObject {
    deptId?: string;
    parentId?: string;
    deptName?: string;
    parentName?: string;
    img? : string;
}
interface FileObject {
    name?: string;
    url? : string;
}
</script>

<style scoped lang="scss">
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

.orgCard {
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

    .orgCard_title {
        height: 40px;
        padding-left: 10px;
        color: white;
        line-height: 40px;
        background: rgba(72, 123, 255, 1);
    }

    .filterInput {
        padding: 6px 10px;
    }

    .treeMain {
        flex: 1;
        overflow-y: scroll;
    }

    .detailMain {
        padding-top: 44px;

        .detailMainForm {
            margin: auto;
        }

        .orgDetailForm {
            min-width: 700px;
            margin: auto;
            text-align: center;

            .el-form-item {
                /* float: left; */
            }

            .orgImgUpload {
                width: 250px;
                height: 48px;

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

            .limitUpload {
                ::v-deep .el-upload--picture-card {/* stylelint-disable-line */
                    display: none;
                }
            }
        }
    }

    .orgDetailBtn {
        position: absolute;
        right: 10px;
        bottom: 10px;
    }
}
</style>
