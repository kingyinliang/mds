<template>
    <div class="header_main">
        <mds-card :title="'组织架构'" :name="'org'" :pack-up="false" style="background: #fff;">
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="org-card">
                        <div class="org-card_title">
                            组织架构一览
                        </div>
                        <div class="filter-input">
                            <el-input v-model="filterText" placeholder="部门名称" size="small">
                                <i slot="suffix" class="el-input__icon el-icon-search" />
                            </el-input>
                        </div>
                        <div class="tree-main SelfScrollbar">
                            <el-tree ref="tree" :data="OrgTree" node-key="id" :props="{ label: 'deptName' }" :expand-on-click-node="false" :default-expanded-keys="arrList" :filter-node-method="filterNode" @node-click="setdetail" @node-contextmenu="showMenu" />
                        </div>
                    </div>
                </el-col>
                <el-col :span="16">
                    <div class="org-card">
                        <div class="org-card_title">
                            组织详细信息
                        </div>
                        <div class="detail-main">
                            <div class="detail-main-form">
                                <el-form :model="OrgDetail" size="small" :inline="true" label-width="90px" class="org-detail-form">
                                    <el-form-item label="部门编码：">
                                        <el-input v-model="OrgDetail.deptCode" :disabled="true" auto-complete="off" style="width: 250px;" />
                                    </el-form-item>
                                    <el-form-item label="部门名称：">
                                        <el-input v-model="OrgDetail.deptName" :disabled="true" auto-complete="off" style="width: 250px;" />
                                    </el-form-item>
                                    <el-form-item label="上级部门：">
                                        <el-input v-model="OrgDetail.parentName" :disabled="true" auto-complete="off" style="width: 250px;" />
                                    </el-form-item>
                                    <el-form-item label="生产调度员：">
                                        <el-input v-model="OrgDetail.dispatchMan" :disabled="isRedact" auto-complete="off" style="width: 250px;" />
                                    </el-form-item>
                                    <el-form-item label="部门类型：">
                                        <el-select v-model="OrgDetail.deptType" :disabled="isRedact" style="width: 250px;">
                                            <el-option v-for="(item, index) in dictList" :key="index" :label="item.dictValue" :value="item.dictCode" />
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item v-if="OrgDetail.deptType === 'PRODUCT_LINE'" label="产线属性：">
                                        <el-select v-model="OrgDetail.properties" placeholder="请选择部门类型" :disabled="isRedact" style="width: 250px;">
                                            <el-option label="普通产线" value="普通产线" />
                                            <el-option label="二合一&礼盒产线" value="二合一&礼盒产线" />
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item v-if="OrgDetail.deptType === 'PRODUCT_LINE'" label="成本中心：">
                                        <el-input v-model="OrgDetail.costCenter" auto-complete="off" :disabled="isRedact" style="width: 250px;" />
                                    </el-form-item>
                                    <el-form-item v-if="OrgDetail.deptType === 'PRODUCT_LINE'" label="产线图片：" :class="{'limit-upload': fileList.length}">
                                        <el-upload class="org-img-upload" list-type="picture-card" :action="FILE_API" :disabled="isRedact" :limit="1" :file-list="fileList" :on-success="addfile" :on-remove="removeFile" :on-preview="handlePictureCardPreview">
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
                            <div class="org-detail-btn">
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
        <el-dialog id="adddepform" width="400px" :close-on-click-modal="false" :visible.sync="dialogFormVisible1" :title="sibling ? '新增同级' : '新增下级'">
            <el-form ref="dataForm" :model="addDep" size="small" label-position="left" label-width="100px">
                <el-form-item label="部门编号：">
                    <el-input v-model="addDep.deptCode" auto-complete="off" />
                </el-form-item>
                <el-form-item label="部门名称：">
                    <el-input v-model="addDep.deptName" auto-complete="off" />
                </el-form-item>
                <el-form-item label="上级部门：">
                    <el-input v-model="addDep.parentName" disabled />
                </el-form-item>
                <el-form-item label="生产调度员：">
                    <el-input v-model="addDep.dispatchMan" />
                </el-form-item>
                <el-form-item label="部门类型：">
                    <el-select v-model="addDep.deptType" placeholder="请选择部门类型" style="width: 100%;">
                        <el-option v-for="(item, index) in dictList" :key="index" :label="item.dictValue" :value="item.dictCode" />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="addDep.deptType == 'PRODUCT_LINE'" label="产线属性：">
                    <el-select v-model="addDep.properties" placeholder="请选择产线属性" style="width: 100%;">
                        <el-option label="普通产线" value="普通产线" />
                        <el-option label="二合一&礼盒产线" value="二合一&礼盒产线" />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="addDep.deptType == 'PRODUCT_LINE'" label="成本中心：">
                    <el-input v-model="addDep.costCenter" auto-complete="off" />
                </el-form-item>
                <el-form-item v-if="addDep.deptType == 'PRODUCT_LINE'" label="产线图片：" :class="{'limit-upload': fileList.length}">
                    <div style="text-align: center;">
                        <el-upload class="org-img-upload" list-type="picture-card" :action="FILE_API" :limit="1" :http-request="httpRequest" :file-list="fileList" :on-success="addfile" :on-remove="removeFile" :on-preview="handlePictureCardPreview">
                            <i class="el-icon-plus" />
                        </el-upload>
                    </div>
                </el-form-item>
                <el-form-item label="联系人：">
                    <el-input v-model="addDep.lxr" auto-complete="off" />
                </el-form-item>
                <el-form-item label="电话：">
                    <el-input v-model="addDep.phone" auto-complete="off" />
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input v-model="addDep.remark" type="textarea" />
                </el-form-item>
                <div style="text-align: center;">
                    <el-button @click="addOrg">
                        保存
                    </el-button>
                    <el-button @click="dialogFormVisible1 = false;">
                        关闭
                    </el-button>
                </div>
            </el-form>
        </el-dialog>
        <ul v-show="menuVisible" id="menu">
            <li
                class="menuli"
                @click="menuClick(true, clickTreeNode.parentName, clickTreeNode.parentId)"
            >
                新增同级
            </li>
            <li
                class="menuli"
                @click="menuClick(false, clickTreeNode.deptName, clickTreeNode.id)"
            >
                新增下级
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { COMMON_API } from 'common/api/api';
import { generateUuid } from 'utils/utils';
import axios from 'axios';

@Component
export default class OrgStructure extends Vue {
    $refs: {
        tree: HTMLFormElement;
        dataForm: HTMLFormElement;
    };

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
        COMMON_API.UPLOADFILE_API({
            name: generateUuid(32, 62)
        }).then(({ data }) => {
            if (data.code === 200) {
                this.FILE_API = data.data.url
            }
        });
        this.getTree(true);
        this.getDictList();
        document.addEventListener('click', e => {
            const target: Node = e.target as Node
            if (target['className'] !== 'menuli') this.menuVisible = false;
        });
    }

    // 获取组织结构树
    getTree(type = false) {
        COMMON_API.ORGSTRUCTURE_API({
            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id
        }).then(({ data }) => {
            if (data.code === 200) {
                this.OrgTree = data.data;
                this.arrList = [this.OrgTree[0]['children'][0]['id']];
                if (type) {
                    console.log(1)
                }
            }
        });
    }

    // 展示详情
    setdetail(row: DeptObject) {
        this.menuVisible = false;
        COMMON_API.ORGDETAIL_API({
            id: row.id
        }).then(({ data }) => {
            if (data.code === 200) {
                this.OrgDetail = data.data;
                if (this.OrgDetail.imgUrl) {
                    this.fileList = []
                    this.fileList[0] = {};
                    this.fileList[0].name = '';
                    this.fileList[0].url = 'data:image/gif;base64,' + this.OrgDetail.imgUrl;
                } else {
                    this.fileList = [];
                }
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

    menuClick(sibling, parentName, parentId) {
        this.dialogFormVisible1 = true;
        setTimeout(() => {
            this.addDep = {}
            this.fileList = []
            this.sibling = sibling;
            this.addDep.parentName = parentName;
            this.addDep.parentId = parentId;
        }, 100)
    }

    // 获取部门类型
    getDictList() {
        COMMON_API.DICTQUERY_API({
            dictType: 'COMMON_DEPT_TYPE'
        }).then(({ data }) => {
            if (data.code === 200) {
                this.dictList = data.data;
            }
        });
    }

    // 新增部门
    addOrg() {
        this.addDep.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
        COMMON_API.ADDORG_API(this.addDep).then(({ data }) => {
            if (data.code === 200) {
                this.$successToast('操作成功');
                this.getTree();
                this.addDep = {};
                this.dialogFormVisible1 = false;
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
            COMMON_API.UPDATEORG_API(this.OrgDetail).then(({ data }) => {
                if (data.code === 200) {
                    this.$successToast('操作成功');
                    this.fileList = [];
                    this.isRedact = true;
                    this.setdetail({ id: this.OrgDetail.id });
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
            COMMON_API.DELETEORG_API({
                id: this.OrgDetail.id
            }).then(({ data }) => {
                if (data.code === 200) {
                    this.$successToast('操作成功');
                    this.getTree();
                    this.OrgDetail = {};
                }
            });
        });
    }

    // 上传图片前
    httpRequest(options) {
        console.log(options);
        // const fileReader = new FileReader();
        // const file = options.file;
        // if (file) {
        //     fileReader.readAsDataURL(file);
        // }
        // fileReader.onload = () => {
        //     const base64Str = fileReader.result as string;
        //     options.onSuccess(base64Str.split(',')[1], file);
        // };
        const form = new FormData();
        // 文件对象
        form.append('file', options.file);
        axios.request({
            url: this.FILE_API,
            method: 'POST',
            data: form
        })
        axios.put(this.FILE_API, form)
    }

    // 上传图片后
    addfile(res) {
        console.log(res);
        // this.fileList = []
        // this.fileList[0] = {};
        // this.fileList[0].name = '';
        // this.fileList[0].url = 'data:image/gif;base64,' + res;
        // this.OrgDetail.imgUrl = res;
    }

    DeptAddfile(res) {
        this.addDep.imgUrl = res;
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
        return data.deptName.indexOf(value) !== -1;
    }
}

interface DeptObject {
    id?: string;
}
interface DetailObject {
    id?: string;
    factory?: string;
    parentId?: string;
    deptName?: string;
    parentName?: string;
    imgUrl? : string;
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
.el-form-item {
    /* float: left; */
}

.org-img-upload {
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
        padding-top: 44px;

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
        position: absolute;
        right: 10px;
        bottom: 10px;
    }
}
</style>
