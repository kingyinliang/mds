<template>
    <div>
        <el-card>
            <div style="overflow: hidden;">
                <el-button type="primary" size="small" :disabled="!isRedact" style="float: right;" @click="addmaterial">
                    + 新增
                </el-button>
            </div>
            <div style="margin-top: 10px;">
                <el-table :data="materialList" border headerRowClassName="tableHead" :rowClassName="rowDelFlag" @selection-change="handleSelectionChange" @row-dblclick="editmaterial">
                    <el-table-column type="selection" width="35" :disabled="!isRedact" />
                    <el-table-column type="index" label="序号" width="50px" />
                    <el-table-column width="100px">
                        <template slot="header">
                            <i class="reqI">*</i><span>布浆机</span>
                        </template>
                        <template slot-scope="scope">
                            {{ scope.row.pulpMachineName }}
                        </template>
                    </el-table-column>
                    <el-table-column width="180px" showOverflowTooltip>
                        <template slot="header">
                            <i class="reqI">*</i><span>气垫小车号</span>
                        </template>
                        <template slot-scope="scope">
                            {{ scope.row.hovercraftName }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="pulpNum" label="布浆张数" />
                    <el-table-column width="150px">
                        <template slot="header">
                            <i class="reqI">*</i><span>布浆开始时间</span>
                        </template>
                        <template slot-scope="scope">
                            {{ scope.row.pulpStartDate }}
                        </template>
                    </el-table-column>
                    <el-table-column width="150px">
                        <template slot="header">
                            <i class="reqI">*</i><span>布浆结束时间</span>
                        </template>
                        <template slot-scope="scope">
                            {{ scope.row.pulpEndDate }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="pulpTime" label="布浆时间合计(MIN)" width="150px" />
                    <el-table-column>
                        <template slot="header">
                            <i class="reqI">*</i><span>布浆量</span>
                        </template>
                        <template slot-scope="scope">
                            {{ scope.row.pulpAmount }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="unit" label="单位" />
                    <el-table-column showOverflowTooltip width="100px">
                        <template slot="header">
                            布号
                        </template>
                        <template slot-scope="scope">
                            {{ scope.row.clothNo }}
                        </template>
                    </el-table-column>
                    <el-table-column showOverflowTooltip width="210px">
                        <template slot="header">
                            <i class="reqI">*</i><span>原汁分类</span>
                        </template>
                        <template slot-scope="scope">
                            {{ scope.row.sauceClass }}
                        </template>
                    </el-table-column>
                    <el-table-column width="160px">
                        <template slot="header">
                            <i class="reqI">*</i><span>布浆自淋时间(MIN)</span>
                        </template>
                        <template slot-scope="scope">
                            {{ scope.row.selfDrenchTime }}
                        </template>
                    </el-table-column>
                    <el-table-column width="150px">
                        <template slot="header">
                            <i class="reqI">*</i><span>发酵罐号1</span>
                        </template>
                        <template slot-scope="scope">
                            {{ scope.row.potOne }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="potTwo" label="发酵罐号2" width="150px" />
                    <el-table-column prop="remark" label="操作" fixed="right">
                        <template slot-scope="scope">
                            <el-button class="delBtn" type="text" icon="el-icon-delete" :disabled="!isRedact" size="mini" @click="delrow(scope.row)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
        <el-card>
            <div>
                <span class="lh32px">布浆人员</span>
                <el-button type="text" class="readyshiftBtn" name="people" style="margin-left: 30px;">
                    收起<i class="el-icon-caret-top" />
                </el-button>
                <el-button type="primary" size="small" :disabled="!isRedact" style="float: right;" @click="addpeople">
                    + 新增
                </el-button>
            </div>
            <div class="peopleBox">
                <el-table ref="peopleTable" border style="margin-top: 10px;" headerRowClassName="tableHead" :data="peopleList" :rowClassName="rowDelFlag">
                    <el-table-column label="白/中/夜班">
                        <template slot="header">
                            <i class="reqI">*</i><span>白/中/夜班</span>
                        </template>
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.classes" placeholder="请选择" size="small" :disabled="!isRedact">
                                <el-option v-for="item in classesList" :key="item" :label="item" :value="item" />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="人员" :showOverflowTooltip="true">
                        <template slot="header">
                            <i class="reqI">*</i><span>人员</span>
                        </template>
                        <template slot-scope="scope">
                            <el-col v-if="!scope.row.man">
                                <span
                                    :style="{
                                        cursor: isRedact ? 'pointer' : '',
                                    }"
                                    @click="selectUser(scope.row)"
                                >
                                    <i>{{ scope.row.man }}</i>
                                    <i>点击选择人员</i>
                                </span>
                            </el-col>
                            <span v-else :style="{ cursor: isRedact ? 'pointer' : '' }" @click="selectUser(scope.row)">{{ scope.row.man }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="danger" icon="el-icon-delete" :disabled="!isRedact" circle size="mini" @click="delrow(scope.row)" />
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
        <el-dialog :closeOnClickModal="false" customClass="dialog__class" :visible.sync="dialogFormVisibleMai" width="450px">
            <div slot="title">
                熟酱醪领用
            </div>
            <el-form ref="saucesbu" :model="sauce" size="small" :rules="saucerule">
                <el-form-item label="布浆机：" :labelWidth="formLabelWidth" prop="pulpMachine">
                    <el-select v-model="sauce.pulpMachine" filterable placeholder="请选择" style="width: 310px;">
                        <el-option v-for="(item, index) in pulpMachineList" :key="index" :label="item.deviceName" :value="item.deviceId" />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="!sauce.id" label="气垫小车：" :labelWidth="formLabelWidth" prop="hovercraftNo">
                    <el-select v-model="sauce.hovercraftNo" filterable placeholder="请选择" style="width: 310px;" :disabled="!isSelect">
                        <el-option v-for="(item, index) in hovercraftList" :key="index" :label="item.deviceName" :value="item.deviceId" />
                    </el-select>
                </el-form-item>
                <el-form-item v-else label="气垫小车：" :labelWidth="formLabelWidth" prop="hovercraftNo">
                    <el-select v-model="sauce.hovercraftNo" filterable placeholder="请选择" style="width: 310px;" :disabled="!isSelect">
                        <el-option v-for="(item, index) in hovercraftAll" :key="index" :label="item.deviceName" :value="item.deviceId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="布浆张数：" :labelWidth="formLabelWidth" prop="pulpNum">
                    <el-input v-model="sauce.pulpNum" />
                </el-form-item>
                <el-form-item label="布浆开始时间：" :labelWidth="formLabelWidth" prop="pulpStartDate">
                    <el-date-picker v-model="sauce.pulpStartDate" type="datetime" placeholder="选择日期" format="yyyy-MM-dd HH:mm" valueFormat="yyyy-MM-dd HH:mm" style="width: 310px;" />
                </el-form-item>
                <el-form-item label="布浆结束时间：" :labelWidth="formLabelWidth" prop="pulpEndDate">
                    <el-date-picker v-model="sauce.pulpEndDate" type="datetime" placeholder="选择日期" format="yyyy-MM-dd HH:mm" valueFormat="yyyy-MM-dd HH:mm" style="width: 310px;" />
                </el-form-item>
                <el-form-item label="布浆量：" :labelWidth="formLabelWidth" prop="pulpAmount">
                    <el-input v-model="sauce.pulpAmount" />
                </el-form-item>
                <el-form-item label="单位：" :labelWidth="formLabelWidth">
                    L
                </el-form-item>
                <el-form-item label="自重自淋时间：" :labelWidth="formLabelWidth" prop="selfDrenchTime">
                    <el-input v-model="sauce.selfDrenchTime" />
                </el-form-item>
                <el-form-item label="布号：" :labelWidth="formLabelWidth" prop="clothNo">
                    <el-input v-model="sauce.clothNo" />
                </el-form-item>
                <el-form-item label="原汁分类：" :labelWidth="formLabelWidth" prop="sauceClass">
                    <el-select v-model="sauce.sauceClass" filterable placeholder="请选择" style="width: 310px;">
                        <el-option v-for="(item, index) in sauceClassList" :key="index" :label="item.code + ' ' + item.value" :value="item.code + ' ' + item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="发酵罐号：" :labelWidth="formLabelWidth" prop="potOne">
                    <el-input v-model="sauce.potOne" style=" float: left; width: 259px;" /><el-button style="float: left; margin-left: 10px;" @click="addGuan()">
                        +
                    </el-button>
                </el-form-item>
                <el-form-item label="发酵罐号2：" :labelWidth="formLabelWidth" prop="potTwo" :style="{ display: guanTwoDisplayNo ? 'none' : '' }">
                    <el-input v-model="sauce.potTwo" style=" float: left; width: 259px;" /><el-button type="danger" icon="el-icon-delete" circle size="small" style="float: left; margin-left: 10px;" @click="delGuan()" />
                </el-form-item>
                <el-form-item label="操作时间：" :labelWidth="formLabelWidth">
                    {{ sauce.changed }}
                </el-form-item>
                <el-form-item label="操作人：" :labelWidth="formLabelWidth">
                    {{ sauce.changer }}
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelsave()">
                    取 消
                </el-button>
                <el-button type="primary" @click="addsave('saucesbu')">
                    确 定
                </el-button>
            </div>
        </el-dialog>
        <el-dialog title="人员分配" :closeOnClickModal="false" :visible.sync="visible">
            <el-row>
                <el-col style="width: 500px;">
                    <el-transfer v-model="selctId" filterable :titles="['未分配人员', '已分配人员']" :filterMethod="filterMethod" filterPlaceholder="请输入用户名称" :data="userlist" />
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button style=" padding: 12px 20px; font-size: 14px; border: 1px solid #dcdfe6; border-radius: 4px;" @click="visible = false">取消</el-button>
                <el-button type="primary" style=" padding: 12px 20px; font-size: 14px; background-color: #1890ff; border-radius: 4px;" @click="updatauser(row)">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { dateFormat, Readyanimation, setUserList } from '@/net/validate';
import { BASICDATA_API, SYSTEMSETUP_API, SQU_API } from '@/api/api';
export default {
    name: 'Material',
    components: {},
    props: {
        isRedact: {
                type: Boolean
            },
        formHeader: {
                type: Object,
                default: function() { return {} }
            }
    },
    data() {
        return {
            formLabelWidth: '100px',
            pulpMachineList: [],
            hovercraftList: [],
            hovercraftAll: [],
            dialogFormVisibleMai: false,
            visible: false,
            materialList: [],
            sauce: {},
            saucerule: {
                pulpMachine: [
                    {
                        required: true,
                        message: '请选择布浆机',
                        trigger: 'change'
                    }
                ],
                hovercraftNo: [
                    {
                        required: true,
                        message: '请选择气垫车',
                        trigger: 'change'
                    }
                ]
            },
            classesList: ['白班', '中班', '夜班'],
            peopleList: [],
            selctId: [],
            userlist: [],
            filterMethod(query, item) {
                return item.screncon.indexOf(query) > -1;
            },
            multipleSelection: [],
            isSelect: true,
            guanTwoDisplayNo: true,
            sauceClassList: []
        };
    },
    computed: {},
    watch: {
        'formHeader.factory'(n) {
            this.GetsauceClass(n);
        }
    },
    mounted() {
        Readyanimation(this.$);
    },
    methods: {
        // 酱醪列表
        GetsauceClass(factory) {
            this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {
                factory: factory,
                type: 'YA_M_MATERIAL'
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.sauceClassList = data.dicList;
                } else {
                    this.$error_SHINHO(data.msg);
                }
            });
        },
        addGuan() {
            this.guanTwoDisplayNo = false;
        },
        delGuan() {
            this.sauce.potTwo = '';
            this.guanTwoDisplayNo = true;
        },
        cancelsave() {
            this.dialogFormVisibleMai = false;
            this.delGuan();
        },
        // 布浆机
        GetpulpMachine(productLine) {
            this.$http(`${BASICDATA_API.DEVICELIST_API}`, 'POST', {
                param: '布浆机',
                deptId: productLine,
                currPage: '1',
                pageSize: '50'
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.pulpMachineList = data.list.list;
                } else {
                    this.$error_SHINHO(data.msg);
                }
            });
        },
        // 气垫车
        GethovercraftNo(workshop) {
            this.$http(`${BASICDATA_API.DEVICELIST_API}`, 'POST', {
                param: '气垫小车',
                deptId: workshop,
                currPage: '1',
                pageSize: '50',
                status: '0'
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.hovercraftList = data.list.list;
                } else {
                    this.$error_SHINHO(data.msg);
                }
            });
            this.$http(`${BASICDATA_API.DEVICELIST_API}`, 'POST', {
                param: '气垫小车',
                deptId: workshop,
                currPage: '1',
                pageSize: '50'
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.hovercraftAll = data.list.list;
                } else {
                    this.$error_SHINHO(data.msg);
                }
            });
        },
        addmaterial() {
            this.dialogFormVisibleMai = true;
            this.isSelect = true;
            this.guanTwoDisplayNo = true;
            this.sauce = {
                id: '',
                uid: this.uuid(),
                pulpMachine: '',
                hovercraftNo: '',
                pulpNum: '',
                pulpStartDate: '',
                pulpEndDate: '',
                pulpAmount: '',
                unit: 'L',
                selfDrenchTime: '',
                potOne: '',
                potTwo: '',
                changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                changer: this.$store.state.user.realName + `(${this.$store.state.user.name})`,
                delFlag: '0',
                clothNo: '',
                sauceClass: ''
            };
        },
        editmaterial(row) {
            if (this.isRedact) {
                this.dialogFormVisibleMai = true;
                this.isSelect = false;
                this.sauce = Object.assign({}, row);
                if (this.sauce.potTwo) {
                    this.guanTwoDisplayNo = false;
                }
            }
        },
        addsave(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let currentRecord = [];
                    if (Object.prototype.hasOwnProperty.call(this.sauce, 'uid')) {
                        // 新增行
                        currentRecord = this.materialList.filter(data => data.uid === this.sauce.uid);
                    } else {
                        // 原有行
                        currentRecord = this.materialList.filter(data => data.id === this.sauce.id);
                    }
                    const pulpName = this.pulpMachineList.find(item => item.deviceId === this.sauce.pulpMachine).deviceName;
                    const hovercraName = this.hovercraftAll.find(item => item.deviceId === this.sauce.hovercraftNo).deviceName;
                    this.sauce = {
                        id: this.sauce.id,
                        uid: this.sauce.uid,
                        pulpMachine: this.sauce.pulpMachine,
                        hovercraftNo: this.sauce.hovercraftNo,
                        pulpMachineName: pulpName,
                        hovercraftName: hovercraName,
                        pulpNum: this.sauce.pulpNum,
                        pulpStartDate: this.sauce.pulpStartDate,
                        pulpEndDate: this.sauce.pulpEndDate,
                        pulpAmount: this.sauce.pulpAmount,
                        unit: 'L',
                        selfDrenchTime: this.sauce.selfDrenchTime,
                        potOne: this.sauce.potOne,
                        potTwo: this.sauce.potTwo,
                        changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                        changer: this.$store.state.user.realName + `(${this.$store.state.user.name})`,
                        delFlag: this.sauce.delFlag,
                        clothNo: this.sauce.clothNo,
                        sauceClass: this.sauce.sauceClass
                    };
                    let chaTime;
                    if (!this.sauce.pulpEndDate || !this.sauce.pulpStartDate) {
                        this.$set(this.sauce, 'pulpTime', 0);
                    } else {
                        chaTime = (new Date(this.sauce.pulpEndDate) - new Date(this.sauce.pulpStartDate)) / 60000;
                        this.$set(this.sauce, 'pulpTime', chaTime);
                    }
                    if (currentRecord && currentRecord.length > 0) {
                        Object.assign(currentRecord[0], this.sauce);
                    } else {
                        this.materialList.push(this.sauce);
                    }
                    this.dialogFormVisibleMai = false;
                } else {
                    return false;
                }
            });
        },
        // 物料查询列表
        GetMateriaList(formHeader) {
            this.GetpulpMachine(formHeader.productLine); // 布浆机
            this.GethovercraftNo(formHeader.workShop); // 气垫车
            this.$http(`${SQU_API.CLOTHMATERIALIST_API}`, 'POST', {
                factory: formHeader.factory,
                workShop: formHeader.workShop,
                productLine: formHeader.productLine,
                productDate: formHeader.productDate
            }).then(({ data }) => {
                if (data.code === 0) {
                    if (data.prspro.length !== 0) {
                        this.formHeader.id = data.prspro[0].id;
                    } else {
                        this.formHeader.id = '';
                    }
                    this.materialList = data.propulp;
                    this.peopleList = data.propulpMan;
                } else {
                    this.$error_SHINHO(data.msg);
                }
            });
        },
        Readyrules() {
            let ty = true;
            if (this.multipleSelection.length === 0) {
                ty = false;
                this.$warningTost('请勾选提交数据');
                return false;
            }
            for (const items of this.multipleSelection) {
                if (
                    !items.pulpMachineName ||
                    items.pulpMachineName === '' ||
                    !items.hovercraftName ||
                    items.hovercraftName === '' ||
                    !items.pulpStartDate ||
                    items.pulpStartDate === '' ||
                    !items.pulpEndDate ||
                    items.pulpEndDate === '' ||
                    !items.pulpAmount ||
                    items.pulpAmount === '' ||
                    items.selfDrenchTime === '' ||
                    items.selfDrenchTime === null ||
                    !items.potOne ||
                    items.potOne === '' ||
                    !items.sauceClass ||
                    items.sauceClass === ''
                ) {
                    ty = false;
                    this.$warningTost('物料必填项不能为空');
                    return false;
                }
            }
            if (this.peopleList.length === 0) {
                ty = false;
                this.$warningTost('请填写布浆人员');
                return false;
            }
            for (const items of this.peopleList) {
                if (!items.classes || items.classes === '' || !items.man || items.man === '') {
                    ty = false;
                    this.$warningTost('人员必填项不能为空');
                    return false;
                }
            }
            for (const item of this.multipleSelection) {
                if (item.id === '') {
                    ty = false;
                    this.$warningTost('请先保存再提交');
                    return false;
                }
            }
            return ty;
        },
        savemain(resolve, reject) {
            if (!this.formHeader.id) {
                this.formHeader.id = this.uuid(32, 62);
            }
            this.formHeader.addOrUpdate = '0';
            this.$http(`${SQU_API.CLOTHFORMHEADER_API}`, 'POST', this.formHeader)
                .then(({ data }) => {
                    if (data.code !== 0) {
                        this.$error_SHINHO(data.msg);
                    }
                    if (resolve) {
                        resolve('resolve');
                    }
                })
                .catch(() => {
                    if (resolve) {
                        reject('reject');
                    }
                });
        },
        /* eslint-disable no-shadow */
        savesecond(resolve, reject) {
            this.materialList.map(item => {
                this.$set(item, 'processId', this.formHeader.id);
                this.$set(item, 'productLine', this.formHeader.productLine);
                this.$set(item, 'status', 'saved');
                if (this.formHeader.clickstatus === 'submit' && this.multipleSelection.length > 0) {
                    if (this.multipleSelection.find(items => items.uid === item.uid)) {
                        this.$set(item, 'status', 'submit');
                    }
                }
            });
            this.$http(`${SQU_API.CLOTHMATERIALSAVE_API}`, 'POST', this.materialList)
                .then(({ data }) => {
                    if (data.code === 0) {
                        if (this.formHeader.clickstatus === 'submit') {
                            this.multipleSelection.map(item => {
                                this.$set(item, 'processId', this.formHeader.id);
                                this.$set(item, 'productLine', this.formHeader.productLine);
                                this.$set(item, 'status', this.formHeader.clickstatus);
                            });
                            this.$http(`${SQU_API.CLOTHMATERIALSUBMIT_API}`, 'POST', this.multipleSelection).then(({ data }) => {
                                if (data.code !== 0) {
                                    this.$error_SHINHO(data.msg);
                                }
                            });
                        }
                    } else {
                        this.$error_SHINHO(data.msg);
                    }
                    if (resolve) {
                        resolve('resolve');
                    }
                })
                .catch(() => {
                    if (resolve) {
                        reject('reject');
                    }
                });
        },
        /* eslint-enable no-shadow */
        savepeople(resolve, reject) {
            this.peopleList.map(item => {
                this.$set(item, 'processId', this.formHeader.id);
            });
            this.$http(`${SQU_API.CLOTHMATERIALMAN_API}`, 'POST', this.peopleList)
                .then(({ data }) => {
                    if (data.code !== 0) {
                        this.$error_SHINHO(data.msg);
                    }
                    if (resolve) {
                        resolve('resolve');
                    }
                })
                .catch(() => {
                    if (resolve) {
                        reject('reject');
                    }
                });
        },
        delrow(row) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                row.delFlag = '1';
            });
        },
        rowDelFlag({ row }) {
            if (row.delFlag === '1') {
                return 'rowDel';
            }
                return '';

        },
        addpeople() {
            this.peopleList.push({
                id: '',
                classes: '',
                delFlag: '0'
            });
        },
        selectUser(row) {
            if (this.isRedact) {
                this.row = row;
                this.$http(`${SYSTEMSETUP_API.USERLIST_API}`, 'POST', {
                    deptId: this.formHeader.workShop,
                    pageSize: '9999',
                    currPage: '1'
                }).then(({ data }) => {
                    if (data.code === 0) {
                        this.userlist = setUserList(data.page.list);
                        if (this.row.man) {
                            this.selctId = this.row.man.split(',');
                        }
                        this.visible = true;
                    } else {
                        this.$error_SHINHO(data.msg);
                    }
                });
            }
        },
        // 人员确定
        updatauser(row) {
            // row.man = this.selctId.join(',')
            this.$set(row, 'man', this.selctId.join(','));
            this.selctId = [];
            this.visible = false;
        },
        handleSelectionChange(val) {
            for (const item of val) {
                if (item.uid === '' || !item.uid) {
                    this.$set(item, 'uid', item.id);
                }
            }
            this.multipleSelection = val;
        }
    }
};
</script>

<style>
.reqI {
    color: red;
}

.rowDel {
    display: none;
}

.dialog-footer .el-button--primary {
    color: #fff;
    background-color: #1890ff;
    border-color: #1890ff;
}

.dialog-footer .el-button--primary:focus {
    color: #000;
    background-color: #fff;
    border-color: #d9d9d9;
}

.dialog-footer .el-button--primary:hover {
    color: #fff;
    background-color: #1890ff;
}
</style>
