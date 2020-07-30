<template>
    <div class="header_main">
        <mds-card title="考勤记录" :pack-up="false" name="evaluation">
            <template slot="titleBtn">
                <div style="display: flex; align-items: center;" class="floatr">
                    <el-form :model="searchForm" size="small" :inline="true" label-position="right" label-width="100px" class="sole_row" style="margin-right: 30px;">
                        <el-form-item label="生产车间：">
                            <el-select v-model="searchForm.workshop" class="selectwpx" style="width: 140px;" clearable @change="eventChangeWorkshopOptions">
                                <el-option v-for="(item,index) in workshopList" :key="item.targetCode+index" :label="item.targetName" :value="item.targetCode" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="产线工序：">
                            <el-select v-model="searchForm.productLine" class="selectwpx" style="width: 140px;" clearable>
                                <el-option v-for="(item,index) in productLineList" :key="item.targetCode+index" :label="item.targetName" :value="item.targetCode" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="考核日期：">
                            <el-date-picker v-model="searchForm.evaluationDate" type="date" value-format="yyyy-MM-dd" style="width: 160px;" />
                        </el-form-item>
                    </el-form>

                    <el-button type="primary" size="small" @click="btnGetResult(searchForm)">
                        查询
                    </el-button>
                    <el-button type="primary" size="small" @click="btnAddDataRow">
                        新增
                    </el-button>
                    <el-button type="danger" size="small" @click="btnReject">
                        撤回
                    </el-button>
                    <el-button type="danger" size="small" @click="btnRemoveDataRow">
                        删除
                    </el-button>
                </div>
            </template>
            <el-form ref="dataFormRules" :model="dataFormRules">
                <el-table class="newTable" :data="currentFormDataGroup" max-height="300" :row-class-name="RowDelFlag" header-row-class-name="tableHead" border style="width: 100%; min-height: 90px;">
                    <el-table-column
                        type="selection"
                        width="55"
                    />
                    <el-table-column label="序号" type="index" width="60" fixed align="center" />
                    <el-table-column prop="status" min-width="160" label="状态" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            {{ scope.row.status }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="workShop" min-width="160" label="车间" :show-overflow-tooltip="true">
                        <template slot="header">
                            <span class="notNull">*</span>车间
                        </template>
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.workShop" filterable placeholder="请选择" size="small" :disabled="!isRedact" clearable @change="eventChangeRowWorkshopOptions(scope.row)">
                                <el-option v-for="(item, index) in workshopList" :key="item.targetCode+index" :label="item.targetName" :value="item.targetCode" />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="productLine" label="产线/工序" min-width="220" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.productLine" filterable placeholder="请选择" size="small" :disabled="!isRedact" clearable>
                                <el-option v-for="(item, index) in scope.row.productLineList" :key="item.targetCode+index" :label="item.targetName" :value="item.targetCode" />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="classes" min-width="100" label="班次" :show-overflow-tooltip="true">
                        <template slot="header">
                            <span class="notNull">*</span>班次
                        </template>
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.classes" size="small" clearable :disabled="!isRedact">
                                <el-option
                                    v-for="(item, index) in classesOptions"
                                    :key="item.targetCode+index"
                                    :label="item.targetName"
                                    :value="item.targetCode"
                                />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="team" min-width="100" label="班组" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.team" size="small" clearable :disabled="!isRedact">
                                <el-option
                                    v-for="(item,index) in scope.row.teamOptions"
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
                            <el-select v-model="scope.row.userType" filterable placeholder="请选择" size="small" :disabled="!isRedact" clearable>
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
                                <span v-if="!isRedact" style="cursor: pointer;">
                                    <i v-for="(item, index) in scope.row.userList" :key="index">{{ item }}，</i>
                                </span>
                                <span v-if="isRedact && scope.row.userType !== 'EXTERNAL' && scope.row.userType !== 'TEMP'" style="cursor: pointer;" @click="selectUser(scope.row)">
                                    <i v-for="(item, index) in scope.row.userList" :key="index">{{ item }}，</i>
                                    <i>点击选择人员</i>
                                </span>
                                <span v-if="isRedact && (scope.row.userType === 'EXTERNAL' || scope.row.userType === 'TEMP')" style="cursor: pointer;" @click="dayLaborer(scope.row)">
                                    <i v-for="(item, index) in scope.row.userList" :key="index">{{ item }}，</i>
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
                            <el-date-picker v-model="scope.row.startTime" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="选择" size="small" :disabled="!isRedact" style="width: 180px;" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="dinner" width="135" label="用餐时间(MIN)" :show-overflow-tooltip="true">
                        <template slot="header">
                            <span class="notNull">*</span>用餐时间(MIN)
                        </template>
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.dinner" size="small" type="number" min="0" :disabled="!isRedact" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="endTime" min-width="210" label="结束时间" :show-overflow-tooltip="true">
                        <template slot="header">
                            <span class="notNull">*</span>结束时间
                        </template>
                        <template slot-scope="scope">
                            <el-date-picker v-model="scope.row.endTime" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="选择" size="small" :disabled="!isRedact" style="width: 180px;" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="duration" min-width="80" label="时长(H)" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <p> {{ scope.row.duration = Number(workTime(scope.row.endTime, scope.row.startTime, scope.row)) }} H </p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="jobContent" min-width="200" label="工作内容" :show-overflow-tooltip="true">
                        <template slot="header">
                            <span class="notNull">*</span>工作内容
                        </template>
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.jobContent" size="small" :disabled="!isRedact" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="remark" min-width="200" label="备注" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.remark" size="small" :disabled="!isRedact" />
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
                            <el-button type="text" size="small" :disabled="!isRedact" @click="btnEditDataRow(scope.row)">
                                编辑
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <el-pagination :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
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
    // import _ from 'lodash';


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
            evaluationDate: ''
        }

        currentRow=0
        currentWorkshop=''
        currentProductLine=''
        currentEvaluationDate=''

        workshopList: OptionsInList[]=[] // 车间清单
        productLineList: OptionsInList[]=[] // 产线清单
        classesOptions: OptionsInList[]=[] // 班次清单
        // teamOptions: OptionsInList[]=[] // 班组清单
        userTypeList: UserTypeListObject[] = []; // 人员属性清单

        totalCount = 1
        currPage = 1
        pageSize = 10

        isRedact=true


        // 常有变数
        currentFormDataGroup: CurrentDataTable[] = [] // 主 data
        orgFormDataGroup: CurrentDataTable[] = [] // 主 data 复制

        officialWorkerStatus = false;
        loanedPersonnelStatus = false;
        temporaryWorkerStatus = false;

        basicUnitName=''
        ratio=1
        readAudit= []
        ruleForm={
        }

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
            COMMON_API.ORG_QUERY_WORKSHOP_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                deptType: ['WORK_SHOP']
            }).then(({ data }) => {
                this.workshopList = []
                data.data.forEach(item => {
                    this.workshopList.push({ targetCode: item.deptCode, targetName: item.deptName })
                })
            })


            // 人员属性
            COMMON_API.DICTQUERY_API({ dictType: 'COMMON_USER_TYPE' }).then(({ data }) => {
                this.userTypeList = data.data
            });

            // 班次
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

        getDataList() {

            COMMON_API.CHECKWORK_QUERY_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                productLine: this.currentProductLine,
                workShop: this.currentWorkshop,
                size: this.pageSize,
                current: this.totalCount,
                checkWorkDate: this.currentEvaluationDate
                }).then(({ data }) => {
                    console.log('查寻结果')
                    console.log(data)
                if (data.data.records !== null || data.data.records.length !== 0) {
                    this.currentFormDataGroup = data.data.records
                    this.totalCount = data.data.total
                    this.currPage = data.data.current
                    this.pageSize = data.data.size
                }
            })
        }

            // 员工确认
        changeUser(userId) {
            this.currentFormDataGroup[this.currentRow].userList = userId
            this.officialWorkerStatus = false;
            this.loanedPersonnelStatus = false;
            this.temporaryWorkerStatus = false;
        }

        eventChangeWorkshopOptions(val) {
            if (val !== '') {
                COMMON_API.ORG_QUERY_CHILDREN_API({
                    parentId: val || '',
                    deptType: 'PRODUCT_LINE'
                }).then(({ data }) => {
                    this.productLineList = []
                    data.data.forEach(item => {
                        this.productLineList.push({ targetCode: item.deptCode, targetName: item.deptName })
                    })
                })
            }
        }

        eventChangeRowWorkshopOptions(row) {
            console.log(row)
            COMMON_API.ORG_QUERY_CHILDREN_API({
                parentId: row.workShop || '',
                deptType: 'PRODUCT_LINE'
            }).then(({ data }) => {
                row.productLineList = []
                data.data.forEach(item => {
                    row.productLineList.push({ targetCode: item.deptCode, targetName: item.deptName })
                })
            })

            // 获取班组
            this.getTeamList(row)
        }

        btnGetResult(obj) {
            COMMON_API.CHECKWORK_QUERY_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                productLine: obj.productLine,
                workShop: obj.workshop,
                size: this.pageSize,
                current: this.totalCount,
                checkWorkDate: obj.evaluationDate
                }).then(({ data }) => {
                    console.log('查寻结果')
                    console.log(data)
                if (data.data.records !== null || data.data.records.length !== 0) {
                    this.currentFormDataGroup = data.data.records
                    this.totalCount = data.data.total
                    this.currPage = data.data.current
                    this.pageSize = data.data.size

                    // 存全局变量
                    this.currentWorkshop = obj.workshop
                    this.currentProductLine = obj.productLine
                    this.currentEvaluationDate = obj.evaluationDate

                } else {
                    this.$infoToast('暂无任何内容');
                    this.currentWorkshop = ''
                    this.currentProductLine = ''
                    this.currentEvaluationDate = ''
                }
            })
        }

        workTime(end, start, row) {
            let diff = '0';
            if (end && start && row.delFlag !== 1) {
                diff = getDateDiff(start, end, 'hour');
            }
            return diff;
        }

        // 编辑
        btnEditDataRow() {
            //
        }

        // 新增
        btnAddDataRow() {
            const sole: CurrentDataTable = {
                    classes: '',
                    jobContent: '',
                    productLine: '',
                    userType: '',
                    userList: [],
                    duration: 0,
                    id: '',
                    startTime: '',
                    endTime: '',
                    dinner: 0,
                    status: '',
                    team: '',
                    remark: '',
                    workShop: this.searchForm.workshop,
                    changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                    changer: getUserNameNumber(),
                    delFlag: 0,
                    productLineList: [],
                    teamOptions: []
                }
            this.currentFormDataGroup.push(sole)
        }

        btnReject() {
            //
        }

        btnRemoveDataRow() {
            //
        }

        //  RowDelFlag
        RowDelFlag({ row }) {
            if (row.delFlag === 1) {
                return 'rowDel';
            }
            return '';

        }

        // 班组
        getTeamList(row) {
            const temp: OptionsInList[] = this.workshopList.filter(item => item.targetCode === row.workShop)

            COMMON_API.SYS_CHILDTYPE_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                deptType: ['PRODUCT_TEAM'],
                deptName: temp[0].targetName
            }).then(({ data }) => {
                console.log('33333')
                console.log(data)
                row.teamOptions = [];
                data.data.forEach(item => {
                    row.teamOptions.push({ targetCode: item.deptCode, targetName: item.deptName })
                });
            });
        }

        handleSizeChange(val) {
            this.pageSize = val;
            this.getDataList();
        }

        handleCurrentChange(val) {
            this.pageSize = val;
            this.getDataList();
        }

        async init() {
            // PKG_API.PKG_INSTORAGE_QUERY_API({
            //     factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
            //     orderNo: formHeader.orderNo,
            //     materialCode: formHeader.materialCode
            // }).then(({ data }) => {
            //     if (data.data.length !== 0) {
            //         this.currentFormDataGroup = JSON.parse(JSON.stringify(data.data.inStorages))
            //         this.orgFormDataGroup = JSON.parse(JSON.stringify(data.data.inStorages))
            //         this.setValidate(this.currentFormDataGroup, this.ruleForm)
            //     }
            //     this.basicUnitName = data.data.basicUnitName
            //     this.ratio = data.data.ratio
            //     if (this.unitOptions.length === 0) {
            //         this.unitOptions.push({ key: data.data.basicUnit, value: data.data.basicUnitName })
            //         this.unitOptions.push({ key: data.data.productUnit, value: data.data.productUnitName })
            //     }


            // });
        }

        // 选择人员 正式借调
        selectUser(row: CurrentDataTable) {
            console.log(row)
            // this.row = row;
            if (row.userType === 'FORMAL') { // 正式
                if (row.productLine) {
                    this.officialWorkerStatus = true;
                    this.$nextTick(() => {
                        this.$refs.officialWorker.init(row.productLine, row.userList);
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

        // 提交时跑校验
        ruleSubmit() {
            // if (this.currentFormDataGroup.filter(it => it.delFlag !== 1).length === 0) {
            //     this.$warningToast('请录入生产入库');
            //     return false
            // }
            // for (const item of this.currentFormDataGroup.filter(it => it.delFlag !== 1)) {
            //     if (!item.productDate || !item.classes || !item.batch || !item.inStorageCount || !item.inStorageUnit) {
            //         this.$warningToast('请填写生产入库必填项');
            //         return false
            //     }
            // }
            // return true
        }


        savedData() {
            //
        }

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
        status?: string;
        team?: string;
        userList?: string[];
        userType?: string;
        workShop?: string;
        delFlag?: number;
        productLineList: OptionsInList[];
        teamOptions: OptionsInList[];
}
interface OptionsInList{
    targetCode?: string;
    targetName?: string;
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

.header_main >>> .box-card-title {
    margin-bottom: 10px;
}
</style>
