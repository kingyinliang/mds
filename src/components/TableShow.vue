<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2020-09-02 10:21:15
 * @LastEditors: Telliex
 * @LastEditTime: 2020-09-03 18:06:01
-->
<template>
    <el-table ref="targetTable" class="newTable" border header-row-class-name="tableHead" :data="targetTable" :height="tableElementSetting.props.height" tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange">
        <el-table-column v-if="targetTable.length!==0" type="selection" width="50" fixed />
        <el-table-column type="index" label="序号" :index="indexMethod" width="55" align="center" fixed />
        <template v-for="(tableElement,index) in tableElementSetting.data">
            <el-table-column v-if="tableElement.type==='multiple'" :key="'targetTable'+tableElement.prop+index" :prop="tableElement.prop" :label="tableElement.label" :show-overflow-tooltip="true" :min-width="tableElement.minWidth" :width="tableElement.width">
                <template slot-scope="scope">
                    <span v-for="val in tableElement.content" :key="'targetTable'+val">{{ scope.row[tableElement.prop] }}</span>
                </template>
            </el-table-column>
            <el-table-column v-else-if="tableElement.type==='single'" :key="'targetTable'+tableElement.prop+index" :prop="tableElement.prop" :label="tableElement.label" :min-width="tableElement.minWidth" :width="tableElement.width" :show-overflow-tooltip="true" />
            <el-table-column v-else-if="tableElement.type==='button'" :key="'targetTable'+tableElement.prop+index" :min-width="tableElement.minWidth" :width="tableElement.width" :label="tableElement.label" fixed="right">
                <template slot-scope="scope">
                    <el-button v-for="(val,valIndex) in tableElement.content" :key="'targetTable'+val.buttonName+valIndex" :class="val.btn" :icon="val.icon" style="padding: 0;" type="text" @click="btnUpdateItem(scope.row)">
                        <span v-if="isAuth(val.isAuth)">{{ val.buttonName }}</span>
                    </el-button>
                </template>
            </el-table-column>
        </template>
    </el-table>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
    // import { dateFormat, getUserNameNumber } from 'utils/utils';
    @Component({
        name: 'TableShow',
        components: {
        }
    })
    export default class DialogSearch extends Vue {
        @Prop({ type: Array, default: () => { return [] } }) targetTable // 数据
        @Prop({ type: Object, default: () => { return {} } }) tableElementSetting // 表单元素设置

        $refs: {
            targetTable: HTMLFormElement;
        }

        multipleSelection= []
        isCurrentDailogShow= false

        currPage= 1
        pageSize= 10

        created() {
            // this.setting()
        }

        init() {
            this.isCurrentDailogShow = true;
            // 基础设置
            this.setting()

        }

        setting() {
            //
        }

        // 表格选中
        handleSelectionChange(val) {
            this.multipleSelection = val;
            // val.forEach((item) => {
            //     this.multipleSelection.push(item.id);
            // });
        }

        // 序号
        indexMethod(index) {
            return index + 1 + (Number(this.currPage) - 1) * Number(this.pageSize);
        }

        setPageInfo(currPage, pageSize) {
            this.currPage = currPage
            this.pageSize = pageSize
        }

        // 获取勾选项
        getMultipleSelection() {
            return this.multipleSelection
        }
    }

</script>

<style scoped></style>
