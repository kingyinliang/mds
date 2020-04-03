<template>
    <div class="header_main">
        <el-card class="newCard searchCard">
            <el-row>
                <el-col>
                    <el-form :model="formHeader" :inline="true" size="small" labelWidth="70px" class="multi_row">
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
                        <el-form-item label="生产日期：">
                            <el-date-picker v-model="formHeader.productDate" type="date" placeholder="选择日期" format="yyyy-MM-dd" valueFormat="yyyy-MM-dd" class="width180px" />
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <el-row style="text-align: right;">
                <template style="float: right; margin-left: 10px;">
                    <el-button v-if="isAuth('prs:pro:materialList')" type="primary" size="small" @click="SearchList">
                        查询
                    </el-button>
                    <el-button v-if="isAuth('prs:pro:updatePro')" type="primary" class="button" size="small" @click="isRedact = !isRedact">
                        {{ isRedact ? '取消' : '编辑' }}
                    </el-button>
                </template>
                <template v-if="isRedact" style="float: right; margin-left: 10px;">
                    <el-button v-if="isAuth('prs:pro:updatePro')" type="primary" size="small" @click="savedOrSubmitForm('saved')">
                        保存
                    </el-button>
                    <el-button v-if="isAuth('prs:pro:updatePro')" type="primary" size="small" @click="SubmitForm">
                        提交
                    </el-button>
                </template>
            </el-row>
            <div class="toggleSearchBottom">
                <i class="el-icon-caret-top" />
            </div>
        </el-card>
        <div class="tableCard">
            <div class="toggleSearchTop" style=" position: relative; margin-bottom: 8px; background-color: white; border-radius: 5px;">
                <i class="el-icon-caret-bottom" />
            </div>
            <el-tabs id="DaatTtabs" v-model="activeName" class="NewDaatTtabs" type="border-card" style="margin-top: 5px;" :style="{ display: contentshow ? 'block' : 'none' }">
                <el-tab-pane name="1" label="物料领用">
                    <Material ref="material" :isRedact="isRedact" :formHeader="formHeader" />
                </el-tab-pane>
                <el-tab-pane name="2" label="异常记录">
                    <exc-record ref="excrecord" :isRedact="isRedact" :order="formHeader" />
                </el-tab-pane>
                <el-tab-pane name="3" label="文本记录">
                    <text-record ref="textrecord" :isRedact="isRedact" />
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import { BASICDATA_API } from '@/api/api';
import { headanimation, dateFormat } from '@/net/validate';
import Material from './common/material';
import ExcRecord from '@/views/components/ExcRecord';
import TextRecord from '@/views/components/TextRecord';
export default {
    name: 'Cloth',
    components: {
        Material,
        ExcRecord,
        TextRecord
    },
    data() {
        return {
            isRedact: false,
            factory: [],
            workshop: [],
            productline: [],
            formHeader: {
                factory: '',
                workShop: '',
                productLine: '',
                productDate: dateFormat(new Date(), 'yyyy-MM-dd'),
                upMan: '',
                upDate: '',
                clickstatus: 'saved'
            },
            activeName: '1',
            succmessage: '保存成功',
            contentshow: false
        };
    },
    watch: {
        'formHeader.factory'(n) {
            this.Getdeptbyid(n);
        },
        'formHeader.workShop'(n) {
            this.GetParentline(n);
            this.contentshow = false;
            this.isRedact = false;
        },
        'formHeader.productLine'() {
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
                    this.$error_SHINHO(data.msg);
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
                        this.$error_SHINHO(data.msg);
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
                        this.$error_SHINHO(data.msg);
                    }
                });
            } else {
                this.productline = [];
            }
        },
        // 查询
        SearchList() {
            if (!this.formHeader.factory || this.formHeader.factory === '') {
                this.$warningTost('请选择生产工厂');
                return false;
            }
            if (!this.formHeader.workShop || this.formHeader.workShop === '') {
                this.$warningTost('请选择生产车间');
                return false;
            }
            if (!this.formHeader.productLine || this.formHeader.productLine === '') {
                this.$warningTost('请选择布浆线');
                return false;
            }
            if (!this.formHeader.productDate || this.formHeader.productDate === '') {
                this.$warningTost('请选择生产日期');
                return false;
            }
            this.contentshow = true;
            this.$refs.material.GetMateriaList(this.formHeader);
            this.$refs.excrecord.GetequipmentType(this.formHeader.productLine);
            this.$refs.excrecord.getDataList(this.formHeader.factory);
            this.$refs.excrecord.GetExcDate(this.formHeader);
            this.$refs.textrecord.GetText(this.formHeader);
        },
        // 提交
        SubmitForm() {
            if (!this.$refs.material.Readyrules()) {
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
                this.$set(this.formHeader, 'clickstatus', 'submit');
                this.succmessage = '提交成功';
            } else {
                this.$set(this.formHeader, 'clickstatus', 'saved');
            }
            const excSaveNet = new Promise((resolve, reject) => {
                this.$refs.excrecord.saveOrSubmitExc(this.formHeader, 'Squeeze', resolve, reject);
            });
            const textSaveNet = new Promise((resolve, reject) => {
                this.$refs.textrecord.UpdateText(this.formHeader, 'Squeeze', resolve, reject);
            });
            new Promise((resolve, reject) => {
                this.$refs.material.savemain(resolve, reject);
            }).then(() => {
                const net1 = new Promise((resolve, reject) => {
                    this.$refs.material.savesecond(resolve, reject);
                });
                const net2 = new Promise((resolve, reject) => {
                    this.$refs.material.savepeople(resolve, reject);
                });
                Promise.all([net1, net2, excSaveNet, textSaveNet])
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
                        this.$error_SHINHO('网络请求失败，请刷新重试');
                    });
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.width180px {
    width: 180px;
}

.searchCard {
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

#DaatTtabs {
    overflow: hidden;
    border-radius: 15px;
}
</style>
