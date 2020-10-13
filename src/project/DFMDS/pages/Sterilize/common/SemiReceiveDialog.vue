<template>
    <el-dialog title="半成品领用" :close-on-click-modal="false" :visible.sync="visible">
        <el-form ref="dataForm" :model="dataForm" status-icon :rules="dataRule" label-width="125px" size="small" @keyup.enter.native="dataFormSubmit()">
            <el-form-item label="生产锅号：" prop="stePotNo">
                <el-input v-model="dataForm.stePotName" placeholder="手动输入" disabled />
            </el-form-item>
            <el-form-item label="发酵罐领用：">
                <el-radio v-model="dataForm.consumeType" label="1">
                    是
                </el-radio>
                <el-radio v-model="dataForm.consumeType" label="0">
                    否
                </el-radio>
            </el-form-item>
            <el-form-item v-if="dataForm.consumeType === '1'" label="发酵罐号：" prop="fermentPotNo">
                <el-select v-model="dataForm.fermentPotNo" placeholder="请选择" style="width: 100%;" clearable>
                    <el-option v-for="(item, index) in potArr" :key="index" :label="item.holderName" :value="item.holderNo" />
                </el-select>
            </el-form-item>
            <el-form-item label="领用物料：" prop="">
                <el-select v-model="dataForm.materialCode" placeholder="请选择" style="width: 100%;" clearable @change="setUtil">
                    <el-option v-for="(item, index) in materialArr" :key="index" :label="item.matnr + ' ' + item.materialName" :value="item.matnr" />
                </el-select>
            </el-form-item>
            <el-form-item label="单位：" prop="consumeUnit">
                <el-input v-model="dataForm.consumeUnit" placeholder="手动输入" disabled />
            </el-form-item>
            <el-form-item label="领用数量：" prop="consumeAmount">
                <el-input v-model="dataForm.consumeAmount" type="number" placeholder="手动输入" />
            </el-form-item>
            <el-form-item label="领用批次：" prop="consumeBatch">
                <el-input v-model="dataForm.consumeBatch" maxlength="10" placeholder="手动输入" />
            </el-form-item>
            <el-form-item v-if="dataForm.consumeType === '1'" label="发酵罐库存：">
                <el-input v-model="dataForm.fermentStorage" type="number" placeholder="手动输入" />
            </el-form-item>
            <el-form-item label="转运罐号：">
                <el-select v-model="dataForm.tankNo" placeholder="请选择" size="small" clearable filterable style="width: 100%;">
                    <el-option v-for="(item, optIndex) in transferTank" :key="optIndex" :label="item.holderName" :value="item.holderNo" />
                </el-select>
            </el-form-item>
            <el-form-item label="备注：">
                <el-input v-model="dataForm.remark" placeholder="手动输入" />
            </el-form-item>
            <el-form-item label="操作人：">
                <el-input v-model="dataForm.changer" placeholder="手动输入" disabled />
            </el-form-item>
            <el-form-item label="操作时间：">
                <el-date-picker v-model="dataForm.changed" type="datetime" placeholder="选择" disabled style="width: 100%;" />
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="small" @click="visible = false">
                取消
            </el-button>
            <el-button size="small" type="primary" @click="dataFormSubmit">
                确定
            </el-button>
        </div>
    </el-dialog>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
    import { COMMON_API, ORDER_API } from 'common/api/api';
    import { dateFormat, getUserNameNumber } from 'utils/utils';

    @Component
    export default class SemiReceiveDialog extends Vue {
        @Prop({ default: { workShop: '' } }) formHeader: FormHeaderobj;

        $refs: {dataForm: HTMLFormElement};
        visible = false;
        potArr: PotObject[] = [];
        transferTank: PotObject[] = [];
        materialArr: MaterialObj[] = [];
        dataRule = {
            stePotNo: [{ required: true, message: '生产锅号不能为空', trigger: 'blur' }],
            fermentPotNo: [{ required: true, message: '发酵罐号不能为空', trigger: 'blur' }],
            materialCode: [{ required: true, message: '领用物料不能为空', trigger: 'blur' }],
            consumeUnit: [{ required: true, message: '单位不能为空', trigger: 'blur' }],
            consumeAmount: [{ required: true, message: '领用数量不能为空', trigger: 'blur' }],
            consumeBatch: [{ required: true, message: '领用批次不能为空', trigger: 'blur' }]
        };

        dataForm: DataObj = {
            consumeType: '1'
        };

        mounted() {
            COMMON_API.HOLDER_QUERY_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                current: 1,
                size: 9999,
                holderType: '001'
            }).then(({ data }) => {
                this.potArr = data.data.records
            })
            ORDER_API.ORDER_BOOM_LIST_API({
                materialType: 'ZHAL',
                orderNoList: [this.$store.state.sterilize.SemiReceive.orderNoMap.orderNo]
            }).then(({ data }) => {
                this.materialArr = data.data
            })
        }

        init(Data, formHeader) {
            COMMON_API.HOLDER_QUERY_API({
                deptId: this.formHeader.workShop,
                holderType: '022',
                size: 99999,
                current: 1
            }).then(({ data }) => {
                this.transferTank = data.data.records
            })
            this.visible = true;
            if (Data) {
                this.dataForm = JSON.parse(JSON.stringify(Data))
            } else {
                this.dataForm = {
                    id: '',
                    stePotNo: this.$store.state.sterilize.SemiReceive.potNo,
                    stePotName: formHeader.potName,
                    potOrderId: this.$store.state.sterilize.SemiReceive.potOrderMap.id,
                    potOrderNo: this.$store.state.sterilize.SemiReceive.potOrderMap.potOrderNo,
                    consumeType: '1',
                    fermentPotNo: '',
                    materialCode: '',
                    materialType: '',
                    materialName: '',
                    consumeUnit: '',
                    consumeAmount: '',
                    consumeBatch: '',
                    fermentStorage: '',
                    tankNo: '',
                    remark: '',
                    changer: getUserNameNumber(),
                    changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
                }
            }

        }

        setUtil() {
            const filterArr1: (any) = this.materialArr.filter(it => it.matnr === this.dataForm.materialCode);// eslint-disable-line
            this.dataForm.consumeUnit = filterArr1[0].erfme;
            this.dataForm.materialName = filterArr1[0].materialName;
            this.dataForm.materialType = filterArr1[0].materialType
        }

        dataFormSubmit() {
            this.$refs.dataForm.validate(valid => {
                if (valid) {
                    if (this.dataForm.consumeType === '0') {
                        this.dataForm.fermentPotNo = '';
                        this.dataForm.fermentPotName = '';
                        this.dataForm.fermentStorage = '';
                    } else {
                        const filterArr1: (any) = this.potArr.filter(it => it.holderNo === this.dataForm.fermentPotNo);// eslint-disable-line
                        const filterArr2: (any) = this.transferTank.filter(it => it.holderNo === this.dataForm.tankNo);// eslint-disable-line
                        this.dataForm.fermentPotName = filterArr1[0].holderName;
                        this.dataForm.tankName = filterArr2.length ? filterArr2[0].holderName : '';
                    }
                    this.visible = false;
                    this.$emit('success', this.dataForm)
                }
            })
        }
    }
    interface FormHeaderobj {
        workShop?: string;
    }
    interface MaterialObj {
        matnr?: string;
        materialName?: string;
        erfme?: string;
    }
    interface DataObj {
        id?: string;
        consumeType?: string;
        fermentPotName?: string;
        stePotNo?: string;
        stePotName?: string;
        potOrderId?: string;
        potOrderNo?: string;
        fermentPotNo?: string;
        materialCode?: string;
        materialType?: string;
        materialName?: string;
        consumeUnit?: string;
        consumeAmount?: string;
        consumeBatch?: string;
        fermentStorage?: string;
        tankNo?: string;
        tankName?: string;
        remark?: string;
        changer?: string;
        changed?: string;
    }

    interface PotMaterial {
        materialCode: string;
        materialName: string;
    }

    interface PotObject {
        deptId: string;
        holderArea: string;
        holderBatch: string;
        holderName: string;
        holderNo: string;
        holderStatus: string;
        holderType: string;
        holderVolume: number;
        id: string;
        material: PotMaterial[];
    }

</script>

<style scoped>

</style>
