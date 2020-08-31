<template>
    <div class="header_main">
        <el-card class="searchCard">
            <el-form :inline="true" :model="formHeader" size="small" label-width="75px" class="multi_row">
                <el-form-item label="生产工厂：">
                    <el-select v-model="formHeader.factory" placeholder="请选择" style="width: 160px;">
                        <el-option label="请选择" value="" />
                        <el-option v-for="(item, index) in factory" :key="index" :label="item.deptName" :value="item.deptId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="生产车间：">
                    <el-select v-model="formHeader.workShop" placeholder="请选择" style="width: 160px;">
                        <el-option label="请选择" value="" />
                        <el-option v-for="(item, index) in workshop" :key="index" :label="item.deptName" :value="item.deptId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="发料物料：" prop="holderId">
                    <el-select v-model="formHeader.ferMaterialCode" placeholder="请选择" filterable style="width: 160px;">
                        <el-option label="请选择" value="" />
                        <el-option v-for="(sole, index) in material" :key="index" :value="sole.matnr" :label="sole.matnr + ' ' + sole.material_name" />
                    </el-select>
                </el-form-item>
                <el-form-item label="状态：">
                    <el-select v-model="formHeader.approveStatus" placeholder="请选择" style="width: 160px;">
                        <el-option label="请选择" value="" />
                        <el-option label="未录入" value="1" />
                        <el-option label="已保存" value="saved" />
                        <el-option label="已提交" value="submit" />
                        <el-option label="审核通过" value="checked" />
                        <el-option label="审核不通过" value="noPass" />
                    </el-select>
                </el-form-item>
                <el-form-item label="订单类型：">
                    <el-select v-model="formHeader.orderType" placeholder="请选择" style="width: 160px;">
                        <el-option label="请选择" value="" />
                        <el-option v-for="(item, index) in orderTypeList" :key="index" :label="item.value" :value="item.code" />
                    </el-select>
                </el-form-item>
                <el-form-item label="订单编号：">
                    <el-select v-model="formHeader.ferOrderNos" placeholder="请选择" multiple filterable style="width: 160px;">
                        <el-option v-for="(sole, index) in OrderList" :key="index" :value="sole.ferOrderNo" :label="sole.ferOrderNo" />
                    </el-select>
                </el-form-item>
                <el-form-item label="罐号：" prop="holderId">
                    <el-select v-model="formHeader.holderIds" placeholder="请选择" multiple filterable allow-create default-first-op style="width: 160px;">
                        <el-option v-for="(sole, index) in guanList" :key="index" :value="sole.holderId" :label="sole.holderName" />
                    </el-select>
                </el-form-item>
                <el-form-item label="订单日期：">
                    <el-date-picker v-model="formHeader.productDateOne" type="date" placeholder="选择日期" style="width: 160px; margin-right: 15px;" />
                    -
                    <el-date-picker v-model="formHeader.productDateTwo" type="date" placeholder="选择日期" style="width: 160px; margin-left: 15px;" />
                </el-form-item>
                <el-form-item class="floatr">
                    <template style="float: right; margin-left: 10px;">
                        <el-button v-if="isAuth('fer:shoot:list')" type="primary" size="small" @click="GetDataList()">
                            查 询
                        </el-button>
                        <!-- <el-button v-if="isAuth('fer:shoot:update')" type="primary" class="button" size="small" @click="isRedact = !isRedact">
                            {{ isRedact ? '取消' : '编辑' }}
                        </el-button> -->
                    </template>
                    <!-- <template v-if="isRedact" style="float: right; margin-left: 10px;">
                        <el-button type="primary" size="small" @click="savedOrSubmitForm('saved')">
                            保存
                        </el-button>
                        <el-button type="primary" size="small" @click="SubmitForm">
                            提交
                        </el-button>
                    </template> -->
                </el-form-item>
            </el-form>
        </el-card>
        <mds-card title="发料列表" style="margin-top: 5px;">
            <el-table :data="dataList" border class="newTable" tooltip-effect="dark" header-row-class-name="tableHead" @selection-change="handleSelectionChange" @row-dblclick="GetLog">
                <el-table-column type="selection" :selectable="checkboxT" width="50" fixed />
                <el-table-column type="index" label="序号" width="55" />
                <el-table-column label="订单号" min-width="120" prop="ferOrderNo" />
                <el-table-column label="状态" min-width="93" prop="approveStatus">
                    <template slot-scope="scope">
                        <p
                            :style="{
                                color: scope.row.approveStatus === 'noPass' ? 'red' : scope.row.approveStatus === 'checked' ? '#7ED321' : '',
                            }"
                        >
                            {{ scope.row.approveStatus === 'saved' ? '已保存' : scope.row.approveStatus === 'submit' ? ' 已提交' : scope.row.approveStatus === 'noPass' ? '审核不通过' : scope.row.approveStatus === 'checked' ? '已审核' : '未录入' }}
                        </p>
                    </template>
                </el-table-column>
                <el-table-column label="容器" min-width="110" prop="holderName" :show-overflow-tooltip="true" />
                <el-table-column label="物料" min-width="180" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.ferMaterialCode + ' ' + scope.row.ferMaterialName }}
                    </template>
                </el-table-column>
                <el-table-column label="订单量" min-width="80" prop="ferAmount" :show-overflow-tooltip="true" />
                <el-table-column label="单位" min-width="50" prop="ferUnit" />
                <el-table-column label="领用物料" min-width="180" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.kjmMaterialCode + ' ' + scope.row.kjmMaterialName }}
                    </template>
                </el-table-column>
                <el-table-column label="数量" min-width="100" prop="kjmAmount">
                    <template slot="header">
                        <em class="reqI">*</em>
                        <span>数量</span>
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.kjmAmount" size="mini" placeholder="手工录入" :disabled="!(isRedact && (scope.row.approveStatus === 'noPass' || scope.row.approveStatus === 'saved' || scope.row.approveStatus === ''))" />
                    </template>
                </el-table-column>
                <el-table-column label="单位" min-width="50" prop="kjmUnit" />
                <el-table-column label="批次" min-width="120" prop="batch">
                    <template slot="header">
                        <em class="reqI">*</em>
                        <span>批次</span>
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.batch" size="mini" maxlength="10" placeholder="手工录入" :disabled="!(isRedact && (scope.row.approveStatus === 'noPass' || scope.row.approveStatus === 'saved' || scope.row.approveStatus === ''))" />
                    </template>
                </el-table-column>
                <el-table-column label="备注" min-width="80" prop="remark">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.remark" size="mini" placeholder="手工录入" :disabled="!(isRedact && (scope.row.approveStatus === 'noPass' || scope.row.approveStatus === 'saved' || scope.row.approveStatus === ''))" />
                    </template>
                </el-table-column>
                <el-table-column label="提交人员" min-width="120" prop="changer" :show-overflow-tooltip="true" />
                <el-table-column label="提交时间" min-width="120" prop="changed" :show-overflow-tooltip="true" />
                <el-table-column label="操作" width="112" fixed="right">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.approveStatus !== 'submit' && scope.row.approveStatus !== 'checked'" type="text" style="" size="mini" :disabled="!isRedact" @click="AddData(scope.row, scope.$index)">
                            <em class="icons iconfont factory-chaifen" />拆分
                        </el-button>
                        <el-button v-if="scope.row.approveStatus !== 'submit' && scope.row.approveStatus !== 'checked'" type="text" style=" margin-left: 0; color: red;" icon="el-icon-delete" size="mini" :disabled="!isRedact" @click="delData(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row>
                <el-pagination :current-page="currPage" :page-sizes="[20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </el-row>
        </mds-card>
        <audit-log :table-data="Audit" />
        <!--编辑-->
        <div class="redactBox">
            <div class="redactBox" :style="{ 'padding-left': sidebarFold ? '64px' : '170px' }">
                <div class="redact clearfix">
                    <div class="redact_btn">
                        <el-button v-if="isAuth('fer:shoot:update')" type="primary" class="button" size="small" @click="isRedact = !isRedact">
                            {{ isRedact ? '取消' : '编辑' }}
                        </el-button>
                        <template v-if="isRedact" style="float: right; margin-left: 10px;">
                            <el-button type="primary" size="small" @click="savedOrSubmitForm('saved')">
                                保存
                            </el-button>
                            <el-button type="primary" size="small" @click="SubmitForm">
                                提交
                            </el-button>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { BASICDATA_API, FERMENTATION_API, SYSTEMSETUP_API } from '@/api/api';
export default {
    name: 'Index',
    components: {
        AuditLog: resolve => {
            require(['@/views/components/AuditLog'], resolve);
        }
    },
    data() {
        return {
            isRedact: false,
            formHeader: JSON.parse(JSON.stringify(this.$store.state.common.Fermentation.materia)),
            factory: [],
            workshop: [],
            guanList: [],
            OrderList: [],
            material: [],
            dataList: [],
            SumdataList: [],
            Audit: [],
            multipleSelection: [],
            currPage: 1,
            pageSize: 20,
            totalCount: 0,
            orderTypeList: []
        };
    },
    computed: {
        sidebarFold: {
            get() {
                return this.$store.state.common.sidebarFold;
            }
        }
    },
    watch: {
        'formHeader.factory'(n) {
            this.formHeader.workShop = '';
            this.formHeader.ferMaterialCode = '';
            this.formHeader.orderType = '';
            this.Getdeptbyid(n);
            this.getDictList(n);
            // this.GetMaterial(n)
        },
        'formHeader.workShop'(n) {
            this.formHeader.holderIds = [];
            this.formHeader.ferOrderNos = [];
            this.HolderList(n);
            this.GetOrderList(n);
            this.GetMaterial(n);
        }
    },
    mounted() {
        this.Getdeptcode();
        this.Getdeptbyid(this.formHeader.factory);
        this.getDictList(this.formHeader.factory);
        // this.GetMaterial(this.formHeader.factory)
        this.HolderList(this.formHeader.workShop);
        this.GetOrderList(this.formHeader.workShop);
        if (this.formHeader.factory) {
            this.GetDataList();
        }
    },
    methods: {
        getDictList(factory) {
            // CM_material 发料物料 CM_material_prd 生产物料 PW_FEVOR  生产调度员
            const params = { types: ['order_type'], factory };
            this.$http(`${SYSTEMSETUP_API.PARAMETERSLIST_API}`, 'POST', params)
                .then(({ data }) => {
                    if (data.code === 0) {
                        this.orderTypeList = data.dicList[0].prolist;
                    } else {
                        this.$errorToast(data.msg);
                    }
                })
                .catch(error => {
                    console.log('catch data::', error);
                });
        },
        // 查询
        GetDataList() {
            this.$http(`${FERMENTATION_API.SHOOT_LIST_API}`, 'POST', this.formHeader).then(({ data }) => {
                if (data.code === 0) {
                    this.SumdataList = data.ferList;
                    this.totalCount = data.ferList.length;
                    this.dataList = data.ferList.slice((this.currPage - 1) * this.pageSize, (this.currPage - 1) * this.pageSize + this.pageSize);
                    this.Audit = [];
                    this.$store.commit('common/updateFermentationM', this.formHeader);
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 获取日志
        GetLog(row) {
            this.$http(`${FERMENTATION_API.SHOOT_LOG_API}`, 'POST', {
                ferOrderNo: row.ferOrderNo
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.Audit = data.verList;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 保存 or 提交
        SubmitForm() {
            this.$confirm('确认提交该订单, 是否继续?', '提交订单', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.savedOrSubmitForm('submit');
            }).catch(() => {
                // this.$infoToast('已取消删除');
            });
        },
        check() {
            let ty = false;
            this.multipleSelection.forEach(item => {
                if (item.kjmAmount && item.batch) {
                    ty = false;
                } else {
                    ty = true;
                }
            });
            return ty;
        },
        /* eslint-disable no-shadow */
        savedOrSubmitForm(str) {
            if (str === 'submit') {
                if (this.check()) {
                    this.$warningToast('有必填项未填写');
                    return false;
                }
            }
            if (this.multipleSelection.length) {
                this.multipleSelection.forEach(item => {
                    if (item.approveStatus) {
                        if (item.approveStatus === 'saved') {
                            item.approveStatus = str;
                        } else if (item.approveStatus === 'noPass' && str === 'submit') {
                            item.approveStatus = str;
                        }
                    } else {
                        item.approveStatus = str;
                    }
                });
            } else {
                this.$warningToast('请选择数据后操作');
                return;
            }
            if (str === 'submit') {
                this.$http(`${FERMENTATION_API.SHOOT_UPDATE_API}`, 'POST', this.multipleSelection).then(({ data }) => {
                    if (data.code === 0) {
                        this.$http(`${FERMENTATION_API.SHOOT_SUBMIT_API}`, 'POST', this.multipleSelection).then(({ data }) => {
                            if (data.code === 0) {
                                this.$notify({
                                    title: '成功',
                                    message: '操作成功',
                                    type: 'success'
                                });
                                this.GetDataList();
                            } else {
                                this.$errorToast(data.msg);
                            }
                        });
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            } else {
                this.$http(`${FERMENTATION_API.SHOOT_UPDATE_API}`, 'POST', this.multipleSelection).then(({ data }) => {
                    if (data.code === 0) {
                        this.$notify({
                            title: '成功',
                            message: '操作成功',
                            type: 'success'
                        });
                        this.GetDataList();
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            }
        },
        /* eslint-ensable no-shadow */
        // 拆分
        AddData(row, index) {
            const newobj = JSON.parse(JSON.stringify(row));
            newobj.approveStatus = '';
            newobj.id = '';
            newobj.kjmAmount = '';
            newobj.batch = '';
            newobj.remark = '';
            this.dataList.splice(index + 1, 0, newobj);
        },
        // 删除
        delData(row) {
            if (row.approveStatus === '') {
                this.dataList.splice(this.dataList.indexOf(row), 1);
                this.Audit = [];
            } else {
                this.$http(`${FERMENTATION_API.SHOOT_DEL_API}`, 'POST', {
                    id: row.id
                }).then(({ data }) => {
                    if (data.code === 0) {
                        this.$notify({
                            title: '成功',
                            message: '删除成功',
                            type: 'success'
                        });
                        this.GetDataList();
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            }
        },
        // 审核通过禁用
        checkboxT(row) {
            if (row.approveStatus === 'checked' || row.approveStatus === 'submit') {
                return 0;
            }
                return 1;

        },
        // 表格选中
        handleSelectionChange(val) {
            this.multipleSelection = [];
            val.forEach((item) => {
                this.multipleSelection.push(item);
            });
        },
        // 获取工厂
        Getdeptcode() {
            this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST', {}, false, false, false).then(({ data }) => {
                if (data.code === 0) {
                    this.factory = data.typeList;
                    if (!this.formHeader.factory && data.typeList.length > 0) {
                        this.formHeader.factory = data.typeList[0].deptId;
                    }
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 获取车间
        Getdeptbyid(id) {
            if (id) {
                this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', { deptId: id, deptName: '发酵' }, false, false, false).then(({ data }) => {
                    if (data.code === 0) {
                        this.workshop = data.typeList;
                        if (!this.formHeader.workShop && data.typeList.length > 0) {
                            this.formHeader.workShop = data.typeList[0].deptId;
                        }
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            }
        },
        // 罐号
        HolderList() {
            if (this.formHeader.factory && this.formHeader.workShop) {
                this.$http(
                    `${BASICDATA_API.BASEHOLDERLIST_API}`,
                    'POST',
                    {
                        factory: this.formHeader.factory,
                        workShop: this.formHeader.workShop
                    },
                    false,
                    false,
                    false
                ).then(({ data }) => {
                    this.guanList = data.holderList;
                });
            }
        },
        // 订单
        GetOrderList() {
            if (this.formHeader.factory && this.formHeader.workShop) {
                this.$http(
                    `${FERMENTATION_API.SHOOT_GETORDER_API}`,
                    'POST',
                    {
                        factory: this.formHeader.factory,
                        workShop: this.formHeader.workShop
                    },
                    false,
                    false,
                    false
                ).then(({ data }) => {
                    this.OrderList = data.verList;
                });
            }
        },
        // 获取物料
        GetMaterial(n) {
            if (n) {
                this.$http(
                    `${FERMENTATION_API.SHOOT_MATERIAL_LIST}`,
                    'POST',
                    {
                        factory: this.formHeader.factory,
                        workShop: this.formHeader.workShop
                    },
                    false,
                    false,
                    false
                ).then(({ data }) => {
                    if (data.code === 0) {
                        this.material = data.list;
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            }
        },
        // 改变每页条数
        handleSizeChange(val) {
            this.pageSize = val;
            this.currPage = 1;
            this.GetDataList();
        },
        // 跳转页数
        handleCurrentChange(val) {
            this.currPage = val;
            this.GetDataList();
        }
    }
};
</script>

<style scoped>
.reqI {
    color: red;
}
.button_three_goup {
    position: relative;
    top: 0;
    right: 0;
    padding: 10px;
}
</style>
