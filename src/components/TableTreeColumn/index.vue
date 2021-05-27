<template>
    <el-table-column :prop="prop" v-bind="$attrs" :class-name="!isDefault ? 'noPadding' : ''">
        <template slot-scope="scope">
            <div v-if="!isDefault" @click.prevent="toggleHandle(scope.$index, scope.row)">
                <em v-for="item in (scope.row[levelKey] - 1)" :key="item" class="tree-column__em" />
                <em :class="iconClasses(scope.row)" :style="iconStyles(scope.row)" />
                <span style="display: inline-block;">
                    <em class="tree-column__separate" />
                    - {{ scope.row[levelKey] }} - {{ scope.row[prop] }}
                </span>
            </div>
            <span v-else :style="childStyles(scope.row)" @click.prevent="toggleHandle(scope.$index, scope.row)">
                <em :class="iconClasses(scope.row)" :style="iconStyles(scope.row)" />
                {{ scope.row[prop] }}
            </span>
        </template>
    </el-table-column>
</template>

<script>
import isArray from 'lodash/isArray';
export default {
    name: 'TableTreeColumn',
    props: {
        prop: {
            type: String,
            default: ''
        },
        treeKey: {
            type: String,
            default: 'id'
        },
        parentKey: {
            type: String,
            default: 'parentId'
        },
        levelKey: {
            type: String,
            default: '_level'
        },
        childKey: {
            type: String,
            default: 'children'
        },
        isDefault: {
            type: Boolean,
            default: true
        }
    },
    /* eslint-disable no-underscore-dangle*/
    methods: {
        childStyles(row) {
            return {
                'padding-left': (row[this.levelKey] > 1 ? row[this.levelKey] * 7 : 0) + 'px'
            };
        },
        iconClasses(row) {
            return [!row._expanded ? 'el-icon-caret-right' : 'el-icon-caret-bottom'];
        },
        iconStyles(row) {
            return { visibility: this.hasChild(row) ? 'visible' : 'hidden' };
        },
        hasChild(row) {
            return (isArray(row[this.childKey]) && row[this.childKey].length >= 1) || false;
        },
        // 切换处理
        toggleHandle(index, row) {
            if (this.hasChild(row)) {
                let data = this.$parent.store.states.data.slice(0);
                data[index]._expanded = !data[index]._expanded;
                if (data[index]._expanded) {
                    data = data
                        .splice(0, index + 1)
                        .concat(row[this.childKey])
                        .concat(data);
                } else {
                    data = this.removeChildNode(data, row[this.treeKey]);
                }
                this.$parent.store.commit('setData', data);
                this.$nextTick(() => {
                    this.$parent.doLayout();
                });
            }
        },
        /* eslint-ensable no-underscore-dangle*/
        // 移除子节点
        removeChildNode(data, parentId) {
            const parentIds = isArray(parentId) ? parentId : [parentId];
            if (parentId.length <= 0) {
                return data;
            }
            const ids = [];
            for (let i = 0; i < data.length; i++) {
                if (parentIds.indexOf(data[i][this.parentKey]) !== -1 && parentIds.indexOf(data[i][this.treeKey]) === -1) {
                    ids.push(data.splice(i, 1)[0][this.treeKey]);
                    i--;
                }
            }
            return this.removeChildNode(data, ids);
        }
    }
};
</script>

<style lang="scss">
.el-table td.noPadding {
    padding: 0 !important;
    border-bottom: 0;
    .cell {
        line-height: 36px;
    }
    .tree-column__em {
        float: left;
        width: 1px;
        height: 36px;
        margin: 0 10px 0 20px;
        background: #606266;
    }
    .tree-column__separate {
        float: left;
        width: 1px;
        height: 36px;
        margin-left: 6px;
        background: #606266;
    }
}
</style>

