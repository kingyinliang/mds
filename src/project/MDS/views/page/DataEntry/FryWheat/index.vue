<template>
    <el-col>
        <div class="header_main">
            <el-card class="searchCard queryHead">
                <el-form :model="plantList" size="small" :inline="true" label-position="right" label-width="70px" class="multi_row">
                    <el-form-item label="生产工厂：">
                        <el-select v-model="plantList.factoryIDValue" class="selectwpx" style="width: 140px;" :disabled="factoryList.length===0" @change="changeFactoryOptions(plantList.factoryIDValue)">
                            <el-option v-for="sole in factoryList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="生产车间：">
                        <el-select v-model="plantList.workshopIDValue" class="selectwpx" style="width: 140px;" :disabled="plantList.factoryIDValue === '' || workshopList.length === 0" @change="changeWorkshopOptions(plantList.workshopIDValue)">
                            <el-option v-for="sole in workshopList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="生产日期：">
                        <el-date-picker v-model="plantList.productDate" type="date" value-format="yyyy-MM-dd" style="width: 135px;" />
                    </el-form-item>
                    <el-form-item label="生产订单：">
                        <el-input v-model="plantList.orderNo" type="text" clearable style="width: 140px;" />
                    </el-form-item>
                    <el-form-item label="生产状态：">
                        <el-select v-model="plantList.status" class="selectwpx" style="width: 140px;">
                            <el-option label="正常生产" value="normal" />
                            <el-option v-if="isAuth('wht:user:listUser')" label="无生产" value="abnormal" />
                        </el-select>
                    </el-form-item>
                    <el-form-item style="float: right;">
                        <el-button v-if="isBtnDefaultSet" type="primary" size="small" @click="btnGetResultData(true)">
                            查询
                        </el-button>
                        <template v-if="processStatus === 'abnormal'">
                            <el-button v-if="plantList.status ==='abnormal' &&isDisabled === true && isAuth('wht:user:updateUser')" type="primary" size="small" @click="btnEditResultData()">
                                编辑
                            </el-button>
                            <el-button v-if="isDisabled === false" type="primary" size="small" @click="btnEditReturn">
                                返回
                            </el-button>
                        </template>
                        <template v-if="processStatus === 'abnormal' && isDisabled === false">
                            <el-button type="primary" size="small" @click="btnEditAddPeople">
                                新增
                            </el-button>
                            <el-button type="primary" size="small" @click="btnEditSave">
                                保存
                            </el-button>
                        </template>
                    </el-form-item>
                </el-form>
            </el-card>
            <el-row v-if="processStatus === 'normal'" :gutter="20" class="cardList">
                <el-col v-for="(item, index) in FryWheatList" id="normal" :key="index" :span="12">
                    <el-card class="card-item">
                        <div class="title_left" style=" margin-bottom: 8px; font-weight: 600; font-size: 16px;">
                            工序：
                            <span style="color: red;">
                                {{ item.productLineName }}
                            </span>
                            <div style="float: right; font-weight: 400; font-size: 14px;">
                                <span
                                    class="points"
                                    style="margin-top: 5px;"
                                    :style="{
                                        background: item.orderStatus === 'noPass' ? 'red' : item.orderStatus === 'checked' ? '#67C23A' : item.orderStatus === 'submit' ? '#1890ff' : item.orderStatus === 'saved' ? '#1890ff' : '#7ED321',
                                    }"
                                />订单状态：<i
                                    :style="{
                                        color: item.orderStatus === 'noPass' ? 'red' : item.orderStatus === 'checked' ? '#67C23A' : '',
                                    }"
                                >{{ item.orderStatus === 'submit' ? '已提交' : item.orderStatus === 'checked' ? '审核通过' : item.orderStatus === 'noPass' ? '审核不通过' : item.orderStatus === 'saved' ? '已保存' : item.orderStatus === '已同步' ? '未录入' : item.orderStatus }}</i>
                            </div>
                        </div>
                        <div class="sole_cont">
                            <el-form size="small" :inline="true" label-position="right" label-width="90px">
                                <div class="itemImg">
                                    <img :src="'data:image/gif;base64,' + item.img" alt="" style="width: 100%; min-height: 181px;">
                                </div>
                                <div class="title_left">
                                    <el-button v-if="isAuth('wht:order:list') || isAuth('sys:whtPwMaterial:list')" type="primary" size="small" style="float: right; margin-top: 14px; color: white; background-color: #1890ff;" @click="recordData(item)">
                                        数据录入
                                    </el-button>
                                </div>
                                <div class="normal_bottom">
                                    <el-form-item label="订单号：" class="width50b">
                                        <el-select v-model="item.orderNo" placeholder="请选择" :change="orderChange(item)" style="width: 150px;">
                                            <el-option v-for="(subItem, subIndex) in item.order_arr" :key="subIndex" :label="subItem" :value="subItem" />
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="计划产量：" class="width50b">
                                        <div style="width: 152px; padding-left: 12px; background: rgba(245, 245, 245, 1); border-radius: 4px;">
                                            &nbsp;{{ (item.planOutput || 0) + ' ' + item.outputUnit }}
                                        </div>
                                    </el-form-item>
                                    <el-form-item label="品项：" class="width50b">
                                        <div style="width: 152px; padding-left: 12px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; background: rgba(245, 245, 245, 1); border-radius: 4px;">
                                            &nbsp;{{ item.materialCode + ' ' + item.materialName }}
                                        </div>
                                    </el-form-item>
                                    <el-form-item label="实际产量：" class="width50b">
                                        <div style="width: 152px; padding-left: 12px; background: rgba(245, 245, 245, 1); border-radius: 4px;">
                                            &nbsp;{{ (item.realOutput || 0) + ' ' + item.outputUnit }}
                                        </div>
                                    </el-form-item>
                                </div>
                            </el-form>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <el-row v-else-if="processStatus === 'abnormal' && isAbnormalDataEditStatus === true">
                <div style="min-height: 340px;">
                    <el-table border header-row-class-name="tableHead" :data="dataList">
                        <el-table-column label="序号" width="50" prop="id" type="index" />
                        <el-table-column label="中/白/夜班" prop="classType" width="100">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.classType" placeholder="请选择" :disabled="isDisabled" size="small">
                                    <el-option v-for="(iteam, index) in productShift" :key="index" :label="iteam.value" :value="iteam.code" />
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column label="班组/工序" width="120">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.deptId" placeholder="请选择" size="small" :disabled="isDisabled" @change="changeProcType(scope.row)">
                                    <el-option v-for="sole in processesList" :key="sole.deptId" :value="sole.deptId" :label="sole.deptName" />
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column label="人员属性" prop="userType" width="110">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.userType" placeholder="请选择" size="small" :disabled="isDisabled" @change="changeProcType(scope.row)">
                                    <el-option v-for="sole in userTypeList" :key="sole.value" :value="sole.value" :label="sole.value" />
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column prop="userId" label="姓名（工号）" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <el-col>
                                    <span v-if="!isDisabled" style="cursor: pointer;" @click="selectUser(scope.row)">
                                        <i v-if="scope.row.userId !== undefined">{{ scope.row.userId.join(',') }}</i>
                                        <span>
                                            <i v-if="scope.row.userType == '临时工'">点击输入临时工</i>
                                            <i v-else>点击选择人员</i>
                                        </span>
                                    </span>
                                    <span v-else style="cursor: pointer;">
                                        <i v-if="scope.row.userId !== undefined">{{ scope.row.userId.join(',') }}</i>
                                        <span>
                                            <i v-if="scope.row.userType == '临时工'">点击输入临时工</i>
                                            <i v-else>点击选择人员</i>
                                        </span>
                                    </span>
                                </el-col>
                            </template>
                        </el-table-column>
                        <el-table-column label="开始时间" prop="startDate">
                            <template slot-scope="scope">
                                <el-date-picker v-model="scope.row.startDate" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" placeholder="选择时间" size="small" style="width: 175px;" :disabled="isDisabled" />
                            </template>
                        </el-table-column>
                        <el-table-column label="用餐时间" prop="dinner" width="80">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.dinner" size="small" :disabled="isDisabled" />
                            </template>
                        </el-table-column>
                        <el-table-column label="结束时间" prop="endDate">
                            <template slot-scope="scope">
                                <el-date-picker v-model="scope.row.endDate" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" placeholder="选择时间" size="small" style="width: 175px;" :disabled="isDisabled" />
                            </template>
                        </el-table-column>
                        <el-table-column label="备注" prop="remark" width="100px">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.remark" size="small" :disabled="isDisabled" />
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" fixed="right" width="50">
                            <template slot-scope="scope">
                                <el-button v-if="isAuth('wht:user:delUser')" type="danger" icon="el-icon-delete" circle size="small" :disabled="isDisabled" @click="delUser(scope.row)" />
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-row style=" margin-top: 10px; font-size: 14px; line-height: 30px;">
                        实际作业人数: {{ countMan }}
                    </el-row>
                </div>
                <el-row v-if="addRowStatus != 1">
                    <el-pagination :current-page="plantList.currPage" :page-sizes="[10, 20, 50]" :page-size="plantList.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="plantList.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                </el-row>
            </el-row>
        </div>
        <temporary-worker ref="temporaryWorker" @changeUser="changeUser" />
        <loaned-personnel ref="loanedPersonnel" :org-tree="orgTree" :arr-list="arrList" @changeUser="changeUser" />
        <official-worker ref="officialWorker" @changeUser="changeUser" />
    </el-col>
</template>

<script>
import { BASICDATA_API, WHT_API, SYSTEMSETUP_API } from '@/api/api';
import { dateFormat, orderList } from '@/net/validate';
import TemporaryWorker from '@/views/components/TemporaryWorker';
import LoanedPersonnel from '@/views/components/LoanedPersonnel';
import officialWorker from '@/views/components/OfficialWorker';
export default {
    name: 'Index',
    components: {
        TemporaryWorker,
        LoanedPersonnel,
        officialWorker
    },
    data() {
        return {
            FryWheatList: [],
            lodingStatus: false,
            isDisabled: true,
            plantList: {
                factoryIDValue: '',
                workshopIDValue: '',
                productDate: '',
                status: 'normal',
                currPage: 1,
                pageSize: 10,
                totalCount: 0,
                orderId: '',
                orderNo: ''
            },
            factoryList: [],
            workshopList: [],
            productDate: '',
            factoryID: '',
            processStatus: '', // plantList.status
            dataList: [], // 查询列表
            addRowStatus: 0, // 人员新增 1增
            dayTypeList: [{ value: '白班' }, { value: '中班' }, { value: '夜班' }],
            userTypeList: [{ value: '正式' }, { value: '借调' }, { value: '临时工' }],
            processesList: [], // 车间工序list
            row: {},
            orgTree: [],
            arrList: [],
            pwshow: false,
            abnorsave: true,
            totalList: '',
            productShift: [], // 生产班次
            oriAPIData: [], // 1.装载表单选单架构
            isBtnDefaultSet: true,
            isAbnormalDataEditStatus: false
        };
    },
    computed: {
        mainTabs: {
            get() {
                return this.$store.state.common.mainTabs;
            },
            set(val) {
                this.$store.commit('common/updateMainTabs', val);
            }
        },
        mainTabsActiveName: {
            get() {
                return this.$store.state.common.mainTabsActiveName;
            },
            set(val) {
                this.$store.commit('common/updateMainTabsActiveName', val);
            }
        },
        FWfactoryid: {
            get() {
                return this.$store.state.common.FWfactoryid;
            },
            set(val) {
                this.$store.commit('common/updateFWFactoryid', val);
            }
        },
        FWworkShop: {
            get() {
                return this.$store.state.common.FWworkShop;
            },
            set(val) {
                this.$store.commit('common/updateFWWorkShop', val);
            }
        },
        FWproductDate: {
            get() {
                return this.$store.state.common.FWproductDate;
            },
            set(val) {
                this.$store.commit('common/updateFWProductDate', val);
            }
        },
        FWorderNo: {
            get() {
                return this.$store.state.common.FWorderNo;
            },
            set(val) {
                this.$store.commit('common/updateFWOrderNo', val);
            }
        },
        PkgproductDate: {
            get() {
                return this.$store.state.common.PkgproductDate;
            },
            set(val) {
                this.$store.commit('common/updateProductDate', val);
            }
        },
        fwFactoryName: {
            get() {
                return this.$store.state.common.FWfactoryName;
            },
            set(val) {
                this.$store.commit('common/updateFWfactoryName', val);
            }
        },
        fwWorkShopName: {
            get() {
                return this.$store.state.common.FWworkShopName;
            },
            set(val) {
                this.$store.commit('common/updateFWWorkShopName', val);
            }
        },
        FWorderId: {
            get() {
                return this.$store.state.common.FWorderId;
            },
            set(val) {
                this.$store.commit('common/updateFWorderId', val);
            }
        },
        FWproductLine: {
            get() {
                return this.$store.state.common.FWproductLine;
            },
            set(val) {
                this.$store.commit('common/updateFWproductLine', val);
            }
        },
        FWproductLineName: {
            get() {
                return this.$store.state.common.FWproductLineName;
            },
            set(val) {
                this.$store.commit('common/updateFWproductLineName', val);
            }
        },
        PWorder: {
            get() {
                return this.$store.state.common.PWorder;
            },
            set(val) {
                this.$store.commit('common/updatePWorder', val);
            }
        },
        countMan: function() {
            let num = 0;
            if (this.dataList) {
                this.dataList.forEach(item => {
                    if (item.userId) {
                        num += item.userId.length;
                    }
                });
            }
            return num;
        }
    },
    mounted() {
        if (this.PkgproductDate === '') {
            this.plantList.productDate = dateFormat(new Date(), 'yyyy-MM-dd');
        } else {
            this.plantList.productDate = this.PkgproductDate;
        }

        this.getOriDataFromAPI().then(() => {
            // 初始化搜寻条件
            this.plantList.factoryIDValue = this.oriAPIData[0].deptId;
            if (this.oriAPIData[0].workshop.length !== 0) {
                this.workshopList = this.oriAPIData[0].workshop;
                this.plantList.workshopIDValue = this.oriAPIData[0].workshop[0].deptId;
            } else {
                this.workshopList = [];
                this.plantList.workshopIDValue = '';
            }
        });

        if (this.FWfactoryid) {
            this.getWorkshopList(this.FWfactoryid);
        }

        this.getTree();
    },
    methods: {
        // 获取生产班次
        getProductShift() {
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
        recordData(item) {
            if (!item.productDate) {
                if (!this.plantList.productDate) {
                    item.productDate = dateFormat(new Date(), 'yyyy-MM-dd');
                } else {
                    item.productDate = this.plantList.productDate;
                }
            }
            this.FWworkShop = this.workshopList;
            this.FWfactoryid = this.factoryID;
            if (item.productLineName === '炒麦') {
                // 存储炒麦的state
                this.FWproductDate = this.productDate;
                this.FWorderNo = item.orderNo;
                this.FWproductLine = item.productLine;
                this.FWproductLineName = item.productLineName;
                if (item.orderNo && item.properties) {
                    this.mainTabs = this.mainTabs.filter(subItem => subItem.name !== 'DataEntry-FryWheat-EnterData-dataEntryIndex');
                    this.FWorderId = item.orderIdList[item.orderNo];
                    setTimeout(() => {
                        this.$router.push({
                            name: `DataEntry-FryWheat-EnterData-dataEntryIndex`
                        });
                    }, 100);
                } else {
                    this.$warningToast('请选择订单号');
                }
            } else {
                // 存储脱皮的state
                const order = {
                    orderNo: item.orderNo ? item.orderNo : '',
                    orderId: '',
                    productLine: item.productLine,
                    productLineName: item.productLineName,
                    productDate: this.productDate
                };
                this.mainTabs = this.mainTabs.filter(subItem => subItem.name !== 'DataEntry-FryWheat-PwWheat-dataEntryIndex');
                this.PWorder = order;
                setTimeout(() => {
                    this.$router.push({
                        name: `DataEntry-FryWheat-PwWheat-dataEntryIndex`
                    });
                }, 100);
            }
        },
        // 获取工厂
        getFactoryList() {
            return new Promise((resolve, reject) => {
                this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, `POST`, {}, false, false, false).then(({ data }) => {
                    if (data.code === 0) {
                        resolve(data.typeList);
                    } else {
                        this.$notify.error({ title: '错误', message: data.msg });
                        reject(data.msg);
                    }
                });
            })
        },
        // 根据工厂获车间
        getWorkshopList(fid) {
            return new Promise((resolve, reject) => {
                this.plantList.workshopIDValue = '';
                if (fid) {
                    this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', { deptId: fid, deptName: '炒麦' }, false, false, false).then(({ data }) => {
                        if (data.code === 0) {
                            resolve(data.typeList);
                        } else {
                            this.$notify.error({
                                title: '错误',
                                message: data.msg
                            });
                            reject(data.msg);
                        }
                    });
                } else {
                    this.workshopList = [];
                }
            })
        },
        // 获取工厂车间
        getOriDataFromAPI() {
            return new Promise((resolve) => {
                this.getProductShift(); // 获取生产班次
                this.getFactoryList().then(valueFactory => {
                    this.oriAPIData = [];
                    this.factoryList = [];
                    for (let i = 0; i < valueFactory.length; i++) {
                        const dataTempF = {
                            deptId: valueFactory[i].deptId,
                            deptName: valueFactory[i].deptName,
                            workshop: []
                        };
                        this.factoryList.push({
                            deptId: valueFactory[i].deptId,
                            deptName: valueFactory[i].deptName
                        });
                        this.getWorkshopList(valueFactory[i].deptId).then(valueWorkshop => {
                            if (valueWorkshop.length !== 0) {
                                for (let j = 0; j < valueWorkshop.length; j++) {
                                    const dataTempW = {
                                        deptId: valueWorkshop[j].deptId,
                                        deptName: valueWorkshop[j].deptName
                                    };
                                    dataTempF.workshop.push(dataTempW);
                                }
                            }
                            this.oriAPIData.push(dataTempF);
                            resolve();
                        });
                    }
                });
            });
        },
        // 改变工厂选单数据
        changeFactoryOptions(flag) {
            const item = this.oriAPIData.find(ele => ele.deptId === flag);
            if (item.workshop.length !== 0) {
                this.workshopList = item.workshop;
            } else {
                this.workshopList = [];
                this.plantList.workshopIDValue = '';
            }
        },
        // 改变车间选单数据  // 根据车间获取工序
        changeWorkshopOptions(flag) {
            this.processesList = [];
            this.$http(`${BASICDATA_API.FINDTEAM_API}`, 'POST', {
                id: flag,
                factory: this.plantList.factoryIDValue
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.processesList = data.teamList;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 获取组织结构树
        getTree() {
            this.$http(`${BASICDATA_API.ORGSTRUCTURE_API}`, 'GET', {}, false, false, false).then(({ data }) => {
                if (data.code === 0) {
                    this.orgTree = data.deptList;
                    this.arrList = [this.orgTree[0].children[0].deptId];
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 查询
        btnGetResultData() {
            if (this.plantList.factoryIDValue === '') {
                this.$warningToast('请选择工厂');
                return;
            }
            if (this.plantList.workshopIDValue === '') {
                this.$warningToast('请选择车间');
                return;
            }
            if ((this.plantList.productDate === '' || !this.plantList.productDate) && this.plantList.orderNo === '') {
                this.$warningToast('生产日期或订单请选填一项');
                return false;
            }
            this.lodingStatus = true;
            if (this.plantList.status === 'normal') {
                // 正常生产
                if (this.plantList.workshopIDValue === 'DA8DB9D19B4043B8A600B52D9FEF93E3') {
                    this.pwshow = true;
                } else {
                    this.pwshow = false;
                }
                const targetWorkshopList = this.workshopList.find(item => item.deptId === this.plantList.workshopIDValue)
                if (targetWorkshopList && targetWorkshopList['deptName']) {
                    this.fwWorkShopName = targetWorkshopList['deptName'];
                }
                const targetFactoryList = this.factoryList.find(item => item.deptId === this.plantList.factoryIDValue)
                if (targetFactoryList && targetFactoryList['deptName']) {
                    this.fwFactoryName = targetFactoryList['deptName'];
                }
                console.log(this.plantList.workshopIDValue)
                this.$http(`${WHT_API.CINDEXORDERLIST_API}`, 'POST', {
                    workShop: this.plantList.workshopIDValue,
                    productDate: this.plantList.productDate,
                    orderNo: this.plantList.orderNo
                }).then(({ data }) => {
                    if (data.code === 0) {
                        if (data.list.length !== 0) {
                            console.log('===normal===')
                            console.log(data)
                            this.FryWheatList = orderList(data.list);
                            // this.workShop = this.plantList.workshopIDValue;
                            // this.workshopList = this.plantList.workshopIDValue;
                            this.productDate = this.plantList.productDate;
                            this.factoryID = this.plantList.factoryIDValue;
                            this.FWproductDate = this.plantList.productDate;
                            this.processStatus = this.plantList.status;
                        } else {
                            this.$infoToast('该搜寻条件无任何资料！');
                        }
                    } else {
                        this.$errorToast(data.msg);
                    }
                    this.lodingStatus = false;
                });
            } else if (this.plantList.status === 'abnormal') {
                // 无生产
                this.addRowStatus = 0;
                this.isDisabled = true;
                this.$http(`${WHT_API.CINDEXLISTUSER}`, 'POST', {
                    deptId: this.plantList.workshopIDValue,
                    productDate: this.plantList.productDate
                }).then(({ data }) => {
                    if (data.code === 0) {
                        console.log('===abnormal===')
                        console.log(data)
                        if (data.infoUser.length !== 0) {
                            if (this.plantList.currPage === 1) {
                                this.totalList = data.infoUser;
                                this.dataList = data.infoUser.slice(0, this.plantList.pageSize);
                            }
                            // this.dataList = data.infoUser
                            this.plantList.totalCount = data.infoUser.length;
                            this.processStatus = this.plantList.status;
                            this.isAbnormalDataEditStatus = true;
                        } else {
                            // this.processStatus = '';
                            this.dataList = [];
                            this.isAbnormalDataEditStatus = false;
                            this.processStatus = this.plantList.status;
                            console.log('this.processStatus:' + this.processStatus)
                            this.$infoToast('该搜寻条件无任何资料！');
                        }

                    } else {
                        this.$notify.error({
                            title: '错误',
                            message: data.msg
                        });
                    }
                    this.lodingStatus = false;
                });
            } else {
                this.$warningToast('请选择生产状态');

            }
        },
        btnEditResultData() {
            this.isDisabled = false;
            this.isBtnDefaultSet = false;
            this.isAbnormalDataEditStatus = true;
        },
        btnEditReturn() {
            this.isDisabled = true; // 新增保存按钮隐藏
            this.isBtnDefaultSet = true;
            if (this.dataList.length !== 0) {
                this.isAbnormalDataEditStatus = true;
            } else {
                this.isAbnormalDataEditStatus = false;
            }
        },
        // 订单号下拉
        orderChange(row) {
            console.log(row)
            if (row.orderNo && row.orderNo !== row.orderNo2) {
                this.$http(`${WHT_API.CINDEXORDERLIST_API}`, 'POST', {
                    workShop: this.workshopList,
                    productDate: this.productDate,
                    orderNo: row.orderNo
                }).then(({ data }) => {
                    if (data.code === 0) {
                        row.orderNo2 = row.orderNo;
                        row.materialCode = data.list[0].materialCode;
                        row.materialName = data.list[0].materialName;
                        row.planOutput = data.list[0].planOutput;
                        row.orderStatus = data.list[0].orderStatus;
                        row.outputUnit = data.list[0].outputUnit;
                        row.properties = data.list[0].properties;
                        row.realOutput = data.list[0].realOutput;
                        row.plan = data.list[0].plan;
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            }
        },
        // 新增人员
        btnEditAddPeople() {
            if (this.plantList.workshopIDValue === '') {
                this.$warningToast('请选择车间');
                return;
            }
            // if (this.addRowStatus === 0) {
            //   this.dataList = []
            // }
            // this.addRowStatus = 1
            this.isDisabled = false;
            this.dataList.push({
                dinner: '60'
            });
        },
        // 人员删除
        delUser(row) {
            if (typeof row.orderId !== 'undefined') {
                this.$confirm('是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(`${WHT_API.CINDEXDELUSER}`, 'POST', {
                        orderId: row.orderId
                    }).then(({ data }) => {
                        if (data.code === 0) {
                            this.dataList.splice(this.dataList.indexOf(row), 1);
                            this.$successToast('删除成功');
                        } else {
                            this.$errorToast(data.msg);
                        }
                    }).catch(() => {
                        // this.$infoToast('已取消删除');
                    });
                });
            } else {
                this.dataList.splice(this.dataList.indexOf(row), 1);
            }
        },
        // 选择人员 正式 借调
        selectUser(row) {
            this.row = row;
            if (row.userType === '借调') {
                this.$nextTick(() => {
                    this.$refs.loanedPersonnel.init(row.userId);
                });
            } else if (row.userType === '正式') {
                if (row.deptId) {
                    this.$nextTick(() => {
                        this.$refs.officialWorker.init(row.deptId, row.userId);
                    });
                } else {
                    this.$warningToast('请选择工序');
                }
            } else if (row.userType === '临时工') {
                this.$nextTick(() => {
                    this.$refs.temporaryWorker.init(row);
                });
            } else {
                this.$warningToast('请选择人员属性');
            }
        },
        // 员工确认
        changeUser(userId) {
            this.row.userId = userId;
            // this.row = JSON.parse(JSON.stringify(this.row))
            // this.dataList = JSON.parse(JSON.stringify(this.dataList))
            this.$set(this.row, userId, this.row.userId);
        },
        changeProcType(row) {
            row.userId = [];
        },
        btnEditSave() {
            if (this.isDisabled === false) {
                this.$confirm('确认保存，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {

                    if (this.dataList.length !== 0) {
                        this.dataList.map(item => {
                            if (typeof item.classType === 'undefined' || typeof item.deptId === 'undefined' || typeof item.userType === 'undefined' || typeof item.userId === 'undefined' || typeof item.startDate === 'undefined' || typeof item.endDate === 'undefined' || typeof item.dinner === 'undefined') {
                                this.$warningToast('除备注外其他选项必填');
                                this.abnorsave = false;
                                return false;
                            }
                                this.abnorsave = true;

                            if (typeof item.orderId === 'undefined') {
                                this.$set(item, 'orderId', '');
                            }
                            this.$set(item, 'productDate', this.plantList.productDate);
                            if (typeof item.dinner === 'number') {
                                item.dinner = JSON.stringify(item.dinner);
                            }
                        });
                        if (this.abnorsave === true) {
                            this.lodingStatus = true;
                            this.$http(`${WHT_API.CINDEXUPDATEUSER}`, 'POST', this.dataList).then(({ data }) => {
                                if (data.code === 0) {
                                    // this.$notify({title: '成功', message: '操作成功', type: 'success'})
                                    this.$successToast('保存成功');
                                    this.btnGetResultData(true);
                                    // 按钮状态
                                    this.isBtnDefaultSet = true;
                                } else {
                                    this.$errorToast(data.msg);
                                }
                                this.lodingStatus = false;
                            });
                        }
                    } else {
                        this.$infoToast('未有更新档案');
                    }
                }).catch(() => {
                    // this.$infoToast('已取消删除');
                });
            }
        },
        // 改变每页条数
        handleSizeChange(val) {
            this.plantList.pageSize = val;
            this.btnGetResultData();
        },
        // 跳转页数
        handleCurrentChange(val) {
            this.plantList.currPage = val;
            // 0,10   10,20    20,30
            this.dataList = this.totalList.slice((val - 1) * this.plantList.pageSize, (val - 1) * this.plantList.pageSize + this.plantList.pageSize);
        }
    }
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss/_common.scss";
</style>
<style lang="scss" scoped>
.itemImg {
    position: relative;
    width: 100%;
    min-height: 181px;
    overflow: hidden;
    cursor: pointer;
    img {
        transition: all 1s ease-in-out;
    }
}
.itemImg:hover {
    img {
        transform: scale(1.2);
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
#normal {
    .sole_cont {
        border: #e9e9e9 1px solid;
        .sole_status {
            position: absolute;
            top: 20px;
            right: 15px;
            float: right;
            min-width: 150px;
            color: #565656;
            font-size: 14px;
        }
        .points {
            display: block;
            float: left;
            width: 5px;
            height: 5px;
            margin-top: 27px;
            margin-right: 8px;
            border-radius: 50%;
        }
        .title_left {
            display: block;
            height: 60px;
            padding: 0 15px;
            font-weight: 600;
            line-height: 60px;
            border-bottom: #e9e9e9 1px solid;
        }
        .el-form-item__content {
            width: 61%;
            border-bottom: #ccc solid 1px;
        }
        .width50b {
            width: 49%;
            margin: 5px 0;
        }
        .normal_bottom {
            padding: 5px 0;
        }
    }
}
.selectwpx {
    width: 120px;
}
</style>
