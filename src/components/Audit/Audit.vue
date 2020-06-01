<template>
    <div>
        <el-card class="searchCard" style="margin-bottom: 5px;">
            <el-form :model="queryForm">
                <template v-for="item in queryFormData">
                    <el-form-item v-if="item.type === 'select'" :key="item.prop" :label="`${item.label}：` || ''" :prop="item.prop">
                        <el-select :ref="item.prop" v-model="queryForm[item.prop]" style="width: 170px;" :filterable="item.filterable" :clearable="item.clearable" :disabled="item.disabled" :placeholder="'请选择' + item.label">
                            <el-option label="请选择" value="" />
                            <el-option v-for="(opt, optIndex) in optionLists[item.prop]" :key="optIndex" :label="setLabel(opt, item)" :value="opt[item.resVal.value]" />
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="item.type === 'input'" :key="item.prop" :label="`${item.label}：` || ''" :prop="item.prop">
                        <el-input :ref="item.prop" v-model="queryForm[item.prop]" style="width: 170px;" />
                    </el-form-item>
                    <el-form-item v-if="item.type === 'date-interval'" :key="item.prop" class="dateinput" :label="`${item.label}：` || ''" :prop="item.prop">
                        <el-row>
                            <el-col :span="12">
                                <el-date-picker :ref="item.prop" v-model="queryForm[item.prop]" :type="item.dataType ? item.dataType : 'date'" placeholder="选择日期" :value-format="item.valueFormat ? item.valueFormat : 'yyyy-MM-dd'" style="width: 135px;" />
                                <span>-</span>
                            </el-col>
                            <el-col :span="12">
                                <el-date-picker :ref="item.propTwo" v-model="queryForm[item.propTwo]" :type="item.dataType ? item.dataType : 'date'" placeholder="选择日期" :value-format="item.valueFormat ? item.valueFormat : 'yyyy-MM-dd'" style="width: 135px;" />
                            </el-col>
                        </el-row>
                    </el-form-item>
                </template>
                <el-form-item class="floatr">
                    <el-button type="primary" size="small" @click="getDataList(true)">
                        查询
                    </el-button>
                    <slot name="mds-button" />
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';

    @Component({
        components: {
        }
    })
    export default class Audit extends Vue {

    }
</script>

<style scoped>

</style>
