<template>
    <div>
        <div class="main">
            <el-card>
                <el-row>
                    <el-button v-if="isAuth('sys:menu:save')" type="primary" style="margin-bottom: 22px;" size="small" @click="addOrUpdateHandle()">
                        新增
                    </el-button>
                </el-row>
                <el-row>
                    <el-table headerRowClassName="tableHead" :data="dataList" border tooltipEffect="dark" style="width: 100%;">
                        <el-table-column prop="id" headerAlign="left" align="left" width="80" label="ID" />
                        <table-tree-column prop="menuName" headerAlign="left" width="150" :showOverflowTooltip="true" label="名称" />
                        <el-table-column prop="parentName" headerAlign="left" align="left" width="100" :showOverflowTooltip="true" label="上级菜单" />
                        <el-table-column headerAlign="left" align="left" :showOverflowTooltip="true" label="图标">
                            <template slot-scope="scope">
                                <i class="iconfont" :class="scope.row.menuIcon" />
                            </template>
                        </el-table-column>
                        <el-table-column prop="type" headerAlign="left" align="left" :showOverflowTooltip="true" label="类型">
                            <template slot-scope="scope">
                                <el-tag v-if="scope.row.menuType === 'C'" size="small">
                                    目录
                                </el-tag>
                                <el-tag v-else-if="scope.row.menuType === 'M'" size="small" type="success">
                                    菜单
                                </el-tag>
                                <el-tag v-else-if="scope.row.menuType === 'B'" size="small" type="info">
                                    按钮
                                </el-tag>
                                <el-tag v-else-if="scope.row.menuType === 'P'" size="small" type="success">
                                    三级页面
                                </el-tag>
                                <el-tag v-else-if="scope.row.menuType === 'D'" size="small" type="success">
                                    看板
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="menuOrder" headerAlign="left" align="left" width="80" :showOverflowTooltip="true" label="排序号" />
                        <el-table-column prop="menuUrl" headerAlign="left" align="left" width="180" :showOverflowTooltip="true" label="菜单URL" />
                        <el-table-column prop="permission" headerAlign="left" align="left" width="180" :showOverflowTooltip="true" label="授权标识" />
                        <el-table-column fixed="right" headerAlign="left" align="left" width="88" label="操作">
                            <template slot-scope="scope">
                                <el-button v-if="isAuth('sys:menu:update')" style="padding: 0;" type="text" size="small" @click="addOrUpdateHandle(scope.row.menuId)">
                                    修改
                                </el-button>
                                <el-button v-if="isAuth('sys:menu:delete')" style="padding: 0;" type="text" size="small" @click="deleteHandle(scope.row.menuId)">
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-row>
            </el-card>
        </div>
        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" />
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { treeDataTranslate } from 'utils/utils';
import AddOrUpdate from './MenuAdd.vue';
import { COMMON_API } from 'common/api/api';

@Component({
    components: {
        AddOrUpdate
    }
})
export default class Menu extends Vue {
    $refs: {addOrUpdate: HTMLFormElement}
    addOrUpdateVisible = false
    dataList: object[] = []

    mounted() {
        this.getDataList();
    }

    // 获取数据列表
    getDataList() {
        COMMON_API.MENULIST_API({
            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id
        }).then(({ data }) => {
            this.dataList = treeDataTranslate(data.data);
            this.addOrUpdateVisible = false;
        });
    }

    // 新增 / 修改
    addOrUpdateHandle(id) {
        this.addOrUpdateVisible = true;
        this.$nextTick(() => {
            this.$refs.addOrUpdate.init(id);
        });
    }

    // 删除
    deleteHandle(id) {
        this.$confirm(`确定对[id=${id}]进行[删除]操作?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
            .then(() => {
                COMMON_API.MENUDEL_API({
                    id
                }).then(({ data }) => {
                    if (data && data.code === 200) {
                        this.$successToast('操作成功');
                        this.getDataList();
                    } else {
                        this.$warningToast(data.msg);
                    }
                });
            })
            .catch(() => {
                //    catch
            });
    }
}
</script>

<style scoped>

</style>
