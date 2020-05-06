<template>
    <el-dialog class="sapdetail" title="物料详情" :close-on-click-modal="false" :visible.sync="isDialogShow" width="55%">
        <el-form :inline="true" :model="dataForm" size="small" label-width="140px">
            <h4 class="sapdetail-title">
                基础信息：
            </h4>
            <div class="sapdetail-dataFormBox">
                <el-form-item label="SAP 编码：">
                    {{ dataForm.sapCode }}
                </el-form-item>
                <el-form-item label="物料描述：">
                    {{ dataForm.materialItemName }}
                </el-form-item>
                <el-form-item label="物料类型：">
                    {{ dataForm.materialItemType }}
                </el-form-item>
                <el-form-item label="基本单位：">
                    {{ dataForm.materialProductUnit }}
                </el-form-item>
                <el-form-item label="物料组：">
                    {{ dataForm.materialGroup }}
                </el-form-item>
                <el-form-item label="跨公司冻结状态：">
                    {{ dataForm.crossLockStatus }}
                </el-form-item>
            </div>
            <h4 class="sapdetail-title">
                生产信息：
            </h4>
            <div class="sapdetail-dataFormBox">
                <el-form-item label="生产单位：">
                    {{ dataForm.materialProductUnit }}
                </el-form-item>
                <el-form-item label="换算比例：">
                    {{ dataForm.ratio }}
                </el-form-item>
                <el-form-item label="工厂：">
                    {{ dataForm.factory }}
                </el-form-item>
                <el-form-item label="工厂冻结状态：">
                    {{ dataForm.factoryLockStatus }}
                </el-form-item>
            </div>
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

<style lang="scss" scoped>
    .sapdetail {
        &-title {
            margin-bottom: 10px;
            padding-bottom: 5px;
            font-weight: 800;
            font-size: 0.9rem;
            border-bottom: 1px solid #ddd;
        }
        .sapdetail-dataFormBox {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
        }
        .el-form-item {
            display: flex;
            flex-direction: row;
            flex-wrap: no-wrap;
            width: 47%;
        }
        .el-form-item--small.el-form-item {
            margin-bottom: 10px;
        }
        .el-form-item__content {
            color: #999;
        }
    }
</style>
