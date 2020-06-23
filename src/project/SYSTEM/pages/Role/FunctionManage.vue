<template>
    <el-dialog title="功能分配" :close-on-click-modal="false" :visible.sync="isDialogShow">
        <div style="min-height: 53vh; max-height: 53vh; overflow: auto;">
            <el-tree
                ref="menuListTree"
                :data="menuList"
                :props="{
                    label: 'menuName',
                    children: 'children'
                }"
                node-key="id"
                :default-expand-all="false"
                :expand-on-click-node="false"
                show-checkbox
            />
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="isDialogShow = false">取消</el-button>
            <el-button type="primary" @click="submitDataForm">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
// import { translateTreeData } from '@/net/validate';
import { COMMON_API } from 'common/api/api';
export default {
    name: 'FunctionManage',
    components: {},
    data() {
        return {
            isDialogShow: false,
            menuList: []
        };
    },
    computed: {},
    mounted() {
    //    mounted
    },
    methods: {
        // 获取功能
        init(id) {
            this.roleID = id;
            COMMON_API.ROLEGETMENU_API({
                roleId: id
            })
                .then(({ data }) => {
                    console.log('data')
                    console.log(data)
                    const maenData = data.data.filter(item => item.id !== '0')
                    maenData.forEach(item => {
                        item.menuName = item.menuName + ' ' + item.remark
                    });
                    this.menuList = this.translateTreeData(maenData);
                })
                .then(() => {
                    this.isDialogShow = true;
                })
                .then(() => {
                    COMMON_API.ROLE_MENU_QUERY_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        roleId: id
                    }).then(({ data }) => {
                        this.$refs.menuListTree.setCheckedKeys(data.data);
                    });
                });
        },
        translateTreeData(data, id = 'id', pid = 'parentId') {
            const res = [];
            const temp = {};
            for (let i = 0; i < data.length; i++) {
                temp[data[i][id]] = data[i];
            }
            for (let k = 0; k < data.length; k++) {
                if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
                    if (!temp[data[k][pid]]['children']) {
                        temp[data[k][pid]]['children'] = [];
                    }
                    if (!temp[data[k][pid]]['_level']) {
                        temp[data[k][pid]]['_level'] = 1;
                    }
                    data[k]['_level'] = temp[data[k][pid]]['_level'] + 1;
                    temp[data[k][pid]]['children'].push(data[k]);
                } else {
                    res.push(data[k]);
                }
            }
            return res;
        },
        // 表单提交
        submitDataForm() {
            COMMON_API.ROLE_MENU_INSERT_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                roleId: this.roleID,
                menuId: [].concat(this.$refs.menuListTree.getCheckedKeys())
            }).then(() => {
                this.isDialogShow = false;
                this.$emit('refreshDataList');
            });
        }
    }
};
</script>

<style scoped></style>
