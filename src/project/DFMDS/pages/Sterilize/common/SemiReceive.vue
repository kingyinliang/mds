<template>
    <div>
        <mds-card title="领用列表">
            <el-table header-row-class-name="tableHead" class="newTable" :data="semiTable" border tooltip-effect="dark">
                <el-table-column type="index" label="序号" width="50px" fixed />
                <el-table-column prop="aiShelves" label="生产锅号" :show-overflow-tooltip="true" />
                <el-table-column prop="aiShelves" label="发酵罐领用" :show-overflow-tooltip="true" />
                <el-table-column prop="aiShelves" label="发酵罐号" :show-overflow-tooltip="true" />
                <el-table-column prop="aiShelves" label="领用物料" :show-overflow-tooltip="true" />
                <el-table-column prop="aiShelves" label="单位" :show-overflow-tooltip="true" />
                <el-table-column prop="aiShelves" label="领用数量" :show-overflow-tooltip="true" />
                <el-table-column prop="aiShelves" label="领用批次" :show-overflow-tooltip="true" />
                <el-table-column prop="aiShelves" label="发酵罐库存" :show-overflow-tooltip="true" />
                <el-table-column width="70" fixed="right">
                    <template slot-scope="scope">
                        <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!isRedact" @click="removeDataRow(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </mds-card>
        <audit-log :table-data="semiAudit" :verify-man="'verifyMan'" :verify-date="'verifyDate'" :status="true" />
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';

    @Component
    export default class SemiReceive extends Vue {
        @Prop({ default: false }) isRedact: boolean;

        semiAudit = [];
        semiTable = [];

        addDataRow() {
            console.log(1);
        }
    }
</script>

<style scoped>

</style>
