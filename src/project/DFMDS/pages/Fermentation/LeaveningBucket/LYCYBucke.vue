<template>
    <div>
        <el-dialog :title="dialogTitle" :close-on-click-modal="false" :visible.sync="isTableDialogVisible" width="70%">
            <div class="inner-area">
                <div class="inner-area__title">
                    <el-radio-group v-model="currentTab" style="margin-top: 10px; margin-left: 5px;">
                        <el-radio label="LY">
                            LY
                        </el-radio>
                        <el-radio label="CY">
                            CY
                        </el-radio>
                    </el-radio-group>
                    <el-form :inline="true" :model="headerInfo" class="markStyle">
                        <!-- <el-form-item>
                            <el-radio-group v-model="currentTab">
                                <el-radio label="LY">
                                    LY
                                </el-radio>
                                <el-radio label="CY">
                                    CY
                                </el-radio>
                            </el-radio-group>
                        </el-form-item> -->
                        <el-form-item label="容器号：" size="mini">
                            <el-input v-model="headerInfo.holderName" placeholder="" disabled style="width: 100px;" />
                        </el-form-item>
                        <el-form-item label="状态：" size="mini">
                            <el-input v-model="headerInfo.fermentorStatusName" placeholder="" disabled style="width: 120px;" />
                        </el-form-item>
                        <el-form-item v-if="currentTab==='CY'" label="CY 物料：" size="mini" class="star">
                            <el-select v-model="CYProdcutMaterial" placeholder="请选择" clearable style="width: 220px;" @change="changeProdcutMaterialOption">
                                <el-option
                                    v-for="item in CYProdcutMaterialOption"
                                    :key="item.dictCode"
                                    :label="`${item.dictValue} ${item.dictCode}`"
                                    :value="item.dictCode"
                                />
                            </el-select>
                        </el-form-item>
                        <el-button type="primary" size="small" @click="addNewDataRow()">
                            新增
                        </el-button>
                    </el-form>
                </div>
                <div class="inner-area__body">
                    <el-tabs v-model="currentTab">
                        <el-tab-pane label="LY" name="LY">
                            <el-table class="table-style-light markStyle" :data="lyDataGroup" :row-class-name="rowDelFlag" header-row-class-name="tableHead" size="mini" border style="width: 100%;" max-height="300">
                                <el-table-column label="序号" type="index" width="55" fixed="left" align="center" />
                                <el-table-column width="260" :show-overflow-tooltip="true">
                                    <template slot="header">
                                        <span class="notNull">LY 时间</span>
                                    </template>
                                    <template slot-scope="scope">
                                        <el-date-picker v-model="scope.row.lyDate" type="datetime" placeholder="请选择" style="width: 220px;" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" size="small" />
                                    </template>
                                </el-table-column>
                                <el-table-column min-width="200" :show-overflow-tooltip="true">
                                    <template slot="header">
                                        <span class="notNull">LY 操作人</span>
                                    </template>
                                    <template slot-scope="scope">
                                        <div class="required" style="min-height: 32px; line-height: 32px;">
                                            <span style="cursor: pointer;" @click="selectUser(scope.row, scope.$index)">
                                                <em v-for="(item, index) in splitString(scope.row.lyMans)" :key="index">{{ item }}，</em>
                                                <em>点击选择人员</em>
                                            </span>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="备注" :show-overflow-tooltip="true" min-width="200">
                                    <template slot-scope="scope">
                                        <el-input v-model.trim="scope.row.remark" size="small" placeholder="输入备注" />
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
                        </el-tab-pane>
                        <el-tab-pane label="CY" name="CY">
                            <el-table class="table-style-light markStyle" :data="cyDataGroup" :row-class-name="rowDelFlag" header-row-class-name="tableHead" size="mini" border style="width: 100%;" max-height="300">
                                <el-table-column label="序号" type="index" width="55" fixed="left" align="center" />
                                <el-table-column label="审核状态" width="160" :show-overflow-tooltip="true" prop="checkStatusName" />
                                <el-table-column :show-overflow-tooltip="true" width="160" prop="injectionPotName">
                                    <template slot="header">
                                        <span class="notNull">打入罐</span>
                                    </template>
                                    <template slot-scope="scope">
                                        <el-select v-model="scope.row.injectionPotId" size="small" clearable @change="val=>changeContainerTypeOption(val,scope.row)">
                                            <el-option
                                                v-for="item in containerTypeList"
                                                :key="item.dictCode"
                                                :label="item.dictValue"
                                                :value="item.dictCode"
                                            />
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column :show-overflow-tooltip="true" min-width="100">
                                    <template slot="header">
                                        <span class="notNull">CY 量</span>
                                    </template>
                                    <template slot-scope="scope">
                                        <el-input v-model.trim="scope.row.cyAmount" size="small" placeholder="输入批次" maxlength="10" />
                                    </template>
                                </el-table-column>
                                <el-table-column :show-overflow-tooltip="true" min-width="160">
                                    <template slot="header">
                                        <span class="notNull">批次</span>
                                    </template>
                                    <template slot-scope="scope">
                                        <el-input v-model.trim="scope.row.cyBatch" size="small" placeholder="输入批次" />
                                    </template>
                                </el-table-column>
                                <el-table-column min-width="200" :show-overflow-tooltip="true">
                                    <template slot="header">
                                        <span class="notNull">CY 操作人</span>
                                    </template>
                                    <template slot-scope="scope">
                                        <div class="required" style="min-height: 32px; line-height: 32px;">
                                            <span style="cursor: pointer;" @click="selectUser(scope.row, scope.$index)">
                                                <em v-for="(item, index) in splitString(scope.row.cyMans)" :key="index">{{ item }}，</em>
                                                <em>点击选择人员</em>
                                            </span>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="备注" :show-overflow-tooltip="true" min-width="200">
                                    <template slot-scope="scope">
                                        <el-input v-model.trim="scope.row.remark" size="small" placeholder="输入备注" />
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
                        </el-tab-pane>
                    </el-tabs>
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
            name: 'LYCYBucketIndex',
            components: {
                LoanedPersonnel
            }
        })
        export default class LYCYBucketIndex extends Vue {
            $refs: {
                loanedPersonnel: HTMLFormElement;
            }

            // title
            dialogTitle='LY/CY'
            currentHolderNo=''
            currentHolderStatus=''

            currentTab='LY' // 当前 tab

            CYProdcutMaterial=''
            CYProdcutMaterialOption: Options[]=[]

            currentWorkShop=''

            containerTypeList: Options[]=[] // sc容器罐下拉
            cyMaterialCode= ''
            cyMaterialName= ''
            headerInfo: HeaderInfo={
                fermentorStatus: '',
                holderName: '',
                fermentorStatusName: '',
                holderId: ''
            }

            // 点击赋予 item info
            currentCycle=''
            currentHolderId=''

            // 当前 row
            currentRowIndex=0

            lyDataGroup: CurrentLyDataTable[]=[] // ly data
            cyDataGroup: CurrentCyDataTable[]=[] // cy data
            orgLyDataGroup: CurrentLyDataTable[] = [] // ly data 复制
            orgCyDataGroup: CurrentCyDataTable[] = [] // ly data 复制


            isTableDialogVisible = false;
            isLoanedPersonnelStatusDialogVisible = false; // 选人
            orgTree: object[] = [];
            arrList: string[] = [];

            mounted() {
                // 获取组织树
                this.getTree()

                // 容器罐
                this.getContainerTypeList()
            }

            // 获取当前年月日 (年两位) 201010
            getNowFormatDate() {
                const date = new Date();
                const year = String(date.getFullYear());
                let month: string|number = date.getMonth() + 1;
                let strDate: number|string = date.getDate();
                if (Number(month) >= 1 && Number(month) <= 9) {
                    month = '0' + String(month);
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = '0' + strDate;
                }
                const currentdate = year.substr(2, 2) + month + strDate;
                return currentdate;
            }

            getContainerTypeList() {

                COMMON_API.HOLDER_DROPDOWN_API({ // /sysHolder/dropDown
                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                    holderType: ['027'],
                    holderNoList: ['004']
                }).then(({ data }) => {
                    console.log('容器罐')
                    console.log(data)
                    this.containerTypeList = []
                    data.data.forEach(item => {
                        this.containerTypeList.push({ dictCode: item.id, dictValue: item.holderName, dictNo: item.holderNo })
                    })
                })
            }

            changeContainerTypeOption(val, target) {

                if (val !== '') {
                    const temp = this.containerTypeList.filter(item => item.dictCode === val)[0]
                    target.injectionPotName = temp.dictValue as string

                    target.injectionPotNo = temp.dictNo as string
                } else {
                    target.injectionPotName = ''
                    target.injectionPotNo = ''
                }


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

            // 入罐
            async init(item) {
                this.currentTab = 'LY'
                console.log('入罐')
                console.log(item)

                this.headerInfo = {
                    fermentorStatus: item.fermentorStatus,
                    fermentorStatusName: item.fermentorStatusName,
                    holderName: item.holderName,
                    holderId: item.holderId
                }

                this.dialogTitle = item.holderName + 'LY/CY'
                this.isTableDialogVisible = true
                this.currentWorkShop = item.workshop
                this.currentCycle = item.cycle
                this.currentHolderId = item.holderId

                // ly
                await FER_API.FER_FERMENTOR_LY_BATCH_QUERY_API({
                    holderId: this.currentHolderId
                }).then(({ data }) => {
                    console.log('ly查询')
                    console.log(data)

                    this.lyDataGroup = []
                    if (data.data) {
                        this.lyDataGroup = data.data
                        this.lyDataGroup.forEach((element) => {
                            this.$set(element, 'delFlag', 0)
                        })
                    }
                    this.orgLyDataGroup = JSON.parse(JSON.stringify(this.lyDataGroup))

                })

                // cy
                await FER_API.FER_FERMENTOR_CY_BATCH_QUERY_API({
                    holderId: this.currentHolderId
                }).then(({ data }) => {
                    console.log('cy查询')
                    console.log(data)

                    this.cyDataGroup = []
                    if (data.data) {
                        this.cyDataGroup = data.data
                        this.cyDataGroup.forEach((element) => {
                            this.$set(element, 'delFlag', 0)
                        })
                    }
                    this.orgCyDataGroup = JSON.parse(JSON.stringify(this.cyDataGroup))

                })
                 // cy 物料
                this.getCyMatiral()

            }

            getCyMatiral() {
                COMMON_API.DICTQUERY_API({ dictType: 'CY_COMMENT' }).then(({ data }) => {
                    console.log('11111')
                    console.log(data)
                    this.CYProdcutMaterialOption = []
                    if (data.data.length !== 0) {
                        data.data.forEach(item => {
                            this.CYProdcutMaterialOption.push({ dictValue: item.dictValue, dictCode: item.dictCode })
                        })

                    }
                })
            }

            changeProdcutMaterialOption(val) {

            if (val !== '') {
                this.CYProdcutMaterial = this.CYProdcutMaterialOption.filter(item => item.dictCode === val)[0].dictValue as string
                this.cyMaterialCode = val
                this.cyMaterialName = this.CYProdcutMaterial
            } else {
                this.cyMaterialCode = ''
                this.cyMaterialName = ''
            }

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
                if (this.currentTab === 'LY') {
                    this.lyDataGroup[this.currentRowIndex].lyMans = item.join(',')
                } else {
                    this.cyDataGroup[this.currentRowIndex].cyMans = item.join(',')

                }
                this.isLoanedPersonnelStatusDialogVisible = false;

            }

            // 选择人员 正式借调
            selectUser(row, index) {
                this.isLoanedPersonnelStatusDialogVisible = true;
                this.currentRowIndex = index
                this.$nextTick(() => {
                    if (this.currentTab === 'LY') {
                        this.$refs.loanedPersonnel.init(row.lyMans, 'LY 操作人');
                    } else {
                        this.$refs.loanedPersonnel.init(row.cyMans, 'CY 操作人');
                    }
                });
            }


            // 新增行
            addNewDataRow() {
                if (this.currentTab === 'LY') {
                    this.lyDataGroup.push({
                        cycle: this.currentCycle,
                        fermentorId: this.headerInfo.holderId,
                        lyDate: '',
                        lyMans: '',
                        delFlag: 0,
                        remark: '',
                        changer: getUserNameNumber(),
                        changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
                    })

                } else {
                    this.cyDataGroup.push({
                        cycle: this.currentCycle,
                        checkStatus: '',
                        checkStatusName: '',
                        cyAmount: 0,
                        cyBatch: this.getNowFormatDate() + '1' + '777',
                        cyMans: '',
                        cyMaterialCode: '',
                        cyMaterialName: '',
                        cyMaterialType: 'ZHAL',
                        fermentorId: this.headerInfo.holderId,
                        injectionPotId: '416',
                        injectionPotName: '4#储罐（SC汁）',
                        injectionPotNo: '004',
                        delFlag: 0,
                        remark: '',
                        changer: getUserNameNumber(),
                        changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
                    })
                }

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

                if (this.currentTab === 'LY') {

                    if (this.ruleSubmit()) {
                    const obj = {}
                    const deleteItemsArray: string[] = []
                    const insertListArray: CurrentLyDataTable[] = []
                    const updateListArray: CurrentLyDataTable[] = []

                    this.lyDataGroup.forEach((item: CurrentLyDataTable, index) => {

                        if (item.delFlag === 1) {
                            if (item.id) {
                                deleteItemsArray.push(item.id)
                            }
                        } else if (item.id) {

                            if (!_.isEqual(this.orgLyDataGroup[index], item)) {
                                // item.potStatus = this.currentPotStatu
                                updateListArray.push(item)
                            }
                        } else {
                            // item.potStatus = this.currentPotStatus
                            insertListArray.push(item)
                        }
                    })

                    FER_API.FER_FERMENTOR_LY_SAVE_API({
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


                } else if (this.ruleSubmit()) {
                    const obj = {}
                    const deleteItemsArray: string[] = []
                    const insertListArray: CurrentCyDataTable[] = []
                    const updateListArray: CurrentCyDataTable[] = []

                    this.cyDataGroup.forEach((item: CurrentCyDataTable, index) => {

                        if (item.delFlag === 1) {
                            if (item.id) {
                                deleteItemsArray.push(item.id)
                            }
                        } else if (item.id) {

                            if (!_.isEqual(this.orgLyDataGroup[index], item)) {
                                // item.potStatus = this.currentPotStatus

                                item.cyMaterialCode = this.cyMaterialCode
                                item.cyMaterialName = this.cyMaterialName
                                updateListArray.push(item)
                            }
                        } else {
                            // item.potStatus = this.currentPotStatus

                            item.cyMaterialCode = this.cyMaterialCode
                            item.cyMaterialName = this.cyMaterialName
                            insertListArray.push(item)
                        }
                    })

                    FER_API.FER_FERMENTOR_CY_SAVE_API({
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
                if (this.currentTab === 'LY') {

                    if (this.lyDataGroup.length === 0 && this.lyDataGroup.filter(it => it.delFlag !== 1).length === 0) {
                        this.$warningToast('请录入 LY');
                        return false
                    }

                    // 表格栏位
                    for (const item of this.lyDataGroup.filter(it => it.delFlag !== 1)) {
                        if (!item.lyDate || !item.lyMans) {
                            this.$warningToast('请填写 LY 必填项');
                            return false
                        }
                    }
                } else {

                    if (this.CYProdcutMaterial === '' || this.CYProdcutMaterial === null) {
                        this.$warningToast('请选择 CY 物料');
                        return false
                    }

                    if (this.cyDataGroup.length === 0 && this.cyDataGroup.filter(it => it.delFlag !== 1).length === 0) {
                        this.$warningToast('请录入 CY');
                        return false
                    }

                    // 表格栏位
                    for (const item of this.cyDataGroup.filter(it => it.delFlag !== 1)) {
                        if (!item.cyAmount || !item.cyBatch || !item.cyMans) {
                            this.$warningToast('请填写 CY 必填项');
                            return false
                        }
                    }

                }

                return true
            }
        }


    interface Options{
        dictCode?: string;
        dictValue?: string;
        dictNo?: string;
    }

    interface ProductMaterial{
        dictCode?: string;
        dictValue?: string;
        id?: string;
    }

    //  这里的 cycle 类型跟其他接口有问题，现阶段用不到，所以不追究
    interface CurrentLyDataTable{
        changed: string;
        changer: string;
        cycle?: string;
        fermentorId: string;
        id?: string;
        lyDate: string;
        lyMans: string;
        remark: string;
        delFlag: number;
    }

    interface CurrentCyDataTable{
        changed: string;
        changer: string;
        checkStatus: string;
        checkStatusName: string;
        cyAmount: number;
        cyBatch: string;
        cyMans: string;
        cycle?: string;
        fermentorId: string;
        id?: string;
        injectionPotId: string;
        injectionPotName: string;
        injectionPotNo: string;
        remark: string;
        delFlag: number;
        cyMaterialCode: string;
        cyMaterialName: string;
        cyMaterialType: string;
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

    .inner-area__body >>> .el-tabs__header {
        display: none;
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
