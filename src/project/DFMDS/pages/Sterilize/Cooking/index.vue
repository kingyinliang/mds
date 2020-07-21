<template>
    <div class="header_main">
        <el-card class="searchCard" style="margin-bottom: 5px;">
            <el-form :model="formHeader" :rules="queryFormRules" :inline="true" size="small" label-width="70px" class="multi_row clearfix" style="font-size: 0;">
                <el-form-item label="生产车间：">
                    <el-select v-model="formHeader.workShop" style="width: 170px;" placeholder="请选择">
                        <el-option v-for="(item, optIndex) in workShop" :key="optIndex" :label="item.deptName" :value="item.deptCode" />
                    </el-select>
                </el-form-item>
                <el-form-item label="煮料锅/混合罐：" label-width="110px">
                    <el-select v-model="formHeader.potNo" style="width: 170px;" placeholder="请选择" clearable filterable>
                        <el-option v-for="(item, optIndex) in holderList" :key="optIndex" :label="item.holderName" :value="item.holderNo" />
                    </el-select>
                </el-form-item>
                <el-form-item label="生产物料：">
                    <el-select v-model="formHeader.productMaterial" style="width: 170px;" placeholder="请选择" clearable filterable>
                        <el-option v-for="(item, optIndex) in materialList" :key="optIndex" :label="item.materialCode + ' ' + item.materialName" :value="item.materialCode" />
                    </el-select>
                </el-form-item>
                <el-form-item label="配置日期：">
                    <el-date-picker v-model="formHeader.configStartDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd" style="width: 140px;" />
                </el-form-item>
                <el-form-item label="煮料锅序：">
                    <el-select v-model="formHeader.potOrder" style="width: 170px;" placeholder="请选择" clearable filterable>
                        <el-option v-for="(item, optIndex) in holderNumberList" :key="optIndex" :label="item.name" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="煮料单号：">
                    <el-input v-model="formHeader.cookingNo" style="width: 170px;" placeholder="请录入" clearable />
                </el-form-item>
                <el-form-item label="状态：">
                    <el-select v-model="formHeader.potStatus" style="width: 170px;" placeholder="请选择" clearable>
                        <el-option v-for="(item, optIndex) in statusList" :key="optIndex" :label="item.name" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item class="floatr">
                    <el-button type="primary" size="small" @click="getDataList(true)">
                        查询
                    </el-button>
                    <el-button type="primary" size="small" @click="insertItem()">
                        新增
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <mds-card title="煮料列表" name="cookingIndex" :pack-up="false">
            <el-table ref="table" class="newTable" :data="dataList" border tooltip-effect="dark" header-row-class-name="tableHead" style="width: 100%; margin-bottom: 20px;">
                <el-table-column type="index" label="序号" fixed="left" width="55" />
                <el-table-column label="状态" min-width="70" show-overflow-tooltip prop="potStatusName" />
                <el-table-column label="煮料单号" min-width="145">
                    <template slot-scope="scope">
                        <a @click="goDetail(scope.row)">{{ scope.row.cookingNo }}</a>
                    </template>
                </el-table-column>
                <el-table-column label="生产车间" min-width="110" prop="workShopName" />
                <el-table-column label="煮料锅/混合罐" min-width="120" show-overflow-tooltip prop="potNoName" />
                <el-table-column label="生产物料" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ scope.row.productMaterial }} {{ scope.row.productMaterialName }}
                    </template>
                </el-table-column>
                <el-table-column label="配置日期" min-width="140" prop="configStartDate" />
                <el-table-column label="使用日期" min-width="100" prop="useDate" />
                <el-table-column label="配置锅数" min-width="80" prop="configPotCount" />
                <el-table-column label="使用锅数" min-width="80" prop="usePotCount" />
                <el-table-column label="剩余库存" min-width="80" prop="remainder" />
                <el-table-column label="操作人" width="150" prop="changer" />
                <el-table-column label="操作时间" width="160" prop="changed" />
                <el-table-column label="操作" width="60" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" :disabled="(scope.row.clear <= 2 ? true : false)" @click="clearHolder(scope.row)">
                            清罐
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                :current-page="formHeader.current"
                :page-sizes="[10, 20, 50]"
                :page-size="formHeader.size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="formHeader.total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </mds-card>
        <el-dialog title="清罐" :close-on-click-modal="false" :visible.sync="isDialogShow">
            <div style="width: 400px; margin: auto;">
                <el-form ref="formatData" :model="formatData" size="small" label-width="110px" @keyup.enter.native="dataFormSubmit()" @submit.native.prevent>
                    <el-form-item label="煮料锅/混合罐：">
                        {{ formatData.potNoName }}
                    </el-form-item>
                    <el-form-item label="状态：">
                        {{ formatData.potStatusName }}
                    </el-form-item>
                    <el-form-item label="生产物料：">
                        {{ formatData.productMaterial }} {{ formatData.productMaterialName }}
                    </el-form-item>
                    <el-form-item label="罐内数量：">
                        {{ formatData.remainder }} KG
                    </el-form-item>
                    <el-form-item label="备注：">
                        <el-input v-model="formatData.remark" placeholder="手工录入" />
                    </el-form-item>
                    <el-form-item label="操作人：">
                        {{ formatData.changer }}
                    </el-form-item>
                    <el-form-item label="操作时间：">
                        {{ formatData.changed }}
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="isDialogShow = false">取消</el-button>
                <el-button size="small" type="primary" @click="dataFormSubmit('formatData')">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { COMMON_API, STE_API } from 'common/api/api';
import { dateFormat, getUserNameNumber, accSub } from 'utils/utils';

@Component

export default class AuditIndex extends Vue {
    formHeader = {
        workShop: '',
        potNo: '',
        productMaterial: '',
        configStartDate: dateFormat(new Date(), 'yyyy-MM-dd'),
        potOrder: '',
        cookingNo: '',
        potStatus: '',
        current: 1,
        size: 10,
        total: 0
    };

    queryFormRules = {};
    workShop = [];
    holderList: HoldList[] = [];
    materialList: MaterialList[] = [];
    holderNumberList: HolderNumber[] = [];
    dataList = [];
    statusList = [
        {
            name: '已保存',
            value: 'S'
        },
        {
            name: '已提交',
            value: 'M'
        }
    ];

    currentPage = 1;
    isDialogShow = false;
    formatData = {};

    mounted() {
        this.getWorkShop();
        this.getHolderNumber();
    }

    @Watch('formHeader.workShop')
    changeWorkShop(newVal) {
        this.getHolderList(newVal);
    }

    @Watch('formHeader.potNo')
    changeHolderVisible(newVal) {
        this.formHeader.productMaterial = '';
        this.getMaterial(newVal);
    }

    // 车间下拉
    getWorkShop() {
        COMMON_API.ORG_QUERY_WORKSHOP_API({
            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
            deptType: ['WORK_SHOP'],
            deptName: '杀菌'
        }).then(({ data }) => {
            if (data.code === 200) {
                this.workShop = data.data;
                if (data.data.length !== 0) {
                    this.formHeader.workShop = data.data[0]['id'];
                }
            }
        })
    }

    // 煮料锅/罐下拉
    getHolderList(deptId) {
        if (deptId) {
            COMMON_API.HOLDER_DROPDOWN_API({
                deptId: this.formHeader.workShop,
                holderType: '020'
            }).then(({ data }) => {
                this.holderList = data.data
            })
        } else {
            this.holderList = [];
        }
    }

    // 生产物料下拉
    getMaterial(potNo) {
        this.materialList = []
        if (potNo !== '') {
            // eslint-disable-next-line
            const materialSole: any = this.holderList.find(item => item.holderNo === potNo);
            if (materialSole['material'].length > 0) {
                this.materialList = materialSole['material'];
            } else {
                STE_API.STE_COOKING_MATERIAL_QUERY_API({ preStages: ['MIX'], productGroup: '1' }).then(({ data }) => {
                    data.data.map(item => {
                        this.materialList.push({
                            materialCode: item.productMaterial,
                            materialName: item.productMaterialName
                        });
                    })
                })
            }
        }
    }

    // 煮料锅序
    getHolderNumber() {
        let i = 1;
        while (i <= 20) {
            this.holderNumberList.push({
                value: i,
                name: '第' + i + '锅'
            })
            i++;
        }
    }

    // 新增
    insertItem() {
        if (!this.formHeader.workShop) {
            this.$warningToast('请选择车间');
        }
        console.log(this.formHeader)
        this.$store.commit('sterilize/updateCooking', this.formHeader);
        this.$store.commit('common/updateMainTabs', this.$store.state.common.mainTabs.filter(subItem => subItem.name !== 'DFMDS-pages-Sterilize-Cooking-detail'))
        setTimeout(() => {
            this.$router.push({
                name: `DFMDS-pages-Sterilize-Cooking-detail`
            });
        }, 100);
    }

    // 查询
    getDataList(st?) {
        if (st === true) {
            this.formHeader.current = 1;
        }
        STE_API.STE_COOKING_POT_QUERY_API(this.formHeader).then(({ data }) => {
            if (data.code === 200) {
                this.dataList = data.data.records
                data.data.records.map((item) => {
                    const cha = Number.parseInt(accSub(item.usePotCount, item.configPotCount), 10);
                    item.clear = Math.abs(cha);
                })
                this.formHeader.total = data.data.total;
            }
        })
    }

    // 详情
    goDetail(row) {
        this.$store.commit('sterilize/updateCooking', row);
        this.$store.commit('common/updateMainTabs', this.$store.state.common.mainTabs.filter(subItem => subItem.name !== 'DFMDS-pages-Sterilize-Cooking-detail'))
        setTimeout(() => {
            this.$router.push({
                name: `DFMDS-pages-Sterilize-Cooking-detail`
            });
        }, 100);
    }

    handleSizeChange(val) {
        this.formHeader.size = val;
        this.getDataList();
    }

    handleCurrentChange(val) {
        this.formHeader.current = val;
        this.getDataList();
    }

    // 清罐弹框
    clearHolder(row) {
        this.formatData = {
            cookingId: row.id,
            cookingNo: row.cookingNo,
            potNoName: row.potNoName,
            remainder: 0,
            productMaterial: row.productMaterial,
            productMaterialName: row.productMaterial,
            potStatusName: row.potStatusName,
            remark: '',
            changer: getUserNameNumber(),
            changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
        }
        this.isDialogShow = true;
    }

    // 清罐
    dataFormSubmit() {
        STE_API.STE_COOKING_DETAIL_CLEAR_API(this.formatData).then(({ data }) => {
            if (data.code === 200) {
                this.isDialogShow = false;
                this.$successToast('清罐成功');
                this.getDataList(true);
            }
        })
    }
}
interface HolderNumber{
    value?: number;
    name?: string;
}
interface MaterialList{
    materialCode?: string;
    materialName?: string;
}
interface HoldList{
    deptId?: string;
    holderName?: string;
    holderNo: string;
    holderType?: string;
    holderVolume?: string;
    id?: string;
    material: MaterialList[];
}
</script>
