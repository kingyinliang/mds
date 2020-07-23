<template>
    <div>
        <!-- 溶解罐入罐 -->
        <el-dialog title="入罐" :close-on-click-modal="false" :visible.sync="isTableDialogVisible" width="70%">
            <div class="inner-area">
                <div class="inner-area__title">
                    <h3><i class="title-icon" style="background: rgb(72, 123, 255);" />溶解罐列表 </h3>
                    <el-button type="primary" size="small" @click="addNewDataRow()">
                        新增
                    </el-button>
                </div>
                <div class="inner-area__body">
                    <el-form ref="importBucketForm" :model="importBucketForm" size="size">
                        <el-table class="table-style-light" :data="importBucketInfo" :row-class-name="rowDelFlag" header-row-class-name="tableHead" size="mini" border style="width: 100%;" max-height="300">
                            <el-table-column label="序号" type="index" width="55" fixed="left" align="center" />
                            <el-table-column min-width="200" :show-overflow-tooltip="true">
                                <template slot="header">
                                    溶解罐号
                                </template>
                                <template slot-scope="scope">
                                    <el-form-item prop="">
                                        {{ scope.row.potNo }}
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column min-width="160" :show-overflow-tooltip="true">
                                <template slot="header">
                                    <span class="notNull">*</span>生产物料
                                </template>
                                <template slot-scope="scope">
                                    <el-form-item prop="">
                                        <el-select v-model="scope.row.prodcutMaterial" size="small" clearable>
                                            <el-option
                                                v-for="item in productMateriallList"
                                                :key="item.dictCode"
                                                :label="item.dictValue"
                                                :value="item.dictCode"
                                            />
                                        </el-select>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column min-width="140" :show-overflow-tooltip="true">
                                <template slot="header">
                                    <span class="notNull">*</span>配置锅数
                                </template>
                                <template slot-scope="scope">
                                    <el-form-item prop="">
                                        <el-input v-model.trim="scope.row.potCount" size="small" placeholder="输入锅数" clearable />
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column min-width="160" :show-overflow-tooltip="true">
                                <template slot="header">
                                    <span class="notNull">*</span>投料物料
                                </template>
                                <template slot-scope="scope">
                                    <el-form-item prop="">
                                        <el-select v-model="scope.row.feedMaterial" size="small" clearable>
                                            <el-option
                                                v-for="item in feedMateriallList"
                                                :key="item.dictCode"
                                                :label="item.dictValue"
                                                :value="item.dictCode"
                                            />
                                        </el-select>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column :show-overflow-tooltip="true" width="140">
                                <template slot="header">
                                    <span class="notNull">* </span>单位
                                </template>
                                <template slot-scope="scope">
                                    <el-form-item prop="">
                                        <!-- <el-input v-model.trim="scope.row.feedUnit" size="small" placeholder="输入锅数" clearable /> -->
                                        {{ scope.row.feedUnit }}
                                        <!-- <el-select v-model="scope.row.feedUnit" placeholder="请选择" size="small">
                                            <el-option
                                                v-for="item in 10"
                                                :key="item.key"
                                                :label="item.value"
                                                :value="item.key"
                                            />
                                        </el-select> -->
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column min-width="200" :show-overflow-tooltip="true">
                                <template slot="header">
                                    <span class="notNull">*</span>投料数量
                                </template>
                                <template slot-scope="scope">
                                    <el-form-item prop="">
                                        <el-input v-model.trim="scope.row.feedAmount" size="small" placeholder="输入数量" />
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column min-width="200" :show-overflow-tooltip="true">
                                <template slot="header">
                                    <span class="notNull">*</span>投料批次
                                </template>
                                <template slot-scope="scope">
                                    <el-form-item prop="">
                                        <el-input v-model.trim="scope.row.feedBatch" size="small" placeholder="输入批次" />
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column min-width="200" :show-overflow-tooltip="true">
                                <template slot="header">
                                    <span class="notNull">*</span>投料人
                                </template>
                                <template slot-scope="scope">
                                    <el-form-item prop="">
                                        <div class="required" style="min-height: 32px; line-height: 32px;">
                                            <!-- <span style="cursor: pointer;">
                                                <i v-for="(item, index) in scope.row.feedMan.split(',')" :key="index">{{ item }}，</i>
                                            </span> -->
                                            <span style="cursor: pointer;" @click="selectUser(scope.row,scope.$index)">
                                                <i v-for="(item, index) in scope.row.feedMan.split(',')" :key="index">{{ item }}，</i>
                                                <i>点击选择人员</i>
                                            </span>
                                        </div>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column label="投料时间" width="260" :show-overflow-tooltip="true">
                                <template slot="header">
                                    <span class="notNull">* </span>投料时间
                                </template>
                                <template slot-scope="scope">
                                    <el-form-item prop="">
                                        <el-date-picker
                                            v-model="scope.row.feedDate"
                                            type="datetime"
                                            placeholder="选择日期时间"
                                            style="width: 220px;"
                                            value-format="yyyy-MM-dd HH:mm"
                                            format="yyyy-MM-dd HH:mm"
                                            size="small"
                                        />
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column label="备注" :show-overflow-tooltip="true" min-width="200">
                                <template slot-scope="scope">
                                    <el-input v-model.trim="scope.row.remark" size="small" placeholder="输入备注" />
                                </template>
                            </el-table-column>
                            <el-table-column prop="changer" label="操作人" :show-overflow-tooltip="true" width="180" />
                            <el-table-column prop="changed" label="操作时间" :show-overflow-tooltip="true" width="180" />
                            <el-table-column fixed="right" label="操作" width="80" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" @click="removeDataRow(scope.row)">
                                        删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-form-item label="满罐选项: " prop="">
                            <el-checkbox v-model="importBucketForm.filled" />
                        </el-form-item>
                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button size="small" @click="clearImportBucket">
                        取消
                    </el-button>
                    <el-button type="primary" size="small" @click="comfirmImportBucket">
                        确定
                    </el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 投料人员 -->
        <loaned-personnel v-if="isLoanedPersonnelStatusDialogVisible" ref="loanedPersonnel" :org-tree="orgTree" :arr-list="arrList" @changeUser="changeUser" />
    </div>
</template>
<script lang="ts">

    // 空罐 E
    // 入料中 R (投料)

    import { Vue, Component } from 'vue-property-decorator';
    import { dateFormat, getUserNameNumber } from 'utils/utils';
    import LoanedPersonnel from 'components/LoanedPersonnelv1.vue';
    import { COMMON_API, STE_API } from 'common/api/api';
    import _ from 'lodash';
    // import { dateFormat } from 'utils/utils';

    @Component({
        name: 'ImportBucketIndex',
        components: {
            LoanedPersonnel
        }
    })
    export default class ImportBucketIndex extends Vue {

        $refs: {
            loanedPersonnel: HTMLFormElement;
        }

        // 点击赋予 item info
        currentPotNo=''
        currentWorkShop=''

        productMateriallList: object[]=[] // 生产物料清单
        feedMateriallList: object[]=[] // 投料物料清单


        // 当前处理的 bucket index
        nowBucketNo=0


        holderStatus: HolderStatus[]=[]
        currentRowIndex=0
        dataList = []
        totalCount = 1
        currPage = 1
        pageSize = 10
        dissolveBucketCode = ''

        bucketDataList=[
            {
                id: 1,
                bucketNo: 4,
                bucketStatus: 'R',
                filled: false,
                cleared: false
            }
        ]

        bucketDataList1: BucketDataListObj[] = []
        importBucketInfo: CurrentDataTable[]=[] // 主 data
        orgFormDataGroup: CurrentDataTable[] = [] // 主 data 复制
        orgArrList: string[] = []

        isBucketDialogVisible = false;
        isTableDialogVisible = false;
        dialogType='filled'
        dialogForm = {
            filled: {
                title: '溶解罐满罐',
                form: {
                    number: 'a22',
                    status: 'U',
                    doit: false,
                    changer: getUserNameNumber(),
                    changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
                }
            },
            clear: {
                title: '溶解罐清洗',
                form: {
                    number: 'a23',
                    status: 'C',
                    doit: false,
                    changer: getUserNameNumber(),
                    changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
                }
            }
        };


        // 入罐表单数据
        importBucketForm= {}
        queryTableFormData = [
            {
                type: 'select',
                label: '生产车间',
                prop: 'workShop',
                defaultOptionsFn: () => {

                    return new Promise((resolve) => {
                        COMMON_API.ORG_QUERY_WORKSHOP_API({
                            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                            deptType: ['WORK_SHOP'],
                            deptName: '杀菌'
                        }).then((res) => {
                            resolve(res)
                        })
                    })
                },
                resVal: {
                    resData: 'data',
                    label: ['deptName'],
                    value: 'id'
                },
                linkageProp: ['potId']
            },
            {
                type: 'select',
                label: '溶解罐号',
                prop: 'potId',
                optionsFn: val => {
                    return new Promise((resolve) => {
                        COMMON_API.HOLDER_QUERY_API({
                            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                            deptId: val,
                            current: 1,
                            size: 9999,
                            holderType: '019' // 溶解罐参数编码
                        }).then((res) => {
                            // eslint-disable-next-line no-invalid-this
                            this.currentWorkShop = val
                            resolve(res)
                        })
                    })

                },
                resVal: {
                    resData: 'data.records',
                    label: ['holderName'],
                    value: 'holderNo'
                }
            },
            {
                type: 'select',
                label: '状态',
                prop: 'potStatus',
                defaultOptionsFn: () => {
                    return new Promise((resolve) => {
                        COMMON_API.DICTQUERY_API({ dictType: 'COMMON_HOLDER_STATUS' }).then((res) => {
                            const temp = res
                            temp.data.data = temp.data.data.filter(element => element.dictValue !== '发酵')
                            temp.data.data.forEach(item => {
                                if (item.dictValue === '投料') {
                                    item.dictValue = '入料中'
                                } else if (item.dictValue === '领用') {
                                    item.dictValue = '领用中'
                                } else if (item.dictValue === '清洗') {
                                    item.dictValue = '待清洗'
                                }
                            })
                            resolve(temp)
                        })
                    })
                },
                resVal: {
                    resData: 'data',
                    label: ['dictValue'],
                    value: 'dictCode'
                }
            }
        ]

        queryTableRules = [
            {
                prop: 'workShop',
                text: '请选择生产车间'
            }
        ]

        isLoanedPersonnelStatusDialogVisible = false;
        orgTree: object[] = [];
        arrList: string[] = [];

        mounted() {
            this.getTree()
        }

        // 入罐
        init(item) {
            console.log('入罐item')
            console.log(item)
            this.isTableDialogVisible = true
            this.nowBucketNo = item.potId
            this.currentPotNo = item.potId
            // 溶解罐管理-查询入罐信息
            STE_API.STE_DISSOLUTIONBUCKET_ENTER_QUERY_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                holderId: this.currentPotNo
            }).then(({ data }) => {
                console.log('查询入罐信息')
                console.log(data)
                if (data.data) {
                    this.importBucketInfo = data.data
                    this.orgFormDataGroup = JSON.parse(JSON.stringify(this.importBucketInfo))
                } else {
                    this.importBucketInfo = []
                }
            });

            // 容器管理-查询生产物料
            COMMON_API.HOLDER_QUERY_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                deptId: this.currentWorkShop,
                current: 1,
                size: 9999,
                holderNo: item.potNo,
                holderType: '019' // 溶解罐参数编码
            }).then(({ data }) => {
                this.productMateriallList = []
                console.log('查询生产物料')
                console.log(data)
                    if (data.data.records[0].material) {
                        data.data.records[0].material.forEach(element => {
                            this.productMateriallList.push({ dictCode: element.materialCode, dictValue: element.materialName })
                        })
                    }
            });

            // 辅料前处理-查询不带分页 (查询生产物料)
            STE_API.STE_PREACCESSORIES_LIST_API({
                preStage: 'DISSOLUTION'
            }).then(({ data }) => {
                console.log('辅料前处理')
                console.log(data)
                this.feedMateriallList = []
                if (data.data) {
                    data.data.forEach(element => {
                        this.feedMateriallList.push({ dictCode: element.productMaterial, dictValue: element.productMaterialName })
                    })
                }

            });
        }

        removeDataRow(row) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                row.delFlag = 1;
            })
        }

        //  RowDelFlag
        RowDelFlag({ row }) {
            if (row.delFlag === 1) {
                return 'rowDel';
            }
            return '';

        }

        // 员工确认
        changeUser(item) {
            console.log('人员是哪些呢？')
            console.log(item.join(','))
            this.importBucketInfo[this.currentRowIndex].feedMan = item.join(',')
            this.importBucketInfo[this.currentRowIndex].userList = item
            // this.row.userList = userId;
            this.isLoanedPersonnelStatusDialogVisible = false;


        }

        // 选择人员 正式借调
        selectUser(row, index) {
            this.isLoanedPersonnelStatusDialogVisible = true;
            this.currentRowIndex = index
            this.$nextTick(() => {
                this.$refs.loanedPersonnel.init(row.feedMan, '投料人员');
            });

        }

        // 新增行
        addNewDataRow() {
            console.log(this.importBucketInfo)
            const sole: CurrentDataTable = {
                delFlag: 0,
                potNo: this.currentPotNo, // 溶解罐号
                prodcutMaterial: '', // 生产物料
                potCount: 0, // 配置锅数
                feedMaterial: '', // 投料物料
                feedUnit: '', // 投料物料单位
                feedAmount: 0, // 投料数量
                feedBatch: '', // 投料批次
                feedMan: '', // 投料人
                userList: [],
                feedDate: '', // 投料时间
                remark: '',
                changer: getUserNameNumber(),
                changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
                // feedMaterialName?: string;
                // id?: string;
                // productMaterialName?: string;
            }
            this.importBucketInfo.push(sole)
            console.log(this.importBucketInfo)
            // this.setValidate(this.currentFormDataGroup, this.ruleForm)
        }


        // 获取组织结构树
        getTree() {
            COMMON_API.ORGSTRUCTURE_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id
            }).then(({ data }) => {
                this.orgTree = data.data;
               // this.arrList = [(this.orgTree[0].children[0].id)];
            });
        }


        //  RowDelFlag
        rowDelFlag({ row }) {
            if (row.delFlag === 1) {
                return 'rowDel';
            }
            return '';

        }


        // 入罐确认
        comfirmImportBucket() {
            if (this.ruleSubmit()) {

                if (this.bucketDataList[this.nowBucketNo].filled === true) {
                    this.bucketDataList[this.nowBucketNo].bucketStatus = 'M'
                } else {
                    this.bucketDataList[this.nowBucketNo].bucketStatus = 'R'
                }

                const delIdsArray: string[] = []
                const insertDtosArray: CurrentDataTable[] = []
                const updateDtosArray: CurrentDataTable[] = []

                this.importBucketInfo.forEach((item: CurrentDataTable, index) => {
                    if (item.delFlag === 1) {
                        if (item.id) {
                            delIdsArray.push(item.id)
                        }
                    } else if (item.id) {
                        if (!_.isEqual(this.orgFormDataGroup[index], item)) {
                            updateDtosArray.push(item)
                        }
                    } else {
                        insertDtosArray.push(item)
                    }
                })


                STE_API.STE_DISSOLUTIONBUCKET_SAVE_API({
                    delIds: delIdsArray,
                    insertDtos: insertDtosArray,
                    updateDtos: updateDtosArray
                }).then(({ data }) => {
                    console.log(data)
                });
            }
        }

        clearImportBucket() {
            this.isTableDialogVisible = false
        }

        // 提交时跑校验
        ruleSubmit() {
            if (this.importBucketInfo.filter(it => it.delFlag !== 1).length === 0) {
                this.$warningToast('请录入入罐');
                return false
            }
            for (const item of this.importBucketInfo.filter(it => it.delFlag !== 1)) {
                if (!item.prodcutMaterial || !item.potCount || !item.feedMaterial || !item.feedMan || !item.feedDate || !item.feedBatch || !item.feedAmount || !item.feedUnit) {
                    this.$warningToast('请填写入罐必填项');
                    return false
                }
            }
            return true
        }
    }

interface DeptObject {
    id?: string;
}
interface BucketDataListObj{
    cycle?: string;
    id?: string;
    potAmount?: string;
    potId?: string;
    potNo?: string;
    potStatus?: string;
    prodcutMaterial?: string;
    prodcutMaterialName?: string;
}

interface HolderStatus{
    dictCode?: string;
    dictValue?: string;
}

interface CurrentDataTable{
    changed?: string;
    changer?: string;
    feedAmount?: number;
    feedBatch?: string;
    feedDate?: string;
    feedMan?: string;
    feedMaterial?: string;
    feedMaterialName?: string;
    feedUnit?: string;
    id?: string;
    potCount?: number;
    potNo?: string;
    prodcutMaterial?: string;
    productMaterialName?: string;
    remark?: string;
    delFlag?: number;
    userList?: string[];
}

</script>
<style scoped>
.el-pagination >>> .el-pager li.active {
    width: 24px;
    min-width: auto;
    height: 24px;
    color: #fff;
    line-height: 24px;
    background: rgba(72, 123, 255, 1);
    border-radius: 4px;
    cursor: default;
}

.header_main >>> .el-dialog .el-dialog__body {
    padding: 20px;
}

.header_main >>> .el-dialog .el-date-editor .el-input__prefix {
    background: transparent;
}

/* .header_main >>> .el-checkbox__inner {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 14px;
    height: 14px;
    background-color: #fff;
    border: 1px solid #dcdfe6;
    border-radius: 100%;
    cursor: pointer;
} */

/* .el-checkbox__input.is-checked .el-checkbox__inner::after {
    -webkit-transform: rotate(45deg) scaleY(1);
    transform: rotate(45deg) scaleY(1);
} */
</style>

<style lang="scss" scoped>

.el-form-item {
    margin-bottom: 0;
}
.inner-area {
    .inner-area__title {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        h3 {
            font-weight: bold;
            font-size: 14px !important;
            line-height: 32px;
            .title-icon {
                display: inline-block;
                width: 4px;
                height: 12px;
                margin-top: 10px;
                margin-right: 5px;
                background: #487bff;
                border-radius: 2px;
            }
            .point-icon {
                width: 5px;
                height: 5px;
                margin-top: 13px;
                margin-right: 5px;
                background: #487bff;
                border-radius: 3px;
            }
        }
    }
    .inner-area__body {
        .table-style-light {
            .el-table__header {
                th {
                    color: white;
                    text-align: center;
                    background: #e8e8e8;
                    background-color: #e8e8e8 !important;
                    border-top: none;
                    border-right: none;
                    border-bottom: none;
                    border-left: none;
                }
            }
            .el-table__body {
                td {
                    padding: 0;
                }
            }
            tr:nth-child(even) {
                background-color: #f7f7f7;
            }
            .el-table__row {
                td:first-child {
                    border-left: 2px solid transparent;
                }
            }
            .hover-row {
                td:first-child {
                    border-left: 2px solid #e8e8e8;
                }
            }
            .el-table__row:hover {
                td:first-child {
                    border-left: 2px solid #e8e8e8;
                }
            }

            .el-input.is-disabled .el-input__inner {
                width: 100%;
                overflow: hidden;
                color: #666 !important;
                background: none;
                border: none;
            }
        }
    }
}

.default {
    display: block;
    padding: 2px 20px;
    background: #f5f5f5;
    border-radius: 4px;
}
.card-bucket {
    margin-bottom: 10px;
    background: #fff;
    border: 1px solid rgba(171, 171, 171, 0.5);
    border-radius: 8px;
    -webkit-box-shadow: 3px 3px 4px 0 rgba(0, 0, 0, 0.1);
    box-shadow: 3px 3px 4px 0 rgba(0, 0, 0, 0.1);
    .card-bucket__head {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 11px 10px;
        font-size: 14px;
        border-bottom: 1px #e8e8e8 solid;

        .el-button {
            font-size: 12px;
            &::after {
                content: ">>";
            }
        }
    }
    .card-bucket__content {
        display: flex;
        padding: 6px;
        .bucket-image {
            display: flex;
            flex: 2;
            justify-content: center;
            .pot_border {
                position: relative;
                width: 100%;
                height: 200px;
                overflow: hidden;
                .pot {
                    position: absolute;
                    top: 0;
                    z-index: 10;
                    width: 100%;
                    height: 200px;
                    // background: url(./assets/img/ferPotNew.png) no-repeat;
                    background: url("~@/assets/img/ferPotNew.png") no-repeat;
                    background-size: contain;
                }
                .pot_water {
                    position: absolute;
                    bottom: 13px;
                    width: 114px;
                    height: 200px;
                    &_sole {
                        position: absolute;
                        bottom: 0;
                        width: 100%;
                        overflow: hidden;
                        border-top: none;
                    }
                    &_sole::before,
                    &_sole::after {
                        position: absolute;
                        bottom: 100%;
                        left: 50%;
                        width: 300px;
                        height: 290px;
                        background-color: #fff;
                        border-radius: 55% 45%;
                        transform: translate(-50%, -70%) rotate(0);
                        content: "";
                    }
                    &_sole::after {
                        border-radius: 55% 45%;
                        transform: translate(70%, -50%) rotate(0);
                        opacity: 0.3;
                    }
                }
                &:hover {
                    .pot_water_sole::after {
                        animation: rotate 5s linear infinite;
                    }
                    .pot_water_sole::before {
                        animation: rotate 4.5s linear infinite;
                    }
                }

                @keyframes rotate {
                    0% {
                        transform: translate(-50%) rotateZ(0deg);
                    }
                    100% {
                        transform: translate(-50%) rotateZ(360deg);
                    }
                }
            }
        }
        .btn-group {
            display: flex;
            flex: 1;
            flex-flow: column;
            justify-content: center;
            .el-button {
                display: inline-block;
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
                margin: 0;
                margin-bottom: 14px;
                padding: 8px 16px;
                font-weight: 500;
                font-size: 14px;
                line-height: 1;
            }
        }
    }
    .card-bucket__fotter {
        padding: 10px 10px 0;
        font-weight: 600;
        font-size: 12px;

        > div {
            display: flex;
            justify-content: space-between;
            margin-bottom: 6px;
        }
    }
}

.dialog-footer {
    text-align: right;
}


</style>
