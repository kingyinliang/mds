<template>
    <div class="header_main">
        <data-entry
            ref="dataEntry"
            type="entry"
            :header-base="headerBase"
            :form-header="formHeader"
            :order-status="formHeader.orderStatus"
            status-title="状态"
            :redact-box-show="true"
            :saved-datas="savedDatas"
            :submit-datas="submitDatas"
        >
            <template v-slot:contentBox="{isRedact}">
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
                        <el-table :key="Math.random()" class="newTable markStyle" :data="saltWaterList" :row-class-name="rowDelFlag" header-row-class-name="tableHead" border style="width: 100%; min-height: 90px;">
                            <el-table-column width="150" label="领用物料" :show-overflow-tooltip="true" class="star">
                                <template slot="header">
                                    <span class="notNull">盐水罐号</span>
                                </template>
                                <template slot-scope="scope">
                                    <el-select v-model="scope.row.brinePotId" filterable size="small" clearable style="width: 100%;" :disabled="!isRedact">
                                        <el-option v-for="(opt, optIndex) in saltWaterPots" :key="optIndex" :label="opt.holderName" :value="opt.id" />
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column width="180" label="盐水配置日期" :show-overflow-tooltip="false" class="star">
                                <template slot-scope="scope">
                                    <el-date-picker v-model="scope.row.matchDate" :disabled="!isRedact" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="请选择" size="small" />
                                </template>
                            </el-table-column>
                            <el-table-column width="180" label="开始时间" :show-overflow-tooltip="false" class="star">
                                <template slot-scope="scope">
                                    <el-date-picker v-model="scope.row.startDate" :disabled="!isRedact" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="请选择" size="small" />
                                </template>
                            </el-table-column>
                            <el-table-column width="180" label="结束时间" :show-overflow-tooltip="false" class="star">
                                <template slot-scope="scope">
                                    <el-date-picker v-model="scope.row.endDate" :disabled="!isRedact" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="请选择" size="small" />
                                </template>
                            </el-table-column>
                            <el-table-column width="150" :show-overflow-tooltip="true" class="star">
                                <template slot="header">
                                    <span class="notNull">盐水用量（KG）</span>
                                </template>
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.useAmount" size="small" type="number" placeholder="输入数量" :disabled="!isRedact" />
                                </template>
                            </el-table-column>
                            <el-table-column width="120" label="盐水温度（°C）" :show-overflow-tooltip="true" class="star">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.temperature" :disabled="!isRedact" size="small" type="number" placeholder="输入温度" />
                                </template>
                            </el-table-column>
                            <el-table-column width="150" :show-overflow-tooltip="true" class="star">
                                <template slot="header">
                                    <span class="notNull">盐水浓度</span>
                                </template>
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.concentration" size="small" type="number" placeholder="输入浓度" :disabled="!isRedact" />
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
                                    <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!isRedact" @click="removeDataRow(scope.$index, 'saltWaterList')">
                                        删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </mds-card>
                <mds-card title="其他发料" name="otherwater">
                    <template slot="titleBtn">
                        <el-button type="primary" size="small" style="float: right;" :disabled="!isRedact" @click="addMaterial()">
                            新增
                        </el-button>
                    </template>
                    <template>
                        <el-table :key="Math.random()" class="newTable markStyle" :data="otherMaterialList" :row-class-name="rowDelFlag" header-row-class-name="tableHead" border style="width: 100%; min-height: 90px;">
                            <el-table-column width="150" label="领用物料" :show-overflow-tooltip="true" class="star">
                                <template slot-scope="scope">
                                    {{ scope.row.useMaterialName + ' ' + scope.row.useMaterialCode }}
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
                                    <el-input v-model="scope.row.needAmount" size="small" :disabled="!isRedact" />
                                </template>
                            </el-table-column>
                            <el-table-column width="150" label="罐号" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <el-select v-model="scope.row.usePotId" filterable size="small" clearable style="width: 100%;" :disabled="!isRedact">
                                        <el-option v-for="(opt, optIndex) in pots" :key="optIndex" :label="opt.holderName" :value="opt.id" />
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column width="150" :show-overflow-tooltip="true" class="star">
                                <template slot="header">
                                    <span class="notNull">领用数量</span>
                                </template>
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.useAmount" size="small" placeholder="输入数量" :disabled="!isRedact" />
                                </template>
                            </el-table-column>
                            <el-table-column :show-overflow-tooltip="true" width="100">
                                <template slot="header">
                                    <span>单位</span>
                                </template>
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.unitName" size="small" placeholder="" :disabled="true" />
                                </template>
                            </el-table-column>
                            <el-table-column :show-overflow-tooltip="true" min-width="200">
                                <template slot="header">
                                    <span class="notNull">批次</span>
                                </template>
                                <template slot-scope="scope">
                                    <el-input v-model.trim="scope.row.receiveBatch" size="small" placeholder="输入批次" :disabled="!isRedact" />
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
                                    <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!isRedact" @click="removeDataRow(scope.$index, 'pots')">
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
import { FER_API } from 'common/api/api';
// import { dateFormat } from 'utils/utils';
import RedactBox from 'components/RedactBox.vue'; // 下方状态 bar
import COMMON_API from 'src/common/api/common';

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
            type: 'tooltip',
            icon: 'factory-riqi1',
            label: '发酵罐/池',
            value: ['holderNo', 'holderName']
        },
        {
            type: 'p',
            icon: 'factory-bianhao',
            label: '制曲订单',
            value: 'orderNo'
        },
        {
            type: 'tooltip',
            icon: 'factory-pinleiguanli',
            label: '制曲物料',
            value: ['preMaterialCode', 'preMaterialName']
        },
        {
            type: 'p',
            icon: 'factory--meirijihuachanliangpeizhi',
            label: '制曲数量',
            value: 'kojiAmount'
        },
        {
            type: 'p',
            icon: 'factory-riqi1',
            label: '出曲日期',
            value: 'kojiOutDate'
        },
        {
            type: 'tooltip',
            icon: 'factory-pinleiguanli',
            label: '发酵物料',
            value: ['productMaterialCode', 'productMaterialName']
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
            value: 'kojiTempature',
            placeholder: '输入温度°C'
        }
    ];

    // formHeader = {
    //     factoryName: JSON.parse(sessionStorage.getItem('factory') || '{}').deptName
    // };

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

    saltWaterList: SaltWaterObj[] = [];

    otherMaterialList: OtherMaterial[] = [];

    // isRedact = false; // 可否编辑
    redactBoxDisable = false; // control bar 可否禁用
    checkStatus = 'R'; // 发料状态

    saltWaterPots = [];
    pots = [];

    // get statusColor() {
    //     let res = '';
    //     switch (this.checkStatus) {
    //         case 'R':
    //             res = 'red';
    //             break;
    //         case 'S':
    //             res = '#1890ff';
    //             break;
    //         case 'M':
    //             res = '#1890ff';
    //             break;
    //         case '已同步':
    //             res = '#f5f7fa';
    //             break;
    //         default:
    //             res = 'rgb(103, 194, 58)';
    //             break;
    //     }
    //     return res;
    // }

    get formHeader() {
        const info = { ...this.$store.state.fer.brineInfo };
        const order = { ...info.order };
        delete order.id;
        return {
            ...info,
            ...order,
            kojiAmount: order.preAmount,
            kojiOutDate: info.intoDate,
            orderStatus: info.brineFlag,
            orderStatusName: info.brineFlagName,
            factoryName: JSON.parse(sessionStorage.getItem('factory') || '{}').deptName
        }
    }

    mounted() {
        this.getOrtherMaterialList();
        this.getPotListByType(['011'], true, 'saltWaterPots');
        this.getPotListByType(['001'], false, 'pots');
    }

    getOrtherMaterialList() {
        FER_API.FER_BRINE_OTHER_BOM_API({ ferBrineIssueId: this.formHeader.id }).then(({ data }) => {
            // console.log(data, '=-=-=-=-=-=-=')
            this.otherMaterialList = data.data;
        })
    }

    getPotListByType(holderType, factory = false, fileName) {
        COMMON_API.HOLDER_DROPDOWN_API({ // /sysHolder/query
            factory: factory ? JSON.parse(sessionStorage.getItem('factory') || '{}').id : null,
            holderType: holderType // 罐参数编码/
        }).then((res) => {
            // eslint-disable-next-line no-invalid-this
            this[fileName] = res.data.data;
        })
    }

    ruleSaltWaterMaterialSubmit() {
        for (const item of this.saltWaterList) {
            if (!item.brinePotId || !item.useAmount || !item.concentration) {
                this.$warningToast('请填写其他物料必填栏位');
                return false;
            }
        }
        return true;
    }

    ruleOtherMaterialSubmit() {
        for (const item of this.otherMaterialList) {
            if (!item.receiveBatch || !item.useAmount) {
                this.$warningToast('请填写其他物料必填栏位');
                return false;
            }
        }
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

    submitDatas() {
        return new Promise((resolve) => {
            resolve(null);
        });
    }

    addMaterial(ref) {
        if (!ref) {
            this.otherMaterialList.push({
                changed: '', // 最后操作时间''
                changer: '', // 最后操作人
                ferBrineIssue: '', // 盐水发料
                ferBrineIssueId: '', // 盐水发料主键
                // id: '', // 主键
                needAmount: 0, // 需求数量
                posnr: '', // bom行项目号
                receiveBatch: '', // 领用批次
                remark: '', // 备注
                splitFlag: '', // 拆分标记('Y','N')
                unit: '', // 单位
                unitName: '', // 单位
                useAmount: 0, // 领用数量
                useMaterialCode: '', // 领用物料编码
                useMaterialName: '', // 领用物料描述
                useMaterialType: '', // 领用物料类型
                usePotId: '', // 领用罐ID
                usePotName: '', // 领用罐名称
                usePotNo: '' // 领用罐号
            })
            return
        }
        this.$refs[ref].validate(valid => {
            if (valid) {
                this.saltWaterList.push({
                    brinePotId: '',	// 盐水罐ID
                    brinePotName: '', // 盐水罐名称
                    brinePotN: '', // 盐水罐号
                    changed: '', // 最后操作时间
                    changer: '', // 最后操作人
                    concentration: 0, // 盐水浓度
                    endDate: '', // 结束时间
                    ferBrineIssue: null, // 盐水发料
                    ferBrineIssueId: '', // 盐水发料主键
                    // id: string; // 主键
                    matchDate: '', // 盐水配置日期
                    remark: '', // 备注
                    startDate: '', // 开始时间
                    temperature: 0, // 盐水温度
                    unit: '', // 盐水用量单位
                    unitName: '', // 单位
                    useAmount: 0 // 盐水用量
                });
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

    removeDataRow(index, fileName) {
        this.$confirm('是否删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this[fileName].splice(index, 1);
            // this.$set(row, 'delFlag', 1)
            // this.$successToast('删除成功');
        });
    }

    // 拆分
    splitHandler(row) {
        console.log(row);
    }
}

interface SaltWaterObj {
    brinePotId: string;	// 盐水罐ID
    brinePotName: string; // 盐水罐名称
    brinePotN: string; // 盐水罐号
    changed: string; // 最后操作时间
    changer: string; // 最后操作人
    concentration: number; // 盐水浓度
    endDate: string; // 结束时间
    ferBrineIssue: any; // 盐水发料
    ferBrineIssueId: string; // 盐水发料主键
    id?: string; // 主键
    matchDate: string; // 盐水配置日期
    remark: string; // 备注
    startDate: string; // 开始时间
    temperature: number; // 盐水温度
    unit: string; // 盐水用量单位
    unitName: string; // 单位
    useAmount: number; // 盐水用量
}
interface OtherMaterial {
    changed: string; // 最后操作时间
    changer: string; // 最后操作人
    ferBrineIssue: string; // 盐水发料
    ferBrineIssueId: string; // 盐水发料主键
    id?: string; // 主键
    needAmount: number; // 需求数量
    posnr: string; // bom行项目号
    receiveBatch: string; // 领用批次
    remark: string; // 备注
    splitFlag: string; // 拆分标记('Y','N')
    unit: string; // 单位
    unitName: string; // 单位
    useAmount: number; // 领用数量
    useMaterialCode: string; // 领用物料编码
    useMaterialName: string; // 领用物料描述
    useMaterialType: string; // 领用物料类型
    usePotId: string; // 领用罐ID
    usePotName: string; // 领用罐名称
    usePotNo: string; // 领用罐号
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
