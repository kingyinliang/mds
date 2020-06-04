<template>
    <div>
        <mds-card title="人员统计" :name="'productPeople'">
            <template slot="titleBtn">
                <div style="float: right;">
                    <el-button type="primary" size="small" :disabled="!isRedact" @click="addRow()">
                        新增
                    </el-button>
                </div>
            </template>
            <el-table class="newTable" :data="currentDataTable" header-row-class-name="tableHead" border style="width: 100%; max-height: 200px;">
                <el-table-column label="序号" type="index" width="60" />
                <el-table-column prop="status" min-width="100" :show-overflow-tooltip="true">
                    <template slot="header">
                        <span class="notNull">*</span>班次
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.classes" size="small">
                            <el-option v-for="(item, index) in classList" :key="index" :value="item.dictCode" :label="item.dictValue" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="memo" min-width="120" :show-overflow-tooltip="true">
                    <template slot="header">
                        <span class="notNull">*</span>班组/工序
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.deptId" filterable placeholder="请选择" size="small" :disabled="!isRedact" @change="selectDept(scope.row)">
                            <el-option v-for="(iteam, index) in teamList" :key="index" :label="iteam.deptName" :value="iteam.id" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="verify_man" min-width="130" :show-overflow-tooltip="true">
                    <template slot="header">
                        <span class="notNull">*</span>人员属性
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.userType" filterable placeholder="请选择" size="small" :disabled="!isRedact">
                            <el-option v-for="(iteam, index) in userTypeList" :key="index" :label="iteam.dictValue" :value="iteam.dictCode" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="verify_date" min-width="110" :show-overflow-tooltip="true">
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
                <el-table-column prop="verify_date" min-width="190" :show-overflow-tooltip="true">
                    <template slot="header">
                        <span class="notNull">*</span>开始时间
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.startDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" placeholder="选择" size="small" :disabled="!isRedact" style="width: 165px;" />
                    </template>
                </el-table-column>
                <el-table-column prop="verify_date" min-width="110" :show-overflow-tooltip="true">
                    <template slot="header">
                        <span class="notNull">*</span>用餐时间(MIN)
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.dinner" size="small" type="number" min="0" :disabled="!isRedact" />
                    </template>
                </el-table-column>
                <el-table-column prop="verify_date" min-width="190" :show-overflow-tooltip="true">
                    <template slot="header">
                        <span class="notNull">*</span>结束时间
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.endDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" placeholder="选择" size="small" :disabled="!isRedact" style="width: 165px;" />
                    </template>
                </el-table-column>
                <el-table-column prop="verify_date" min-width="90" label="时长(H)" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <p> {{ workTime(scope.row.endDate, scope.row.startDate, scope.row) }}H </p>
                    </template>
                </el-table-column>
                <el-table-column prop="verify_date" min-width="100" label="备注" :show-overflow-tooltip="true">
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
                        <el-button class="delBtn" type="text" icon="el-icon-delete" size="small" :disabled="!isRedact" @click="delUser(scope.row)">
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
                    {{ ActualNumber }}
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
import { COMMON_API, PKG_API } from 'common/api/api';
import { dateFormat, getUserNameNumber, getDateDiff, accAdd } from 'utils/utils';
import OfficialWorker from 'components/OfficialWorker.vue';
import LoanedPersonnel from 'components/LoanedPersonnel.vue';
import TemporaryWorker from 'components/TemporaryWorker.vue';

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

    $refs: {
        officialWorker: HTMLFormElement;
        loanedPersonnel: HTMLFormElement;
        temporaryWorker: HTMLFormElement;
    }

    classList = [];
    teamList = [];
    userTypeList: UserTypeListObject[] = [];
    currentDataTable: CurrentDataTable[] = [];
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

    mounted() {
        this.getList();
        this.getClassList();
        this.getTeamList();
        this.getUserTypeList();
        this.getTree();
        this.getStandardManPower(this.$store.state.packaging.packDetail)
    }

    // 查询
    getList() {
        PKG_API.PKG_USER_LIST_API({
            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
            orderNo: this.$store.state.packaging.packDetail['orderNo']
        }).then(({ data }) => {
            if (data.data !== null) {
                this.currentDataTable = data.data;
            }
        });
    }

    // 班次
    getClassList() {
        COMMON_API.DICTQUERY_CLASSLIST_API({}).then(({ data }) => {
            this.classList = data.data
        });
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

    addRow() {
        if (this.currentDataTable.length === 0) {
            const sole: CurrentDataTable = {
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
            this.currentDataTable.push(sole);
        } else {
            this.currentDataTable.push({
                classes: '',
                deptId: '',
                userType: '',
                userList: [],
                startDate: this.currentDataTable[this.currentDataTable.length - 1].startDate,
                dinner: '60',
                endDate: this.currentDataTable[this.currentDataTable.length - 1].endDate,
                remark: '',
                changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                changer: getUserNameNumber(),
                delFlag: 0
            });
        }
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
    delUser(row) {
        this.$confirm('是否删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.currentDataTable.splice(this.currentDataTable.indexOf(row), 1);
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

    get ActualNumber() {
        let ScrapNum = 0
        this.currentDataTable.map((item: CurrentDataTable) => {
            if (item.delFlag === 0) {
                ScrapNum = accAdd(ScrapNum, item.userList.length);
            }
        });
        return ScrapNum;
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
