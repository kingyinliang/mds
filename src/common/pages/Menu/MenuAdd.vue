<template>
    <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
        <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="120px" @keyup.enter.native="dataFormSubmit()">
            <el-form-item label="ID" prop="id">
                <el-input v-model="dataForm.id" placeholder="请输入id" />
            </el-form-item>
            <el-form-item label="类型" prop="menuType">
                <el-radio-group v-model="dataForm.menuType">
                    <el-radio v-for="(subType, index) in dataForm.typeList" :key="index" :label="subType.label" :value="subType.key">
                        {{ subType }}
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item :label="dataForm.typeList[dataForm.menuType] + '名称'" prop="menuName">
                <el-input v-model="dataForm.menuName" :placeholder="dataForm.typeList[dataForm.menuType] + '名称'" />
            </el-form-item>
            <el-form-item label="上级菜单" prop="parentName">
                <el-popover ref="menuListPopover" placement="bottom-start" trigger="click" style="height: 100%; overflow: auto;">
                    <el-tree ref="menuListTree" :data="menuList" :props="menuListTreeProps" node-key="menuId" :default-expand-all="false" :highlight-current="true" :expand-on-click-node="false" @current-change="menuListTreeCurrentChangeHandle" />
                </el-popover>
                <el-input v-model="dataForm.parentName" v-popover:menuListPopover :readonly="true" placeholder="点击选择上级菜单" class="menu-list__input" />
            </el-form-item>
            <el-form-item
                v-if="dataForm.menuType !== 'B'"
                label="菜单路由"
                :rules="[
                    {
                        required: true,
                        validator: validateUrl,
                        message: '菜单URL不能为空 ',
                        trigger: 'blur',
                    },
                ]"
            >
                <el-input v-model="dataForm.menuUrl" placeholder="菜单路由" />
            </el-form-item>
            <el-form-item v-if="dataForm.menuType !== 'C'" label="授权标识" prop="perms">
                <el-input v-model="dataForm.permission" placeholder="多个用逗号分隔, 如: user:list,user:create" />
            </el-form-item>
            <el-form-item v-if="dataForm.type !== 'B'" label="排序号">
                <el-input-number v-model="dataForm.menuOrder" controls-position="right" :min="0" label="排序号" />
            </el-form-item>
            <el-form-item v-if="dataForm.type !== 'B'" label="菜单图标">
                <el-row>
                    <el-col :span="22">
                        <el-popover ref="iconListPopover" placement="bottom-start" trigger="click" popper-class="mod-menu__icon-popover">
                            <div class="mod-menu__icon-list">
                                <el-button
                                    v-for="(item, index) in iconList"
                                    :key="index"
                                    :class="{
                                        'is-active': item === dataForm.menuIcon,
                                    }"
                                    @click="iconActiveHandle(item)"
                                >
                                    <template>
                                        <i :class="item" class="iconfont" style="font-size: 20px;" />
                                    </template>
                                </el-button>
                            </div>
                        </el-popover>
                        <el-input v-model="dataForm.icon" v-popover:iconListPopover :readonly="true" placeholder="菜单图标名称" class="icon-list__input" />
                    </el-col>
                </el-row>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
        </span>
    </el-dialog>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { treeDataTranslate } from '@/net/validate';
// import { SYSTEMSETUP_API } from '@/api/api';
import { COMMON_API } from 'common/api/api';

// const validateUrl = (rule, value, callback) => {
//     if (this.dataForm.type === 1 && !/\S/.test(value)) {
//         return callback(new Error('菜单URL不能为空'));
//     }
//         return callback();
//
// }

@Component({
    components: {},
    name: 'AddOrUpdate'
})
export default class MenuAdd extends Vue {
    $refs: {
        dataForm: HTMLFormElement;
        menuListTree: HTMLFormElement;
    }

    iconList: string[] = [
        'factory-shouye',
        'factory-shezhi',
        'factory-luru',
        'factory-shenhe',
        'factory-baobiao',
        'factory-yibiao',
        'factory-icon-test',
        'factory-baozhuang',
        'factory-filter',
        'factory-chechuangjiqiren',
        'factory-qiyaguanjianhua',
        'factory-chaohuo',
        'factory-guanquguanli',
        'factory-air-compressor',
        'factory-shajun',
        'factory-guolv',
        'factory-chuiping',
        'factory-yuanshui',
        'factory-calc'
    ]

    visible = false
    type = true
    dataForm = {
        id: 0,
        menuType: 'C',
        typeList: [{
            label: '目录',
            key: 'C'
        }, {
            label: '菜单',
            key: 'M'
        }, {
            label: '按钮',
            key: 'B'
        }, {
            label: '三级页面',
            key: 'P'
        }],
        menuName: '',
        parentId: 0,
        parentName: '',
        menuUrl: '',
        permission: '',
        menuOrder: 0,
        menuIcon: '',
        iconList: []
    }

    dataRule = {
        id: [
            {
                required: true,
                message: 'id不能为空',
                trigger: 'blur'
            }
        ],
        menuName: [
            {
                required: true,
                message: '菜单名称不能为空',
                trigger: 'blur'
            }
        ],
        parentName: [
            {
                required: true,
                message: '上级菜单不能为空',
                trigger: 'change'
            }
        ]
        // url: [{ validator: this.validateUrl, trigger: 'blur' }]
    }

    menuList = []
    menuListTreeProps = {
        label: 'name',
        children: 'children'
    }

    submitType = true

    validateUrl(rule, value, callback) {
        if (this.dataForm.menuType === 'M' && !/\S/.test(value)) {
            return callback(new Error('菜单URL不能为空'));
        }
        return callback();
    }

    init(item) {
        COMMON_API.MENUSELECT_API({
            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id
        }).then(({ data }) => {
            this.menuList = treeDataTranslate(data.menuList, 'menuId');
        }).then(() => {
            this.visible = true;
            this.$nextTick(() => {
                this.$refs.dataForm.resetFields();
                this.dataForm.id = item.menuId || 0;
            });
        }).then(() => {
            if (!this.dataForm.id) {
                // 新增
                this.menuListTreeSetCurrentNode();
                this.type = true;
            } else {
                // 修改
                this.type = false;
                this.dataForm.id = item.menuId;
                this.dataForm.menuType = item.menuType;
                this.dataForm.menuName = item.menuName;
                this.dataForm.parentId = item.parentId;
                this.dataForm.menuUrl = item.menuUrl;
                this.dataForm.permission = item.permission;
                this.dataForm.menuOrder = item.menuOrder;
                this.dataForm.menuIcon = item.menuIcon;
                this.menuListTreeSetCurrentNode();
            }
        });
    }

    // 菜单树选中
    menuListTreeCurrentChangeHandle(data) {
        this.dataForm.parentId = data.menuId;
        this.dataForm.parentName = data.name;
    }

    // 菜单树设置当前选中节点
    menuListTreeSetCurrentNode() {
        this.$refs.menuListTree.setCurrentKey(this.dataForm.parentId);
        this.dataForm.parentName = (this.$refs.menuListTree.getCurrentNode() || {})['name'];
    }

    // 图标选中
    iconActiveHandle(iconName) {
        this.dataForm.menuIcon = iconName;
    }

    // 表单提交
    dataFormSubmit() {
        if (this.submitType) {
            this.submitType = false;
            this.$refs['dataForm'].validate(valid => {
                if (valid) {
                    let http;
                    this.type ? http = COMMON_API.MENUADD_API : http = COMMON_API.MENUUPDATE_API;
                    http({
                        menuId: this.dataForm.id || null,
                        menuType: this.dataForm.menuType,
                        menuName: this.dataForm.menuName,
                        parentId: this.dataForm.parentId,
                        menuUrl: this.dataForm.menuUrl,
                        permission: this.dataForm.permission,
                        menuOrder: this.dataForm.menuOrder,
                        menuIcon: this.dataForm.menuIcon
                    }).then(({ data }) => {
                        if (data && data.code === 0) {
                            this.$successToast('操作成功');
                            this.submitType = true;
                            this.visible = false;
                            this.$emit('refreshDataList');
                        } else {
                            this.submitType = true;
                            this.$warningToast(data.msg);
                        }
                    });
                } else {
                    this.submitType = true;
                }
            });
        }
    }
}
</script>

<style lang="scss">
.mod-menu {
    .menu-list__input,
    .icon-list__input {
        > .el-input__inner {
            cursor: pointer;
        }
    }

    &__icon-popover {
        max-width: 370px;
    }

    &__icon-list {
        max-height: 180px;
        margin: -8px 0 0 -8px;
        padding: 0;

        > .el-button {
            margin: 8px 0 0 8px;
            padding: 8px;

            > span {
                display: inline-block;
                width: 18px;
                height: 18px;
                font-size: 18px;
                vertical-align: middle;
            }
        }
    }

    .icon-list__tips {
        color: #e6a23c;
        font-size: 18px;
        text-align: center;
        cursor: pointer;
    }
}

.el-dialog__body {
    padding: 10px 20px;
}
</style>
