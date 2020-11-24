<template>
    <el-dialog title="泡豆罐选择" :close-on-click-modal="false" :visible.sync="visible">
        <el-row>
            <el-col style="width: 700px;">
                <el-transfer v-model="selectId" filterable :titles="['未选择泡豆罐', '已选择泡豆罐']" :filter-method="filterMethod" filter-placeholder="请输入" :data="userlist" />
            </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button size="small" @click="visible = false">
                取消
            </el-button>
            <el-button type="primary" size="small" @click="updateUser">
                确定
            </el-button>
        </div>
    </el-dialog>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API } from 'common/api/api';

    @Component({
        name: 'ScanSelectDialog'
    })
    export default class ScanSelectDialog extends Vue {
        visible = false;
        selectId = [];
        userlist: object[] = [];

        filterMethod(query, item) {
            return item.screncon.indexOf(query) > -1;
        }

        /*
            deptId: "85001011"
            holderName: "1#泡豆罐（SC）"
            holderNo: "001"
            holderType: "025"
            holderVolume: 1000
            id: "515584373894967296"
            material: []
        */


        setUserList(data) {
            const res: UserObj[] = [];
            data.forEach(item => {
                res.push({
                    label: item.holderName + '(' + item.holderNo + ')',
                    key: item.holderName + ',' + item.holderNo + ',' + item.id,
                    screncon: item.holderName + item.holderNo
                });
            });
            return res;
        }

        init(deptId, selectedIds) {
            this.visible = true;
            this.selectId = selectedIds;
            COMMON_API.HOLDER_DROPDOWN_API({
                deptId,
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                holderType: ['025']
            }).then(({ data }) => {
                this.userlist = this.setUserList(data.data || []);
            });
        }

        // 确定
        updateUser() {
            this.visible = false;
            this.$emit('changeUser', this.selectId);
        }
    }
    interface UserObj {
        label?: string;
        key?: string;
        screncon?: string;
    }
</script>
