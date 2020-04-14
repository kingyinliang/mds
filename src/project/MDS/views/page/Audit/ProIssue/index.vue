<template>
    <el-col>
        <el-col>
            <div class="header_main">
                <el-card class="searchCard switching">
                    <el-row type="flex">
                        <el-col>
                            <el-form :model="plantList" size="small" :inline="true" label-position="right" label-width="70px" class="multi_row">
                                <el-form-item label="生产工厂：">
                                    <el-select v-model="plantList.factory" placeholder="请选择" style="width: 160px;">
                                        <el-option label="请选择" value="" />
                                        <el-option v-for="(item, index) in factory" :key="index" :label="item.deptName" :value="item.deptId" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="生产车间：">
                                    <el-select v-model="plantList.workShop" placeholder="请选择" style="width: 160px;">
                                        <el-option label="请选择" value="" />
                                        <el-option v-for="(item, index) in workshop" :key="index" :label="item.deptName" :value="item.deptId" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="生产产线：">
                                    <el-select v-model="plantList.productLine" placeholder="产线" style="width: 160px;">
                                        <el-option label="请选择" value="" />
                                        <el-option v-for="(item, index) in productline" :key="index" :label="item.deptName" :value="item.deptId" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="组件物料：">
                                    <el-select v-model="plantList.materialCode" filterable placeholder="请选择" style="width: 160px;">
                                        <el-option label="请选择" value="" />
                                        <el-option v-for="(item, index) in materialList" :key="index" :label="item.materialCode + ' ' + item.materialName" :value="item.materialCode" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="订单号：">
                                    <el-input v-model="plantList.orderNo" placeholder="订单号" style="width: 160px;" />
                                </el-form-item>
                                <el-form-item label="订单状态：">
                                    <el-select v-model="plantList.status" placeholder="请选择" style="width: 160px;">
                                        <el-option label="请选择" value="" />
                                        <el-option label="未审核" value="submit" />
                                        <el-option label="审核通过" value="checked" />
                                        <el-option label="审核不通过" value="noPass" />
                                        <el-option label="接口失败" value="0" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="订单类型：">
                                    <el-select v-model="plantList.orderType" placeholder="请选择" style="width: 160px;">
                                        <el-option label="请选择" value="" />
                                        <el-option v-for="(item, index) in orderTypeList" :key="index" :label="item.value" :value="item.code" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="生产日期：" class="dateinput">
                                    <el-row>
                                        <el-col :span="12">
                                            <el-date-picker v-model="plantList.productDateBegin" type="date" placeholder="选择" value-format="yyyy-MM-dd" style="width: 135px;" />
                                            <span>-</span>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-date-picker v-model="plantList.productDateEnd" type="date" placeholder="选择" value-format="yyyy-MM-dd" style="width: 135px;" />
                                        </el-col>
                                    </el-row>
                                </el-form-item>
                                <el-form-item class="floatr">
                                    <el-button v-if="isAuth('verify:material:list')" type="primary" size="small" @click="GetAuditList(true)">
                                        查询
                                    </el-button>
                                    <el-button v-if="isAuth('verify:material:update')" type="primary" size="small" @click="subAutio()">
                                        审核通过
                                    </el-button>
                                    <el-button v-if="isAuth('verify:material:update')" type="danger" size="small" @click="repulseAutios()">
                                        审核不通过
                                    </el-button>
                                </el-form-item>
                            </el-form>
                        </el-col>
                    </el-row>
                    <div class="toggleSearchBottom">
                        <i class="el-icon-caret-top" />
                    </div>
                </el-card>
            </div>
            <div class="main">
                <el-card class="tableCard">
                    <div class="toggleSearchTop">
                        <i class="el-icon-caret-bottom" />
                    </div>
                    <el-form ref="pstngDate" :model="plantList" :rules="plantListRule" size="small" :inline="true" label-position="right" label-width="100px" class="topforms">
                        <el-form-item label="过账日期：" prop="pstngDate">
                            <el-date-picker v-model="plantList.pstngDate" type="date" placeholder="选择" value-format="yyyy-MM-dd" style="width: 160px;" />
                        </el-form-item>
                        <el-form-item label="抬头文本：">
                            <el-input v-model="plantList.headerTxt" placeholder="抬头文本" style="width: 160px;" />
                        </el-form-item>
                    </el-form>
                    <el-table ref="table1" header-row-class-name="tableHead" :data="AuditList" border tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" :selectable="checkboxT" width="34" />
                        <el-table-column label="审核状态" width="100">
                            <template slot-scope="scope">
                                {{ scope.row.status === 'submit' ? '未审核' : scope.row.status === 'checked' ? (scope.row.interfaceReturnStatus === '0' ? '接口失败' : '审核通过') : scope.row.status === 'noPass' ? '审核不通过' : '' }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="productDate" label="生产日期" :show-overflow-tooltip="true" width="120" />
                        <el-table-column prop="orderNo" label="生产订单号" :show-overflow-tooltip="true" width="120" />
                        <el-table-column label="生产物料" :show-overflow-tooltip="true" width="200">
                            <template slot-scope="scope">
                                {{ `${scope.row.materialCodeH} ${scope.row.materialNameH}` }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="planOutput" label="计划生产数量" width="105" />
                        <el-table-column prop="outputUnitName" label="单位" width="50" />
                        <el-table-column prop="inAmount" label="入库数量" show-overflow-tooltip width="100" />
                        <el-table-column prop="countOutputUnitName" label="单位" width="50" />
                        <el-table-column label="组件物料" :show-overflow-tooltip="true" width="200">
                            <template slot-scope="scope">
                                {{ `${scope.row.materialCode} ${scope.row.materialName}` }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="entryQnt" label="发料组件数量" width="105" />
                        <el-table-column prop="entryUomName" label="单位" width="50" />
                        <el-table-column label="物料批次" :show-overflow-tooltip="true" width="130">
                            <template slot-scope="scope">
                                <el-input v-if="scope.row.redact" v-model="scope.row.batch" size="small" />
                                <el-input v-else v-model="scope.row.batch" size="small" disabled />
                            </template>
                        </el-table-column>
                        <el-table-column prop="potNoName" label="领用罐号" :show-overflow-tooltip="true" width="100" />
                        <el-table-column prop="filterDate" label="过滤日期" :show-overflow-tooltip="true" width="100" />
                        <el-table-column label="出库库位" width="78">
                            <template slot-scope="scope">
                                <el-input v-if="scope.row.redact" v-model="scope.row.stgeLoc" size="small" />
                                <el-input v-else v-model="scope.row.stgeLoc" size="small" disabled />
                            </template>
                        </el-table-column>
                        <el-table-column prop="workShopRemark" label="车间备注" :show-overflow-tooltip="true" width="80" />
                        <el-table-column label="移动类型" width="78">
                            <template slot-scope="scope">
                                <el-input v-if="scope.row.redact" v-model="scope.row.moveType" size="small" />
                                <el-input v-else v-model="scope.row.moveType" size="small" disabled />
                            </template>
                        </el-table-column>
                        <el-table-column label="移动原因" width="120">
                            <template slot-scope="scope">
                                <el-select v-if="scope.row.redact" v-model="scope.row.moveReas" placeholder="请选择" size="small">
                                    <el-option label="请选择" value="" />
                                    <el-option v-for="(item, index) in MoveReas" :key="index" :label="item.value" :value="item.code" />
                                </el-select>
                                <el-select v-else v-model="scope.row.moveReas" placeholder="请选择" size="small" disabled>
                                    <el-option label="请选择" value="" />
                                    <el-option v-for="(item, index) in MoveReas" :key="index" :label="item.value" :value="item.code" />
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column prop="stckType" label="库存类型" width="78" />
                        <el-table-column prop="interfaceReturn" label="接口回写" :show-overflow-tooltip="true" width="150" />
                        <el-table-column prop="memo" label="审核意见" :show-overflow-tooltip="true" width="150" />
                        <el-table-column prop="verifyMan" :show-overflow-tooltip="true" label="审核人" />
                        <el-table-column prop="verifyDate" label="审核时间" width="160" />
                        <el-table-column label="备注" width="80">
                            <template slot-scope="scope">
                                <el-input v-if="scope.row.redact" v-model="scope.row.remark" size="small" />
                                <el-input v-else v-model="scope.row.remark" size="small" disabled />
                            </template>
                        </el-table-column>
                        <el-table-column fixed="right" label="操作" width="120">
                            <template slot-scope="scope">
                                <el-button v-if="!((scope.row.status === 'checked' && scope.row.interfaceReturnStatus === '1') || scope.row.status === 'noPass') && isAuth('verify:material:update')" class="ra_btn" type="primary" round size="mini" @click="redact(scope.row)">
                                    {{ scope.row.redact ? '保存' : '编辑' }}
                                </el-button>
                                <el-button v-if="scope.row.status === 'checked' && (scope.row.interfaceReturnStatus === '1' || scope.row.interfaceReturnStatus === null) && isAuth('verify:material:resetMaterial')" class="ra_btn" type="warning" round size="mini" @click="ResetD(scope.row)">
                                    反审
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-row>
                        <el-pagination :current-page="plantList.currPage" :page-sizes="[10, 20, 50]" :page-size="plantList.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="plantList.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                    </el-row>
                </el-card>
            </div>
            <el-dialog title="审核拒绝" :close-on-click-modal="false" :visible.sync="visible">
                <p style="line-height: 42px;">
                    请填写不通过原因
                </p>
                <el-input v-model="Text" type="textarea" :rows="6" class="textarea" style="width: 100%; height: 200px;" />
                <span slot="footer" class="dialog-footer">
                    <el-button @click="visible = false">取消</el-button>
                    <el-button type="primary" @click="repulseAutio()">确定</el-button>
                </span>
            </el-dialog>
            <el-dialog title="反审" :close-on-click-modal="false" :visible.sync="visibleRe">
                <p style="line-height: 42px;">
                    请填写反审意见
                </p>
                <el-input v-model="ReText" type="textarea" :rows="6" class="textarea" style="width: 100%; height: 200px;" />
                <span slot="footer" class="dialog-footer">
                    <el-button @click="visibleRe = false">取消</el-button>
                    <el-button type="primary" @click="ResetIs()">确定</el-button>
                </span>
            </el-dialog>
        </el-col>
    </el-col>
</template>

<script>
    import { BASICDATA_API, AUDIT_API, SYSTEMSETUP_API } from '@/api/api';
    import { headanimation } from '@/net/validate';
    export default {
        name: 'Index',
        components: {},
        data() {
            return {
                lodingStatus1: false,
                dataListLoading: false,
                visible: false,
                visibleRe: false,
                ReText: '',
                reData: {},
                factory: [],
                workshop: [],
                productline: [],
                Text: '',
                MoveReas: [],
                orderTypeList: [],
                plantListRule: {
                    pstngDate: [{ required: true, message: '过账日期不能为空', trigger: 'blur' }]
                },
                plantList: {
                    orderNo: '',
                    factory: '',
                    workShop: '',
                    productLine: '',
                    productDateBegin: new Date(new Date() - 24 * 60 * 60 * 1000).getFullYear().toString() + '-' + (new Date(new Date() - 24 * 60 * 60 * 1000).getMonth() + 1 >= 10 ? (new Date(new Date() - 24 * 60 * 60 * 1000).getMonth() + 1).toString() : '0' + (new Date(new Date() - 24 * 60 * 60 * 1000).getMonth() + 1)) + '-' + (new Date(new Date() - 24 * 60 * 60 * 1000).getDate() >= 10 ? new Date(new Date() - 24 * 60 * 60 * 1000).getDate().toString() : '0' + new Date(new Date() - 24 * 60 * 60 * 1000).getDate()),
                    productDateEnd: '',
                    pstngDate: new Date().getFullYear().toString() + '-' + (new Date().getMonth() + 1 >= 10 ? (new Date().getMonth() + 1).toString() : '0' + (new Date().getMonth() + 1)) + '-' + (new Date().getDate() >= 10 ? new Date().getDate().toString() : '0' + new Date().getDate()),
                    headerTxt: '',
                    orderType: '',
                    status: '',
                    currPage: 1,
                    pageSize: 10,
                    totalCount: 0,
                    materialCode: ''
                },
                AuditList: [],
                multipleSelection: [],
                materialList: []
            };
        },
        computed: {},
        watch: {
            'plantList.factory'(n) {
                this.plantList.orderType = '';
                this.Getdeptbyid(n);
                this.getDictList(n);
                this.getMaterial(n);
            },
            'plantList.workShop'(n) {
                this.GetParentline(n);
            }
        },
        mounted() {
            this.Getdeptcode();
            this.GetMoveReas();
            headanimation(this.$);
        },
        methods: {
            getMaterial(factory) {
                this.$http(`${AUDIT_API.AUDIT_ISSUE_MATERIAL_API}`, 'POST', { factory: factory }, false, false, false).then(({ data }) => {
                    if (data.code === 0) {
                        this.materialList = data.list;
                    } else {
                        this.$warningTost(data.msg);
                    }
                });
            },
            getDictList(factory) {
                const params = { types: ['order_type'], factory };
                this.$http(`${SYSTEMSETUP_API.PARAMETERSLIST_API}`, 'POST', params)
                    .then(({ data }) => {
                        if (data.code === 0) {
                            this.orderTypeList = data.dicList[0].prolist;
                        } else {
                            this.$successTost(data.msg);
                        }
                    })
                    .catch(error => {
                        console.log('catch data::', error);
                    });
            },
            // 获取列表
            GetAuditList(st) {
                if (st) {
                    this.plantList.currPage = 1;
                }
                if (!this.plantList.factory) {
                    this.$warningTost('请选择工厂');
                    return;
                }
                this.plantList.headerTxt = '';
                this.dataListLoading = true;
                this.GetMoveReas(this.plantList.factory);
                this.$http(`${AUDIT_API.AUDITISSUELIST_API}`, 'POST', this.plantList).then(({ data }) => {
                    if (data.code === 0) {
                        this.AuditList = data.page.list;
                        this.plantList.currPage = data.page.currPage;
                        this.plantList.pageSize = data.page.pageSize;
                        this.plantList.totalCount = data.page.totalCount;
                    } else {
                        this.$successTost(data.msg);
                    }
                    this.dataListLoading = false;
                });
            },
            // 反审
            ResetD(row) {
                this.visibleRe = true;
                this.reData = row;
            },
            ResetIs() {
                this.$confirm('部分数据已经调用SAP接口已发料，请确认sap冲销，确认要反审？', '反审', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.reData.status = 'submit';
                    this.reData.memo = this.ReText;
                    this.dataListLoading = true;
                    this.$http(`${AUDIT_API.AUDIT_ISSUE_RESET_API}`, 'POST', this.reData).then(({ data }) => {
                        this.dataListLoading = false;
                        if (data.code === 0) {
                            this.visibleRe = false;
                            this.ReText = '';
                            this.reData = {};
                            this.GetAuditList();
                            this.$notify({ title: '成功', message: '操作成功', type: 'success' });
                        } else {
                            this.$successTost(data.msg);
                        }
                    });
                }).catch(() => {
                    // this.$infoTost('已取消删除');
                });
            },
            // 获取移动原因
            GetMoveReas() {
                this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', { type: 'move_reas' }).then(({ data }) => {
                    if (data.code === 0) {
                        this.MoveReas = data.dicList;
                    } else {
                        this.$successTost(data.msg);
                    }
                });
            },
            // 获取工厂
            Getdeptcode() {
                this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST').then(({ data }) => {
                    if (data.code === 0) {
                        this.factory = data.typeList;
                        this.plantList.factory = data.typeList[0].deptId;
                    } else {
                        this.$successTost(data.msg);
                    }
                });
            },
            // 获取车间
            Getdeptbyid(id) {
                this.plantList.workShop = '';
                this.plantList.productLine = '';
                if (id) {
                    this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', { deptId: id }).then(({ data }) => {
                        if (data.code === 0) {
                            this.workshop = data.typeList;
                            if (!this.plantList.workShop && data.typeList.length > 0) {
                                this.plantList.workShop = data.typeList[0].deptId;
                            }
                        } else {
                            this.$successTost(data.msg);
                        }
                    });
                } else {
                    this.workshop = [];
                }
            },
            // 获取产线
            GetParentline(id) {
                this.plantList.productLine = '';
                if (id) {
                    this.$http(`${BASICDATA_API.FINDORGBYPARENTID_API}`, 'POST', { parentId: id }).then(({ data }) => {
                        if (data.code === 0) {
                            this.productline = data.childList;
                        } else {
                            this.$successTost(data.msg);
                        }
                    });
                } else {
                    this.productline = [];
                }
            },
            // 表格选中
            handleSelectionChange(val) {
                this.multipleSelection = [];
                val.forEach((item) => {
                    this.multipleSelection.push(item);
                });
            },
            // 过账日期
            SetPostgDate(date) {
                return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
            },
            // 审核通过禁用
            checkboxT(row) {
                if ((row.status === 'checked' && (row.interfaceReturnStatus === '1' || row.interfaceReturnStatus === null)) || row.status === 'noPass') {
                    return 0;
                }
                return 1;
            },
            // 编辑
            redact(row) {
                if (!row.redact) {
                    row.redact = true;
                    this.AuditList.splice(this.AuditList.length, 0, {});
                    this.AuditList.splice(this.AuditList.length - 1, 1);
                } else {
                    row.pstngDate = this.plantList.pstngDate;
                    // row.status = '';
                    this.lodingStatus1 = true;
                    this.$http(`${AUDIT_API.AUDITISSUE_SAVE_API}`, 'POST', [row])
                        .then(({ data }) => {
                            this.lodingStatus1 = false;
                            if (data.code === 0) {
                                this.$notify({ title: '成功', message: '操作成功', type: 'success' });
                                row.redact = false;
                                this.AuditList.splice(this.AuditList.length, 0, {});
                                this.AuditList.splice(this.AuditList.length - 1, 1);
                            } else {
                                this.$successTost(data.msg);
                            }
                            this.GetAuditList();
                        })
                        .catch(() => {
                            this.$notify.error({ title: '错误', message: '网络错误' });
                            this.lodingStatus1 = false;
                        });
                }
            },
            // 审核拒绝
            repulseAutios() {
                if (this.multipleSelection.length <= 0) {
                    this.$warningTost('请选择订单');
                } else {
                    this.visible = true;
                }
            },
            repulseAutio() {
                if (this.Text.length <= 0) {
                    this.$warningTost('请填写不通过原因');
                } else {
                    this.$refs.pstngDate.validate(valid => {
                        if (valid) {
                            this.$confirm('确认审核不通过, 是否继续?', '审核不通过', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                this.multipleSelection.forEach(item => {
                                    item.status = 'noPass';
                                    item.memo = this.Text;
                                    item.pstngDate = this.plantList.pstngDate;
                                });
                                this.lodingStatus1 = true;
                                this.$http(`${AUDIT_API.AUDITISSUEUPDATE_API}`, 'POST', this.multipleSelection)
                                    .then(({ data }) => {
                                        this.lodingStatus1 = false;
                                        if (data.code === 0) {
                                            this.visible = false;
                                            this.$notify({ title: '成功', message: '操作成功', type: 'success' });
                                            this.GetAuditList();
                                        } else {
                                            this.$successTost(data.msg);
                                        }
                                    })
                                    .catch(() => {
                                        this.$notify.error({ title: '错误', message: '网络错误' });
                                        this.lodingStatus1 = false;
                                    });
                            }).catch(() => {
                                // this.$infoTost('已取消删除');
                            });
                        }
                    });
                }
            },
            // 审核通过
            subAutio() {
                if (this.multipleSelection.length <= 0) {
                    this.$warningTost('请选择订单');
                } else {
                    this.$refs.pstngDate.validate(valid => {
                        if (valid) {
                            this.$confirm('确认审核通过, 是否继续?', '审核通过', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                this.multipleSelection.forEach(item => {
                                    item.status = 'checked';
                                    item.memo = '审核通过';
                                    item.pstngDate = this.plantList.pstngDate;
                                    item.headerTxt = this.plantList.headerTxt;
                                });
                                this.lodingStatus1 = true;
                                this.$http(`${AUDIT_API.AUDITISSUEUPDATE_API}`, 'POST', this.multipleSelection)
                                    .then(({ data }) => {
                                        this.lodingStatus1 = false;
                                        if (data.code === 0) {
                                            this.$notify({ title: '成功', message: '操作成功', type: 'success' });
                                            this.GetAuditList();
                                        } else {
                                            this.$successTost(data.msg);
                                            this.GetAuditList();
                                        }
                                    })
                                    .catch(() => {
                                        this.$notify.error({ title: '错误', message: '网络错误' });
                                        this.lodingStatus1 = false;
                                    });
                            }).catch(() => {
                                // this.$infoTost('已取消删除');
                            });
                        }
                    });
                }
            },
            // 改变每页条数
            handleSizeChange(val) {
                this.plantList.pageSize = val;
                this.GetAuditList();
            },
            // 跳转页数
            handleCurrentChange(val) {
                this.plantList.currPage = val;
                this.GetAuditList();
            }
        }
    };
</script>

<style lang="scss">
    .searchCard {
        margin-bottom: 0;
    }
    .switching .el-card__body {
        padding-bottom: 0;
    }
    .searchCard,
    .tableCard {
        position: relative;
        .toggleSearchTop {
            position: absolute;
            top: 0;
            left: 0;
            display: none;
            width: 100%;
            text-align: center;
            cursor: pointer;
        }
        .toggleSearchBottom {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            text-align: center;
            cursor: pointer;
        }
        .el-icon-caret-top::before,
        .el-icon-caret-bottom::before {
            color: #dcdfe6;
        }
    }
    .topforms {
        .el-date-editor.el-input {
            width: auto;
        }
        .formtextarea {
            .el-form-item__content {
                width: 500px;
            }
        }
    }
</style>
