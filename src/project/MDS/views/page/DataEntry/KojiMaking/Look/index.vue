<template>
    <div class="header_main">
        <data-entry
            ref="dataEntry"
            :redactAuth="'kjm:guard:tech:update'"
            :saveAuth="'kjm:guard:tech:update'"
            :submitAuth="'kjm:guard:tech:update'"
            :submitRules="submitRules"
            :savedRules="savedRules"
            :savedDatas="savedDatas"
            :submitDatas="submitDatas"
            :orderStatus="orderStatus"
            :headerBase="headerBase"
            :formHeader="formHeader"
            :tabs="tabs"
            @success="GetheadList"
        >
            <template slot="1" slot-scope="data">
                <div>
                    <mds-card :title="'入曲检查'" :name="'tech'">
                        <el-form :inline="true" :model="tech" size="small" labelWidth="130px">
                            <el-form-item label="入曲检查：" :required="true">
                                <el-input v-model="tech.inCheck" style="width: 171px;" :disabled="!(data.isRedact && tech.status !== 'submit' && tech.status !== 'checked')" />
                            </el-form-item>
                            <el-form-item label="检查人：" :required="true">
                                <el-select v-model="tech.inCheckMan" :disabled="!(data.isRedact && tech.status !== 'submit' && tech.status !== 'checked')">
                                    <el-option v-for="sole in userList" :key="sole.userId" :value="sole.realName + `(${sole.workNum})`" :label="sole.realName + `（${sole.workNum}）`" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="入曲开始时间：" :required="true">
                                <el-date-picker
                                    v-model="tech.inStartTime"
                                    type="datetime"
                                    :disabled="!(data.isRedact && tech.status !== 'submit' && tech.status !== 'checked')"
                                    placeholder="选择日期"
                                    size="small"
                                    format="yyyy-MM-dd HH:mm"
                                    valueFormat="yyyy-MM-dd HH:mm"
                                    style="width: 171px;"
                                />
                            </el-form-item>
                            <el-form-item label="入曲结束时间：" :required="true">
                                <el-date-picker
                                    v-model="tech.inEndTime"
                                    type="datetime"
                                    :disabled="!(data.isRedact && tech.status !== 'submit' && tech.status !== 'checked')"
                                    placeholder="选择日期"
                                    size="small"
                                    format="yyyy-MM-dd HH:mm"
                                    valueFormat="yyyy-MM-dd HH:mm"
                                    style="width: 171px;"
                                />
                            </el-form-item>
                            <el-form-item label="入曲时长：">
                                {{ timecha }}
                            </el-form-item>
                        </el-form>
                    </mds-card>
                    <mds-card :title="'看曲记录'" :name="'kanqu'" :iconBg="'#ffbf00'">
                        <div id="test1Content" style="display: none;">
                            <look-echarts ref="LookEcharts" />
                        </div>
                        <el-row style="line-height: 32px; margin-bottom: 10px;">
                            <el-col
                                :span="5"
                            >
                                第（<el-input v-model="tech.guardProcess" size="small" style="width: 80px; padding: 0;" class="guard-form-input">
                                    {{ tech.guardProcess }}
                                </el-input>）套程序
                            </el-col>
                            <el-col :span="15">
                                <el-radio-group v-model="tech.processType">
                                    <el-radio label="自动" :disabled="!(data.isRedact && tech.status !== 'submit' && tech.status !== 'checked')">
                                        自动
                                    </el-radio>
                                    <el-radio label="半自动" :disabled="!(data.isRedact && tech.status !== 'submit' && tech.status !== 'checked')">
                                        半自动
                                    </el-radio>
                                    <el-radio label="手动" :disabled="!(data.isRedact && tech.status !== 'submit' && tech.status !== 'checked')">
                                        手动
                                    </el-radio>
                                </el-radio-group>
                            </el-col>
                            <el-col :span="4">
                                <el-button type="primary" :disabled="!(data.isRedact && tech.status !== 'submit' && tech.status !== 'checked')" size="small" style="float: right;" @click="ReadRow">
                                    读取数据
                                </el-button>
                                <el-button type="primary" :disabled="!(data.isRedact && tech.status !== 'submit' && tech.status !== 'checked')" size="small" style="float: right; margin-right: 10px;" @click="addline">
                                    + 新增
                                </el-button>
                            </el-col>
                        </el-row>
                        <el-table ref="recordTable" class="newTable borderTable" border maxHeight="315" headerRowClassName="tableHead" :data="lookList" :rowClassName="rowDelFlag" tooltipEffect="dark">
                            <el-table-column label="序号" type="index" width="50px" />
                            <el-table-column label="" width="205">
                                <template slot="header">
                                    <i class="reqI">*</i>
                                    <span>看曲时间</span>
                                </template>
                                <template slot-scope="scope">
                                    <el-date-picker
                                        v-model="scope.row.guardTime"
                                        type="datetime"
                                        :disabled="!(data.isRedact && tech.status !== 'submit' && tech.status !== 'checked')"
                                        placeholder="选择日期"
                                        size="small"
                                        format="yyyy-MM-dd HH:mm"
                                        valueFormat="yyyy-MM-dd HH:mm"
                                        style="width: 175px;"
                                    />
                                </template>
                            </el-table-column>
                            <el-table-column width="100">
                                <template slot="header">
                                    <i class="reqI">*</i>
                                    <span>风温实际</span>
                                </template>
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.windTemp" :disabled="!(data.isRedact && tech.status !== 'submit' && tech.status !== 'checked')" size="small" />
                                </template>
                            </el-table-column>
                            <el-table-column width="100">
                                <template slot="header">
                                    <i class="reqI">*</i>
                                    <span>品温实际</span>
                                </template>
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.productTemp" :disabled="!(data.isRedact && tech.status !== 'submit' && tech.status !== 'checked')" size="small" />
                                </template>
                            </el-table-column>
                            <el-table-column width="130">
                                <template slot="header">
                                    <i class="reqI">*</i>
                                    <span>风速（R/HZ）</span>
                                </template>
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.windSpeed" :disabled="!(data.isRedact && tech.status !== 'submit' && tech.status !== 'checked')" size="small" />
                                </template>
                            </el-table-column>
                            <el-table-column width="100">
                                <template slot="header">
                                    <i class="reqI">*</i>
                                    <span>风门/进风</span>
                                </template>
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.windInFlag" type="number" :disabled="!(data.isRedact && tech.status !== 'submit' && tech.status !== 'checked')" size="small" />
                                </template>
                            </el-table-column>
                            <el-table-column label="" width="100">
                                <template slot="header">
                                    <i class="reqI">*</i>
                                    <span>强排/反风</span>
                                </template>
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.forceOutFlag" type="number" :disabled="!(data.isRedact && tech.status !== 'submit' && tech.status !== 'checked')" size="small" />
                                </template>
                            </el-table-column>
                            <el-table-column label="" width="100">
                                <template slot="header">
                                    <i class="reqI">*</i>
                                    <span>加湿情况</span>
                                </template>
                                <template slot-scope="scope">
                                    <el-select v-model="scope.row.jiashiFlag" :disabled="!(data.isRedact && tech.status !== 'submit' && tech.status !== 'checked')" size="small">
                                        <el-option label="0" value="0" />
                                        <el-option label="1" value="1" />
                                        <el-option label="2" value="2" />
                                        <el-option label="3" value="3" />
                                        <el-option label="4" value="4" />
                                        <el-option label="5" value="5" />
                                        <el-option label="6" value="6" />
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column label="" width="100">
                                <template slot="header">
                                    <i class="reqI">*</i>
                                    <span>加热/冷却</span>
                                </template>
                                <template slot-scope="scope">
                                    <el-select v-model="scope.row.jiareFlag" :disabled="!(data.isRedact && tech.status !== 'submit' && tech.status !== 'checked')" size="small">
                                        <el-option label="0" value="2" />
                                        <el-option label="∆" value="1" />
                                        <el-option label="※" value="0" />
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column label="外品温探头温度">
                                <el-table-column label="">
                                    <template slot="header">
                                        <i class="reqI">*</i>
                                        <span>上</span>
                                    </template>
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.productTempOutsideUp" :disabled="!(data.isRedact && tech.status !== 'submit' && tech.status !== 'checked')" size="small" />
                                    </template>
                                </el-table-column>
                                <el-table-column label="">
                                    <template slot="header">
                                        <i class="reqI">*</i>
                                        <span>中</span>
                                    </template>
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.productTempOutsideMid" :disabled="!(data.isRedact && tech.status !== 'submit' && tech.status !== 'checked')" size="small" />
                                    </template>
                                </el-table-column>
                                <el-table-column label="">
                                    <template slot="header">
                                        <i class="reqI">*</i>
                                        <span>下</span>
                                    </template>
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.productTempOutsideDown" :disabled="!(data.isRedact && tech.status !== 'submit' && tech.status !== 'checked')" size="small" />
                                    </template>
                                </el-table-column>
                            </el-table-column>
                            <el-table-column label="内品温探头温度">
                                <el-table-column label="">
                                    <template slot="header">
                                        <span>上</span>
                                    </template>
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.productTempUp" :disabled="!(data.isRedact && tech.status !== 'submit' && tech.status !== 'checked')" size="small" />
                                    </template>
                                </el-table-column>
                                <el-table-column label="">
                                    <template slot="header">
                                        <span>中</span>
                                    </template>
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.productTempMid" :disabled="!(data.isRedact && tech.status !== 'submit' && tech.status !== 'checked')" size="small" />
                                    </template>
                                </el-table-column>
                                <el-table-column label="">
                                    <template slot="header">
                                        <span>下</span>
                                    </template>
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.productTempDown" :disabled="!(data.isRedact && tech.status !== 'submit' && tech.status !== 'checked')" size="small" />
                                    </template>
                                </el-table-column>
                            </el-table-column>
                            <el-table-column label="温度计温度">
                                <el-table-column label="外">
                                    <template slot="header">
                                        <i class="reqI">*</i>
                                        <span>外</span>
                                    </template>
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.thermometerOut" :disabled="!(data.isRedact && tech.status !== 'submit' && tech.status !== 'checked')" size="small" />
                                    </template>
                                </el-table-column>
                                <el-table-column label="里">
                                    <template slot="header">
                                        <i class="reqI">*</i>
                                        <span>里</span>
                                    </template>
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.thermometerInner" :disabled="!(data.isRedact && tech.status !== 'submit' && tech.status !== 'checked')" size="small" />
                                    </template>
                                </el-table-column>
                            </el-table-column>
                            <el-table-column label="备注">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.remark" :disabled="!(data.isRedact && tech.status !== 'submit' && tech.status !== 'checked')" size="small" />
                                </template>
                            </el-table-column>
                            <el-table-column label="操作人" prop="changer" width="150px" />
                            <el-table-column width="70" fixed="right">
                                <template slot-scope="scope">
                                    <el-button class="delBtn" type="text" icon="el-icon-delete" :disabled="!(data.isRedact && tech.status !== 'submit' && tech.status !== 'checked')" size="small" @click="delrow(scope.row)">
                                        删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </mds-card>
                    <mds-card :title="'加水量记录'" :name="'jiashui'" :iconBg="'#5bd171'">
                        <el-form :inline="true" :model="tech" size="small">
                            <div>
                                <div style="line-height: 32px; float: left; margin-right: 20px;">
                                    翻曲加水
                                </div>
                                <el-form-item label="起始数：" :required="true">
                                    <el-input v-model="tech.overStartWeight" size="small" :disabled="!(data.isRedact && tech.status !== 'submit' && tech.status !== 'checked')" />
                                </el-form-item>
                                <el-form-item label="结束数：" :required="true">
                                    <el-input v-model="tech.overEndWeight" size="small" :disabled="!(data.isRedact && tech.status !== 'submit' && tech.status !== 'checked')" />
                                </el-form-item>
                                <el-form-item label="加水量（L）：">
                                    <el-input v-model="tech.overWeight" size="small" :disabled="true" />
                                </el-form-item>
                            </div>
                            <div>
                                <div style="line-height: 32px; float: left; margin-right: 20px;">
                                    出曲加水
                                </div>
                                <el-form-item label="起始数：" :required="true">
                                    <el-input v-model="tech.outStartWeight" size="small" :disabled="!(data.isRedact && tech.status !== 'submit' && tech.status !== 'checked')" />
                                </el-form-item>
                                <el-form-item label="结束数：" :required="true">
                                    <el-input v-model="tech.outEndWeight" size="small" :disabled="!(data.isRedact && tech.status !== 'submit' && tech.status !== 'checked')" />
                                </el-form-item>
                                <el-form-item label="加水量（L）：">
                                    <el-input v-model="tech.outWeight" size="small" :disabled="true" />
                                </el-form-item>
                            </div>
                        </el-form>
                    </mds-card>
                    <mds-card :title="'感官评价记录'" :name="'jiashui'">
                        <el-table class="newTable" border headerRowClassName="tableHead" :data="assessList">
                            <el-table-column prop="feelName" />
                            <el-table-column>
                                <template slot="header">
                                    <i class="reqI">*</i>
                                    <span>U</span>
                                </template>
                                <template slot-scope="scope">
                                    <el-select v-model="scope.row.codeU" :disabled="!(data.isRedact && tech.status !== 'submit' && tech.status !== 'checked')" placeholder="请选择" size="small">
                                        <el-option v-for="item in Ulist" :key="item.value" :label="item.label" :value="item.value" />
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column label="S">
                                <template slot="header">
                                    <i class="reqI">*</i>
                                    <span>S</span>
                                </template>
                                <template slot-scope="scope">
                                    <el-select v-model="scope.row.codeS" :disabled="!(data.isRedact && tech.status !== 'submit' && tech.status !== 'checked')" placeholder="请选择" size="small">
                                        <el-option v-for="item in Slist" :key="item.value" :label="item.label" :value="item.value" />
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column>
                                <template slot="header">
                                    <i class="reqI">*</i>
                                    <span>A</span>
                                </template>
                                <template slot-scope="scope">
                                    <el-select v-model="scope.row.codeA" :disabled="!(data.isRedact && tech.status !== 'submit' && tech.status !== 'checked')" placeholder="请选择" size="small">
                                        <el-option v-for="item in Alist" :key="item.value" :label="item.label" :value="item.value" />
                                    </el-select>
                                </template>
                            </el-table-column>
                        </el-table>
                    </mds-card>
                    <mds-card :title="'异常情况记录'" :name="'jiashui'" :iconBg="'#f05c4a'">
                        <div class="excarBox">
                            <el-input v-model="tech.guardException" type="textarea" :disabled="!(data.isRedact && tech.status !== 'submit' && tech.status !== 'checked')" class="textarea" style="width: 100%; height: 40px;" />
                        </div>
                    </mds-card>
                </div>
            </template>
            <template slot="2" slot-scope="data">
                <exc-record ref="excrecord" :isRedact="data.isRedact" :order="formHeader" />
            </template>
            <template slot="3" slot-scope="data">
                <text-record ref="textrecord" :isRedact="data.isRedact" />
            </template>
        </data-entry>
    </div>
</template>

<script>
import { KJM_API, SYSTEMSETUP_API } from '@/api/api';
import { headanimation, Readyanimation, ReadyanimationLook } from '@/net/validate';
import ExcRecord from '@/views/components/ExcRecord';
import TextRecord from '@/views/components/TextRecord';
import LookEcharts from '@/views/components/LookEcharts';
import { AsyncHook } from '@/utils/index.js';
export default {
    name: 'Look',
    components: {
        ExcRecord,
        TextRecord,
        // AbnRecord: resolve => {
        //     require(['@/views/components/AbnRecord'], resolve);
        // },
        LookEcharts
    },
    data() {
        return {
            headerBase: [
                {
                    type: 'p',
                    icon: 'factory-shengchanchejian',
                    label: '生产车间',
                    value: 'workShopName'
                },
                {
                    type: 'p',
                    icon: 'factory--ICONxiugai_chepaihaoma',
                    label: '制曲房号',
                    value: 'houseNoName'
                },
                {
                    type: 'p',
                    icon: 'factory-bianhao',
                    label: '订单编号',
                    value: 'orderNo'
                },
                {
                    type: 'tooltip',
                    icon: 'factory-pinleiguanli',
                    label: '生产品项',
                    value: ['materialCode', 'materialName']
                },
                {
                    type: 'p',
                    icon: 'factory-dingdan',
                    label: '生产日期',
                    value: 'productDate'
                },
                {
                    type: 'p',
                    icon: 'factory-xianchangrenyuan',
                    label: '提交人员',
                    value: 'changer'
                },
                {
                    type: 'p',
                    icon: 'factory-riqi',
                    label: '提交时间',
                    value: 'changed'
                },
                {
                    type: 'p',
                    icon: 'factory-riqi',
                    label: '入 罐 号 ',
                    value: 'inPotNoName'
                },
                {
                    type: 'p',
                    icon: 'factory-bianhaoguize',
                    label: '连续蒸煮号',
                    value: 'cookingNoName'
                }
            ],
            tabs: [
                {
                    label: '工艺控制',
                    status: '未录入'
                },
                {
                    label: '异常记录'
                },
                {
                    label: '文本记录'
                }
            ],
            submitRules: () => {
                return [this.Readyrules, this.$refs.excrecord.excrul];
            },
            savedRules: () => {
                return [];
            },
            savedDatas: str => {
                this.submitStatus = 'saved';
                return AsyncHook(
                    [[this.savesmain, []]],
                    [
                        [
                            this.$refs.excrecord.saveOrSubmitExc,
                            [
                                {
                                    orderId: this.formHeader.orderId,
                                    orderHouseId: this.formHeader.orderHouseId,
                                    blongProc: this.formHeader.processId
                                },
                                str
                            ]
                        ],
                        [
                            this.$refs.textrecord.UpdateText,
                            [
                                {
                                    orderId: this.formHeader.orderId,
                                    orderHouseId: this.formHeader.orderHouseId,
                                    blongProc: this.formHeader.processId
                                },
                                str
                            ]
                        ],
                        [this.savestauts, []],
                        [this.savesecond, []],
                        [this.savefeel, []],
                        [this.UpdateHeaderCreator, [str]]
                    ]
                );
            },
            submitDatas: str => {
                this.submitStatus = 'submit';
                return AsyncHook(
                    [[this.savesmain, []]],
                    [
                        [
                            this.$refs.excrecord.saveOrSubmitExc,
                            [
                                {
                                    orderId: this.formHeader.orderId,
                                    orderHouseId: this.formHeader.orderHouseId,
                                    blongProc: this.formHeader.processId
                                },
                                str
                            ]
                        ],
                        [
                            this.$refs.textrecord.UpdateText,
                            [
                                {
                                    orderId: this.formHeader.orderId,
                                    orderHouseId: this.formHeader.orderHouseId,
                                    blongProc: this.formHeader.processId
                                },
                                str
                            ]
                        ],
                        [this.savestauts, []],
                        [this.savesecond, []],
                        [this.savefeel, []],
                        [this.UpdateHeaderCreator, [str]]
                    ]
                );
            },
            activeName: '1',
            formHeader: {
                inStartTime: ''
            },
            orderStatus: '已同步',
            isRedact: false,
            submitStatus: 'saved',
            applyCraftState: '', // 工艺状态
            succmessage: '保存成功',
            statuss: 'saved',
            userList: [],
            tech: {
                id: this.uuid(32, 62),
                orderHouseId: '',
                addOrupdate: '0',
                status: '',
                inCheck: '',
                inCheckMan: '',
                inStartTime: '',
                inEndTime: '',
                guardProcess: '',
                processType: '',
                overStartWeight: '',
                overEndWeight: '',
                overWeight: '',
                outStartWeight: '',
                outEndWeight: '',
                outWeight: '',
                guardException: ''
            },
            lookList: [],
            assessList: [
                { feelName: '一翻', id: '' },
                { feelName: '二翻', id: '' },
                { feelName: '出曲', id: '' }
            ],
            Ulist: [
                { value: 'U1', label: 'U1' },
                { value: 'U2', label: 'U2' },
                { value: 'U3', label: 'U3' },
                { value: 'U4', label: 'U4' },
                { value: 'U5', label: 'U5' }
            ],
            Slist: [
                { value: 'S1', label: 'S1' },
                { value: 'S2', label: 'S2' },
                { value: 'S3', label: 'S3' },
                { value: 'S4', label: 'S4' },
                { value: 'S5', label: 'S5' }
            ],
            Alist: [
                { value: 'A1', label: 'A1' },
                { value: 'A2', label: 'A2' },
                { value: 'A3', label: 'A3' },
                { value: 'A4', label: 'A4' },
                { value: 'A5', label: 'A5' }
            ],
            omg: 0
        };
    },
    computed: {
        timecha: function() {
            if (!this.tech.inEndTime || !this.tech.inStartTime) {
                return 0;
            }
                return (new Date(this.tech.inEndTime) - new Date(this.tech.inStartTime)) / 60000;

        },
        overcha: function() {
            return (this.tech.overEndWeight - this.tech.overStartWeight).toFixed(3);
        },
        outcha: function() {
            return (this.tech.outEndWeight - this.tech.outStartWeight).toFixed(3);
        }
    },
    watch: {
        'formHeader.workShop'() {
            this.checkList();
        },
        overcha: function() {
            this.tech.overWeight = this.overcha;
        },
        outcha: function() {
            this.tech.outWeight = this.outcha;
        }
    },
    mounted() {
        headanimation(this.$);
        Readyanimation(this.$);
        ReadyanimationLook(this.$);
        this.$nextTick(() => {
            if (this.omg === 0) {
                this.GetheadList();
            }
        });
    },
    methods: {
        tabClick(val) {
            this.$refs.tabs.setCurrentName(val.name);
        },
        /* eslint-disable @typescript-eslint/camelcase */
        GetheadList() {
            this.omg = 1;
            this.$http(
                `${KJM_API.DOUHEAERLIST}`,
                `POST`,
                {
                    orderHouseId: this.$store.state.common.ZQWorkshop.params.lookOrderHouseId,
                    deptName: '看曲'
                },
                false,
                false,
                false
            ).then(res => {
                if (res.data.code === 0) {
                    this.formHeader = res.data.headList[0];
                    this.orderStatus = res.data.headList[0].guardStatus;
                    this.$refs.excrecord.GetequipmentType(this.formHeader.processId);
                    this.$refs.excrecord.getDataList(this.formHeader.factory);
                    if (this.orderStatus !== '已同步') {
                        this.getList(this.formHeader);
                        this.$refs.excrecord.GetExcDate({
                            order_id: this.formHeader.orderId,
                            orderHouseId: this.formHeader.id,
                            blongProc: this.formHeader.processId
                        });
                        this.$refs.textrecord.GetText({
                            order_id: this.formHeader.orderId,
                            orderHouseId: this.formHeader.orderHouseId,
                            blongProc: this.formHeader.processId
                        });
                    } else {
                        this.formHeader.inStartTime = '';
                        this.$refs.LookEcharts.testInit(this.formHeader);
                    }
                } else {
                    this.$notify.error({ title: '错误', message: res.data.msg });
                }
            });
        },
        /* eslint-enable @typescript-eslint/camelcase */
        UpdateHeaderCreator(str, resolve) {
            this.$http(`${KJM_API.DOUMATERHEADCREATOR_API}`, 'POST', {
                orderId: this.formHeader.orderId
            }).then(({ data }) => {
                if (data.code !== 0) {
                    this.$notify.error({
                        title: '错误',
                        message: '保存表头' + data.msg
                    });
                }
                if (resolve) {
                    resolve('resolve');
                }
            });
        },
        // 提交
        SubmitForm() {
            if (!this.Readyrules()) {
                return false;
            }
            if (!this.$refs.excrecord.excrul()) {
                return false;
            }
            this.$confirm('确认提交该订单, 是否继续?', '提交订单', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.savedOrSubmitForm('submit');
            });
        },
        // 保存
        savedOrSubmitForm(str) {
            // 提交
            if (str === 'submit') {
                this.submitStatus = 'submit';
                this.succmessage = '提交成功';
            } else {
                this.submitStatus = 'saved';
            }
            new Promise((resolve, reject) => {
                this.savesmain(resolve, reject);
            }).then(() => {
                const excSaveNet = new Promise((resolve, reject) => {
                    this.$refs.excrecord.saveOrSubmitExc(
                        {
                            orderId: this.formHeader.orderId,
                            orderHouseId: this.formHeader.orderHouseId,
                            blongProc: this.formHeader.processId
                        },
                        str,
                        resolve,
                        reject
                    );
                });
                const textSaveNet = new Promise((resolve, reject) => {
                    this.$refs.textrecord.UpdateText(
                        {
                            orderId: this.formHeader.orderId,
                            orderHouseId: this.formHeader.orderHouseId,
                            blongProc: this.formHeader.processId
                        },
                        str,
                        resolve,
                        reject
                    );
                });
                const net101 = new Promise((resolve) => {
                    this.UpdateHeaderCreator(str, resolve);
                });
                const net1 = new Promise((resolve, reject) => {
                    this.savestauts(resolve, reject);
                });
                const net2 = new Promise((resolve, reject) => {
                    this.savesecond(resolve, reject);
                });
                const net3 = new Promise((resolve, reject) => {
                    this.savefeel(resolve, reject);
                });
                Promise.all([net1, net2, net3, excSaveNet, textSaveNet, net101])
                    .then(() => {
                        this.$notify({
                            title: '成功',
                            message: this.succmessage,
                            type: 'success'
                        });
                        this.GetheadList();
                        this.isRedact = false;
                    })
                    .catch(() => {
                        this.$error_SHINHO('网络请求失败，请刷新重试');
                    });
            });
        },
        // 工艺 start
        // 检查人
        checkList() {
            this.$http(`${SYSTEMSETUP_API.USERLIST_API}`, 'POST', {
                deptId: this.formHeader.workShop, // this.formHeader.workShop, // 工序id
                currPage: '1',
                pageSize: '100'
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.userList = data.page.list;
                } else {
                    this.$error_SHINHO(data.msg);
                }
            });
        },
        Readyrules() {
            let ty = true;
            if (!this.tech.inCheck || this.tech.inCheck === '') {
                ty = false;
                this.$warningTost('入曲检查必填');
                return false;
            }
            if (!this.tech.inCheckMan || this.tech.inCheckMan === '') {
                ty = false;
                this.$warningTost('检查人必填');
                return false;
            }
            if (!this.tech.inStartTime || this.tech.inStartTime === '') {
                ty = false;
                this.$warningTost('入曲开始时间为必填');
                return false;
            }
            if (!this.tech.inEndTime || this.tech.inEndTime === '') {
                ty = false;
                this.$warningTost('入曲结束时间为必填');
                return false;
            }
            if (this.lookList.length === 0) {
                ty = false;
                this.$warningTost('看曲记录未填');
                return false;
            }
            for (const items of this.lookList) {
                if (items.delFlag === '0') {
                    if (
                        items.guardTime === '' ||
                        items.windTemp === '' ||
                        items.productTemp === '' ||
                        items.windSpeed === '' ||
                        items.windInFlag === '' ||
                        items.forceOutFlag === '' ||
                        items.jiashiFlag === '' ||
                        items.jiareFlag === '' ||
                        items.productTempOutsideUp === '' ||
                        items.productTempOutsideMid === '' ||
                        items.productTempOutsideDown === '' ||
                        items.thermometerOut === '' ||
                        items.thermometerInner === '' ||
                        items.productTempOutsideUp === '' ||
                        items.productTempOutsideMid === '' ||
                        items.productTempOutsideDown === ''
                    ) {
                        // if (!items.guardTime || items.guardTime === '' || !items.guardTime || items.guardTime === '' || !items.windTemp || items.windTemp === '' || !items.productTemp || items.productTemp === '' || !items.windSpeed || items.windSpeed === '' || !items.windInFlag || items.windInFlag === '' || !items.forceOutFlag || items.forceOutFlag === '' || !items.jiashiFlag || items.jiashiFlag === '' || !items.jiareFlag || items.jiareFlag === '' || !items.productTempUp || items.productTempUp === '' || !items.productTempMid || items.productTempMid === '' || !items.productTempDown || items.productTempDown === '' || !items.thermometerOut || items.thermometerOut === '' || !items.thermometerInner || items.thermometerInner === '') {
                        ty = false;
                        this.$warningTost('看曲记录必填项未填');
                        return false;
                    }
                }
            }
            if (!this.tech.overStartWeight || !this.tech.overEndWeight || !this.tech.outStartWeight || !this.tech.outEndWeight || this.tech.overStartWeight === '' || this.tech.overEndWeight === '' || this.tech.outStartWeight === '' || this.tech.outEndWeight === '') {
                ty = false;
                this.$warningTost('加水量记录全必填');
                return false;
            }
            if (this.tech.overWeight < 0 || this.tech.outWeight < 0) {
                ty = false;
                this.$warningTost('加水量不能为负数');
                return false;
            }
            this.assessList.map(item => {
                if (typeof item.codeU === 'undefined' || typeof item.codeS === 'undefined' || typeof item.codeA === 'undefined') {
                    ty = false;
                    this.$warningTost('感官评价记录必须全选');
                    return false;
                }
            });
            return ty;
        },
        addline() {
            this.lookList.push({
                id: '',
                guardTechId: this.tech.id,
                guardTime: '',
                windTemp: '',
                productTemp: '',
                windSpeed: '',
                windInFlag: '',
                forceOutFlag: '',
                jiashiFlag: '',
                jiareFlag: '',
                productTempUp: '',
                productTempMid: '',
                productTempDown: '',
                thermometerOut: '',
                thermometerInner: '',
                remark: '',
                delFlag: '0',
                changer: this.$store.state.user.realName + `(${this.$store.state.user.name})`,
                unit: 'R/MIN'
            });
            this.$nextTick(() => {
                this.$refs.recordTable.bodyWrapper.scrollTop = this.$refs.recordTable.bodyWrapper.scrollHeight;
            });
        },
        delrow(row) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                row.delFlag = '1';
            });
        },
        rowDelFlag({ row }) {
            if (row.delFlag === '1') {
                return 'rowDel';
            }
                return '';

        },
        savestauts(resolve, reject) {
            if (this.submitStatus === 'submit') {
                this.statuss = 'submit';
            }
            this.$http(`${KJM_API.DOULOOKSTATUS_API}`, 'POST', {
                status: this.statuss,
                orderHouseId: this.formHeader.orderHouseId
            })
                .then(({ data }) => {
                    if (data.code !== 0) {
                        this.$error_SHINHO(data.msg);
                    }
                    if (resolve) {
                        resolve('resolve');
                    }
                })
                .catch(() => {
                    if (resolve) {
                        reject('reject');
                    }
                });
        },
        savesmain(resolve, reject) {
            if (this.submitStatus === 'submit') {
                this.tech.status = 'submit';
            } else {
                this.tech.status = 'saved';
            }
            this.tech.orderHouseId = this.formHeader.orderHouseId;
            this.$http(`${KJM_API.DOULOOKZHUSAVE_API}`, 'POST', this.tech)
                .then(({ data }) => {
                    if (data.code !== 0) {
                        this.$error_SHINHO(data.msg);
                    }
                    if (resolve) {
                        resolve('resolve');
                    }
                })
                .catch(() => {
                    if (resolve) {
                        reject('reject');
                    }
                });
        },
        savesecond(resolve, reject) {
            this.$http(`${KJM_API.DOULOOKKANQUSAVE_API}`, 'POST', this.lookList)
                .then(({ data }) => {
                    if (data.code !== 0) {
                        this.$error_SHINHO(data.msg);
                    }
                    if (resolve) {
                        resolve('resolve');
                    }
                })
                .catch(() => {
                    if (resolve) {
                        reject('reject');
                    }
                });
        },
        savefeel(resolve, reject) {
            this.assessList.map(item => {
                this.$set(item, 'guardTechId', this.tech.id);
                if (typeof item.codeU === 'undefined') {
                    this.$set(item, 'codeU', '');
                }
                if (typeof item.codeS === 'undefined') {
                    this.$set(item, 'codeS', '');
                }
                if (typeof item.codeA === 'undefined') {
                    this.$set(item, 'codeA', '');
                }
            });
            this.$http(`${KJM_API.DOULOOKGANGUANSAVE_API}`, 'POST', this.assessList)
                .then(({ data }) => {
                    if (data.code !== 0) {
                        this.$error_SHINHO(data.msg);
                    }
                    if (resolve) {
                        resolve('resolve');
                    }
                })
                .catch(() => {
                    if (resolve) {
                        reject('reject');
                    }
                });
        },
        getList(formHeader) {
            this.$http(`${KJM_API.DOULOOKLIST_API}`, 'POST', {
                orderHouseId: formHeader.orderHouseId
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.tech = data.techList[0];
                    this.formHeader.inStartTime = data.techList[0].inStartTime === null ? '' : data.techList[0].inStartTime;
                    this.$refs.LookEcharts.testInit(this.formHeader);
                    this.applyCraftState = this.tech.status;
                    this.tabs[0].status = this.tech.status;
                    // 强制刷新tabs
                    this.$refs.dataEntry.updateTabs();
                    this.assessList = data.feelList;
                    this.lookList = data.recordList;
                } else {
                    this.$error_SHINHO(data.msg);
                }
            });
        },
        ReadRow() {
            const params = {
                factory: this.formHeader.factory,
                houseNoName: this.formHeader.houseNoName,
                workShopName: this.formHeader.workShopName,
                inStartTime: this.tech.inStartTime,
                orderHouseId: this.formHeader.orderHouseId
            };
            this.$http(`${KJM_API.IOT_READ}`, 'POST', params).then(({ data }) => {
                if (data.code === 0) {
                    data.list.map(item => {
                        item.guardTechId = this.tech.id;
                        this.lookList.push(item);
                    });
                    this.$nextTick(() => {
                        this.$refs.recordTable.bodyWrapper.scrollTop = this.$refs.recordTable.bodyWrapper.scrollHeight;
                    });
                } else {
                    this.$error_SHINHO(data.msg);
                }
            });
        }
    }
};
</script>

<style>
.rowDel {
    display: none;
}
.guard-form-input .el-input__inner {
    border: 0 none;
    border-bottom: 1px solid #ccc;
    border-radius: 0;
    text-align: center;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    appearance: none;
}
input[type="number"] {
    appearance: textfield;
}
</style>
<style lang="scss" scoped>
.input_bommom {
    width: 147px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 32px;
    border-bottom: solid 1px #d8d8d8;
}
.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
    margin-bottom: 8px;
}
.searchCard {
    .el-button--primary,
    .el-button--primary:focus {
        color: #000;
        background-color: #fff;
        border-color: #d9d9d9;
    }
    .el-button--primary:hover {
        background-color: #1890ff;
        color: #fff;
    }
    .el-button--primary:first-child {
        background-color: #1890ff;
        color: #fff;
        border-color: #1890ff;
    }
}
#DaatTtabs {
    border-radius: 15px;
    overflow: hidden;
}
.htitle {
    margin: 0 0 10px;
    overflow: hidden;
}
.audit {
    line-height: 32px;
    margin: 0 0 10px;
    i {
        font-size: 22px;
        float: left;
    }
    span {
        font-size: 16px;
    }
}
.reqI {
    color: red;
}
</style>
