<template>
    <el-dialog class="sapdetail" title="物料详情" :close-on-click-modal="false" :visible="isDialogShow">
        <el-form :inline="true" :model="dataForm" size="small" label-width="124px">
            <div class="sapdetail-title">
                <p>基础信息：</p>
            </div>
            <el-form-item label="SAP 编码：">
                <span>{{ dataForm.sapCode }}</span>
            </el-form-item>
            <el-form-item label="物料描述：">
                <span>{{ dataForm.materialItemName }}</span>
            </el-form-item>
            <el-form-item label="物料类型：">
                <span>{{ dataForm.materialItemType }}</span>
            </el-form-item>
            <el-form-item label="基本单位：">
                <span>{{ dataForm.materialProductUnit }}</span>
            </el-form-item>
            <el-form-item label="物料组：">
                <span>{{ dataForm.materialGroup }}</span>
            </el-form-item>
            <el-form-item label="跨公司冻结状态：">
                <span>{{ dataForm.crossLockStatus }}</span>
            </el-form-item>
            <div class="sapdetail-title">
                <p>生产信息：</p>
            </div>
            <el-form-item label="生产单位：">
                <span>{{ dataForm.materialProductUnit }}</span>
            </el-form-item>
            <el-form-item label="换算比例：">
                <span>{{ dataForm.ratio }}</span>
            </el-form-item>
            <div class="sapdetail-title">
                <p>生产信息：</p>
            </div>
            <el-form-item label="工厂：">
                <span>{{ dataForm.factory }}</span>
            </el-form-item>
            <el-form-item label="工厂冻结状态：">
                <span>{{ dataForm.factoryLockStatus }}</span>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import { COMMON_API } from 'common/api/api';
export default {
    name: 'SuppliesDetail',
    components: {},
    data() {
        return {
            isDialogShow: false,
            dataForm: {}
        };
    },
    computed: {},
    methods: {
        init(id) {
            COMMON_API.METERIAL_ITEM_QUERY_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                materialId: id
            })
                .then(({ data }) => {
                    if (data.code === 200) {
                        this.dataForm = data.data;
                    } else {
                        this.$errorTost(data.msg);
                    }
                })
                .then(() => {
                    this.isDialogShow = true;
                });
        }
    }
};
</script>

<style lang="scss" scoped></style>
<style lang="scss">
.sapdetail {
    .el-form--inline .el-form-item__content {
        min-width: 155px;
    }

    &-title {
        margin-bottom: 10px;
        border-top: 1px solid #bbb;

        p {
            width: 100px;
            line-height: 40px;
            text-align: right;
        }
    }
}
</style>
