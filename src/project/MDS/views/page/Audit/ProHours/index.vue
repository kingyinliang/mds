<template>
    <el-col>
        <el-col>
            <div class="header_main">
                <el-card class="searchCard switching">
                    <el-row type="flex">
                        <el-col>
                            <el-form :model="plantList" size="small" :inline="true" label-position="right" label-width="70px" class="multi_row" @keyup.enter.native="getAuditList()" @submit.native.prevent>
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
                                <el-form-item label="是否报工：">
                                    <el-select v-model="plantList.finConf" placeholder="请选择" style="width: 160px;">
                                        <el-option label="请选择" value="" />
                                        <el-option label="部分" value="0" />
                                        <el-option label="完全" value="X" />
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
                                    <el-button v-if="isAuth('verify:time:list')" type="primary" size="small" @click="getAuditList(true)">
                                        查询
                                    </el-button>
                                    <el-button v-if="isAuth('verify:time:update')" type="primary" size="small" @click="subAutio">
                                        审核通过
                                    </el-button>
                                    <el-button v-if="isAuth('verify:time:update')" type="danger" size="small" @click="repulseAutios">
                                        审核不通过
                                    </el-button>
                                </el-form-item>
                            </el-form>
                        </el-col>
                    </el-row>
                    <div class="toggleSearchBottom">
                        <em class="el-icon-caret-top" />
                    </div>
                </el-card>
            </div>
            <div class="main">
                <el-card class="tableCard">
                    <div class="toggleSearchTop">
                        <em class="el-icon-caret-bottom" />
                    </div>
                    <el-form ref="postgDate" :model="plantList" :rules="plantListRule" size="small" :inline="true" label-position="right" label-width="100px" class="topforms">
                        <el-form-item label="记账日期：" prop="postgDate">
                            <el-date-picker v-model="plantList.postgDate" type="date" placeholder="选择" value-format="yyyy-MM-dd" style="width: 160px;" />
                        </el-form-item>
                    </el-form>
                    <el-table ref="table1" header-row-class-name="tableHead" :data="AuditList" max-height="450" border tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" :selectable="checkboxT" width="50" />
                        <el-table-column label="审核状态" width="100">
                            <template slot-scope="scope">
                                {{ scope.row.status === 'submit' ? '未审核' : scope.row.status === 'checked' ? (scope.row.interfaceReturnStatus === '0' ? '接口失败' : '审核通过') : scope.row.status === 'noPass' ? '审核不通过' : '' }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="productDate" label="生产日期" :show-overflow-tooltip="true" width="120" />
                        <el-table-column prop="orderNo" label="生产订单号" :show-overflow-tooltip="true" width="120" />
                        <el-table-column label="生产物料" :show-overflow-tooltip="true" width="360">
                            <template slot-scope="scope">
                                {{ scope.row.materialCode + ' ' + scope.row.materialName }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="planOutput" label="计划生产数量" width="105" />
                        <el-table-column prop="outputUnitName" label="单位" width="50" />
                        <el-table-column prop="yield" label="实际生产数量" width="105" />
                        <el-table-column prop="confQuanUnitName" label="单位" width="50" />
                        <el-table-column prop="confActivity1" label="准备工时" width="78" />
                        <el-table-column prop="confActiUnit1" label="单位" width="50" />
                        <el-table-column prop="confActivity2" label="机器工时" width="78" />
                        <el-table-column prop="confActiUnit2" label="单位" width="50" />
                        <el-table-column prop="confActivity3" label="人工工时" width="78" />
                        <el-table-column prop="confActiUnit3" label="单位" width="50" />
                        <el-table-column prop="interfaceReturn" label="接口回写" :show-overflow-tooltip="true" width="150" />
                        <el-table-column label="执行开始的确认日期" width="148">
                            <template slot-scope="scope">
                                <el-date-picker v-if="scope.row.redact" v-model="scope.row.execStartDate" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择" size="small" />
                                <span v-else>{{ scope.row.execStartDate }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="设置完成的确认日期" width="148">
                            <template slot-scope="scope">
                                <el-date-picker v-if="scope.row.redact" v-model="scope.row.setupFinDate" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择" size="small" />
                                <span v-else>{{ scope.row.setupFinDate }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作活动编号" :show-overflow-tooltip="true" width="105">
                            <template slot-scope="scope">
                                <el-input v-if="scope.row.redact" v-model="scope.row.operation" placeholder="手工录入" size="small" />
                                <span v-else>{{ scope.row.operation }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="部分/最后确认" :show-overflow-tooltip="true" width="112">
                            <template slot-scope="scope">
                                <el-input v-if="scope.row.redact" v-model="scope.row.finConf" placeholder="手工录入" size="small" />
                                <span v-else>{{ scope.row.finConf }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="memo" label="审核意见" :show-overflow-tooltip="true" width="150" />
                        <el-table-column prop="verifyMan" label="审核人" width="150" />
                        <el-table-column prop="verifyDate" label="审核时间" width="160" />
                        <el-table-column fixed="right" label="操作" width="70">
                            <template slot-scope="scope">
                                <el-button v-if="!((scope.row.status === 'checked' && scope.row.interfaceReturnStatus === '1') || scope.row.status === 'noPass') && isAuth('verify:time:update')" class="ra_btn" type="primary" round size="mini" @click="redact(scope.row)">
                                    {{ scope.row.redact ? '保存' : '编辑' }}
                                </el-button>
                                <el-button v-if="scope.row.status === 'checked' && scope.row.interfaceReturnStatus === '1' && isAuth('verify:time:resetTime')" class="ra_btn" type="warning" round size="mini" @click="ResetD(scope.row)">
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
                    <el-button type="primary" @click="ResetTime()">确定</el-button>
                </span>
            </el-dialog>
            <el-dialog title="类型选择" :close-on-click-modal="false" :visible.sync="visibleSterilized">
                <el-radio v-model="backType" label="0">
                    人工工时退回
                </el-radio>
                <el-radio v-model="backType" label="1">
                    机器工时退回
                </el-radio>
                <el-radio v-model="backType" label="2">
                    全部退回
                </el-radio>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="visibleSterilized = false">取消</el-button>
                    <el-button type="primary" @click="repulseAutioSterilized()">确定</el-button>
                </span>
            </el-dialog>
        </el-col>
    </el-col>
</template>

<script>
    import { BASICDATA_API, AUDIT_API } from '@/api/api';
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
                visibleSterilized: false,
                backType: '0',
                factory: [],
                workshop: [],
                productline: [],
                Text: '',
                ReText: '',
                reData: {},
                plantListRule: {
                    postgDate: [{ required: true, message: '记账日期不能为空', trigger: 'blur' }]
                },
                plantList: {
                    orderNo: '',
                    factory: '',
                    workShop: '',
                    productLine: '',
                    productDateBegin: new Date(new Date() - 24 * 60 * 60 * 1000).getFullYear().toString() + '-' + (new Date(new Date() - 24 * 60 * 60 * 1000).getMonth() + 1 >= 10 ? (new Date(new Date() - 24 * 60 * 60 * 1000).getMonth() + 1).toString() : '0' + (new Date(new Date() - 24 * 60 * 60 * 1000).getMonth() + 1)) + '-' + (new Date(new Date() - 24 * 60 * 60 * 1000).getDate() >= 10 ? new Date(new Date() - 24 * 60 * 60 * 1000).getDate().toString() : '0' + new Date(new Date() - 24 * 60 * 60 * 1000).getDate()),
                    productDateEnd: '',
                    postgDate: new Date().getFullYear().toString() + '-' + (new Date().getMonth() + 1 >= 10 ? (new Date().getMonth() + 1).toString() : '0' + (new Date().getMonth() + 1)) + '-' + (new Date().getDate() >= 10 ? new Date().getDate().toString() : '0' + new Date().getDate()),
                    status: '',
                    currPage: 1,
                    pageSize: 10,
                    totalCount: 0,
                    finConf: ''
                },
                AuditList: [],
                multipleSelection: []
            };
        },
        computed: {},
        watch: {
            'plantList.factory'(n) {
                this.Getdeptbyid(n);
            },
            'plantList.workShop'(n) {
                this.GetParentline(n);
            }
        },
        mounted() {
            this.Getdeptcode();
            headanimation(this.$);
        },
        methods: {
            // 获取列表
            getAuditList(st) {
                this.AuditList = [];
                if (!this.plantList.factory) {
                    this.$warningToast('请选择工厂');
                    return;
                }
                if (!this.plantList.workShop) {
                    this.$warningToast('请选择车间');
                    return;
                }
                if (st) {
                    this.plantList.currPage = 1;
                }
                this.dataListLoading = true;
                this.$http(`${AUDIT_API.AUDITHOURSLIST_API}`, 'POST', this.plantList).then(({ data }) => {
                    if (data.code === 0) {
                        if (data.page.list.length === 0) {
                            this.$infoToast('暂无任何内容');
                        } else {
                            this.AuditList = data.page.list;
                            this.plantList.currPage = data.page.currPage;
                            this.plantList.pageSize = data.page.pageSize;
                            this.plantList.totalCount = data.page.totalCount;
                        }

                    } else {
                        this.$errorToast(data.msg);
                    }
                    this.dataListLoading = false;
                });
            },
            // exportTable () {
            //   require.ensure([], () => {
            //     const tHeader = ['供应商编号', '供应商名称', '输入代码', '税务代码']
            //     const filterVal = ['num', 'name', 'words', 'shuiwu_num']
            //     const list = this.tableData
            //     const data = this.formatJson(filterVal, list)
            //     export_json_to_excel(tHeader, data, '供应商名称列表')
            //   })
            // },
            // formatJson (filterVal, jsonData) {
            //   return jsonData.map(v => filterVal.map(j => v[j]))
            // },
            // 反审
            ResetD(row) {
                this.visibleRe = true;
                this.reData = row;
            },
            ResetTime() {
                this.$confirm('数据已调用SAP接口已报工，请确认SAP冲销，确认要反审？', '反审', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.reData.status = 'submit';
                    this.reData.memo = this.ReText;
                    this.lodingStatus1 = true;
                    this.$http(`${AUDIT_API.AUDIT_HOURS_RESET_API}`, 'POST', this.reData)
                        .then(({ data }) => {
                            this.lodingStatus1 = false;
                            if (data.code === 0) {
                                this.visibleRe = false;
                                this.ReText = '';
                                this.reData = {};
                                this.getAuditList();
                                this.$notify({ title: '成功', message: '操作成功', type: 'success' });
                            } else {
                                this.$errorToast(data.msg);
                            }
                        })
                        .catch(() => {
                            this.$notify.error({ title: '错误', message: '网络错误' });
                            this.lodingStatus1 = false;
                        });
                }).catch(() => {
                    // this.$infoToast('已取消删除');
                });
            },
            // 获取工厂
            Getdeptcode() {
                this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST').then(({ data }) => {
                    if (data.code === 0) {
                        this.factory = data.typeList;
                        this.plantList.factory = data.typeList[0].deptId;
                    } else {
                        this.$errorToast(data.msg);
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
                            this.$errorToast(data.msg);
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
                            this.$errorToast(data.msg);
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
            // 审核通过禁用
            checkboxT(row) {
                if ((row.status === 'checked' && row.interfaceReturnStatus === '1') || row.status === 'noPass') {
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
                    row.postgDate = this.plantList.postgDate;
                    row.status = '';
                    this.lodingStatus1 = true;
                    this.$http(`${AUDIT_API.AUDITHOURSUPDATE_API}`, 'POST', [row])
                        .then(({ data }) => {
                            this.lodingStatus1 = false;
                            if (data.code === 0) {
                                this.$notify({ title: '成功', message: '操作成功', type: 'success' });
                                row.redact = false;
                                this.AuditList.splice(this.AuditList.length, 0, {});
                                this.AuditList.splice(this.AuditList.length - 1, 1);
                            } else {
                                this.$errorToast(data.msg);
                            }
                            this.getAuditList();
                        })
                        .catch(() => {
                            this.$notify.error({ title: '错误', message: '网络错误' });
                            this.lodingStatus1 = false;
                        });
                }
            },
            // 序号
            indexMethod(index) {
                return index + 1 + (Number(this.plantList.currPage) - 1) * Number(this.plantList.pageSize);
            },
            // 审核拒绝
            repulseAutios() {
                if (this.plantList.factory === '') {
                    this.$warningToast('请选择工厂');
                    return false;
                }
                if (this.plantList.workShop === '') {
                    this.$warningToast('请选择车间');
                    return false;
                }
                if (this.multipleSelection.length <= 0) {
                    this.$warningToast('请选择订单');
                    return false;
                }
                if (this.workshop.find(item => item.deptId === this.plantList.workShop).deptName.indexOf('杀菌') === 0 || this.workshop.find(item => item.deptId === this.plantList.workShop).deptName.indexOf('过滤') === 0) {
                    this.visibleSterilized = true;
                } else {
                    this.visible = true;
                }
                // if (this.multipleSelection.length <= 0) {
                //   this.$notify.error({title: '错误', message: '请选择订单'})
                // } else {
                //   this.visible = true
                // }
            },
            repulseAutioSterilized() {
                this.visible = true;
                this.visibleSterilized = false;
            },
            repulseAutio() {
                if (this.Text.length <= 0) {
                    this.$warningToast('请填写不通过原因');
                } else {
                    this.$refs.postgDate.validate(valid => {
                        if (valid) {
                            this.$confirm('确认审核不通过, 是否继续?', '审核不通过', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                this.multipleSelection.forEach(item => {
                                    item.status = 'noPass';
                                    item.memo = this.Text;
                                    item.postgDate = this.plantList.postgDate;
                                    item.backType = this.backType;
                                });
                                this.lodingStatus1 = true;
                                this.$http(`${AUDIT_API.AUDITHOURSUPDATE_API}`, 'POST', this.multipleSelection)
                                    .then(({ data }) => {
                                        this.lodingStatus1 = false;
                                        if (data.code === 0) {
                                            this.visible = false;
                                            this.Text = '';
                                            this.getAuditList();
                                            this.$notify({ title: '成功', message: '操作成功', type: 'success' });
                                        } else {
                                            this.$errorToast(data.msg);
                                        }
                                    })
                                    .catch(() => {
                                        this.$notify.error({ title: '错误', message: '网络错误' });
                                        this.lodingStatus1 = false;
                                    });
                            }).catch(() => {
                                // this.$infoToast('已取消删除');
                            });
                        }
                    });
                }
            },
            // 审核通过
            subAutio() {
                if (this.multipleSelection.length <= 0) {
                    this.$warningToast('请选择订单');
                } else {
                    let st = false;
                    if (this.workshop.find(item => item.deptId === this.plantList.workShop).deptName.indexOf('杀菌') === 0) {
                        this.multipleSelection.forEach(item => {
                            if (Number(item.confActivity2) <= 0) {
                                st = true;
                                this.$warningToast('机器工时必须大于0');
                                return false;
                            }
                        });
                    }
                    if (st) {
                        return;
                    }
                    this.$refs.postgDate.validate(valid => {
                        if (valid) {
                            this.$confirm('确认审核通过, 是否继续?', '审核通过', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                this.multipleSelection.forEach(item => {
                                    item.status = 'checked';
                                    item.memo = '审核通过';
                                    item.postgDate = this.plantList.postgDate;
                                });
                                this.lodingStatus1 = true;
                                this.$http(`${AUDIT_API.AUDITHOURSUPDATE_API}`, 'POST', this.multipleSelection)
                                    .then(({ data }) => {
                                        this.lodingStatus1 = false;
                                        if (data.code === 0) {
                                            this.$notify({ title: '成功', message: '操作成功', type: 'success' });
                                            this.getAuditList();
                                        } else {
                                            this.getAuditList();
                                            this.$errorToast(data.msg);
                                        }
                                    })
                                    .catch(() => {
                                        this.$notify.error({ title: '错误', message: '网络错误' });
                                        this.lodingStatus1 = false;
                                    });
                            }).catch(() => {
                                // this.$infoToast('已取消删除');
                            });
                        }
                    });
                }
            },
            // 改变每页条数
            handleSizeChange(val) {
                this.plantList.pageSize = val;
                this.getAuditList();
            },
            // 跳转页数
            handleCurrentChange(val) {
                this.plantList.currPage = val;
                this.getAuditList();
            }
        }
    };
</script>

<style lang="scss" scoped>
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
    }
</style>
