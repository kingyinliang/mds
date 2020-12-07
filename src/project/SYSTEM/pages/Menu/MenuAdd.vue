<template>
    <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
        <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="120px" size="small" @keyup.enter.native="dataFormSubmit()">
            <el-form-item label="系统：" prop="terminal">
                <el-radio-group v-model="dataForm.terminal">
                    <el-radio key="PC" label="PC">
                        PC
                    </el-radio>
                    <el-radio key="APP" label="APP">
                        APP
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="类型：" prop="menuType">
                <el-radio-group v-model="dataForm.menuType">
                    <el-radio v-for="(subType, index) in typeList" :key="index" :label="subType.key" :value="subType.key">
                        {{ subType.label }}
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="工厂：">
                <el-checkbox-group v-model="dataForm.deptIdList">
                    <el-checkbox v-for="(item, index) in factory" :key="index" :label="item.id" name="factory">
                        {{ item.deptShort }}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item :label="'名称：'" prop="menuName">
                <el-input v-model="dataForm.menuName" :placeholder="'名称'" />
            </el-form-item>
            <el-form-item label="上级菜单：" prop="parentName">
                <el-popover ref="menuListPopover" placement="bottom-start" trigger="click" style="height: 100%; overflow: auto;">
                    <el-tree ref="menuListTree" :data="menuList" :props="menuListTreeProps" node-key="id" :default-expand-all="false" :highlight-current="true" :expand-on-click-node="false" @current-change="menuListTreeCurrentChangeHandle" />
                </el-popover>
                <el-input v-model="dataForm.parentName" v-popover:menuListPopover :readonly="true" placeholder="点击选择上级菜单" class="menu-list__input" />
            </el-form-item>
            <el-form-item
                v-if="dataForm.menuType !== 'B'"
                label="菜单路由："
                :rules="[
                    {
                        required: true,
                        validator: validateUrl,
                        message: '菜单URL不能为空 ',
                        trigger: 'blur',
                    },
                ]"
            >
                <el-input v-model="dataForm.menuUrl" placeholder="菜单路由：" />
            </el-form-item>
            <el-form-item v-if="dataForm.menuType !== 'C'" label="授权标识：" prop="perms">
                <el-input v-model="dataForm.permission" placeholder="多个用逗号分隔, 如: user:list,user:create" />
            </el-form-item>
            <el-form-item v-if="dataForm.type !== 'B'" label="排序号：">
                <el-input-number v-model="dataForm.menuOrder" controls-position="right" :min="0" label="排序号" />
            </el-form-item>
            <el-form-item v-if="dataForm.type !== 'B'" label="菜单图标：">
                <el-row>
                    <el-col :span="24">
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
                                        <em :class="item" class="iconfont" style="font-size: 20px;" />
                                    </template>
                                </el-button>
                            </div>
                        </el-popover>
                        <el-input v-model="dataForm.menuIcon" v-popover:iconListPopover placeholder="菜单图标名称" class="icon-list__input" clearable />
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="备注：">
                <el-input v-model="dataForm.remark" />
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="small" @click="visible = false">
                取消
            </el-button>
            <el-button size="small" type="primary" @click="dataFormSubmit()">
                确定
            </el-button>
        </div>
    </el-dialog>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { treeDataTranslate } from '@/net/validate';
import { COMMON_API } from 'common/api/api';

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
        'factory-wendangguanli',
        'factory-calc'
    ];

    typeList: object[] = [
        {
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
        }
    ];

    visible = false
    type = true
    factory = []
    dataForm = {
        id: '',
        deptIdList: [],
        terminal: 'PC',
        menuType: 'C',
        menuName: '',
        parentId: 0,
        parentName: '',
        menuUrl: '',
        permission: '',
        menuOrder: 0,
        menuIcon: '',
        remark: ''
    }

    dataRule = {
        terminal: [
            {
                required: true,
                message: '系统不能为空',
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
        label: 'menuName',
        children: 'children'
    }

    submitType = true

    validateUrl(rule, value, callback) {
        if (this.dataForm.menuType === 'M' && !/\S/.test(value)) {
            return callback(new Error('菜单URL不能为空'));
        }
        return callback();
    }

    mounted() {
        // COMMON_API.GETORGBYTYPE_API({
        //     factory: '',
        //     deptType: 'FACTORY'
        // }).then(({ data }) => {
        //     console.log(data);
        // });

    }

    init(item) {
        COMMON_API.ORG_QUERY_WORKSHOP_API({
            deptType: ['FACTORY', 'FAKE_FACTORY']
        }).then(({ data }) => {
            this.factory = data.data
        })
        COMMON_API.MENUSELECT_API({
            factory: 'common'
        }).then(({ data }) => {
            this.menuList = treeDataTranslate(data.data);
        }).then(() => {
            this.visible = true;
            this.$nextTick(() => {
                this.$refs.dataForm.resetFields();
            });
        }).then(() => {
            this.$nextTick(() => {
                if (!item) {
                    // 新增
                    this.type = true;
                    this.dataForm = {
                        id: '',
                        deptIdList: [],
                        terminal: 'PC',
                        menuType: 'C',
                        menuName: '',
                        parentId: 0,
                        parentName: '',
                        menuUrl: '',
                        permission: '',
                        menuOrder: 0,
                        menuIcon: '',
                        remark: ''
                    }
                } else {
                    // 修改
                    this.type = false;
                    this.dataForm.id = item.id;
                    this.dataForm.deptIdList = item.deptIdList;
                    this.dataForm.terminal = item.terminal;
                    this.dataForm.menuType = item.menuType;
                    this.dataForm.menuName = item.menuName;
                    this.dataForm.parentId = item.parentId;
                    this.dataForm.parentId = item.parentId;
                    this.dataForm.menuUrl = item.menuUrl;
                    this.dataForm.permission = item.permission;
                    this.dataForm.menuOrder = item.menuOrder;
                    this.dataForm.menuIcon = item.menuIcon;
                    this.dataForm.remark = item.remark;
                    this.menuListTreeSetCurrentNode();
                }
            })
        });
    }

    // 菜单树选中
    menuListTreeCurrentChangeHandle(data) {
        console.log(data);
        this.dataForm.parentId = data.id;
        this.dataForm.parentName = data.menuName;
    }

    // 菜单树设置当前选中节点
    menuListTreeSetCurrentNode() {
        this.$refs.menuListTree.setCurrentKey(this.dataForm.parentId);
        this.dataForm.parentName = (this.$refs.menuListTree.getCurrentNode() || {})['menuName'];
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
                    http(this.dataForm).then(({ data }) => {
                        if (data && data.code === 200) {
                            this.$successToast('操作成功');
                            this.submitType = true;
                            this.visible = false;
                            this.$emit('refreshDataList');
                        } else {
                            this.submitType = true;
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
