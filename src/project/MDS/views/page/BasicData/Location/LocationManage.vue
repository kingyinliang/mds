<template>
    <el-col>
        <div class="main">
            <el-card>
                <div class="clearfix">
                    <el-row style="float: right;">
                        <el-form :inline="true" :model="form" size="small" label-width="68px" class="topforms2" @keyup.enter.native="getLocationList(true)" @submit.native.prevent>
                            <el-form-item>
                                <el-input v-model="form.deptName" placeholder="车间" suffix-icon="el-icon-search" />
                            </el-form-item>
                            <el-form-item>
                                <el-button v-if="isAuth('sys:sto:list')" type="primary" size="small" @click="getLocationList(true)">
                                    查询
                                </el-button>
                                <el-button v-if="isAuth('sys:sto:list')" type="primary" size="small" @click="visibleHightLevelQuery = true">
                                    高级查询
                                </el-button>
                                <el-button v-if="isAuth('sys:sto:save')" type="primary" size="small" @click="addLocation()">
                                    新增
                                </el-button>
                                <el-button v-if="isAuth('sys:sto:delete')" type="danger" size="small" @click="remove()">
                                    批量删除
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </el-row>
                </div>
                <el-row>
                    <el-table ref="table1" header-row-class-name="tableHead" :data="list" border tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;" @selection-change="handleSelectionChange" @row-dblclick="EditRow">
                        <el-table-column type="selection" width="34" />
                        <el-table-column type="index" label="序号" :index="indexMethod" width="55" />
                        <el-table-column prop="factoryName" width="120" :show-overflow-tooltip="true" label="工厂" />
                        <el-table-column prop="deptName" width="120" :show-overflow-tooltip="true" label="车间" />
                        <el-table-column :show-overflow-tooltip="true" label="物料类型">
                            <template slot-scope="scope">
                                {{ scope.row.materialTypeCode + ' ' + scope.row.materialTypeName }}
                            </template>
                        </el-table-column>
                        <el-table-column :show-overflow-tooltip="true" label="物料编码">
                            <template slot-scope="scope">
                                {{ scope.row.materialCode + ' ' + scope.row.materialName }}
                            </template>
                        </el-table-column>
                        <el-table-column width="80" prop="storageLocation" label="库位" />
                        <el-table-column width="91" label="是否样品库">
                            <template slot-scope="scope">
                                {{ scope.row.isSample === '0' ? '否' : '是' }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="materialOperation" width="84" label="发料/入库" />
                        <el-table-column width="84" label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" size="small" :disabled="isdisabled" @click="EditRow(scope.row)">
                                    编辑
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-row>
                <el-row>
                    <el-pagination :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                </el-row>
            </el-card>
        </div>
        <el-dialog title="高级查询" :close-on-click-modal="false" :visible.sync="visibleHightLevelQuery">
            <el-form :model="form" size="small" label-width="110px" class="locationdialog">
                <el-form-item label="工厂：">
                    <el-select v-model="form.factory" placeholder="请选择">
                        <el-option label="" value="">
                            请选择
                        </el-option>
                        <el-option v-for="(item, index) in factory" :key="index" :label="item.deptName" :value="item.deptId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="车间：" prop="orderNo1">
                    <el-select v-model="form.deptId" placeholder="请选择">
                        <el-option label="" value="">
                            请选择
                        </el-option>
                        <el-option v-for="(item, index) in workshop" :key="index" :label="item.deptName" :value="item.deptId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="物料类型：" prop="orderNo2">
                    <el-select v-model="form.materialTypeCode" placeholder="请选择">
                        <el-option label="" value="">
                            请选择
                        </el-option>
                        <el-option v-for="(item, index) in sapList" :key="index" :label="item.value" :value="item.code" />
                    </el-select>
                </el-form-item>
                <el-form-item label="库位：">
                    <el-input v-model="form.storageLocation" placeholder="手工录入" />
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="visibleHightLevelQuery = false">取消</el-button>
                <el-button type="primary" @click="getLocationList(true)">确定</el-button>
            </span>
        </el-dialog>
        <location-add v-if="visible" ref="locationAdd" @refreshDataList="getLocationList()" />
    </el-col>
</template>

<script>
import { BASICDATA_API, SYSTEMSETUP_API } from '@/api/api';
import LocationAdd from './LocationAdd';
export default {
    name: 'LocationManage',
    components: {
        LocationAdd
    },
    data() {
        return {
            visibleHightLevelQuery: false,
            visible: false,
            form: {
                factory: '',
                factoryName: '',
                deptName: '',
                deptId: '',
                materialTypeCode: '',
                storageLocation: ''
            },
            serch: {},
            list: [],
            multipleSelection: [],
            sapList: [],
            factory: [],
            workshop: [],
            SerchSapList: [],
            currPage: 1,
            pageSize: 10,
            totalCount: 0,
            isdisabled: false
        };
    },
    computed: {},
    watch: {
        'form.factory'(n) {
            this.Getdeptbyid(n);
        }
    },
    mounted() {
        this.Getdeptcode();
        this.getLocationList();
        // this.$http(`${BASICDATA_API.FINDORG_API}?code=workshop`, 'POST').then(({data}) => {
        //   if (data.code === 0) {
        //     this.workshop = data.typeList
        //   } else {
        //     this.$notify.error({title: '错误', message: data.msg})
        //   }
        // })
        this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {
            type: 'material_type'
        }).then(({ data }) => {
            if (data.code === 0) {
                this.sapList = data.dicList;
            } else {
                this.$errorToast(data.msg);
            }
        });
        // this.$http(`${BASICDATA_API.SERCHSAPLIST_API}`, 'POST', {params: ''}).then(({data}) => {
        //   if (data.code === 0) {
        //     this.SerchSapList = data.allList
        //   } else {
        //     this.$notify.error({title: '错误', message: data.msg})
        //   }
        // })
    },
    methods: {
        // 获取工厂
        Getdeptcode() {
            this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST', false, false, false).then(({ data }) => {
                if (data.code === 0) {
                    this.factory = data.typeList;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 获取车间
        Getdeptbyid(id) {
            this.form.deptId = '';
            if (id) {
                this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', { deptId: id }, false, false, false).then(({ data }) => {
                    if (data.code === 0) {
                        this.workshop = data.typeList;
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            } else {
                this.workshop = [];
            }
        },
        // 序号
        indexMethod(index) {
            return index + 1 + (Number(this.currPage) - 1) * (Number(this.pageSize));
        },
        // 获取库位列表
        getLocationList(st) {
            // 清空资料
            if (st) {
                this.currPage = 1;
            }
            this.$http(`${BASICDATA_API.LOCATIONLIST_API}`, 'POST', {
                factory: this.form.factory,
                // factoryName: this.list.find(element => this.factoryId === element.factory).factoryName,
                deptId: this.form.deptId,
                // deptName: this.list.find(element => this.deptId === element.deptId).deptName,
                deptName: this.form.deptName,
                materialTypeCode: this.form.materialTypeCode,
                storageLocation: this.form.storageLocation,
                currPage: this.currPage,
                pageSize: this.pageSize
            }).then(({ data }) => {
                this.visible = false;
                this.visibleHightLevelQuery = false;
                if (data.code === 0) {
                    this.list = [];
                    this.multipleSelection = [];
                    this.list = data.page.list;
                    this.currPage = data.page.currPage;
                    this.pageSize = data.page.pageSize;
                    this.totalCount = data.page.totalCount;
                } else {
                    this.$errorToast(data.msg);
                }
                this.visible = false;
            });
        },
        // 批量删除
        remove() {
            this.$confirm('确认删除库位, 是否继续?', '删除库位', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http(`${BASICDATA_API.LOCATIONDEL_API}`, 'POST', this.multipleSelection).then(({ data }) => {
                    if (data.code === 0) {
                        this.$successToast('删除成功!');
                        this.multipleSelection = [];
                        this.getLocationList();
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            }).catch(() => {
                // this.$infoToast('已取消删除');
            });
        },
        // 新增库位
        addLocation() {
            this.visible = true;
            this.$nextTick(() => {
                this.$refs.locationAdd.init();
            });
        },
        // 修改库位
        EditRow(row) {
            this.visible = true;
            this.$nextTick(() => {
                this.$refs.locationAdd.EditRowInfo(row);
            });
        },
        // 表格选中
        handleSelectionChange(val) {
            this.multipleSelection = [];
            val.forEach((item) => {
                this.multipleSelection.push(item.id);
            });
        },
        // 改变每页条数
        handleSizeChange(val) {
            this.pageSize = val;
            this.getLocationList();
        },
        // 跳转页数
        handleCurrentChange(val) {
            this.currPage = val;
            this.getLocationList();
        }
    }
};
</script>

<style scoped></style>
