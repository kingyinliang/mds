<template>
    <div class="header_main">
        <el-card class="searchCard ferCard">
            <el-form :inline="true" :model="formHeader" size="small" label-width="75px" class="topform sole_row">
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
        <mds-card title="领用罐列表" :pack-up="false" style="margin-top: 5px;">
            <el-row class="potList" :gutter="10" style="min-height: 150px;">
                <el-col v-for="(item, index) in dataList" :key="index" :span="4">
                    <div class="box">
                        <div class="box_title">
                            {{ item.holderNo }}-领用中
                            <el-button type="primary" size="small" style="float: right; margin-top: -2px; padding: 0 10px; line-height: 24px;" @click="repayPot(item)">
                                还罐
                            </el-button>
                        </div>
                        <div class="box_content">
                            <div class="box_content_itemPot">
                                <div class="pot_border">
                                    <div class="pot" />
                                    <div class="pot_water">
                                        <div
                                            class="pot_water_sole"
                                            :style="{'height': (item.sumAmount ? (item.sumAmount / item.holderHold) * 100 : 0) + '%', 'background': item.potColor}"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="box_bottom">
                            <div>
                                <div class="box_bottom_sole">
                                    {{ item.materialName }}
                                </div>
                                <div class="box_bottom_sole">
                                    {{ item.FER_DAYS || 0 }}天
                                </div>
                                <div class="box_bottom_sole">
                                    {{ item.batch }}
                                </div>
                                <div class="box_bottom_sole">
                                    {{ item.sumAmount / 1000 || 0 }}方
                                </div>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-pagination :current-page.sync="formHeader.currPage" :page-size="42" layout="total, prev, pager, next" :total="formHeader.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </el-row>
        </mds-card>
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
        'formHeader.factory'(n) {
            this.formHeader.workShop = '';
            this.Getdeptbyid(n);
        },
        'formHeader.workShop'() {
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
                    this.dataList.map((item) => {
                        if (item.FER_DAYS <= 30) {
                            item.potColor = 'rgb(214, 210, 196)';
                        } else if (item.FER_DAYS <= 60) {
                            item.potColor = 'rgb(205, 167, 134)';
                        } else if (item.FER_DAYS <= 90) {
                            item.potColor = 'rgb(181, 129, 80)';
                        } else if (item.FER_DAYS <= 120) {
                            item.potColor = 'rgb(198, 124, 90)';
                        } else if (item.FER_DAYS <= 150) {
                            item.potColor = 'rgb(173, 89, 45)';
                        } else if (item.FER_DAYS <= 180) {
                            item.potColor = 'rgb(138, 57, 27)';
                        } else if (item.FER_DAYS > 180) {
                            item.potColor = 'rgb(199, 9, 9)';
                        }
                    })
                    if (!this.dataList.length) {
                        this.$notify({
                            title: '警告',
                            message: '暂无数据',
                            type: 'warning'
                        });
                    }
                } else {
                    this.$errorToast(data.msg);
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
                        this.$successToast('还罐成功');
                        this.GetDataList();
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            }).catch(() => {
                // this.$infoToast('已取消删除');
            });
        },
        // 获取工厂
        Getdeptcode() {
            this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST', {}, false, false, false).then(({ data }) => {
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
            if (id) {
                this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', { deptId: id, deptName: '压榨' }, false, false, false).then(({ data }) => {
                    if (data.code === 0) {
                        this.workshop = data.typeList;
                        if (data.typeList.length) {
                            this.formHeader.workShop = data.typeList[0].deptId;
                        }
                    } else {
                        this.$errorToast(data.msg);
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
        padding-bottom: 10px;
        color: black;
        font-weight: 400;
        font-size: 16px;
        border-bottom: 1px solid #e9e9e9;
    }
    .gotop {
        float: right;
        color: #1890ff;
        font-size: 14px;
        cursor: pointer;
        em {
            ::before {
                color: #1890ff;
            }
        }
    }
}
.topBox {
    width: 1160px;
    margin: auto;
    padding: 25px 25px 10px;
    &_boxItem {
        position: relative;
        float: left;
        width: 131px;
        cursor: pointer;
        &_bar {
            width: 115px;
            height: 2px;
            margin: 15px 8px 0;
            background: #f2f2f2;
            &_box {
                height: 2px;
            }
        }
        &_tit {
            margin-top: 10px;
            color: black;
            font-size: 16px;
            line-height: 32px;
            text-align: center;
        }
        &_detail {
            color: #666;
            font-size: 14px;
            text-align: center;
            span {
                color: black;
            }
        }
        &_popover {
            position: absolute;
            top: -60px;
            z-index: 999999;
            display: none;
            min-width: 150px;
            min-height: 52px;
            padding: 10px 16px;
            font-size: 13px;
            line-height: 18px;
            background: white;
            border-radius: 4px;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
            .dot {
                float: left;
                width: 6px;
                height: 6px;
                margin: 4px 5px 0 0;
                border-radius: 50%;
            }
            &_ar {
                position: absolute;
                bottom: -12px;
                width: 0;
                height: 0;
                border-color: #fff transparent transparent;
                border-style: solid;
                border-width: 6px;
            }
        }
    }
    &_circle {
        float: left;
        width: 32px;
        height: 32px;
        color: white;
        line-height: 32px;
        text-align: center;
        background: #999;
        border-radius: 50%;
        transition: all 0.5s;
    }
}
.dataList {
    margin-top: 10px;
    &_item {
        margin-bottom: 10px;
        &_tit {
            padding: 0 10px;
            color: black;
            font-weight: 600;
            font-size: 16px;
            line-height: 45px;
            border-bottom: 1px solid #e8e8e8;
        }
        &_a {
            float: right;
            color: #1890ff;
            cursor: pointer;
        }
        &_pot {
            display: flex;
            align-items: flex-start;
            justify-content: center;
            padding: 17px 10px 10px;
            overflow: hidden;
            &_box1 {
                position: relative;
                display: flex;
                flex-wrap: wrap;
                align-content: flex-end;
                width: 102px;
                height: 197px;
                overflow: hidden;
            }
            &_box {
                display: flex;
                flex-wrap: wrap;
                align-content: flex-end;
                float: left;
                width: 120px;
                min-width: 120px;
                height: 229px;
                padding: 25px 9px 9px;
                overflow: hidden;
                color: white;
                background: url("~@/assets/img/ferPot.png") no-repeat;
                background-size: contain;
                &_detail {
                    position: absolute;
                    top: 70px;
                    left: 3px;
                    width: 100%;
                    color: black;
                    font-size: 14px;
                }
                &_item1,
                &_item2 {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    font-size: 14px;
                }
                &_item2s,
                &_item1 {
                    position: relative;
                    height: 50px;
                    overflow: hidden;
                    background: #69c0ff;
                    &::before,
                    &::after {
                        position: absolute;
                        left: 50%;
                        min-width: 175px;
                        min-height: 165px;
                        background: #fff;
                        animation: roateTwo 10s linear infinite;
                        content: "";
                    }
                    &::before {
                        top: -158px;
                        border-radius: 45%;
                    }
                    &::after {
                        top: -152px;
                        border-radius: 47%;
                        opacity: 0.5;
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
                float: left;
                max-width: 112px;
                height: auto;
                margin-top: 25px;
                margin-left: 10px;
                padding: 5px;
                color: #333;
                font-size: 14px;
                line-height: 18px;
                border: 1px solid #1890ff;
                border-radius: 4px;
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
