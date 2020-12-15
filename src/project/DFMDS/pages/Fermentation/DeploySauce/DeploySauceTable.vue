<template>
    <div>
        <mds-card :title="'调酱列表'" :name="'list1'">
            <el-table header-row-class-name="tableHead" class="newTable" :data="table1">
                <el-table-column type="index" label="序号" width="50" fixed align="center" />
                <el-table-column label="状态" prop="materialUnitName" min-width="80" :show-overflow-tooltip="true" />
                <el-table-column label="车间" prop="materialUnitName" min-width="80" :show-overflow-tooltip="true" />
                <el-table-column label="容器号" prop="materialUnitName" min-width="80" :show-overflow-tooltip="true" />
                <el-table-column label="领用说明" prop="receiveMaterial" min-width="120" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.receiveMaterial" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" size="small" placeholder="请输入" />
                    </template>
                </el-table-column>
                <el-table-column label="订单类型" prop="receiveMaterial" min-width="120" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.classes" placeholder="请选择" size="small" :disabled="!isRedact">
                            <el-option v-for="item in classesOptions" :key="item.dictCode" :value="item.dictCode" :label="item.dictValue" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="物料" prop="receiveMaterial" min-width="120" :show-overflow-tooltip="true" />
                <el-table-column label="发酵天数/天" prop="receiveMaterial" min-width="120" :show-overflow-tooltip="true" />
                <el-table-column label="熟酱状态" prop="receiveMaterial" min-width="120" :show-overflow-tooltip="true" />
                <el-table-column label="领用数量" prop="receiveMaterial" min-width="120" :show-overflow-tooltip="true" />
                <el-table-column label="库存数量（KG）" prop="receiveMaterial" min-width="140" :show-overflow-tooltip="true" />
                <el-table-column label="单位" prop="receiveMaterial" min-width="50" :show-overflow-tooltip="true" />
                <el-table-column label="入库日期" prop="receiveMaterial" min-width="100" :show-overflow-tooltip="true" />
                <el-table-column label="批次" prop="receiveMaterial" min-width="100" :show-overflow-tooltip="true" />
                <el-table-column label="实验备注" prop="receiveMaterial" min-width="120" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.receiveMaterial" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" size="small" placeholder="请输入" />
                    </template>
                </el-table-column>
                <el-table-column label="备注" prop="receiveMaterial" min-width="80" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.receiveMaterial" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" size="small" placeholder="请输入" />
                    </template>
                </el-table-column>
            </el-table>
        </mds-card>
        <mds-card :title="'鲜香泡豆'" :name="'list2'">
            <el-table header-row-class-name="tableHead" class="newTable" :data="table2">
                <el-table-column type="index" label="序号" width="50" fixed align="center" />
                <el-table-column label="容器号" prop="receiveMaterial" min-width="120" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.classes" placeholder="请选择" size="small" :disabled="!isRedact">
                            <el-option v-for="item in classesOptions" :key="item.dictCode" :value="item.dictCode" :label="item.dictValue" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="添加物料" prop="receiveMaterial" min-width="120" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.classes" placeholder="请选择" size="small" :disabled="!isRedact">
                            <el-option v-for="item in classesOptions" :key="item.dictCode" :value="item.dictCode" :label="item.dictValue" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="单位" prop="receiveMaterial" min-width="50" :show-overflow-tooltip="true" />
                <el-table-column label="库存数量" prop="receiveMaterial" min-width="100" :show-overflow-tooltip="true" />
                <el-table-column label="批次" prop="receiveMaterial" min-width="100" :show-overflow-tooltip="true" />
                <el-table-column label="计划添加数量" prop="receiveMaterial" min-width="120" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.receiveMaterial" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" size="small" placeholder="请输入" />
                    </template>
                </el-table-column>
                <el-table-column label="备注" prop="receiveMaterial" min-width="80" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.receiveMaterial" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" size="small" placeholder="请输入" />
                    </template>
                </el-table-column>
                <el-table-column label="领用数量" prop="receiveMaterial" min-width="100" :show-overflow-tooltip="true" />
                <el-table-column label="操作" fixed="right" width="70">
                    <template slot-scope="scope">
                        <el-button :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" class="delBtn" type="text" icon="el-icon-delete" size="mini" @click="del(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </mds-card>
        <mds-card :title="'调配物料'" :name="'list3'">
            <el-table header-row-class-name="tableHead" class="newTable" :data="table3">
                <el-table-column type="index" label="序号" width="50" fixed align="center" />
                <el-table-column label="添加物料" prop="receiveMaterial" min-width="120" :show-overflow-tooltip="true" />
                <el-table-column label="计划添加数量" prop="receiveMaterial" min-width="120" :show-overflow-tooltip="true" />
                <el-table-column label="单位" prop="receiveMaterial" min-width="50" :show-overflow-tooltip="true" />
                <el-table-column label="开罐备注" prop="receiveMaterial" min-width="120" :show-overflow-tooltip="true" />
                <el-table-column width="70">
                    <template slot-scope="scope">
                        <el-button type="text" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P') || scope.row.materialStatus === '3'" @click="SplitDate(scope.row, scope.$index)">
                            <em class="icons iconfont factory-chaifen" />拆分
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="批次" prop="receiveMaterial" min-width="120" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.receiveMaterial" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" size="small" placeholder="请输入" />
                    </template>
                </el-table-column>
                <el-table-column label="领用数量" prop="receiveMaterial" min-width="120" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.receiveMaterial" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" size="small" placeholder="请输入" />
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="70">
                    <template slot-scope="scope">
                        <el-button :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" class="delBtn" type="text" icon="el-icon-delete" size="mini" @click="del(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </mds-card>
        <mds-card :title="'超期酱'" :name="'list4'">
            <el-table header-row-class-name="tableHead" class="newTable" :data="table4">
                <el-table-column type="index" label="序号" width="50" fixed align="center" />
                <el-table-column label="容器号" prop="receiveMaterial" min-width="120" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.classes" placeholder="请选择" size="small" :disabled="!isRedact">
                            <el-option v-for="item in classesOptions" :key="item.dictCode" :value="item.dictCode" :label="item.dictValue" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="添加物料" prop="receiveMaterial" min-width="120" :show-overflow-tooltip="true" />
                <el-table-column label="单位" prop="receiveMaterial" min-width="50" :show-overflow-tooltip="true" />
                <el-table-column label="库存数量" prop="receiveMaterial" min-width="100" :show-overflow-tooltip="true" />
                <el-table-column label="批次" prop="receiveMaterial" min-width="100" :show-overflow-tooltip="true" />
                <el-table-column label="计划添加数量" prop="receiveMaterial" min-width="120" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.receiveMaterial" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" size="small" placeholder="请输入" />
                    </template>
                </el-table-column>
                <el-table-column label="领用数量" prop="receiveMaterial" min-width="120" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.receiveMaterial" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" size="small" placeholder="请输入" />
                    </template>
                </el-table-column>
                <el-table-column label="备注" prop="receiveMaterial" min-width="80" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.receiveMaterial" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" size="small" placeholder="请输入" />
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="70">
                    <template slot-scope="scope">
                        <el-button :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" class="delBtn" type="text" icon="el-icon-delete" size="mini" @click="del(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </mds-card>
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
    import { FER_API } from 'common/api/api';

    @Component
    export default class DeploySauceTable extends Vue {
        @Prop({ default: false }) isRedact: boolean;

        table1 = []
        table2 = []
        table3 = []
        table4 = []

        mounted() {
        //
        }

        init(formHeader) {
            this.getList('PICKLED', formHeader)
            this.getList('RECEIVE', formHeader)
            this.getList('SAUCE', formHeader)
        }

        getList(str, formHeader) {
            FER_API.FER_DEPLOY_SAUCE_DETAIL_LIST_API({
                mixMaterialType: str,
                openPotNo: formHeader.openPotNo
            }).then(({ data }) => {
                if (str === 'PICKLED') {
                    this.table2 = data.data
                } else if (str === 'RECEIVE') {
                    this.table3 = data.data
                } else if (str === 'SAUCE') {
                    this.table4 = data.data
                }
            })
        }

    }
</script>

<style scoped>

</style>
