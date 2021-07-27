<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            query-auth="beanQuery"
            :type="'home'"
            :query-form-data="queryFormData"
            :list-interface="getDataList"
            :custom-data="true"
            @created-end="createdEnd"
            @get-data-success="setData"
        >
            <template slot="home">
                <el-table class="newTable" header-row-class-name="tableHead" :data="materialGroupList" @selection-change="selectionChange">
                    <el-table-column type="selection" />
                    <el-table-column type="index" label="序号" />
                    <el-table-column label="物料组" align="center">
                        <template slot-scope="scope">
                            {{ scope.row.materialGroupName + ' ' + scope.row.materialGroupCode }}
                        </template>
                    </el-table-column>
                    <el-table-column label="物料类型" prop="materialTypeName" align="center" />
                    <el-table-column label="图片" align="center">
                        <template slot-scope="scope">
                            <!-- <img :src="" alt="" style="height: 60px;"> -->
                            <image-comp :ref="'imageCompRef' + scope.$index" :s3-path="scope.row.s3Path" height="60px" />
                        </template>
                    </el-table-column>
                    <el-table-column label="更新人" prop="changer" align="center" />
                    <el-table-column label="更新时间" prop="changed" align="center" />
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="updatePic(scope.row, scope.$index)">
                                更新图片
                            </el-button>
                            <el-button type="text" size="small" style="margin-left: 10px;" @click="downloadPic(scope.row, scope.$index)">
                                下载图片
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <template slot="mds-button">
                <el-button type="primary" size="small" @click="addHandler">
                    新增
                </el-button>
                <el-button type="danger" size="small" @click="batchDelete">
                    批量删除
                </el-button>
            </template>
        </query-table>
        <el-row>
            <el-pagination :current-page.sync="currentPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="sizeChangeHandler" @current-change="currentPageChangeHanlder" />
        </el-row>
        <el-dialog :visible.sync="addDialog" :title="isAdd ? '新增物料组' : '编辑物料组'" width="400px" @close="cancelHandler">
            <el-form ref="addFormRef" :model="addForm" :rules="rules" size="small" label-width="100px" label-suffix="：">
                <el-form-item label="物料类型" prop="materialGroupType">
                    <el-select v-model="addForm.materialGroupType" :disabled="!isAdd" clearable filterable size="small" style="width: 238px;" @change="groupChange">
                        <el-option v-for="item in materialTypeList" :key="item.materialTypeCode" :label="`${item.materialTypeName} ${item.materialTypeCode}`" :value="item.materialTypeCode" />
                    </el-select>
                </el-form-item>
                <el-form-item label="物料组" prop="materialGroupCode">
                    <el-select v-model="addForm.materialGroupCode" :disabled="!isAdd" clearable filterable size="small" style="width: 238px;">
                        <el-option v-for="item in materialGroupDropList" :key="item.materialCode" :label="`${item.materialName} ${item.materialCode}`" :value="item.materialCode" />
                    </el-select>
                </el-form-item>
                <el-form-item ref="s3PathRef" label="图片上传" prop="s3Path">
                    <el-upload
                        ref="imgUpload"
                        class="upload-demo"
                        action=""
                        :limit="1"
                        :show-file-list="false"
                        :http-request="httpRequest"
                        :on-success="addfile"
                    >
                        <el-button size="small" type="default" icon="el-icon-upload2" style="width: 172px;">
                            上传附件
                        </el-button>
                        <el-button size="small" type="danger" @click="removePic">
                            删除
                        </el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="预览">
                    <div class="review">
                        <img :src="imgUrl" alt="">
                    </div>
                </el-form-item>
                <el-form-item>
                    <div class="btn-box">
                        <el-button size="small" @click="cancelHandler">
                            取消
                        </el-button>
                        <el-button type="primary" size="small" style="margin-right: 22px;" @click="sureHandler">
                            确定
                        </el-button>
                    </div>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, STOCK_API } from 'common/api/api';
    import axios from 'axios';
    import ImageComp from '../components/imageComp.vue'
    @Component({
        name: 'MaterialGroup',
        components: {
            ImageComp
        }
    })
    export default class MaterialGroup extends Vue {

        $refs: {
            queryTable: HTMLFormElement;
            imgUpload: HTMLFormElement;
            addFormRef: HTMLFormElement;
            s3PathRef: HTMLFormElement;
            // imageCompRef: HTMLFormElement;
        };

        materialGroupList: RowDataType[] = [];
        selections: RowDataType[] = [];
        addDialog = false;
        isAdd = true;
        addForm: RowDataType = {};
        imgUrl = '';
        materialTypeList: MaterialTypeList[] = [];
        materialGroupDropList: MaterialGroupDropType[] = []
        currentPage = 1;
        pageSize = 10;
        total = 0;

        rules = {
            materialGroupType: [
                { required: true, message: '请选择', trigger: 'change' }
            ],
            materialGroupCode: [
                { required: true, message: '请选择', trigger: 'change' }
            ],
            s3Path: [
                { required: true, message: '请上传', trigger: 'change' }
            ]
        }

        queryFormData = [
            {
                type: 'select',
                label: '物料类型',
                prop: 'materialGroupType',
                labelWidth: 90,
                filterable: true,
                defaultValue: '',
                rule: [
                    { required: false, message: '请选择车间', trigger: 'change' }
                ],
                defaultOptionsFn: () => {
                    // return COMMON_API.DICTIONARY_ITEM_DROPDOWN_POST_API({
                    //     // factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                    //     factory: 'common',
                    //     dictType: 'COMMON_MATERIAL_TYPE'
                    // })
                    return new Promise(resolve => {
                        STOCK_API.STOCK_MATERIAL_GROUP_STORAGE_API({}).then(res => {
                            const result = res.data.data.reduce((pre, cur) => {
                                const obj = pre.find(item => item.materialTypeCode === cur.materialTypeCode)
                                if (obj) {
                                    obj.children.push(cur)
                                    return pre
                                }
                                pre.push({
                                    ...cur,
                                    children: [cur]
                                })
                                return pre
                            }, [])
                            resolve({
                                data: {
                                    data: result
                                }
                            })
                        })
                    })
                },
                resVal: {
                    resData: 'data',
                    label: ['materialTypeName', 'materialTypeCode'],
                    value: 'materialTypeCode'
                },
                linkageProp: ['materialGroupCode']
            },
            {
                type: 'select',
                label: '物料组',
                prop: 'materialGroupCode',
                labelWidth: 90,
                filterable: true,
                defaultValue: '',
                rule: [
                    { required: false, message: '请选择物料组', trigger: 'change' }
                ],
                // defaultOptionsFn: () => {
                //     return STOCK_API.STOCK_MATERIAL_GROUP_STORAGE_API({})
                // },
                optionsFn: (v, v2, origin) => {
                    return new Promise((resolve, reject) => {
                        try {
                            const list = origin.find(item => item.materialTypeCode === v).children
                            resolve({
                                data: {
                                    data: list
                                }
                            })
                        } catch (error) {
                            reject(error)
                        }
                    })
                },
                resVal: {
                    resData: 'data',
                    label: ['materialName', 'materialCode'],
                    value: 'materialCode'
                }
            }
        ]

        createdEnd() {
            this.getQueryDropList()
            // this.$nextTick(() => {
            //     // if (this.$refs.queryTable.queryForm.workShop !== '' && this.$refs.queryTable.queryForm.productDate !== '') {
            //     //     this.$refs.queryTable.getDataList(true)
            //     // }
            // })
        }

        mounted() {
            this.getQueryDropList()
            this.$refs.queryTable.getDataList(true)
        }

        getQueryDropList() {
            STOCK_API.STOCK_MATERIAL_GROUP_STORAGE_API({}).then(res => {
                const result = res.data.data.reduce((pre, cur) => {
                    const obj = pre.find(item => item.materialTypeCode === cur.materialTypeCode)
                    if (obj) {
                        obj.children.push(cur)
                        return pre
                    }
                    pre.push({
                        ...cur,
                        children: [cur]
                    })
                    return pre
                }, [])
                this.materialTypeList = result;
            })
            // COMMON_API.DICTIONARY_ITEM_DROPDOWN_POST_API({
            //     factory: 'common',
            //     dictType: 'COMMON_MATERIAL_TYPE'
            // }).then(res => {
            //     this.materialTypeList = res.data.data;
            // })
            // STOCK_API.STOCK_MATERIAL_GROUP_STORAGE_API({}).then(res => {
            //     this.materialGroupDropList = res.data.data
            // })
        }

        groupChange(v) {
            const obj = this.materialTypeList.find(row => row.materialTypeCode === v)
            if (obj) {
                this.materialGroupDropList = obj.children
            } else {
                this.materialGroupDropList = []
            }
            this.$set(this.addForm, 'materialGroupCode', '')
        }

        getDataList(params) {
            params.current = this.currentPage
            params.size = this.pageSize
            params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id
            return STOCK_API.STOCK_MATERIAL_GROUP_QUERY_API(params)
        }

        setData(data) {
            this.materialGroupList = data.data.records
            this.total = data.data.total
        }

        addHandler() {
            this.addForm = {}
            this.imgUrl = ''
            this.addDialog = true;
            this.isAdd = true
            this.$nextTick(() => {
                this.$refs.imgUpload.clearFiles()
            })
        }

        // 上传图片前
        httpRequest(options) {
            COMMON_API.UPLOADFILE_API({
                name: options.file.name
            }).then(({ data }) => {
                if (data.code === 200) {
                    axios.put(data.data.url, options.file).then(res => {
                        if (res.status === 200) {
                            options.onSuccess(data.data.key, options);
                        }
                    })
                }
            });
        }

        // 上传图片后
        addfile(key, options) {
            this.addForm.s3Path = key
            this.imgUrl = URL.createObjectURL(options.raw)
            this.$refs.s3PathRef.clearValidate()
        }

        removePic(e: Event) {
            e.stopPropagation()
            e.preventDefault()
            this.imgUrl = ''
            this.addForm.s3Path = ''
            this.$refs.imgUpload.clearFiles()
        }

        updatePic(row, index) {
            this.imgUrl = this.$refs['imageCompRef' + index].url
            this.isAdd = false
            this.addDialog = true
            this.addForm = { ...row }
        }

        cancelHandler() {
            this.addDialog = false
            this.$refs.addFormRef.resetFields()
        }

        sureHandler() {
            // this.$refs.addFormRef.clearValidate()
            this.$refs.addFormRef.validate(() => {
                for (const key in this.rules) {
                    if (this.addForm.s3Path) {
                        this.$refs.s3PathRef.clearValidate()
                    }
                    if (!this.addForm[key]) {
                        return false
                    }
                }
                let type = 'STOCK_MATERIAL_GROUP_SAVE_API'
                if (!this.isAdd) {
                    type = 'STOCK_MATERIAL_GROUP_UPDATE_API'
                }
                // TODO: 修改以下物料组名称
                this.addForm.materialGroupName = this.materialGroupDropList.find(item => item.materialCode === this.addForm.materialGroupCode)?.materialName
                STOCK_API[type](this.addForm).then(res => {
                    this.$successToast(res.data.msg)
                    this.currentPage = 1
                    this.$refs.queryTable.getDataList()
                    this.$refs.addFormRef.resetFields()
                    this.addDialog = false
                })
            })
        }

        selectionChange(selection) {
            this.selections = selection
        }

        batchDelete() {
            if (!this.selections.length) {
                this.$warningToast('请选择物料组')
                return
            }
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                STOCK_API.STOCK_MATERIAL_GROUP_DELETE_API(this.selections.map(item => item.id)).then(res => {
                    this.$successToast(res.data.msg);
                    this.currentPage = 1
                    this.$refs.queryTable.getDataList();
                })
            });
        }

        downloadPic(row, index) {
            console.log(row)
            const imgsrc = this.$refs['imageCompRef' + index].url
            const a = document.createElement('a');
            const event = new MouseEvent('click');
            a.download = 'name';
            a.href = imgsrc;
            a.dispatchEvent(event);
            // const image = new Image();
            // // 解决跨域 Canvas 污染问题
            // image.setAttribute('crossOrigin', 'anonymous')
            // image.onload = function() {
            //     const canvas = document.createElement('canvas');
            //     canvas.width = image.width;
            //     canvas.height = image.height;
            //     const context = canvas.getContext('2d')!; // eslint-disable-line
            //     context.drawImage(image, 0, 0, image.width, image.height);
            //     const url = canvas.toDataURL('image/png'); //得到图片的base64编码数据
            //     const a = document.createElement('a'); // 生成一个a元素
            //     const event = new MouseEvent('click'); // 创建一个单击事件
            //     a.download = 'photo'; // 设置图片名称
            //     a.href = url; // 将生成的URL设置为a.href属性
            //     a.dispatchEvent(event); // 触发a的单击事件
            // };
            // image.src = imgsrc;
        }

        sizeChangeHandler(val) {
            this.pageSize = val;
            this.$refs.queryTable.getDataList();
        }

        currentPageChangeHanlder(val) {
            this.currentPage = val;
            this.$refs.queryTable.getDataList();
        }
    }

    interface RowDataType {
        id?: string;
        s3Path?: string;
        materialGroupCode?: string;
        materialGroupName?: string;
        materialGroupType?: string;
    }
    interface MaterialTypeList {
        // id?: string;
        // dictCode?: string;
        // dictValue?: string;
        materialCode: string;
        materialName: string;
        materialTypeCode: string;
        materialTypeName: string;
        children: MaterialGroupDropType[];
    }

    interface MaterialGroupDropType {
        materialCode?: string;
        materialName?: string;
    }
</script>
<style lang="scss" scoped>
    .review {
        width: 238px;
        height: 160px;
        overflow: hidden;
        line-height: 160px;
        text-align: center;
        border: 1px solid #dcdfe6;
        img {
            height: 140px;
        }
    }
    .btn-box {
        display: flex;
        justify-content: flex-end;
        width: 100%;
        padding-bottom: 20px;
    }
</style>
