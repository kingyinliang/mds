<template>
    <div class="header_main">
        <el-card class="search-card">
            <el-row>
                <el-col>
                    <el-form :model="formHeader" :inline="true" size="small" label-width="70px" class="multi_row">
                        <el-form-item label="生产工厂：">
                            <el-select v-model="formHeader.factory" placeholder="请选择" class="width180px">
                                <el-option label="请选择" value="" />
                                <el-option v-for="(item, index) in factory" :key="index" :label="item.deptName" :value="item.deptId" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="生产车间：">
                            <el-select v-model="formHeader.workShop" placeholder="请选择" class="width180px">
                                <el-option label="请选择" value="" />
                                <el-option v-for="(item, index) in workshop" :key="index" :label="item.deptName" :value="item.deptId" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="布浆线：">
                            <el-select v-model="formHeader.productLine" placeholder="请选择" class="width180px">
                                <el-option label="请选择" value="" />
                                <el-option v-for="(item, index) in productline" :key="index" :label="item.deptName" :value="item.deptId" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="工序：">
                            <el-select v-model="formHeader.pressure" placeholder="请选择" class="width180px">
                                <el-option v-for="(item, index) in pressureList" :key="index" :label="item.label" :value="item.value" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="生产日期：">
                            <el-date-picker v-model="formHeader.productDate" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 180px;" />
                        </el-form-item>
                        <el-form-item class="floatr">
                            <el-button v-if="isAuth('prs:prepress:pressList')" type="primary" size="small" @click="SearchList">
                                查询
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </el-card>
        <div class="tableCard">
            <el-tabs v-show="contentshow" id="DaatTtabs" v-model="activeName" class="NewDaatTtabs tabsPages" type="border-card" style="margin-top: 5px;">
                <el-tab-pane name="1" label="物料领用">
                    <Material ref="material" :is-redact="isRedact" :form-header="formHeader" />
                </el-tab-pane>
                <el-tab-pane name="2" label="异常记录">
                    <exc-record ref="excrecord" :is-redact="isRedact" :order="formHeader" />
                </el-tab-pane>
                <el-tab-pane name="3" label="文本记录">
                    <text-record ref="textrecord" :is-redact="isRedact" />
                </el-tab-pane>
            </el-tabs>
        </div>
        <redact-box v-if="contentshow">
            <template slot="button">
                <el-button v-if="orderStatus !== 'submit' && orderStatus !== 'checked' && isAuth('prs:pressUpdate')" type="primary" class="button" size="small" @click="isRedact = !isRedact">
                    {{ isRedact ? '取消' : '编辑' }}
                </el-button>
                <template v-if="isRedact" style="float: right;">
                    <el-button v-if="isAuth('prs:pressUpdate')" type="primary" size="small" @click="savedOrSubmitForm('saved')">
                        保存
                    </el-button>
                    <el-button v-if="isAuth('prs:pressUpdate')" type="primary" size="small" @click="SubmitForm">
                        提交
                    </el-button>
                </template>
            </template>
        </redact-box>
    </div>
</template>

<script>
import { BASICDATA_API } from '@/api/api';
import { headanimation, dateFormat } from '@/net/validate';
import Material from './common/material';
import ExcRecord from '@/views/components/ExcRecord';
import TextRecord from '@/views/components/TextRecord';
export default {
    name: 'Press',
    components: {
        Material,
        ExcRecord,
        TextRecord
    },
    data() {
        return {
            contentshow: false,
            isRedact: false,
            succmessage: '',
            orderStatus: '',
            activeName: '1',
            factory: [],
            workshop: [],
            productline: [],
            pressureList: [
                {
                    value: 1,
                    label: '预压'
                },
                {
                    value: 2,
                    label: '终压'
                }
            ],
            formHeader: {
                factory: '',
                workShop: '',
                productLine: '',
                pressure: 1,
                productDate: dateFormat(new Date(), 'yyyy-MM-dd')
            },
            proxy: []
        };
    },
    watch: {
        'formHeader.factory'(n) {
            this.Getdeptbyid(n);
            this.contentshow = false;
            this.isRedact = false;
        },
        'formHeader.workShop'(n) {
            this.GetParentline(n);
            this.contentshow = false;
            this.isRedact = false;
        },
        'formHeader.pressure'() {
            this.contentshow = false;
            this.isRedact = false;
        },
        'formHeader.productDate'() {
            this.contentshow = false;
            this.isRedact = false;
        }
    },
    mounted() {
        headanimation(this.$);
        this.Getdeptcode();
    },
    methods: {
        // 获取工厂
        Getdeptcode() {
            this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST').then(({ data }) => {
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
            this.formHeader.workShop = '';
            this.formHeader.productLine = '';
            if (id) {
                this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {
                    deptId: id,
                    deptName: '压榨'
                }).then(({ data }) => {
                    if (data.code === 0) {
                        this.workshop = data.typeList;
                        if (data.typeList.length > 0) {
                            this.formHeader.workShop = data.typeList[0].deptId;
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
            this.formHeader.productLine = '';
            if (id) {
                this.$http(`${BASICDATA_API.FINDORGBYPARENTID1_API}`, 'POST', {
                    parentId: id,
                    deptType: 'proLine'
                }).then(({ data }) => {
                    if (data.code === 0) {
                        this.productline = data.childList;
                        this.formHeader.productLine = data.childList[0].deptId;
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            } else {
                this.productline = [];
            }
        },
        SearchList() {
            if (!this.formHeader.factory || this.formHeader.factory === '') {
                this.$warningToast('请选择生产工厂');
                return false;
            }
            if (!this.formHeader.workShop || this.formHeader.workShop === '') {
                this.$warningToast('请选择生产车间');
                return false;
            }
            this.formHeader.workShopName = this.workshop.find(item => item.deptId === this.formHeader.workShop).deptName;
            if (!this.formHeader.productLine || this.formHeader.productLine === '') {
                this.$warningToast('请选择布浆线');
                return false;
            }
            if (!this.formHeader.pressure || this.formHeader.pressure === '') {
                this.$warningToast('请选择工序');
                return false;
            }
            if (!this.formHeader.productDate || this.formHeader.productDate === '') {
                this.$warningToast('请选择生产日期');
                return false;
            }
            this.contentshow = true;
            this.$refs.material.GetMateriaList(this.formHeader);
            this.$refs.material.GetpulpMachine(this.formHeader);
            this.$refs.excrecord.GetequipmentType(this.formHeader.productLine);
            this.$refs.excrecord.getDataList(this.formHeader.factory);
            this.$refs.excrecord.GetExcDate({
                factory: this.formHeader.factory,
                workShop: this.formHeader.workShop,
                productLine: this.formHeader.productLine,
                productDate: this.formHeader.productDate
            });
            this.$refs.textrecord.GetText({
                factory: this.formHeader.factory,
                workShop: this.formHeader.workShop,
                productLine: this.formHeader.productLine,
                productDate: this.formHeader.productDate
            });
        },
        // 提交
        SubmitForm() {
            this.$confirm('确认提交该订单, 是否继续?', '提交订单', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.savedOrSubmitForm('submit');
            }).catch(() => {
                // this.$infoToast('已取消删除');
            });
        },
        // 保存
        savedOrSubmitForm(str) {
            const excSaveNet = new Promise((resolve, reject) => {
                this.$refs.excrecord.saveOrSubmitExc(this.formHeader, 'Squeeze', resolve, reject);
            });
            const textSaveNet = new Promise((resolve, reject) => {
                this.$refs.textrecord.UpdateText(this.formHeader, 'Squeeze', resolve, reject);
            });
            let net3;
            if (str === 'submit') {
                this.succmessage = '提交成功';
                net3 = new Promise((resolve, reject) => {
                    this.$refs.material.submitMaterial(resolve, reject);
                });
            } else {
                this.succmessage = '保存成功';
                net3 = new Promise((resolve, reject) => {
                    this.$refs.material.updateMaterial(resolve, reject);
                });
            }
            Promise.all([net3, excSaveNet, textSaveNet])
                .then(() => {
                    this.$notify({
                        title: '成功',
                        message: this.succmessage,
                        type: 'success'
                    });
                    this.SearchList();
                    this.isRedact = false;
                })
                .catch(() => {
                    this.$errorToast('网络请求失败，请刷新重试');
                });
        },
        tabClick(val) {
            this.$refs.tabs.setCurrentName(val.name);
        }
    }
};
</script>

<style lang="scss" scoped>
.width180px {
    width: 180px;
}
.search-card {
    .el-button--primary,
    .el-button--primary:focus {
        color: #000;
        background-color: #fff;
        border-color: #d9d9d9;
    }
    .el-button--primary:hover {
        color: #fff;
        background-color: #1890ff;
    }
    .el-button--primary:first-child {
        color: #fff;
        background-color: #1890ff;
        border-color: #1890ff;
    }
}
</style>
