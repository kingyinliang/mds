<template>
    <div>
        <org-view
            :title="'产能管理'"
            :right-tile="'产能信息'"
            :type="'table'"
            @treeNodeClick="getData"
        >
            <template slot="view" style="padding-top: 16px;">
                <div class="view-btn">
                    <el-input v-model="materialCode" size="small" placeholder="物料" suffix-icon="el-icon-search" style="width: 180px; margin-right: 16px;" />
                    <el-button type="primary" size="small" @click="GetList(false, true)">
                        查询
                    </el-button>
                    <el-button type="primary" size="small" @click="addOrupdate()">
                        增加
                    </el-button>
                    <el-button type="danger" size="small" @click="remove()">
                        批量删除
                    </el-button>
                </div>
                <el-table ref="table1" :data="CapacityList" header-row-class-name="tableHead" border tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="35" fixed="left" />
                    <el-table-column type="index" label="序号" :index="indexMethod" width="55" />
                    <el-table-column prop="workNum" :show-overflow-tooltip="true" label="物料">
                        <template slot-scope="scope">
                            {{ scope.row.materialCode + ' ' + scope.row.materialName }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="basicCapacity" label="标准产能" :show-overflow-tooltip="true" width="87" />
                    <el-table-column prop="designCapacity" label="设计产能" :show-overflow-tooltip="true" width="87" />
                    <el-table-column prop="effecCapacity" label="有效产能" :show-overflow-tooltip="true" width="87" />
                    <el-table-column prop="basicCapacityUnitName" label="单位" width="50" :show-overflow-tooltip="true" />
                    <el-table-column prop="standardOfMan" label="标配人力" width="80" :show-overflow-tooltip="true" />
                    <el-table-column prop="effecStartDate" label="有效开始日期" width="110" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            {{ scope.row.effecStartDate }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="effecEndDate" label="有效结束日期" width="110" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            {{ scope.row.effecEndDate }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="changer" label="操作人" width="87" :show-overflow-tooltip="true" />
                    <el-table-column prop="changed" label="操作时间" width="120" :show-overflow-tooltip="true" />
                    <el-table-column label="操作" width="50" fixed="right">
                        <template slot-scope="scope">
                            <el-button v-if="isAuth('sys:capacity:saveOrUpdateCapa')" style="padding: 0;" type="text" @click="addOrupdate(scope.row)">
                                编辑
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-row>
                    <el-pagination :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                </el-row>
            </template>
        </org-view>
        <capacity-add-or-update v-if="visible" ref="capaaddupdate" :serch-sap-list="SerchSapList" @refreshDataList="getData" />
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API } from 'common/api/api';
    import CapacityAddOrUpdate from './CapacityAddOrUpdate';

    @Component({
        components: {
            CapacityAddOrUpdate
        }
    })
    export default class CapacityManage extends Vue {
        $refs: {
            capaaddupdate: HTMLFormElement;
        };

        deptId = ''
        materialCode = ''
        totalCount = 1
        currPage = 1
        pageSize = 10
        visible = false
        CapacityList: object[] = []
        SerchSapList: object[] = []
        multipleSelection: string[] = []

        getData(row = false, first = false) {
            if (row) {
                this.deptId = row['id'];
            }
            if (first) {
                this.currPage = 1;
            }
            COMMON_API.CAPACITYLIST_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                deptId: this.deptId,
                materialCode: this.materialCode,
                size: this.pageSize,
                current: this.currPage
            }).then(({ data }) => {
                if (data.code === 200) {
                    this.multipleSelection = [];
                    this.CapacityList = data.data.records;
                    this.currPage = data.data.current;
                    this.pageSize = data.data.size;
                    this.totalCount = data.data.total;
                }
            })
        }

        // 表格选中
        handleSelectionChange(val) {
            this.multipleSelection = [];
            val.forEach((item) => {
                this.multipleSelection.push(item.id);
            });
        }

        // 新增  修改
        addOrupdate(data) {
            if (this.deptId) {
                this.visible = true;
                this.$nextTick(() => {
                    this.$refs.capaaddupdate.init(this.deptId, data);
                });
            } else {
                this.$warningToast('请先选择部门');
            }
        }

        // 删除
        remove() {
            if (this.multipleSelection.length === 0) {
                this.$warningToast('请选择要删除的产能');
            } else {
                this.$confirm('确认删除该物料产能, 是否继续?', '删除产能', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        COMMON_API.CAPACITYDEL_API(this.multipleSelection).then(({ data }) => {
                            if (data.code === 0) {
                                this.$successToast('删除成功!');
                                this.multipleSelection = [];
                                this.getData();
                            } else {
                                this.$errorToast(data.msg);
                            }
                        });
                    })
                    .catch();
            }
        }

        // 序号
        indexMethod(index) {
            return index + 1 + (Number(this.currPage) - 1) * (Number(this.pageSize));
        }

        // 改变每页条数
        handleSizeChange(val) {
            this.pageSize = val;
            this.getData();
        }

        // 跳转页数
        handleCurrentChange(val) {
            this.currPage = val;
            this.getData();
        }
    }
</script>

<style lang="scss" scoped>
.view-btn {
    float: right;
    margin-bottom: 10px;
}
</style>
