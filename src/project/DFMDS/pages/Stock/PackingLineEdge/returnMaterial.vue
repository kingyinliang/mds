<!-- 退料 -->
<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            query-auth=""
            type="home"
            :query-form-data="queryFormData"
            :list-interface="listInterface"
            :custom-data="true"
            @get-data-success="setData"
            @created-end="createdEnd"
            @search-init="searchInit"
        >
            <template slot="mds-button">
                <el-button type="primary" size="small" @click="add">
                    新增
                </el-button>
            </template>
            <template slot="home">
                <mds-card title="退料明细" :pack-up="false">
                    <template slot="titleBtn">
                        <el-button type="primary" size="small" style="float: right;" @click="submit">
                            提交
                        </el-button>
                    </template>
                    <el-table :data="tableData" class="newTable" header-row-class-name="tableHead" height="450px" border @selection-change="selectHandler">
                        <el-table-column type="index" fixed="left" />
                        <el-table-column type="selection" fixed="left" :selectable="selectableHandler" />
                        <el-table-column label="状态" prop="statusName" show-overflow-tooltip />
                        <el-table-column label="包材物料" prop="materialCode" width="140px" show-overflow-tooltip>
                            <template slot-scope="scope">
                                {{ scope.row.materialName + ' ' + scope.row.materialCode }}
                            </template>
                        </el-table-column>
                        <el-table-column label="批次" prop="batch" show-overflow-tooltip />
                        <el-table-column label="供应商" prop="manufactor" width="120px" show-overflow-tooltip>
                            <template slot-scope="scope">
                                {{ `${scope.row.manufactorName || ''} ${scope.row.manufactor}` }}
                            </template>
                        </el-table-column>
                        <el-table-column label="模具号" prop="mouldCode" show-overflow-tooltip />
                        <el-table-column label="移动类型" prop="moveType" width="100px" show-overflow-tooltip />
                        <el-table-column label="数量" prop="moveAmount" show-overflow-tooltip />
                        <el-table-column label="单位" prop="moveUnit" show-overflow-tooltip />
                        <el-table-column label="订单" prop="orderNo" width="120px" show-overflow-tooltip />
                        <el-table-column label="线别" prop="productLineName" width="170px" show-overflow-tooltip>
                            <template slot-scope="scope">
                                {{ `${scope.row.productLineName || ''} ${scope.row.productLine}` }}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作人" prop="changer" width="140px" show-overflow-tooltip />
                        <el-table-column label="操作时间" prop="changed" width="160px" show-overflow-tooltip />
                        <el-table-column label="操作" fixed="right">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" :disabled="notEditArr.includes(scope.row.status)" @click="edit(scope.row)">
                                    编辑
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-row v-if="tableData.length !== 0">
                        <el-pagination :current-page="current" :page-sizes="[10, 20, 50]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" style="margin-bottom: 15px;" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                    </el-row>
                </mds-card>
            </template>
        </query-table>
        <my-dialog ref="dialog" :form-columns="formColumns" :rules="rules" title="新增/编辑" :submit-handler="addOrUpdate" @success="successHandler" />
        <!-- <my-dialog ref="dialog2" :form-columns="formColumns2" :rules="rules2" title="调整" /> -->
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { COMMON_API, PKG_API } from 'common/api/api';
import MyDialog from '../components/dialog.vue'
import { dateFormat, getUserNameNumber } from 'src/utils/utils';
@Component({
    name: 'PackingLineEdge',
    components: {
        MyDialog
    }
})
export default class PackingLineEdge extends Vue {

    $refs: {
        queryTable: HTMLFormElement;
        dialog: HTMLFormElement;
    };

    tableData = [];
    current = 1;
    size = 10;
    total = 0;

    selections = [];
    moveTypeList = [];
    isAdd = true;
    notEditArr = ['M', 'P']; // 已提交、已过账
    currentRow = {}; // 当前操作行

    get formColumns() {
        return [
            {
                type: 'input',
                label: '包材物料',
                prop: 'materialCode',
                disabled: true,
                formatter: row => `${row.materialName || ''} ${row.materialCode || ''}`
            },
            {
                type: 'input',
                label: '批次',
                prop: 'batch',
                disabled: true
            },
            {
                type: 'input',
                label: '模具号',
                prop: 'mouldCode',
                disabled: true
            },
            {
                type: 'input',
                label: '供应商',
                prop: 'manufactor',
                disabled: true
            },
            {
                type: 'input',
                label: '库存',
                prop: 'storageAmount',
                disabled: true
            },
            {
                type: 'select',
                label: '调整类型',
                prop: 'moveTypeCode',
                disabled: Boolean(this.currentRow['orderNo']),
                defaultOptions: [
                    ...this.moveTypeList
                    // { value: 'INVENTORY_PROFIT', label: '盘盈' },
                    // { value: 'INVENTORY_LOSSES', label: '盘亏' }
                ]
            },
            {
                type: 'number',
                label: '调整量',
                prop: 'moveAmount'
            },
            {
                type: 'input',
                label: '单位',
                prop: 'moveUnitName',
                disabled: true
            },
            {
                type: 'input',
                label: '说明',
                prop: 'remark'
            },
            {
                type: 'input',
                label: '操作人',
                prop: 'changer',
                disabled: true
            },
            {
                type: 'input',
                label: '操作时间',
                prop: 'changed',
                disabled: true
            }
        ]
    }

    rules = {
        moveTypeCode: [
            { required: true, message: '请选择调整类型', triggle: 'change' }
        ],
        moveAmount: [
            { required: true, message: '请输入调整数量', triggle: 'blur' }
        ]
    }

    // 查询表头
    queryFormData = [
        {
            type: 'select',
            label: '包材物料',
            prop: 'material',
            defaultValue: this.$store.state.packaging.packageInfo.materialCode, // eslint-disable-line
            filterable: true,
            disabled: true,
            defaultOptionsFn: () => {
                return COMMON_API.SEARCH_MATERIAL_API({
                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                    materialType: 'ZVER'
                })
            },
            resVal: {
                resData: 'data',
                label: ['materialName', 'materialCode'],
                value: 'materialCode'
            }
        },
        {
            type: 'select',
            label: '批次',
            prop: 'batch',
            defaultValue: this.$store.state.packaging.packageInfo.batch, // eslint-disable-line
            filterable: true,
            disabled: true,
            defaultOptionsFn: () => {
                return COMMON_API.SEARCH_MATERIAL_API({
                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                    materialType: 'ZHAL'
                })
            },
            resVal: {
                resData: 'data',
                label: ['materialName', 'materialCode'],
                value: 'materialCode'
            }
        },
        {
            type: 'input',
            label: '生产订单',
            prop: 'orderNo',
            defaultValue: ''
        }
    ];

    mounted() {
        this.getMoveType()
        this.$refs.queryTable.getDataList(true)
    }

    searchInit() {
        this.current = 1
    }

    selectableHandler(row) {
        return !this.notEditArr.includes(row.status)
    }

    // 调整类型
    getMoveType() {
        COMMON_API.DICTQUERY_API({ dictType: 'COMMON_ADJUST_TYPE' }).then(({ data }) => {
            this.moveTypeList = data.data.filter(item => ['不良退料', '正常退料'].includes(item.dictValue)).map(item => ({ label: item.dictValue, value: item.dictCode }))
        });
    }

    selectHandler(selection, row) {
        console.log(selection, row)
        this.selections = selection
    }

    listInterface(params) {
        const packageInfo = this.$store.state.packaging.packageInfo
        return PKG_API.PKG_MATERIALSTOCK_STORAGEITEM_API({
            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
            orderNo: params.orderNo,
            pkgPackageStorageId: params.orderNo ? null : packageInfo['id'],
            batch: params.orderNo ? null : packageInfo['batch'],
            current: this.current,
            size: this.size,
            queryReturn: true // 退料查询
        })
    }

    setData(data) {
        this.tableData = data.data.records
        this.total = data.data.total
    }

    createdEnd() {
        console.log('createdEnd')
    }

    add() {
        const packageInfo = this.$store.state.packaging.packageInfo
        this.isAdd = true
        this.$refs.dialog.init({
            ...packageInfo,
            moveUnitName: packageInfo.storageUnit,
            moveUnit: packageInfo.storageUnitCode,
            changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
            changer: getUserNameNumber()
        })
    }

    edit(row) {
        this.currentRow = row;
        this.isAdd = false
        this.$refs.dialog.init({ ...row, moveAmount: String(row.moveAmount), moveUnitName: row.moveUnit })
    }

    submit() {
        if (!this.selections.length) {
            this.$warningToast('请选择明细')
            return
        }
        this.$confirm('确定提交吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            PKG_API.PKG_RETURN_SUBMIT_API(this.selections.map((item: { id: string }) => item.id)).then(res => {
                this.$successToast(res.data.msg)
                this.$refs.queryTable.getDataList(true)
            })
        })
    }

    addOrUpdate(params) {
        if (params.moveAmount <= 0 || String(params.moveAmount).includes('.')) {
            this.$warningToast('调整量输入信息为正整数')
            return Promise.reject<Error>(new Error('调整量输入信息为正整数'));
        }
        const type = this.isAdd ? 'PKG_RETURN_SAVE_API' : 'PKG_RETURN_UPDATE_API'
        return PKG_API[type]({
            moveAmount: params.moveAmount,
            moveType: params.moveTypeCode,
            moveUnit: params.moveUnit,
            pkgPackageStorageId: this.isAdd ? this.$store.state.packaging.packageInfo.id : null,
            pkgPackageStorageItemId: this.isAdd ? null : params.id,
            remark: params.remark
        })
    }

    successHandler() {
        this.$refs.queryTable.getDataList(true)
    }

    // 改变每页条数
    handleSizeChange(val: number) {
        this.size = val;
        this.$refs.queryTable.getDataList();
    }

    handleCurrentChange(val: number) {
        this.current = val;
        this.$refs.queryTable.getDataList();
    }

}
</script>

<style lang="scss">
</style>
