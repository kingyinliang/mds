<template>
    <el-col>
        <el-form v-if="!lablewidth" :model="plantList" size="small" :inline="true" labelPosition="right" labelWidth="70px" class="multi_row">
            <el-form-item label="生产工厂：">
                <el-select v-model="plantList.factory" placeholder="请选择">
                    <el-option label="请选择" value="" />
                    <el-option v-for="(item, index) in factory" :key="index" :label="item.deptName" :value="item.deptId" />
                </el-select>
            </el-form-item>
            <el-form-item label="生产车间：">
                <el-select v-model="plantList.workshop" placeholder="请选择">
                    <el-option label="请选择" value="" />
                    <el-option v-for="(item, index) in workshop" :key="index" :label="item.deptName" :value="item.deptId" />
                </el-select>
            </el-form-item>
            <el-form-item label="生产产线：">
                <el-select v-model="plantList.productline" placeholder="产线">
                    <el-option label="请选择" value="" />
                    <el-option v-for="(item, index) in productline" :key="index" :label="item.deptName" :value="item.deptId" />
                </el-select>
            </el-form-item>
            <el-form-item v-if="plantList.deptId !== undefined" label="班组：">
                <el-select v-model="plantList.deptId" filterable placeholder="请选择">
                    <el-option label="请选择" value="" />
                    <el-option v-for="(iteam, index) in Team" :key="index" :label="iteam.deptName" :value="iteam.deptId" />
                </el-select>
            </el-form-item>
            <el-form-item v-if="plantList.deptId !== undefined" label="日期：">
                <el-date-picker v-model="plantList.productDate" type="month" placeholder="选择月份" valueFormat="yyyy-MM" style="width: 199px;" />
            </el-form-item>
        </el-form>
        <el-form v-if="lablewidth" :model="plantList" size="small" :inline="true" labelPosition="right" labelWidth="70px" class="multi_row">
            <el-form-item label="生产工厂：">
                <el-select v-model="plantList.factory" placeholder="请选择">
                    <el-option label="请选择" value="" />
                    <el-option v-for="(item, index) in factory" :key="index" :label="item.deptName" :value="item.deptId" />
                </el-select>
            </el-form-item>
            <el-form-item label="生产车间：">
                <el-select v-model="plantList.workshop" placeholder="请选择">
                    <el-option label="请选择" value="" />
                    <el-option v-for="(item, index) in workshop" :key="index" :label="item.deptName" :value="item.deptId" />
                </el-select>
            </el-form-item>
            <el-form-item label="生产产线：">
                <el-select v-model="plantList.productline" placeholder="产线">
                    <el-option label="请选择" value="" />
                    <el-option v-for="(item, index) in productline" :key="index" :label="item.deptName" :value="item.deptId" />
                </el-select>
            </el-form-item>
            <el-form-item v-if="plantList.deptId !== undefined" label="班组：">
                <el-select v-model="plantList.deptId" filterable placeholder="请选择">
                    <el-option label="请选择" value="" />
                    <el-option v-for="(iteam, index) in Team" :key="index" :label="iteam.deptName" :value="iteam.deptId" />
                </el-select>
            </el-form-item>
            <el-form-item v-if="plantList.deptId !== undefined" label="日期：">
                <el-date-picker v-model="plantList.productDate" type="month" placeholder="选择月份" valueFormat="yyyy-MM" style="width: 199px;" />
            </el-form-item>
        </el-form>
    </el-col>
</template>

<script>
import { BASICDATA_API } from '@/api/api';
export default {
    name: 'Linkage',
    components: {},
    props: {
        plantList: {},
        lablewidth: {},
        isPackaging: {}
    },
    data() {
        return {
            factory: [],
            workshop: [],
            productline: [],
            Team: []
        };
    },
    computed: {},
    watch: {
        'plantList.factory'(n, o) {
            this.Getdeptbyid(n);
        },
        'plantList.workshop'(n, o) {
            if (n) {
                if (this.plantList.deptId !== undefined) {
                    this.getTeam();
                    this.GetParentline(n);
                } else {
                    this.GetParentline(n);
                }
            }
        }
    },
    mounted() {
        this.Getdeptcode();
    },
    methods: {
        // 获取工厂
        Getdeptcode() {
            this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST', {}, false, false, false).then(({ data }) => {
                if (data.code === 0) {
                    this.factory = data.typeList;
                    if (!this.plantList.factory && data.typeList.length > 0) {
                        this.plantList.factory = data.typeList[0].deptId;
                    }
                } else {
                    this.$error_SHINHO(data.msg);
                }
            });
        },
        // 获取车间
        Getdeptbyid(id) {
            this.plantList.workshop = '';
            this.plantList.productline = '';
            if (id) {
                this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', this.isPackaging ? { deptId: id, deptName: '包装 组装' } : { deptId: id }, false, false, false).then(({ data }) => {
                    if (data.code === 0) {
                        this.workshop = data.typeList;
                        if (!this.plantList.workshop && data.typeList.length > 0) {
                            this.plantList.workshop = data.typeList[0].deptId;
                        }
                    } else {
                        this.$error_SHINHO(data.msg);
                    }
                });
            }
        },
        // 获取产线
        GetParentline(id) {
            this.plantList.productline = '';
            if (id) {
                this.$http(`${BASICDATA_API.FINDORGBYPARENTID_API}`, 'POST', { parentId: id }, false, false, false).then(({ data }) => {
                    if (data.code === 0) {
                        this.productline = data.childList;
                    } else {
                        this.$error_SHINHO(data.msg);
                    }
                });
            }
        },
        // 获取班组
        getTeam() {
            this.$http(
                `${BASICDATA_API.FINDTEAM_API}`,
                'POST',
                {
                    id: this.plantList.workshop,
                    factory: this.plantList.factory
                },
                false,
                false,
                false
            ).then(({ data }) => {
                this.Team = data.teamList;
            });
        }
    }
};
</script>

<style scoped></style>
