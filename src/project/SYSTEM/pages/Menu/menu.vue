<template>
    <div class="header_main">
        <mds-card title="菜单列表" :name="'menu'" :pack-up="false" style="background: white;">
            <template slot="titleBtn">
                <el-button type="primary" style="float: right; margin-bottom: 12px;" size="small" @click="addOrUpdateHandle()">
                    新增
                </el-button>
            </template>
            <el-table class="newTable" header-row-class-name="tableHead" :data="dataList" border tooltip-effect="dark" style="width: 100%;">
                <table-tree-column prop="menuName" header-align="left" width="150" :show-overflow-tooltip="true" label="名称" />
                <el-table-column prop="parentName" header-align="left" align="left" width="100" :show-overflow-tooltip="true" label="上级菜单" />
                <el-table-column header-align="left" align="left" :show-overflow-tooltip="true" label="图标">
                    <template slot-scope="scope">
                        <i class="iconfont" :class="scope.row.menuIcon" />
                    </template>
                </el-table-column>
                <el-table-column prop="type" header-align="left" align="left" :show-overflow-tooltip="true" label="类型">
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
                <el-table-column prop="menuOrder" header-align="left" align="left" width="80" :show-overflow-tooltip="true" label="排序号" />
                <el-table-column prop="menuUrl" header-align="left" align="left" width="180" :show-overflow-tooltip="true" label="菜单URL" />
                <el-table-column prop="permission" header-align="left" align="left" width="180" :show-overflow-tooltip="true" label="授权标识" />
                <el-table-column fixed="right" header-align="left" align="left" width="88" label="操作">
                    <template slot-scope="scope">
                        <!--<el-button v-if="isAuth('sys:menu:update')" style="padding: 0;" type="text" size="small" @click="addOrUpdateHandle(scope.row.menuId)">-->
                        <el-button style="padding: 0;" type="text" size="small" @click="addOrUpdateHandle(scope.row)">
                            修改
                        </el-button>
                        <!--<el-button v-if="isAuth('sys:menu:delete')" style="padding: 0;" type="text" size="small" @click="deleteHandle(scope.row.menuId)">-->
                        <el-button style="padding: 0;" type="text" size="small" @click="deleteHandle(scope.row.id)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </mds-card>
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
            factory: 'common'
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
        }).then(() => {
            COMMON_API.MENUDEL_API({
                id
            }).then(({ data }) => {
                if (data && data.code === 200) {
                    this.$successToast('操作成功');
                    this.getDataList();
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
