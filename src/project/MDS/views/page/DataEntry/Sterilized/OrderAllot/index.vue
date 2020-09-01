<template>
    <div class="header_main">
        <el-card class="searchCards searchCard">
            <el-row>
                <el-col>
                    <el-form :model="formHeader" :inline="true" size="small" label-width="70px" class="multi_row">
                        <el-form-item label="生产工厂：">
                            <el-select v-model="formHeader.factory" placeholder="请选择" class="width180px">
                                <el-option value="">
                                    请选择
                                </el-option>
                                <el-option v-for="(item, index) in factory" :key="index" :label="item.deptName" :value="item.deptId" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="生产车间：">
                            <el-select v-model="formHeader.workShop" palceholder="请选择" class="width180px">
                                <el-option value="">
                                    请选择
                                </el-option>
                                <el-option v-for="(item, index) in workshop" :key="index" :value="item.deptId" :label="item.deptName" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="订单号：">
                            <el-input v-model="formHeader.orderNo" />
                        </el-form-item>
                        <el-form-item label="订单状态：">
                            <el-select v-model="formHeader.orderStatus" placeholder="请选择" style="width: 160px;">
                                <el-option label="请选择" value="" />
                                <el-option label="未录入" value="未录入" />
                                <el-option label="已同步" value="已同步" />
                                <el-option label="已保存" value="saved" />
                                <el-option label="已提交" value="submit" />
                                <el-option label="审核通过" value="checked" />
                                <el-option label="审核不通过" value="noPass" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="生产日期：">
                            <el-date-picker v-model="formHeader.productDate" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="date" placeholder="请选择" style="width: 180px;" />
                        </el-form-item>
                        <el-form-item class="floatr">
                            <template>
                                <el-button v-if="isAuth('ste:allot:list')" type="primary" size="small" @click="GetList(true)">
                                    查询
                                </el-button>
                                <!-- <el-button v-if="isAuth('ste:allot:update')" type="primary" size="small" @click="isRedact = !isRedact">
                                    {{ isRedact === false ? '编辑' : '取消' }}
                                </el-button> -->
                            </template>
                            <!-- <template v-if="isRedact">
                                <el-button type="primary" size="small" @click="SaveForm()">
                                    保存
                                </el-button> -->
                            <!-- <el-button type="primary" size="small" @click="SaveForm()">提交</el-button> -->
                            <!-- </template> -->
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <!-- <div class="toggleSearchBottom">
                <em class="el-icon-caret-top" />
            </div> -->
        </el-card>
        <mds-card title="订单分配" name="dataList" :pack-up="false" style="margin-top: 10px;">
            <el-table :data="dataList" :span-method="objectSpanMethod" class="newTable" border header-row-class-name="tableHead" style="margin-top: 10px;" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" :selectable="CheckBoxInit" fixed="left" />
                <el-table-column label="订单状态" min-width="100" prop="orderStatus" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ scope.row.orderStatus === 'saved' ? '已保存' : scope.row.orderStatus === 'submit' ? '已提交' : scope.row.orderStatus === 'checked' ? '审核通过' : scope.row.orderStatus === 'noPass' ? '审核不通过' : scope.row.orderStatus }}
                    </template>
                </el-table-column>
                <el-table-column label="订单号" min-width="120" prop="orderNo" />
                <el-table-column label="品项" :show-overflow-tooltip="true" min-width="220">
                    <template slot-scope="scope">
                        {{ scope.row.materialCode }} {{ scope.row.materialName }}
                    </template>
                </el-table-column>
                <el-table-column label="数量" min-width="100" prop="planOutput" />
                <el-table-column label="单位" min-width="50" prop="outputUnit" />
                <el-table-column label="订单开始日期" min-width="110" prop="startDate" />
                <el-table-column label="订单结束日期" min-width="110" prop="commitDate" />
                <el-table-column label="调配/分配单号" min-width="130" prop="allocateNo" />
                <el-table-column label="调配罐号" min-width="120" prop="holderName" />
                <el-table-column label="BL原汁量" min-width="100" prop="amount" />
                <el-table-column min-width="170" prop="productDate">
                    <template slot="header">
                        <em class="reqI">*</em>
                        <span>生产日期</span>
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.productDate" value-format="yyyy-MM-dd" format="yyyy-MM-dd" :disabled="ReturnStatus(scope.row)" size="small" type="date" placeholder="请选择" style="width: 140px;" />
                    </template>
                </el-table-column>
                <el-table-column min-width="150" label="锅号">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.panId" :disabled="ReturnStatus(scope.row)" size="small" placeholder="请选择">
                            <el-option value="">
                                请选择
                            </el-option>
                            <el-option v-for="(item, index) of holderList" :key="index" :value="item.holderId" :label="item.holderName" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="备注" min-width="120" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.remark" :disabled="ReturnStatus(scope.row)" size="small" />
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination :current-page="formHeader.currPage" :page-sizes="[10, 20, 50]" :page-size="formHeader.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="formHeader.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </mds-card>
        <redact-box>
            <template slot="button">
                <el-button v-if="isAuth('ste:allot:update')" type="primary" size="small" @click="isRedact = !isRedact">
                    {{ isRedact === false ? '编辑' : '取消' }}
                </el-button>
                <template v-if="isRedact">
                    <el-button type="primary" size="small" @click="SaveForm()">
                        保存
                    </el-button>
                </template>
            </template>
        </redact-box>
    </div>
</template>

<script>
    import { BASICDATA_API, STERILIZED_API } from '@/api/api';
    import { headanimation } from '@/net/validate';
    export default {
        name: 'OrderAllot',
        data() {
            return {
                isRedact: false,
                formHeader: {
                    factory: '',
                    workShop: '',
                    orderNo: '',
                    orderStatus: '',
                    productDate: '',
                    currPage: 1,
                    pageSize: 10,
                    totalCount: 0
                },
                factory: [],
                workshop: [],
                holderList: [],
                dataList: [],
                multipleSelection: [],
                spanOneArr: []
            };
        },
        watch: {
            'formHeader.factory'(n) {
                this.Getdeptbyid(n);
            },
            'formHeader.workShop'(n) {
                this.getHolderList(n);
            }
        },
        mounted() {
            headanimation(this.$);
            this.Getdeptcode();
        },
        methods: {
            merge(tableData) {
                this.spanOneArr = [];
                let concatOne = 0;
                tableData.forEach((item, index) => {
                    if (index === 0) {
                        this.spanOneArr.push(1);
                    } else if (item.allocateNo === '') {
                        this.spanOneArr.push(1);
                        concatOne = index;
                    } else if (item.allocateNo === tableData[index - 1].allocateNo) {
                        // 第一列需合并相同内容的判断条件
                        this.spanOneArr[concatOne] += 1;
                        this.spanOneArr.push(0);
                    } else {
                        this.spanOneArr.push(1);
                        concatOne = index;
                    }
                });
            },
            /* eslint-disable @typescript-eslint/no-unused-vars*/
            objectSpanMethod({ row, rowIndex, column, columnIndex }) {
                if (columnIndex === 8 || columnIndex === 9) {
                    return {
                        rowspan: this.spanOneArr[rowIndex],
                        colspan: this.spanOneArr[rowIndex] > 0 ? 1 : 0
                    };
                }
            },
            /* eslint-enable @typescript-eslint/no-unused-vars*/
            // 获取工厂
            Getdeptcode() {
                this.workshop = [];
                this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST').then(({ data }) => {
                    if (data.code === 0) {
                        this.factory = data.typeList;
                        this.formHeader.factory = data.typeList[0].deptId;
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            },
            // 获取车间
            Getdeptbyid(id) {
                this.formHeader.workShop = '';
                if (id) {
                    this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', { deptId: id, deptName: '杀菌' }).then(({ data }) => {
                        if (data.code === 0) {
                            this.workshop = data.typeList;
                            if (data.typeList.length > 0) {
                                this.formHeader.workShop = data.typeList[0].deptId;
                            } else {
                                this.formHeader.workShop = '';
                            }
                        } else {
                            this.$errorToast(data.msg);
                        }
                    });
                } else {
                    this.workshop = [];
                }
            },
            // 锅
            /*eslint-disable @typescript-eslint/camelcase */
            getHolderList() {
                const params = {
                    type: 'holder_type',
                    holder_type: '014',
                    currPage: 1,
                    pageSize: 9999,
                    factory: this.formHeader.factory,
                    dept_id: this.formHeader.workShop
                };
                this.$http(`${BASICDATA_API.CONTAINERLIST_API}`, 'POST', params)
                    .then(({ data }) => {
                        if (data.code === 0) {
                            this.holderList = data.page.list;
                        } else {
                            this.$errorToast(data.msg);
                        }
                    })
                    .catch(error => {
                        console.log('catch data::', error);
                    });
            },
            /*eslint-enable @typescript-eslint/camelcase */
            GetList(st) {
                if (this.formHeader.factory === '') {
                    this.$warningToast('请选择工厂');
                    return false;
                }
                if (this.formHeader.workShop === '') {
                    this.$warningToast('请选择车间');
                    return false;
                }
                if (st) {
                    this.formHeader.currPage = 1;
                }
                this.$http(`${STERILIZED_API.ORDERALLOTLIST}`, 'POST', this.formHeader).then(({ data }) => {
                    if (data.code === 0) {
                        this.dataList = data.list.list;
                        this.formHeader.totalCount = data.list.totalCount;
                        this.merge(this.dataList);
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 复选框初始状态
            CheckBoxInit(row) {
                if (this.isRedact === false || row.orderStatus === 'submit' || row.orderStatus === 'checked') {
                    return 0;
                }
                return 1;
            },
            ReturnStatus(row) {
                return this.isRedact === false || row.orderStatus === 'submit' || row.orderStatus === 'checked';
            },
            handleSizeChange(val) {
                this.formHeader.pageSize = val;
                this.GetList();
            },
            handleCurrentChange(val) {
                this.formHeader.currPage = val;
                this.GetList();
            },
            // 保存
            SaveForm() {
                if (this.multipleSelection.length === 0) {
                    this.$warningToast('请勾选数据');
                    return false;
                }
                for (const item of this.multipleSelection) {
                    if (!item.productDate) {
                        this.$warningToast('请填写生产日期');
                        return false;
                    }
                }
                this.multipleSelection.map(item => {
                    if (item.orderStatus === '已同步') {
                        item.orderStatus = '未录入';
                    }
                });
                this.$http(`${STERILIZED_API.ORDERALLOTSAVE}`, 'POST', this.multipleSelection).then(({ data }) => {
                    if (data.code === 0) {
                        this.$successToast('保存成功');
                        this.isRedact = false;
                        this.GetList();
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            }
        }
    };
</script>

<style></style>
