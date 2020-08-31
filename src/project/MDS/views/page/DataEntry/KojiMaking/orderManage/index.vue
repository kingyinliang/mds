<template>
    <el-row>
        <el-col>
            <div class="header_main">
                <el-card class="searchCard">
                    <el-row type="flex">
                        <el-col>
                            <el-form :model="params" size="small" :inline="true" label-position="right" label-width="70px" class="multi_row">
                                <el-form-item label="生产工厂：">
                                    <el-select v-model="params.factoryId" size="small" class="selectwpx" style="width: 150px;" @change="changeOptions('factory')">
                                        <el-option label="请选择" value="" />
                                        <el-option v-for="sole in factoryList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="生产车间：">
                                    <el-select v-model="params.workshopId" size="small" class="selectwpx" style="width: 150px;" @change="changeOptions('workshop')">
                                        <el-option label="请选择" value="" />
                                        <el-option v-for="sole in workshopList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="发酵罐号：">
                                    <el-select v-model="params.holderId" size="small" filterable style="width: 150px;">
                                        <el-option label="请选择" value="" />
                                        <el-option v-for="sole in holderSemList" :key="sole.holderId" :label="sole.holderName" :value="sole.holderId" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="订单日期：" class="selectwpx">
                                    <el-date-picker v-model="params.orderDate" size="small" type="date" value-format="yyyy-MM-dd" style="width: 150px;" />
                                </el-form-item>
                                <el-form-item label="订单号：">
                                    <el-input v-model.trim="params.orderNo" size="small" type="text" placeholder="请输入" style="width: 150px;" />
                                </el-form-item>
                                <el-form-item label="订单状态：">
                                    <el-select v-model="params.orderStatus" size="small" class="selectwpx" style="width: 150px;">
                                        <el-option label="请选择" value="" />
                                        <el-option label="已同步" value="已同步" />
                                        <el-option label="未录入" value="已拆分" />
                                        <el-option label="待审核" value="toBeAudited" />
                                        <el-option label="已保存" value="saved" />
                                        <el-option label="已提交" value="submit" />
                                        <el-option label="不通过" value="noPass" />
                                        <el-option label="通过" value="checked" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item class="floatr">
                                    <el-button v-if="isAuth('sys:order:orderlist')" type="primary" size="small" style="float: right;" @click="getOrderList()">
                                        查询
                                    </el-button>
                                </el-form-item>
                            </el-form>
                        </el-col>
                    </el-row>
                </el-card>
                <el-row v-if="searched" :gutter="5" style="margin-top: 5px;">
                    <el-col :span="12">
                        <el-card style="min-height: 730px;">
                            <div class="box-card-title clearfix">
                                <h3>
                                    <em class="title-icon" />订单管理
                                </h3>
                                <slot name="titleBtn" />
                            </div>
                            <el-row>
                                <el-col>
                                    <el-table header-row-class-name="tableHead" class="newTable" :data="currentOrderList" border tooltip-effect="dark" :row-class-name="rowDelFlag" @row-dblclick="showDetail">
                                        <el-table-column type="index" width="55" label="序号" fixed />
                                        <el-table-column label="订单状态" width="80">
                                            <template slot-scope="scope">
                                                <label
                                                    :style="{
                                                        color: scope.row.orderStatus === '不通过' ? 'red' : scope.row.orderStatus === '通过' ? 'rgb(103, 194, 58)' : '',
                                                    }"
                                                >{{ scope.row.orderStatus }}</label>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="订单日期" width="100">
                                            <template slot-scope="scope">
                                                {{ scope.row.orderDate }}
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="订单号" width="120">
                                            <template slot-scope="scope">
                                                {{ scope.row.orderNo }}
                                            </template>
                                        </el-table-column>
                                        <el-table-column min-width="180" label="品项">
                                            <template slot-scope="scope">
                                                {{ scope.row.materialCode + ' ' + scope.row.materialName }}
                                            </template>
                                        </el-table-column>
                                        <el-table-column width="70" label="数量" show-overflow-tooltip>
                                            <template slot-scope="scope">
                                                {{ scope.row.planOutput }}
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="单位" width="50">
                                            <template slot-scope="scope">
                                                <span>{{ scope.row.outputUnit }}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="备注" min-width="100" show-overflow-tooltip>
                                            <template slot-scope="scope">
                                                <span>{{ scope.row.remark }}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="操作" fixed="right" align="center" width="130">
                                            <template slot-scope="scope">
                                                <el-button
                                                    type="text"
                                                    :disabled="!(scope.row.orderStatus === '不通过' || scope.row.orderStatus === '已同步' || scope.row.orderStatus === '已保存' || scope.row.orderStatus === '待审核' || scope.row.orderStatus === '未录入') || !isAuth('sys:kjmOrderHouse:mySaveOrUpdate')"
                                                    @click="orderSplit(scope.row)"
                                                >
                                                    <em class="iconfont factory-chaifen" />拆分
                                                </el-button>
                                                <el-button
                                                    type="text"
                                                    :disabled="scope.row.orderStatus === '已同步' || scope.row.orderStatus === '未录入' || !isAuth('sys:midInStorage:list')"
                                                    @click="orderCheck(scope.row)"
                                                >
                                                    <em class="iconfont factory-renzhengshenhe_huaban" />审核
                                                </el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-pagination :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                            </el-row>
                        </el-card>
                    </el-col>
                    <el-col v-if="showdetails" :span="12">
                        <el-card style="min-height: 730px;">
                            <el-row style="margin-bottom: 5px;">
                                <el-col :span="12" style=" color: #000; font-weight: 500; font-size: 16px;">
                                    <div class="box-card-title clearfix">
                                        <h3>
                                            <em class="title-icon" :style="{ background: '#FFBF00FF' }" />订单明细
                                        </h3>
                                        <slot name="titleBtn" />
                                    </div>
                                </el-col>
                                <el-col :span="12" class="rowButton">
                                    <el-button type="primary" size="small" style="float: right;" @click="delDetail">
                                        删除
                                    </el-button>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col>
                                    <el-table ref="multipleTable" class="newTable" header-row-class-name="tableHead" :data="orderDetailList" border tooltip-effect="dark" :row-class-name="rowDelFlag" @selection-change="handleChange" @row-dblclick="showModifyDetial">
                                        <el-table-column type="selection" width="50" />
                                        <el-table-column type="index" width="55" label="序号" fixed />
                                        <el-table-column label="曲房状态" width="80">
                                            <template slot-scope="scope">
                                                {{ scope.row.status }}
                                            </template>
                                        </el-table-column>
                                        <el-table-column min-label="订单号" width="120">
                                            <template slot-scope="scope">
                                                {{ scope.row.orderNo }}
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="入罐号" width="120">
                                            <template slot-scope="scope">
                                                {{ scope.row.inPotName }}
                                            </template>
                                        </el-table-column>
                                        <el-table-column min-width="100" label="曲房">
                                            <template slot-scope="scope">
                                                {{ scope.row.houseName }}
                                            </template>
                                        </el-table-column>
                                        <el-table-column min-width="120" label="连续蒸煮">
                                            <template slot-scope="scope">
                                                {{ scope.row.cookingName }}
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="制曲日期" width="100">
                                            <template slot-scope="scope">
                                                <span>{{ scope.row.inKjmDate }}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="生产日期" width="100">
                                            <template slot-scope="scope">
                                                <span>{{ scope.row.productDate }}</span>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </el-col>
                            </el-row>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
            <el-dialog :close-on-click-modal="false" :visible.sync="dialogFormVisible" width="1200px" custom-class="dialog__class">
                <div slot="title" class="title">
                    <span>订单分配</span>
                </div>
                <div class="orderForm">
                    <el-table header-row-class-name="tableHead" class="newTable" :data="splitDetailList" border tooltip-effect="dark" :row-class-name="rowDelFlag">
                        <el-table-column type="index" width="55" label="序号" fixed />
                        <el-table-column label="订单号" width="120">
                            <template slot-scope="scope">
                                {{ scope.row.orderNo }}
                            </template>
                        </el-table-column>
                        <el-table-column label="品项" width="180">
                            <template slot-scope="scope">
                                {{ scope.row.materialCode + ' ' + scope.row.materialName }}
                            </template>
                        </el-table-column>
                        <el-table-column label="订单日期" width="100">
                            <template slot-scope="scope">
                                {{ scope.row.orderDate }}
                            </template>
                        </el-table-column>
                        <el-table-column width="80" label="数量">
                            <template slot-scope="scope">
                                {{ scope.row.planOutput }}
                            </template>
                        </el-table-column>
                        <el-table-column width="60" label="单位">
                            <template slot-scope="scope">
                                {{ scope.row.outputUnit }}
                            </template>
                        </el-table-column>
                        <el-table-column label="备注" width="80" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span>{{ scope.row.remark }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column width="140">
                            <template slot="header">
                                <em class="reqI">*</em>
                                <span>入罐号</span>
                            </template>
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.inPotNo" filterable placeholder="请选择" size="small">
                                    <el-option v-for="(item, index) in potList" :key="index" :label="item.holderName" :value="item.holderId" />
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column width="140">
                            <template slot="header">
                                <em class="reqI">*</em>
                                <span>曲房</span>
                            </template>
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.houseNo" filterable placeholder="请选择" size="small">
                                    <el-option v-for="(item, index) in kjmRoomList" :key="index" :label="item.holderName" :value="item.holderId" />
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column label="连续蒸煮号" width="140">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.cookingNo" filterable placeholder="请选择" size="small">
                                    <el-option value="" label="请选择" />
                                    <el-option v-for="(item, index) in continueList" :key="index" :label="item.holderName" :value="item.holderId" />
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column width="165">
                            <template slot="header">
                                <em class="reqI">*</em>
                                <span>制曲日期</span>
                            </template>
                            <template slot-scope="scope">
                                <el-date-picker v-model="scope.row.inKjmDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期" size="small" style="width: 135px;" />
                            </template>
                        </el-table-column>
                        <el-table-column label="生产日期" width="165">
                            <template slot="header">
                                <em class="reqI">*</em>
                                <span>生产日期</span>
                            </template>
                            <template slot-scope="scope">
                                <el-date-picker v-model="scope.row.productDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期" size="small" style="width: 135px;" />
                            </template>
                        </el-table-column>
                        <el-table-column fixed="right" label="操作" width="60">
                            <template slot-scope="scope">
                                <el-button v-if="scope.row.isFirst" type="primary" icon="el-icon-plus" circle size="small" @click="addRow(scope.row)" />
                                <el-button v-else type="primary" icon="el-icon-minus" circle size="small" @click="delRow(scope.row)" />
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" size="small" style="color: #000; background-color: #fff; border-color: #d9d9d9;" @click="dialogFormVisible = false">
                        取消
                    </el-button>
                    <el-button type="primary" size="small" style=" color: #fff; background-color: #1890ff; border-color: #1890ff;" @click="splitOrder()">
                        保存
                    </el-button>
                </div>
            </el-dialog>
            <el-dialog :close-on-click-modal="false" title="明细修改" :visible.sync="dialogFormVisible2" width="450px">
                <el-form ref="detailForm" :model="detailForm" class="orderForm">
                    <el-form-item label="订单号" :label-width="formLabelWidth">
                        <label>{{ detailForm.orderNo }}</label>
                    </el-form-item>
                    <el-form-item label="入罐号" :label-width="formLabelWidth" required>
                        <el-select v-model="detailForm.inPotNo" placeholder="请选择" @change="changeOptions('inPot')">
                            <el-option v-for="(item, index) in potList" :key="index" :label="item.holderName" :value="item.holderId" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="曲房" :label-width="formLabelWidth" required>
                        <el-select v-model="detailForm.houseNo" placeholder="请选择" @change="changeOptions('house')">
                            <el-option v-for="(item, index) in kjmRoomList" :key="index" :label="item.holderName" :value="item.holderId" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="连续蒸煮" :label-width="formLabelWidth">
                        <el-select v-model="detailForm.cookingNo" placeholder="请选择" @change="changeOptions('cooking')">
                            <el-option value="" label="" />
                            <el-option v-for="(item, index) in continueList" :key="index" :label="item.holderName" :value="item.holderId" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="制曲日期" :label-width="formLabelWidth" required>
                        <el-date-picker v-model="detailForm.inKjmDate" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" />
                    </el-form-item>
                    <el-form-item label="生产日期" :label-width="formLabelWidth" required>
                        <el-date-picker v-model="detailForm.productDate" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" />
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" size="small" style="color: #000; background-color: #fff; border-color: #d9d9d9;" @click="dialogFormVisible2 = false">
                        取消
                    </el-button>
                    <el-button type="primary" size="small" style=" color: #fff; background-color: #1890ff; border-color: #1890ff;" @click="modifyDetial()">
                        保存
                    </el-button>
                </div>
            </el-dialog>
        </el-col>
    </el-row>
</template>

<script lang="ts">
import { BASICDATA_API, KJM_API } from '@/api/api';
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Order } from '../entity/Order';
import { OrderDetail } from '../entity/OrderDetail';
import { Status } from '../entity/Enum';
import { dateFormat } from '@/net/validate';
@Component({
    components: {}
})
export default class Index extends Vue {
    // $refs: {
    //   temporaryWorker: TemporaryWorker,
    //   loanedPersonnel: LoanedPersonnel,
    //   officialWorker: officialWorker
    // }
    // 将common中的参数复制一份到本地
    // NEEDTODO
    /* eslint-disable no-invalid-this */
    params = JSON.parse(JSON.stringify(this.$store.state.common.ZQWorkshop.defaultVal));
    orderList: Order[] = [];
    orderDetailList: OrderDetail[] = [];
    selectedDetailList: OrderDetail[] = [];
    splitDetailList: OrderDetail[] = [];
    detailForm: OrderDetail = new OrderDetail();
    dialogFormVisible = false;
    dialogFormVisible2 = false;
    factoryList = [];
    workshopList = [];
    potList = [];
    kjmRoomList = [];
    continueList = [];
    searched = false;
    showdetails = true;
    formLabelWidth = '120px';
    currPage = 1;
    pageSize = 10;
    holderSemList = [];

    mounted() {
        this.getFactory();
        this.getWorkshop(this.params.factoryId);
        if (this.params.workshopId) {
            this.getSemHolderList(this.params.workshopId, this.params.workshopName);
        }
        // this.retrieveHolders(this.params.workshopId, this.params.workshopName)
    }

    retrieveHolders(workshopId, workshopName) {
        if (workshopId) {
            this.getHolderList(workshopId, workshopName, '入罐');
            this.getHolderList(workshopId, workshopName, '曲房');
            this.getHolderList(workshopId, workshopName, '连续蒸煮');
        }
    }

    changeOptions(flag: string) {
        if (flag === 'factory') {
            const item = this.factoryList.find(ele => ele['deptId'] === this.params.factoryId);
            this.params.factoryName = item ? item['deptName'] : '';
            this.params.workshopId = '';
            this.params.workshopName = '';
            this.getWorkshop(this.params.factoryId);
        } else if (flag === 'workshop') {
            const item = this.workshopList.find(ele => ele['deptId'] === this.params.workshopId);
            this.params.workshopName = item ? item['deptName'] : '';
            this.getSemHolderList(this.params.workshopId, this.params.workshopName);
            // this.retrieveHolders(this.params.workshopId, this.params.workshopName);
        } else if (flag === 'inPot') {
            const item = this.potList.find(ele => ele['holderId'] === this.detailForm.inPotNo);
            this.detailForm.inPotName = item ? item['holderName'] : '';
        } else if (flag === 'house') {
            const item = this.kjmRoomList.find(ele => ele['holderId'] === this.detailForm.houseNo);
            this.detailForm.houseName = item ? item['holderName'] : '';
        } else if (flag === 'cooking') {
            const item = this.continueList.find(ele => ele['holderId'] === this.detailForm.cookingNo);
            this.detailForm.cookingName = item ? item['holderName'] : '';
        }
    }

    // 获取工厂
    getFactory() {
        this.factoryList = [];
        Vue.prototype.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, `POST`, {}, false, false, false).then(res => {
            if (res.data.code === 0) {
                this.factoryList = res.data.typeList;
            } else {
                this.$notify.error({ title: '错误', message: res.data.msg });
            }
        });
    }

    // 根据工厂获车间
    getWorkshop(fid: string) {
        this.workshopList = [];
        if (fid) {
            Vue.prototype.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', { deptId: fid, deptName: '制曲' }, false, false, false).then(res => {
                if (res.data.code === 0) {
                    this.workshopList = res.data.typeList;
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: res.data.msg
                    });
                }
            });
        }
    }

    // 表头发酵罐
    /* eslint-disable @typescript-eslint/camelcase */
    getSemHolderList(workshopId, workshopName) {
        const params = {
            dept_id: workshopId,
            workShopName: workshopName,
            type: 'holder_type',
            holder_type: '001',
            pageSize: 9999,
            currPage: 1
        }
        Vue.prototype.$http(`${BASICDATA_API.CONTAINERLIST_API}`, 'POST', params, false, false, false).then(({ data }) => {
            if (data.code === 0) {
                this.holderSemList = data.page.list;
            } else {
                Vue.prototype.$errorToast(data.msg);
            }
        })
    }

    // 入罐/曲房/蒸煮
    /* eslint-disable @typescript-eslint/camelcase */
    getHolderList(workshopId, workshopName, type) {
        const params = {
            dept_id: workshopId,
            workShopName: workshopName,
            type: 'holder_type',
            holderStatus: type === '入罐' ? '0,1' : null,
            holder_type: type === '入罐' ? '001' : type === '曲房' ? '005' : type === '连续蒸煮' ? '008' : '',
            pageSize: 9999,
            currPage: 1
        };
        if (params.holder_type === '') {
            return;
        }
        Vue.prototype
            .$http(`${BASICDATA_API.CONTAINERLIST_API}`, 'POST', params, false, false, false)
            .then(({ data }) => {
                if (data.code === 0) {
                    if (type === '入罐') {
                        this.potList = data.page.list;
                    } else if (type === '曲房') {
                        this.kjmRoomList = data.page.list;
                    } else if (type === '连续蒸煮') {
                        this.continueList = data.page.list;
                    }
                } else {
                    this.$notify.error({ title: '错误', message: data.msg });
                }
            })
            .catch(error => {
                console.log('catch data::', error);
            });
    }

    /* eslint-enable @typescript-eslint/camelcase */
    setStore(params) {
        this.$store.commit('common/updateZQDefault', params);
    }

    getOrderList() {
        if (this.params.factoryId === '') {
            Vue.prototype.$warningToast('请选择工厂');
            return;
        }
        if (this.params.workshopId === '') {
            Vue.prototype.$warningToast('请选择车间');
            return;
        }
        const item = this.workshopList.find(ele => ele['deptId'] === this.params.workshopId);
        this.params.workshopName = item ? item['deptName'] : '';
        this.retrieveHolders(this.params.workshopId, this.params.workshopName);
        this.currPage = 1;
        // if (this.params.orderDate === null || this.params.orderDate === '') {
        //   this.$message.error('请选择订单日期')
        //   return
        // }
        // 保存选项值到common store
        this.setStore(this.params);
        this.searched = true;
        this.orderDetailList = [];
        this.selectedDetailList = [];
        const params = {
            workShop: this.params.workshopId,
            orderDate: this.params.orderDate,
            orderNo: this.params.orderNo,
            orderStatus: this.params.orderStatus,
            holderId: this.params.holderId
        };
        this.retrieveOrderData(params);
    }

    retrieveOrderData(params) {
        this.orderList = [];
        Vue.prototype
            .$http(`${KJM_API.ORDERLIST_API}`, `POST`, params)
            .then(res => {
                if (res.data.code === 0) {
                    for (const item of res.data.list) {
                        const order = new Order(item.orderId, item.orderNo, item.orderDate, item.orderStatus, item.materialCode, item.materialName, item.planOutput, item.outputUnit, item.remark, item.delFlag);
                        this.orderList.push(order);
                    }
                } else {
                    this.$notify.error({ title: '错误', message: res.data.msg });
                }
            })
            .catch(err => {
                console.log('catch data::', err);
            });
    }

    // 订单拆分
    orderSplit(row) {
        this.dialogFormVisible = true;
        const detail: OrderDetail = new OrderDetail(row.orderId, row.orderNo, row.orderDate, row.orderStatus, row.materialCode, row.materialName, row.planOutput, row.outputUnit, row.remark, row.delFlag);
        // Object.assign(detail, JSON.parse(JSON.stringify(row)))
        detail.isFirst = true;
        detail.inKjmDate = dateFormat(new Date(), 'yyyy-MM-dd');
        detail.productDate = dateFormat(new Date(), 'yyyy-MM-dd');
        this.splitDetailList = [];
        this.splitDetailList.push(detail);
    }

    // 删除
    delRow(row) {
        this.$confirm('是否删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            row.delFlag = '1';
        }).catch(() => {
            // this.$infoToast('已取消删除');
        });
    }

    // 增加
    addRow(row) {
        const detail: OrderDetail = new OrderDetail(
            row.orderId,
            row.orderNo,
            row.orderDate,
            row.orderStatus,
            row.materialCode,
            row.materialName,
            row.planOutput,
            row.outputUnit,
            row.remark,
            row.delFlag,
            row.id,
            row.status,
            row.inPotNo,
            row.inPotName,
            row.houseNo,
            row.houseName,
            row.cookingNo,
            row.cookingName,
            row.inKjmDate,
            row.productDate,
            false
        );
        this.splitDetailList.push(detail);
    }

    // 拆分订单保存
    splitOrder() {
        const params: object[] = [];
        const houseSet: Set<string> = new Set();
        const potSet: Set<string> = new Set();
        for (const item of this.splitDetailList) {
            if (item.delFlag === '0') {
                if (!item.inPotNo || item.inPotNo.length === 0) {
                    Vue.prototype.$warningToast('入罐号不能为空');
                    return;
                }
                if (!item.houseNo || item.houseNo.length === 0) {
                    Vue.prototype.$warningToast('曲房不能为空');
                    return;
                }
                if (!item.inKjmDate || item.inKjmDate.length === 0) {
                    Vue.prototype.$warningToast('制曲日期不能为空');
                    return;
                }
                if (!item.productDate || item.productDate.length === 0) {
                    Vue.prototype.$warningToast('生产日期不能为空');
                    return;
                }
                potSet.add(item.inPotNo);
                if (potSet.size > 1) {
                    Vue.prototype.$warningToast('同一订单不能多个入罐号');
                    return;
                }
                const houseKey = item.houseNo + item.inKjmDate;
                if (houseSet.has(houseKey)) {
                    Vue.prototype.$warningToast('相同制曲日期下，曲房重复');
                    return;
                }
                    houseSet.add(houseKey);

            }
        }
        for (const item of this.splitDetailList) {
            params.push({
                orderId: item.orderId,
                orderNo: item.orderNo,
                status: '',
                inPotNo: item.inPotNo,
                houseNo: item.houseNo,
                cookingNo: item.cookingNo,
                inKjmDate: item.inKjmDate,
                productDate: item.productDate,
                delFlag: item.delFlag
            });
        }
        Vue.prototype
            .$http(`${KJM_API.SPLITORDERDETAILLIST_API}`, `POST`, params)
            .then(res => {
                if (res.data.code === 0) {
                    this.dialogFormVisible = false;
                    this.getOrderList();
                    this.retrieveDetail(this.splitDetailList[0].orderId);
                } else {
                    this.$notify.error({ title: '错误', message: res.data.msg });
                }
            })
            .catch(err => {
                console.log('catch data::', err);
            });
    }

    showDetail(row) {
        this.retrieveDetail(row.orderId);
    }

    retrieveDetail(orderId) {
        this.showdetails = true;
        this.selectedDetailList = [];
        this.orderDetailList = [];
        const params = {
            orderId: orderId,
            currPage: '1',
            pageSize: '9999'
        };
        Vue.prototype
            .$http(`${KJM_API.ORDERDETAILLIST_API}`, `POST`, params)
            .then(res => {
                if (res.data.code === 0) {
                    for (const item of res.data.page.list) {
                        const detail = new OrderDetail();
                        detail.id = item.id;
                        detail.status = item.status;
                        detail.orderId = item.orderId;
                        detail.orderNo = item.orderNo;
                        detail.inPotNo = item.inPotNo;
                        detail.houseNo = item.houseNo;
                        detail.cookingNo = item.cookingNo;
                        detail.inKjmDate = item.inKjmDate;
                        detail.productDate = item.productDate;
                        detail.inPotName = item.inPotName;
                        detail.houseName = item.houseName;
                        detail.cookingName = item.cookingName;
                        this.orderDetailList.push(detail);
                    }
                } else {
                    this.$notify.error({ title: '错误', message: res.data.msg });
                }
            })
            .catch(err => {
                console.log('catch data::', err);
            });
    }

    // 多选
    handleChange(selections) {
        this.selectedDetailList = selections;
    }

    // 删除订单详情
    delDetail() {
        if (!this.isAuth('sys:kjmOrderHouse:mySaveOrUpdate')) {
            Vue.prototype.$warningToast('无权限进行删除操作');
            return;
        }
        if (!this.selectedDetailList || this.selectedDetailList.length === 0) {
            Vue.prototype.$warningToast('请选择删除项');
            return;
        }
        for (const row of this.selectedDetailList) {
            // 提交或者通过的数据不能删除
            if (row.status && (row.status === Status.SUBMIT || row.status === Status.CHECKED)) {
                Vue.prototype.$warningToast(`${row.status}的数据不可删除`);
                return;
            }
        }
        this.$confirm('是否删除所选项?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            // this.selectedDetailList.forEach(item => {
            //   item.delFlag = '1'
            // })
            Vue.prototype
                .$http(`${KJM_API.DELETEORDERDETAILLIST_API}`, `POST`, this.selectedDetailList)
                .then(res => {
                    if (res.data.code === 0) {
                        this.retrieveDetail(this.selectedDetailList[0].orderId);
                    } else {
                        this.$notify.error({
                            title: '错误',
                            message: res.data.msg
                        });
                    }
                })
                .catch(err => {
                    console.log('catch data::', err);
                });
        }).catch(() => {
            // this.$infoToast('已取消删除');
        });
    }

    // 订单详情修改
    showModifyDetial(row: OrderDetail) {
        if (!this.isAuth('sys:kjmOrderHouse:mySaveOrUpdate')) {
            Vue.prototype.$warningToast('无权限进行修改操作');
            return;
        }
        if (row.status && (row.status === Status.SUBMIT || row.status === Status.CHECKED)) {
            Vue.prototype.$warningToast(`${row.status}的数据不可修改`);
            return;
        }
        this.detailForm = row.clone();
        this.dialogFormVisible2 = true;
    }

    modifyDetial() {
        if (!this.detailForm.inPotNo || this.detailForm.inPotNo.length === 0) {
            Vue.prototype.$warningToast('入罐号不能为空');
            return false;
        }
        if (!this.detailForm.houseNo || this.detailForm.houseNo.length === 0) {
            Vue.prototype.$warningToast('曲房不能为空');
            return false;
        }
        if (!this.detailForm.inKjmDate || this.detailForm.inKjmDate.length === 0) {
            Vue.prototype.$warningToast('制曲日期不能为空');
            return false;
        }
        if (!this.detailForm.productDate || this.detailForm.productDate.length === 0) {
            Vue.prototype.$warningToast('生产日期不能为空');
            return false;
        }
        const params: OrderDetail[] = [this.detailForm];
        Vue.prototype
            .$http(`${KJM_API.SPLITORDERDETAILLIST_API}`, `POST`, params)
            .then(res => {
                if (res.data.code === 0) {
                    this.dialogFormVisible2 = false;
                    this.retrieveDetail(this.detailForm.orderId);
                } else {
                    this.$notify.error({ title: '错误', message: res.data.msg });
                }
            })
            .catch(err => {
                console.log('catch data::', err);
            });
    }

    rowDelFlag({ row }) {
        if (row.delFlag === '1') {
            return 'rowDel';
        }
            return '';

    }

    orderCheck(row) {
        this.$store.commit('common/updateZQCheckParamsOrderNo', row.orderNo);
        this.$store.commit('common/updateZQCheckParamsOrderId', row.orderId);
        this.$store.commit('common/updateZQCheckParamsOrderStatus', row.orderStatus);
        this.pushPage('DataEntry-KojiMaking-orderAuditing-index');
    }

    get totalCount() {
        return this.orderList.length;
    }

    get currentOrderList() {
        return this.orderList.slice((this.currPage - 1) * this.pageSize, this.currPage * this.pageSize);
    }

    handleSizeChange(val: number) {
        this.pageSize = val;
        this.currPage = 1;
    }

    handleCurrentChange(val: number) {
        this.currPage = val;
    }

    get mainTabs() {
        return this.$store.state.common.mainTabs;
    }

    set mainTabs(val) {
        this.$store.commit('common/updateMainTabs', val);
    }

    pushPage(name) {
        this.mainTabs = this.mainTabs.filter(item => item.name !== name);
        setTimeout(() => {
            this.$router.push({ name });
        }, 100);
    }

    @Watch('params', { deep: true })
    onChangeValue() {
        this.searched = false;
    }
    // @Watch('params.factoryId')
    // onFactoryValue (newVal: string, oldVal: string) {
    //   this.params.workshopId = ''
    //   this.params.workshopName = ''
    //   this.getWorkshop(newVal)
    // }
}
</script>
<style lang="scss" scoped>
@import "@/assets/scss/_common.scss";
</style>
<style lang="scss" scoped>
.box-item {
    box-sizing: border-box;
    height: 220px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(232, 232, 232, 1);
    border-radius: 2px;
    .box-item-top {
        height: 178px;
        padding: 10px;
        padding-bottom: 0;
        border-bottom: 1px solid rgba(232, 232, 232, 1);
        .box-item-title {
            display: flex;
            flex: 1;
            justify-content: space-between;
            height: 34px;
            .box-item-title-name {
                display: flex;
                flex: 1;
                :first-child {
                    width: 30px;
                    height: 30px;
                    color: #fff;
                    font-weight: 500;
                    font-size: 12px;
                    line-height: 30px;
                    text-align: center;
                    background: #ffbf00;
                    border-radius: 15px;
                }
                :nth-child(2) {
                    margin-top: 4px;
                    margin-left: 5px;
                    color: rgba(0, 0, 0, 0.85);
                    font-weight: 400;
                    font-size: 16px;
                    line-height: 22px;
                }
            }
            .box-item-title-state {
                flex: 1;
                margin-top: 4px;
                color: rgba(0, 0, 0, 0.65);
                font-weight: 500;
                font-size: 14px;
                line-height: 20px;
                text-align: right;
                &::before {
                    display: inline-block;
                    width: 6px;
                    height: 6px;
                    margin-right: 10px;
                    margin-bottom: 2px;
                    background: rgba(126, 211, 33, 1);
                    content: "";
                }
            }
        }
        .box-item-container {
            display: flex;
            flex: 1;
            justify-content: space-between;
            height: 129px;
            .box-item-container-left {
                display: flex;
                justify-content: center;
                width: 130px;
                padding-top: 10px;
                .box-item-container-img {
                    width: 94px;
                    height: 86px;
                    background: url("~@/assets/img/fajiaoguan.png");
                }
            }
            .box-item-container-right {
                display: flex;
                flex: 1;
                flex-direction: column;
                margin-left: 10px;
                .box-item-container-item {
                    display: flex;
                    flex: 1;
                    justify-content: space-between;
                    .name {
                        width: 60px;
                        color: rgba(0, 0, 0, 0.45);
                        font-weight: 400;
                        font-size: 12px;
                        line-height: 20px;
                    }
                    .detail {
                        flex: 1;
                        color: rgba(0, 0, 0, 0.65);
                        font-weight: 500;
                        font-size: 14px;
                        line-height: 17px;
                    }
                }
            }
        }
    }
    .box-item-bottom {
        display: flex;
        justify-content: space-between;
        box-sizing: border-box;
        height: 40px;
        background: rgba(247, 249, 250, 1);
        border-radius: 0 0 2px 2px;
        .box-item-bottom-item {
            flex: 1;
            color: rgba(0, 0, 0, 0.65);
            font-weight: 500;
            font-size: 12px;
            line-height: 40px;
            text-align: center;
            &:hover {
                color: #fff;
                background: #1890ff;
                cursor: pointer;
            }
        }
        .box-item-bottom-split {
            width: 1px;
            height: 16px;
            margin-top: 12px;
            background: rgba(232, 232, 232, 1);
        }
    }
}
.rowButton {
    button {
        margin: 0 3px !important;
    }
}
.operator {
    display: flex;
    color: rgba(24, 144, 255, 1);
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    &:hover {
        cursor: pointer;
    }
}
.operator .split {
    width: 14px;
    height: 22px;
    background: url("~@/assets/img/chaifen.png");
    background-repeat: no-repeat;
    background-position: center center;
}
.operator .check {
    width: 14px;
    height: 22px;
    background: url("~@/assets/img/heshi.png");
    background-repeat: no-repeat;
    background-position: center center;
}
// .operator:nth-child(2){
//   &:after{
//     content:'';
//     display: inline-block;
//     height:14px;
//     width:1px;
//     background:rgba(233,233,233,1);
//   }
// }

</style>
<style lang="scss">
.dialog__class {
    border-radius: 6px 6px 0 0 !important;
    .el-dialog__header {
        height: 59px;
        color: #fff;
        font-size: 20px;
        background: rgba(24, 144, 255, 1);
        border-radius: 6px 6px 0 0;
        .el-dialog__headerbtn .el-dialog__close {
            color: #fff;
        }
    }
    .reqI {
        color: red;
    }
    .rowDel {
        display: none;
    }
}
</style>
