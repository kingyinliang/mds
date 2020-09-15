<!--
 * @Description: 基础通用型表格呈现数据（不带 form）
 * @Anthor: Telliex
 * @Date: 2020-09-02 10:21:15
 * @LastEditors: Telliex
 * @LastEditTime: 2020-09-15 14:25:26
-->
<template lang="pug">
    el-table(ref="targetTable" class="newTable" border header-row-class-name="tableHead" :data="targetTable" :height="tableElementSetting.props.height" tooltip-effect="dark" @selection-change="handleSelectionChange" style="width:100%")
        el-table-column(v-if="targetTable.length!==0" type="selection" width="50" fixed)
        el-table-column(type="index" label="序号" :index="indexMethod" width="55" align="center" fixed)
        template(v-for="(tableElement,index) in tableElementSetting.data")
            el-table-column(v-if="tableElement.type==='multiple'" :key="'targetTable'+tableElement.prop+index" :prop="tableElement.prop" :label="tableElement.label" :show-overflow-tooltip="true" :min-width="tableElement.minWidth" :width="tableElement.minWidth===0?tableElement.width:null" :align="tableElement.align || 'left'" :header-align="tableElement.headerAlign || 'left'")
                template(slot-scope="scope")
                    span(v-for="val in tableElement.content" :key="'targetTable'+val" style="padding-right:5px") {{ scope.row[val] }}
            el-table-column(v-else-if="tableElement.type==='single'&&tableElement.wrapper" :key="'targetTable'+tableElement.prop+index" :prop="tableElement.prop" :label="tableElement.label" :min-width="tableElement.minWidth" :width="tableElement.minWidth===0?tableElement.width:null" :show-overflow-tooltip="true" :align="tableElement.align || 'left'" :header-align="tableElement.headerAlign || 'left'")
                template(slot-scope="scope") {{ tableElement.wrapper[scope.row[tableElement.prop]] }}
            el-table-column(v-else-if="tableElement.type==='single'" :key="'targetTable'+tableElement.prop+index" :prop="tableElement.prop" :label="tableElement.label" :min-width="tableElement.minWidth" :width="tableElement.minWidth===0?tableElement.width:null" :show-overflow-tooltip="true" :align="tableElement.align || 'left'" :header-align="tableElement.headerAlign || 'left'")
                template(slot-scope="scope") {{ scope.row[tableElement.prop] }}
            el-table-column(v-else-if="tableElement.type==='button'" :key="'targetTable'+tableElement.prop+index"  :width="tableElement.minWidth===0?tableElement.width:null" :label="tableElement.label" fixed="right")
                template(slot-scope="scope")
                    el-button(v-for="(val,valIndex) in tableElement.control" :key="'targetTable'+val.buttonName+valIndex" :class="val.btn" :icon="val.icon" style="padding: 0;" type="text" @click="btnControlItem(scope.row,val.btn)")
                        span(v-if="isAuth(val.isAuth)") {{ val.buttonName }}
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
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

        multipleSelection: DelIdList[]= []
        currPage= 1
        pageSize= 10

        created() {
            //
        }

        mounted() {
            //
        }

        init() {
            this.setting()
        }

        // 表格选中
        handleSelectionChange(val) {
            this.multipleSelection = val;
        }

        // 序号
        indexMethod(index) {
            return index + 1 + (Number(this.currPage) - 1) * Number(this.pageSize);
        }

        // 设置页码
        setPageInfo(currPage, pageSize) {
            this.currPage = currPage
            this.pageSize = pageSize
        }

        // 获取勾选项
        getMultipleSelection() {
            const tempMultipleSelection: string[] = []
            this.multipleSelection.forEach((item) => {
                tempMultipleSelection.push(item.id);
            });
            return tempMultipleSelection
        }

        // 初始化设置
        setting() {
            this.tableElementSetting.data.forEach(item => {
                if (item.transList) {
                        this.$nextTick(() =>
                            this.$set(item, 'wrapper', item.transList)
                        )

                } else if (item.transFn) {
                    item.transFn().then((res) => {
                        this.$set(item, 'wrapper', res);
                    });
                }
            })
        }

        //  表单按钮操作
        btnControlItem(val, who) {
            if (who === 'editBtn') { // 编辑
                this.$emit('updateItem', val)
            } else if (who === 'removeBtn') { // 移除
                this.$emit('removeItem', val)
            }
        }
    }

    interface DelIdList {
        id: string;
    }
</script>
<style lang="sass" scoped></style>
