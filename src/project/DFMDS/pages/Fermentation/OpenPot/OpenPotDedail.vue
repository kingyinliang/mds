<template>
    <div class="header_main">
        <data-entry
            ref="dataEntry"
            :order-status-show="false"
            :head-show="false"
        >
            <template slot="headerCard">
                <mds-card title="申请基本信息" :name="'head'">
                    <el-form :inline="true" :model="formHeader" size="small" class="dataEntry-head-base__form" label-width="100px">
                        <el-row>
                            <em style="padding-left: 40px;" />
                            <el-form-item>
                                <el-radio v-model="formHeader.consumeType" label="1">
                                    本罐单调
                                </el-radio>
                                <el-radio v-model="formHeader.consumeType" label="0">
                                    换罐混调
                                </el-radio>
                            </el-form-item>
                        </el-row>
                        <el-form-item label="生产车间：">
                            {{ formHeader.consumeType }}
                        </el-form-item>
                        <el-form-item label="申请物料：">
                            {{ formHeader.fermentPotNo }}
                        </el-form-item>
                    </el-form>
                </mds-card>
            </template>
        </data-entry>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';

    @Component
    export default class OpenPotDedail extends Vue {

    }
</script>

<style scoped>

</style>
