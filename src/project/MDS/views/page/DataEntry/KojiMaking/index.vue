<template>
    <el-row>
        <el-col>
            <div class="header_main">
                <el-card class="searchCard queryHead">
                    <el-form :model="params" size="small" :inline="true" label-position="right" label-width="70px" class="multi_row">
                        <el-form-item label="生产工厂：">
                            <el-select v-model="params.factoryId" class="selectwpx" style="width: 140px;" @change="changeOptions('factory')">
                                <el-option v-for="sole in factoryList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="生产车间：">
                            <el-select v-model="params.workshopId" class="selectwpx" style="width: 130px;" @change="changeOptions('workshop')">
                                <el-option v-for="sole in workshopList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="制曲日期：" label-width="70px">
                            <el-date-picker v-model="params.zqDate" type="date" value-format="yyyy-MM-dd" style="width: 135px;" />
                        </el-form-item>
                        <el-form-item label="订单：" label-width="45px">
                            <el-input v-model="params.orderNo" type="text" clearable style="width: 140px;" />
                        </el-form-item>
                        <el-form-item label="生产状态：" label-width="70px">
                            <el-select v-model="params.productStatus" class="selectwpx" style="width: 140px;">
                                <el-option label="正常生产" value="normal" />
                                <el-option label="无生产" value="abnormal" />
                            </el-select>
                        </el-form-item>
                        <el-form-item style="float: right;">
                            <el-button v-if="isMyAuth" type="primary" size="small" @click="getOrderList()">
                                查询
                            </el-button>
                            <template v-if="params.productStatus === 'abnormal'">
                                <el-button v-if="searched && disabled && isAuth('kjm:user:updateUser')" type="primary" size="small" @click="setDisabled(false)">
                                    编辑
                                </el-button>
                                <el-button v-if="!disabled" type="primary" size="small" @click="setDisabled(true)">
                                    返回
                                </el-button>
                            </template>
                            <template v-if="params.productStatus === 'abnormal' && !disabled && isAuth('kjm:user:updateUser')">
                                <el-button type="primary" size="small" @click="addPeople">
                                    新增
                                </el-button>
                                <el-button type="primary" size="small" @click="save">
                                    保存
                                </el-button>
                            </template>
                        </el-form-item>
                    </el-form>
                </el-card>
                <el-row v-if="params.productStatus === 'normal' && searched" style="margin-top: 5px;">
                    <el-col>
                        <template v-for="(item, index) in orderList">
                            <el-row v-if="index % 3 === 0" :key="index" :gutter="10">
                                <el-col v-if="index < orderList.length" :span="8">
                                    <div class="box-item">
                                        <div class="box-item-top">
                                            <div class="box-item-title">
                                                <div class="box-item-title-name">
                                                    <div>
                                                        {{ orderList[index].houseNo }}
                                                    </div>
                                                    <div>
                                                        {{ orderList[index].inPotNoName }}
                                                    </div>
                                                </div>
                                                <div :class="orderList[index].status === '不通过' ? 'box-item-title-state-nopass' : 'box-item-title-state'">
                                                    <label style="color: rgba(0, 0, 0, 0.65);">状态：</label>{{ orderList[index].status }}
                                                </div>
                                            </div>
                                            <div class="box-item-container">
                                                <div class="box-item-container-left">
                                                    <div class="box-item-container-img">
                                                        <img src="@/assets/img/fajiaoguan.png" alt="" class="bgimg">
                                                    </div>
                                                </div>
                                                <div class="box-item-container-right">
                                                    <div class="box-item-container-item">
                                                        <div class="name">
                                                            生产订单
                                                        </div>
                                                        <div class="detail">
                                                            {{ orderList[index].orderNo }}
                                                        </div>
                                                    </div>
                                                    <div class="box-item-container-item">
                                                        <div class="name">
                                                            生产品项
                                                        </div>
                                                        <div class="detail">
                                                            {{ orderList[index].materialCode + ' ' + orderList[index].materialName }}
                                                        </div>
                                                    </div>
                                                    <div class="box-item-container-item">
                                                        <div class="name">
                                                            入曲时长
                                                        </div>
                                                        <div class="detail">
                                                            {{ orderList[index].inEndTimeLength }}
                                                            小时
                                                        </div>
                                                    </div>
                                                    <div class="box-item-container-item">
                                                        <div class="name">
                                                            入曲时间
                                                        </div>
                                                        <div class="detail">
                                                            {{ orderList[index].inEndTime ? orderList[index].inEndTime : '' }}
                                                        </div>
                                                    </div>
                                                    <div class="btn">
                                                        <el-tooltip class="item" effect="dark" :content="orderList[index].beanStatus" placement="top-start">
                                                            <el-button
                                                                type="primary"
                                                                size="mini"
                                                                :class="{
                                                                    nopassBtn: orderList[index].beanStatus === '不通过',
                                                                }"
                                                                @click="goPage('煮豆', orderList[index])"
                                                            >
                                                                煮豆
                                                            </el-button>
                                                        </el-tooltip>
                                                        <el-tooltip class="item" effect="dark" :content="orderList[index].guardStatus" placement="top-start">
                                                            <el-button
                                                                type="primary"
                                                                size="mini"
                                                                :class="{
                                                                    nopassBtn: orderList[index].guardStatus === '不通过',
                                                                }"
                                                                @click="goPage('看曲', orderList[index])"
                                                            >
                                                                看曲
                                                            </el-button>
                                                        </el-tooltip>
                                                        <el-tooltip class="item" effect="dark" :content="orderList[index].outStatus" placement="top-start">
                                                            <el-button
                                                                type="primary"
                                                                size="mini"
                                                                :class="{
                                                                    nopassBtn: orderList[index].outStatus === '不通过',
                                                                }"
                                                                @click="goPage('出曲', orderList[index])"
                                                            >
                                                                出曲
                                                            </el-button>
                                                        </el-tooltip>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!--<div class="box-item-bottom">-->
                                        <!--<el-tooltip class="item" effect="dark" :content="orderList[index].beanStatus" placement="top-start">-->
                                        <!--<div class="box-item-bottom-item" :style="{'color':orderList[index].beanStatus === '不通过'? 'red' : ''}" @click="goPage('煮豆', orderList[index])">煮豆</div>-->
                                        <!--</el-tooltip>-->
                                        <!--<div class="box-item-bottom-split"></div>-->
                                        <!--<el-tooltip class="item" effect="dark" :content="orderList[index].guardStatus" placement="top-start">-->
                                        <!--<div class="box-item-bottom-item" :style="{'color': orderList[index].guardStatus === '不通过'? 'red' : ''}" @click="goPage('看曲', orderList[index])">看曲</div>-->
                                        <!--</el-tooltip>-->
                                        <!--<div class="box-item-bottom-split"></div>-->
                                        <!--<el-tooltip class="item" effect="dark" :content="orderList[index].outStatus" placement="top-start">-->
                                        <!--<div class="box-item-bottom-item" :style="{'color': orderList[index].outStatus === '不通过'? 'red' : ''}" @click="goPage('出曲', orderList[index])">出曲</div>-->
                                        <!--</el-tooltip>-->
                                        <!--</div>-->
                                    </div>
                                </el-col>
                                <el-col v-if="index + 1 < orderList.length" :span="8">
                                    <div class="box-item">
                                        <div class="box-item-top">
                                            <div class="box-item-title">
                                                <div class="box-item-title-name">
                                                    <div style="background: #5bd171;">
                                                        {{ orderList[index + 1].houseNo }}
                                                    </div>
                                                    <div>
                                                        {{ orderList[index + 1].inPotNoName }}
                                                    </div>
                                                </div>
                                                <div :class="orderList[index + 1].status === '不通过' ? 'box-item-title-state-nopass' : 'box-item-title-state'">
                                                    <label style="color: rgba(0, 0, 0, 0.65);">状态：</label>{{ orderList[index + 1].status }}
                                                </div>
                                            </div>
                                            <div class="box-item-container">
                                                <div class="box-item-container-left">
                                                    <div class="box-item-container-img">
                                                        <img src="@/assets/img/fajiaoguan.png" alt="" class="bgimg">
                                                    </div>
                                                </div>
                                                <div class="box-item-container-right">
                                                    <div class="box-item-container-item">
                                                        <div class="name">
                                                            生产订单
                                                        </div>
                                                        <div class="detail">
                                                            {{ orderList[index + 1].orderNo }}
                                                        </div>
                                                    </div>
                                                    <div class="box-item-container-item">
                                                        <div class="name">
                                                            生产品项
                                                        </div>
                                                        <div class="detail">
                                                            {{ orderList[index + 1].materialCode + ' ' + orderList[index + 1].materialName }}
                                                        </div>
                                                    </div>
                                                    <div class="box-item-container-item">
                                                        <div class="name">
                                                            入曲时长
                                                        </div>
                                                        <div class="detail">
                                                            {{ orderList[index + 1].inEndTimeLength }}
                                                            小时
                                                        </div>
                                                    </div>
                                                    <div class="box-item-container-item">
                                                        <div class="name">
                                                            入曲时间
                                                        </div>
                                                        <div class="detail">
                                                            {{ orderList[index + 1].inEndTime ? orderList[index + 1].inEndTime : '' }}
                                                        </div>
                                                    </div>
                                                    <div class="btn">
                                                        <el-tooltip class="item" effect="dark" :content="orderList[index + 1].beanStatus" placement="top-start">
                                                            <el-button
                                                                type="primary"
                                                                size="mini"
                                                                :class="{
                                                                    nopassBtn: orderList[index + 1].beanStatus === '不通过',
                                                                }"
                                                                @click="goPage('煮豆', orderList[index + 1])"
                                                            >
                                                                煮豆
                                                            </el-button>
                                                        </el-tooltip>
                                                        <el-tooltip class="item" effect="dark" :content="orderList[index + 1].guardStatus" placement="top-start">
                                                            <el-button
                                                                type="primary"
                                                                size="mini"
                                                                :class="{
                                                                    nopassBtn: orderList[index + 1].guardStatus === '不通过',
                                                                }"
                                                                @click="goPage('看曲', orderList[index + 1])"
                                                            >
                                                                看曲
                                                            </el-button>
                                                        </el-tooltip>
                                                        <el-tooltip class="item" effect="dark" :content="orderList[index + 1].outStatus" placement="top-start">
                                                            <el-button
                                                                type="primary"
                                                                size="mini"
                                                                :class="{
                                                                    nopassBtn: orderList[index + 1].outStatus === '不通过',
                                                                }"
                                                                @click="goPage('出曲', orderList[index + 1])"
                                                            >
                                                                出曲
                                                            </el-button>
                                                        </el-tooltip>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!--<div class="box-item-bottom">-->
                                        <!--<el-tooltip class="item" effect="dark" :content="orderList[index + 1].beanStatus" placement="top-start">-->
                                        <!--<div class="box-item-bottom-item" :style="{'color': orderList[index + 1].beanStatus === '不通过'? 'red' : ''}" @click="goPage('煮豆', orderList[index + 1])">煮豆</div>-->
                                        <!--</el-tooltip>-->
                                        <!--<div class="box-item-bottom-split"></div>-->
                                        <!--<el-tooltip class="item" effect="dark" :content="orderList[index + 1].guardStatus" placement="top-start">-->
                                        <!--<div class="box-item-bottom-item" :style="{'color': orderList[index + 1].guardStatus === '不通过'? 'red' : ''}" @click="goPage('看曲', orderList[index + 1])">看曲</div>-->
                                        <!--</el-tooltip>-->
                                        <!--<div class="box-item-bottom-split"></div>-->
                                        <!--<el-tooltip class="item" effect="dark" :content="orderList[index + 1].outStatus" placement="top-start">-->
                                        <!--<div class="box-item-bottom-item" :style="{'color': orderList[index + 1].outStatus === '不通过'? 'red' : ''}" @click="goPage('出曲', orderList[index + 1])">出曲</div>-->
                                        <!--</el-tooltip>-->
                                        <!--</div>-->
                                    </div>
                                </el-col>
                                <el-col v-if="index + 2 < orderList.length" :span="8">
                                    <div class="box-item">
                                        <div class="box-item-top">
                                            <div class="box-item-title">
                                                <div class="box-item-title-name">
                                                    <div style="background: #2c92f6;">
                                                        {{ orderList[index + 2].houseNo }}
                                                    </div>
                                                    <div>
                                                        {{ orderList[index + 2].inPotNoName }}
                                                    </div>
                                                </div>
                                                <div :class="orderList[index + 2].status === '不通过' ? 'box-item-title-state-nopass' : 'box-item-title-state'">
                                                    <label style="color: rgba(0, 0, 0, 0.65);">状态：</label>{{ orderList[index + 2].status }}
                                                </div>
                                            </div>
                                            <div class="box-item-container">
                                                <div class="box-item-container-left">
                                                    <div class="box-item-container-img">
                                                        <img src="@/assets/img/fajiaoguan.png" alt="" class="bgimg">
                                                    </div>
                                                </div>
                                                <div class="box-item-container-right">
                                                    <div class="box-item-container-item">
                                                        <div class="name">
                                                            生产订单
                                                        </div>
                                                        <div class="detail">
                                                            {{ orderList[index + 2].orderNo }}
                                                        </div>
                                                    </div>
                                                    <div class="box-item-container-item">
                                                        <div class="name">
                                                            生产品项
                                                        </div>
                                                        <div class="detail">
                                                            {{ orderList[index + 2].materialCode + ' ' + orderList[index + 2].materialName }}
                                                        </div>
                                                    </div>
                                                    <div class="box-item-container-item">
                                                        <div class="name">
                                                            入曲时长
                                                        </div>
                                                        <div class="detail">
                                                            {{ orderList[index + 2].inEndTimeLength }}
                                                            小时
                                                        </div>
                                                    </div>
                                                    <div class="box-item-container-item">
                                                        <div class="name">
                                                            入曲时间
                                                        </div>
                                                        <div class="detail">
                                                            {{ orderList[index + 2].inEndTime ? orderList[index + 2].inEndTime : '' }}
                                                        </div>
                                                    </div>
                                                    <div class="btn">
                                                        <el-tooltip class="item" effect="dark" :content="orderList[index + 2].beanStatus" placement="top-start">
                                                            <el-button
                                                                type="primary"
                                                                size="mini"
                                                                :class="{
                                                                    nopassBtn: orderList[index + 2].beanStatus === '不通过',
                                                                }"
                                                                @click="goPage('煮豆', orderList[index + 2])"
                                                            >
                                                                煮豆
                                                            </el-button>
                                                        </el-tooltip>
                                                        <el-tooltip class="item" effect="dark" :content="orderList[index + 2].guardStatus" placement="top-start">
                                                            <el-button
                                                                type="primary"
                                                                size="mini"
                                                                :class="{
                                                                    nopassBtn: orderList[index + 2].guardStatus === '不通过',
                                                                }"
                                                                @click="goPage('看曲', orderList[index + 2])"
                                                            >
                                                                看曲
                                                            </el-button>
                                                        </el-tooltip>
                                                        <el-tooltip class="item" effect="dark" :content="orderList[index + 2].outStatus" placement="top-start">
                                                            <el-button
                                                                type="primary"
                                                                size="mini"
                                                                :class="{
                                                                    nopassBtn: orderList[index + 2].outStatus === '不通过',
                                                                }"
                                                                @click="goPage('出曲', orderList[index + 2])"
                                                            >
                                                                出曲
                                                            </el-button>
                                                        </el-tooltip>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!--<div class="box-item-bottom">-->
                                        <!--<el-tooltip class="item" effect="dark" :content="orderList[index + 2].beanStatus" placement="top-start">-->
                                        <!--<div class="box-item-bottom-item" :style="{'color': orderList[index + 2].beanStatus === '不通过'? 'red' : ''}" @click="goPage('煮豆', orderList[index + 2])">煮豆</div>-->
                                        <!--</el-tooltip>-->
                                        <!--<div class="box-item-bottom-split"></div>-->
                                        <!--<el-tooltip class="item" effect="dark" :content="orderList[index + 2].guardStatus" placement="top-start">-->
                                        <!--<div class="box-item-bottom-item" :style="{'color': orderList[index + 2].guardStatus === '不通过'? 'red' : ''}" @click="goPage('看曲', orderList[index + 2])">看曲</div>-->
                                        <!--</el-tooltip>-->
                                        <!--<div class="box-item-bottom-split"></div>-->
                                        <!--<el-tooltip class="item" effect="dark" :content="orderList[index + 2].outStatus" placement="top-start">-->
                                        <!--<div class="box-item-bottom-item" :style="{'color': orderList[index + 2].outStatus === '不通过'? 'red' : ''}" @click="goPage('出曲', orderList[index + 2])">出曲</div>-->
                                        <!--</el-tooltip>-->
                                        <!--</div>-->
                                    </div>
                                </el-col>
                            </el-row>
                        </template>
                    </el-col>
                </el-row>
                <el-row v-show="params.productStatus === 'abnormal' && searched" style="margin-top: 5px;">
                    <div style="min-height: 340px;">
                        <el-table border header-row-class-name="tableHead" :data="datalist">
                            <el-table-column label="中/白/夜班" prop="classType" width="100">
                                <template slot-scope="scope">
                                    <el-select v-model="scope.row.classType" placeholder="请选择" size="small" :disabled="disabled">
                                        <el-option v-for="sole in DayTypeList" :key="sole" :value="sole" :label="sole" />
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column label="工序" width="120">
                                <template slot-scope="scope">
                                    <el-select v-model="scope.row.deptId" placeholder="请选择" size="small" :disabled="disabled" @change="changeProcType(scope.row)">
                                        <el-option v-for="sole in processesList" :key="sole.deptId" :value="sole.deptId" :label="sole.deptName" />
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column label="人员属性" prop="userType" width="110">
                                <template slot-scope="scope">
                                    <el-select v-model="scope.row.userType" placeholder="请选择" size="small" :disabled="disabled" @change="changeProcType(scope.row)">
                                        <el-option v-for="sole in EmployeeTypeList" :key="sole" :value="sole" :label="sole" />
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column prop="userId" label="姓名（工号）" :show-overflow-tooltip="true" width="200">
                                <template slot-scope="scope">
                                    <el-col>
                                        <span v-if="!disabled" style="cursor: pointer;" @click="selectUser(scope.row)">
                                            <i v-if="scope.row.userId !== undefined">{{ scope.row.userId.join(',') }}</i>
                                            <span>
                                                <i v-if="scope.row.userType === '临时工'">点击输入临时工</i>
                                                <i v-else>点击选择人员</i>
                                            </span>
                                        </span>
                                        <span v-else style="cursor: pointer;">
                                            <i v-if="scope.row.userId !== undefined">{{ scope.row.userId.join(',') }}</i>
                                            <span>
                                                <i v-if="scope.row.userType === '临时工'">点击输入临时工</i>
                                                <i v-else>点击选择人员</i>
                                            </span>
                                        </span>
                                    </el-col>
                                </template>
                            </el-table-column>
                            <el-table-column label="开始时间" prop="startDate" width="190">
                                <template slot-scope="scope">
                                    <el-date-picker v-model="scope.row.startDate" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" placeholder="选择时间" size="small" style="width: 175px;" :disabled="disabled" />
                                </template>
                            </el-table-column>
                            <el-table-column label="用餐时间" prop="dinner" width="100">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.dinner" type="number" size="small" :disabled="disabled" />
                                </template>
                            </el-table-column>
                            <el-table-column label="结束时间" prop="endDate" width="190">
                                <template slot-scope="scope">
                                    <el-date-picker v-model="scope.row.endDate" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" placeholder="选择时间" size="small" style="width: 175px;" :disabled="disabled" />
                                </template>
                            </el-table-column>
                            <el-table-column label="备注" prop="remark">
                                <template slot-scope="scope">
                                    <Remark v-model="scope.row.remark" :width="'150px'" :disabled="disabled" />
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" fixed="right" width="50">
                                <template slot-scope="scope">
                                    <el-button v-if="isAuth('kjm:user:delUser')" type="danger" icon="el-icon-delete" circle size="small" :disabled="disabled" @click="delUser(scope.row)" />
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-row style=" margin-top: 10px; font-size: 14px; line-height: 30px;">
                            实际作业人数: {{ countMan }}
                        </el-row>
                    </div>
                    <el-row>
                        <el-pagination :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                    </el-row>
                </el-row>
            </div>
            <temporary-worker ref="temporaryWorker" @changeUser="changeUser" />
            <loaned-personnel ref="loanedPersonnel" :org-tree="OrgTree" :arr-list="arrList" @changeUser="changeUser" />
            <official-worker ref="officialWorker" @changeUser="changeUser" />
        </el-col>
    </el-row>
</template>

<script lang="ts">
import { BASICDATA_API, WHT_API, KJM_API } from '@/api/api';
import { dateFormat } from '@/net/validate';
import { Vue, Component, Watch } from 'vue-property-decorator';
import TemporaryWorker from '@/views/components/TemporaryWorker.vue';
import LoanedPersonnel from '@/views/components/LoanedPersonnel.vue';
import OfficialWorker from '@/views/components/OfficialWorker.vue';
import { Employee } from './entity/Employee';
import { DayType, EMPType } from './entity/Enum';
import { House } from './entity/House';

@Component({
    components: {
        TemporaryWorker,
        LoanedPersonnel,
        OfficialWorker
    }
})
export default class Index extends Vue {
    // $refs: {
    //   temporaryWorker: TemporaryWorker,
    //   loanedPersonnel: LoanedPersonnel,
    //   officialWorker: officialWorker
    // }
    // 将common中的参数复制一份到本地
    // params = JSON.parse(JSON.stringify(this.$store.state.common.ZQWorkshop.defaultVal))
    params = {
        factoryId: '',
        factoryName: '',
        workshopId: '',
        workshopName: '',
        // 制曲日期
        zqDate: '',
        // normal/abnormal 正常生产/无生产
        productStatus: 'normal',
        // 订单管理页的订单日期
        orderDate: '',
        orderNo: '',
        orderStatus: ''
    };

    factoryList = [];
    workshopList = [];
    processesList = [];
    searched = false;
    disabled = true;
    datalist: Array<Employee> = [];
    totalList: Array<Employee> = [];
    OrgTree = [];
    arrList = [];
    row = {
        userId: []
    };

    currPage = 1;
    pageSize = 10;
    totalCount = 0;
    // 首页订单
    orderList: Array<House> = [];

    mounted() {
        this.params.zqDate = dateFormat(new Date(), 'yyyy-MM-dd');
        this.getFactory();
        this.getWorkshop(this.params.factoryId);
        this.getProcess(this.params.workshopId);
        this.getTree();
    }

    get isMyAuth() {
        if (this.params.productStatus === 'abnormal') {
            // 无生产的查询权限
            return this.isAuth('kjm:user:listUser');
        } else if (this.params.productStatus === 'normal') {
            // 正常生产的查询权限
            return this.isAuth('kjm:order:list');
        }
        return false;
    }

    get mainTabs() {
        return this.$store.state.common.mainTabs;
    }

    set mainTabs(val) {
        this.$store.commit('common/updateMainTabs', val);
    }

    get countMan(): number {
        let num = 0;
        if (this.totalList && this.totalList.length > 0) {
            this.totalList.forEach(item => {
                if (item.userId) {
                    num += item.userId.length;
                }
            });
        }
        return num;
    }

    get DayTypeList() {
        return DayType;
    }

    get EmployeeTypeList() {
        return EMPType;
    }

    changeOptions(flag: string) {
        if (flag === 'factory') {
            const item = this.factoryList.find(ele => ele['deptId'] === this.params.factoryId);
            this.params.factoryName = item ? item['deptName'] : '';
        } else if (flag === 'workshop') {
            const item = this.workshopList.find(ele => ele['deptId'] === this.params.workshopId);
            this.params.workshopName = item ? item['deptName'] : '';
        }
    }

    changeProcType(row) {
        row.userId = [];
    }

    // 获取工厂
    getFactory() {
        this.factoryList = [];
        Vue.prototype.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, `POST`, {}, false, false, false).then(res => {
            if (res.data.code === 0) {
                this.factoryList = res.data.typeList;
                if (!this.params.factoryId) {
                    this.params.factoryId = res.data.typeList[0].deptId;
                }
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
                    if (res.data.typeList.length !== 0) {
                        this.params.workshopId = res.data.typeList[0].deptId;
                    }
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: res.data.msg
                    });
                }
            });
        }
    }

    // 根据车间获取工序
    getProcess(wsid: string) {
        this.processesList = [];
        // if (wsid) {
        //   Vue.prototype.$http(`${BASICDATA_API.FINDORGBYPARENTID_API}`, 'POST', {parentId: wsid}, false, false, false).then(({data}) => {
        //     if (data.code === 0) {
        //       this.processesList = data.childList
        //     } else {
        //       this.$notify.error({title: '错误', message: data.msg})
        //     }
        //   })
        // }
        if (wsid) {
            Vue.prototype.$http(`${BASICDATA_API.FINDTEAM_API}`, 'POST', { id: wsid, factory: this.params.factoryId }, false, false, false).then(({ data }) => {
                if (data.code === 0) {
                    this.processesList = data.teamList;
                } else {
                    this.$notify.error({ title: '错误', message: data.msg });
                }
            });
            // this.$http(`${BASICDATA_API.FINDORGBYPARENTID_API}`, 'POST', {parentId: id}).then(({data}) => {
            //   if (data.code === 0) {
            //     this.Team = data.childList
            //   } else {
            //     this.$notify.error({title: '错误', message: data.msg})
            //   }
            // })
        } else {
            Vue.prototype
                .$http(`${BASICDATA_API.FINDTEAM_API}`, 'POST', {
                    factory: this.params.factoryId
                })
                .then(({ data }) => {
                    if (data.code === 0) {
                        this.processesList = data.teamList;
                    } else {
                        this.$notify.error({ title: '错误', message: data.msg });
                    }
                });
        }
    }

    setDisabled(flag: boolean) {
        this.disabled = flag;
    }

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
        if ((this.params.zqDate === '' || !this.params.zqDate) && this.params.orderNo === '') {
            Vue.prototype.$warningToast('制曲日期或订单请选填一项');
            return false;
        }
        if (this.params.productStatus === '') {
            Vue.prototype.$warningToast('请选择生产状态');
            return;
        }
        // 保存选项值到common store
        this.setStore(this.params);
        // his.lodingStatus = true
        this.searched = true;
        if (this.params.productStatus === 'normal') {
            // 正常生产
            const params = {
                factory: this.params.factoryId,
                workShop: this.params.workshopId,
                inKjmDate: this.params.zqDate,
                orderNo: this.params.orderNo
            };
            this.retrieveOrderList(params);
        } else if (this.params.productStatus === 'abnormal') {
            // 无生产
            this.disabled = true;
            this.datalist = [];
            this.totalList = [];
            Vue.prototype
                .$http(`${WHT_API.CINDEXLISTUSER}`, 'POST', {
                    deptId: this.params.workshopId,
                    productDate: this.params.zqDate
                })
                .then(res => {
                    if (res.data.code === 0) {
                        for (const item of res.data.infoUser) {
                            // 请求回来的数据做类型和格式转换
                            item.productDate = item.productDate ? item.productDate.substring(0, 10) : item.productDate;
                            item.dinner = String(item.dinner);
                        }
                        this.totalCount = res.data.infoUser.length;
                        this.totalList = res.data.infoUser;
                        this.datalist = res.data.infoUser.slice(0, this.pageSize);
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
        }
    }

    retrieveOrderList(params) {
        this.orderList = [];
        Vue.prototype
            .$http(`${KJM_API.KJMAKINGORDERLIST_API}`, 'POST', params)
            .then(res => {
                if (res.data.code === 0) {
                    for (const item of res.data.list) {
                        const order = new House(item.orderId, item.orderNo, item.materialCode, item.materialName, item.houseNo, item.inPotNoName, item.inEndTime, item.inEndTimeLength, item.orderHouseId, item.status, item.beanStatus, item.guardStatus, item.outStatus);
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

    // 新增人员
    addPeople() {
        const p = new Employee('', this.params.zqDate, '60');
        this.datalist.push(p);
    }

    // 人员删除
    delUser(row) {
        if (row.orderId && row.orderId !== '') {
            // 原始数据后端删除
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                Vue.prototype
                    .$http(`${WHT_API.CINDEXDELUSER}`, 'POST', {
                        orderId: row.orderId
                    })
                    .then(({ data }) => {
                        if (data.code === 0) {
                            this.datalist.splice(this.datalist.indexOf(row), 1);
                            Vue.prototype.$successToast('删除成功!');
                        } else {
                            this.$notify.error({
                                title: '错误',
                                message: data.msg
                            });
                        }
                    });
            }).catch(() => {
                // this.$infoToast('已取消删除');
            });
        } else {
            // 新增数据前端删除
            this.datalist.splice(this.datalist.indexOf(row), 1);
        }
    }

    // 选择人员 正式 借调
    /* eslint-disable @typescript-eslint/no-explicit-any */
    selectUser(row) {
        this.row = row;
        const loanedPersonnel: any = this.$refs.loanedPersonnel;
        const officialWorker: any = this.$refs.officialWorker;
        const temporaryWorker: any = this.$refs.temporaryWorker;
        if (row.userType === EMPType.TRANSFER) {
            this.$nextTick(() => {
                loanedPersonnel.init(row.userId);
            });
        } else if (row.userType === EMPType.FORMAL) {
            if (row.deptId && row.deptId !== '') {
                this.$nextTick(() => {
                    officialWorker.init(row.deptId, row.userId);
                });
            } else {
                Vue.prototype.$warningToast('请选择工序');
            }
        } else if (row.userType === EMPType.TEMP) {
            this.$nextTick(() => {
                temporaryWorker.init(row);
            });
        } else {
            Vue.prototype.$warningToast('请选择人员属性');
        }
    }

    /* eslint-enable @typescript-eslint/no-explicit-any */
    // 员工确认
    changeUser(userId) {
        this.row.userId = userId;
        this.$set(this.row, userId, this.row.userId);
    }

    // 改变每页条数
    handleSizeChange(val: number) {
        this.pageSize = val;
        this.currPage = 1;
        this.datalist = this.totalList.slice((this.currPage - 1) * this.pageSize, (this.currPage - 1) * this.pageSize + this.pageSize);
    }

    // 跳转页数
    handleCurrentChange(val: number) {
        this.currPage = val;
        this.datalist = this.totalList.slice((this.currPage - 1) * this.pageSize, (val - 1) * this.pageSize + this.pageSize);
    }

    save() {
        if (!this.datalist || this.datalist.length === 0) {
            Vue.prototype.$warningToast('请先新增数据');
            return;
        }
        this.$confirm('确认保存，是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            for (const item of this.datalist) {
                if (!item.classType) {
                    Vue.prototype.$warningToast({
                        title: '错误',
                        message: '班次不能为空'
                    });
                    return;
                }
                if (!item.deptId || item.deptId === '') {
                    Vue.prototype.$warningToast({
                        title: '错误',
                        message: '工序不能为空'
                    });
                    return;
                }
                if (!item.userType) {
                    Vue.prototype.$warningToast('人员属性不能为空');
                    return;
                }
                if (!item.userId || item.userId.length === 0) {
                    Vue.prototype.$warningToast('作业人员不能为空');
                    return;
                }
                if (!item.startDate || item.startDate === '') {
                    Vue.prototype.$warningToast('开始时间不能为空');
                    return;
                }
                if (!item.dinner || item.dinner === '') {
                    Vue.prototype.$warningToast('用餐时间不能为空');
                    return;
                }
                if (!item.endDate || item.endDate === '') {
                    Vue.prototype.$warningToast('结束时间不能为空');
                    return;
                }
            }
            Vue.prototype
                .$http(`${WHT_API.CINDEXUPDATEUSER}`, 'POST', this.datalist)
                .then(({ data }) => {
                    if (data.code === 0) {
                        Vue.prototype.$successToast('操作成功');
                    } else {
                        this.$notify.error({ title: '错误', message: data.msg });
                    }
                })
                .catch(err => {
                    this.$notify.error({
                        title: '错误',
                        message: '保存失败，' + err
                    });
                });
        }).catch(() => {
            // this.$infoToast('已取消删除');
        });
    }

    // 获取组织结构树
    getTree() {
        this.OrgTree = [];
        this.arrList = [];
        Vue.prototype.$http(`${BASICDATA_API.ORGSTRUCTURE_API}`, 'GET', {}, false, false, false).then(({ data }) => {
            if (data.code === 0) {
                this.OrgTree = data.deptList;
                this.arrList = [this.OrgTree[0]['children'][0]['deptId']];
            } else {
                this.$notify.error({ title: '错误', message: data.msg });
            }
        });
    }

    goPage(page: string, item: House) {
        let flag = false;
        if (page === '煮豆') {
            flag = this.isAuth('kjm:bean:material:list');
        } else if (page === '看曲') {
            flag = this.isAuth('kjm:guard:list');
        } else if (page === '出曲') {
            flag = this.isAuth('sys:kjmOutMaterial:list');
        }
        if (!flag) {
            this.$notify.error({ title: '错误', message: '无权限查看' + page });
            return;
        }
        this.$store.commit('common/updateZQParamsOrderNo', item.orderNo);
        this.$store.commit('common/updateZQParamsOrderId', item.orderId);
        let name = '';
        if (page === '煮豆') {
            this.$store.commit('common/updateZQParamsBeanHouseId', item.orderHouseId);
            name = 'DataEntry-KojiMaking-BoiledBeans-index';
        } else if (page === '看曲') {
            this.$store.commit('common/updateZQParamsLookHouseId', item.orderHouseId);
            name = 'DataEntry-KojiMaking-Look-index';
        } else if (page === '出曲') {
            this.$store.commit('common/updateZQParamsOutHouseId', item.orderHouseId);
            name = 'DataEntry-KojiMaking-Out-index';
        }
        this.pushPage(name);
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
        this.disabled = true;
    }

    @Watch('params.factoryId')
    onFactoryValue(newVal: string) {
        this.params.workshopId = '';
        this.params.workshopName = '';
        this.getWorkshop(newVal);
    }

    @Watch('params.workshopId')
    onWorkshopValue(newVal: string) {
        this.getProcess(newVal);
    }
}
</script>
<style lang="scss" scoped>
@import "@/assets/scss/_common.scss";
</style>
<style lang="scss" scoped>
.nopassBtn {
    background: #f05c4a;
    border: none;
}
.box-item {
    box-sizing: border-box;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(232, 232, 232, 1);
    border-radius: 2px;
    .box-item-top {
        padding: 10px 10px 15px;
        .box-item-title {
            display: flex;
            flex: 1;
            justify-content: space-between;
            height: 34px;
            margin-bottom: 16px;
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
                font-size: 12px;
                line-height: 20px;
                text-align: right;
                &::before {
                    display: inline-block;
                    width: 6px;
                    height: 6px;
                    margin-right: 10px;
                    margin-bottom: 2px;
                    background: rgba(126, 211, 33, 1);
                    border-radius: 50%;
                    content: "";
                }
            }
            .box-item-title-state-nopass {
                flex: 1;
                margin-top: 4px;
                color: red;
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
                    background: red;
                    border-radius: 50%;
                    content: "";
                }
            }
        }
        .box-item-container {
            display: flex;
            flex: 1;
            justify-content: space-between;
            .box-item-container-left {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 40%;
                background: rgba(242, 242, 242, 1);
                border-radius: 8px;
                .box-item-container-img {
                    width: 150px;
                    .bgimg {
                        width: 100%;
                    }
                }
            }
            .box-item-container-right {
                display: flex;
                flex: 1;
                flex-direction: column;
                width: 60%;
                margin-left: 16px;
                .btn {
                    text-align: right;
                }
                .box-item-container-item {
                    display: flex;
                    flex: 1;
                    justify-content: space-between;
                    margin-bottom: 10px;
                    .name {
                        width: 60px;
                        color: rgba(0, 0, 0, 0.45);
                        font-weight: 400;
                        font-size: 12px;
                        line-height: 32px;
                    }
                    .detail {
                        flex: 1;
                        padding-left: 10px;
                        overflow: hidden;
                        color: #333;
                        font-size: 12px;
                        line-height: 32px;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        background: #f5f5f5;
                        border-radius: 4px;
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
.box-card {
    .pro-line {
        border-bottom: 1px solid #dcdfe6;
    }
    .pro-line p {
        color: red;
        font-size: 16px;
        letter-spacing: 0.1em;
    }
    b {
        float: left;
        font-size: 16px;
        line-height: 32px;
    }
    .item {
        display: flex;
        margin-top: 20px;
        img {
            float: left;
            width: 220px;
            height: 220px;
            margin-right: 20px;
            border: 1px solid #dcdfe6;
            border-radius: 6px;
        }
        .itemForm {
            flex: 1;
            p {
                color: #8a979e;
            }
        }
        .margb20px {
            margin-bottom: 10px;
        }
    }
}
.el-row {
    margin-bottom: 20px;
    &:last-child {
        margin-bottom: 0;
    }
}
</style>
