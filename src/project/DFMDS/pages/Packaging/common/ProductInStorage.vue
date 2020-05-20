<template>
    <div>
        <mds-card :title="'生产入库'" :name="'productInStore'">
            <template slot="titleBtn">
                <div style="float: right;">
                    <el-button type="primary" size="small" @click="addNewDataRow(DataList)">
                        新增
                    </el-button>
                </div>
            </template>
            <el-table header-row-class-name="tableHead" class="newTable" :data="currentDataTable" border tooltip-effect="dark">
                <el-table-column type="index" label="序号" width="50px" />
                <el-table-column label="生产日期" prop="productDate" width="100" />
                <el-table-column label="班次" prop="classes" width="80" />
                <el-table-column label="生产班次" prop="batch" width="100" />
                <el-table-column label="生产入库" prop="inStorageCount" width="100" />
                <el-table-column label="单位" prop="inStorageUnit" width="80" />
                <el-table-column label="入库不良" prop="inStorageBadCount" width="100" />
                <el-table-column label="单位" prop="inStorageBadUnit" width="100" />
                <el-table-column label="线上不良" prop="onlineBadCount" width="80" />
                <el-table-column label="单位" prop="onlineBadUnit" width="80" />
                <el-table-column label="样品" prop="sampleCount" width="80" />
                <el-table-column label="单位" prop="sampleUnit" width="80" />
                <el-table-column label="产出数" prop="output" width="80" />
                <el-table-column label="单位" prop="outputUnit" width="80" />
                <el-table-column label="备注" prop="remark" width="80" />
                <el-table-column label="操作人" prop="changer" width="80" />
                <el-table-column label="操作时间" prop="changed" width="80" />
                <el-table-column width="70">
                    <el-table-column label="操作" fixed="right" width="70">
                        <template slot-scope="scope">
                            <el-button v-if="!scope.row.original" class="delBtn" type="text" icon="el-icon-delete" size="mini" @click="removeDataRow(scope.$index,scope.row)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table-column>
            </el-table>
        </mds-card>
        <el-row class="solerow">
            <div>
                产出数合计：
            </div>
            <div class="input_bottom">
                123
            </div>
        </el-row>
        <audit-log :table-data="readAudit" />
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { PKG_API } from 'common/api/api';

    @Component({
        name: 'ProductInStore',
        components: {
        }
    })
    export default class ProductInStore extends Vue {


        currentDataTable = [];
        readAudit= [];
        instorageDelete= []; // 入库删除集合
        instorageInsert= []; // 入库新增集合
        instorageUpdate=[]; // 入库修改集合

        mounted() {
            PKG_API.PKG_INSTORAGE_QUERY_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                orderNo: '831000003240'
            }).then(({ data }) => {
                console.log(data)
                this.currentDataTable = data.inStorages
            })


        }

        removeDataRow() {
            // this.currentDataTable.splice(index, 1)
            // this.deleteList.push(row.id)
        }

        addNewDataRow() {
            //
        }
    }
</script>

<style scoped>

</style>
