<!-- 报表模板 -->
<template>
    <div class="report header_main">
        <el-card v-if="showForm" class="searchCard" style="margin-bottom: 5px;">
            <el-form ref="elForm" :model="formHeader" inline :rules="formRules" size="small" label-width="120px" label-suffix="：">
                <el-form-item v-for="item in queryFormData" :key="item.label" :label="item.label" :prop="item.prop">
                    <el-select v-if="item.type === 'select'" v-model="formHeader[item.prop]">
                        <el-option v-for="(op, index) in item.options" :key="index" :label="op[item.propName]" :value="op[item.propValue]" />
                    </el-select>
                    <el-radio-group v-if="item.type === 'radio'" v-model="formHeader[item.prop]">
                        <el-radio v-for="(ra, index) in item.options" :key="index" :label="ra.value">
                            {{ ra.label }}
                        </el-radio>
                    </el-radio-group>
                    <el-date-picker v-if="item.type === 'year'" v-model="formHeader[item.prop]" type="year" value-format="yyyy" placeholder="请选择" />
                </el-form-item>
                <el-form-item class="floatr">
                    <el-button type="primary" @click="searchHandler()">
                        查询
                    </el-button>
                    <el-button @click="exportHandler()">
                        导出
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-table class="newTable" header-row-class-name="tableHead" :data="tableData" border tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;">
            <el-table-column v-for="(item, index) in tableColumns" :key="index" :label="item.label" :prop="item.prop">
                <el-table-column v-for="(col, index2) in item.columns || []" :key="'sub' + index2" :label="col.label" :prop="col.prop" />
            </el-table-column>
        </el-table>
        <slot />
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class Report extends Vue {

    @Prop({ type: Boolean, default: false })
    showForm: false;

    @Prop({ type: Object, default: () => ({}) })
    formHeader: {};

    @Prop({ type: Array, default: () => [] })
    queryFormData: [];

    @Prop({ type: Object, default: () => ({}) })
    rules: {};

    @Prop({ type: Array, default: () => [] })
    tableData: [];

    @Prop({ type: Array, default: () => [] })
    columns: [];

    get formRules() {
        return this.rules;
    }

    get tableColumns() {
        return this.columns;
    }

    searchHandler() {
        if (Object.keys(this.formRules).length) {
            for (const key in this.formRules) {
                if (Object.prototype.hasOwnProperty.call(this.formRules, key)) {
                    const element = this.formRules[key];
                    if (element[0].required && !this.formHeader[key]) {
                        this.$warningToast(element[0].message);
                        return false;
                    }
                }
            }
        }
        this.$emit('searchHandler');
        console.log(this.formHeader);
    }

    exportHandler() {
        console.log(this.formHeader);
    }
}
</script>

<style lang="scss" scoped>
.report {
    padding: 10px;
    .searchCard {
        padding: 5px;
    }
    .hover-row {
        td:first-child {
            border-left: 2px solid #e8e8e8;
        }
    }
}
</style>

<style scoped>
.searchCard >>> .el-form-item.is-error .el-input__inner,
.searchCard >>> .el-form-item.is-success .el-input__inner,
.searchCard >>> .el-form-item.is-error .el-input__inner:focus,
.searchCard >>> .el-form-item.is-success .el-input__inner:focus {
    border-color: #dcdfe6;
}
.searchCard >>> .el-form-item__error {
    display: none;
}
.report >>> .el-card__body {
    padding: 7px;
}
.report >>> .el-form-item {
    margin-bottom: 7px;
}

/* .report >>> .newTable .el-table__header th {
    color: white;
    text-align: center;
    background: #487bff;
    background-color: #487bff !important;
    border-top: none;
    border-right: none;
    border-bottom: none;
    border-left: none;
} */
</style>
