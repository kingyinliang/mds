<template>
    <div>
        <mds-card :title="'人员 (小时:H)'" :name="'user'">
            <template slot="titleBtn">
                <div style="float: right;">
                    <el-button type="primary" size="small" :disabled="!isRedact" @click="AddWorkerDate(WorkerDate)">
                        新增
                    </el-button>
                </div>
            </template>
            <el-table header-row-class-name="tableHead" class="newTable" :data="WorkerDate" border tooltip-effect="dark">
                <el-table-column type="index" width="55" label="序号" fixed />
                <el-table-column label="白/中/夜班" width="100">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.classType" placeholder="请选择" size="small" :disabled="!isRedact">
                            <el-option v-for="(iteam, index) in productShift" :key="index" :label="iteam.value" :value="iteam.code" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="班组/工序" width="100">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.deptId" filterable placeholder="请选择" size="small" :disabled="!isRedact" @change="SelectDept(scope.row)">
                            <el-option v-for="(iteam, index) in Team" :key="index" :label="iteam.deptName" :value="iteam.deptId" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="人员属性" width="130">
                    <template slot="header">
                        <i class="reqI">*</i>
                        <span>人员属性</span>
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.userType" placeholder="请选择" size="small" :disabled="!isRedact" @change="userTypesele(scope.row)">
                            <el-option label="正式" value="正式" />
                            <el-option label="借调" value="借调" />
                            <el-option label="临时工" value="临时工" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="人员选择" :show-overflow-tooltip="true">
                    <template slot="header">
                        <i class="reqI">*</i>
                        <span>人员选择</span>
                    </template>
                    <template slot-scope="scope">
                        <div class="required" style="min-height: 32px;">
                            <span v-if="!isRedact" style="cursor: pointer;">
                                <i v-for="(item, index) in scope.row.userId" :key="index">{{ item }}，</i>
                            </span>
                            <span v-if="isRedact && scope.row.userType !== '临时工'" style="cursor: pointer;" @click="selectUser(scope.row)">
                                <i v-for="(item, index) in scope.row.userId" :key="index">{{ item }}，</i>
                                <i>点击选择人员</i>
                            </span>
                            <span v-if="scope.row.userType == '临时工' && isRedact" style="cursor: pointer;" @click="dayLaborer(scope.row)">
                                <i v-for="(item, index) in scope.row.userId" :key="index">{{ item }}，</i>
                                <i>点击输入临时工</i>
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column width="241" label="开始时间">
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.startDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" placeholder="选择" size="small" :disabled="!isRedact" />
                    </template>
                </el-table-column>
                <el-table-column label="用餐时间" width="100">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.dinner" size="small" type="number" min="0" :disabled="!isRedact" />
                    </template>
                </el-table-column>
                <el-table-column width="241" label="结束时间">
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.endDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" placeholder="选择" size="small" :disabled="!isRedact" />
                    </template>
                </el-table-column>
                <el-table-column label="工作时长" width="100">
                    <template slot-scope="scope">
                        <p> {{ workTime(scope.row.endDate, scope.row.startDate, scope.row) }}H </p>
                    </template>
                </el-table-column>
                <el-table-column label="备注" width="100">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.remark" size="small" :disabled="!isRedact" />
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="70">
                    <template slot-scope="scope">
                        <el-button class="delBtn" type="text" icon="el-icon-delete" size="small" :disabled="!isRedact" @click="delUser(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <p style="font-size: 12px; line-height: 32px;">
                实际作业人数：{{ countMan }}
            </p>
        </mds-card>
        <mds-card v-if="att" :title="'产量考勤分配'" :name="'user'">
            <el-table header-row-class-name="tableHead" :row-class-name="RowDelFlag" :data="attendance" border tooltip-effect="dark">
                <el-table-column label="班组" width="60">
                    <template slot-scope="scope">
                        {{ scope.row.itemName }}
                    </template>
                </el-table-column>
                <el-table-column label="班组人数" width="80">
                    <template slot-scope="scope">
                        {{ scope.row.teamNum }}
                    </template>
                </el-table-column>
                <el-table-column width="70">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini" :disabled="!isRedact" @click="addUser(scope.row, scope.$index)">
                            <i class="icons iconfont factory-chaifen" />拆分
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="白/中/夜班" width="140">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.classes" placeholder="请选择" size="mini" :disabled="!isRedact">
                            <el-option v-for="(iteam, index) in productShift" :key="index" :label="iteam.value" :value="iteam.code" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="包装品项">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.materialCode" filterable placeholder="请选择" size="mini" style="width: 100%;" :disabled="!isRedact" @change="selectMaterial(scope.row)">
                            <el-option label="请选择" value="" />
                            <el-option v-for="(item, index) in Materails" :key="index" :label="item.materialCode + ' ' + item.materialName" :value="item.materialCode" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="单位" width="60">
                    <template slot-scope="scope">
                        {{ scope.row.unitName }}
                    </template>
                </el-table-column>
                <el-table-column label="数量" width="140">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.amount" size="mini" :disabled="!isRedact" />
                    </template>
                </el-table-column>
                <el-table-column label="备注" width="140">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.remark" size="mini" :disabled="!isRedact" />
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="70">
                    <template slot-scope="scope">
                        <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!isRedact" @click="delUser1(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </mds-card>
        <audit-log :table-data="UserAudit" />
        <official-worker v-if="officialWorkerStatus" ref="officialWorker" @changeUser="changeUser" />
        <loaned-personnel v-if="loanedPersonnelStatus" ref="loanedPersonnel" :org-tree="OrgTree" :arr-list="arrList" @changeUser="changeUser" />
        <temporary-worker v-if="temporaryWorkerStatus" ref="temporaryWorker" @changeUser="changeUser" />
    </div>
</template>

<script>
import { PACKAGING_API, SYSTEMSETUP_API, BASICDATA_API, BOTTLE_API } from '@/api/api';
import { toDate } from '@/net/validate';
import OfficialWorker from './OfficialWorker';
import LoanedPersonnel from './LoanedPersonnel';
import TemporaryWorker from './TemporaryWorker';
export default {
    name: 'Worker',
    components: {
        OfficialWorker,
        LoanedPersonnel,
        TemporaryWorker,
        AuditLog: resolve => {
            require(['@/views/components/AuditLog'], resolve);
        }
    },
    props: {
        isRedact: {
            type: Boolean
        },
        order: {
            type: Object,
            default: function() { return {} }
        },
        att: {
            type: Boolean
        },
        attendance: {
            type: Object,
            default: function() { return {} }
        }
    },
    data() {
        return {
            WorkerDate: [],
            UserAudit: [],
            productShift: [],
            Team: [],
            OrgTree: [],
            arrList: [],
            Materails: [],
            row: {},
            officialWorkerStatus: false,
            loanedPersonnelStatus: false,
            temporaryWorkerStatus: false
        };
    },
    computed: {
        countMan: function() {
            let num = 0;
            if (this.WorkerDate) {
                this.WorkerDate.forEach(item => {
                    num += item.userId.length;
                });
            }
            return num;
        },
        workTime: function() {
            return function(end, start, row) {
                if (end && start && row.delFlag !== '1') {
                    return (Number(((toDate(end) - toDate(start)) / 3600000).toFixed(2)) - Number(((Number(row.dinner)) / 60).toFixed(2))).toFixed(2);
                }
            };
        }
    },
    watch: {
        'order.factory'(n) {
            this.GetProductShift(n);
        }
    },
    mounted() {
        // this.getTree()
        this.GetProductShift();
    },
    methods: {
        // 人员列表
        GetTimeUserList(list, list2) {
            this.WorkerDate = list;
            this.UserAudit = list2;
        },
        /* eslint-disable @typescript-eslint/camelcase*/
        GetUserList(id) {
            this.$http(
                `${PACKAGING_API.PKGUSERLIST_API}`,
                'POST',
                {
                    order_id: id
                },
                false,
                false,
                false
            ).then(({ data }) => {
                if (data.code === 0) {
                    this.WorkerDate = data.listForm;
                    this.UserAudit = data.listApproval;
                } else {
                    this.$notify.error({ title: '错误', message: data.msg });
                }
            });
        },
        /* eslint-enable @typescript-eslint/camelcase*/
        // 返回人员列表
        GetUser() {
            return this.WorkerDate;
        },
        // 班组修改
        SelectDept(row) {
            row.userId = [];
            if (this.att) {
                this.SetAtt(row.deptId);
            }
        },
        // 拆分考勤分配
        addUser(row, index) {
            this.attendance.splice(index + 1, 0, {
                id: '',
                teamNum: row.teamNum,
                orderId: this.order.orderId,
                team: row.team,
                itemName: this.Team.filter(item => item.deptId === row.team)[0].deptName,
                classes: '',
                materialCode: '',
                materialName: '',
                unit: 'CAR',
                unitName: '箱',
                amount: '',
                remark: '',
                delFlag: '0'
            });
        },
        // 考勤分配
        SetAtt() {
            const tmpobj = {};
            this.WorkerDate.forEach(item => {
                if (item.deptId && !tmpobj[item.deptId]) {
                    tmpobj[item.deptId] = item.userId;
                } else if (tmpobj[item.deptId]) {
                    tmpobj[item.deptId] = tmpobj[item.deptId].concat(item.userId);
                }
            });
            this.attendance.forEach(item => {
                if (!tmpobj[item.team]) {
                    item.delFlag = '1';
                }
            });
            Reflect.ownKeys(tmpobj).forEach(key => {
                if (this.attendance.filter(item => item.delFlag === '0' && item.team === key).length > 0) {
                    this.attendance.filter(item => item.delFlag === '0' && item.team === key).forEach(it => {
                        it.teamNum = tmpobj[key].length;
                    });
                } else {
                    this.attendance.push({
                        id: '',
                        teamNum: tmpobj[key].length,
                        orderId: this.order.orderId,
                        team: key,
                        itemName: this.Team.filter(item => item.deptId === key)[0].deptName,
                        classes: '',
                        materialCode: '',
                        materialName: '',
                        unit: 'CAR',
                        unitName: '箱',
                        amount: '',
                        remark: '',
                        delFlag: '0'
                    });
                }
            });
        },
        // 获取物料下拉
        GetMaterails(id, pDate) {
            this.$http(
                `${BOTTLE_API.BOTTLE_PRO_USERMATERIAL_LIST}`,
                'POST',
                {
                    productLine: id,
                    productDate: pDate
                },
                false,
                false,
                false
            ).then(({ data }) => {
                if (data.code === 0) {
                    this.Materails = data.result;
                } else {
                    this.$notify.error({ title: '错误', message: data.msg });
                }
            });
        },
        selectMaterial(row) {
            row.materialName = this.Materails.filter(it => it.materialCode === row.materialCode)[0].materialName;
        },
        //  RowDelFlag
        RowDelFlag({ row }) {
            if (row.delFlag === '1') {
                return 'rowDel';
            }
                return '';

        },
        // 人员保存
        UpdateUser(str, resolve) {
            if (this.WorkerDate.length > 0) {
                this.WorkerDate.forEach(item => {
                    if (item.status) {
                        if (item.status === 'saved') {
                            item.status = str;
                        } else if (item.status === 'noPass' && str === 'submit') {
                            item.status = str;
                        }
                    } else {
                        item.status = str;
                    }
                });
                this.$http(`${PACKAGING_API.PKGUSERUPDATE_API}`, 'POST', this.WorkerDate).then(({ data }) => {
                    if (data.code !== 0) {
                        this.$notify.error({
                            title: '错误',
                            message: '修改人员' + data.msg
                        });
                    }
                    if (resolve) {
                        resolve('resolve');
                    }
                });
            } else if (this.order.orderId) {
                    this.$http(`${PACKAGING_API.PKGUSERUPDATE_API}`, 'POST', [
                        {
                            status: '',
                            orderId: this.order.orderId,
                            classType: '',
                            deptId: '',
                            userType: '',
                            userId: [],
                            startDate: '',
                            dinner: '60',
                            endDate: '',
                            remark: ''
                        }
                    ]).then(({ data }) => {
                        if (data.code !== 0) {
                            this.$notify.error({
                                title: '错误',
                                message: '修改人员' + data.msg
                            });
                        }
                        if (resolve) {
                            resolve('resolve');
                        }
                    });
                } else if (resolve) {
                        resolve('resolve');
                    }
        },
        BottleUpdateUser(str, resolve) {
            if (this.WorkerDate.length > 0) {
                this.WorkerDate.forEach(item => {
                    if (item.status) {
                        if (item.status === 'saved') {
                            item.status = str;
                        } else if (item.status === 'noPass' && str === 'submit') {
                            item.status = str;
                        }
                    } else {
                        item.status = str;
                    }
                });
                this.$http(`${BOTTLE_API.BOTTLE_PRO_USER_UPDATE}`, 'POST', this.WorkerDate).then(({ data }) => {
                    if (data.code !== 0) {
                        this.$notify.error({
                            title: '错误',
                            message: '修改人员' + data.msg
                        });
                    }
                    if (resolve) {
                        resolve('resolve');
                    }
                });
            } else if (this.order.orderId) {
                    this.$http(`${BOTTLE_API.BOTTLE_PRO_USER_UPDATE}`, 'POST', [
                        {
                            status: '',
                            orderId: this.order.orderId,
                            classType: '',
                            deptId: '',
                            userType: '',
                            userId: [],
                            startDate: '',
                            dinner: '60',
                            endDate: '',
                            remark: ''
                        }
                    ]).then(({ data }) => {
                        if (data.code !== 0) {
                            this.$notify.error({
                                title: '错误',
                                message: '修改人员' + data.msg
                            });
                        }
                        if (resolve) {
                            resolve('resolve');
                        }
                    });
                } else if (resolve) {
                        resolve('resolve');
                    }
        },
        BottleUpdateAtt(str, resolve) {
            this.$http(`${BOTTLE_API.BOTTLE_PRO_ATTEND_UPDATE}`, 'POST', this.attendance).then(({ data }) => {
                if (data.code !== 0) {
                    this.$notify.error({
                        title: '错误',
                        message: '修改人员考勤分配' + data.msg
                    });
                }
                if (resolve) {
                    resolve('resolve');
                }
            });
        },
        // 校验
        userrul() {
            let ty = true;
            if (this.WorkerDate.length === 0) {
                // if (this.WorkerDate.filter(item => item.delFlag === '0').length === 0) {
                ty = false;
                this.$warningToast('人员不能为空');
                return false;
            }
            this.WorkerDate.forEach(item => {
                if (item.userType && item.userId.length !== 0 && item.startDate && item.endDate) {
                    //
                } else {
                    ty = false;
                    this.$warningToast('人员必填项未填');
                    return false;
                }
            });
            return ty;
        },
        // 获取生产班次
        GetProductShift(factory) {
            this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {
                factory: factory,
                type: 'product_shift'
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.productShift = data.dicList;
                } else {
                    this.$notify.error({ title: '错误', message: data.msg });
                }
            });
        },
        // 获取车间下工序
        GetTeam(id, faid) {
            if (id) {
                this.$http(`${BASICDATA_API.FINDTEAM_API}`, 'POST', {
                    id: id,
                    factory: faid
                }).then(({ data }) => {
                    if (data.code === 0) {
                        this.Team = data.teamList;
                    } else {
                        this.$notify.error({ title: '错误', message: data.msg });
                    }
                });
                // this.$http(`${BASICDATA_API.FINDORGBYPARENTID_API}`, 'POST', {parentId: id}).then(({data}) => {
                //   if (data.code === 0) {
                //     this.Team = data.childList
                //   } else {
                //     this.$notify.error({title: '错误', message: data.msg})
                //   }
                // })
            } else {
                this.$http(`${BASICDATA_API.FINDTEAM_API}`, 'POST', {
                    factory: faid
                }).then(({ data }) => {
                    if (data.code === 0) {
                        this.Team = data.teamList;
                    } else {
                        this.$notify.error({ title: '错误', message: data.msg });
                    }
                });
            }
        },
        // 人员属性下拉
        userTypesele(row) {
            row.userId = [];
            if (this.att) {
                this.SetAtt();
            }
        },
        // 获取组织结构树
        getTree(factory) {
            this.$http(`${BASICDATA_API.ORGSTRUCTURE_API}`, 'GET', { flag: factory }, false, false, false).then(({ data }) => {
                // this.$http(`${BASICDATA_API.ORGSTRUCTURE_API}`, 'GET', {}).then(({data}) => {
                if (data.code === 0) {
                    this.OrgTree = data.deptList;
                    this.arrList = [this.OrgTree[0].children[0].deptId];
                } else {
                    this.$notify.error({ title: '错误', message: data.msg });
                }
            });
        },
        // 选择人员 正式借调
        selectUser(row) {
            this.row = row;
            if (row.userType === '借调') {
                this.loanedPersonnelStatus = true;
                this.$nextTick(() => {
                    this.$refs.loanedPersonnel.init(row.userId);
                });
            } else if (row.userType === '正式') {
                if (row.deptId) {
                    this.officialWorkerStatus = true;
                    this.$nextTick(() => {
                        this.$refs.officialWorker.init(row.deptId, row.userId);
                    });
                } else {
                    this.$warningToast('请选择工序');
                }
            } else {
                this.$warningToast('请选择人员属性');
            }
        },
        // 临时工
        dayLaborer(row) {
            this.row = row;
            this.temporaryWorkerStatus = true;
            this.$nextTick(() => {
                this.$refs.temporaryWorker.init(row);
            });
        },
        // 员工确认
        changeUser(userId) {
            this.row.userId = userId;
            if (this.att) {
                this.SetAtt();
            }
            this.officialWorkerStatus = false;
            this.loanedPersonnelStatus = false;
            this.temporaryWorkerStatus = false;
        },
        // 人员删除
        delUser(row) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.WorkerDate.splice(this.WorkerDate.indexOf(row), 1);
                if (this.att) {
                    this.SetAtt(row.deptId);
                }
            }).catch(() => {
                // this.$infoToast('已取消删除');
            });
        },
        // 人员删除
        delUser1(row) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                row.delFlag = '1';
            }).catch(() => {
                // this.$infoToast('已取消删除');
            });
        },
        // 新增人员
        AddWorkerDate(form) {
            if (form.length) {
                form.push({
                    status: '',
                    orderId: this.order.orderId,
                    classType: '',
                    deptId: '',
                    userType: '',
                    userId: [],
                    startDate: form[form.length - 1].startDate,
                    dinner: '60',
                    endDate: form[form.length - 1].endDate,
                    remark: ''
                });
            } else {
                form.push({
                    status: '',
                    orderId: this.order.orderId,
                    classType: '',
                    deptId: '',
                    userType: '',
                    userId: [],
                    startDate: '',
                    dinner: '60',
                    endDate: '',
                    remark: ''
                });
            }
        }
    }
};
</script>

<style scoped></style>
