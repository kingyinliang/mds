<!-- 包材库存管理-物料明细 -->
<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            query-auth=""
            :factory-type="1"
            :query-form-data="queryFormData"
            :list-interface="getDataList"
            :tabs="tabs"
            :operation-column-width="140"
            :show-index-column="true"
            :custom-data="true"
            @search-init="searchInit"
            @get-data-success="setData"
            @created-end="createdEnd"
        >
            <template slot="operation_column" slot-scope="{ scope }">
                <div>
                    <el-button type="text" icon="el-icon-search" size="small" @click="search(scope.row)">
                        查询
                    </el-button>
                    <el-button v-if="$refs.queryTable.activeName === '0'" type="text" icon="el-icon-edit" size="small" @click="edit(scope.row)">
                        调整
                    </el-button>
                </div>
            </template>
        </query-table>
        <stock-check-dialog ref="StockCheckDialog" title="移动明细" :move-detail="moveDetail" />
        <stock-edit-dialog ref="StockEditDialog" @refreshTableList="refreshTableList" />
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { COMMON_API, STOCK_API } from 'common/api/api';
import StockCheckDialog from '../common/StockCheckDialog.vue'
import StockEditDialog from '../common/StockEditDialog.vue'
import PKG_API from 'src/common/api/pkg';
@Component({
    name: 'MaterialDetail',
    components: {
        StockCheckDialog,
        StockEditDialog
    }
})
export default class MaterialDetail extends Vue {

    $refs: {
        queryTable: HTMLFormElement;
        StockCheckDialog: HTMLFormElement;
        StockEditDialog: HTMLFormElement;
    };

    moveDetail = {};

    mouldCodeList = [];

    supplierCodeList: Array<{}> = [];

    searchInit() {
        this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.currPage = 1
    }

    get queryFormData() {
        const stockInfo = this.$store.state.stock.stockInfo;
        return [
            {
                type: 'select',
                label: '物料描述',
                prop: 'materialCode',
                labelWidth: 90,
                filterable: true,
                defaultValue: this.materialCode || '',
                rule: [
                    { required: false, message: '请选择物料描述', trigger: 'change' }
                ],
                defaultOptionsFn: () => {
                    return COMMON_API.ALLMATERIAL_API({
                        materialGroupCode: stockInfo.materialGroupCode,
                        materialTypes: ['ZVER'] // 物料类型
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
                label: '批次',
                prop: 'batch',
                labelWidth: 90,
                defaultValue: ''
            },
            {
                type: 'select',
                label: '厂家',
                prop: 'supplierCode',
                labelWidth: 90,
                filterable: true,
                defaultValue: '',
                rule: [
                    { required: false, message: '请选择车间', trigger: 'change' }
                ],
                defaultOptionsList: this.supplierCodeList
            },
            {
                type: 'select',
                label: '模具号',
                prop: 'mouldCode',
                labelWidth: 90,
                filterable: true,
                defaultValue: '',
                rule: [
                    { required: false, message: '请选择车间', trigger: 'change' }
                ],
                defaultOptionsList: this.mouldCodeList
            }
        ]
    }

    column = [
        {
            label: '物料',
            prop: 'materialCode',
            width: 180,
            formatter: row => row.materialName + ' ' + row.materialCode
        },
        {
            label: '批次',
            prop: 'batch',
            width: 120
        },
        {
            label: '厂家',
            prop: 'supplierName',
            width: 180,
            formatter: row => row.supplierName + ' ' + row.supplierCode
        },
        {
            label: '模具号',
            prop: 'mouldCode'
        },
        {
            label: '入库日期',
            prop: 'inStorageDate',
            width: 120
        },
        {
            label: '生产日期',
            prop: 'produceDate',
            width: 120
        },
        {
            label: '单位',
            prop: 'materialUnitName'
        },
        {
            label: '入库数量',
            prop: 'storageAmount'
        },
        {
            label: '当前数量',
            prop: 'currentAmount'
        },
        {
            label: '不良率',
            prop: 'defectiveRate'
        }
    ];

    tabs = [
        {
            label: '当前库存信息',
            tableData: [],
            showOperationColumn: true,
            pages: {
                currPage: 1,
                pageSize: 10,
                totalCount: 0
            },
            column: this.column // eslint-disable-line
        },
        {
            label: '历史库存信息',
            tableData: [],
            showOperationColumn: true,
            pages: {
                currPage: 1,
                pageSize: 10,
                totalCount: 0
            },
            column: this.column // eslint-disable-line
        }
    ]

    materialCode = '';

    createdEnd() {
        this.$refs.queryTable.getDataList(true)
    }

    created() {
        this.getDropList()
        this.materialCode = this.$store.state.stock.stockInfo.materialCode;
        this.$nextTick(() => {
            this.$refs.queryTable.getDataList(true)
        })
    }

    getDropList() {
        PKG_API.STORAGE_PACKAGE_MATERIAL_GROUP_INFO({
            materialGroupCode: this.$store.state.stock.stockInfo.materialGroupCode
        }).then(res => {
            // this.supplierCodeList = res.data.data.supplierCodeList.map(item => {
            //     return {
            //         label: item,
            //         value: item
            //     }
            // })
            const map = res.data.data.supplierCodeNameMap;
            this.supplierCodeList = Object.keys(map).map(item => {
                return {
                    label: map[item] + ' ' + item,
                    value: item
                }
            })
            this.mouldCodeList = res.data.data.mouldCodeList.map(item => {
                return {
                    label: item,
                    value: item
                }
            })
        })
    }

    getDataList(param) {
        const params = JSON.parse(JSON.stringify(param));
        const stockInfo = this.$store.state.stock.stockInfo;
        params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
        params.materialGroupCode = stockInfo.materialGroupCode
        let getHistory = true;
        if (this.$refs.queryTable.activeName === '0') { // eslint-disable-line
            getHistory = false;
        }
        params.getHistory = getHistory; // eslint-disable-line
        params.current = this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.currPage;// eslint-disable-line
        params.size = this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.pageSize;// eslint-disable-line
        params.total = this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.totalCount;// eslint-disable-line
        return STOCK_API.STOCK_PACKAGE_STORAGE_PAGE_QUERY_API(params);
    }

    setData(datas, st) {
        console.log('查询结果回传')
        console.log(datas)
        if (st) {
            this.tabs.map((item, index) => {
                if (index !== Number(this.$refs.queryTable.activeName)) {
                    const params = JSON.parse(JSON.stringify(this.$refs.queryTable.queryForm));
                    params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
                    params.materialGroupCode = this.$store.state.stock.stockInfo.materialGroupCode
                    if (index === 0) {
                        params.getHistory = false;
                    } else {
                        params.getHistory = true;
                    }
                    params.current = this.$refs.queryTable.tabs[index].pages.currPage;
                    params.size = this.$refs.queryTable.tabs[index].pages.pageSize;
                    params.total = this.$refs.queryTable.tabs[index].pages.totalCount;
                    STOCK_API.STOCK_PACKAGE_STORAGE_PAGE_QUERY_API(params).then(({ data }) => {
                        this.tabs[index].tableData = data.data.records;
                        this.$refs.queryTable.tabs[index].pages.currPage = data.data.current;
                        this.$refs.queryTable.tabs[index].pages.pageSize = data.data.size;
                        this.$refs.queryTable.tabs[index].pages.totalCount = data.data.total;
                    });
                } else {
                    this.tabs[this.$refs.queryTable.activeName].tableData = datas.data.records;
                    this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.currPage = datas.data.current;
                    this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.pageSize = datas.data.size;
                    this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.totalCount = datas.data.total;
                }
            })
        } else {
            this.tabs[this.$refs.queryTable.activeName].tableData = datas.data.records;
            this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.currPage = datas.data.current;
            this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.pageSize = datas.data.size;
            this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.totalCount = datas.data.total;
        }
    }

    search(row) {
        console.log(row)
        // this.showSearch = true
        // this.moveDetail = row
        this.$refs.StockCheckDialog.init({ ...row })
    }

    edit(row) {
        this.$refs.StockEditDialog.init({ ...row })
    }

    refreshTableList() {
        this.$refs.queryTable.getDataList(true)
    }
}
</script>

<style lang="scss">
</style>
