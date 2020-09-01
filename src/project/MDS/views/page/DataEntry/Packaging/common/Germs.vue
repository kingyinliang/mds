<template>
    <div>
        <mds-card :title="'待杀菌数'" :name="'readyTimes'" class="header_main" style="padding: 0;">
            <template slot="titleBtn">
                <div style="float: right;">
                    <el-button type="primary" size="small" :disabled="!isRedact" style="float: right;" @click="AddGermsDate(GermsDate)">
                        新增
                    </el-button>
                </div>
            </template>
            <el-table ref="table1" class="newTable" header-row-class-name="tableHead" :data="GermsDate" :row-class-name="RowDelFlag" border tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;">
                <el-table-column type="index" width="55" label="序号" fixed />
                <el-table-column label="白/中/夜班">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.classType" placeholder="请选择" :disabled="!isRedact" size="small">
                            <el-option v-for="(iteam, index) in productShift" :key="index" :label="iteam.value" :value="iteam.code" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="清洗冲顶">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.washing" :disabled="!isRedact" placeholder="手工录入" size="small" type="number" min="0" />
                    </template>
                </el-table-column>
                <el-table-column label="换产冲顶">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.changeProduct" :disabled="!isRedact" placeholder="手工录入" size="small" type="number" min="0" />
                    </template>
                </el-table-column>
                <el-table-column label="开机冲顶">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.bootHeader" :disabled="!isRedact" placeholder="手工录入" size="small" type="number" min="0" />
                    </template>
                </el-table-column>
                <el-table-column label="包材不良">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.badMaterial" :disabled="!isRedact" placeholder="手工录入" size="small" type="number" />
                    </template>
                </el-table-column>
                <el-table-column label="制程不良" width="120">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.badProduct" :disabled="!isRedact" placeholder="手工录入" size="small" type="number" min="0" />
                    </template>
                </el-table-column>
                <el-table-column label="半成品物料不合格" width="140">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.badSemi" :disabled="!isRedact" placeholder="手工录入" size="small" type="number" min="0" />
                    </template>
                </el-table-column>
                <el-table-column label="设备残留" width="120">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.deviceLoss" :disabled="!isRedact" placeholder="手工录入" size="small" type="number" min="0" />
                    </template>
                </el-table-column>
                <el-table-column label="备注" width="120">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.remark" :disabled="!isRedact" placeholder="手工录入" size="small" />
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="70">
                    <template slot-scope="scope">
                        <el-button class="delBtn" type="text" icon="el-icon-delete" size="small" :disabled="!isRedact" @click="dellistbomS(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div>
                <p style=" font-size: 14px; line-height: 52px;">
                    待杀菌数量（L）：{{ GermsNum }}
                </p>
            </div>
        </mds-card>
    </div>
</template>

<script>
import { PACKAGING_API, SYSTEMSETUP_API } from '@/api/api';
export default {
    name: 'Germs',
    components: {},
    props: {
        isRedact: {
            type: Boolean
        }
    },
    data() {
        return {
            GermsDate: []
        };
    },
    computed: {
        GermsNum: function() {
            let num = 0;
            this.GermsDate.forEach(item => {
                num = num + (item.delFlag === '0' ? item.washing * 1000 + item.changeProduct * 1000 + item.bootHeader * 1000 + item.badMaterial * 1000 + item.badProduct * 1000 + item.badSemi * 1000 + item.deviceLoss * 1000 : 0);
            });
            return num / 1000;
        }
    },
    mounted() {
        // this.GetProductShift()
    },
    methods: {
        // 修改待杀菌数量
        UpdateGerms(id, str, resolve) {
            if (this.GermsDate.length > 0) {
                this.GermsDate.forEach(item => {
                    item.orderId = id;
                });
                this.$http(`${PACKAGING_API.PKGGERMSUPDATE_API}`, 'POST', this.GermsDate).then(({ data }) => {
                    if (data.code !== 0) {
                        this.$notify.error({
                            title: '错误',
                            message: '修改待杀菌数量' + data.msg
                        });
                    }
                    if (resolve) {
                        resolve('resolve');
                    }
                });
            } else if (resolve) {
                    resolve('resolve');
                }
        },
        // 获取包装车间待杀菌数量列表
        /* eslint-disable @typescript-eslint/camelcase */
        GetpkgGerms(id) {
            this.$http(`${PACKAGING_API.PKGGERMSLIST_API}`, 'POST', {
                order_id: id
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.GermsDate = data.listForm;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        /* eslint-enable @typescript-eslint/camelcase */
        // 获取生产班次
        GetProductShift() {
            this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {
                type: 'product_shift'
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.productShift = data.dicList;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 删除增待杀菌
        dellistbomS(row) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                row.delFlag = '1';
            }).catch(() => {
                // this.$infoToast('已取消删除');
            });
        },
        // 新增待杀菌
        AddGermsDate(form) {
            form.push({
                id: '',
                washing: 0,
                changeProduct: 0,
                bootHeader: 0,
                badMaterial: 0,
                badProduct: 0,
                badSemi: 0,
                deviceLoss: 0,
                delFlag: '0'
            });
        },
        //  RowDelFlag
        RowDelFlag({ row }) {
            if (row.delFlag === '1') {
                return 'rowDel';
            }
                return '';

        }
    }
};
</script>

<style scoped></style>
