<template>
    <div>
        <el-dialog :title="dialogTitle" :close-on-click-modal="false" :visible.sync="isTableDialogVisible" width="70%">
            <div class="inner-area">
                <div class="inner-area__title">
                    <h3 />
                    <el-form :inline="true" :model="headerInfo" class="markStyle">
                        <el-form-item label="容器号：" size="mini">
                            <el-input v-model="headerInfo.holderName" placeholder="" disabled style="width: 100px;" />
                        </el-form-item>

                        <el-form-item label="状态：" size="mini">
                            <el-input v-model="headerInfo.fermentorStatusName" placeholder="" disabled style="width: 120px;" />
                        </el-form-item>
                        <el-button type="primary" size="small" @click="addNewDataRow()">
                            新增
                        </el-button>
                    </el-form>
                </div>
                <div class="inner-area__body">
                    <el-form ref="importBucketForm" :model="importBucketForm" size="size" class="markStyle">
                        <el-table class="table-style-light" :data="drumBucketInfo" :row-class-name="rowDelFlag" header-row-class-name="tableHead" size="mini" border style="width: 100%;" max-height="300">
                            <el-table-column min-width="200" :show-overflow-tooltip="true">
                                <template slot="header">
                                    <span class="notNull">鼓罐阶段</span>
                                </template>
                                <template slot-scope="scope">
                                    <el-form-item prop="inflationStage">
                                        <el-select v-model="scope.row.inflationStage" placeholder="请选择" size="small" @change="changeDrumStageOption(scope.row)">
                                            <el-option
                                                v-for="item in drumStageOptions"
                                                :key="item.dictCode"
                                                :label="item.dictValue"
                                                :value="item.dictCode"
                                            />
                                        </el-select>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column label="鼓罐时间" width="260" :show-overflow-tooltip="true">
                                <template slot="header">
                                    <span class="notNull">鼓罐时间</span>
                                </template>
                                <template slot-scope="scope">
                                    <el-form-item prop="inflationDate">
                                        <el-date-picker
                                            v-model="scope.row.inflationDate"
                                            type="datetime"
                                            placeholder="请选择"
                                            style="width: 220px;"
                                            value-format="yyyy-MM-dd HH:mm"
                                            format="yyyy-MM-dd HH:mm"
                                            size="small"
                                        />
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column min-width="140" :show-overflow-tooltip="true">
                                <template slot="header">
                                    <span>酱料温度（℃）</span>
                                </template>
                                <template slot-scope="scope">
                                    <el-form-item prop="sauceTemperature">
                                        <el-input v-model.trim="scope.row.sauceTemperature" size="small" placeholder="请输入温度">
                                            <span slot="suffix">°C</span>
                                        </el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column min-width="200" :show-overflow-tooltip="true">
                                <template slot="header">
                                    <span class="notNull">鼓罐操作人</span>
                                </template>
                                <template slot-scope="scope">
                                    <el-form-item prop="inflationMan">
                                        <div class="required" style="min-height: 32px; line-height: 32px;">
                                            <span style="cursor: pointer;" @click="selectUser(scope.row,scope.$index)">
                                                <em v-for="(item, index) in splitString(scope.row.inflationMan)" :key="index">{{ item }}，</em>
                                                <em>点击选择人员</em>
                                            </span>
                                        </div>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column label="备注" :show-overflow-tooltip="true" min-width="200">
                                <template slot-scope="scope">
                                    <el-input v-model.trim="scope.row.remark" size="small" placeholder="请输入备注" />
                                </template>
                            </el-table-column>
                            <el-table-column prop="changer" label="操作人" :show-overflow-tooltip="true" width="160" />
                            <el-table-column prop="changed" label="操作时间" :show-overflow-tooltip="true" width="160" />
                            <el-table-column fixed="right" label="操作" width="80" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" @click="removeDataRow(scope.row)">
                                        删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
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
    import { COMMON_API, FER_API } from 'common/api/api';
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

        // title
        dialogTitle='发酵罐鼓罐'
        currentHolderNo=''
        currentHolderStatus=''

        currentWorkShop=''
        headerInfo: HeaderInfo={
            fermentorStatus: '',
            holderName: '',
            fermentorStatusName: '',
            holderId: ''
        }

        // 点击赋予 item info
        currentCycle=''
        currentHolderId=''
        drumStageOptions: Options[]=[]

        currentRowIndex=0


        drumBucketInfo: CurrentDataTable[]=[] // 主 data
        orgFormDataGroup: CurrentDataTable[] = [] // 主 data 复制
        // 入罐表单数据
        importBucketForm= {}

        isTableDialogVisible = false;
        isLoanedPersonnelStatusDialogVisible = false; // 选人
        orgTree: object[] = [];
        arrList: string[] = [];

        mounted() {
            // 获取组织树
            this.getTree()
        }

        totalNum(target) {
            let result = 0
            target.forEach(item => {
                result = _.add(result, Number(item.feedAmount))
            })
            return result

        }

        splitString(str) {
            if (str !== '') {
                return str.split(',')
            }
            return []
        }

        // 下拉鼓罐阶段
        changeDrumStageOption(val) {
            console.log(val)
        }

        // 入罐
        async init(item) {

            this.headerInfo = {
                fermentorStatus: item.fermentorStatus,
                fermentorStatusName: item.fermentorStatusName,
                holderName: item.holderName,
                holderId: item.holderId
            }
            this.isTableDialogVisible = true
            this.currentWorkShop = item.workshop
            this.currentCycle = item.cycle
            this.currentHolderId = item.holderId

            this.arrList = [item.workShop];

            FER_API.FER_FERMENTOR_FLATION_BATCH_QUERY_API({
                    holderId: this.currentHolderId
                }).then(({ data }) => {
                    console.log('鼓罐查询')
                    console.log(data)

                    this.drumBucketInfo = []
                    if (data.data) {
                        this.drumBucketInfo = data.data
                        this.drumBucketInfo.forEach((element) => {
                            this.$set(element, 'delFlag', 0)
                        })
                    }
                    this.orgFormDataGroup = JSON.parse(JSON.stringify(this.drumBucketInfo))

                })

             // 获取鼓罐阶段
            this.getDrumStage()

        }

        getDrumStage() {
            COMMON_API.DICTQUERY_API({ dictType: 'DRUM_STAGE' }).then(({ data }) => {
                this.drumStageOptions = []
                if (data.data.length !== 0) {
                    data.data.forEach(item => {
                        this.drumStageOptions.push({ dictValue: item.dictValue, dictCode: item.dictCode })
                    })

                }
            })
        }

        // RowDelFlag
        rowDelFlag({ row }) {
            if (row.delFlag === 1) {
                return 'rowDel';
            }
            return '';
        }

        removeDataRow(row) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$set(row, 'delFlag', 1)
                this.$successToast('删除成功');
            })
        }

        // 员工确认
        changeUser(item) {
            this.drumBucketInfo[this.currentRowIndex].inflationMan = item.join(',')
            this.isLoanedPersonnelStatusDialogVisible = false;
        }

        // 选择人员 正式借调
        selectUser(row, index) {
            this.isLoanedPersonnelStatusDialogVisible = true;
            this.currentRowIndex = index
            this.$nextTick(() => {
                this.$refs.loanedPersonnel.init(row.inflationMan, '鼓罐操作人');
            });
        }


        // 新增行
        addNewDataRow() {
            this.drumBucketInfo.push({
                    fermentorId: this.headerInfo.holderId,
                    inflationDate: '',
                    inflationMan: '',
                    inflationStage: '',
                    inflationStageName: '',
                    sauceTemperature: 0,
                    cycle: this.currentCycle,
                    delFlag: 0,
                    remark: '',
                    changer: getUserNameNumber(),
                    changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
                })
        }

        // 获取组织结构树
        getTree() {
            COMMON_API.ORGSTRUCTURE_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id
            }).then(({ data }) => {
                this.orgTree = data.data;
            });
        }


        // 入罐确认
        comfirmImportBucket() {
            this.drumBucketInfo.forEach(() => {
                // item.prodcutMaterial = this.headerInfo.headerProdcutMaterial
                // item.productMaterialName = this.headerInfo.headerProductMaterialName.split(' ')[0] as string
                // item.potCount = this.headerInfo.headerPotCount
                // // item.feedMaterialName = this.headerInfo.headerFeedMaterialName.split(' ')[0] as string
            })

            if (this.ruleSubmit()) {
                const obj = {}
                const deleteItemsArray: string[] = []
                const insertListArray: CurrentDataTable[] = []
                const updateListArray: CurrentDataTable[] = []


                this.drumBucketInfo.forEach((item: CurrentDataTable, index) => {

                    if (item.delFlag === 1) {
                        if (item.id) {
                            deleteItemsArray.push(item.id)
                        }
                    } else if (item.id) {

                        if (!_.isEqual(this.orgFormDataGroup[index], item)) {
                            // item.potStatus = this.currentPotStatus
                            updateListArray.push(item)
                        }
                    } else {
                        // item.potStatus = this.currentPotStatus
                        insertListArray.push(item)
                    }
                })

                FER_API.FER_FERMENTOR_FLATION_SAVE_API({
                    cycle: this.currentCycle,
                    holderId: this.currentHolderId,
                    deleteIds: deleteItemsArray,
                    insertList: insertListArray,
                    updateList: updateListArray
                }).then(() => {
                    this.$successToast('保存成功');
                    this.$emit('drumBucketFinish', obj);
                    this.isTableDialogVisible = false
                });

            }
        }

        clearImportBucket() {
            this.isTableDialogVisible = false
        }

        // 提交时跑校验
        ruleSubmit() {
            if (this.drumBucketInfo.length === 0 && this.drumBucketInfo.filter(it => it.delFlag !== 1).length === 0) {
                this.$warningToast('请录入鼓罐');
                return false
            }

            // 表格栏位
            for (const item of this.drumBucketInfo.filter(it => it.delFlag !== 1)) {
                if (!item.inflationMan || !item.inflationDate || !item.inflationStage) {
                    this.$warningToast('请填写鼓罐必填项');
                    return false
                }
            }
            return true
        }
    }


interface Options{
    dictCode?: string;
    dictValue?: string;
}

interface ProductMaterial{
    dictCode?: string;
    dictValue?: string;
    id?: string;
}


interface CurrentDataTable{
    changed?: string;
    changer?: string;
    cycle?: string;
    fermentorId?: string;
    id?: string;
    inflationDate?: string;
    inflationMan?: string;
    inflationStage?: string;
    inflationStageName?: string;
    remark?: string;
    sauceTemperature?: number;
    delFlag?: number;
}

interface HeaderInfo {
    fermentorStatus: string;
    holderName: string;
    fermentorStatusName: string;
    holderId: string;
}
</script>
<style scoped>

.markStyle >>> th .notNull::before {
    margin-right: 4px;
    color: #f00;
    content: "*";
}
.markStyle >>> th .notNull {
    color: #333;
}


.markStyle >>> .star .el-form-item__label::before {
    margin-right: 4px;
    color: #f56c6c;
    content: "*";
}


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

.inner-area__body >>> .el-checkbox__inner {
    position: relative;
    z-index: 1;
    display: inline-block;
    box-sizing: border-box;
    width: 16px;
    height: 16px;
    background-color: #fff;
    border: 1px solid #1b91ff;
    border-radius: 10px;
    transition: border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46), background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
}
.inner-area__body >>> .el-checkbox__inner::after {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 8px;
    height: 8px;
    background: #1b91ff;
    border: none;
    border: 0;
    border-radius: 4px;
    transform: rotate(0deg) scaleY(0);
    transform-origin: center;
    transition: transform 0.15s ease-in 0.05s;
    content: "";
}

.inner-area__body >>> .el-checkbox__input.is-checked .el-checkbox__inner::after {
    transform: rotate(0deg) scaleY(1);
}
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
    margin-top: 10px;
    text-align: right;
}


</style>
