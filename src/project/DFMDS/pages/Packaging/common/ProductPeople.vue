<template>
    <div>
        <mds-card title="人员统计" :name="'productPeople'">
            <template slot="titleBtn">
                <div style="float: right;">
                    <el-button type="primary" size="small" :disabled="!isRedact" @click="addNewDataRow()">
                        新增
                    </el-button>
                </div>
            </template>
            <el-table class="newTable" :data="currentFormDataGroup" header-row-class-name="tableHead" border style="width: 100%; max-height: 200px;" @cell-click="compareChange">
                <el-table-column label="序号" type="index" width="60" fixed />
                <el-table-column prop="status" min-width="100" :show-overflow-tooltip="true">
                    <template slot="header">
                        <span class="notNull">*</span>班次
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.classes" size="small" clearable @change="compareChange(scope.row)">
                            <el-option
                                v-for="item in classesOptions"
                                :key="item.dictCode"
                                :label="item.dictValue"
                                :value="item.dictCode"
                            />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="memo" min-width="120" :show-overflow-tooltip="true">
                    <template slot="header">
                        <span class="notNull">*</span>班组/工序
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.deptId" filterable placeholder="请选择" size="small" :disabled="!isRedact" clearable @change="selectDept(scope.row)">
                            <el-option v-for="(iteam, index) in teamList" :key="index" :label="iteam.deptName" :value="iteam.id" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="verify_man" min-width="130" :show-overflow-tooltip="true">
                    <template slot="header">
                        <span class="notNull">*</span>人员属性
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.userType" filterable placeholder="请选择" size="small" :disabled="!isRedact" clearable @change="compareChange(scope.row)">
                            <el-option v-for="(iteam, index) in userTypeList" :key="index" :label="iteam.dictValue" :value="iteam.dictCode" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="verify_date" min-width="200" :show-overflow-tooltip="true">
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
                <el-table-column prop="verify_date" width="220" :show-overflow-tooltip="true">
                    <template slot="header">
                        <span class="notNull">*</span>开始时间
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.startDate" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy.MM.dd HH:mm" placeholder="选择" size="small" :disabled="!isRedact" style="width: 180px;" />
                    </template>
                </el-table-column>
                <el-table-column prop="verify_date" width="140" :show-overflow-tooltip="true">
                    <template slot="header">
                        <span class="notNull">*</span>用餐时间(MIN)
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.dinner" size="small" type="number" min="0" :disabled="!isRedact" />
                    </template>
                </el-table-column>
                <el-table-column prop="verify_date" min-width="220" :show-overflow-tooltip="true">
                    <template slot="header">
                        <span class="notNull">*</span>结束时间
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.endDate" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy.MM.dd HH:mm" placeholder="选择" size="small" :disabled="!isRedact" style="width: 180px;" />
                    </template>
                </el-table-column>
                <el-table-column prop="verify_date" min-width="90" label="时长(H)" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <p> {{ workTime(scope.row.endDate, scope.row.startDate, scope.row) }}H </p>
                    </template>
                </el-table-column>
                <el-table-column prop="verify_date" min-width="140" label="备注" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.remark" size="small" :disabled="!isRedact" />
                    </template>
                </el-table-column>
                <el-table-column prop="verify_date" min-width="150" label="操作人" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.changer }}
                    </template>
                </el-table-column>
                <el-table-column prop="verify_date" min-width="160" label="操作时间" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.changed }}
                    </template>
                </el-table-column>
                <el-table-column fixed="right" width="90" prop="verify_date" label="操作" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-button class="delBtn" type="text" icon="el-icon-delete" size="small" :disabled="!isRedact" @click="removeDataRow(scope.$index)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row class="solerow">
                <div>
                    标准作业人数：
                </div>
                <div class="input_bottom">
                    {{ standardManpower }}
                </div>
                <div>
                    实际作业人数：
                </div>
                <div class="input_bottom">
                    {{ actualNumber }}
                </div>
            </el-row>
        </mds-card>
        <audit-log :table-data="readAudit" />
        <official-worker v-if="officialWorkerStatus" ref="officialWorker" @changeUser="changeUser" />
        <loaned-personnel v-if="loanedPersonnelStatus" ref="loanedPersonnel" :org-tree="orgTree" :arr-list="arrList" @changeUser="changeUser" />
        <temporary-worker v-if="temporaryWorkerStatus" ref="temporaryWorker" @changeUser="changeUser" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { COMMON_API } from 'common/api/api';
import { dateFormat, getUserNameNumber, getDateDiff, accAdd } from 'utils/utils';
import OfficialWorker from 'components/OfficialWorker.vue';
import LoanedPersonnel from 'components/LoanedPersonnel.vue';
import TemporaryWorker from 'components/TemporaryWorker.vue';
import _ from 'lodash';

@Component({
    name: 'ProductPeople',
    components: {
        OfficialWorker,
        LoanedPersonnel,
        TemporaryWorker,
        AuditLog: resolve => {
            require(['@/views/components/AuditLog'], resolve);
        }
    }
})

export default class ProductPeople extends Vue {
    @Prop({ type: Boolean, default: false }) isRedact
    @Prop({ type: Array, default: [] }) classesOptions

    $refs: {
        officialWorker: HTMLFormElement;
        loanedPersonnel: HTMLFormElement;
        temporaryWorker: HTMLFormElement;
    }

    // 常有变数
    currentFormDataGroup: CurrentDataTable[] = [] // 主 data
    orgFormDataGroup: CurrentDataTable[] = [] // 主 data 复制
    waitedDataDelete: string[]= [] // 入库删除集合
    waitedDataInsert: CurrentDataTable[] = [] // 入库新增集合
    waitedDataUpdate: CurrentDataTable[] =[] // 入库修改集合
    tabChangedState=[0, 0, 0] // 增,删,改

    teamList = [];
    userTypeList: UserTypeListObject[] = [];
    readAudit= [];
    officialWorkerStatus = false;
    loanedPersonnelStatus = false;
    temporaryWorkerStatus = false;

    row: CurrentDataTable = {
        userList: []
    };

    orgTree = [];
    arrList = [];
    standardManpower = 0;

    async init(dataGroup) {
        this.waitedDataDelete = [];
        this.waitedDataInsert = [];
        this.waitedDataUpdate = [];
        this.tabChangedState = [0, 0, 0]
        console.log('ProductPeople 带进来的 data')
        console.log(dataGroup)
        // 工序
        await this.getTeamList()

        // 人员属性
        await this.getUserTypeList()

        // 获取组织结构树
        await this.getTree()

        await this.getStandardManPower(this.$store.state.packaging.packDetail)

        if (dataGroup !== null) {
            this.currentFormDataGroup = JSON.parse(JSON.stringify(dataGroup))
            this.currentFormDataGroup.forEach((item) => {
                item.editedMark = false
            })
            this.orgFormDataGroup = JSON.parse(JSON.stringify(this.currentFormDataGroup))
        }
    }


    // 工序
    getTeamList() {
        COMMON_API.SYS_CHILDTYPE_API({
            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
            deptType: ['PRODUCT_TEAM'],
            deptName: '包装'
        }).then(({ data }) => {
            this.teamList = data.data;
        });
    }

    // 人员属性
    getUserTypeList() {
        COMMON_API.DICTQUERY_API({ dictType: 'COMMON_USER_TYPE' }).then(({ data }) => {
            this.userTypeList = data.data
        });
    }

    addNewDataRow() {
        let sole: CurrentDataTable
        if (this.currentFormDataGroup.length === 0) {
            sole = {
                classes: '',
                deptId: '',
                userType: '',
                userList: [],
                startDate: '',
                dinner: '60',
                endDate: '',
                remark: '',
                changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                changer: getUserNameNumber(),
                delFlag: 0
            }
        } else {
            sole = {
                classes: '',
                deptId: '',
                userType: '',
                userList: [],
                startDate: this.currentFormDataGroup[this.currentFormDataGroup.length - 1].startDate,
                dinner: '60',
                endDate: this.currentFormDataGroup[this.currentFormDataGroup.length - 1].endDate,
                remark: '',
                changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                changer: getUserNameNumber(),
                delFlag: 0
            };
        }
        this.tabChangedState[0] += 1
        this.currentFormDataGroup.push(sole)
    }

    workTime(end, start, row) {
        let diff = '0';
        if (end && start && row.delFlag !== '1') {
            diff = getDateDiff(start, end, 'hour');
        }
        return diff;
    }

    // 班组修改
    selectDept(row: CurrentDataTable) {
        this.compareChange(row)
        row.userList = [];
    }

    // 选择人员 正式借调
    selectUser(row: CurrentDataTable) {
        this.row = row;
        if (row.userType === 'FORMAL') { // 正式
            if (row.deptId) {
                this.officialWorkerStatus = true;
                this.$nextTick(() => {
                    this.$refs.officialWorker.init(row.deptId, row.userList);
                });
            } else {
                this.$warningToast('请选择工序');
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

    // 员工确认
    changeUser(userId) {
        this.row.userList = userId;
        this.officialWorkerStatus = false;
        this.loanedPersonnelStatus = false;
        this.temporaryWorkerStatus = false;
    }

    // 获取组织结构树
    getTree() {
        COMMON_API.ORGSTRUCTURE_API({
            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id
        }).then(({ data }) => {
            this.orgTree = data.data;
            // this.arrList = [this.OrgTree[0].children[0].id];
        });
    }

    // 临时工
    dayLaborer(row: CurrentDataTable) {
        this.row = row;
        const userType: (UserTypeListObject | undefined) = this.userTypeList.find((item: UserTypeListObject) => item.dictCode === row.userType);
        this.temporaryWorkerStatus = true;
        if (userType) {
            this.$nextTick(() => {
                this.$refs.temporaryWorker.init(row, userType['dictValue']);
            });
        }
    }

    // 人员删除
    removeDataRow(index) {
        this.$confirm('是否删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {

            if (Object.prototype.hasOwnProperty.call(this.currentFormDataGroup[index], 'id')) {
                this.tabChangedState[1] += 1
                this.waitedDataDelete.push((this.currentFormDataGroup[index].id) as string)
            } else {
                this.tabChangedState[0] -= 1
            }
            this.currentFormDataGroup.splice(index, 1);


        })
    }

    getStandardManPower(formHeader: object) {
        COMMON_API.CAPACITYLIST_API({
            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
            deptId: formHeader['productLine'],
            queryDate: formHeader['productDate'],
            current: 1,
            size: 10
        }).then(({ data }) => {
            if (data.data.records.length !== 0) {
                this.standardManpower = data.data.records[0]['standardManpower'];
            }
        });
    }

    get actualNumber() {
        let scrapNum = 0
        this.currentFormDataGroup.map((item: CurrentDataTable) => {
            if (item.delFlag === 0) {
                scrapNum = accAdd(scrapNum, item.userList.length);
            }
        });
        return scrapNum;
    }

    compareChange(row) {
        this.orgFormDataGroup.forEach((item) => {
            if (row.editedMark === false) {
                if (item.id === row.id) {
                    console.log(item)
                    console.log(row)
                    console.log(_.isEqual(row, item))
                    if (!_.isEqual(row, item)) {
                        row.editedMark = true
                        this.tabChangedState[2] += 1
                        console.log(row.editedMark)
                    }
                }
            }
        })
        console.log('增删改状态')
        console.log(this.tabChangedState)
    }

    tabChangeState() {
        console.log('查询 waitedDataInsert 增删改状态')
        console.log(this.tabChangedState)
        return !(this.tabChangedState[0] === 0 && this.tabChangedState[1] === 0 && this.tabChangedState[2] === 0)
    }

    returnDataGroup() {
            this.waitedDataInsert = [];
            this.waitedDataUpdate = [];
            this.currentFormDataGroup.forEach(item => {
                if (item.id) {
                    if (item.editedMark === true) {
                        delete item.editedMark
                        this.waitedDataUpdate.push(item)
                    }
                } else {
                    this.waitedDataInsert.push(item)
                }
            })

            return {
                countMan: this.actualNumber,
                deleteData: this.waitedDataDelete,
                insertData: this.waitedDataInsert,
                updateData: this.waitedDataUpdate
            }
        }

}
interface CurrentDataTable {
    classes?: string;
    deptId?: string;
    userType?: string;
    userList: string[];
    startDate?: string;
    dinner?: string;
    endDate?: string;
    remark?: string;
    changed?: string;
    changer?: string;
    delFlag?: number;
    id?: string;
    editedMark?: boolean;
}
interface StringArray {
    [index: number]: string;
}
interface UserTypeListObject {
    dictCode?: string;
    dictId?: string;
    dictValue?: string;
    factoryName?: string;
    id?: string;
}
</script>

<style lang="scss" scoped>
.solerow {
    margin-top: 5px;
    line-height: 33px;
    div {
        float: left;
    }
    .input_bottom {
        margin-right: 50px;
    }
}
</style>
