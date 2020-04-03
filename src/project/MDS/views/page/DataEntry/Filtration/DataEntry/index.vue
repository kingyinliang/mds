<template>
    <div class="header_main">
        <el-card class="newCard" style="min-height: 480px;">
            <el-row type="flex" style="border-bottom: 1px solid #e9e9e9;">
                <el-col>
                    <el-form :model="formHeader" size="small" :inline="true" labelPosition="right" labelWidth="70px" class="multi_row">
                        <el-form-item label="生产工厂：">
                            <el-select v-model="formHeader.factory" class="selectwpx" style="width: 140px;">
                                <el-option label="请选择" value="" />
                                <el-option v-for="(item, index) in factory" :key="index" :label="item.deptName" :value="item.deptId" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="生产车间：">
                            <el-select v-model="formHeader.workShop" class="selectwpx" style="width: 140px;">
                                <el-option label="请选择" value="" />
                                <el-option v-for="(item, index) in workshop" :key="index" :label="item.deptName" :value="item.deptId" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="生产日期：">
                            <el-date-picker v-model="formHeader.productDate" type="date" valueFormat="yyyy-MM-dd" style="width: 140px;" />
                        </el-form-item>
                        <el-form-item label="订单：" labelWidth="42px">
                            <el-input v-model="formHeader.orderNo" type="text" clearable />
                        </el-form-item>
                        <el-form-item class="floatr">
                            <el-button v-if="isAuth('filter:order:list')" type="primary" size="small" style="float: right;" @click="GetOrderList(true)">
                                查询
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col v-for="(item, index) in dataList" id="normal" :key="index" :span="12" style="margin-top: 12px; padding-bottom: 20px;">
                    <div class="title_left" style=" margin-bottom: 8px; font-weight: 600; font-size: 16px;">
                        工序：
                        <font style="color: red;">
                            {{ item.productLineName }}
                        </font>
                    </div>
                    <div class="sole_cont">
                        <el-form size="small" :inline="true" labelPosition="right" labelWidth="80px">
                            <div class="itemImg">
                                <img :src="'data:image/gif;base64,' + item.img" alt="" style="width: 100%; min-height: 181px;">
                            </div>
                            <div class="title_left">
                                <div style="float: left; font-weight: 400; font-size: 14px; line-height: 60px;">
                                    <span
                                        class="points"
                                        :style="{
                                            background: item.orderStatus === 'noPass' ? 'red' : item.orderStatus === 'checked' ? '#67C23A' : item.orderStatus === 'submit' ? '#1890ff' : item.orderStatus === 'saved' ? '#1890ff' : '#7ED321',
                                        }"
                                    />订单状态：<i
                                        :style="{
                                            color: item.orderStatus === 'noPass' ? 'red' : item.orderStatus === 'checked' ? '#67C23A' : '',
                                        }"
                                    >{{ item.orderStatus === 'submit' ? '已提交' : item.orderStatus === 'checked' ? '审核通过' : item.orderStatus === 'noPass' ? '审核不通过' : item.orderStatus === 'saved' ? '已保存' : item.orderStatus === '已同步' ? '未录入' : item.orderStatus }}</i>
                                </div>
                                <el-button v-if="isAuth('filter:instorage:list')" type="primary" size="small" style="float: right; margin-top: 14px; color: white; background-color: #1890ff;" @click="go(item)">
                                    数据录入
                                </el-button>
                            </div>
                            <div class="normal_bottom">
                                <el-form-item label="订单号：" class="width50b">
                                    <el-select v-model="item.orderNo" placeholder="请选择" filterable :change="orderchange(item)" style="width: 180px;">
                                        <el-option v-for="(subItem, sunIndex) in subItem.orderNoList" :key="sunIndex" :label="subItem.orderNo + ' ' + subItem.materialName" :value="subItem.orderNo" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="计划产量：" class="width50b">
                                    <div style="width: 180px; border-bottom: 1px solid #ccc;">
                                        &nbsp;{{ (item.planOutput || '0') + ' ' + (item.outputUnit || '') }}
                                    </div>
                                </el-form-item>
                                <el-form-item label="品项：" class="width50b">
                                    <el-tooltip class="item" effect="dark" :content="(item.materialCode || '') + ' ' + (item.materialName || '')" placement="top">
                                        <div class="hiddenP">
                                            &nbsp;{{ (item.materialCode || '') + ' ' + (item.materialName || '') }}
                                        </div>
                                    </el-tooltip>
                                </el-form-item>
                                <el-form-item label="实际产量：" class="width50b">
                                    <div style="width: 180px; border-bottom: 1px solid #ccc;">
                                        &nbsp;{{ (item.countOutput || '0') + ' ' + (item.outputUnit || '') }}
                                    </div>
                                </el-form-item>
                            </div>
                        </el-form>
                    </div>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
import { getFactory, getWorkshop, orderListNew } from '@/net/validate';
import { FILTRATION_API } from '@/api/api';
export default {
    name: 'Index',
    components: {},
    data() {
        return {
            formHeader: {
                factory: '',
                workShop: '',
                productDate: '',
                orderNo: ''
            },
            factory: [],
            workshop: [],
            dataList: []
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
        }
    },
    watch: {
        'formHeader.factory'(n) {
            this.formHeader.workShop = '';
            getWorkshop(this, n, '过滤');
        }
    },
    mounted() {
        getFactory(this);
    },
    methods: {
        GetOrderList() {
            if (this.formHeader.factory === '') {
                this.$warningTost('请选择工厂');
                return;
            }
            if (this.formHeader.workShop === '') {
                this.$warningTost('请选择车间');
                return;
            }
            if ((this.formHeader.productDate === '' || !this.formHeader.productDate) && this.formHeader.orderNo === '') {
                this.$warningTost('生产日期或生产订单请选填一项');
                return false;
            }
            this.formHeader.orderType = '1';
            this.$http(`${FILTRATION_API.FILTER_HOME_LIST_API}`, 'POST', this.formHeader).then(({ data }) => {
                if (data.code === 0) {
                    // this.dataList = orderList(data.list)
                    this.dataList = orderListNew(data.list);
                } else {
                    this.$error_SHINHO(data.msg);
                }
            });
        },
        // 订单号下拉
        orderchange(row) {
            if (row.orderNo && row.orderNo !== row.orderNo2) {
                this.$http(`${FILTRATION_API.FILTER_HOME_LIST_API}`, 'POST', {
                    orderNo: row.orderNo,
                    orderType: '1'
                }).then(({ data }) => {
                    if (data.code === 0) {
                        row.orderNo2 = row.orderNo;
                        row.materialCode = data.list[0].materialCode;
                        row.materialName = data.list[0].materialName;
                        row.planOutput = data.list[0].planOutput;
                        row.orderStatus = data.list[0].orderStatus;
                        row.outputUnit = data.list[0].outputUnit;
                        row.properties = data.list[0].properties;
                        row.countOutput = data.list[0].countOutput;
                        row.plan = data.list[0].plan;
                        this.dataList.splice(this.dataList.length, 0, {});
                        this.dataList.splice(this.dataList.length - 1, 1);
                    } else {
                        this.$error_SHINHO(data.msg);
                    }
                });
            }
        },
        // 跳转
        go(item) {
            if (!item.orderNo) {
                this.$warningTost('请选择订单号');
                return;
            }
            this.$store.state.common.orderNo = item.orderNo;
            // this.$store.state.common.orderId = item.orderIdList[item.orderNo]
            this.$store.state.common.orderId = item.orderNoList.find(items => items.orderNo === item.orderNo).orderId;
            this.mainTabs = this.mainTabs.filter(subItem => subItem.name !== 'DataEntry-Filtration-DataEntry-detail');
            setTimeout(() => {
                this.$router.push({
                    name: `DataEntry-Filtration-DataEntry-detail`
                });
            }, 100);
        }
    }
};
</script>

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

.hiddenP {
    width: 180px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    border-bottom: 1px solid #ccc;
}
</style>
