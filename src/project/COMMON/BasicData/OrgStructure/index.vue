<template>
    <div>
        <org-view
            ref="orgView"
            :title="'组织架构'"
            :right-tile="'组织详细信息'"
            :type="'table'"
            @treeNodeClick="setdetail"
            @treeNodeContextMenu="showMenu"
        >
            <template slot="view" style="padding-top: 16px;">
                <div class="detail-main clearfix">
                    <div class="detail-main-form">
                        <el-form :model="OrgDetail" size="small" :inline="true" label-width="90px" class="org-detail-form">
                            <el-form-item label="部门编码：">
                                <el-input v-model="OrgDetail.deptCode" :disabled="true" auto-complete="off" style="width: 250px;" />
                            </el-form-item>
                            <el-form-item label="部门名称：">
                                <el-input v-model="OrgDetail.deptName" :disabled="isRedact" auto-complete="off" style="width: 250px;" />
                            </el-form-item>
                            <el-form-item label="上级部门：">
                                <el-input v-model="OrgDetail.parentName" :disabled="true" auto-complete="off" style="width: 250px;" />
                            </el-form-item>
                            <el-form-item label="部门简称：">
                                <el-input v-model="OrgDetail.deptShort" :disabled="isRedact" auto-complete="off" style="width: 250px;" />
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
                            <el-form-item v-if="OrgDetail.deptType === 'PRODUCT_LINE'" label="产线图片：">
                                <div v-if="detailImgFile" class="org-img-upload el-upload-list el-upload-list--picture-card" style="display: block; width: 250px;">
                                    <div class="el-upload-list__item is-success avatar">
                                        <img class="flex-img__image avatar" :src="detailImgFile">
                                        <label class="el-upload-list__item-status-label">
                                            <i class="el-icon-upload-success el-icon-check" />
                                        </label>
                                        <span class="el-upload-list__item-actions">
                                            <span class="el-upload-list__item-delete">
                                                <i class="el-icon-delete" @click.stop="() => { if (!isRedact) { removeFile() } }" />
                                            </span>
                                        </span>
                                    </div>
                                </div>
                                <el-upload v-show="!detailImgFile" ref="orgImgUpload" class="org-img-upload" :show-file-list="false" :action="FILE_API" :disabled="isRedact" :limit="1" :http-request="httpRequest" :on-success="addfile">
                                    <i class="el-icon-plus avatar-uploader-icon" />
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
                    <div class="org-detail-btn" :class="{'org-detail-btn__fix':mainClientHeight > 500}">
                        <el-button type="primary" size="small" @click="setRedact">
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
            </template>
        </org-view>
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" style="margin-bottom: 20px;">
        </el-dialog>
        <el-dialog id="adddepform" width="400px" :close-on-click-modal="false" :visible.sync="dialogFormVisible1" :title="sibling ? '新增同级' : '新增下级'">
            <el-form ref="dataForm" :model="addDep" :rules="dataRule" size="small" label-position="left" label-width="100px">
                <el-form-item label="部门编号：" prop="deptCode">
                    <el-input v-model="addDep.deptCode" auto-complete="off" />
                </el-form-item>
                <el-form-item label="部门名称：" prop="deptName">
                    <el-input v-model="addDep.deptName" auto-complete="off" />
                </el-form-item>
                <el-form-item label="部门简称：">
                    <el-input v-model="addDep.deptShort" auto-complete="off" />
                </el-form-item>
                <el-form-item label="上级部门：">
                    <el-input v-model="addDep.parentName" disabled />
                </el-form-item>
                <el-form-item label="生产调度员：">
                    <el-input v-model="addDep.dispatchMan" />
                </el-form-item>
                <el-form-item label="部门类型：" prop="deptType">
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
                <el-form-item v-if="addDep.deptType == 'PRODUCT_LINE'" label="产线图片：">
                    <div v-if="addImgFile" class="org-img-upload el-upload-list el-upload-list--picture-card">
                        <div class="el-upload-list__item is-success avatar">
                            <img class="flex-img__image avatar" :src="addImgFile">
                            <label class="el-upload-list__item-status-label">
                                <i class="el-icon-upload-success el-icon-check" />
                            </label>
                            <span class="el-upload-list__item-actions">
                                <span class="el-upload-list__item-delete">
                                    <i class="el-icon-delete" @click.stop="removeFile()" />
                                </span>
                            </span>
                        </div>
                    </div>
                    <el-upload v-show="!addImgFile" ref="orgImgUpload" class="org-img-upload" :show-file-list="false" :action="FILE_API" :limit="1" :http-request="httpRequest" :on-success="addfile">
                        <i class="el-icon-plus avatar-uploader-icon" />
                    </el-upload>
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
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogFormVisible1 = false;">
                    取消
                </el-button>
                <el-button type="primary" size="small" @click="addOrg">
                    确定
                </el-button>
            </div>
        </el-dialog>
        <ul v-show="menuVisible" id="menu">
            <li class="menuli" @click="menuClick(true, clickTreeNode.parentName, clickTreeNode.parentId)">
                新增同级
            </li>
            <li class="menuli" @click="menuClick(false, clickTreeNode.deptName, clickTreeNode.id)">
                新增下级
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { COMMON_API } from 'common/api/api';
import axios from 'axios';

@Component
export default class OrgStructure extends Vue {
    $refs: {
        orgView: HTMLFormElement;
        dataForm: HTMLFormElement;
        orgImgUpload: HTMLFormElement;
    };

    get mainClientHeight() {
        return this.$store.state.common.mainClientHeight;
    }

    dataRule = {
        deptCode: [
            {
                required: true,
                message: '部门编号不能为空',
                trigger: 'blur'
            }
        ],
        deptName: [
            {
                required: true,
                message: '部门名称不能为空',
                trigger: 'blur'
            }
        ],
        deptType: [
            {
                required: true,
                message: '部门类型不能为空',
                trigger: 'blur'
            }
        ]
    };

    FILE_API = ''
    dialogImageUrl = ''
    detailImgFile = ''
    addImgFile = ''
    sibling = true
    uploadBtn = false
    menuVisible = false
    dialogVisible = false
    dialogFormVisible1 = false
    isRedact = true
    arrList: string[] = []
    OrgDetail: DetailObject = {}
    addDep: DetailObject = {}
    clickTreeNode: DetailObject = {}
    dictList: object[] = []

    mounted() {
        this.getDictList();
        document.addEventListener('click', e => {
            const target: Node = e.target as Node
            if (target['className'] !== 'menuli') this.menuVisible = false;
        });

        this.setdetail({});
    }

    // 展示详情
    setdetail(row: DeptObject) {
        console.log(row)
        this.menuVisible = false;
        COMMON_API.ORGDETAIL_API({
            id: row.id || 1
        }).then(({ data }) => {
            if (data.code === 200) {
                this.OrgDetail = data.data;
                if (this.OrgDetail.imgUrl) {
                    this.$refs.orgImgUpload.clearFiles();
                    COMMON_API.DOWNLOADFILE_API({
                        key: this.OrgDetail.imgUrl
                    }).then((res) => {
                        this.detailImgFile = res.data.data.url;
                    })
                } else {
                    this.detailImgFile = '';
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
        this.uploadBtn = false;
        setTimeout(() => {
            this.addDep = {}
            this.addImgFile = ''
            this.sibling = sibling;
            this.addDep.parentName = parentName;
            this.addDep.parentId = parentId;
        }, 100)
    }

    setRedact() {
        if (!this.isRedact) {
            this.setdetail({ id: this.OrgDetail.id });
        }
        this.isRedact = !this.isRedact
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
        this.$refs['dataForm'].validate(valid => {
            if (valid) {
                this.addDep.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
                COMMON_API.ADDORG_API(this.addDep).then(({ data }) => {
                    if (data.code === 200) {
                        this.$successToast('操作成功');
                        this.$refs.orgView.getTree();
                        this.addDep = {};
                        this.dialogFormVisible1 = false;
                    }
                });
            }
        })
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
                    this.detailImgFile = '';
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
                    this.$refs.orgView.getTree();
                    this.OrgDetail = {};
                }
            });
        });
    }

    // 上传图片前
    httpRequest(options) {
        COMMON_API.UPLOADFILE_API({
            name: options.file.name
        }).then(({ data }) => {
            if (data.code === 200) {
                this.FILE_API = data.data.url
                axios.put(data.data.url, options.file).then(res => {
                    if (res.status === 200) {
                        options.onSuccess(data.data.key, options);
                    }
                })
            }
        });
    }

    // 上传图片后
    addfile(key, options) {
        if (this.dialogFormVisible1) {
            this.addDep.imgUrl = key;
            this.addImgFile = URL.createObjectURL(options.raw);
        } else {
            this.OrgDetail.imgUrl = key;
            this.detailImgFile = URL.createObjectURL(options.raw);
        }
    }

    DeptAddfile(res) {
        this.addDep.imgUrl = res;
    }

    // 移出图片
    removeFile() {
        this.$refs.orgImgUpload.clearFiles();
        this.detailImgFile = ''
        this.addImgFile = ''
        this.OrgDetail.imgUrl = ''
        this.addDep.imgUrl = '';
    }

    // 查看图片
    handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
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
