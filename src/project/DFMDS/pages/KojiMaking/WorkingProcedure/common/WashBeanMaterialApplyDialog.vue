<template>
    <el-dialog title="大豆领用" width="458px" :close-on-click-modal="false" :visible.sync="visible">
        <el-form ref="dataForm" :model="dataForm" status-icon :rules="dataRule" label-width="125px" size="small" @keyup.enter.native="dataFormSubmit()">
            <el-form-item label="领用库位：">
                <el-input v-model="dataForm.materialLocation" placeholder="手动输入" disabled />
            </el-form-item>
            <el-form-item label="BOM物料：">
                <el-input v-model="dataForm.material" placeholder="手动输入" disabled />
            </el-form-item>
            <el-form-item label="领用批次：" prop="batch">
                <el-select v-model="dataForm.batch" placeholder="请选择" style="width: 100%;" @change="batchChange">
                    <el-option v-for="(item, index) in batchList" :key="index" :label="item.batch" :value="item.batch" />
                </el-select>
            </el-form-item>
            <el-form-item label="领用物料：">
                <el-input v-model="dataForm.materialLink" placeholder="手动输入" disabled />
            </el-form-item>
            <el-form-item label="库存量：">
                <el-input v-model="dataForm.stockAmount" placeholder="手动输入" disabled />
            </el-form-item>
            <el-form-item label="领用数量：" prop="amount">
                <el-input v-model="dataForm.amount" placeholder="手动输入" />
            </el-form-item>
            <el-form-item label="小豆数量：" prop="smallBeanAmount">
                <el-input v-model="dataForm.smallBeanAmount" placeholder="手动输入" />
            </el-form-item>
            <el-form-item label="单位：">
                <el-input v-model="dataForm.unit" placeholder="手动输入" disabled />
            </el-form-item>
            <el-form-item label="大豆厂家：">
                <el-input v-model="dataForm.supplier" placeholder="手动输入" disabled />
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
                <el-input v-model="dataForm.remark" placeholder="手动输入" />
            </el-form-item>
            <el-form-item label="操作人：">
                <el-input v-model="dataForm.changer" placeholder="手动输入" disabled />
            </el-form-item>
            <el-form-item label="操作时间：">
                <el-input v-model="dataForm.changed" placeholder="手动输入" disabled />
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
        stockInfoList: DataObj[] = [];
        // 批次list
        batchList: DataObj[] = [];

        visible = false;
        type = '';

        dataRule = {
            amount: [{ required: true, message: '领用数量不能为空', trigger: 'blur' }],
            batch: [{ required: true, message: '领用批次不能为空', trigger: 'change' }],
            smallBeanAmount: [{ required: true, message: '小豆数量不能为空', trigger: 'blur' }],
            remark: [{ required: true, message: '备注不能为空', trigger: 'blur' }]
        };

        // 表单对象
        dataForm: DataForm = {};

        async init(infoData, type) {
            this.type = type;
            this.visible = true;
            let Data: DataForm = {};
            // 查询
            await KOJI_API.KOJI_STOCK_BEAN_INDEX_LIST_API({
                workShopId: this.formHeader.workShop
            }).then(({ data }) => {
                this.stockInfoList = data.data || []
            });
            if (type === 'add') {
                this.stockInfoList.map(item => {
                    if (item.workShop === infoData.workShop || item.beanLocation === infoData.beanLocation || item.beanWareHouse === infoData.beanWareHouse) {
                        Data = {
                            ...item.detailsList[0],
                            materialLocation: item.beanWareHouse || item.workShop,
                            orderNo: infoData.orderNo
                        }
                        this.batchList = item.detailsList;
                    }
                })
            } else {
                this.stockInfoList.map(item => {
                    if (item.workShop === infoData.materialLocation || item.beanLocation === infoData.materialLocation || item.beanWareHouse === infoData.materialLocation) {
                        this.batchList = item.detailsList;
                    }
                });
                Data = {
                    ...infoData
                }
            }

            this.dataForm = {
                id: Data.id,
                materialLocation: Data.materialLocation,
                batch: Data.batch,
                material: Data.materialName + Data.materialCode,
                materialCode: Data.materialCode,
                materialName: Data.materialName,
                materialLink: Data.materialCode ? Data.materialName + Data.materialCode : '',
                materialType: 'BEAN',
                amount: Data.amount,
                supplier: Data.supplier,
                stockAmount: Data.stockAmount || Data.currentAmount,
                orderNo: Data.orderNo,
                kojiOrderNo: Data.kojiHouseNo,
                smallBeanAmount: Data.smallBeanAmount,
                unit: 'KG',
                remark: Data.remark,
                changer: getUserNameNumber(),
                changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
            }
        }

        batchChange() {
            this.batchList.map(item => {
                if (item.batch === this.dataForm.batch) {
                    this.dataForm.materialLink = item.materialName + item.materialCode;
                    this.dataForm.stockAmount = item.stockAmount;
                    this.dataForm.supplier = item.supplier;
                }
            })
        }

        // 提交
        dataFormSubmit() {
            this.$refs.dataForm.validate(valid => {
                if (valid) {
                    if (this.type === 'add') {
                        KOJI_API.KOJI_MATERIAL_GET_ADD_QUERY_API({
                            insertDto: this.dataForm
                        }).then(() => {
                            this.visible = false;
                            this.$emit('success', this.dataForm)
                        })
                    } else {
                        KOJI_API.KOJI_MATERIAL_GET_EDIT_QUERY_API({
                            updateDto: this.dataForm
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
    }
    interface MaterialObj {
        matnr?: string;
        materialName?: string;
        erfme?: string;
    }
    interface DataObj {
        workShop?: string;
        id?: string;
        materialLocation?: string;
        batch?: string;
        consumeType?: string;
        supplier?: string;
        potOrderId?: string;
        orderNo?: string;
        fermentPotNo?: string;
        materialCode?: string;
        materialType?: string;
        materialName?: string;
        material?: string;
        materialLink?: string;
        consumeUnit?: string;
        consumeAmount?: string;
        amount?: string|number;
        stockAmount?: string|number;
        consumeBatch?: string;
        smallBeanAmount?: string;
        unit?: string;
        remark?: string;
        changer?: string;
        changed?: string;
        beanLocation?: string;
        currentAmount?: string;
        detailsList: object[];
        beanWareHouse: string;
    }

    interface DataForm {
        materialCode?: string;
        materialType?: string;
        materialName?: string;
        material?: string;
        materialLink?: string;
        consumeUnit?: string;
        consumeAmount?: string;
        amount?: string|number;
        stockAmount?: string|number;
        consumeBatch?: string;
        smallBeanAmount?: string;
        unit?: string;
        remark?: string;
        changer?: string;
        changed?: string;
        beanLocation?: string;
        currentAmount?: string;
        detailsList: object[];
        beanWareHouse: string;
    }
</script>
