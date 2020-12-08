<template>
    <div>
        <div class="header_main">
            <el-card class="searchCard queryHead" style="margin-bottom: 10px;">
                <el-row type="flex">
                    <el-col :span="24">
                        <el-form :model="plantList" size="small" :inline="true" label-position="right" label-width="70px" class="multi_row" @keyup.enter.native="GetList(true)" @submit.native.prevent>
                            <el-form-item label="生产工厂：">
                                <el-select v-model="plantList.factory" placeholder="请选择">
                                    <el-option v-for="(item, index) in factory" :key="index" :label="item.deptName" :value="item.deptId" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="生产车间：">
                                <el-select v-model="plantList.workShop" placeholder="请选择">
                                    <el-option v-for="(item, index) in workshop" :key="index" :label="item.deptName" :value="item.deptId" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="产线：">
                                <el-select v-model="plantList.productLine" placeholder="请选择">
                                    <el-option v-for="(item, index) in productline" :key="index" :label="item.deptName" :value="item.deptId" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="考勤大类：">
                                <el-select v-model="plantList.kqdl" placeholder="请选择">
                                    <el-option v-for="(iteam, index) in ARtype" :key="index" :label="iteam.value" :value="iteam.code" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="审核状态：">
                                <el-select v-model="plantList.status" placeholder="请选择">
                                    <el-option label="已保存" value="saved" />
                                    <el-option label="已提交" value="submit" />
                                    <el-option label="审核通过" value="checked" />
                                    <el-option label="审核不通过" value="noPass" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="日期：">
                                <el-date-picker v-model="plantList.setDate" type="date" placeholder="请选择" value-format="yyyy-MM-dd" style="width: 200px;" />
                            </el-form-item>
                            <el-form-item class="floatr">
                                <el-button v-if="isAuth('sys:att:listAtt')" type="primary" size="small" @click="GetList(true)">
                                    查询
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
                <div class="toggleSearchBottom">
                    <em class="el-icon-caret-top" />
                </div>
            </el-card>
            <mds-card title="考勤记录">
                <template slot="titleBtn">
                    <div style="float: right; margin-bottom: 5px;">
                        <el-button v-if="isAuth('sys:att:saveAtt')" type="primary" size="small" :disabled="!isRedact" @click="addAR()">
                            新增
                        </el-button>
                        <el-button v-if="isAuth('sys:att:deleteAtt')&&clearStatus" type="danger" size="small" :disabled="!isRedact" @click="delDate()">
                            删除
                        </el-button>
                    </div>
                </template>
                <el-row v-if="clearStatus">
                    <el-table ref="table1" header-row-class-name="tableHead" :data="datalist" class="newTable" border tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" :selectable="checkboxT" width="50" />
                        <el-table-column label="状态" :show-overflow-tooltip="true" width="100">
                            <template slot-scope="scope">
                                {{ scope.row.status === 'saved' ? '已保存' : scope.row.status === 'submit' ? '已提交' : scope.row.status === 'checked' ? '审核通过' : scope.row.status === 'noPass' ? '审核不通过' : '' }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="reqno" label="订单号" :show-overflow-tooltip="true" width="120" />
                        <el-table-column prop="workShopName" label="车间" :show-overflow-tooltip="true" width="120" />
                        <el-table-column prop="kqrq" label="考勤日期" :show-overflow-tooltip="true" width="140">
                            <template slot-scope="scope">
                                <el-date-picker v-if="scope.row.redactStatus" v-model="scope.row.kqrq" size="small" type="datetime" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="请选择" />
                                <span v-else>{{ scope.row.kqrq }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="考勤大类" :show-overflow-tooltip="true" width="120">
                            <template slot-scope="scope">
                                <el-select v-if="scope.row.redactStatus" v-model="scope.row.kqdl" placeholder="请选择" size="small" @change="GetARpro(scope.row)">
                                    <el-option v-for="(iteam, index) in ARtype" :key="index" :label="iteam.value" :value="iteam.code" />
                                </el-select>
                                <span v-else>{{ scope.row.kqdlName }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="考勤类型" :show-overflow-tooltip="true" width="120">
                            <template slot-scope="scope">
                                <el-select v-if="scope.row.redactStatus" v-model="scope.row.kqlx" placeholder="请选择" size="small" @change="Setcode(scope.row)">
                                    <el-option v-for="(iteam, index) in scope.row.ARpro" :key="index" :label="iteam.value" :value="iteam.code" />
                                </el-select>
                                <span v-else>{{ scope.row.kqlxName }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="产线/工序" :show-overflow-tooltip="true" width="100">
                            <template slot-scope="scope">
                                <el-col v-if="scope.row.redactStatus">
                                    <el-select v-if="scope.row.productLineSt" v-model="scope.row.productLine" placeholder="请选择" size="small">
                                        <el-option v-for="(item, index) in scope.row.productlineList" :key="index" :label="item.deptName" :value="item.deptId" />
                                    </el-select>
                                    <el-select v-else v-model="scope.row.productLine" placeholder="请选择" size="small" disabled>
                                        <el-option v-for="(item, index) in scope.row.productlineList" :key="index" :label="item.deptName" :value="item.deptId" />
                                    </el-select>
                                </el-col>
                                <span v-else>{{ scope.row.productLineName }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="deptIdName" label="班组" :show-overflow-tooltip="true" width="100">
                            <template slot-scope="scope">
                                <el-select v-if="scope.row.redactStatus" v-model="scope.row.deptId" placeholder="请选择" size="small">
                                    <el-option v-for="(iteam, index) in scope.row.Team" :key="index" :label="iteam.deptName" :value="iteam.deptId" />
                                </el-select>
                                <span v-else>{{ scope.row.deptIdName }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="userType" label="人员属性" :show-overflow-tooltip="true" width="100">
                            <template slot-scope="scope">
                                <el-select v-if="scope.row.redactStatus" v-model="scope.row.userType" placeholder="请选择" size="small">
                                    <el-option label="正式" value="正式" />
                                    <el-option label="借调" value="借调" />
                                    <el-option label="临时工" value="临时工" />
                                </el-select>
                                <span v-else>{{ scope.row.userType }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="userId" label="姓名（工号）" :show-overflow-tooltip="true" width="120">
                            <template slot-scope="scope">
                                <el-col v-if="scope.row.redactStatus">
                                    <span v-if="scope.row.userType !== '临时工'" style="cursor: pointer;" @click="selectUser(scope.row)">
                                        <em>{{ scope.row.userId }}</em>
                                        <em>点击选择人员</em>
                                    </span>
                                    <span v-if="scope.row.userType == '临时工'" style="cursor: pointer;" @click="dayLaborer(scope.row)">
                                        <em>{{ scope.row.userId }}</em>
                                        <em>点击输入临时工</em>
                                    </span>
                                </el-col>
                                <span v-else>{{ scope.row.userId }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="白/中/夜班" :show-overflow-tooltip="true" width="120">
                            <template slot-scope="scope">
                                <el-select v-if="scope.row.redactStatus" v-model="scope.row.classType" placeholder="请选择" size="small">
                                    <el-option v-for="(iteam, index) in productShift" :key="index" :label="iteam.value" :value="iteam.code" />
                                </el-select>
                                <span v-else>{{ scope.row.classTypeName }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="工作内容" :show-overflow-tooltip="true" min-width="120">
                            <template slot-scope="scope">
                                <el-input v-if="scope.row.redactStatus" v-model="scope.row.content" size="small" placeholder="手工录入" />
                                <span v-else>{{ scope.row.content }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="pieceTime" label="计件时数（小时）" :show-overflow-tooltip="true" width="100">
                            <template slot-scope="scope">
                                <el-input v-if="scope.row.redactStatus" v-model="scope.row.pieceTime" size="small" placeholder="手工录入" />
                                <span v-else>{{ scope.row.pieceTime }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="计时时数（小时）" :show-overflow-tooltip="true" width="100">
                            <template slot-scope="scope">
                                <el-input v-if="scope.row.redactStatus" v-model="scope.row.timedTime" size="small" placeholder="手工录入" />
                                <span v-else>{{ scope.row.timedTime }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="出勤时数（小时）" :show-overflow-tooltip="true" width="100">
                            <template slot-scope="scope">
                                {{ (scope.row.workTime = scope.row.timedTime + scope.row.pieceTime) }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="orderNo" label="审批意见" :show-overflow-tooltip="true" width="120">
                            <template slot-scope="scope">
                                <el-button type="primary" size="small" @click="auditLog(scope.row.id)">
                                    审核日志
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="备注" :show-overflow-tooltip="true" width="120">
                            <template slot-scope="scope">
                                <el-input v-if="scope.row.redactStatus" v-model="scope.row.remark" size="small" placeholder="手工录入" />
                                <span v-else>{{ scope.row.remark }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" fixed="right" width="50">
                            <template slot-scope="scope">
                                <div v-if="isAuth('sys:att:updateAtt')">
                                    <el-button v-if="scope.row.status !== 'checked' && scope.row.status !== 'submit'" style="padding: 0;" type="text" @click="updateAtt(scope.row)">
                                        {{ scope.row.redactStatus ? '保存' : '编辑' }}
                                    </el-button>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-row>
                <el-table v-if="!clearStatus" ref="table1" class="newTable" header-row-class-name="tableHead" :data="datalist" border tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;">
                    <el-table-column label="车间" :show-overflow-tooltip="true" width="120">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.workShop" placeholder="请选择" size="small" disabled>
                                <el-option v-for="(item, index) in workshop" :key="index" :label="item.deptName" :value="item.deptId" />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="考勤大类" :show-overflow-tooltip="true" width="120">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.kqdl" placeholder="请选择" size="small" @change="GetARpro(scope.row)">
                                <el-option v-for="(iteam, index) in ARtype" :key="index" :label="iteam.value" :value="iteam.code" />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="考勤类型" :show-overflow-tooltip="true" width="120">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.kqlx" placeholder="请选择" size="small" @change="Setcode(scope.row)">
                                <el-option v-for="(iteam, index) in scope.row.ARpro" :key="index" :label="iteam.value" :value="iteam.code" />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="产线/工序" :show-overflow-tooltip="true" width="120">
                        <template slot-scope="scope">
                            <el-select v-if="scope.row.productLineSt" v-model="scope.row.productLine" placeholder="请选择" size="small">
                                <el-option v-for="(item, index) in scope.row.productlineList" :key="index" :label="item.deptName" :value="item.deptId" />
                            </el-select>
                            <el-select v-else v-model="scope.row.productLine" placeholder="请选择" size="small" disabled>
                                <el-option v-for="(item, index) in scope.row.productlineList" :key="index" :label="item.deptName" :value="item.deptId" />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="deptId" label="班组" :show-overflow-tooltip="true" width="100">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.deptId" placeholder="请选择" size="small">
                                <el-option v-for="(iteam, index) in scope.row.Team" :key="index" :label="iteam.deptName" :value="iteam.deptId" />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="人员属性" :show-overflow-tooltip="true" width="140">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.userType" placeholder="请选择" size="small">
                                <el-option label="正式" value="正式" />
                                <el-option label="借调" value="借调" />
                                <el-option label="临时工" value="临时工" />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="姓名（工号）" :show-overflow-tooltip="true" width="120">
                        <template slot-scope="scope">
                            <span v-if="scope.row.userType !== '临时工'" style="cursor: pointer;" @click="selectUser(scope.row)">
                                <em v-for="(item, index) in scope.row.userId" :key="index">{{ item }}，</em>
                                <em>点击选择人员</em>
                            </span>
                            <span v-if="scope.row.userType == '临时工'" style="cursor: pointer;" @click="dayLaborer(scope.row)">
                                <em v-for="(item, index) in scope.row.userId" :key="index">{{ item }}，</em>
                                <em>点击输入临时工</em>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="orderNo" label="白/中/夜班" :show-overflow-tooltip="true" width="100">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.classType" placeholder="请选择" size="small">
                                <el-option v-for="(iteam, index) in productShift" :key="index" :label="iteam.value" :value="iteam.code" />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="工作内容" :show-overflow-tooltip="true" min-width="180">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.content" size="small" placeholder="手工录入" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="orderNo" label="计件时数（小时）" :show-overflow-tooltip="true" width="100">
                        <template slot-scope="scope">
                            <el-input v-if="scope.row.pieceTimeSt" v-model="scope.row.pieceTime" size="small" placeholder="手工录入" />
                            <el-input v-else v-model="scope.row.pieceTime" size="small" placeholder="手工录入" disabled />
                        </template>
                    </el-table-column>
                    <el-table-column label="计时时数（小时）" :show-overflow-tooltip="true" width="100">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.timedTime" size="small" placeholder="手工录入" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="orderNo" label="出勤时数（小时）" :show-overflow-tooltip="true" width="100">
                        <template slot-scope="scope">
                            {{ (scope.row.workTime = scope.row.timedTime * 1 + scope.row.pieceTime * 1 + '') }}
                        </template>
                    </el-table-column>
                    <el-table-column label="备注" :show-overflow-tooltip="true" width="120">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.remark" size="small" placeholder="手工录入" />
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="80">
                        <template slot-scope="scope">
                            <el-button type="danger" icon="el-icon-delete" circle size="small" @click="delUser(scope.row)" />
                        </template>
                    </el-table-column>
                </el-table>
                <el-row v-if="clearStatus">
                    <el-pagination :current-page="plantList.currPage" :page-sizes="[10, 20, 50]" :page-size="plantList.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="plantList.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                </el-row>
            </mds-card>

            <el-dialog title="人员分配" :close-on-click-modal="false" :visible.sync="visible">
                <el-row>
                    <el-col style="width: 500px;">
                        <el-transfer v-model="selctId" filterable :titles="['未分配人员', '已分配人员']" :filter-method="filterMethod" filter-placeholder="请输入用户名称" :data="userlist" />
                    </el-col>
                </el-row>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="visible = false">取消</el-button>
                    <el-button type="primary" @click="updatauser(row)">确定</el-button>
                </span>
            </el-dialog>
            <el-dialog ref="dayLaborer" width="450px" title="新增临时工" :close-on-click-modal="false" :visible.sync="visible1">
                <el-form :model="form" size="small" label-width="120px" class="dialogform">
                    <el-row>
                        <el-button v-if="!clearStatus" type="primary" size="small" style="float: right; margin-bottom: 10px;" @click="addDayLaborer(selctId2)">
                            新增
                        </el-button>
                    </el-row>
                    <el-form-item v-for="(item, index) in selctId2" :key="index" label="临时工姓名：">
                        <el-col :span="20">
                            <el-input v-model="selctId2[index]" />
                        </el-col>
                        <el-col :span="4">
                            <el-button v-if="!clearStatus" type="danger" icon="el-icon-delete" circle @click="delselctId2(item)" />
                        </el-col>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="visible1 = false">取消</el-button>
                    <el-button type="primary" @click="close(row)">确定</el-button>
                </span>
            </el-dialog>
            <el-dialog width="850px" title="借调人员" :close-on-click-modal="false" :visible.sync="visible2">
                <el-row>
                    <el-col style="width: 250px;">
                        <el-card style="height: 303px; overflow-y: scroll;">
                            <h3 style=" margin-bottom: 10px; color: black; font-size: 16px;">
                                组织架构
                            </h3>
                            <el-tree ref="tree2" :data="OrgTree" node-key="deptId" :default-expanded-keys="arrList" :expand-on-click-node="false" @node-click="setdetail" />
                        </el-card>
                    </el-col>
                    <el-col style="width: 250px;">
                        <el-card style="height: 303px; overflow-y: scroll;">
                            <el-input v-model="filterText" size="small" placeholder="搜索人员" />
                            <el-tree ref="userlistTree" :filter-node-method="filterNode" node-key="userId" :data="userlist" show-checkbox :props="userListTreeProps" :expand-on-click-node="false" @node-click="treeNodeClick" @check-change="userTree" />
                        </el-card>
                    </el-col>
                    <el-col style="width: 50px; padding: 70px 5px;">
                        <el-button v-if="tree2Status" type="primary" icon="el-icon-arrow-left" circle style="margin-bottom: 50px;" @click="delSelcted()" />
                        <el-button v-else type="primary" icon="el-icon-arrow-left" circle style="margin-bottom: 50px;" disabled @click="delSelcted()" />
                        <el-button v-if="tree1Status" type="primary" icon="el-icon-arrow-right" circle style="margin-left: 0;" @click="addSelcted()" />
                        <el-button v-else type="primary" icon="el-icon-arrow-right" circle style="margin-left: 0;" disabled @click="addSelcted()" />
                    </el-col>
                    <el-col style="width: 250px;">
                        <el-card style="height: 303px; overflow-y: scroll;">
                            <el-input v-model="filterText1" size="small" placeholder="搜索人员" />
                            <el-tree ref="userlistTree1" :filter-node-method="filterNode1" :data="selctId" show-checkbox :props="selctListTreeProps" :expand-on-click-node="false" @check-change="userTree1" />
                        </el-card>
                    </el-col>
                </el-row>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="visible2 = false">取消</el-button>
                    <el-button type="primary" @click="saveduser(row)">确定</el-button>
                </span>
            </el-dialog>
            <el-dialog title="审核日志" :close-on-click-modal="false" :visible.sync="visible3">
                <el-table :data="auditLogList" header-row-class-name="tableHead" border tooltip-effect="dark">
                    <el-table-column prop="changer" label="审核人" />
                    <el-table-column prop="memo" label="审核意见" />
                    <el-table-column prop="changed" label="审核时间" />
                </el-table>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="visible3 = false">关闭</el-button>
                </span>
            </el-dialog>
        </div>
        <redact-box>
            <template slot="button">
                <el-button v-if="isAuth('sys:att:updateAtt')" type="primary" class="button" size="small" @click="isRedact = !isRedact">
                    {{ isRedact ? '取消' : '编辑' }}
                </el-button>
                <template v-if="isRedact">
                    <el-button v-if="isAuth('sys:att:updateAtt')" type="primary" size="small" @click="savedOrSubmitForm('saved')">
                        保存
                    </el-button>
                    <el-button v-if="isAuth('sys:att:updateAtt')" type="primary" size="small" @click="SubmitForm">
                        提交
                    </el-button>
                </template>
            </template>
        </redact-box>
    </div>
</template>

<script>
import { BASICDATA_API, SYSTEMSETUP_API, AR_API } from '@/api/api';
import { setUserList, headanimation } from '@/net/validate';
// import { async } from ''
export default {
    name: 'Index',
    components: {},
    data() {
        return {
            isRedact: false,
            multipleSelection: [],
            form: {},
            visible: false,
            visible1: false,
            visible2: false,
            visible3: false,
            clearStatus: false,
            lodingS: false,
            tableLoding: false,
            redactStatus: false,
            factory: [],
            workshop: [],
            productline: [],
            datalist: [],
            auditLogList: [],
            ARtype: [],
            ARpro: [],
            OrgTree: [],
            arrList: [],
            filterText: '',
            filterText1: '',
            tree1Status: false,
            tree2Status: false,
            userListTreeProps: {
                label: function(data) {
                    return data.realName + '（' + (data.workNum !== null && data.workNum !== '' ? data.workNum : data.workNumTemp) + '）';
                },
                children: ''
            },
            selctListTreeProps: {
                label: function(data) {
                    return data.label;
                },
                children: ''
            },
            productShift: [],
            proline: [],
            Team: [],
            row: {},
            plantList: {
                factory: '',
                workShop: '',
                productLine: '',
                setDate:
                    new Date(new Date() - 24 * 60 * 60 * 1000).getFullYear().toString() +
                    '-' +
                    (new Date(new Date() - 24 * 60 * 60 * 1000).getMonth() + 1 >= 10 ? (new Date(new Date() - 24 * 60 * 60 * 1000).getMonth() + 1).toString() : '0' + (new Date(new Date() - 24 * 60 * 60 * 1000).getMonth() + 1)) +
                    '-' +
                    (new Date(new Date() - 24 * 60 * 60 * 1000).getDate() >= 10 ? new Date(new Date() - 24 * 60 * 60 * 1000).getDate().toString() : '0' + new Date(new Date() - 24 * 60 * 60 * 1000).getDate()),
                kqdl: '',
                currPage: 1,
                pageSize: 10,
                totalCount: 0
            },
            saveData: [],
            userlist: [],
            selctId: [],
            selctId2: [],
            filterMethod(query, item) {
                return item.screncon.indexOf(query) > -1;
            }
        };
    },
    computed: {},
    watch: {
        'plantList.factory'(n) {
            this.Getdeptbyid(n);
            this.GetProductShift(n);
            this.GetARtype(n);
            if (n) {
                this.getTree();
            }
        },
        'plantList.workShop'(n) {
            this.GetParentline(n);
        }
    },
    mounted() {
        this.Getdeptcode();
        this.GetProductShift();
        this.GetARtype();
        headanimation(this.$);
    },
    methods: {
        // 获取生产班次
        GetProductShift(factory) {
            this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {
                factory: factory,
                type: 'product_shift'
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.productShift = data.dicList;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 获取考勤属性
        GetARpro(row, callback) {
            this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {
                factory: this.plantList.factory,
                type: row.kqdl
            }).then(({ data }) => {
                if (data.code === 0) {
                    row.ARpro = data.dicList;
                    if (row.kqdl === 'normal_time') {
                        row.kqlx = 'normal_time';
                        this.Setcode(row);
                    } else {
                        row.kqlx = '';
                    }
                    this.datalist.splice(this.datalist.length, 0, {});
                    this.datalist.splice(this.datalist.length - 1, 1);
                } else {
                    this.$errorToast(data.msg);
                }
                if (callback) {
                    return callback(null, 'one');
                }
            });
        },
        // 获取考勤类型
        GetARtype() {
            this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {
                type: 'KQ_type'
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.ARtype = data.dicList;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 获取工厂
        Getdeptcode() {
            this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST').then(({ data }) => {
                if (data.code === 0) {
                    this.factory = data.typeList;
                    if (!this.plantList.factory && data.typeList.length > 0) {
                        this.plantList.factory = data.typeList[0].deptId;
                    }
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 获取车间
        Getdeptbyid(id) {
            this.plantList.workShop = '';
            this.plantList.productLine = '';
            if (id) {
                this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {
                    deptId: id
                }).then(({ data }) => {
                    if (data.code === 0) {
                        this.workshop = data.typeList;
                        if (!this.plantList.workShop && data.typeList.length > 0) {
                            this.plantList.workShop = data.typeList[0].deptId;
                        }
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            } else {
                this.workshop = [];
            }
        },
        // 获取产线
        GetParentline(id) {
            this.plantList.productLine = '';
            if (id) {
                this.$http(`${BASICDATA_API.FINDORGBYPARENTID_API}`, 'POST', {
                    parentId: id
                }).then(({ data }) => {
                    if (data.code === 0) {
                        this.productline = data.childList;
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            } else {
                this.productline = [];
            }
        },
        // 获取组织结构树
        getTree() {
            this.$http(`${BASICDATA_API.ORGSTRUCTURE_API}`, 'GET', {
                flag: this.plantList.factory
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.OrgTree = data.deptList;
                    this.arrList = [this.OrgTree[0].children[0].deptId];
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 审核日志
        auditLog(row) {
            this.auditLogList = [];
            this.visible3 = true;
            this.$http(`${AR_API.ARAUDITLOG_API}`, 'POST', { id: row }).then(({ data }) => {
                if (data.code === 0) {
                    this.auditLogList = data.list;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 考勤类型下拉
        Setcode(row, callback) {
            if (row.kqlx === 'CIP_time') {
                row.pieceTime = 0;
                row.pieceTimeSt = false;
                row.productLineSt = true;
            } else if (row.kqlx === 'CIP_time' || row.kqlx === 'door_time') {
                row.pieceTime = 0;
                row.pieceTimeSt = false;
                row.productLineSt = false;
                row.productLine = '';
            } else if (row.kqlx === 'normal_time') {
                row.pieceTime = 0;
                row.pieceTimeSt = false;
                row.productLine = '';
                row.productLineSt = false;
            } else {
                row.productLineSt = false;
                row.productLine = '';
                row.pieceTimeSt = true;
            }
            if (callback) {
                return callback(null, 'two');
            }
        },
        /* eslint-disable no-shadow */
        // 新增
        addAR() {
            if (this.plantList.workShop === '') {
                this.$warningToast('请选择车间后新增');
            } else {
                this.tableLoding = true;
                if (this.clearStatus) {
                    this.datalist = [];
                    this.clearStatus = false;
                }
                this.$http(`${BASICDATA_API.FINDORGBYPARENTID_API}`, 'POST', {
                    parentId: this.plantList.workShop
                }).then(({ data }) => {
                    if (data.code === 0) {
                        const productlineList = data.childList;
                        this.$http(`${BASICDATA_API.FINDTEAM_API}`, 'POST', {
                            id: this.plantList.workShop,
                            factory: this.plantList.factory
                        }).then(({ data }) => {
                            if (data.code === 0) {
                                let Listobj = {};
                                if (this.datalist.length === 0) {
                                    Listobj = {
                                        productLineSt: false,
                                        pieceTimeSt: true,
                                        workShop: this.plantList.workShop,
                                        kqdl: this.plantList.kqdl,
                                        kqlx: '',
                                        userType: '',
                                        content: '',
                                        classType: '',
                                        deptId: '',
                                        productlineList: productlineList,
                                        Team: data.teamList,
                                        userId: [],
                                        timedTime: '0',
                                        pieceTime: '0'
                                    };
                                } else {
                                    Listobj = {
                                        productLineSt: false,
                                        pieceTimeSt: true,
                                        workShop: this.datalist[this.datalist.length - 1].workShop,
                                        kqdl: this.datalist[this.datalist.length - 1].kqdl,
                                        kqlx: this.datalist[this.datalist.length - 1].kqlx,
                                        content: this.datalist[this.datalist.length - 1].content,
                                        userType: this.datalist[this.datalist.length - 1].userType,
                                        classType: this.datalist[this.datalist.length - 1].classType,
                                        deptId: this.datalist[this.datalist.length - 1].deptId,
                                        productlineList: productlineList,
                                        Team: data.teamList,
                                        userId: [],
                                        timedTime: this.datalist[this.datalist.length - 1].timedTime,
                                        pieceTime: this.datalist[this.datalist.length - 1].pieceTime
                                    };
                                }
                                // const asyncfn = require('async');
                                require('async').series(
                                    [
                                        callback => {
                                            this.GetARpro(Listobj, callback);
                                        },
                                        callback => {
                                            this.Setcode(Listobj, callback);
                                        }
                                    ],
                                    () => {
                                        this.datalist.push(Listobj);
                                        this.tableLoding = false;
                                    }
                                );
                            } else {
                                this.$errorToast(data.msg);
                            }
                        });
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            }
        },
        /* eslint-enable no-shadow */
        // 删除
        delDate() {
            if (this.multipleSelection.length === 0) {
                this.$warningToast('请选择要删除的考勤');
            } else {
                this.$confirm('确认删除考勤, 是否继续?', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(`${AR_API.ARDELAPI}`, 'POST', this.multipleSelection).then(({ data }) => {
                        if (data.code === 0) {
                            this.$successToast('删除成功!');
                            this.multipleSelection = [];
                            this.GetList();
                        } else {
                            this.$errorToast(data.msg);
                        }
                    });
                }).catch(() => {
                // this.$infoToast('已取消删除');
                });
            }
        },
        // 人员删除
        delUser(row) {
            this.datalist.splice(this.datalist.indexOf(row), 1);
        },
        // 获取列表
        GetList(st) {
            this.clearStatus = true;
            if (st) {
                this.plantList.currPage = 1;
            }
            if (!this.plantList.factory) {
                this.$warningToast('请选择工厂');
            }
            this.lodingS = true;
            this.$http(`${AR_API.ARLIST_API}`, 'POST', this.plantList).then(({ data }) => {
                if (data.code === 0) {
                    this.datalist = data.page.list;
                    this.plantList.currPage = data.page.currPage;
                    this.plantList.pageSize = data.page.pageSize;
                    this.plantList.totalCount = data.page.totalCount;
                } else {
                    this.$errorToast(data.msg);
                }
                this.lodingS = false;
            });
        },
        // 选择人员
        selectUser(row) {
            this.row = row;
            if (row.userType === '借调') {
                this.SetSelecd();
            } else if (row.userType === '正式') {
                if (row.workShop) {
                    this.GetUserforteam(row.deptId);
                } else {
                    this.$warningToast('请选择班组');
                }
            } else {
                this.$warningToast('请选择人员属性');
            }
        },
        // 反写选中人
        SetSelecd() {
            this.selctId = [];
            this.userlist = [];
            this.tree1Status = false;
            this.tree2Status = false;
            if (!this.clearStatus) {
                this.row.userId.forEach((item) => {
                    this.selctId.push({ key: item, label: item });
                });
            } else {
                this.selctId.push({ key: this.row.userId, label: this.row.userId });
            }
            this.visible2 = true;
        },
        // 根据部门id查人
        /* eslint-disable @typescript-eslint/camelcase */
        GetUserforteam(id) {
            this.$http(`${SYSTEMSETUP_API.USERALL_API}`, 'POST', id ? { dept_id: id } : {}).then(({ data }) => {
                if (data.code === 0) {
                    this.userlist = setUserList(data.listUser);
                    if (!this.clearStatus) {
                        this.selctId = this.row.userId;
                    } else {
                        this.selctId = [this.row.userId];
                        let usertemp = 1;
                        this.userlist.forEach((item) => {
                            if (item.key === this.row.userId) {
                                usertemp++;
                            }
                        });
                        if (usertemp === 1) {
                            this.selctId = [];
                        } else {
                            this.selctId = [this.row.userId];
                        }
                    }
                    this.visible = true;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        /* eslint-enable @typescript-eslint/camelcase */
        // 确定人员
        updatauser(row) {
            if (!this.clearStatus) {
                row.userId = this.selctId;
            } else {
                row.userId = this.selctId[0];
            }
            this.visible = false;
        },
        // 搜索人员
        filterNode(value, data) {
            if (!value) return true;
            const workNum = data.workNum ? data.workNum : data.workNumTemp;
            return data.realName.indexOf(value) !== -1 || workNum.indexOf(value) !== -1;
        },
        filterNode1(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        // 根据组织架构查人
        setdetail(paras) {
            this.$http(`${SYSTEMSETUP_API.USERLIST_API}`, 'POST', {
                deptId: paras.deptId,
                param: '',
                currPage: '1',
                pageSize: '1000'
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.userlist = data.page.list;
                    this.tree1Status = false;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 树节点点击
        treeNodeClick(data) {
            if (JSON.stringify(this.$refs.userlistTree.getCheckedNodes()).indexOf(JSON.stringify(data)) === -1) {
                const arr = this.$refs.userlistTree.getCheckedNodes();
                arr.push(data);
                this.$refs.userlistTree.setCheckedNodes(arr);
            }
        },
        // 往左
        delSelcted() {
            this.$refs.userlistTree1.getCheckedNodes().forEach((item) => {
                this.selctId.splice(this.selctId.indexOf(item), 1);
            });
            this.tree2Status = false;
        },
        // 往右
        addSelcted() {
            this.$refs.userlistTree.getCheckedNodes().forEach((item) => {
                const obj = {};
                obj.label = item.realName + '（' + (item.workNum !== null && item.workNum !== '' ? item.workNum : item.workNumTemp) + '）';
                if (JSON.stringify(this.selctId).indexOf(JSON.stringify(obj)) === -1) {
                    this.selctId.push(obj);
                }
            });
        },
        userTree() {
            if (this.$refs.userlistTree.getCheckedNodes().length > 0) {
                this.tree1Status = true;
            } else {
                this.tree1Status = false;
            }
        },
        userTree1() {
            if (this.$refs.userlistTree1.getCheckedNodes().length > 0) {
                this.tree2Status = true;
            } else {
                this.tree2Status = false;
            }
        },
        // 借调人员确定
        saveduser(row) {
            if (!this.clearStatus) {
                row.userId = [];
                this.selctId.forEach(item => {
                    row.userId.push(item.label);
                });
            } else {
                row.userId = this.selctId[0].label;
            }
            this.visible2 = false;
        },
        // 选择输入临时工
        dayLaborer(row) {
            this.row = row;
            this.visible1 = true;
            this.selctId2 = [];
            if (!this.clearStatus) {
                this.row.userId.forEach(item => {
                    this.selctId2.push(item);
                });
            } else {
                this.selctId2.push(this.row.userId);
            }
        },
        // 临时工添加
        addDayLaborer(row) {
            row.push('');
        },
        // 临时工确定
        close(row) {
            if (!this.clearStatus) {
                row.userId = this.selctId2;
            } else {
                row.userId = this.selctId2[0];
            }
            this.visible1 = false;
        },
        // 临时工删除
        delselctId2(item) {
            this.selctId2.splice(this.selctId2.indexOf(item), 1);
        },
        /* eslint-disable no-shadow */
        // 编辑
        updateAtt(row) {
            this.tableLoding = true;
            if (row.redactStatus) {
                this.$http(`${AR_API.ARSUBORUP_API}`, 'POST', [row]).then(({ data }) => {
                    if (data.code === 0) {
                        this.$notify({
                            title: '成功',
                            message: '操作成功',
                            type: 'success'
                        });
                        this.tableLoding = false;
                        this.GetList(true);
                    } else {
                        this.$errorToast(data.msg);
                    }
                    this.lodingS = false;
                });
            } else {
                row.redactStatus = true;
                this.Setcode(row);
                this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {
                    factory: this.plantList.factory,
                    type: row.kqdl
                }).then(({ data }) => {
                    if (data.code === 0) {
                        row.ARpro = data.dicList;
                    }
                });
                this.$http(`${BASICDATA_API.FINDORGBYPARENTID_API}`, 'POST', {
                    parentId: row.workShop
                }).then(({ data }) => {
                    if (data.code === 0) {
                        const productlineList = data.childList;
                        this.$http(`${BASICDATA_API.FINDTEAM_API}`, 'POST', {
                            id: row.workShop,
                            factory: row.factory
                        }).then(({ data }) => {
                            if (data.code === 0) {
                                row.productlineList = productlineList;
                                row.Team = data.teamList;
                                this.datalist.splice(this.datalist.length, 0, {});
                                this.datalist.splice(this.datalist.length - 1, 1);
                                this.tableLoding = false;
                            }
                        });
                    }
                });
            }
        },
        /* eslint-enable no-shadow */
        /**
         * 保存
         */
        // 校验
        datarul(data) {
            let st = true;
            data.forEach((item) => {
                if (item.kqdl && item.kqlx && item.userType && item.userId.length !== 0 && item.classType && (item.timedTime || item.timedTime === 0)) {
                    //
                } else {
                    this.$warningToast('考勤必填项未填写');
                    st = false;
                    return false;
                }
            });
            return st;
        },
        // 保存
        savedOrSubmitForm(st) {
            if (this.clearStatus && this.multipleSelection.length <= 0) {
                this.$warningToast('请选择考勤');
                return false;
            }
            this.$confirm(`确认保存, 是否继续?`, '保存', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (!this.clearStatus) {
                    this.disData(st);
                    this.lodingS = true;
                    this.$http(`${AR_API.ARADD_API}`, 'POST', this.saveData).then(({ data }) => {
                        if (data.code === 0) {
                            this.$notify({
                                title: '成功',
                                message: '操作成功',
                                type: 'success'
                            });
                            this.GetList(true);
                        } else {
                            this.$errorToast(data.msg);
                        }
                        this.lodingS = false;
                    });
                } else {
                    this.subAutio(st);
                }
            }).catch(() => {
                // this.$infoToast('已取消删除');
            });
        },
        // 提交
        SubmitForm() {
            if (this.clearStatus && this.multipleSelection.length <= 0) {
                this.$warningToast('请选择考勤');
                return false;
            }
            this.$confirm(`确认提交, 是否继续?`, '提交', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (!this.clearStatus) {
                    this.disData('submit');
                    if (!this.datarul(this.datalist)) {
                        return false;
                    }
                    this.lodingS = true;
                    this.$http(`${AR_API.ARADD_API}`, 'POST', this.saveData).then(({ data }) => {
                        if (data.code === 0) {
                            this.$notify({
                                title: '成功',
                                message: '操作成功',
                                type: 'success'
                            });
                            this.GetList(true);
                        } else {
                            this.$errorToast(data.msg);
                        }
                        this.lodingS = false;
                    });
                } else {
                    this.subAutio('submit');
                }
            }).catch(() => {
                // this.$infoToast('已取消删除');
            });
        },
        disData(st) {
            this.saveData = [];
            for (let j = 0; j < this.datalist.length; j++) {
                for (let i = 0; i < this.datalist[j].userId.length; i++) {
                    const temarr = JSON.parse(JSON.stringify(this.datalist[j]));
                    temarr.userId = this.datalist[j].userId[i];
                    temarr.factory = this.plantList.factory;
                    temarr.kqrq = this.plantList.setDate;
                    temarr.status = st;
                    this.saveData.push(temarr);
                }
            }
        },
        // updata
        subAutio(st) {
            if (this.multipleSelection.length <= 0) {
                this.$warningToast('请选择考勤');
            } else {
                if (st === 'submit') {
                    if (!this.datarul(this.multipleSelection)) {
                        return false;
                    }
                }
                this.lodingS = true;
                this.multipleSelection.forEach((item) => {
                    item.status = st;
                });
                this.$http(`${AR_API.ARSUBORUP_API}`, 'POST', this.multipleSelection).then(({ data }) => {
                    if (data.code === 0) {
                        this.$notify({
                            title: '成功',
                            message: '操作成功',
                            type: 'success'
                        });
                        this.GetList(true);
                    } else {
                        this.$errorToast(data.msg);
                    }
                    this.lodingS = false;
                });
            }
        },
        // 表格选中
        handleSelectionChange(val) {
            this.multipleSelection = [];
            val.forEach((item) => {
                this.multipleSelection.push(item);
            });
        },
        // 审核通过禁用
        checkboxT(row) {
            if (row.status === 'checked' || row.status === 'submit') {
                return 0;
            }
                return 1;

        },
        // 改变每页条数
        handleSizeChange(val) {
            this.plantList.pageSize = val;
            this.GetList();
        },
        // 跳转页数
        handleCurrentChange(val) {
            this.plantList.currPage = val;
            this.GetList();
        }
    }
};
</script>

<style lang="scss" scoped>
.searchCard {
    margin-bottom: 0;
}
.searchCard,
.tableCard {
    position: relative;
    .toggleSearchTop {
        position: absolute;
        top: 0;
        left: 0;
        display: none;
        width: 100%;
        text-align: center;
        cursor: pointer;
    }
    .toggleSearchBottom {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        text-align: center;
        cursor: pointer;
    }
    .el-icon-caret-top::before,
    .el-icon-caret-bottom::before {
        color: #dcdfe6;
    }
}
</style>
