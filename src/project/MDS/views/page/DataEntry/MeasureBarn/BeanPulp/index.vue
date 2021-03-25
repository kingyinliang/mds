<template>
    <div class="header_main">
        <el-card class="queryHead">
            <el-form :model="plantList" size="small" :inline="true" label-position="right" label-width="auto" class="sole_row">
                <el-form-item label="生产工厂：">
                    <el-select v-model="plantList.factoryIDValue" class="w300" placeholder="请选择" @change="changeSearchOptions(plantList.factoryIDValue)">
                        <el-option v-for="sole in factoryList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="生产车间：">
                    <el-select v-model="plantList.workshopIDValue" class="w200" clearable placeholder="请选择" :disabled="plantList.factoryIDValue === '' || workshopList.length === 0">
                        <el-option v-for="sole in workshopList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId" />
                    </el-select>
                </el-form-item>
                <el-form-item style="float: right;">
                    <el-button v-if="isAuth('realTime:pulp:pulpMeasuringBin')" type="primary" size="small" :disabled="(plantList.factoryIDValue === '' && plantList.workshopIDValue === '') || workshopList.length === 0" @click="getOrderList()">
                        查询
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-row v-if="isMainAreaShow" :gutter="30" class="cardList">
            <el-col v-for="(item, index) in dataList" :key="'h' + index" :span="12">
                <el-card class="card-item">
                    <div slot="header">
                        计量仓号：{{ item.holderName }}
                        <span class="card-item_detail" @click="goTargetDetail(item)">详情</span>
                    </div>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <div class="card-item-color-lump" style="background: #ffbf00;">
                                <span class="card-item-color-lump_icon iconfont factory-chuguan1" />
                                <div class="card-item-color-lump__img">
                                    <div class="card-item-color-lump__img__box">
                                        <div
                                            class="card-item-color-lump__img__box__bg"
                                            :style="{
                                                height: `${Math.min(sumBatch(item.pulpList) / (item.holderHold * 1), 100)}%`,
                                            }"
                                        />
                                    </div>
                                    <img src="@/assets/img/ui2.0/pot.png" alt="">
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="card-item-color-lump">
                                <span class="card-item-color-lump_icon iconfont factory-zongliangguanli" />
                                <p class="card-item-color-lump_text">
                                    <span>{{ sumBatch(item.pulpList).toLocaleString() }}</span>KG
                                </p>
                                <p class="card-item-color-lump_text">
                                    库存总量
                                </p>
                            </div>
                        </el-col>
                    </el-row>
                    <div class="card-item-color-lump_text">
                        <p class="card-item-color-lump_text__title">
                            <em class="card-item-color-lump_text__icon" />
                            <span>库存明细</span>
                            <el-button v-if="isAuth('kjm:pulpIn:save')" type="primary" size="small" style="margin-left: 10px;" @click="goParn(item)">
                                入罐
                            </el-button>
                        </p>
                        <el-table :data="item.pulpList" header-row-class-name="card-item-color-lump_text__table__head" class="card-item-color-lump_text__table" height="165">
                            <el-table-column
                                prop="batch"
                                width="auto"
                            >
                                <template slot="header">
                                    <em class="iconfont factory-pici" style="margin-right: 5px;" />批次
                                </template>
                            </el-table-column>
                            <el-table-column prop="currentQuantity" width="auto" header-align="left">
                                <template slot="header">
                                    <em class="iconfont factory-shuliang" style=" margin-right: 5px; font-size: 18px;" />数量
                                </template>
                                <template slot-scope="scope">
                                    {{ (scope.row.amount * 1).toLocaleString() }}
                                    KG
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-dialog :close-on-click-modal="false" :visible.sync="isShowMessageBoxCheck" width="400px" custom-class="dialog__class" @close="closeInParnDialog()">
            <div slot="title" class="title">
                <span>豆粕罐入罐</span>
            </div>
            <div>
                <el-form ref="inParnForm" :model="inParnForm" label-width="100px" size="small">
                    <el-form-item
                        label="领用粮仓："
                        required
                        prop="foodHolderId"
                        :rules="[
                            {
                                required: true,
                                message: '请选择领用粮仓',
                                trigger: 'blur',
                            },
                        ]"
                    >
                        <el-select v-model="inParnForm.foodHolderId" placeholder="请选择" style="width: 220px;" @change="changeInParnHolderOptions(inParnForm.foodHolderId)">
                            <el-option v-for="sole in inParnHolder" :key="sole.deptId + sole.holderId" :label="sole.holderName" :value="sole.holderId" />
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        label="批次："
                        required
                        prop="batch"
                        :rules="[
                            {
                                required: true,
                                message: '请选择批次',
                                trigger: 'blur',
                            },
                        ]"
                    >
                        <el-select v-model="inParnForm.batch" placeholder="请选择" style="width: 220px;" @change="changeInParnBatchOptions(inParnForm.foodHolderId, inParnForm.batch)">
                            <el-option v-for="sole in inParn.holdList" :key="sole.batch" :label="sole.batch" :value="sole.batch" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="物料：">
                        <template>
                            <p class="disabled-text" style="width: 220px;">
                                {{ inParnForm.materialName + ' ' + inParnForm.materialCode }}
                            </p>
                        </template>
                    </el-form-item>
                    <el-form-item label="剩余数：" :disabled="true">
                        <template>
                            <p class="disabled-text" style="width: 220px;">
                                {{ inParnForm.currentQuantity }}
                            </p>
                        </template>
                    </el-form-item>
                    <el-form-item
                        label="起始数："
                        prop="startWeight"
                        :rules="[
                            {
                                required: true,
                                validator: validateCheckStartWeight,
                                message: '起始数不可大于等于结束数',
                                trigger: 'blur',
                            },
                        ]"
                    >
                        <el-input v-model.number="inParnForm.startWeight" type="text" style="width: 220px;" :disabled="isInputWeight" @change="countWeight('startWeight')">
                            <em slot="suffix">KG</em>
                        </el-input>
                    </el-form-item>
                    <el-form-item
                        label="结束数："
                        prop="endWeight"
                        :rules="[
                            {
                                required: true,
                                validator: validateCheckEndWeight,
                                message: '结束数不可小于等于起始数',
                                trigger: 'blur',
                            },
                        ]"
                    >
                        <el-input v-model.number="inParnForm.endWeight" type="text" style="width: 220px;" :disabled="isInputWeight" @change="countWeight('endWeight')">
                            <em slot="suffix">KG</em>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="领用数量：">
                        <template>
                            <p class="disabled-text" style="width: 220px;">
                                {{ inParnForm.useWeight }} KG
                            </p>
                        </template>
                    </el-form-item>
                    <el-form-item label="操作时间：">
                        <p class="disabled-text" style="width: 220px;">
                            {{ inParnForm.changed }}
                        </p>
                    </el-form-item>
                    <el-form-item label="操作人：">
                        <p class="disabled-text" style="width: 220px;">
                            {{ inParnForm.changer }}
                        </p>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" style="color: #000; background-color: #fff; border-color: #d9d9d9;" @click="cannalInParn('inParnForm')">
                    取消
                </el-button>
                <el-button type="primary" size="small" style=" color: #fff; background-color: #1890ff; border-color: #1890ff;" @click="saveInParn('inParnForm')">
                    确定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { BASICDATA_API, MEASUREBARN_BEAN_API } from '@/api/api';
import { isAuth } from '../../../../../net/validate';
import MSG from '@/assets/js/hint-msg';
import { dateFormat } from '@/net/validate.js';
export default {
    name: 'MeasureBarnBeanPulpIndex',
    // NEEDTODO
    components: {
        // realName: {
        //     get() {
        //         return this.$store.state.user.realName;
        //     }
        // }
    },
    data() {
        return {
            factoryList: [],
            workshopList: [],
            plantList: {
                factoryIDValue: '',
                workshopIDValue: ''
            },
            dataList: [],
            oriAPIData: [],
            isShowMessageBoxCheck: false,
            isInputWeight: true,
            inParnForm: {
                foodHolderId: '',
                batch: '',
                materialCode: '',
                materialName: '',
                currentQuantity: 0,
                startWeight: 0,
                endWeight: 0,
                // pulpBatch: '',
                pulpHolderId: '',
                useWeight: 0,
                unit: 'KG',
                changed: '',
                changer: this.$store.state.user.realName + '（' + this.$store.state.user.name + '）'
            },
            inParnHolder: [], // API 进来数据
            inParn: {
                holderId: '',
                pulpBatch: '',
                holdList: [],
                startWeight: 0,
                endWeight: 0,
                finishWeight: this.endWeight - this.endWeight
            }
        };
    },
    computed: {
        // countWeight: function () {
        //   return Number(this.endWeight) - Number(this.startWeight)
        // },
        isMainAreaShow: function() {
            return this.dataList.length !== 0;
        },
        sumBatch: function() {
            return function(items) {
                let sum = 0;
                items.forEach(item => {
                    sum = sum + Number(item.amount);
                });
                return sum;
            };
        },
        mainTabs: {
            get() {
                return this.$store.state.common.mainTabs;
            },
            set(val) {
                this.$store.commit('common/updateMainTabs', val);
            }
        },
        targetAugs: {
            get() {
                return this.$store.state.common.BeanPulp;
            },
            set(val) {
                this.$store.commit('common/updateMeasureBarnBeanPulp', val);
            }
        }
    },
    mounted() {
        this.getOriDataFromAPI().then(() => {
            // 初始化搜寻条件
            this.plantList.factoryIDValue = this.oriAPIData[0].deptId;
            if (this.oriAPIData[0].workshop.length !== 0) {
                this.workshopList = this.oriAPIData[0].workshop;
                this.plantList.workshopIDValue = this.oriAPIData[0].workshop[0].deptId;
            } else {
                this.workshopList = [];
                this.plantList.workshopIDValue = '';
            }
        });
    },
    methods: {
        closeInParnDialog() {
            this.inParn.holdList = [];
            this.inParnForm.foodHolderId = '';
            this.inParnForm.batch = '';
            this.inParnForm.materialCode = '';
            this.inParnForm.materialName = '';
            this.inParnForm.currentQuantity = 0;
            this.inParnForm.startWeight = 0;
            this.inParnForm.endWeight = 0;
            this.inParnForm.useWeight = 0;
            this.cannalInParn('inParnForm');
        },
        validateCheckStartWeight(rule, value, callback) {
            if (value >= this.inParnForm.endWeight) {
                return callback(new Error('起始数不可大于等于结束数'));
            }
                callback();

        },
        validateCheckEndWeight(rule, value, callback) {
            if (value <= this.inParnForm.startWeight) {
                return callback(new Error('结束数不可小于等于起始数'));
            }
                callback();

        },
        countWeight(flag) {
            if (flag === 'startWeight') {
                this.inParnForm.endWeight = this.inParnForm.startWeight + 1;
            }
            this.inParnForm.useWeight = this.inParnForm.endWeight - this.inParnForm.startWeight;
        },
        // 改变选单数据
        changeSearchOptions(flag) {
            const item = this.oriAPIData.find(ele => ele.deptId === flag);
            if (item.workshop.length !== 0) {
                this.workshopList = item.workshop;
            } else {
                this.workshopList = [];
                this.plantList.workshopIDValue = '';
            }
        },
        changeInParnHolderOptions(flag) {
            const item = this.inParnHolder.find(ele => ele.holderId === flag);

            this.isInputWeight = true;
            this.inParn.holdList = [];
            this.inParnForm.batch = '';
            this.inParnForm.materialCode = '';
            this.inParnForm.materialName = '';
            this.inParnForm.currentQuantity = 0;
            this.inParnForm.startWeight = 0;
            this.inParnForm.endWeight = 0;
            if (item.pulpData.length !== 0) {
                this.inParn.holdList = item.pulpData;
                // this.inParnForm.materialCode = item.pulpData
                // this.inParnForm.materialName = item.pulpData
            } else {
                this.inParn.holdList = [];
                this.inParnForm.batch = '';
            }
        },
        changeInParnBatchOptions(holder, batch) {
            const item = this.inParnHolder.find(ele => ele.holderId === holder);
            if (item.pulpData.length !== 0) {
                this.isInputWeight = false;
                const itemW = item.pulpData.find(ele => ele.batch === batch);
                // this.inParn.holdList = item.pulpData
                this.inParnForm.materialCode = itemW.materialCode;
                this.inParnForm.materialName = itemW.materialName;
                this.inParnForm.currentQuantity = itemW.currentQuantity;
            } else {
                // this.inParn.holdList = []
                this.isInputWeight = true;
                this.inParnForm.materialCode = '';
                this.inParnForm.materialName = '';
                this.inParnForm.currentQuantity = 0;
            }
        },
        goParn(item) {
            this.plantList.factoryIDValue = item.factory;
            this.plantList.workshopIDValue = item.deptId;
            this.isShowMessageBoxCheck = true;
            this.inParnForm.pulpHolderId = item.holderId;
            this.$http(`${MEASUREBARN_BEAN_API.BEANPULP_INPARN}`, 'POST', {
                factory: item.factory,
                workShop: item.deptId
            }).then(({ data }) => {
                if (data.code === 0) {
                    // console.log('data')
                    // console.log(data)
                    this.inParnHolder = [];
                    data.holder.map(subItem => {
                        this.inParnHolder.push({
                            deptId: subItem.deptId,
                            holderName: subItem.holderName,
                            holderId: subItem.holderId,
                            pulpData: subItem.pulpData
                        });
                    });
                    this.isInputWeight = true;
                    this.inParnForm.changed = dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
                    // this.inParnForm = data.holder

                    // console.log('this.inParnHolder')
                    // console.log(this.inParnHolder)
                } else {
                    this.$errorToast(data.msg);
                }
            });
            // let temp = {
            //   batch: '1902240101',
            //   changed: '2019-06-18 11:06:46',
            //   changer: 'SAP_SYNC',
            //   currentQuantity: 95945,
            //   endWeight: 21,
            //   foodHolderId: '3321240',
            //   materialCode: 'M020200001',
            //   materialName: '脱脂大豆1#',
            //   pulpHolderId: '7E0AA796139E46738A949E88E1272578',
            //   startWeight: 20,
            //   unit: 'KG',
            //   useWeight: 1
            // }
            // this.$http(`${MEASUREBARN_BEAN_API.BEANPULP_SAVE_INPARN}`, 'POST', temp).then(({data}) => {
            //   if (data.code === 0) {
            //     console.log('datadatadatadatadata')
            //     console.log(data)
            //   } else {
            //     this.$notify.error({title: '错误', message: data.msg})
            //   }
            // })
        },
        cannalInParn(formName) {
            this.$refs[formName].resetFields();
            this.inParn.holdList = [];
            this.inParnForm.foodHolderId = '';
            this.inParnForm.batch = '';
            this.inParnForm.materialCode = '';
            this.inParnForm.materialName = '';
            this.inParnForm.currentQuantity = 0;
            this.inParnForm.startWeight = 0;
            this.inParnForm.endWeight = 0;
            this.inParnForm.useWeight = 0;
            this.isShowMessageBoxCheck = false;
        },
        saveInParn(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    // this.inParnForm.pulpHolderId = this.dataList.holderId
                    this.$http(`${MEASUREBARN_BEAN_API.BEANPULP_SAVE_INPARN}`, 'POST', this.inParnForm).then(({ data }) => {
                        if (data.code === 0) {
                            this.$notify({
                                title: MSG.OPERATE.saveSuccess.title,
                                message: MSG.OPERATE.saveSuccess.message,
                                type: 'success'
                            });
                            this.inParnForm.foodHolderId = '';
                            this.inParnForm.batch = '';
                            this.inParnForm.materialCode = '';
                            this.inParnForm.materialName = '';
                            this.inParnForm.currentQuantity = 0;
                            this.inParnForm.startWeight = 0;
                            this.inParnForm.endWeight = 0;
                            this.inParnForm.useWeight = 0;
                            this.isShowMessageBoxCheck = false;
                            this.$refs[formName].resetFields();
                            this.getOrderList();
                        } else {
                            this.$errorToast(data.msg);
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        // 获取工厂
        getFactory() {
            return new Promise((resolve, reject) => {
                this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST', {}, false, false, false).then(({ data }) => {
                    if (data.code === 0) {
                        resolve(data.typeList);
                    } else {
                        this.$notify.error({
                            title: MSG.API.BeanPulp.getFactoryError.title,
                            message: data.msg
                        });
                        reject(data.msg);
                    }
                });
            });
        },
        // 根据工厂获车间
        getWorkshop(id) {
            return new Promise((resolve, reject) => {
                this.plantList.workshopIDValue = '';
                this.workshopList = [];
                if (id) {
                    this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', { deptId: id, deptName: '制曲' }, false, false, false).then(({ data }) => {
                        if (data.code === 0) {
                            resolve(data.typeList);
                        } else {
                            this.$notify.error({
                                title: MSG.API.BeanPulp.getWorkshopError.title,
                                message: data.msg
                            });
                            reject(data.msg);
                        }
                    });
                }
            });
        },
        // 获取工厂车间
        getOriDataFromAPI() {
            return new Promise((resolve) => {
                this.getFactory().then(valueFactory => {
                    this.oriAPIData = [];
                    this.factoryList = [];
                    for (let i = 0; i < valueFactory.length; i++) {
                        const dataTempF = {
                            deptId: valueFactory[i].deptId,
                            deptName: valueFactory[i].deptName,
                            workshop: []
                        };
                        this.factoryList.push({
                            deptId: valueFactory[i].deptId,
                            deptName: valueFactory[i].deptName
                        });
                        this.getWorkshop(valueFactory[i].deptId).then(valueWorkshop => {
                            if (valueWorkshop.length !== 0) {
                                for (let j = 0; j < valueWorkshop.length; j++) {
                                    const dataTempW = {
                                        deptId: valueWorkshop[j].deptId,
                                        deptName: valueWorkshop[j].deptName
                                    };
                                    dataTempF.workshop.push(dataTempW);
                                }
                            }
                            this.oriAPIData.push(dataTempF);
                            resolve();
                        });
                    }
                });
            });
        },
        // 获取列表
        getOrderList() {
            this.dataList = [];
            if (!this.plantList.factoryIDValue) {
                this.$warningToast('请选择工厂');
                return;
            }
            this.$http(`${MEASUREBARN_BEAN_API.BEANPULP_POT_LIST}`, 'POST', {
                factory: this.plantList.factoryIDValue,
                workShop: this.plantList.workshopIDValue
            }).then(({ data }) => {
                if (data.code === 0) {
                    if (data.infoList.length !== 0) {
                        this.dataList = data.infoList;
                    } else {
                        this.$notify.info({
                            title: MSG.API.BeanPulp.searchResult.title,
                            message: MSG.API.BeanPulp.searchResult.message
                        });
                    }
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 去详请
        goTargetDetail(item) {
            if (!isAuth('realTime:pulp:pulpMeasuringBin')) {
                this.$notify.error({
                    title: MSG.AUTH.noAuthority.title,
                    message: MSG.AUTH.noAuthority.message
                });
                return;
            }
            // ！！！！！！此部份逻辑不一样会需要送不同参数！！！！！！
            this.targetAugs = {
                holderId: item.holderId,
                factory: this.plantList.factoryIDValue,
                deptId: this.plantList.workshopIDValue
            };
            this.$store.state.common.MeasureBarnBeanPulp = item;
            this.mainTabs = this.mainTabs.filter(subItem => subItem.name !== 'MDS-views-page-DataEntry-MeasureBarn-BeanPulp-DataEntryIndex');
            setTimeout(() => {
                this.$router.push({
                    name: `MDS-views-page-DataEntry-MeasureBarn-BeanPulp-DataEntryIndex`
                });
            }, 100);
        }
    }
};
</script>

<style lang="scss"></style>
