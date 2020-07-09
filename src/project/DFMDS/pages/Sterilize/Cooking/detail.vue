<template>
    <div class="header_main">
        <el-card class="searchCard" style="margin-bottom: 5px;">
            <el-form :model="formHeader" :rules="queryFormRules" :inline="true" size="small" label-width="100px" class="multi_row clearfix" style="font-size: 0;">
                <el-form-item label="生产车间：">
                    <el-select v-model="formHeader.factory" style="width: 175px;" placeholder="请选择">
                        <el-option v-for="(item, optIndex) in factory" :key="optIndex" :label="item.deptName" :value="item.deptCode" />
                    </el-select>
                </el-form-item>
                <el-form-item label="煮料锅：">
                    <el-select v-model="formHeader.holder" style="width: 175px;" placeholder="请选择">
                        <el-option v-for="(item, optIndex) in holderList" :key="optIndex" :label="item.holderName" :value="item.holderNo" />
                    </el-select>
                </el-form-item>
                <el-form-item label="生产物料：">
                    <el-select v-model="formHeader.holder" style="width: 175px;" placeholder="请选择">
                        <el-option v-for="(item, optIndex) in holderList" :key="optIndex" :label="item.deptName" :value="item.deptCode" />
                    </el-select>
                </el-form-item>
                <el-form-item label="配置开始时间：">
                    <el-date-picker v-model="formHeader.date" type="datetime" placeholder="请选择" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" style="width: 175px;" />
                </el-form-item>
                <el-form-item label="配置结束时间：">
                    <el-date-picker v-model="formHeader.date" type="datetime" placeholder="请选择" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" style="width: 175px;" />
                </el-form-item>
                <el-form-item label="配置锅数：">
                    <el-input v-model="formHeader.remark" placeholder="手工录入" style="width: 175px;" />
                </el-form-item>
                <el-form-item label="使用日期：">
                    <el-date-picker v-model="formHeader.date" type="date" placeholder="请选择" value-format="yyyy-MM-dd" format="yyyy-MM-dd" style="width: 175px;" />
                </el-form-item>
                <el-form-item label="煮料锅序：">
                    <el-select v-model="formHeader.holder" style="width: 175px;" placeholder="请选择">
                        <el-option v-for="(item, optIndex) in holderList" :key="optIndex" :label="item.deptName" :value="item.deptCode" />
                    </el-select>
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input v-model="formHeader.remark" placeholder="手工录入" style="width: 175px;" />
                </el-form-item>
                <el-form-item label="煮料单号：">
                    {{}}
                </el-form-item>
                <el-form-item label="状态：">
                    {{}}
                </el-form-item>
                <el-form-item label="操作人：">
                    {{}}
                </el-form-item>
                <el-form-item label="操作时间：">
                    {{}}
                </el-form-item>
            </el-form>
        </el-card>
        <mds-card title="溶解罐领用" name="dissolvingTank">
            <template slot="titleBtn">
                <div style="float: right;">
                    <el-button type="primary" size="small" @click="insertItem()">
                        新增
                    </el-button>
                </div>
            </template>
            <el-table ref="table" class="newTable" :data="dataList" border tooltip-effect="dark" header-row-class-name="tableHead" style="width: 100%; margin-bottom: 20px;">
                <el-table-column type="index" label="序号" fixed="left" width="55" />
                <el-table-column label="溶解罐号" min-width="55" prop="holder" />
                <el-table-column label="溶解罐生产物料" min-width="55" prop="holder" />
                <el-table-column label="投料时间" min-width="55" prop="holder" />
                <el-table-column label="单位" min-width="55" prop="holder" />
                <el-table-column label="领用数量" min-width="55" prop="holder" />
                <el-table-column label="溶解罐库存" min-width="55" prop="holder" />
                <el-table-column label="备注" min-width="55" prop="holder" />
                <el-table-column label="操作人" min-width="55" prop="holder" />
                <el-table-column label="操作时间" min-width="55" prop="holder" />
                <el-table-column label="操作" min-width="55" prop="holder" />
            </el-table>
        </mds-card>
        <mds-card title="辅料领用" name="ingredients">
            <el-table ref="table" class="newTable" :data="dataList" border tooltip-effect="dark" header-row-class-name="tableHead" style="width: 100%; margin-bottom: 20px;">
                <el-table-column type="index" label="序号" fixed="left" width="55" />
                <el-table-column label="领用物料" min-width="55" prop="holder" />
                <el-table-column label="单位" min-width="55" prop="holder" />
                <el-table-column label="" min-width="55" prop="holder" />
                <el-table-column label="领用数量" min-width="55" prop="holder" />
                <el-table-column label="领用批次" min-width="55" prop="holder" />
                <el-table-column label="备注" min-width="55" prop="holder" />
                <el-table-column label="操作人" min-width="55" prop="holder" />
                <el-table-column label="操作时间" min-width="55" prop="holder" />
                <el-table-column label="操作" min-width="55" prop="holder" />
            </el-table>
        </mds-card>
        <audit-log :table-data="auditLogData" :verify-man="'verifyMan'" :verify-date="'verifyDate'" :pack-up="false" :status="true" />
        <redact-box>
            <template slot="button">
                <el-button type="primary" size="small" :disabled="!isEdit" @click="save()">
                    保存
                </el-button>
                <el-button type="primary" size="small" :disabled="!isEdit" @click="submit()">
                    提交
                </el-button>
            </template>
        </redact-box>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { COMMON_API } from 'common/api/api';
import { dateFormat } from 'utils/utils';

@Component

export default class AuditIndex extends Vue {
    formHeader = {
        factory: '',
        holder: '',
        date: dateFormat(new Date(), 'yyyy-MM-dd')
    };

    queryFormRules = {};
    factory = [];
    holderList = [];
    dataList = [];
    auditLogData = [];

    mounted() {
        this.getFactory();
    }

    @Watch('formHeader.factory')
    getVisible(newVal) {
        this.getHolderList(newVal);
    }

    getFactory() {
        COMMON_API.ORG_QUERY_WORKSHOP_API({
            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
            deptType: ['WORK_SHOP'],
            deptName: '杀菌'
        }).then(({ data }) => {
            if (data.code === 200) {
                this.factory = data.data;
                if (data.data.length !== 0) {
                    this.formHeader.factory = data.data[0]['id'];
                }
            }
        })
    }

    // 煮料锅/罐下拉
    getHolderList(deptId) {
        if (deptId) {
            COMMON_API.HOLDER_QUERY_API({
                current: 1,
                deptId: this.formHeader.factory,
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                holderType: '020',
                size: 999
            }).then(({ data }) => {
                this.holderList = data.data.records
            })
        } else {
            this.holderList = [];
        }
    }

    // 新增
    insertItem() {
        console.log('1')
    }

    // 查询
    getDataList() {
        console.log('1')
    }
}
</script>
