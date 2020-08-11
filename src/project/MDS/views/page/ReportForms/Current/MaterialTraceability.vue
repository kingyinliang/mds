<template>
    <div class="header_main">
        <query-table ref="queryTable" :query-form-data="queryFormData" :list-interface="listInterface" query-auth="report:production:materielTrace" :column="column" />
        <el-card class="searchCard  newCard ferCard">
            <el-form :inline="true" :model="formHeader" size="small" label-width="75px" class="marbottom">
                <el-form-item label="生产工厂：">
                    <el-select v-model="formHeader.factory" placeholder="请选择" class="width140px">
                        <el-option value="">
                            请选择
                        </el-option>
                        <el-option v-for="(item, index) in factory" :key="index" :label="item.deptName" :value="item.deptId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="生产车间：">
                    <el-select v-model="workShopStr" value-key="deptId" palceholder="请选择" class="width140px">
                        <el-option value="">
                            请选择
                        </el-option>
                        <el-option v-for="item in workshop" :key="item.deptId" :value="item" :label="item.deptName" />
                    </el-select>
                </el-form-item>
                <el-form-item label="生产产线：">
                    <el-select v-model="formHeader.productLine" placeholder="请选择" class="width140px">
                        <el-option label="请选择" value="" />
                        <el-option v-for="(item, index) in productline" :key="index" :label="item.deptName" :value="item.deptId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="订单号：">
                    <el-input v-model="formHeader.orderNo" />
                </el-form-item>
                <el-form-item label="生产物料：">
                    <el-select v-model="formHeader.materialCode" filterable placeholder="请选择" style="width: 140px;">
                        <el-option label="请选择" value="" />
                        <el-option v-for="(sole, index) in materiaList" :key="index" :value="sole.MATERIAL_CODE" :label="`${sole.MATERIAL_CODE}` + ' ' + `${sole.MATERIAL_NAME}`" />
                    </el-select>
                </el-form-item>
                <el-form-item label="生产批次：">
                    <el-input v-model="formHeader.batch" class="width140px" />
                </el-form-item>
                <el-form-item label="组件物料：">
                    <el-select v-model="formHeader.materialCodeLittle" filterable placeholder="请选择" style="width: 140px;">
                        <el-option label="请选择" value="" />
                        <el-option v-for="(item, index) in materialList" :key="index" :label="item.materialCode + ' ' + item.materialName" :value="item.materialCode" />
                    </el-select>
                </el-form-item>
                <el-form-item label="组件批次：">
                    <el-input v-model="formHeader.batchLittle" class="width140px" />
                </el-form-item>
                <el-form-item label="生产日期：">
                    <el-date-picker v-model="formHeader.orderStartDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择日期" style="width: 140px;" />
                    -
                    <el-date-picker v-model="formHeader.orderEndDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择日期" style="width: 140px;" />
                </el-form-item>
                <el-form-item style="float: right;">
                    <el-button v-if="isAuth('report:production:materielTrace')" type="primary" size="small" style="float: right;" @click="GetList(true)">
                        查询
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="secondcard">
            <el-table :data="dataList" border header-row-class-name="tableHead" style="margin-top: 10px;">
                <el-table-column label="日期" show-overflow-tooltip prop="orderDate" width="100" />
                <el-table-column label="工厂" show-overflow-tooltip prop="factory" />
                <el-table-column label="车间" show-overflow-tooltip prop="workShopName" />
                <el-table-column label="产线" show-overflow-tooltip prop="productLineName" width="100" />
                <el-table-column label="订单" show-overflow-tooltip prop="orderNo" width="120" />
                <el-table-column label="生产物料" show-overflow-tooltip prop="material">
                    <template slot-scope="scope">
                        {{ scope.row.materialCode }}{{ scope.row.materialName }}
                    </template>
                </el-table-column>
                <el-table-column label="生产数量" show-overflow-tooltip prop="realInAmount" width="90" />
                <el-table-column label="单位" show-overflow-tooltip prop="inUnit" width="50" />
                <el-table-column label="生产批次" show-overflow-tooltip prop="inBatch" width="110" />
                <el-table-column label="组件物料" show-overflow-tooltip prop="mainBatch" width="110">
                    <template slot-scope="scope">
                        {{ scope.row.useMaterialCode }}{{ scope.row.useMaterialName }}
                    </template>
                </el-table-column>
                <el-table-column label="组件物料数量" show-overflow-tooltip prop="useInAmount" width="90" />
                <el-table-column label="单位" show-overflow-tooltip prop="useUnit" width="50" />
                <el-table-column label="组件物料批次" show-overflow-tooltip prop="useBatch" width="110" />
            </el-table>
            <el-row>
                <el-pagination :current-page="formHeader.currPage" :page-sizes="[10, 20, 50]" :page-size="formHeader.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="formHeader.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </el-row>
        </el-card>
    </div>
</template>

<script>
import { BASICDATA_API, REP_API, AUDIT_API } from '@/api/api';
export default {
    name: 'TwoOneRetrospect',
    data() {
        return {
            queryFormData: [
                {
                    type: 'select',
                    label: '生产工厂',
                    prop: 'factory',
                    defaultOptionsFn: () => {
                        return this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST', {}, false, false, false);
                    },
                    resVal: {
                        resData: 'typeList',
                        label: ['deptName'],
                        value: 'deptId'
                    },
                    linkageProp: ['workShop', 'materialCodeLittle']
                },
                {
                    type: 'select',
                    label: '生产车间',
                    prop: 'workShop',
                    optionsFn: val => {
                        return this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {
                            deptId: val
                        });
                    },
                    resVal: {
                        resData: 'typeList',
                        label: ['deptName'],
                        value: 'deptId'
                    },
                    linkageProp: ['productLine']
                },
                {
                    type: 'select',
                    label: '生产产线',
                    prop: 'productLine',
                    resVal: {
                        resData: 'childList',
                        label: ['deptName'],
                        value: 'deptId'
                    },
                    optionsFn: val => {
                        return this.$http(`${BASICDATA_API.FINDORGBYPARENTID_API}`, 'POST', { parentId: val });
                    }
                },
                {
                    type: 'input',
                    label: '生产订单',
                    prop: 'orderNo'
                },
                {
                    type: 'input',
                    label: '生产批次',
                    prop: 'batch'
                },
                {
                    type: 'input',
                    label: '组件批次',
                    prop: 'batchLittle'
                },
                {
                    type: 'select',
                    label: '生产物料',
                    prop: 'materialCode',
                    resVal: {
                        resData: 'materielTraceSelectInfo',
                        label: ['MATERIAL_CODE', 'MATERIAL_NAME'],
                        value: 'MATERIAL_CODE'
                    },
                    defaultValue: '',
                    defaultOptionsFn: val => {
                        return this.$http(`${REP_API.CURRENT_MATERIALTRACEABILITY_LIAT}`, 'POST', {});
                    }
                },
                {
                    type: 'select',
                    label: '组件物料',
                    prop: 'materialCodeLittle',
                    optionsFn: val => {
                        return this.$http(`${AUDIT_API.AUDIT_ISSUE_MATERIAL_API}`, 'POST', {
                            factory: val
                        });
                    },
                    defaultValue: '',
                    resVal: {
                        resData: 'list',
                        label: ['materialCode', 'materialName'],
                        value: 'materialCode'
                    }
                },
                {
                    type: 'date-interval',
                    label: '生产日期',
                    prop: 'orderStartDate',
                    propTwo: 'orderEndDate'
                }
            ],
            listInterface: params => {
                return this.$http(`${REP_API.CURRENT_MATERIALTRACEABILITY_LIST}`, 'POST', params);
            },
            column: [
                {
                    prop: 'factoryName',
                    label: '工厂',
                    minwidth: '90'
                },
                {
                    prop: 'workShopName',
                    label: '车间',
                    minwidth: '95'
                },
                {
                    prop: 'houseNoName',
                    label: '曲房',
                    minwidth: '100'
                },
                {
                    prop: 'inPotNoName',
                    label: '发酵罐',
                    minwidth: '100'
                },
                {
                    prop: 'inKjmDate',
                    label: '制曲日期',
                    minwidth: '100'
                },
                {
                    prop: 'cookingException',
                    label: '煮豆异常',
                    minwidth: '120'
                },
                {
                    prop: 'continuousCookingException',
                    label: '连续蒸煮异常',
                    minwidth: '120'
                },
                {
                    prop: 'blendException',
                    label: '混合入曲异常',
                    minwidth: '120'
                },
                {
                    prop: 'guardException',
                    label: '看曲异常',
                    minwidth: '120'
                },
                {
                    prop: 'outException',
                    label: '出曲异常',
                    minwidth: '120'
                }
            ],
            formHeader: {
                factory: '',
                workShop: '',
                workShopName: '',
                productLine: '',
                orderNo: '',
                materialCode: '',
                orderStartDate: '',
                orderEndDate: '',
                currPage: 1,
                pageSize: 10,
                totalCount: 0
            },
            workShopStr: '',
            factory: [],
            workshop: [],
            productline: [],
            materiaList: [],
            dataList: [],
            materialList: []
        };
    },
    watch: {
        'formHeader.factory'(n) {
            this.Getdeptbyid(n);
            this.getMaterial(n);
        },
        workShopStr(n) {
            this.GetParentline(n.deptId);
        }
    },
    mounted() {
        this.Getdeptcode();
        this.GetMateriaList();
    },
    methods: {
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
            this.formHeader.workShop = '';
            this.workShopStr = '';
            this.formHeader.productLine = '';
            if (id) {
                this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', { deptId: id }, false, false, false).then(({ data }) => {
                    if (data.code === 0) {
                        this.workshop = data.typeList;
                        if (!this.workShopStr && data.typeList.length > 0) {
                            this.workShopStr = data.typeList[0];
                        }
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            }
        },
        // 获取产线
        GetParentline(id) {
            this.formHeader.productLine = '';
            if (id) {
                this.$http(`${BASICDATA_API.FINDORGBYPARENTID_API}`, 'POST', { parentId: id }, false, false, false).then(({ data }) => {
                    if (data.code === 0) {
                        this.productline = data.childList;
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            }
        },
        // 获取品相
        GetMateriaList() {
            this.$http(`${REP_API.CURRENT_MATERIALTRACEABILITY_LIAT}`, 'POST', {}, false, false, false).then(({ data }) => {
                if (data.code === 0) {
                    this.materiaList = data.materielTraceSelectInfo;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 组件物料
        getMaterial(factory) {
            this.$http(`${AUDIT_API.AUDIT_ISSUE_MATERIAL_API}`, 'POST', { factory: factory }, false, false, false).then(({ data }) => {
                if (data.code === 0) {
                    this.materialList = data.list;
                } else {
                    this.$warningToast(data.msg);
                }
            });
        },
        GetList(st) {
            if (this.workShopStr === '' || !this.workShopStr) {
                this.$warningToast('请选择车间');
                return false;
            }
                this.formHeader.workShop = this.workShopStr.deptId;
                this.formHeader.workShopName = this.workShopStr.deptName;

            if (st) {
                this.formHeader.currPage = 1;
            }
            this.$http(`${REP_API.CURRENT_MATERIALTRACEABILITY_LIST}`, 'POST', this.formHeader).then(({ data }) => {
                if (data.code === 0) {
                    this.dataList = data.materielTrace.list;
                    this.formHeader.currPage = data.materielTrace.currPage;
                    this.formHeader.pageSize = data.materielTrace.pageSize;
                    this.formHeader.totalCount = data.materielTrace.totalCount;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // ExportExcel () {
        //   let that = this
        //   exportFile(`${REP_API.REPTWOONERETROSPECT_API}`, '二合一批次追溯报表', that)
        // },
        // 改变每页条数
        handleSizeChange(val) {
            this.formHeader.pageSize = val;
            this.GetList();
        },
        // 跳转页数
        handleCurrentChange(val) {
            this.formHeader.currPage = val;
            this.GetList();
        }
    }
};
</script>
