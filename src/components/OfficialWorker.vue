<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2020-12-02 10:12:17
 * @LastEditors: Telliex
 * @LastEditTime: 2020-12-17 17:23:13
-->
<template>
    <el-dialog title="人员分配" :close-on-click-modal="false" :visible.sync="visible">
        <el-row>
            <el-col style="width: 500px;">
                <el-transfer v-model="selctId" filterable :titles="['未分配人员', '已分配人员']" :filter-method="filterMethod" filter-placeholder="请输入用户名称" :data="userlist" />
            </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button size="small" @click="visible = false">
                取消
            </el-button>
            <el-button type="primary" size="small" @click="updatauser">
                确定
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
import { COMMON_API } from 'common/api/api';
import { setUserList } from 'utils/utils.ts';
export default {
    name: 'OfficialWorker',
    components: {},
    data() {
        return {
            visible: false,
            selctId: [],
            userlist: [],
            filterMethod(query, item) {
                return item.screncon.indexOf(query) > -1;
            }
        };
    },
    computed: {},
    methods: {
        // 根据部门id查人
        /* eslint-disable @typescript-eslint/camelcase*/
        init(id, userId) {
            this.visible = true;
            this.selctId = []; // DFMDS-2571 , 没清空遗留上一次数据问题
            this.userlist = [];
            COMMON_API.USER_ROLE_ALL_QUERY_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                deptId: id
            }).then(({ data }) => {
                this.userlist = setUserList(data.data);
                this.selctId = userId;
                this.visible = true;
            });
        },
        /* eslint-enable @typescript-eslint/camelcase*/
        // 确定人员
        updatauser() {
            this.visible = false;
            this.$emit('changeUser', this.selctId);
        }
    }
};
</script>

<style scoped></style>
