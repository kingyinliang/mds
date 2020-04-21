<template>
    <el-dialog title="部门分配" :close-on-click-modal="false" :visible.sync="isDaologShow">
        <div style="height: 300px; overflow: auto;">
            <el-tree
                ref="deptListTree"
                :data="orgTree"
                :props="{
                    label: 'deptName',
                }"
                node-key="id"
                :default-expand-all="true"
                show-checkbox
            />
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="isDaologShow = false">取消</el-button>
            <el-button type="primary" @click="submitDataForm">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { COMMON_API } from 'common/api/api';
export default {
    name: 'DepartmentManage',
    components: {},
    data() {
        return {
            roleID: '',
            isDaologShow: false,
            orgTree: []
        };
    },
    computed: {},
    mounted() {
    //    mounted
    },
    methods: {
        // 获取组织结构树
        init(id) {
            this.roleID = id;
            COMMON_API.ORGSTRUCTURE_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id
            })
                .then(({ data }) => {
                    if (data.code === 200) {
                        this.orgTree = data.data;
                    } else {
                        this.$errorToast(data.msg);
                    }
                    this.isDaologShow = true;
                })
                .then(() => {
                    COMMON_API.ROLE_ALLOT_QUERY_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        roleId: id
                    }).then(({ data }) => {
                        if (data.code === 200) {
                            this.$refs.deptListTree.setCheckedKeys(data.data);
                        } else {
                            this.$errorTost(data.msg);
                        }
                    });
                });
        },
        // 提交
        submitDataForm() {
            COMMON_API.ROLE_ALLOT_INSERT_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                roleId: this.roleID,
                deptId: [].concat(this.$refs.deptListTree.getCheckedKeys())
            }).then(({ data }) => {
                if (data.code === 200) {
                    this.$successToast('操作成功');
                    this.isDaologShow = false;
                    this.$emit('refreshDataList');
                } else {
                    this.$errorTost(data.msg);
                }
                this.isDaologShow = true;
            });
        }
    }
};
</script>

<style scoped></style>
