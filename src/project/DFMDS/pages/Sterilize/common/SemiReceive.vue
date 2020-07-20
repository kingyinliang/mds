<template>
    <div>
        <mds-card title="领用列表">
            <div class="semi">
                <div class="semi__pot_box">
                    <div class="semi__pot_box__main">
                        <img src="~common/img/ferPot.png" alt="" style="width: 65px; height: 134px;">
                        <el-button type="primary" size="small" :disabled="!isRedact" @click="semiCopy">
                            复制
                        </el-button>
                        <el-button type="primary" size="small" :disabled="!isRedact" @click="receive">
                            领用
                        </el-button>
                    </div>
                </div>
                <el-table header-row-class-name="tableHead" class="newTable semi__pot_table" :data="semiTable" :row-class-name="rowDelFlag" :height="semiTable.length>4? '' : '196'" border tooltip-effect="dark">
                    <el-table-column type="index" label="序号" width="50px" fixed />
                    <el-table-column prop="stePotNo" label="生产锅号" min-width="100" :show-overflow-tooltip="true" />
                    <el-table-column prop="aiShelves" label="发酵罐领用" min-width="100" :show-overflow-tooltip="true" />
                    <el-table-column prop="fermentPotNo" label="发酵罐号" min-width="100" :show-overflow-tooltip="true" />
                    <el-table-column prop="aiShelves" label="领用物料" min-width="120" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            {{ scope.row.materialCode }}
                            {{ scope.row.materialName }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="consumeUnit" label="单位" width="70" :show-overflow-tooltip="true" />
                    <el-table-column prop="consumeAmount" label="领用数量" min-width="100" :show-overflow-tooltip="true" />
                    <el-table-column prop="consumeBatch" label="领用批次" min-width="100" :show-overflow-tooltip="true" />
                    <el-table-column prop="fermentStorage" label="发酵罐库存" min-width="100" :show-overflow-tooltip="true" />
                    <el-table-column label="操作人" prop="changer" width="140" />
                    <el-table-column label="操作时间" prop="changed" width="180" />
                    <el-table-column width="70" label="操作" fixed="right">
                        <template slot-scope="scope">
                            <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!isRedact" @click="removeDataRow(scope.row)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </mds-card>
        <audit-log :table-data="semiAudit" :verify-man="'verifyMan'" :verify-date="'verifyDate'" :status="true" />
        <semi-receive-dialog v-if="visible" ref="SemiReceiveDialog" @success="dataPush" />
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
    import { STE_API } from 'common/api/api';
    import SemiReceiveDialog from './SemiReceiveDialog.vue'

    @Component({
        components: {
            SemiReceiveDialog
        }
    })
    export default class SemiReceive extends Vue {
        @Prop({ default: false }) isRedact: boolean;

        $refs: {SemiReceiveDialog: HTMLFormElement}

        semiAudit = [];
        semiTable: SemiObj[] = [];
        visible = false;

        init() {
            STE_API.STE_SEMI_LIST_API({
                orderNo: this.$store.state.sterilize.SemiReceive.orderNoMap.orderNo,
                potOrderNo: this.$store.state.sterilize.SemiReceive.potOrderMap.potOrderNo
            }).then(({ data }) => {
                this.semiTable = data.data
            })
        }

        semiCopy() {
            STE_API.STE_SEMI_COPY_API({})
        }

        receive() {
            this.visible = true;
            this.$nextTick(() => {
                this.$refs.SemiReceiveDialog.init()
            });
        }

        dataPush(data: SemiObj) {
            this.visible = false;
            this.semiTable.push(data);
        }

        removeDataRow(row) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                row.delFlag = 1;
            });
        }

        rowDelFlag({ row }) {
            if (row.delFlag === 1) {
                return 'rowDel';
            }
            return '';
        }
    }
    interface SemiObj {
        factoryName?: string;
        potNo?: string;
        potOrder?: string;
    }
</script>

<style lang="scss" scoped>
    .semi {
        display: flex;
        &__pot_box {
            min-width: 150px;
            max-width: 250px;
            height: 196px;
            margin-right: 5px;
            padding-bottom: 10px;
            background: #f5f5f5;
            border-radius: 8px;
            &__main {
                width: 122px;
                margin: auto;
                img {
                    display: block;
                    margin: 10px auto;
                }
            }
        }
        &___table {
            display: flex;
            flex: 1;
        }
    }
</style>
