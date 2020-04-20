<template>
    <el-dialog title="功能分配" :close-on-click-modal="false" :visible.sync="isDaologShow">
        <div style="height: 300px; overflow: auto;">
            <el-tree ref="menuListTree" :data="menuList" :props="menuListTreeProps" node-key="menuId" :default-expand-all="true" :expand-on-click-node="false" show-checkbox />
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="isDaologShow = false">取消</el-button>
            <el-button type="primary" @click="dataFormSubmit">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
// import { treeDataTranslate } from '@/net/validate';
import { COMMON_API } from 'common/api/api';
export default {
    name: 'FunctionManage',
    components: {},
    data() {
        return {
            isDaologShow: false,
            menuList: [],
            menuListTreeProps: {
                label: 'name',
                children: 'children'
            },
            type: true
        };
    },
    computed: {},
    mounted() {
    //    mounted
    },
    methods: {
        // 获取功能
        init(id) {
            this.roleId = id;
            COMMON_API.MENUSELECT_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id
            })
                .then(({ data }) => {
                    if (data.code === 200) {
                        console.log(data)
                        this.menuList = this.treeDataTranslate(data.data, 'id');
                        console.log(this.menuList)
                    }
                })
                .then(() => {
                    this.isDaologShow = true;
                })
                // .then(() => {
                //     this.$http(`${SYSTEMSETUP_API.LISTMENU_API}`, 'POST', {
                //         roleId: id
                //     }).then(({ data }) => {
                //         if (data.code === 0) {
                //             this.$refs.menuListTree.setCheckedKeys(data.list);
                //         } else {
                //             this.$errorTost(data.msg);
                //         }
                //     });
                // });
        },
        treeDataTranslate(data, id = 'id', pid = 'parentId') {
            const res = [];
            const temp = {};
            for (let i = 0; i < data.length; i++) {
                temp[data[i][id]] = data[i];
            }
            console.log('temp')
            console.log(temp)
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
        dataFormSubmit() {
            // if (this.type) {
            //     this.type = false;
            //     this.$http(`${SYSTEMSETUP_API.ROLEMENUUPDATE_API}`, 'POST', {
            //         roleId: this.roleId,
            //         menuId: [[].concat(this.$refs.menuListTree.getCheckedKeys()), [].concat(this.$refs.menuListTree.getHalfCheckedKeys())]
            //     }).then(({ data }) => {
            //         if (data.code === 0) {
            //             this.$successTost('操作成功');
            //             this.type = true;
            //             this.isDaologShow = false;
            //             this.$emit('refreshDataList');
            //         } else {
            //             this.$errorTost(data.msg);
            //         }
            //     });
            // }
        }
    }
};
</script>

<style scoped></style>
