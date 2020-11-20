<template>
    <div class="header_main">
        <data-entry
            ref="dataEntry"
            type="entry"
            :header-base="headerBase"
            :form-header="formHeader"
            :order-status="formHeader.orderStatusName"
            status-title="状态"
            :redact-box-show="true"
        >
            <template v-slot:contentBox>
                <mds-card title="盐水发料" name="saltwater">
                    <template>
                        <el-form ref="selectFormRef" :model="selectForm" :inline="true" :rules="selectFormRules" size="small" label-suffix="：" label-width="90px" class="multi_row clearfix" style="font-size: 0;">
                            <el-form-item label="盐水物料" prop="aaaaaaaa">
                                <el-select v-model="selectForm.aaaaaaaa" :disabled="!isRedact" style="width: 160px;" :clearable="true" :placeholder="'请选择盐水物料'">
                                    <el-option v-for="(opt, optIndex) in materialOptionsList" :key="optIndex" :label="opt.label" :value="opt.value" />
                                </el-select>
                            </el-form-item>
                            <el-form-item class="floatr">
                                <el-button type="primary" size="small" :disabled="!isRedact" @click="addMaterial('selectFormRef')">
                                    新增
                                </el-button>
                            </el-form-item>
                        </el-form>
                        <el-table class="newTable markStyle" :data="saltWaterList" :row-class-name="rowDelFlag" header-row-class-name="tableHead" border style="width: 100%; min-height: 90px;">
                            <el-table-column width="150" label="领用物料" :show-overflow-tooltip="true" class="star">
                                <template slot="header">
                                    <span class="notNull">盐水罐号</span>
                                </template>
                                <template slot-scope="scope">
                                    <el-select v-model="scope.row.impurityType" size="small" clearable style="width: 100%;" :disabled="!isRedact">
                                        <el-option v-for="(opt, optIndex) in materialOptionsList" :key="optIndex" :label="opt.label" :value="opt.value" />
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column width="180" label="盐水配置日期" :show-overflow-tooltip="false" class="star">
                                <template slot-scope="scope">
                                    <el-date-picker v-model="scope.row.aaaaaaaa" :disabled="!isRedact" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="请选择" size="small" />
                                </template>
                            </el-table-column>
                            <el-table-column width="180" label="开始时间" :show-overflow-tooltip="false" class="star">
                                <template slot-scope="scope">
                                    <el-date-picker v-model="scope.row.aaaaaaaa" :disabled="!isRedact" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="请选择" size="small" />
                                </template>
                            </el-table-column>
                            <el-table-column width="180" label="结束时间" :show-overflow-tooltip="false" class="star">
                                <template slot-scope="scope">
                                    <el-date-picker v-model="scope.row.aaaaaaaa" :disabled="!isRedact" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="请选择" size="small" />
                                </template>
                            </el-table-column>
                            <el-table-column width="150" :show-overflow-tooltip="true" class="star">
                                <template slot="header">
                                    <span class="notNull">盐水用量（KG）</span>
                                </template>
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.aaaaaaaa" size="small" type="number" placeholder="输入数量" :disabled="!isRedact" />
                                </template>
                            </el-table-column>
                            <el-table-column width="120" label="盐水温度（°C）" :show-overflow-tooltip="true" class="star">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.aaaaaaaa" :disabled="!isRedact" size="small" type="number" placeholder="输入温度" />
                                </template>
                            </el-table-column>
                            <el-table-column width="150" :show-overflow-tooltip="true" class="star">
                                <template slot="header">
                                    <span class="notNull">盐水浓度</span>
                                </template>
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.aaaaaaaa" size="small" type="number" placeholder="输入浓度" :disabled="!isRedact" />
                                </template>
                            </el-table-column>
                            <el-table-column :show-overflow-tooltip="true" min-width="200">
                                <template slot="header">
                                    <span>备注</span>
                                </template>
                                <template slot-scope="scope">
                                    <el-input v-model.trim="scope.row.remark" size="small" placeholder="请输入" :max="255" :maxlength="255" :disabled="!isRedact" />
                                </template>
                            </el-table-column>
                            <el-table-column prop="changer" width="140" label="操作人" :show-overflow-tooltip="true" />
                            <el-table-column prop="changed" width="180" label="操作时间" :show-overflow-tooltip="true" />
                            <el-table-column fixed="right" label="操作" width="80" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!isRedact" @click="removeDataRow(scope.row)">
                                        删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </mds-card>
                <mds-card title="其他发料" name="otherwater">
                    <template slot="titleBtn">
                        <el-button type="primary" size="small" style="float: right;" :disabled="!isRedact" @click="addMaterial('selectFormRef')">
                            新增
                        </el-button>
                    </template>
                    <template>
                        <el-table class="newTable markStyle" :data="otherList" :row-class-name="rowDelFlag" header-row-class-name="tableHead" border style="width: 100%; min-height: 90px;">
                            <el-table-column width="150" label="领用物料" :show-overflow-tooltip="true" class="star">
                                <template slot-scope="scope">
                                    {{ scope.row.aaaaaaaa }}
                                </template>
                            </el-table-column>
                            <el-table-column width="60" label=" " :show-overflow-tooltip="true" class="star">
                                <template slot-scope="scope">
                                    <el-button type="text" size="samll" :disabled="!isRedact" @click="splitHandler(scope.row)">
                                        拆分
                                    </el-button>
                                </template>
                            </el-table-column>
                            <el-table-column :show-overflow-tooltip="true" label="需求数量" width="130">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.aaaaaaaa" size="small" :disabled="!isRedact" />
                                </template>
                            </el-table-column>
                            <el-table-column width="150" label="罐号" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <el-select v-model="scope.row.impurityType" size="small" clearable style="width: 100%;" :disabled="!isRedact">
                                        <el-option v-for="(opt, optIndex) in materialOptionsList" :key="optIndex" :label="opt.label" :value="opt.value" />
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column width="150" :show-overflow-tooltip="true" class="star">
                                <template slot="header">
                                    <span class="notNull">领用数量</span>
                                </template>
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.aaaaaaaa" size="small" placeholder="输入数量" :disabled="!isRedact" />
                                </template>
                            </el-table-column>
                            <el-table-column :show-overflow-tooltip="true" width="100">
                                <template slot="header">
                                    <span>单位</span>
                                </template>
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.unit" size="small" placeholder="" :disabled="true" />
                                </template>
                            </el-table-column>
                            <el-table-column :show-overflow-tooltip="true" min-width="200">
                                <template slot="header">
                                    <span>批次</span>
                                </template>
                                <template slot-scope="scope">
                                    <el-input v-model.trim="scope.row.remark" size="small" placeholder="输入批次" :disabled="!isRedact" />
                                </template>
                            </el-table-column>
                            <el-table-column :show-overflow-tooltip="true" min-width="200">
                                <template slot="header">
                                    <span>备注</span>
                                </template>
                                <template slot-scope="scope">
                                    <el-input v-model.trim="scope.row.remark" size="small" placeholder="请输入" :disabled="!isRedact" />
                                </template>
                            </el-table-column>
                            <el-table-column prop="changer" width="140" label="操作人" :show-overflow-tooltip="true" />
                            <el-table-column prop="changed" width="180" label="操作时间" :show-overflow-tooltip="true" />
                            <el-table-column fixed="right" label="操作" width="80" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!isRedact" @click="removeDataRow(scope.row)">
                                        删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </mds-card>
            </template>
        </data-entry>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
// import { dateFormat, getUserNameNumber } from 'utils/utils';
// import ImportBucket from './ImportBucket.vue';
// import { COMMON_API, STE_API } from 'common/api/api';
// import { dateFormat } from 'utils/utils';
import RedactBox from 'components/RedactBox.vue'; // 下方状态 bar

@Component({
    name: 'SaltWaterDetail',
    components: {
        RedactBox
    }
})
export default class SaltWaterDetail extends Vue {
    $refs: {
        queryTable: HTMLFormElement;
    };

    headerBase = [
        {
            type: 'p',
            icon: 'factory-riqi1',
            label: '发酵罐/池',
            value: 'workShopName'
        },
        {
            type: 'p',
            icon: 'factory-bianhao',
            label: '制曲订单',
            value: 'orderNo'
        },
        {
            type: 'p',
            icon: 'factory-pinleiguanli',
            label: '制曲物料',
            value: 'orderNo'
        },
        {
            type: 'p',
            icon: 'factory--meirijihuachanliangpeizhi',
            label: '制曲数量',
            value: ['planOutput', 'outputUnitName']
        },
        {
            type: 'p',
            icon: 'factory-riqi1',
            label: '出曲日期',
            value: 'orderStartDate'
        },
        {
            type: 'p',
            icon: 'factory-pinleiguanli',
            label: '发酵物料',
            value: 'realPotCount'
        },
        {
            type: 'p',
            icon: 'factory-xianchangrenyuan',
            label: '操作人员', // 操作人员
            value: 'changer'
        },
        {
            type: 'tooltip',
            icon: 'factory-riqi',
            label: '操作时间', // 操作时间
            value: 'changed'
        },
        {
            type: 'input',
            icon: 'factory-riqi',
            label: '曲料温度', // 曲料温度
            value: 'changed',
            placeholder: '输入温度°C'
        }
    ];

    formHeader = {
        factoryName: JSON.parse(sessionStorage.getItem('factory') || '{}').deptName
    };

    formDeatil = {
        aaaaaaaa: '2020-07-25 22:22'
    };

    selectForm = {
        aaaaaaaa: '111'
    };

    materialOptionsList = [
        { label: '酱淡盐水', value: '111' },
        { label: '黄豆酱淡盐水', value: '222' }
    ];

    selectFormRules = {
        aaaaaaaa: [{ required: true, message: '请选择盐水物料', trigger: 'blur' }]
    };

    saltWaterList = [{ aaaaaaaa: '2020-07-25 22:22' }];

    otherList = [{ aaaaaaaa: 'hello world' }];

    isRedact = false; // 可否编辑
    redactBoxDisable = false; // control bar 可否禁用
    checkStatus = 'R'; // 发料状态

    get statusColor() {
        let res = '';
        switch (this.checkStatus) {
            case 'R':
                res = 'red';
                break;
            case 'S':
                res = '#1890f';
                break;
            case 'M':
                res = '#1890ff';
                break;
            case '已同步':
                res = '#f5f7fa';
                break;
            default:
                res = 'rgb(103, 194, 58)';
                break;
        }
        return res;
    }

    ruleSaltWaterMaterialSubmit() {
        // for (const item of this.saltWaterList.filter(it => it.delFlag !== 1)) {
        //     if (!item.aaaaaaaa || !item.aaaaaaaa) {
        //         this.$warningToast('请填写磁铁检查必填栏位');
        //         return false;
        //     }

        //     if (item.impurityType === 'OTHER' && !item.impurityInfo) {
        //         this.$warningToast('请填写磁铁检查必填栏位');
        //         return false;
        //     }
        // }
        return true;
    }

    ruleOtherMaterialSubmit() {
        // for (const item of this.targetQueryTableListOfForiegnMatter.filter(it => it.delFlag !== 1)) {
        //     if (!item.deviceName || !item.impurityAmount || !item.impurityType) {
        //         this.$warningToast('请填写异物统计必填栏位');
        //         return false;
        //     }
        // }
        return true;
    }

    // {redact-box} 提交需跑的验证 function
    savedRules(): Function[] {
        return [this.ruleSaltWaterMaterialSubmit, this.ruleOtherMaterialSubmit];
    }

    savedDatas() {
        return new Promise((resolve) => {
            resolve(null);
        });
    }

    addMaterial(ref) {
        this.$refs[ref].validate(valid => {
            if (valid) {
                this.saltWaterList.push({ aaaaaaaa: '你好啊' });
            } else {
                this.$warningToast('请选择盐水物料');
                return false;
            }
        });
    }

    rowDelFlag({ row }) {
        if (row.delFlag === 1) {
            return 'rowDel';
        }
        return '';
    }

    removeDataRow(row) {
        this.$confirm('是否删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            console.log(row);
            // this.$set(row, 'delFlag', 1)
            // this.$successToast('删除成功');
        });
    }

    // 拆分
    splitHandler(row) {
        console.log(row);
    }
}
</script>

<style lang="scss" scoped>
// .requiredName::before {
//     margin-right: 4px;
//     color: #f56c6c;
//     content: "*";
// }
.dotBox {
    display: flex;
    align-items: center;
    span {
        font-size: 14px;
    }
    .dot {
        display: inline-block;
        width: 5px;
        height: 5px;
        margin-right: 8px;
        line-height: 16px;
        border-radius: 50%;
    }
}
</style>
<style scoped>
.markStyle >>> th .notNull::before {
    margin-right: 4px;
    color: #f00;
    content: "*";
}
.markStyle >>> th .notNull {
    color: #fff;
}
</style>
