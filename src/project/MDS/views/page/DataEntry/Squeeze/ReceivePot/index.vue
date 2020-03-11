<template>
    <div class="header_main">
        <el-card class="searchCard ferCard">
            <el-form :inline="true" :model="formHeader" size="small" labelWidth="75px" class="topform sole_row">
                <el-form-item label="生产工厂：">
                    <el-select v-model="formHeader.factory" placeholder="请选择" style="width: 140px;">
                        <el-option label="请选择" value="" />
                        <el-option v-for="(item, index) in factory" :key="index" :label="item.deptName" :value="item.deptId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="生产车间：">
                    <el-select v-model="formHeader.workShop" placeholder="请选择" style="width: 140px;">
                        <el-option label="请选择" value="" />
                        <el-option v-for="(item, index) in workshop" :key="index" :label="item.deptName" :value="item.deptId" />
                    </el-select>
                </el-form-item>
                <el-form-item style="float: right; margin-right: 0;">
                    <el-button v-if="isAuth('fer:openholderg:holderInfo')" type="primary" size="small" style="float: right;" @click="GetDataList(true)">
                        查询
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="searchCard newCard ferCard" style="margin-top: 5px;">
            <h3 style="color: black; margin-bottom: 8px;">
                <i class="iconfont factory-liebiao" style="color: #666; margin-right: 10px;" />领用罐列表
            </h3>
            <el-row class="dataList" :gutter="10" style="min-height: 150px;">
                <el-col v-for="(item, index) in dataList" :key="index" :span="4">
                    <el-card class="dataList_item" style="padding: 0 !important;">
                        <h3 class="dataList_item_tit">
                            {{ item.holderNo }}
                            <span style="color: #333; font-weight: normal; font-size: 14px;">
                                -领用中
                            </span>
                        </h3>
                        <div class="dataList_item_pot clearfix" style="position: relative;">
                            <div class="dataList_item_pot_box">
                                <div class="dataList_item_pot_box1">
                                    <div class="dataList_item_pot_box_item1" :style="`height:${item.sumAmount ? (item.sumAmount / item.holderHold) * 100 : 0}%`" />
                                    <div class="dataList_item_pot_box_detail">
                                        <p>{{ item.batch }}</p>
                                        <p>{{ item.materialName }}</p>
                                        <p>{{ item.FER_DAYS || 0 }}天</p>
                                        <p> {{ item.sumAmount / 1000 || 0 }}方 </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <el-row class="dataList_item_btn">
                            <el-col :span="24" class="dataList_item_btn_item">
                                <p @click="repayPot(item)">
                                    还罐
                                </p>
                            </el-col>
                        </el-row>
                    </el-card>
                </el-col>
            </el-row>
            <el-row>
                <el-pagination :currentPage.sync="formHeader.currPage" :pageSize="42" layout="total, prev, pager, next" :total="formHeader.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </el-row>
        </el-card>
    </div>
</template>

<script>
import { BASICDATA_API, SQU_API } from '@/api/api';
export default {
    name: 'Index',
    components: {},
    data() {
        return {
            formHeader: {
                factory: '',
                workShop: '',
                // holderId: '',
                currPage: 1,
                pageSize: 42,
                totalCount: 0
            },
            factory: [],
            workshop: [],
            // guanList: [],
            sumDataList: [],
            dataList: []
        };
    },
    computed: {},
    watch: {
        'formHeader.factory'(n, o) {
            this.formHeader.workShop = '';
            this.Getdeptbyid(n);
        },
        'formHeader.workShop'(n, o) {
            // this.formHeader.holderId = ''
            // this.HolderList(n)
        }
    },
    mounted() {
        this.Getdeptcode();
    },
    methods: {
        GetDataList() {
            if (this.formHeader.factory === '') {
                this.$notify({
                    title: '警告',
                    message: '请选择工厂',
                    type: 'warning'
                });
                return false;
            }
            if (this.formHeader.workShop === '') {
                this.$notify({
                    title: '警告',
                    message: '请选择车间',
                    type: 'warning'
                });
                return false;
            }
            this.$http(`${SQU_API.POT_LIST_API}`, 'POST', this.formHeader).then(({ data }) => {
                if (data.code === 0) {
                    this.sumDataList = data.holderInfo;
                    this.formHeader.totalCount = data.holderInfo.length;
                    this.formHeader.currPage = 1;
                    this.dataList = this.sumDataList.slice((this.formHeader.currPage - 1) * this.formHeader.pageSize, (this.formHeader.currPage - 1) * this.formHeader.pageSize + this.formHeader.pageSize);
                    if (!this.dataList.length) {
                        this.$notify({
                            title: '警告',
                            message: '暂无数据',
                            type: 'warning'
                        });
                    }
                } else {
                    this.$error_SHINHO(data.msg);
                }
            });
        },
        repayPot(item) {
            if (!this.isAuth('fer:openholderg:revertHolder')) {
                this.$notify({
                    title: '警告',
                    message: '无权限操作',
                    type: 'warning'
                });
                return false;
            }
            this.$confirm('确认还罐, 是否继续?', '还罐', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http(`${SQU_API.POT_REPAY_API}`, 'POST', item).then(({ data }) => {
                    if (data.code === 0) {
                        this.$success_SHINHO('还罐成功');
                        this.GetDataList();
                    } else {
                        this.$error_SHINHO(data.msg);
                    }
                });
            });
        },
        // 获取工厂
        Getdeptcode() {
            this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST', {}, false, false, false).then(({ data }) => {
                if (data.code === 0) {
                    this.factory = data.typeList;
                    this.formHeader.factory = data.typeList[0].deptId;
                } else {
                    this.$error_SHINHO(data.msg);
                }
            });
        },
        // 获取车间
        Getdeptbyid(id) {
            if (id) {
                this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', { deptId: id, deptName: '压榨' }, false, false, false).then(({ data }) => {
                    if (data.code === 0) {
                        this.workshop = data.typeList;
                        if (data.typeList.length) {
                            this.formHeader.workShop = data.typeList[0].deptId;
                        }
                    } else {
                        this.$error_SHINHO(data.msg);
                    }
                });
            }
        },
        // 罐号
        HolderList(id) {
            this.$http(`${BASICDATA_API.DROPDOWN_HOLDER_LIST}`, 'POST', {
                factory: this.formHeader.factory,
                workShop: id,
                holderType: '001'
            }).then(({ data }) => {
                this.guanList = data.holderList;
            });
        },
        // 改变每页条数
        handleSizeChange(val) {
            this.formHeader.pageSize = val;
            this.dataList = this.sumDataList.slice((this.formHeader.currPage - 1) * this.formHeader.pageSize, (this.formHeader.currPage - 1) * this.formHeader.pageSize + this.formHeader.pageSize);
        },
        // 跳转页数
        handleCurrentChange(val) {
            this.formHeader.currPage = val;
            this.dataList = this.sumDataList.slice((this.formHeader.currPage - 1) * this.formHeader.pageSize, (this.formHeader.currPage - 1) * this.formHeader.pageSize + this.formHeader.pageSize);
        }
    }
};
</script>

<style lang="scss" scoped>
.ferCard {
    .el-card__body {
        padding: 7px;
    }
    .cardTit {
        font-size: 16px;
        color: black;
        font-weight: 400;
        padding-bottom: 10px;
        border-bottom: 1px solid #e9e9e9;
    }
    .gotop {
        float: right;
        color: #1890ff;
        font-size: 14px;
        cursor: pointer;
        i {
            ::before {
                color: #1890ff;
            }
        }
    }
}
.topBox {
    width: 1160px;
    padding: 25px 25px 10px 25px;
    margin: auto;
    &_boxItem {
        position: relative;
        cursor: pointer;
        width: 131px;
        float: left;
        &_bar {
            width: 115px;
            height: 2px;
            margin: 15px 8px 0 8px;
            background: #f2f2f2;
            &_box {
                height: 2px;
            }
        }
        &_tit {
            color: black;
            font-size: 16px;
            margin-top: 10px;
            text-align: center;
            line-height: 32px;
        }
        &_detail {
            font-size: 14px;
            text-align: center;
            color: #666;
            span {
                color: black;
            }
        }
        &_popover {
            display: none;
            top: -60px;
            min-width: 150px;
            min-height: 52px;
            padding: 10px 16px;
            border-radius: 4px;
            font-size: 13px;
            line-height: 18px;
            position: absolute;
            z-index: 999999;
            background: white;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
            .dot {
                width: 6px;
                height: 6px;
                float: left;
                margin: 4px 5px 0 0;
                border-radius: 50%;
            }
            &_ar {
                position: absolute;
                bottom: -12px;
                width: 0;
                height: 0;
                border-width: 6px;
                border-style: solid;
                border-color: #fff transparent transparent transparent;
            }
        }
    }
    &_circle {
        width: 32px;
        height: 32px;
        float: left;
        line-height: 32px;
        text-align: center;
        color: white;
        border-radius: 50%;
        background: #999;
        transition: all 0.5s;
    }
}
.dataList {
    margin-top: 10px;
    &_item {
        margin-bottom: 10px;
        &_tit {
            font-weight: 600;
            color: black;
            font-size: 16px;
            padding: 0 10px;
            line-height: 45px;
            border-bottom: 1px solid #e8e8e8;
        }
        &_a {
            cursor: pointer;
            color: #1890ff;
            float: right;
        }
        &_pot {
            padding: 17px 10px 10px 10px;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            overflow: hidden;
            &_box1 {
                position: relative;
                overflow: hidden;
                width: 102px;
                height: 197px;
                display: flex;
                flex-wrap: wrap;
                align-content: flex-end;
            }
            &_box {
                overflow: hidden;
                padding: 25px 9px 9px 9px;
                color: white;
                float: left;
                display: flex;
                flex-wrap: wrap;
                align-content: flex-end;
                width: 120px;
                height: 229px;
                min-width: 120px;
                background: url('~@/assets/img/ferPot.png') no-repeat;
                background-size: contain;
                &_detail {
                    width: 100%;
                    position: absolute;
                    font-size: 14px;
                    top: 70px;
                    color: black;
                    left: 3px;
                }
                &_item1,
                &_item2 {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                }
                &_item2s,
                &_item1 {
                    height: 50px;
                    background: #69c0ff;
                    position: relative;
                    overflow: hidden;
                    &::before,
                    &::after {
                        content: '';
                        position: absolute;
                        left: 50%;
                        min-width: 175px;
                        min-height: 165px;
                        background: #fff;
                        animation: roateTwo 10s linear infinite;
                    }
                    &::before {
                        top: -158px;
                        border-radius: 45%;
                    }
                    &::after {
                        top: -152px;
                        opacity: 0.5;
                        border-radius: 47%;
                    }
                }
                &_item2 {
                    height: 100px;
                    background: #1890ff;
                }
                &:hover &_item1::before,
                &:hover &_item1::after,
                &:hover &_item2s::before,
                &:hover &_item2s::after {
                    animation: roateOne 10s linear infinite;
                }
            }
            &_detail {
                max-width: 112px;
                height: auto;
                float: left;
                margin-top: 25px;
                margin-left: 10px;
                color: #333;
                font-size: 14px;
                line-height: 18px;
                padding: 5px;
                border-radius: 4px;
                border: 1px solid #1890ff;
            }
        }
    }
}

@keyframes roateOne {
    0% {
        transform: translate(-50%, -0%) rotateZ(0deg);
    }
    50% {
        transform: translate(-50%, -1%) rotateZ(180deg);
    }
    100% {
        transform: translate(-50%, -0%) rotateZ(360deg);
    }
}

@keyframes roateTwo {
    0% {
        transform: translate(-50%, -0%) rotateZ(0deg);
    }
    50% {
        transform: translate(-50%, -0%) rotateZ(0deg);
    }
    100% {
        transform: translate(-50%, -0%) rotateZ(0deg);
    }
}
</style>
