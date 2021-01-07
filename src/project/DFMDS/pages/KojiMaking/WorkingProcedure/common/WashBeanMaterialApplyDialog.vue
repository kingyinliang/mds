<template>
    <el-dialog title="大豆领用" width="458px" :close-on-click-modal="false" :visible.sync="visible">
        <el-form ref="dataForm" :model="dataForm" status-icon :rules="dataRule" label-width="125px" size="small" @keyup.enter.native="dataFormSubmit()">
            <el-form-item label="领用库位：">
                <el-input v-model="dataForm.materialHL" placeholder="NA" disabled />
            </el-form-item>
            <el-form-item label="BOM物料：">
                <el-input v-model="dataForm.material" placeholder="NA" disabled />
            </el-form-item>
            <el-form-item label="领用批次：" prop="batch">
                <el-select v-model="dataForm.batch" :disabled="type !== 'add'" placeholder="请选择" style="width: 100%;" @change="batchChange">
                    <el-option v-for="(item, index) in batchList" :key="index" :label="item.batch" :value="item.batch" />
                </el-select>
            </el-form-item>
            <el-form-item label="领用物料：">
                <el-input v-model="dataForm.materialLink" placeholder="NA" disabled />
            </el-form-item>
            <el-form-item label="库存量：">
                <el-input v-model="dataForm.stockAmount" placeholder="NA" disabled />
            </el-form-item>
            <el-form-item label="领用数量：" prop="amount">
                <el-input v-model.number="dataForm.amount" placeholder="请输入" @input="calcStockAmount" />
            </el-form-item>
            <el-form-item label="小豆数量：" prop="smallBeanAmount">
                <el-input v-model="dataForm.smallBeanAmount" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="单位：">
                <el-input v-model="dataForm.unitName" placeholder="NA" disabled />
            </el-form-item>
            <el-form-item label="大豆厂家：">
                <el-input v-model="dataForm.supplier" placeholder="NA" disabled />
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
                <el-tooltip :disabled="!dataForm.remark" effect="dark" :content="dataForm.remark" placement="top">
                    <el-input v-model="dataForm.remark" placeholder="请输入" />
                </el-tooltip>
            </el-form-item>
            <el-form-item label="操作人：">
                <el-input v-model="dataForm.changer" placeholder="NA" disabled />
            </el-form-item>
            <el-form-item label="操作时间：">
                <el-input v-model="dataForm.changed" placeholder="NA" disabled />
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
    import { KOJI_API } from 'common/api/api';
    import { dateFormat, getUserNameNumber } from 'utils/utils';

    @Component({
        name: 'WashBeanMaterialApplyDialog'
    })
    export default class WashBeanMaterialApplyDialog extends Vue {
        @Prop({ default: { workShop: '' } }) formHeader: FormHeaderobj;

        $refs: {dataForm: HTMLFormElement};

        // 库存信息
        stockInfoList: StockInfoList[] = [];
        // 批次list
        batchList: BatchList[] = [];

        // 保存库存量初始值
        STOCK_AMOUNT = 0;

        visible = false;
        type = '';

        dataRule = {
            amount: [
                { required: true, message: '领用数量不能为空', trigger: 'blur' },
                { type: 'number', message: '必须为数字值' }
            ],
            batch: [{ required: true, message: '请选择领用批次', trigger: 'change' }],
            smallBeanAmount: [
                { required: true, message: '请输入数字', trigger: 'blur' },
                {
                    validator(rule, value, callback) {
                        if (/^([1-9][0-9]*|0)(\.([0-9]+)?[1-9])?$/.test(value)) {
                        return callback()
                        }
                        return callback(new Error('请输入数字'))

                    },
                    trigger: 'blur'
                }
    ]
        };

        // 表单对象
        dataForm: DataForm = {};

        async init(infoData, formHeader, type) {
            this.type = type;
            this.visible = true;
            let Data: DataForm = {};

            let storageId = '';
            if (type === 'add') {
                this.batchList = infoData.detailsList || [];
                Data = {
                    ...infoData,
                    ...infoData.detailsList[0]
                }
                storageId = infoData.detailsList[0].id;
            } else {
                storageId = infoData.storageId;
                // 查询
                await KOJI_API.KOJI_STORAGE_BEAN_DROPDOWN_API({
                    workShop: formHeader.workShop,
                    wareHouseNo: infoData.wareHouseNo,
                    materialLocation: infoData.materialLocation
                }).then(({ data }) => {
                    this.batchList = data.data;
                    this.batchList.map(item => {
                        if (item.batch === infoData.batch) {
                            infoData.stockAmount = item.currentAmount;
                        }
                    });
                    Data = {
                        ...infoData
                    }
                });
            }

            const { data: { data: result } } = await KOJI_API.KOJI_MATERIAL_GET_BOM_API({
                orderNo: this.formHeader.orderNo,
                dictType: 'KOJI_BEAN_MATERIAL'
            });
            console.log(result, 'result=-=-========================================')

            this.STOCK_AMOUNT = (Data.stockAmount || Data.currentAmount) ? Number(Data.stockAmount) || Number(Data.currentAmount) : 0;
            if (Data.amount) { this.STOCK_AMOUNT += Number(Data.amount); }

            this.dataForm = {
                id: Data.id,
                processCode: formHeader.textStage,
                materialHL: Data.wareHouseNo || Data.materialLocation,
                materialLocation: Data.materialLocation,
                batch: Data.batch,
                wareHouseNo: Data.wareHouseNo,
                // material: `${String(Data.materialName)} ${String(Data.materialCode)}`,
                // materialCode: Data.materialCode,
                // materialName: Data.materialName,
                // materialLink: Data.materialCode ? Data.materialName + Data.materialCode : '',
                // materialType: 'BEAN',
                material: `${String(result.materialName)} ${String(result.materialCode)}`,
                materialCode: result.materialCode,
                materialName: result.materialName,
                materialLink: result.materialCode ? `${String(result.materialName)} ${String(result.materialCode)}` : '',
                materialType: result.materialType,
                storageType: 'BEAN', // 写死
                amount: Data.amount,
                supplier: Data.supplier,
                stockAmount: Data.stockAmount || Data.currentAmount,
                orderNo: this.formHeader.orderNo,
                kojiOrderNo: this.formHeader.kojiOrderNo,
                smallBeanAmount: Data.smallBeanAmount,
                unit: 'KG',
                unitName: '千克',
                remark: Data.remark,
                changer: getUserNameNumber(),
                changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                storageId: storageId
            }
        }

        calcStockAmount() {
            const amount = this.dataForm.amount;
            if (amount === '') {
                this.dataForm.stockAmount = Number(this.STOCK_AMOUNT)
            }
            if (/^[1-9]?([0-9]+$)/.test(String(amount))) {
                this.dataForm.stockAmount = Number(this.STOCK_AMOUNT) - Number(amount)
            }
        }

        batchChange() {
            this.batchList.map(item => {
                if (item.batch === this.dataForm.batch) {
                    this.dataForm.materialLink = String(item.materialName) + String(item.materialCode);
                    this.dataForm.stockAmount = item.stockAmount || item.currentAmount;
                    this.STOCK_AMOUNT = Number(item.stockAmount) || Number(item.currentAmount);
                    this.dataForm.amount = '';
                    this.dataForm.supplier = item.supplier;
                    this.dataForm.storageId = item.id;
                }
            })
        }

        // 提交
        dataFormSubmit() {
            this.$refs.dataForm.validate(valid => {
                if (valid) {
                    if (this.type === 'add') {
                        const params = JSON.parse(JSON.stringify(this.dataForm))
                        delete params.id;
                        KOJI_API.KOJI_MATERIAL_GET_ADD_QUERY_API({
                            insertDto: [params]
                        }).then(() => {
                            this.visible = false;
                            this.$emit('success', this.dataForm)
                        })
                    } else {
                        KOJI_API.KOJI_MATERIAL_GET_EDIT_QUERY_API({
                            updateDto: [this.dataForm]
                        }).then(() => {
                            this.visible = false;
                            this.$emit('success', this.dataForm)
                        })
                    }
                }
            })
        }
    }

    interface FormHeaderobj {
        workShop?: string;
        kojiOrderNo?: string;
        orderNo?: string;
    }

    interface StockInfoList {
        workShop?: string;
        beanLocation?: string;
        beanWareHouse?: string;
        detailsList: object[];
    }

    interface BatchList {
        id?: string;
        batch?: string;
        materialName?: string;
        materialCode?: string;
        stockAmount?: string;
        supplier?: string;
        currentAmount?: string;
    }

    interface DataForm {
        id?: string;
        materialLocation?: string;
        batch?: string;
        material?: string;
        materialCode?: string;
        materialName?: string;
        materialLink?: string;
        materialType?: string;
        storageType?: string;
        processCode?: string;
        amount?: string;
        supplier?: string;
        orderNo?: string;
        kojiOrderNo?: string;
        smallBeanAmount?: string;
        unit?: string;
        unitName?: string;
        remark?: string;
        changer?: string;
        changed?: string;
        stockAmount?: string| number;
        currentAmount?: string;
        wareHouseNo?: string;
        materialHL?: string;
        storageId?: string;
    }

</script>
