<template>
    <div style="width: 100%;">
        <div v-for="(item, idx) in views" :key="idx">
            <div v-if="!item.hiddenFlag">
                <div class="table_row" :style="{ lineHeight: lineHeight + 'px' }">
                    <div class="table_td first_td" :style="{ lineHeight: lineHeight + 'px' }">
                        <div :style="{ lineHeight: lineHeight + 'px', width: 10 + 'px' }" />
                        <div v-for="(flag, index) in item.lastFlagArray" :key="index" class="fold_button" :style="{ width: lineHeight + 'px' }" style="position: relative;">
                            <div v-if="!flag" class="fold_button_line_up" :style="{ height: lineHeight / 2 + 'px', left: lineHeight / 2 - 1 + 'px' }" />
                            <div v-if="!flag" class="fold_button_line_down" :style="{ top: lineHeight / 2 + 'px', height: lineHeight / 2 + 'px', left: lineHeight / 2 - 1 + 'px' }" />
                        </div>

                        <div class="fold_button" :style="{ width: lineHeight + 'px', position: 'relative' }" @click="toggle(item)">
                            <div class="fold_button_line_up" :style="{ height: lineHeight / 2 + 'px', left: lineHeight / 2 - 1 + 'px' }" />
                            <div v-if="(item.sign) || (!item.lastFlag && item.hasNextFlag)|| item.fix" class="fold_button_line_down" :style="{ top: lineHeight / 2 + 'px', height: lineHeight / 2 + 'px', left: lineHeight / 2 - 1 + 'px' }" />
                            <div class="fold_button_line_right" :style="{ top: lineHeight / 2 - 1 + 'px', width: tabSpace / 2 + 'px', left: lineHeight / 2 + 'px' }" />
                            <div v-if="item.hasChildren && !item.unfoldFlag" class="fold_button_arrow_right" :style="{ left: lineHeight / 2 - 1 + 'px', top: lineHeight / 2 - 8 + 'px' }" />
                            <div v-if="!item.sign&&item.hasChildren && item.unfoldFlag" class="fold_button_arrow_down" :style="{ left: lineHeight / 2 - 7 + 'px', top: lineHeight / 2 - 1 + 'px' }" />
                        </div>

                        <div v-if="!item.sign" class="fold_button" :style="{ width: lineHeight + 'px' }" style="position: relative;">
                            <div v-if="item.hasChildren && item.unfoldFlag && item.allChildrenShowFlag" class="fold_button_line_down" :style="{ top: lineHeight / 2 + 'px', height: lineHeight / 2 + 'px', left: lineHeight / 2 - 1 + 'px' }" />
                            <div class="fold_button_line_right" :style="{ top: lineHeight / 2 - 1 + 'px', width: tabSpace / 2 + 'px', left: lineHeight / 2 + 'px' }" />
                            <div class="fold_button_line_left" :style="{ top: lineHeight / 2 - 1 + 'px', width: tabSpace / 2 + 'px' }" />
                            <div class="fold_level" :style="{ top: '8px', left: tabSpace * 0.5 - 11 + 'px' }">
                                <span class="one_line">{{ item.level }}</span>
                            </div>
                        </div>
                        <span>{{ item.materialName }}</span>
                        <div class="hide_btn" @click="hideItem(item)" />
                    </div>
                    <div class="table_td" :style="{ lineHeight: lineHeight + 'px' }">
                        <el-tooltip class="item" effect="dark" :content="item.batch" placement="top" :disabled="!item.batch">
                            <span class="one_line" :style="{width: '100px',color: '#487bff',cursor: !item.batch? 'default':'pointer'}" @click="batchClickHandler(item)">{{ item.batch }}</span>
                        </el-tooltip>
                    </div>
                    <div class="table_td" :style="{ lineHeight: lineHeight + 'px' }">
                        <el-tooltip class="item" effect="dark" :content="item.entryQnt" placement="top" :disabled="!item.ntryQnt">
                            <span class="one_line" style="width: 100px;">{{ item.entryQnt }}</span>
                        </el-tooltip>
                    </div>
                    <div class="table_td" :style="{ lineHeight: lineHeight + 'px' }">
                        <el-tooltip class="item" effect="dark" :content="item.entryUom" placement="top" :disabled="!item.entryUom">
                            <span class="one_line" style="width: 100px;">{{ item.entryUom }}</span>
                        </el-tooltip>
                    </div>
                    <div class="table_td" :style="{ lineHeight: lineHeight + 'px' }">
                        <el-tooltip class="item" effect="dark" :content="item.changePotDate" placement="top" :disabled="!item.changePotDate">
                            <span class="one_line" style="width: 100px;">{{ item.changePotDate }}</span>
                        </el-tooltip>
                    </div>
                </div>
                <tree-menu-row v-if="item.unfoldFlag" :views="item.views" />
            </div>

            <div v-if="item.hiddenFlag" style=" width: 100%; height: 8px; margin: 0 0;">
                <div class="table_row table_row_hide" :style="{ lineHeight: '8px' }">
                    <div class="table_td first_td" :style="{ lineHeight: '8px' }">
                        <div :style="{ lineHeight: '8px', width: 25 + 'px' }">
                            <div class="show_btn" @click="showItem(item)" />
                        </div>
                        <div v-for="(flag, index) in item.lastFlagArray" :key="index" class="fold_button" :style="{ width: lineHeight + 'px' }" style="position: relative;">
                            <div v-if="!flag" class="fold_button_line_up" :style="{ height: '9px', left: lineHeight / 2 - 16 + 'px' }" />
                            <div v-if="!flag" class="fold_button_line_down" :style="{ top: '9px', height: lineHeight / 2 + 'px', left: lineHeight / 2 - 16 + 'px' }" />
                        </div>
                        <div v-if="item.hasNextFlag" class="fold_button" :style="{ width: lineHeight + 'px' }" style="position: relative;">
                            <div class="fold_button_line_up" :style="{ height: '10px', left: lineHeight / 2 - 16 + 'px' }" />
                            <div class="fold_button_line_down" :style="{ top: '10px', height: '10px', left: lineHeight / 2 - 16 + 'px' }" />
                        </div>
                        <div class="fold_button" :style="{ width: lineHeight + 'px' }" style="position: relative;" />
                    </div>
                    <div class="table_td" :style="{ lineHeight: 8 + 'px' }" />
                    <div class="table_td" :style="{ lineHeight: 8 + 'px' }" />
                    <div class="table_td" :style="{ lineHeight: 8 + 'px' }" />
                    <div class="table_td" :style="{ lineHeight: 8 + 'px' }" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'TreeMenuRow',
    props: {
        views: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            lineHeight: 36,
            tabSpace: 41
        };
    },
    methods: {
        toggle(_item) {
            _item.unfoldFlag = !_item.unfoldFlag;
        },
        hideItem(_item) {
            _item.hiddenFlag = true;
            // this.reloadItem();
        },
        showItem(_item) {
            _item.hiddenFlag = false;
            // this.reloadItem();
        },
        reloadItem() {
            if (this.views[0].level === 1) {
                this.reloadHasNextFlag(this.views, [])
                return
            }
            this.$parent.reloadItem();
        },
        batchClickHandler(row) {
            if (this.views[0].level === 1) {
                this.$parent.$parent.$parent.batchInit(row)
                return
            }
            this.$parent.batchClickHandler(row)
        },
        reloadHasNextFlag(list, lastFlagArray) {
            list.map((item, index) => {
                item.lastFlagArray = lastFlagArray
                let hasNextFlag = false
                for (let i = index + 1; i < list.length; i++) {
                    if (!list[i].hiddenFlag) {
                        hasNextFlag = true
                        break
                    }
                }
                item.hasNextFlag = hasNextFlag
                const nextLastFlagArray = [];
                lastFlagArray.map(flag => {
                    nextLastFlagArray.push(flag)
                })
                nextLastFlagArray.push(item.lastFlag || !hasNextFlag)

                //递归
                if (item.hasChildren) {
                    this.reloadHasNextFlag(item.views, nextLastFlagArray)
                    let allChildrenShowFlag = false
                    item.views.map(child => {
                        if (!child.hiddenFlag) {
                            allChildrenShowFlag = true
                        }
                    })
                    item.allChildrenShowFlag = allChildrenShowFlag
                }
            })
        }
    }
};
</script>
<style>
*,
div {
    margin: 0;
    padding: 0;
    font-size: 14px;
}

.table_row {
    display: flex;
    flex: 1;
    justify-content: flex-start;
    min-width: 1090px;
}

.first_td {
    flex: 1;
}

.table_td {
    display: inline-flex;
    justify-content: flex-start;
    width: 100px;
    margin: 0 -1px -1px 0;
    color: #606270;
    border: 1px solid #e0e0e0;
}

.table_td div {
    display: inline-flex;
}
.table_td span {
    margin-left: 8px;
}

div.table_row_hide div.table_td {
    height: 8px;
    border-width: 0 1px;
}

div.fold_button_line_up {
    position: absolute;
    top: 0;
    width: 1px;
    background-color: #487bff;
}

div.fold_button_line_down {
    position: absolute;
    width: 1px;
    background-color: #487bff;
}

div.fold_button_line_right {
    position: absolute;
    height: 1px;
    background-color: #487bff;
}

div.fold_button_line_left {
    position: absolute;
    left: 0;
    height: 1px;
    background-color: #487bff;
}

div.fold_button_arrow_right {
    position: absolute;
    width: 0;
    height: 0;
    border-top: 7px solid transparent;
    border-bottom: 7px solid transparent;
    border-left: 7px solid #487bff;
}

div.fold_button_arrow_down {
    position: absolute;
    width: 0;
    height: 0;
    border-top: 7px solid #487bff;
    border-right: 7px solid transparent;
    border-left: 7px solid transparent;
}

div.fold_level {
    position: absolute;
    width: 16px;
    height: 16px;
    padding-left: 2px;
    color: #487bff;
    font-size: 12px;
    line-height: 12px;
    text-align: center;
    background-color: white;
    border: 2px solid #487bff;
    border-radius: 9px;
}

div.hide_btn {
    display: none;
    width: 20px;
    height: 20px;
    margin: 8px;
    background-image: url("data:image/png;base64,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");
    background-size: cover;
    cursor: pointer;
}

div.show_btn {
    width: 8px;
    height: 8px;
    margin-left: -15px;
    background-image: url("data:image/png;base64,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");
    background-size: cover;
    cursor: pointer;
}

div.table_td:hover div.hide_btn {
    display: inline-block;
}
.custom_td {
    color: #409eff;
    cursor: pointer;
}
.one_line {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>
