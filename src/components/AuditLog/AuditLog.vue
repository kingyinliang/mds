<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2020-08-19 09:16:48
 * @LastEditors: Telliex
 * @LastEditTime: 2020-10-29 19:36:50
-->
<template>
    <mds-card :title="showTitle?'审核日志':''" :name="name" :icon-bg="'#f05c4a'" :pack-up="packUp">
        <el-table class="newTable" :data="tableData" header-row-class-name="tableHead" border style="width: 100%;" :max-height="height">
            <el-table-column label="序号" type="index" width="60" fixed />
            <el-table-column prop="status" label="审核动作" width="100" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    {{ status? scope.row.status : (scope.row.status === 'noPass' ? '不通过' : scope.row.status === 'checked' ? '通过' : scope.row.status === 'submit' ? '反审' : '') }}
                </template>
            </el-table-column>
            <el-table-column prop="memo" label="审核意见" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    {{ scope.row[memo] }}
                </template>
            </el-table-column>
            <el-table-column prop="verify_man" label="审核人" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    {{ scope.row[verifyMan] }}
                </template>
            </el-table-column>
            <el-table-column prop="verify_date" label="审核时间" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    {{ scope.row[verifyDate] }}
                </template>
            </el-table-column>
        </el-table>
    </mds-card>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
    import MdsCard from '../MdsCard/MdsCard.vue';

    @Component({
        components: {
            MdsCard
        }
    })
    export default class AuditLog extends Vue {
        @Prop({ default: [] }) tableData: AuditData[];
        @Prop({ default: true }) showTitle: boolean;
        @Prop({ default: true }) packUp: boolean;
        @Prop({ default: false }) status: boolean;
        @Prop({ default: 'audit' }) name: string;
        @Prop({ default: 'memo' }) memo: string;
        @Prop({ default: 'verify_man' }) verifyMan: string;
        @Prop({ default: 'verify_date' }) verifyDate: string;
        @Prop({ default: null }) height: number | null;

    }
    interface AuditData {
        status?: string;
        memo?: string;
        verify_man?: string;
        verify_date?: string;
    }
</script>

<style scoped>

</style>
