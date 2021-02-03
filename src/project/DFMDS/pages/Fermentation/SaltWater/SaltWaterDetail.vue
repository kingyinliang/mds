<template>
    <div class="header_main">
        <data-entry
            ref="dataEntry"
            type="entry"
            :header-base="headerBase"
            :form-header="formHeader"
            :order-status="formHeader.orderStatus"
            status-title="状态"
            :redact-box-show="formHeader.orderStatus !== 'M'"
            :saved-datas="savedDatas"
            :submit-rules="submitRules"
            :submit-datas="submitDatas"
            @success="successHandler"
        >
            <template v-slot:contentBox="{isRedact}">
                <mds-card title="盐水发料" name="saltwater">
                    <template slot="titleBtn">
                        <el-form ref="selectFormRef" :model="selectForm" :inline="true" :rules="selectFormRules" size="small" label-suffix="：" label-width="90px" class="multi_row clearfix" style="float: right; padding-bottom: 8px; font-size: 0;">
                            <el-form-item label="盐水物料" prop="brineMaterialCode">
                                <el-select v-model="selectForm.brineMaterialCode" :disabled="!isRedact" style="width: 160px;" :clearable="false" :placeholder="'请选择盐水物料'">
                                    <el-option v-for="(opt, optIndex) in materialOptionsList" :key="optIndex" :label="opt.virtualMaterialCode + ' ' + opt.virtualMaterialName" :value="opt.virtualMaterialCode" />
                                </el-select>
                            </el-form-item>
                            <el-form-item class="floatr">
                                <el-button type="primary" size="small" :disabled="!isRedact" @click="addMaterial('selectFormRef')">
                                    新增
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </template>
                    <template>
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
                            <el-table-column width="180" label="开始领用时间" :show-overflow-tooltip="false" class="star">
                                <template slot-scope="scope">
                                    <el-date-picker v-model="scope.row.startDate" :disabled="!isRedact" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="请选择" size="small" />
                                </template>
                            </el-table-column>
                            <el-table-column width="180" label="结束领用时间" :show-overflow-tooltip="false" class="star">
                                <template slot-scope="scope">
                                    <el-date-picker v-model="scope.row.endDate" :disabled="!isRedact" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="请选择" size="small" />
                                </template>
                            </el-table-column>
                            <el-table-column width="150" :show-overflow-tooltip="true" class="star">
                                <template slot="header">
                                    <span class="notNull">盐水用量（KG）</span>
                                </template>
                                <template slot-scope="scope">
                                    <el-input v-model.number="scope.row.useAmount" oninput="value=value.replace(/\D*/g,'')" size="small" placeholder="请输入数量" :disabled="!isRedact" />
                                </template>
                            </el-table-column>
                            <el-table-column width="120" label="盐水温度（°C）" :show-overflow-tooltip="true" class="star">
                                <template slot-scope="scope">
                                    <el-input v-model.number="scope.row.temperature" oninput="value=value.replace(/\D*/g,'')" :disabled="!isRedact" size="small" placeholder="请输入温度" />
                                </template>
                            </el-table-column>
                            <el-table-column width="150" :show-overflow-tooltip="true" class="star">
                                <template slot="header">
                                    <span class="notNull">盐水浓度（%）</span>
                                </template>
                                <template slot-scope="scope">
                                    <el-input v-model.number="scope.row.concentration" oninput="value=value.replace(/\D*/g,'')" size="small" placeholder="请输入浓度" :disabled="!isRedact" />
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
                                    <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!isRedact" @click="removeDataRow(scope.row, scope.$index, 'saltWaterList', 'ferBrineIssueBrineRemoveIdList')">
                                        删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </mds-card>
                <mds-card v-if="otherMaterialListComp.length" title="其他发料" name="otherwater">
                    <!-- <template slot="titleBtn">
                        <el-button type="primary" size="small" style="float: right;" :disabled="!isRedact" @click="addMaterial()">
                            新增
                        </el-button>
                    </template> -->
                    <template>
                        <el-table :key="Math.random()" class="newTable markStyle" :data="otherMaterialListComp" :row-class-name="rowColor" header-row-class-name="tableHead" border style="width: 100%; min-height: 90px;">
                            <el-table-column width="150" label="领用物料" :show-overflow-tooltip="true" class="star">
                                <template slot-scope="scope">
                                    {{ scope.row.useMaterialName + ' ' + scope.row.useMaterialCode }}
                                </template>
                            </el-table-column>
                            <el-table-column :show-overflow-tooltip="true" label="需求数量" width="130">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.needAmount" size="small" :disabled="true" />
                                </template>
                            </el-table-column>
                            <el-table-column width="150" label="罐号" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <el-select v-model="scope.row.usePotId" filterable size="small" clearable style="width: 100%;" :disabled="!isRedact || scope.row.operatFlag === -1">
                                        <el-option v-for="(opt, optIndex) in pots" :key="optIndex" :label="opt.holderName" :value="opt.id" />
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column width="150" :show-overflow-tooltip="true" class="star">
                                <template slot="header">
                                    <span class="notNull">领用数量</span>
                                </template>
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.useAmount" size="small" placeholder="请输入数量" :disabled="!isRedact || scope.row.operatFlag === -1" />
                                </template>
                            </el-table-column>
                            <el-table-column :show-overflow-tooltip="true" width="100">
                                <template slot="header">
                                    <span>单位</span>
                                </template>
                                <template slot-scope="scope">
                                    <!-- <el-input v-model="scope.row.unitName" size="small" placeholder="" :disabled="!isRedact" /> -->
                                    <el-input v-model="scope.row.unitName" size="small" placeholder="" :disabled="true" />
                                </template>
                            </el-table-column>
                            <el-table-column :show-overflow-tooltip="true" min-width="200">
                                <template slot="header">
                                    <span class="notNull">批次</span>
                                </template>
                                <template slot-scope="scope">
                                    <el-input v-model.trim="scope.row.receiveBatch" :maxlength="10" size="small" placeholder="请输入批次" :disabled="!isRedact || scope.row.operatFlag === -1" />
                                </template>
                            </el-table-column>
                            <el-table-column :show-overflow-tooltip="true" min-width="200">
                                <template slot="header">
                                    <span>备注</span>
                                </template>
                                <template slot-scope="scope">
                                    <el-input v-model.trim="scope.row.remark" size="small" placeholder="请输入" :disabled="!isRedact || scope.row.operatFlag === -1" />
                                </template>
                            </el-table-column>
                            <el-table-column prop="changer" width="140" label="操作人" :show-overflow-tooltip="true" />
                            <el-table-column prop="changed" width="180" label="操作时间" :show-overflow-tooltip="true" />
                            <el-table-column fixed="right" label="操作" width="120" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <el-button type="text" size="samll" :disabled="!isRedact || scope.row.operatFlag === -1" @click="splitHandler(scope.row, scope.$index)">
                                        拆分
                                    </el-button>
                                    <el-button v-if="!(scope.row.splitFlag !== 'Y')" class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!isRedact || scope.row.operatFlag === -1" @click="removeDataRow(scope.row, scope.$index, 'otherMaterialList', 'ferBrineIssueBomRemoveIdList')">
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
import { dateFormat, getUserNameNumber } from 'utils/utils';
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
            value: ['holderName']
        },
        {
            type: 'tooltip',
            icon: 'factory-bianhao',
            label: '制曲订单',
            value: 'preOrderNo'
        },
        {
            type: 'tooltip',
            icon: 'factory-pinleiguanli',
            label: '制曲物料',
            value: ['kojiMaterialName', 'kojiMaterialCode']
        },
        {
            type: 'p',
            icon: 'factory--meirijihuachanliangpeizhi',
            label: '制曲数量',
            value: 'kojiAmount',
            unit: '吨'
        },
        {
            type: 'tooltip',
            icon: 'factory-riqi1',
            label: '出曲日期',
            value: 'kojiOutDate'
        },
        {
            type: 'tooltip',
            icon: 'factory-pinleiguanli',
            label: '发酵物料',
            value: ['ferMaterialName', 'ferMaterialCode']
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
            placeholder: '输入温度°C',
            unit: '°C'
        }
    ];

    selectForm = {
        brineMaterialCode: ''
    };

    materialOptionsList = [];

    selectFormRules = {
        brineMaterialCode: [{ required: true, message: '请选择盐水物料', trigger: 'blur' }]
    };

    saltWaterList: SaltWaterObj[] = [];

    otherMaterialList: OtherMaterial[] = [];

    ferBrineIssueBomRemoveIdList: string[] = [];

    ferBrineIssueBrineRemoveIdList: string[] = [];

    saltWaterPots = [];

    pots = [];

    formHeader: FormHeaderObj = {};

    mounted() {
        this.initHandler();
    }

    successHandler() {
        const info = this.$store.state.fer.brineInfo;
        this.$store.commit('fer/updateBrineInfo', {
            ...info,
            ferBrineIssue: {
                ...info.ferBrineIssue,
                kojiTempature: this.formHeader.kojiTempature
            }
        });
        this.initHandler();
    }

    async initHandler() {
        await this.getDetail();
        FER_API.FER_BRINE_VIRTUAL_MATERIAL_API({ }).then(res => {
            this.materialOptionsList = res.data.data;
        })
        this.getBrineList();
        this.getOrtherMaterialList();
        this.getPotListByType(['011'], true, 'saltWaterPots'); // 盐水罐
        this.getPotListByType(['001', '027'], false, 'pots'); // 027 储存罐、001发酵罐
    }

    async getDetail() {
        const brineInfo = this.$store.state.fer.brineInfo;
        return FER_API.FER_BRINE_QUERY_DETAIL_API({ fermentorId: brineInfo.id }).then(res => {
            const info = res.data.data;
            const issue = info.ferBrineIssue;
            this.formHeader = {
                holderNo: info.holderNo,
                holderName: info.holderName,
                kojiTempature: issue.kojiTempature,
                changed: issue.changed || info.changed,
                changer: issue.changer || info.changer,
                ferMaterialCode: issue.ferMaterialCode || info.ferMaterialCode,
                ferMaterialName: issue.ferMaterialName || info.ferMaterialName,
                // kojiOutDate: info.intoDate,
                kojiOutDate: issue.kojiOutDate || info.kojiOutDate,
                kojiAmount: issue.kojiAmount || info.kojiAmount,
                kojiMaterialCode: issue.kojiMaterialCode || info.kojiMaterialCode,
                kojiMaterialName: issue.kojiMaterialName || info.kojiMaterialName,
                // orderNo: issue.orderNo || info.orderNo,
                orderStatus: issue.checkStatus || 'N',
                orderStatusName: info.brineFlagName,
                factoryName: JSON.parse(sessionStorage.getItem('factory') || '{}').deptName,
                preOrderNo: issue.preOrderNo || info.preOrderNo,
                kojiOrderNo: issue.kojiOrderNo || info.kojiOrderNo
            }
            this.selectForm = {
                brineMaterialCode: info.ferBrineIssue?.brineMaterialCode
            }
            this.$store.commit('fer/updateBrineInfo', {
                ...info,
                workShop: brineInfo.workShop
            });
        })
    }

    get otherMaterialListComp() {
        return this.otherMaterialList.filter(item => item.operatFlag !== -2);
    }

    getBrineList() {
        const info = this.$store.state.fer.brineInfo;
        FER_API.FER_BRINE_MATERIAL_API({ fermentorId: info.id, cycle: info.cycle }).then(({ data }) => {
            this.saltWaterList = data.data;
        })
    }

    getOrtherMaterialList() {
        const info = this.$store.state.fer.brineInfo;
        FER_API.FER_BRINE_OTHER_BOM_API({ fermentorId: info.id, cycle: info.cycle, orderNo: this.formHeader.kojiOrderNo }).then(({ data }) => {
            // console.log(data, '=-=-=-=-=-=-=')
            this.otherMaterialList = data.data.sort((a, b) => a.useMaterialCode > b.useMaterialCode ? 1 : -1).filter(item => item.operatFlag !== -2);
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

    /**
     * 判断是否是非空非0的值
     */
    chargeNumber(v) {
        return Boolean(String(v));
    }

    ruleSaltWaterMaterialSubmit() {
        if (!this.saltWaterList.length) {
            this.$warningToast('盐水发料不能为空');
            return false;
        }
        for (const item of this.saltWaterList) {
            // 盐水用量等不能为0
            if (!item.brinePotId || !item.useAmount || !item.concentration) {
                this.$warningToast('请填写盐水发料必填栏位');
                return false;
            }
        }
        return true;
    }

    ruleOtherMaterialSubmit() {
        console.log(this.otherMaterialList)
        if (!this.otherMaterialList.length) {
            // this.$warningToast('其他发料不能为空');
            return true;
        }
        for (const item of this.otherMaterialList) {
            if (!item.receiveBatch || !item.useAmount) {
                this.$warningToast('请填写其他发料必填栏位');
                return false;
            }
        }
        return true;
    }

    // {redact-box} 提交需跑的验证 function
    submitRules(): Function[] {
        return [this.ruleSaltWaterMaterialSubmit, this.ruleOtherMaterialSubmit];
    }

    savedDatas() {
        const info = this.$store.state.fer.brineInfo;
        const issue = info.ferBrineIssue
        const obj = this.formHeader;
        let virtualMaterialId;
        this.materialOptionsList.map((item: { virtualMaterialCode: string; id: string }) => {
            if (item.virtualMaterialCode === this.selectForm.brineMaterialCode) {
                virtualMaterialId = item.id
            }
        });
        this.otherMaterialList.filter(item => item.operatFlag === -1).map(row => {
            if (row.id) {
                this.ferBrineIssueBomRemoveIdList.push(row.id);
            }
        })
        return FER_API.FER_BRINE_SAVE_API({
            ferBrineIssueBomList: this.otherMaterialList,
            ferBrineIssueBomRemoveIdList: this.ferBrineIssueBomRemoveIdList,
            ferBrineIssueBrineList: this.saltWaterList,
            ferBrineIssueBrineRemoveIdList: this.ferBrineIssueBrineRemoveIdList,
            brineMaterialCode: this.selectForm.brineMaterialCode,
            cycle: issue.cycle || info.cycle,
            ferMaterialCode: obj.ferMaterialCode,
            ferMaterialName: obj.ferMaterialName,

            ferMaterialType: issue.ferMaterialType || info.ferMaterialType, // 发酵物料类型
            fermentorId: info.holderId,
            id: issue.id,
            kojiAmount: obj.kojiAmount,
            kojiMaterialCode: obj.kojiMaterialCode,
            kojiMaterialName: obj.kojiMaterialName,
            kojiOutDate: obj.kojiOutDate,
            kojiTempature: obj.kojiTempature,
            remark: info.remark,
            workShop: info.workShop,
            virtualMaterialId: virtualMaterialId
        });
    }

    submitDatas() {
        const info = this.$store.state.fer.brineInfo;
        const issue = info.ferBrineIssue;
        const obj = this.formHeader;
        let virtualMaterialId;
        this.materialOptionsList.map((item: { virtualMaterialCode: string; id: string }) => {
            if (item.virtualMaterialCode === this.selectForm.brineMaterialCode) {
                virtualMaterialId = item.id
            }
        });
        this.otherMaterialList.filter(item => item.operatFlag === -1).map(row => {
            if (row.id) {
                this.ferBrineIssueBomRemoveIdList.push(row.id);
            }
        })
        return FER_API.FER_BRINE_SUBMIT_API({
            ferBrineIssueBomList: this.otherMaterialList,
            ferBrineIssueBomRemoveIdList: this.ferBrineIssueBomRemoveIdList,
            ferBrineIssueBrineList: this.saltWaterList,
            ferBrineIssueBrineRemoveIdList: this.ferBrineIssueBrineRemoveIdList,
            brineMaterialCode: this.selectForm.brineMaterialCode,
            ferMaterialName: obj.ferMaterialName,
            cycle: issue.cycle || info.cycle,
            ferMaterialCode: obj.ferMaterialCode,
            ferMaterialType: issue.ferMaterialType || info.ferMaterialType, // 发酵物料类型
            fermentorId: info.holderId,
            id: issue.id,
            kojiAmount: obj.kojiAmount,
            kojiMaterialCode: obj.kojiMaterialCode,
            kojiMaterialName: obj.kojiMaterialName,
            kojiOutDate: obj.kojiOutDate,
            kojiTempature: obj.kojiTempature,
            remark: info.remark,
            workShop: info.workShop,
            kojiOrderNo: obj.kojiOrderNo,
            virtualMaterialId: virtualMaterialId,
            // -----待定------
            kojiOrderId: info.kojiOrderId,
            kojiOrderType: info.kojiOrderType,
            kojiOrderStartDate: info.kojiOrderStartDate
        });
    }

    addMaterial(ref) {
        this.$refs[ref].validate(valid => {
            if (valid) {
                this.saltWaterList.push({
                    brinePotId: '',	// 盐水罐ID
                    brinePotName: '', // 盐水罐名称
                    brinePotNo: '', // 盐水罐号
                    changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'), // 最后操作时间
                    changer: getUserNameNumber(), // 最后操作人
                    concentration: 0, // 盐水浓度
                    endDate: '', // 结束时间
                    ferBrineIssue: {}, // 盐水发料
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
    }

    rowColor({ row }) {
        if (row.operatFlag === -1) {
            return 'disabled-row';
        } else if (row.operatFlag === 1) {
            return 'warning-row'
        }
    }

    removeDataRow(row, index, fileName, removeFileName) {
        this.$confirm('是否删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            if (row.id) {
                this[removeFileName].push(row.id);
            }
            this[fileName].splice(index, 1);
            // this.$set(row, 'delFlag', 1)
            // this.$successToast('删除成功');
        });
    }

    // 拆分
    splitHandler(row, index) {
        // console.log(row);
        const obj = {
            ...row,
            useAmount: 0,
            receiveBatch: '',
            splitFlag: 'Y',
            changer: getUserNameNumber(),
            changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
        } as OtherMaterial;
        delete obj.id;
        this.otherMaterialList.splice(index + 1, 0, obj);
    }
}
interface FormHeaderObj {
    id?: string;
    holderNo?: string;
    holderName?: string;
    kojiTempature?: string;
    changed?: string;
    changer?: string;
    ferMaterialCode?: string;
    ferMaterialName?: string;
    kojiOutDate?: string;
    kojiAmount?: string;
    kojiMaterialCode?: string;
    kojiMaterialName?: string;
    // orderNo?: string;
    orderStatus?: string;
    orderStatusName?: string;
    factoryName?: string;
    preOrderNo?: string; // 前置订单
    kojiOrderNo?: string;
}

interface SaltWaterObj {
    brinePotId: string;	// 盐水罐ID
    brinePotName: string; // 盐水罐名称
    brinePotNo: string; // 盐水罐号
    changed: string; // 最后操作时间
    changer: string; // 最后操作人
    concentration: number; // 盐水浓度
    endDate: string; // 结束时间
    ferBrineIssue: FerBrineIssue; // 盐水发料
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
    ferBrineIssue: FerBrineIssue; // 盐水发料
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
    operatFlag: number; // 操作标记(0正常、-1提醒删除、1提醒维护、-2不显示但需要提交表单)
}
interface FerBrineIssue {
    kojiTempature?: number;
    checkStatusName?: string;
    brineMaterialCode?: string;
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
