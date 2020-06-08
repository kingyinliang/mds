<template>
    <div class="header_main">
        <div class="dataEntry-head">
            <div class="dataEntry-head-title">
                <i class="dataEntry-head-title__icon iconfont factory-gongchang" />
                <span v-if="headShow" class="dataEntry-head-title__text">{{ formHeader.factoryName }}</span>
                <span v-else class="dataEntry-head-title__text">基础信息</span>
                <i
                    class="dataEntry-head-title__status"
                    :class="{
                        noPass: orderStatus === 'noPass' || orderStatus === '已退回',
                        saved: orderStatus === 'saved' || orderStatus === '已保存',
                        submit: orderStatus === 'submit' || orderStatus === '待审核',
                        checked: orderStatus === 'checked' || orderStatus === '已审核',
                        '': orderStatus === '已同步',
                    }"
                >
                    订单状态：{{ orderStatus === 'noPass' || orderStatus === 'R' ? '审核不通过' : orderStatus === 'saved' || orderStatus === 'S' ? '已保存' : orderStatus === 'submit' || orderStatus === 'D' ? '已提交' : orderStatus === 'checked' || orderStatus === 'C' ? '通过' : orderStatus === '已同步' || orderStatus === 'T' || orderStatus === 'N' ? '未录入' : orderStatus === 'toBeAudited' ? '待审核' : orderStatus }}
                </i>
            </div>
            <div v-if="headShow" class="dataEntry-head-base">
                <el-form :inline="true" :model="formHeader" size="small" class="dataEntry-head-base__form">
                    <el-form-item v-for="(item, index) in headerBase" :key="index">
                        <template slot="label">
                            <i class="iconfont" :class="item.icon" style="margin-right: 5px; margin-left: 2px;" />
                            <span>{{ item.label }}：</span>
                        </template>
                        <p v-if="item.type === 'p'">
                            {{ item.value | itemValue(formHeader) }}
                        </p>
                        <el-tooltip v-if="item.type === 'tooltip'" class="item" effect="dark" :content="item.value | itemValue(formHeader)" placement="top">
                            <p>
                                {{ item.value | itemValue(formHeader) }}
                            </p>
                        </el-tooltip>
                        <el-date-picker v-if="item.type === 'date-picker'" v-model="formHeader[item.value]" size="mini" type="date" :disabled="!isRedact" value-format="yyyy-MM-dd" format="yyyy-MM-dd" style="width: 120px;" @change="updateProductDate" />
                        <el-select v-if="item.type === 'select'" v-model="formHeader[item.value]" size="mini" style="width: 120px;" :disabled="!(isRedact && item.disabled)">
                            <el-option v-for="(optionIt, subIndex) in item.option.list" :key="subIndex" :label="optionIt[item.option.label]" :value="optionIt[item.option.value]" />
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <!--tabs-->
        <el-tabs id="DaatTtabs" ref="tabs" v-model="activeName" class="NewDaatTtabs tabsPages" type="border-card" :before-leave="beforeLeave" @tab-click="tabClick">
            <el-tab-pane v-for="(item, index) in tabs" :key="index" :name="setKey(index)">
                <span v-if="item.status !== undefined" slot="label" class="spanview">
                    <el-tooltip class="item" effect="dark" :content="item.status === 'noPass' ? '不通过' : item.status === 'saved' ? '已保存' : item.status === 'submit' ? '已提交' : item.status === 'checked' ? '通过' : '未录入'" placement="top-start">
                        <span
                            :style="{
                                color: item.status === 'noPass' ? 'red' : '',
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
        <div class="redactBox">
            <div class="redactBox" :style="{ 'padding-left': sidebarFold ? '64px' : '170px' }">
                <div class="redact clearfix">
                    <div v-if="type === 'entry'" class="redact_tips">
                        <i class="el-icon-info" />
                        <span v-if="orderStatus === 'toBeAudited'">请仔细核对数据后再进行提交</span>
                        <span v-else-if="orderStatus === 'checked' || orderStatus === '已审核'">订单已审核通过</span>
                        <span v-else-if="orderStatus === 'submit' || orderStatus === '待审核'">订单已提交，请等待审核</span>
                        <span v-else-if="orderStatus !== 'submit' && orderStatus !== 'checked' && orderStatus !== '已审核' && orderStatus !== '待审核' && orderStatus !== '已过账'">
                            <span v-if="isRedact">点击提交按钮，当前页面编辑信息将提交系统</span>
                            <span v-else>点击编辑按钮，对当前页面进行编辑</span>
                        </span>
                    </div>
                    <div v-if="type === 'entry'" class="redact_btn">
                        <el-button v-if="orderStatus !== 'submit' && orderStatus !== 'checked' && orderStatus !== '已审核' && orderStatus !== '待审核' && orderStatus !== '已过账' && isAuth(redactAuth)" type="primary" size="small" @click="isRedact = !isRedact">
                            {{ isRedact ? '取消' : '编辑' }}
                        </el-button>
                        <template v-if="isRedact || onlySubmit">
                            <el-button v-if="orderStatus !== 'submit' && orderStatus !== 'checked' && orderStatus !== '已审核' && orderStatus !== '待审核' && orderStatus !== '已过账' && isAuth(saveAuth)" type="primary" size="small" @click="savedData('saved')">
                                保存
                            </el-button>
                            <el-button v-if="ifSubmit() && isAuth(submitAuth)" type="primary" size="small" @click="submitData">
                                提交
                            </el-button>
                        </template>
                    </div>
                    <div v-if="type === 'audit'" class="redact_btn">
                        <el-button type="primary" size="small" class="sub-red" @click="pass()">
                            审核不通过
                        </el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'DataEntry',
        filters: {
            itemValue(value, formHeader) {
                if (Object.prototype.toString.call(value) === '[object Array]') {
                    let str = '';
                    value.forEach(it => {
                        str = str + ' ' + (formHeader[it] || '');
                    });
                    return str;
                }
                return formHeader[value];
            }
        },
        components: {},
        props: {
            type: {
                type: String,
                default: 'entry'
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
            }
        },
        data() {
            return {
                headShow: true,
                isRedact: false,
                activeName: '1'
            };
        },
        computed: {
            sidebarFold: {
                get() {
                    return this.$store.state.common.sidebarFold;
                }
            }
        },
        methods: {
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
            }
        }
    };
</script>

<style lang="scss"></style>
