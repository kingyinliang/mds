<template>
    <div class="header_main">
        <div v-if="headShow" class="dataEntry-head">
            <div v-if="orderStatusShow" class="dataEntry-head-title" style="height: 18px;">
                <em v-if="formHeader.factoryName && headShow" class="dataEntry-head-title__icon iconfont factory-gongchang" />
                <span v-if="headShow" class="dataEntry-head-title__text">{{ formHeader.factoryName }}</span>
                <span v-else class="dataEntry-head-title__text">基础信息</span>
                <em
                    class="dataEntry-head-title__status"
                    :class="{
                        noPass: orderStatus === 'noPass' || orderStatus === '已退回',
                        saved: orderStatus === 'saved' || orderStatus === '已保存',
                        submit: orderStatus === 'submit' || orderStatus === '待审核',
                        checked: orderStatus === 'checked' || orderStatus === '已审核',
                        '': orderStatus === '已同步',
                    }"
                >
                    {{ statusTitle }}：{{ getTagStatus(orderStatus) }}
                </em>
            </div>
            <div class="dataEntry-head-base">
                <el-form :inline="true" :model="formHeader" size="small" class="dataEntry-head-base__form" label-width="120px">
                    <el-form-item v-for="(item, index) in headerBase" :key="index">
                        <template slot="label">
                            <em v-if="item.required" style="color: red;">*</em>
                            <em class="iconfont" :class="item.icon" style="margin-right: 5px; margin-left: 2px;" />
                            <span>{{ item.label }}：</span>
                        </template>
                        <p v-if="item.type === 'p'">
                            {{ item.value | itemValue(formHeader) }} {{ item.unit }}
                        </p>
                        <el-tooltip v-if="item.type === 'tooltip'" class="item" effect="dark" :content="item.value | itemValue(formHeader)" placement="top">
                            <p>
                                {{ item.value | itemValue(formHeader) }}
                            </p>
                        </el-tooltip>
                        <el-date-picker v-if="item.type === 'date-picker'" v-model="formHeader[item.value]" size="mini" type="date" :disabled="!isRedact" value-format="yyyy-MM-dd" format="yyyy-MM-dd" style="width: 120px;" @change="updateProductDate" />
                        <el-date-picker v-if="item.type === 'date-time'" v-model="formHeader[item.value]" size="mini" type="datetime" :disabled="!isRedact" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" style="width: 120px;" @change="updateProductDate" />
                        <el-select v-if="item.type === 'select'" v-model="formHeader[item.value]" size="mini" style="width: 120px;" :disabled="!(isRedact && item.disabled)">
                            <el-option v-for="(optionIt, subIndex) in item.option.list" :key="subIndex" :label="optionIt[item.option.label]" :value="optionIt[item.option.value]" />
                        </el-select>
                        <el-radio-group v-if="item.type === 'radio'" v-model="formHeader[item.value]" size="mini" :disabled="!(isRedact && !item.disabled)">
                            <el-radio v-for="(optionIt, subIndex) in item.option.list" :key="subIndex" :label="optionIt[item.option.value]">
                                {{ optionIt[item.option.label] }}
                            </el-radio>
                        </el-radio-group>
                        <p v-if="item.type === 'orgSelectUser'" :class="{headP: isRedact}" @click="() => { isRedact?selectUser(item.value):''}">
                            <em v-for="(user, i) in formHeader[item.value]" :key="i">{{ user }}，</em>
                            <em v-if="formHeader[item.value].length === 0">点击选择人员</em>
                        </p>
                        <el-input v-if="item.type === 'input'" v-model="formHeader[item.value]" :disabled="!isRedact" size="mini" :placeholder="item.placeholder" style="width: 120px;">
                            <span slot="suffix">{{ item.unit }}</span>
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <slot name="headerCard" :isRedact="isRedact" />
        <!--tabs-->
        <div v-if="tabs.length === 0" class="box-card" style=" margin-top: 10px; padding: 10px !important; background: white;">
            <slot name="contentBox" :isRedact="isRedact" />
        </div>
        <el-tabs v-else id="DaatTtabs" ref="tabs" v-model="activeName" class="NewDaatTtabs tabsPages" type="border-card" :before-leave="beforeLeave" @tab-click="tabClick">
            <el-tab-pane v-for="(item, index) in tabs" :key="index" :name="setKey(index)">
                <span v-if="item.status !== undefined" slot="label" class="spanview">
                    <el-tooltip class="item" effect="dark" :content="getTagStatus(item.status)" placement="top-start">
                        <span
                            :style="{
                                color: item.status === 'noPass' ? 'red' : item.status === 'R' ? 'red' : ''
                            }"
                        >{{ item.label }}</span>
                    </el-tooltip>
                </span>
                <span v-if="item.status === undefined" slot="label" class="spanview">
                    {{ item.label }}
                </span>
                <slot :name="setKey(index)" :isRedact="isRedact" />
            </el-tab-pane>
        </el-tabs>
        <!--编辑-->
        <div v-if="redactBoxShow" class="redactBox">
            <div class="redactBox" :style="{ 'padding-left': sidebarFold ? '64px' : '170px' }">
                <div v-if="redactBoxStatus" class="redact clearfix">
                    <div v-if="type === 'entry'" class="redact_tips">
                        <em class="el-icon-info" />
                        <span v-if="orderStatus === 'toBeAudited'">请仔细核对数据后再进行提交</span>
                        <span v-else-if="orderStatus === '已过账'">订单已过账</span>
                        <span v-else-if="orderStatus === '待审核' || orderStatus === 'D'">已提交至主管审核，请等待</span>
                        <span v-else-if="orderStatus === '已审核'">已提交至生管审核，请等待</span>
                        <span v-else-if="orderStatus === '已保存'">
                            <span v-if="isRedact">{{ formHeader.changer }}于{{ dateChange }}分钟前已保存</span>
                            <span v-else>点击编辑按钮，对当前页面进行编辑</span>
                        </span>
                        <span v-else-if="orderStatus === '已退回'">
                            <span v-if="isRedact">请及时保存数据</span>
                            <span v-else>订单审核不通过，请核对</span>
                        </span>
                        <span v-else-if="orderStatus === 'checked'">订单已审核通过</span>
                        <span v-else-if="orderStatus === 'submit'">订单已提交，请等待审核</span>
                        <span v-else-if="orderStatus !== 'submit' && orderStatus !== 'checked' && orderStatus !== '已退回' && orderStatus !== '已审核' && orderStatus !== '待审核' && orderStatus !== '已过账'">
                            <span v-if="isRedact">请及时保存数据</span>
                            <span v-else>点击编辑按钮，对当前页面进行编辑</span>
                        </span>
                    </div>
                    <div v-if="type === 'entry'" class="redact_btn">
                        <el-button v-if="orderStatus !== 'submit' && orderStatus !== 'checked' && orderStatus !== 'D' && orderStatus !== '已审核' && orderStatus !== '待审核' && orderStatus !== '已过账' && isAuth(redactAuth)" type="primary" size="small" @click="setRedact">
                            {{ isRedact ? '取消' : '编辑' }}
                        </el-button>
                        <template v-if="isRedact || onlySubmit">
                            <el-button v-if="orderStatus !== 'submit' && orderStatus !== 'checked' && orderStatus !== 'D' && orderStatus !== '已审核' && orderStatus !== '待审核' && orderStatus !== '已过账' && isAuth(saveAuth)" type="primary" size="small" @click="savedData('saved')">
                                保存
                            </el-button>
                        </template>
                        <el-button v-if="orderStatus !== 'submit' && orderStatus !== 'checked' && orderStatus !== 'D' && orderStatus !== '已审核' && orderStatus !== '待审核' && orderStatus !== '已过账' && ifSubmit() && isAuth(submitAuth)" type="primary" size="small" @click="submitData">
                            提交
                        </el-button>
                    </div>
                    <div v-else class="redact_btn">
                        <slot name="custom_btn" :isRedact="isRedact" />
                    </div>
                </div>
                <div v-else class="redact clearfix">
                    <div class="redact_tips">
                        <em class="el-icon-info" />
                        <span v-if="isRedact">请及时保存数据</span>
                        <span v-else>点击编辑按钮，对当前页面进行编辑</span>
                    </div>
                    <div class="redact_btn">
                        <el-button v-if="isRedact && isAuth(redactAuth)" type="primary" size="small" @click="cancel">
                            取消
                        </el-button>
                        <el-button v-if="isAuth(saveAuth)" type="primary" size="small" @click="save">
                            {{ isRedact ? '保存' : '编辑' }}
                        </el-button>
                    </div>
                </div>
            </div>
        </div>
        <loaned-personnel v-if="loanedPersonnelStatus" ref="loanedPersonnel" @changeUser="changeUser" />
    </div>
</template>

<script>
    import { getDateDiff, dateFormat, getObjPath } from 'utils/utils';
    import LoanedPersonnel from 'components/LoanedPersonnel.vue';
    export default {
        name: 'DataEntry',
        filters: {
            itemValue(value, formHeader) {
                if (Object.prototype.toString.call(value) === '[object Array]') {
                    let str = '';
                    value.forEach(it => {
                        str = str + ' ' + (getObjPath(formHeader, it) || '');
                    });
                    return str;
                }
                return getObjPath(formHeader, value);
            }
        },
        components: {
            LoanedPersonnel
        },
        props: {
            type: {
                type: String,
                default: 'entry'
            },
            statusTitle: { // 页面右上角显示状态的名目
                type: String,
                default: '订单状态'
            },
            orderStatus: {
                type: String,
                default: ''
            },
            redactAuth: {
                type: String,
                default: ''
            },
            saveAuth: {
                type: String,
                default: ''
            },
            submitAuth: {
                type: String,
                default: ''
            },
            formHeader: {
                type: Object,
                default: () => {
                    return {};
                }
            },
            headerBase: {
                type: Array,
                default: () => {
                    return [];
                }
            },
            tabs: {
                type: Array,
                default: () => {
                    return [];
                }
            },
            currentTab: {
                type: String,
                default: '1'
            },
            beforeLeave: {
                type: Function,
                default: () => []
            },
            urgentSubmit: {
                type: Boolean,
                default: false
            },
            headShow: {
                type: Boolean,
                default: true
            },
            submitRules: {
                type: Function,
                default: () => []
            },
            savedRules: {
                type: Function,
                default: () => []
            },
            savedDatas: {
                type: Function,
                default: () => {
                    //    emoty
                }
            },
            submitDatas: {
                type: Function,
                default: () => {
                    //    emoty
                }
            },
            notPermitSubmitStatus: {
                type: Array,
                default: () => {
                    return ['submit', 'checked'];
                }
            },
            onlySubmit: {
                type: Boolean,
                default: false
            },
            cancelDatas: {
                type: Function,
                default: () => {
                    //
                }
            },
            headerAreaShow: {
                type: Boolean,
                default: true
            },
            // 下方 bar 显示与否
            redactBoxShow: {
                type: Boolean,
                default: true
            },
            //检测数据订单状态不显示
            orderStatusShow: {
                type: Boolean,
                default: true
            },
            //检测数据底部只显示取消和编辑
            redactBoxStatus: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                dateChange: 0,
                isRedact: false,
                loanedPersonnelStatus: false,
                orgValue: '',
                activeName: '1'
            };
        },
        computed: {
            getTagStatus: () => {
                return (status) => {
                    let res;
                    switch (status) {
                        case 'noPass':
                            res = '不通过';
                            break;
                        case 'saved':
                            res = '已保存';
                            break;
                        case 'submit':
                            res = '已提交';
                            break;
                        case 'checked':
                            res = '通过';
                            break;
                        case 'F':
                            res = '接口失败';
                            break;
                        case 'C':
                            res = '已审核';
                            break;
                        case 'T':
                            res = '已同步';
                            break;
                        case 'R':
                            res = '已退回';
                            break;
                        case 'N':
                            res = '未录入';
                            break;
                        case 'M':
                            res = '已提交';
                            break;
                        case 'D':
                            res = '待审核';
                            break;
                        case 'X':
                            res = '反审';
                            break;
                        case 'S':
                            res = '已保存';
                            break;
                        case 'P':
                            res = '已过账';
                            break;
                        case 'toBeAudited':
                            res = '待审核';
                            break;
                        default: res = status
                    }
                    return res;
                }
            },
            sidebarFold: {
                get() {
                    return this.$store.state.common.sidebarFold;
                }
            }
        },
        mounted() {
            setInterval(() => {
                if (this.formHeader.changed) {
                    this.dateChange = Math.trunc(Number(getDateDiff(this.formHeader.changed, dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'), 'minute')))
                }
            }, 3000)
        },
        methods: {
            selectUser(value) {
                this.orgValue = value
                this.loanedPersonnelStatus = true;
                this.$nextTick(() => {
                    this.$refs.loanedPersonnel.init(this.formHeader[value], '操作人');
                });
            },
            changeUser(userId) {
                this.formHeader[this.orgValue] = userId
                this.loanedPersonnelStatus = false;
            },
            setRedact() {
                if (this.isRedact) {
                    this.$emit('success');
                }
                this.isRedact = !this.isRedact
            },
            tabClick(val) {
                this.$refs.tabs.setCurrentName(val.name);
                this.$emit('tab-click', val);
            },
            // 设置tabs的绑定
            setKey(index) {
                return (index + 1).toString();
            },
            updateTabs() {
                this.$refs.tabs.handleTabClick(this.$refs.tabs.panes[parseInt(this.$refs.tabs.currentName, 10) - 1]);
            },
            updateProductDate(dataStr) {
                this.$emit('updateProductDate', dataStr);
            },
            // 保存
            savedData(str) {
                if (str === 'saved') {
                    const arr = this.savedRules();
                    for (const rule of arr) {
                        if (!rule('saved')) {
                            return false;
                        }
                    }
                    this.savedDatas(str).then(res => {
                        if (res !== false) {
                            this.isRedact = false;
                            this.$successToast('保存成功');
                            this.$emit('success');
                        }
                    });
                } else {
                    this.submitDatas(str).then(res => {
                        if (res !== false) {
                            this.isRedact = false;
                            this.$successToast('提交成功');
                            this.$emit('success');
                        }
                    });
                }
            },
            // 提交
            submitData() {
                if (this.urgentSubmit) {
                    this.$emit('urgentSubmit');
                    return
                }
                const arr = this.submitRules();
                for (const rule of arr) {
                    if (!rule('submit')) {
                        return false;
                    }
                }
                this.$confirm('确认提交该订单, 是否继续?', '提交订单', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.savedData('submit');
                }).catch(() => {
                    // this.$infoToast('已取消删除');
                });
            },
            ifSubmit() {
                return !this.notPermitSubmitStatus.includes(this.orderStatus);
            },
            save() {
                if (!this.isRedact) {
                    this.isRedact = !this.isRedact;
                } else {
                    this.savedDatas()
                }
            },
            cancel() {
                this.isRedact = false;
                this.cancelDatas()
            }
        }
    };
</script>

<style lang="scss">
    .dataEntry-head-base__form .headP {
        color: #606266;
        background: white;
        border: 1px solid #dcdfe6;
    }
</style>
