<template>
    <div>
        <el-row style="padding: 0 11px;">
            <el-col :span="24">
                <el-card class="box-card" style="margin: 10px 0;">
                    <div class="hello-box">
                        <div><img src="~common/img/man.png" alt="" style="width: 66px;"></div>
                        <div>
                            <div style="color: rgba(0, 0, 0, 0.85); font-weight: 600; font-size: 1.2rem;">
                                曲丽丽,祝你开心每一天
                            </div>
                            <div style="justify-content: flex-end; padding-top: 5px; color: rgba(0, 0, 0, 0.45); font-size: 0.8rem;">
                                UI/UX设计工程师 | 数字化产品研发组(对内)-系统运维组
                            </div>
                        </div>
                        <div class="info-number">
                            <span>未读信息</span> <span>{{ parseInt(unreadNum).toLocaleString() }}</span>
                        </div>
                        <div class="info-number">
                            <span>已读信息</span> <span>{{ parseInt(readNum).toLocaleString() }}</span>
                        </div>
                        <div class="info-number">
                            <span>总信息量</span> <span>{{ parseInt(totalNum).toLocaleString() }}</span>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="11" style="padding: 0 11px;">
            <el-col :span="12">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <i class="iconfont factory-24_fayanduihualiuyan" style=" color: #3889ff; font-size: 20px;" /><span>未读消息</span>
                    </div>

                    <div :style="{minHeight:mainClientHeight-300 + 'px'}">
                        <template class="">
                            <ul>
                                <li class="message-item">
                                    <div class="message-item__img">
                                        <span class="round-bg"><i class="el-icon-edit" /></span>
                                    </div>
                                    <div class="message-item__infomation">
                                        <div class="message-item__topic">
                                            杀菌车间消息
                                        </div>
                                        <div class="message-item__content">
                                            <span>71100000234213生产数</span>
                                            <span class="message-item__date">2020-12-01 12:23</span>
                                        </div>
                                    </div>
                                </li>
                                <li class="message-item">
                                    <div class="message-item__img">
                                        <span class="round-bg"><i class="el-icon-edit" /></span>
                                    </div>
                                    <div class="message-item__infomation">
                                        <div class="message-item__topic">
                                            杀菌车间消息
                                        </div>
                                        <div class="message-item__content">
                                            <span>71100000234213生产数</span>
                                            <span class="message-item__date">2020-12-01 12:23</span>
                                        </div>
                                    </div>
                                </li>
                                <li class="message-item">
                                    <div class="message-item__img">
                                        <span class="round-bg"><i class="el-icon-edit" /></span>
                                    </div>
                                    <div class="message-item__infomation">
                                        <div class="message-item__topic">
                                            杀菌车间消息
                                        </div>
                                        <div class="message-item__content">
                                            <span>71100000234213生产数</span>
                                            <span class="message-item__date">2020-12-01 12:23</span>
                                        </div>
                                    </div>
                                </li>
                                <li class="message-item">
                                    <div class="message-item__img">
                                        <span class="round-bg"><i class="el-icon-edit" /></span>
                                    </div>
                                    <div class="message-item__infomation">
                                        <div class="message-item__topic">
                                            杀菌车间消息
                                        </div>
                                        <div class="message-item__content">
                                            <span>71100000234213生产数</span>
                                            <span class="message-item__date">2020-12-01 12:23</span>
                                        </div>
                                    </div>
                                </li>
                                <li class="message-item">
                                    <div class="message-item__img">
                                        <span class="round-bg"><i class="el-icon-edit" /></span>
                                    </div>
                                    <div class="message-item__infomation">
                                        <div class="message-item__topic">
                                            杀菌车间消息
                                        </div>
                                        <div class="message-item__content">
                                            <span>71100000234213生产数</span>
                                            <span class="message-item__date">2020-12-01 12:23</span>
                                        </div>
                                    </div>
                                </li>
                                <li class="message-item">
                                    <div class="message-item__img">
                                        <span class="round-bg"><i class="el-icon-edit" /></span>
                                    </div>
                                    <div class="message-item__infomation">
                                        <div class="message-item__topic">
                                            杀菌车间消息
                                        </div>
                                        <div class="message-item__content">
                                            <span>71100000234213生产数</span>
                                            <span class="message-item__date">2020-12-01 12:23</span>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </template>
                    </div>
                    <el-pagination :current-page="currPageFromParent" :page-sizes="[10, 20, 50]" :page-size="pageSizeFromParent" layout="total, prev, pager, next, jumper" :total="totalCountFromParent" @size-change="handlePageSizeChangeFromMain" @current-change="handleCurrentPageChangeFromMain" />
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <i class="iconfont factory-15_jiefeng" style=" color: #3889ff; font-size: 20px;" /><span>已读消息</span>
                        <el-button style="float: right; margin-left: 7px; padding: 3px 0;" type="text">
                            近30天
                        </el-button>
                        <el-button style="float: right; padding: 3px 0;" type="text">
                            近7天
                        </el-button>
                        <el-button style="float: right; padding: 3px 0;" type="text">
                            近2天
                        </el-button>
                    </div>
                    <div :style="{minHeight:mainClientHeight-300 + 'px'}">
                        <template class="">
                            <ul>
                                <li class="message-item">
                                    <div class="message-item__img">
                                        <span class="round-bg"><i class="el-icon-edit" /></span>
                                    </div>
                                    <div class="message-item__infomation">
                                        <div class="message-item__topic">
                                            杀菌车间消息
                                        </div>
                                        <div class="message-item__content">
                                            <span>71100000234213生产数</span>
                                            <span class="message-item__date">2020-12-01 12:23</span>
                                        </div>
                                    </div>
                                </li>
                                <li class="message-item">
                                    <div class="message-item__img">
                                        <span class="round-bg"><i class="el-icon-edit" /></span>
                                    </div>
                                    <div class="message-item__infomation">
                                        <div class="message-item__topic">
                                            杀菌车间消息
                                        </div>
                                        <div class="message-item__content">
                                            <span>71100000234213生产数</span>
                                            <span class="message-item__date">2020-12-01 12:23</span>
                                        </div>
                                    </div>
                                </li>
                                <li class="message-item">
                                    <div class="message-item__img">
                                        <span class="round-bg"><i class="el-icon-edit" /></span>
                                    </div>
                                    <div class="message-item__infomation">
                                        <div class="message-item__topic">
                                            杀菌车间消息
                                        </div>
                                        <div class="message-item__content">
                                            <span>71100000234213生产数</span>
                                            <span class="message-item__date">2020-12-01 12:23</span>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </template>
                    </div>
                    <el-pagination :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="totalCount" @size-change="handlePageSizeChange" @current-change="handleCurrentPageChange" />
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    // import { COMMON_API, PKG_API } from 'common/api/api';
    // import { getS3Img, dateFormat } from 'utils/utils';

    @Component({
        components: {
        }
    })
    export default class PackagingIndex extends Vue {
        totalCountFromParent = 1
        currPageFromParent = 1
        pageSizeFromParent = 10
        totalCount = 1
        currPage = 1
        pageSize = 10

        unreadNum=156
        readNum=8111
        totalNum=2223

        //  设置类型參數
        getChildItemListFromChange(): void {

                    // COMMON_API.DICTIONARY_ITEM_QUERY_API({
                    //     // factory: this.tempParentRow.factory,
                    //     dictId: this.tempParentRow.id,
                    //     size: this.pageSize,
                    //     current: this.currPage
                    // }).then(({ data }) => {
                    //     this.isFocusChild = true;
                    //     // this.currentFocusChildRow = row.id;
                    //     console.log('我是清单回传值')
                    //     if (data.data.records.length !== 0) {
                    //         this.targetParameterList = data.data.records;
                    //     } else {
                    //         this.targetParameterList = [];
                    //     }
                    //     this.totalCount = data.data.total;
                    //     this.currPage = data.data.current;
                    //     this.pageSize = data.data.size;
                    // });
        }

        // 获取类型
        getParentItemsList(): void {
            // if (haveParas) {
            //     this.currPageFromParent = 1;
            // }
            // const parasObj = {
            //     factory: this.factoryForSearch,
            //     typeOrName: this.stringForSearch,
            //     current: this.currPageFromParent,
            //     size: this.pageSizeFromParent
            // }
            // COMMON_API.DICTIONARY_QUERY_API(parasObj).then(({ data }) => {
            //     this.isFocusChild = false; // 判断左右边 focus
            //     this.targetInfoList = data.data.records; // parent table data
            //     this.targetParameterList = []; // child table data
            //     // this.preDaraArray = parasObj;
            //     this.totalCountFromParent = data.data.total;
            //     this.currPageFromParent = data.data.current;
            //     this.pageSizeFromParent = data.data.size;

            // });
        }


        // 改变每页条数
        handlePageSizeChangeFromMain(val: number): void {
            this.pageSizeFromParent = val;
            this.getParentItemsList();
        }

        // 跳转页数
        handleCurrentPageChangeFromMain(val: number): void {
            this.currPageFromParent = val;
            this.getParentItemsList();
        }

        // 改变每页条数
        handlePageSizeChange(val: number): void {
            this.pageSize = val;
            this.getChildItemListFromChange();
        }

        // 跳转页数
        handleCurrentPageChange(val: number): void {
            this.currPage = val;
            this.getChildItemListFromChange();
        }

        get mainClientHeight() {
            return this.$store.state.common.mainClientHeight;
        }

        get gender() {
            return this.$store.state.user.gender
        }
    }

</script>

<style lang="scss" scoped>
@import "common/scss/_variables.scss";
$icon-bg-color:#f05c4a,#333,#147fe7,#5bd171,#ffbf00;
$repeat: length($icon-bg-color);  // How often you want the pattern to repeat.

.el-card__header {
    padding: 10px;
}

.hello-box {
    display: flex;
    flex-direction: row;
    div:nth-child(1) {
        flex-grow: 1;
    }
    div:nth-child(2) {
        display: flex;
        flex-direction: column;
        flex-grow: 15;
        justify-content: space-between;
    }
    div:nth-child(3) {
        position: relative;
        flex-grow: 2;
        align-items: flex-end;
        &::after {
            position: absolute;
            top: 0;
            right: -2rem;
            height: 40px;
            border-right: 1px #e9e9e9 solid;
            content: "";
        }
    }
    div:nth-child(4) {
        position: relative;
        flex-grow: 2;
        align-items: flex-end;
        &::after {
            position: absolute;
            top: 0;
            right: -2rem;
            height: 40px;
            border-right: 1px #e9e9e9 solid;
            content: "";
        }
    }
    div:nth-child(5) {
        flex-grow: 2;
        align-items: flex-end;
    }
}
.info-number {
    display: flex;
    flex-direction: column;
    span:nth-child(1) {
        align-items: flex-end;
        margin-bottom: 10px;
        color: #999;
        font-size: 0.7rem;
    }
    span:nth-child(2) {
        align-items: flex-end;
        font-size: 1.7rem;
    }
}

h4 {
    padding: 14px 0;
    border-bottom: 1px #e8e8e8 solid;
}
.message-item {
    display: flex;
    padding: 10px 0 9px 0;
    border-bottom: 1px #e8e8e8 solid;

    .message-item__img {
        flex-grow: 1;
        .round-bg {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            color: #fff;
            // background: nth($icon-bg-color, random(length($icon-bg-color)));
            border-radius: 32px;
        }
    }
    .message-item__infomation {
        flex-grow: 9;
        .message-item__topic {
            margin-bottom: 7px;
            font-weight: 600;
            font-size: 1rem;
        }
        .message-item__content {
            display: flex;
            justify-content: space-between;
        }
    }
}

@for $i from 1 through $repeat {
    li.message-item:nth-child(#{length($icon-bg-color)}n+#{$i}) .round-bg {
        background: nth($icon-bg-color, $i);
    }
}

</style>
