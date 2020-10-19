<template>
    <div class="header_main">
        <mds-card title="订单管理" :name="'role'" :pack-up="false" style="background: #fff;">
            <template slot="titleBtn">
                <div style="float: right; height: 32px; margin-bottom: 10px;">
                    <el-input v-model="form.orderNo" size="small" placeholder="订单号" suffix-icon="el-icon-search" style="width: 180px; margin-right: 16px;" />
                    <el-button v-if="isAuth('sys:sapOrder:list')" type="primary" size="small" @click="querys(true)">
                        查询
                    </el-button>
                    <el-button v-if="isAuth('sys:sapOrder:list')" type="primary" size="small" @click="visible = true">
                        高级查询
                    </el-button>
                    <el-button v-if="isAuth('sys:sapOrder:syncOrderManual')" type="primary" size="small" @click="sapOrderUpdate('7100')">
                        欣和企业同步
                    </el-button>
                    <el-button v-if="isAuth('sys:sapOrder:syncOrderManualWeiDaMei')" type="primary" size="small" @click="sapOrderUpdate('6010')">
                        味达美同步
                    </el-button>
                </div>
            </template>
            <el-table ref="table1" class="newTable" :height="mainClientHeight - 30 - 42 - 47" border header-row-class-name="tableHead" :data="sapOrderlist" tooltip-effect="dark" style="width: 100%;">
                <el-table-column width="122" label="生产订单">
                    <template slot-scope="scope">
                        {{ scope.row.orderNo }}
                    </template>
                </el-table-column>
                <el-table-column label="订单类型" width="77">
                    <template slot-scope="scope">
                        {{ scope.row.orderType }}
                    </template>
                </el-table-column>
                <el-table-column prop="factory" label="工厂" width="77" />
                <el-table-column prop="commitDate" label="基本完成日期" header-align="center" width="105" />
                <el-table-column prop="startDate" label="基本开始日期" header-align="center" width="105" />
                <el-table-column label="物料" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.materialName }}
                        {{ scope.row.materialCode }}
                    </template>
                </el-table-column>
                <el-table-column prop="orderNum" label="订单数量" header-align="center" align="left" width="80" />
                <el-table-column prop="orderUnit" label="订单单位" header-align="center" width="80" />
                <el-table-column prop="dispatchMan" label="生产调度员" header-align="center" width="91" />
                <el-table-column prop="syncDate" label="同步日期" width="100" />
            </el-table>
            <el-row>
                <el-pagination :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </el-row>
        </mds-card>
        <el-dialog title="高级查询" :close-on-click-modal="false" :visible.sync="visible">
            <div class="formdata">
                <el-form :model="form" size="small" label-width="110px" class="orderdialog">
                    <el-form-item label="工厂：">
                        <el-select v-model="form.factory" placeholder="请选择">
                            <el-option label="" value="">
                                请选择
                            </el-option>
                            <el-option v-for="(item, index) in factory" :key="index" :label="item.deptName" :value="item.deptId" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="生产订单：">
                        <el-input v-model="form.orderNo" placeholder="手工录入" />
                    </el-form-item>
                    <el-form-item label="物料：">
                        <el-input v-model="form.materialCode" placeholder="手工录入" />
                    </el-form-item>
                    <el-form-item label="生产调度员：">
                        <el-input v-model="form.dispatchMan" placeholder="手工录入" />
                    </el-form-item>
                    <el-form-item label="基本开始日期：" class="times">
                        <el-row>
                            <el-col :span="12">
                                <el-date-picker v-model="form.startDateOne" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 150px;" />
                            </el-col>
                            <el-col :span="12">
                                <el-date-picker v-model="form.startDateTwo" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 150px;" />
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="基本完成日期：" class="times">
                        <el-row>
                            <el-col :span="12">
                                <el-date-picker v-model="form.commitDateOne" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 150px;" />
                            </el-col>
                            <el-col :span="12">
                                <el-date-picker v-model="form.commitDateTwo" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 150px;" />
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="visible = false">取消</el-button>
                <el-button type="primary" @click="querys(true)">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { BASICDATA_API } from '@/api/api';
import { Loading } from 'element-ui';
export default {
    name: 'OrderManage',
    components: {},
    data() {
        return {
            loadings: {},
            loading: true,
            visible: false,
            orderTime: {},
            form: {
                orderNo: '',
                materialCode: '',
                dispatchMan: '',
                startDateOne: '',
                commitDateOne: ''
            },
            sapOrderlist: [],
            factory: [],
            currPage: 1,
            pageSize: 10,
            totalCount: 1
        };
    },
    computed: {
        mainClientHeight: {
            get() {
                return this.$store.state.common.mainClientHeight;
            }
        }
    },
    mounted() {
        this.Getdeptcode();
        this.GetOrderList();
    },
    methods: {
        // 获取工厂
        Getdeptcode() {
            this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST', false, false, false).then(({ data }) => {
                if (data.code === 0) {
                    this.factory = data.typeList;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 获取订单管理
        GetOrderList() {
            this.form.currPage = JSON.stringify(this.currPage);
            this.form.pageSize = JSON.stringify(this.pageSize);
            this.$http(`${BASICDATA_API.ORDERLIST_API}`, 'POST', this.form).then(({ data }) => {
                this.loading = false;
                if (data.code === 0) {
                    this.sapOrderlist = data.page.list;
                    this.pageSize = data.page.pageSize;
                    this.totalCount = data.page.totalCount;
                    this.currPage = data.page.currPage;
                    this.visible = false;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 同步
        sapOrderUpdate(code) {
            // this.loading = true
            this.loadings = Loading.service({
                lock: true,
                spinner: 'loadingGif',
                text: '加载中……',
                background: 'rgba(255, 255, 255, 0.7)'
            });
            this.$http(`${BASICDATA_API.SAPORDERUPDATE_API}`, 'GET', { werks: code }, false, false, false)
                .then(({ data }) => {
                    if (data.code === 0) {
                        this.orderTime = setInterval(() => {
                            this.GetOrderUpdateStatus(code);
                        }, 4000);
                    } else {
                        this.loadings.close();
                    }
                })
                .catch(() => {
                    // this.loading = false
                    this.loadings.close();
                });
        },
        GetOrderUpdateStatus(codes) {
            let codestring;
            if (codes === '6010') {
                codestring = 'ASYNC_SAP_ORDER_WEIDAMEI';
            } else {
                codestring = 'ASYNC_SAP_ORDER';
            }
            this.$http(`${BASICDATA_API.GETSAPORDERUPDATE_API}`, 'GET', { asyncType: codestring }, false, false, false)
                .then(({ data }) => {
                    if (data.code === 0) {
                        if (data.asyncRecord) {
                            if (data.asyncRecord.asyncStatus === '0') {
                                // this.loading = false
                                this.loadings.close();
                                clearInterval(this.orderTime);
                                this.$notify.error({
                                    title: '错误',
                                    message: '同步失败'
                                });
                            } else if (data.asyncRecord.asyncStatus === '1') {
                                // this.loading = false
                                this.loadings.close();
                                clearInterval(this.orderTime);
                                this.$notify({
                                    title: '成功',
                                    message: '同步成功',
                                    type: 'success'
                                });
                                this.GetOrderList();
                            }
                        }
                    } else {
                        // this.loading = false
                        this.loadings.close();
                        clearInterval(this.orderTime);
                        this.$errorToast(data.msg);
                    }
                })
                .catch(() => {
                    // this.loading = false
                    this.loadings.close();
                    clearInterval(this.orderTime);
                });
        },
        // 查询
        querys(st) {
            if (st) {
                this.currPage = 1;
            }
            this.GetOrderList();
        },
        // 改变每页条数
        handleSizeChange(val) {
            this.pageSize = val;
            this.GetOrderList();
        },
        // 跳转页数
        handleCurrentChange(val) {
            this.currPage = val;
            this.GetOrderList();
        }
    }
};
</script>

<style lang="scss">
.orderdialog {
    margin: auto;

    input {
        width: 300px !important;
    }

    .times {
        input {
            width: 150px !important;
        }
    }
}
</style>
<style lang="scss" scoped>
.formdata {
    .times {
        input {
            width: 200px !important;
        }
    }
}
</style>
