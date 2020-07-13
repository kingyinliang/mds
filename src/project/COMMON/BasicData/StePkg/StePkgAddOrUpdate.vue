<template>
    <el-dialog :close-on-click-modal="false" :visible.sync="visible" :title="dataForm.id? '修改' : '新增'" width="420px">
        <el-form ref="dataForm" :model="dataForm" label-width="120px" :rules="dataRule" size="small">
            <el-form-item label="杀菌车间：" prop="steWorkShop">
                <el-select v-model="dataForm.steWorkShop" placeholder="请选择" style="width: 180px;" clearable>
                    <el-option v-for="(item, index) in steWorkShop" :key="index" :label="item.deptName" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="杀菌锅：" prop="stePotId">
                <el-select v-model="dataForm.stePotId" placeholder="请选择" style="width: 180px;" clearable>
                    <el-option v-for="(item, index) in holderList" :key="index" :label="item.holderName" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="包装车间：" prop="pkgWorkShop">
                <el-select v-model="dataForm.pkgWorkShop" placeholder="请选择" style="width: 180px;" clearable @change="getPkgLine">
                    <el-option v-for="(item, index) in pkgWorkShop" :key="index" :label="item.deptName" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="包装产线：" prop="pkgLine">
                <el-select v-model="dataForm.pkgLine" placeholder="请选择" style="width: 180px;" clearable>
                    <el-option v-for="(item, index) in pkgLine" :key="index" :label="item.deptName" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="备注：">
                <el-input v-model.trim="dataForm.remark" style="width: 180px;" clearable />
            </el-form-item>
            <el-form-item label="操作人：">
                {{ dataForm.changer }}
            </el-form-item>
            <el-form-item label="操作时间：">
                {{ dataForm.changed }}
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
        </span>
    </el-dialog>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
    import { COMMON_API, BASIC_API } from 'common/api/api';
    import { dateFormat, getUserNameNumber } from 'utils/utils';

    @Component
    export default class StePkgAddOrUpdate extends Vue {
        @Prop({ default: [] }) steWorkShop: WorkShop[];
        @Prop({ default: [] }) pkgWorkShop: WorkShop[];
        @Prop({ default: [] }) holderList: WorkShop[];

        $refs: {
            dataForm: HTMLFormElement;
        };

        visible = false;
        pkgLine: WorkShop[] = [];
        dataForm: DataObj = {
            id: '',
            pkgLine: '',
            pkgLineName: '',
            stePotId: '',
            stePotNo: '',
            steWorkShop: '',
            steWorkShopName: '',
            pkgWorkShop: '',
            pkgWorkShopName: '',
            remark: '',
            changer: '',
            changed: ''
        };

        dataRule = {
            steWorkShop: [{ required: true, message: '杀菌车间不能为空', trigger: 'blur' }],
            pkgWorkShop: [{ required: true, message: '包装车间不能为空', trigger: 'blur' }],
            pkgLine: [{ required: true, message: '包装产线不能为空', trigger: 'blur' }],
            stePotId: [{ required: true, message: '杀菌锅不能为空', trigger: 'blur' }]
        };

        init(data) {
            if (data) {
                this.dataForm = data
            } else {
                this.dataForm = {
                    id: '',
                    pkgLine: '',
                    stePotId: '',
                    steWorkShop: '',
                    pkgWorkShop: '',
                    remark: '',
                    changer: getUserNameNumber(),
                    changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
                }
            }
            this.visible = true;
        }

        getPkgLine(n) {
            COMMON_API.ORG_QUERY_CHILDREN_API({
                parentId: n
            }).then(({ data }) => {
                this.pkgLine = data.data
            })
        }

        dataFormSubmit() {
            this.$refs.dataForm.validate(valid => {
                if (valid) {
                    let net;
                    if (this.dataForm.id) {
                        net = BASIC_API.STEPKG_UPDATE_API
                    } else {
                        net = BASIC_API.STEPKG_ADD_API
                    }
                    const filterArr1: (any) = this.holderList.filter(it => it.id === this.dataForm.stePotId);// eslint-disable-line
                    const filterArr2: (any) = this.pkgWorkShop.filter(it => it.id === this.dataForm.pkgWorkShop);// eslint-disable-line
                    const filterArr3: (any) = this.pkgLine.filter(it => it.id === this.dataForm.pkgLine);// eslint-disable-line
                    const filterArr4: (any) = this.steWorkShop.filter(it => it.id === this.dataForm.steWorkShop);// eslint-disable-line
                    this.dataForm.stePotNo = filterArr1[0].holderNo;
                    this.dataForm.pkgWorkShopName = filterArr2[0].deptName;
                    this.dataForm.pkgLineName = filterArr3[0].deptName;
                    this.dataForm.steWorkShopName = filterArr4[0].deptName;
                    net(this.dataForm).then(({ data }) => {
                        this.visible = false;
                        this.$successToast(data.msg);
                        this.$emit('refreshDataList');
                    });
                }
            })
        }
    }
    interface DataObj {
        id?: string;
        pkgLine?: string;
        pkgLineName?: string;
        stePotId?: string;
        stePotNo?: string;
        steWorkShop?: string;
        steWorkShopName?: string;
        pkgWorkShop?: string;
        pkgWorkShopName?: string;
        remark?: string;
        changer?: string;
        changed?: string;
    }
    interface WorkShop {
        id?: '';
        holderNo?: '';
        deptName?: '';
    }
</script>

<style scoped>

</style>
