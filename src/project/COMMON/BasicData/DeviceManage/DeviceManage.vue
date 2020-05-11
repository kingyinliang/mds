<template>
    <div>
        <org-view
            :title="'设备管理'"
            :right-tile="'设备信息'"
            :type="'table'"
            @treeNodeClick="getData"
        >
            <template slot="view" style="padding-top: 16px;">
                <div class="view-btn">
                    <el-input v-model="deviceNo" size="small" placeholder="设备号" suffix-icon="el-icon-search" style="width: 180px; margin-right: 16px;" />
                    <el-button type="primary" size="small" @click="getData(false, true)">
                        查询
                    </el-button>
                    <el-button type="primary" size="small" @click="addOrupdate()">
                        增加
                    </el-button>
                    <el-button type="danger" size="small" @click="remove()">
                        批量删除
                    </el-button>
                </div>
                <el-table ref="table1" class="newTable" border header-row-class-name="tableHead" :data="deviceList" tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="50" />
                    <el-table-column type="index" :index="indexMethod" label="序号" width="55" />
                    <el-table-column prop="deviceNo" width="120" :show-overflow-tooltip="true" label="设备编号" />
                    <el-table-column prop="deviceName" label="设备描述" :show-overflow-tooltip="true" />
                    <el-table-column fixed="right" label="操作" width="65">
                        <template slot-scope="scope">
                            <el-button type="text" @click="addOrupdate(scope.row)">
                                编辑
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </org-view>
        <add-orupdate v-if="visible" ref="addOrupdate" @refreshDataList="getData()" />
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API } from 'common/api/api';
    import AddOrupdate from './DeviceAddorUpdate.vue';

    @Component({
        components: {
            AddOrupdate
        }
    })
    export default class CapacityManage extends Vue {
        $refs: {
            addOrupdate: HTMLFormElement;
        };

        deptId = ''
        deviceNo = ''
        totalCount = 0
        currPage = 1
        pageSize = 10
        visible = false
        deviceList: object[] = []
        multipleSelection: string[] = []

        getData(row = false, first = false) {
            if (row) {
                this.deptId = row['id'];
            }
            if (first) {
                this.currPage = 1;
            }
            COMMON_API.DEVICELIST_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                deptId: this.deptId,
                deviceNo: this.deviceNo,
                size: this.pageSize,
                current: this.currPage
            }).then(({ data }) => {
                if (data.code === 200) {
                    this.multipleSelection = [];
                    this.deviceList = data.data.records;
                    this.currPage = data.data.current;
                    this.pageSize = data.data.size;
                    this.totalCount = data.data.total;
                }
            })
        }

        // 添加和编辑
        addOrupdate(data) {
            if (this.deptId) {
                this.visible = true;
                this.$nextTick(() => {
                    this.$refs.addOrupdate.init(this.deptId, data);
                });
            } else {
                this.$warningToast('请先选择部门');
            }
        }

        // 删除
        remove() {
            if (this.multipleSelection.length === 0) {
                this.$warningToast('请选择要删除的设备');
            } else {
                this.$confirm('确认删除设备, 是否继续?', '删除设备', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        COMMON_API.DEVICEDEL_API({
                            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                            ids: this.multipleSelection
                        }).then(({ data }) => {
                            if (data.code === 200) {
                                this.$successToast('删除成功!');
                                this.multipleSelection = [];
                                this.getData();
                            }
                        });
                    })
            }
        }

        // 表格选中
        handleSelectionChange(val) {
            this.multipleSelection = [];
            val.forEach((item) => {
                this.multipleSelection.push(item.id);
            });
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
