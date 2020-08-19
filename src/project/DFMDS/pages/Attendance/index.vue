<template>
    <div class="header_main">
        <mds-card title="考勤记录" :pack-up="false" name="evaluation" class="searchCard">
            <template slot="titleBtn">
                <div style="display: flex; align-items: center; justify-content: space-between; white-space: nowrap;">
                    <el-form :model="searchForm" size="small" :inline="true" label-position="left" label-width="70px" class="sole_row">
                        <el-form-item label="生产车间：" class="must-fill" label-width="80px">
                            <el-select v-model="searchForm.workshop" class="selectwpx" style="width: 140px;" clearable @change="eventChangeWorkshopOptions">
                                <el-option v-for="(item,index) in selectTree" :key="item.targetCode+index" :label="item.targetName" :value="item.targetCode" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="产线工序：">
                            <el-select v-model="searchForm.productLine" class="selectwpx" style="width: 140px;" clearable :disabled="searchForm.workshop===''">
                                <el-option v-for="(item,index) in productLineList" :key="item.targetCode+index" :label="item.targetName" :value="item.targetCode" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="考勤开始日期：" label-width="100px">
                            <el-date-picker v-model="searchForm.evaluationStartDate" type="date" value-format="yyyy-MM-dd" placeholder="请输入" style="width: 140px;" /> - <el-date-picker v-model="searchForm.evaluationEndDate" type="date" value-format="yyyy-MM-dd" placeholder="请输入" style="width: 140px;" />
                        </el-form-item>
                    </el-form>
                    <div class="button-group" style="white-space: nowrap;">
                        <el-button v-if="isAuth('kqQuery')" type="primary" size="small" :disabled="searchForm.workshop===''" @click="btnGetResult(searchForm)">
                            查询
                        </el-button>
                        <el-button v-if="isAuth('kqInsert')" type="primary" size="small" @click="btnAddDataRow">
                            新增
                        </el-button>
                        <el-button v-if="isAuth('kqSave')" type="primary" size="small" :disabled="currentFormDataGroup.length===0||!checkSaveStatus" @click="btnSaveData">
                            保存
                        </el-button>
                        <!-- <el-button type="danger" size="small" @click="btnReject">
                            撤回
                        </el-button>-->
                        <el-button v-if="isAuth('kqDel')" type="danger" size="small" :disabled="multipleSelection.length===0" @click="btnRemoveDataRow">
                            删除
                        </el-button>
                    </div>
                </div>
            </template>
            <el-form ref="dataFormRules" :model="dataFormRules">
                <el-table class="newTable" :data="currentFormDataGroup" :height="mainClientHeight - 52 - 39 - 47" :row-class-name="rowDelFlag" header-row-class-name="tableHead" border style="width: 100%; min-height: 90px;" @selection-change="handleSelectionChange">
                    <el-table-column
                        v-if="currentFormDataGroup.length!==0"
                        type="selection"
                        width="55"
                    />
                    <el-table-column label="序号" type="index" :index="index => getIndexMethod(index, currentFormDataGroup)" width="50" fixed align="center" />
                    <el-table-column prop="workShop" min-width="160" label="车间" :show-overflow-tooltip="true">
                        <template slot="header">
                            <span class="notNull">*</span>车间
                        </template>
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.workShop" filterable placeholder="请选择" size="small" :disabled="!scope.row.isRedact" clearable @change="eventChangeRowWorkshopOptions(scope.row)">
                                <el-option v-for="(item, index) in scope.row.tempWorkshopList" :key="item.targetCode+index" :label="item.targetName" :value="item.targetCode" />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="productLine" label="产线/工序" min-width="220" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.productLine" filterable placeholder="请选择" size="small" :disabled="!scope.row.isRedact" clearable>
                                <el-option v-for="(item, index) in scope.row.tempProductLineList" :key="item.targetCode+index" :label="item.targetName" :value="item.targetCode" />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="classes" min-width="100" label="班次" :show-overflow-tooltip="true">
                        <template slot="header">
                            <span class="notNull">*</span>班次
                        </template>
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.classes" size="small" clearable :disabled="!scope.row.isRedact">
                                <el-option
                                    v-for="(item, index) in classesOptions"
                                    :key="item.targetCode+index"
                                    :label="item.targetName"
                                    :value="item.targetCode"
                                />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="team" min-width="160" label="班组" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.team" size="small" clearable :disabled="!scope.row.isRedact">
                                <el-option
                                    v-for="(item,index) in scope.row.tempTeamOptionsList"
                                    :key="item.targetCode+index"
                                    :label="item.targetName"
                                    :value="item.targetCode"
                                />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="userType" min-width="125" label="人员属性" :show-overflow-tooltip="true">
                        <template slot="header">
                            <span class="notNull">*</span>人员属性
                        </template>
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.userType" filterable placeholder="请选择" size="small" :disabled="!scope.row.isRedact" clearable>
                                <el-option v-for="(iteam, index) in userTypeList" :key="index" :label="iteam.dictValue" :value="iteam.dictCode" />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="userList" min-width="190" label="人员" :show-overflow-tooltip="true">
                        <template slot="header">
                            <span class="notNull">*</span>人员
                        </template>
                        <template slot-scope="scope">
                            <div class="required" style="min-height: 32px; line-height: 32px;">
                                <span v-if="!scope.row.isRedact" style="cursor: pointer;">
                                    <i v-for="(item, index) in scope.row.userList" :key="index">{{ item }}</i>
                                </span>
                                <span v-if="scope.row.isRedact && scope.row.userType !== 'EXTERNAL' && scope.row.userType !== 'TEMP'" style="cursor: pointer;" @click="selectUser(scope.row)">
                                    <i v-for="(item, index) in scope.row.userList" :key="index">{{ item }}</i>
                                    <i>点击选择人员</i>
                                </span>
                                <span v-if="scope.row.isRedact && (scope.row.userType === 'EXTERNAL' || scope.row.userType === 'TEMP')" style="cursor: pointer;" @click="dayLaborer(scope.row)">
                                    <i v-for="(item, index) in scope.row.userList" :key="index">{{ item }}</i>
                                    <i>点击输入人员</i>
                                </span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="startTime" width="210" label="开始时间" :show-overflow-tooltip="true">
                        <template slot="header">
                            <span class="notNull">*</span>开始时间
                        </template>
                        <template slot-scope="scope">
                            <el-date-picker v-model="scope.row.startTime" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="选择" size="small" :disabled="!scope.row.isRedact" style="width: 180px;" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="dinner" width="135" label="用餐时间(MIN)" :show-overflow-tooltip="true">
                        <template slot="header">
                            <span class="notNull">*</span>用餐时间(MIN)
                        </template>
                        <template slot-scope="scope">
                            <el-input v-model.number="scope.row.dinner" size="small" :disabled="!scope.row.isRedact" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="endTime" min-width="210" label="结束时间" :show-overflow-tooltip="true">
                        <template slot="header">
                            <span class="notNull">*</span>结束时间
                        </template>
                        <template slot-scope="scope">
                            <el-date-picker v-model="scope.row.endTime" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="选择" size="small" :disabled="!scope.row.isRedact" style="width: 180px;" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="duration" min-width="80" label="时长(H)" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <p> {{ Object.is(NaN,workTimeCount(scope.row,scope.$index))?0:workTimeCount(scope.row,scope.$index) }} H </p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="jobContent" min-width="200" label="工作内容" :show-overflow-tooltip="true">
                        <template slot="header">
                            <span class="notNull">*</span>工作内容
                        </template>
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.jobContent" size="small" :disabled="!scope.row.isRedact" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="remark" min-width="200" label="备注" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.remark" size="small" :disabled="!scope.row.isRedact" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="changer" min-width="140" label="操作人" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            {{ scope.row.changer }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="changed" min-width="180" label="操作时间" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            {{ scope.row.changed }}
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" width="90" prop="verify_date" label="操作" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-button v-if="isAuth('kqSave')" class="editBtn" icon="el-icon-edit" type="text" size="small" :disabled="scope.row.isRedact" @click="btnEditDataRow(scope.row)">
                                编辑
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <el-pagination v-if="currentFormDataGroup.length!==0" :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </mds-card>

        <official-worker v-if="officialWorkerStatus" ref="officialWorker" @changeUser="changeUser" />
        <loaned-personnel v-if="loanedPersonnelStatus" ref="loanedPersonnel" @changeUser="changeUser" />
        <temporary-worker v-if="temporaryWorkerStatus" ref="temporaryWorker" @changeUser="changeUser" />
    </div>
</template>


<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { dateFormat, getUserNameNumber, getDateDiff } from 'utils/utils';
    import { COMMON_API } from 'common/api/api';
    // import _ from 'lodash';
    import OfficialWorker from 'components/OfficialWorker.vue';
    import LoanedPersonnel from 'components/LoanedPersonnel.vue';
    import TemporaryWorker from 'components/TemporaryWorker.vue';
    import _ from 'lodash';


    @Component({
        name: 'Attendance',
        components: {
            OfficialWorker,
            LoanedPersonnel,
            TemporaryWorker
        }
    })
    export default class Attendance extends Vue {

        $refs: {
            dataFormRules: HTMLFormElement;
            officialWorker: HTMLFormElement;
            loanedPersonnel: HTMLFormElement;
            temporaryWorker: HTMLFormElement;
        }

        searchForm={
            workshop: '',
            productLine: '',
            evaluationStartDate: '',
            evaluationEndDate: ''
        }

        currentRow: CurrentDataTable = {
            userList: []
        }

        currentWorkshop=''
        currentProductLine=''
        currentEvaluationStartDate=''
        currentEvaluationEndDate=''
        selectTree: OptionsTreeList[]=[] // 选单结构树
        workshopList: OptionsInList[]=[] // 车间清单
        productLineList: OptionsInList[]=[] // 产线清单
        classesOptions: OptionsInList[]=[] // 班次清单
        userTypeList: UserTypeListObject[] = [] // 人员属性清单

        multipleSelection: CurrentDataTable[]=[] // table 内选中 item


        totalCount = 1
        currPage = 1
        pageSize = 10

        // isRedact=true 保存按钮状态激活
        checkSaveStatus=false

        // 常有变数
        currentFormDataGroup: CurrentDataTable[] = [] // 主 data
        orgFormDataGroup: CurrentDataTable[] = [] // 主 data 复制

        officialWorkerStatus = false;
        loanedPersonnelStatus = false;
        temporaryWorkerStatus = false;

        dataFormRules= {
            workShop: [
                { required: true, message: '请选择', trigger: 'change' }
            ],
            classes: [
                { required: true, message: '请选择', trigger: 'change' }
            ],
            userType: [
                { required: true, message: '请选择', trigger: 'change' }
            ],
            userList: [
                { required: true, message: '请输入', trigger: 'change' }
            ],
            startTime: [
                { required: true, message: '请输入', trigger: 'blur' }
            ],
            endTime: [
                { required: true, message: '请输入', trigger: 'blur' }
            ],
            dinner: [
                { required: true, message: '请输入', trigger: 'blur' }
            ],
            jobContent: [
                { required: true, message: '请输入', trigger: 'change' }
            ]
        }


    mounted() {
        // 获取车间下拉
        COMMON_API.ORG_QUERY_WORKSHOP_API({
            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
            deptType: ['WORK_SHOP']
        }).then(({ data }) => {
            this.workshopList = []
            data.data.forEach(item => {
                this.workshopList.push({ targetCode: item.deptCode, targetName: item.deptName })
                this.selectTree.push({ targetCode: item.deptCode, targetName: item.deptName, productLine: [], team: [] })

                this.selectTree.forEach(element => {

                        COMMON_API.ORG_QUERY_CHILDREN_API({
                            parentId: element.targetCode || '',
                            deptType: 'PRODUCT_LINE'

                        }).then(({ data: target }) => {
                            element.productLine = []
                            target.data.forEach(items => {
                                element.productLine.push({ targetCode: items.deptCode, targetName: items.deptName })
                            })
                        })

                        // if (element.targetName !== '发酵车间') {

                            COMMON_API.SYS_CHILDTYPE_API({
                                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                                deptType: ['PRODUCT_TEAM'],
                                deptName: element.targetName.substring(0, 2)

                            }).then(({ data: target }) => {
                                element.team = []
                                if (target.data !== null) {
                                    target.data.forEach(items => {
                                        element.team.push({ targetCode: items.deptCode, targetName: items.deptName })
                                    });
                                }

                            });
                        // }
                })
            })

        })


        // 获取人员属性下拉
        COMMON_API.DICTQUERY_API({ dictType: 'COMMON_USER_TYPE' }).then(({ data }) => {
            this.userTypeList = data.data
        });

        // 获取班次下拉
        COMMON_API.DICTQUERY_API({ dictType: 'COMMON_CLASSES' }).then(({ data }) => {
            this.classesOptions = []
            data.data.forEach((item) => {
                this.classesOptions.push({
                    targetName: item.dictValue,
                    targetCode: item.dictCode
                })
            })
        });

    }

        get mainClientHeight() {
            return this.$store.state.common.mainClientHeight;
        }

        // 切换页码
        getDataList() {
            COMMON_API.CHECKWORK_QUERY_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                productLine: this.currentProductLine,
                workShop: this.currentWorkshop,
                size: this.pageSize,
                current: this.totalCount,
                checkWorkDate: this.currentEvaluationStartDate,
                checkWorkEndDate: this.currentEvaluationEndDate
                }).then(({ data }) => {
                    console.log('查寻结果')
                    console.log(data)
                if (data.data.records && data.data.records.length !== 0) {
                    this.currentFormDataGroup = data.data.records

                    // 对回传参数加工
                    this.currentFormDataGroup.forEach(item => {
                        item.tempWorkshopList = this.selectTree
                        item.tempProductLineList = this.selectTree.filter(element => element.targetCode === this.currentWorkshop)[0].productLine
                        item.tempTeamOptionsList = this.selectTree.filter(element => element.targetCode === this.currentWorkshop)[0].team
                        item.isRedact = false
                    })
                    this.totalCount = data.data.total
                    this.currPage = data.data.current
                    this.pageSize = data.data.size
                }
            })
        }

        // 点击查询按钮
        btnGetResult(obj) {
            this.currPage = 1;
            COMMON_API.CHECKWORK_QUERY_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                productLine: obj.productLine,
                workShop: obj.workshop,
                size: this.pageSize,
                current: this.currPage,
                checkWorkDate: obj.evaluationStartDate,
                checkWorkEndDate: obj.evaluationEndDate
                }).then(({ data }) => {
                    this.checkSaveStatus = false
                    console.log('查寻结果')
                    console.log(data)
                if (data.data.records && data.data.records.length !== 0) {
                    this.currentFormDataGroup = data.data.records
                    this.orgFormDataGroup = JSON.parse(JSON.stringify(this.currentFormDataGroup))
                    // 对回传参数加工
                    this.currentFormDataGroup.forEach(item => {
                        item.tempWorkshopList = this.selectTree
                        item.tempProductLineList = this.selectTree.filter(element => element.targetCode === obj.workshop)[0].productLine
                        item.tempTeamOptionsList = this.selectTree.filter(element => element.targetCode === obj.workshop)[0].team
                        item.isRedact = false
                    })
                    this.totalCount = data.data.total
                    this.currPage = data.data.current
                    this.pageSize = data.data.size

                    // 存全局变量
                    this.currentWorkshop = obj.workshop
                    this.currentProductLine = obj.productLine
                    this.currentEvaluationStartDate = obj.evaluationStartDate
                    this.currentEvaluationEndDate = obj.evaluationEndDate

                } else {
                    this.$infoToast('暂无任何内容');
                    this.currentFormDataGroup = []
                    this.currentWorkshop = ''
                    this.currentProductLine = ''
                    this.currentEvaluationStartDate = ''
                    this.currentEvaluationEndDate = ''
                }
            })
        }

        // 表格 row 选中
        handleSelectionChange(val) {
            this.multipleSelection = val;
        }

        // 保存
        btnSaveData() {
            if (this.ruleSubmit()) {
                const delIdsTemp: string[] = [];
                const insertDataTemp: CurrentDataTable[] = [];
                const updateDataTemp: CurrentDataTable[] = [];
                const tempCurrentFormDataGroup = JSON.parse(JSON.stringify(this.currentFormDataGroup))
                // 除去加工变数
                tempCurrentFormDataGroup.forEach((item, index) => {
                    delete item.tempWorkshopList
                    delete item.tempProductLineList
                    delete item.tempTeamOptionsList
                    delete item.isRedact
                    if (item.delFlag === 1) {
                        if (item.id) {
                            delIdsTemp.push(item.id)
                        }
                    } else if (item.id) {
                        // if (!item.startTime.split(':')[2]) {
                        //     item.startTime = item.startTime + ':00'
                        // }
                        // if (!item.endTime.split(':')[2]) {
                        //     item.endTime = item.endTime + ':00'
                        // }

                        if (!_.isEqual(this.orgFormDataGroup[index], item)) {
                            updateDataTemp.push(item)
                        }
                    } else {
                        // if (!item.startTime.split(':')[2]) {
                        //     item.startTime = item.startTime + ':00'
                        // }
                        // if (!item.endTime.split(':')[2]) {
                        //     item.endTime = item.endTime + ':00'
                        // }
                        insertDataTemp.push(item)
                    }
                })

                if (!(delIdsTemp.length === 0 && insertDataTemp.length === 0 && updateDataTemp.length === 0)) {
                    COMMON_API.CHECKWORK_SAVE_API({
                        delIds: delIdsTemp,
                        insertData: insertDataTemp,
                        updateData: updateDataTemp
                        }).then(() => {
                            this.$successToast('操作成功');
                            this.checkSaveStatus = false
                            // this.currPage = 1;
                            // this.totalCount = 1
                            // this.pageSize = 10
                            // this.getDataList()
                            this.currentFormDataGroup.forEach(item => {
                                item.isRedact = false
                            })

                    })
                } else {
                        this.checkSaveStatus = false
                        // this.currPage = 1;
                        // this.totalCount = 1
                        // this.pageSize = 10
                        // this.getDataList()
                }
            }
        }

            // 员工确认
        changeUser(userId) {
            this.currentRow.userList = userId
            this.officialWorkerStatus = false;
            this.loanedPersonnelStatus = false;
            this.temporaryWorkerStatus = false;
        }

        // 标头下拉生产车间操作
        eventChangeWorkshopOptions(val) {
            if (val !== '') {
                this.productLineList = this.selectTree.filter(item => item.targetCode === val)[0].productLine
            }
        }

        // table 下拉生产车间操作
        eventChangeRowWorkshopOptions(row) {
            row.tempProductLineList = []
            row.tempProductLineList = this.selectTree.filter(item => item.targetCode === row.workShop)[0].productLine

            // 获取班组
            this.getTeamList(row)
        }

        // 计算时长
        workTimeCount(row, index) {
            let num: number = this.currentFormDataGroup[index].duration as number;
            if (row.delFlag !== 1 && row.isRedact === true) { // 避免锅次呼叫，增加判断，若不是新增的 row 且编辑状态
                num = Number(getDateDiff(row.startTime, row.endTime, 'hour'))
                this.currentFormDataGroup[index].duration = num
            }
            return num;
        }

        // 编辑
        btnEditDataRow(row) {
            row.isRedact = true
            this.checkSaveStatus = true // 保存按钮状态激活
        }

        // 新增
        btnAddDataRow() {
            const sole: CurrentDataTable = {
                    classes: '',
                    jobContent: '',
                    productLine: this.searchForm.productLine,
                    userType: '',
                    userList: [],
                    duration: 0,
                    id: '',
                    startTime: '',
                    endTime: '',
                    dinner: 0,
                    // status: '未保存',
                    team: '',
                    remark: '',
                    workShop: this.searchForm.workshop,
                    changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                    changer: getUserNameNumber(),
                    delFlag: 0,
                    tempProductLineList: this.productLineList,
                    tempWorkshopList: this.workshopList,
                    tempTeamOptionsList: this.searchForm.workshop !== '' ? this.selectTree.filter(item => item.targetCode === this.searchForm.workshop)[0].team : [],
                    isRedact: true
                }
            this.currentFormDataGroup.push(sole)
            this.checkSaveStatus = true
        }

        // [BTN]撤回
        // btnReject() {
        //     if (this.multipleSelection.length !== 0) {
        //         COMMON_API.CHECKWORK_REJECT_API({
        //             ids: []
        //         }).then(({ data }) => {
        //             this.multipleSelection.forEach(item => {
        //                 item.delFlag = 1
        //             })
        //             console.log('已撤回')
        //             console.log(data)
        //             this.multipleSelection = []
        //             // reload 页面
        //             this.totalCount = 1
        //             this.currPage = 1
        //             this.pageSize = 10
        //             this.getDataList()
        //         });
        //     }
        // }

        // [BTN]删除
        btnRemoveDataRow() {

            const tempCurrentFormDataGroup = this.currentFormDataGroup.filter(item => item.isRedact === true)
            const tempMultipleSelection = this.multipleSelection.filter(item => item.isRedact === true)

            if (_.isEqual(_.sortBy(tempCurrentFormDataGroup, ['id']), _.sortBy(tempMultipleSelection, ['id'])) !== true) {
                this.$warningToast('请先对已编辑栏位保存');
            } else {
                this.$confirm('是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.multipleSelection.forEach(item => {
                        item.delFlag = 1
                    })
                    // this.$successToast('删除成功');
                    this.multipleSelection = []
                    this.btnSaveData()
                });
            }
        }


        // 班组
        getTeamList(row) {
            row.tempTeamOptionsList = []
            row.tempTeamOptionsList = this.selectTree.filter(item => item.targetCode === row.workShop)[0].team
        }

        handleSizeChange(val) {
            this.pageSize = val;
            this.getDataList();
        }

        handleCurrentChange(val) {
            this.pageSize = val;
            this.getDataList();
        }


        // 选择人员 正式借调
        selectUser(row: CurrentDataTable) {
            this.currentRow = row
            if (row.userType === 'FORMAL') { // 正式
                if (row.team) {
                    this.officialWorkerStatus = true;
                    this.$nextTick(() => {
                        this.$refs.officialWorker.init(row.team, row.userList);
                    });
                } else {
                    this.$warningToast('请选择产线');
                }
            } else if (row.userType === 'INTERNAL' || row.userType === 'STUDY') { // 内部借调、学习
                const userType: (UserTypeListObject | undefined) = this.userTypeList.find((item: UserTypeListObject) => item.dictCode === row.userType);
                this.loanedPersonnelStatus = true;
                if (userType) {
                    this.$nextTick(() => {
                        this.$refs.loanedPersonnel.init(row.userList, userType['dictValue']);
                    });
                }
            } else {
                this.$warningToast('请选择人员属性');
            }
        }

            // 临时工
        dayLaborer(row: CurrentDataTable) {
            this.currentRow = row
            const userType: (UserTypeListObject | undefined) = this.userTypeList.find((item: UserTypeListObject) => item.dictCode === row.userType);
            this.temporaryWorkerStatus = true;
            if (userType) {
                this.$nextTick(() => {
                    this.$refs.temporaryWorker.init(row, userType['dictValue']);
                });
            }
        }

        // 提交时跑校验
        ruleSubmit() {
            let currentFormDataGroupNew: CurrentDataTable[] = [];
            currentFormDataGroupNew = this.currentFormDataGroup.filter(item => item.delFlag === 0);

            for (const item of currentFormDataGroupNew) {
                if (!item.workShop || !item.classes || !item.userType || item.userList.length === 0 || !item.startTime || !item.endTime || !((item.dinner as number) >= 0) || !item.jobContent) {
                    this.$warningToast('请填写必填项');
                    return false
                }
            }
            return true
        }


        //  rowDelFlag
        rowDelFlag({ row }) {
            if (row.delFlag === 1) {
                return 'rowDel';
            }
            return '';
        }

        // 删除行
        removeDataRow(row) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                row.delFlag = 1;
            });
        }


    }

interface CurrentDataTable {
        changed?: string;
        changer?: string;
        classes?: string;
        dinner?: number;
        duration?: number;
        endTime?: string;
        id?: string;
        jobContent?: string;
        productLine?: string;
        remark?: string;
        startTime?: string;
        // status?: string;
        team?: string;
        userList: string[];
        userType?: string;
        workShop?: string;
        delFlag?: number;
        tempProductLineList?: OptionsInList[];
        tempTeamOptionsList?: OptionsInList[];
        tempWorkshopList?: OptionsInList[];
        isRedact?: boolean;
}
interface OptionsInList{
    targetCode?: string;
    targetName?: string;
}

interface OptionsTreeList{
    targetCode?: string;
    targetName: string;
    productLine: OptionsInList[];
    team: OptionsInList[];
}

interface UserTypeListObject {
    dictCode?: string;
    dictId?: string;
    dictValue?: string;
    factoryName?: string;
    id?: string;
}
</script>


<style scoped>
.header_main >>> .box-card h3 {
    display: none;
}
.header_main >>> .box-card-title {
    margin-bottom: 10px;
}
.required span i::after {
    margin-left: -2px;
    content: ",";
}
.required span i:last-child::after {
    margin-left: -2px;
    content: "";
}
.searchCard >>> .must-fill > label::before {
    margin-right: 4px;
    color: #f56c6c;
    content: "*";
}
</style>
