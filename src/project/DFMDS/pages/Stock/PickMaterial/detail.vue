<!-- 包材领料详情 -->
<template>
    <div class="header_main">
        <data-entry
            ref="dataEntry"
            type="entry"
            :header-base="headerBase"
            :form-header="formHeader"
            :order-status="formHeader.orderStatus"
            :redact-box-show="true"
            :redact-box-status="true"
            :show-submit="false"
            :saved-rules="savedRules"
            :saved-datas="savedDatas"
        >
            <template slot="contentBox" slot-scope="{ isRedact }">
                <mds-card title="包材领用" :pack-up="false">
                    <template>
                        <el-table :key="Math.random()" :data="tableData" class="newTable" header-row-class-name="tableHead">
                            <el-table-column type="index" label="序号" fixed="left" />
                            <el-table-column label="领用物料" prop="aaaaaaaaaaaa" />
                            <el-table-column label="单位" prop="aaaaaaaaaaaa" />
                            <el-table-column label="需求数量" prop="aaaaaaaaaaaa" />
                            <el-table-column label="当前库存" prop="aaaaaaaaaaaa" />
                            <el-table-column>
                                <template slot-scope="scope">
                                    <el-button type="text" size="small" :disabled="!isRedact" @click="split(scope.row)">
                                        拆分
                                    </el-button>
                                </template>
                            </el-table-column>
                            <el-table-column label="领料类型" prop="aaaaaaaaaaaa" width="140px">
                                <template slot-scope="scope">
                                    <el-select v-model="scope.row.type" size="small" :disabled="!isRedact">
                                        <el-option label="正常领料" value="1" />
                                        <el-option label="补料" value="2" />
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column label="订单领料量" prop="aaaaaaaaaaaa" width="140px">
                                <template slot-scope="scope">
                                    <!-- <el-input v-model="scope.row.amount" size="small" :disabled="!isRedact" @input="v => verifyHandler(v, scope.row)" @blur="verifyBlurHandler(scope.row)" /> -->
                                    <el-input v-model="scope.row.amount" size="small" type="number" :disabled="!isRedact" />
                                </template>
                            </el-table-column>
                            <el-table-column label="物料批次" prop="batch" width="140px">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.batch" :maxlength="10" size="small" :disabled="!isRedact" />
                                </template>
                            </el-table-column>
                            <el-table-column label="模具号" prop="aaaaaaaaaaaa" />
                            <el-table-column label="厂家" prop="aaaaaaaaaaaa" />
                            <el-table-column label="备注" prop="remark" width="160px">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.remark" size="small" :disabled="!isRedact" />
                                </template>
                            </el-table-column>
                            <el-table-column label="操作人" prop="aaaaaaaaaaaa" />
                            <el-table-column label="操作时间" prop="aaaaaaaaaaaa" />
                            <el-table-column label="操作" prop="aaaaaaaaaaaa" fixed="right">
                                <template slot-scope="scope">
                                    <el-button type="text" :style="{ color: isRedact ? 'red' : '#ccc' }" size="small" :disabled="!isRedact" @click="remove(scope.row)">
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

    @Component({
        name: 'PickMaterialDetail'
    })
    export default class PickMaterialDetail extends Vue {
        $refs: {
            dataEntry: HTMLFormElement;
        }

        tableData = [
            { type: '1', amount: 0 }
        ]

        headerBase = [
            {
                type: 'p',
                icon: 'factory-shengchanchejian',
                label: '生产车间',
                value: 'workShopName'
            },
            {
                type: 'p',
                icon: 'factory-shengchanchejian',
                label: '生产产线',
                value: 'workShopName'
            },
            {
                type: 'tooltip',
                icon: 'factory-pinleiguanli',
                label: '生产物料',
                value: ['materialName', 'materialCode']
            },
            {
                type: 'p',
                icon: 'factory-bianhao',
                label: '生产订单',
                value: 'orderNo'
            },
            {
                type: 'p',
                icon: 'factory--meirijihuachanliangpeizhi',
                label: '订单产量',
                value: ['planOutput', 'outputUnitName']
            },
            {
                type: 'p',
                icon: 'factory-riqi1',
                label: '订单日期',
                value: 'orderStartDate'
            },
            {
                type: 'p',
                icon: 'factory-riqi1',
                label: '生产日期',
                value: 'orderStartDate'
            }
        ];

        formHeader = {
            orderStatus: 'N'
        }

        // // 只能是整数或小数
        // verifyHandler(v: string, row) {
        //     if (v === '0') {
        //         return
        //     }
        //     if (v === '00') {
        //         row.amount = '0'
        //         return
        //     }
        //     const reg = /(\d+\.\d+)|(\d+\.)|([1-9]+)/g
        //     if (v.match(reg)) {
        //         row.amount = v.match(reg)![0]
        //         return
        //     }
        //     if (!reg.test(v)) {
        //         row.amount = ''
        //     }
        // }

        verifyBlurHandler(row) {
            if (/\.$/.test(row.amount)) {
                row.amount = row.amount.split('.')[0]
            }
        }

        split(row) {
            console.log(row)
        }

        remove(row) {
            console.log(row)
        }

        ruleSave() {
            console.log(this.tableData)
            for (const item of this.tableData) {
                if (!item.type || !item.amount) {
                    this.$warningToast('请填写必填栏位');
                    return false;
                }
            }
            return true;
        }

        // {redact-box} 提交需跑的验证 function
        savedRules(): Function[] {
            return [this.ruleSave];
        }

        savedDatas() {
            return new Promise((resolve) => {
                resolve(1)
            })
        }
    }
</script>

<style lang="scss" scoped>
</style>
