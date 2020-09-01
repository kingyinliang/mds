<template>
    <div class="message-area">
        <el-row style="padding: 0 11px;" class="message-header">
            <el-col :span="24">
                <el-card class="box-card" style="margin: 10px 0;">
                    <div class="hello-box">
                        <div>
                            <img v-if="gender==='M'" src="~common/img/man.png" alt="" style="width: 66px;">
                            <img v-else src="~common/img/feman.png" alt="" style="width: 66px;">
                        </div>
                        <div>
                            <div style=" height: 28px; margin-top: 2px; color: rgba(0, 0, 0, 0.85); font-weight: 600; font-size: 16px; line-height: 28px;">
                                {{ realName }}, 祝你开心每一天
                            </div>
                            <div style=" height: 22px; padding-top: 12px; color: rgba(0, 0, 0, 0.45); font-size: 12px; line-height: 22px;">
                                {{ post }} <span v-if="post!==''"> |</span> {{ deptName }}
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
        <div class="message-content">
            <el-card class="box-card">
                <div slot="header" class="clearfix" style=" height: 24px; line-height: 24px;">
                    <em class="iconfont factory-24_fayanduihualiuyan" style=" margin-top: 2px; color: #3889ff; font-size: 20px; vertical-align: middle;" /><span style=" font-weight: 600; font-size: 14px;">未读消息</span>
                    <el-button style="float: right; margin-left: 7px; padding: 3px 0; font-size: 14px;" type="text" :disabled="unreadList.length===0" @click="markReaded">
                        全部已读
                    </el-button>
                </div>

                <ul>
                    <li v-for="item in unreadList" :key="item.id" class="message-item" @click="seeMessage(item)">
                        <div class="message-item__img">
                            <span class="round-bg"><em class="iconfont" :class="item.icon" /></span>
                        </div>
                        <div class="message-item__infomation">
                            <div class="message-item__topic">
                                {{ item.workShopName }}
                            </div>
                            <div class="message-item__content">
                                <span>{{ item.msgContent }}</span>
                                <span class="message-item__date">{{ item.created.slice(0,-3) }}</span>
                            </div>
                        </div>
                    </li>
                </ul>

                <el-pagination v-if="unreadList.length!==0" :current-page="currPageFromUnread" :page-sizes="[10, 20, 50]" :page-size="pageSizeFromUnread" layout="prev, pager, next,sizes, jumper" :total="totalCountFromUnread" @size-change="handlePageSizeChangeFromUnread" @current-change="handleCurrentPageChangeFromUnread" />
            </el-card>
            <el-card class="box-card">
                <div slot="header" class="clearfix" style=" height: 24px; line-height: 24px;">
                    <em class="iconfont factory-15_jiefeng" style=" color: #3889ff; font-size: 20px; vertical-align: middle;" /><span style=" font-weight: 600; font-size: 14px;">已读消息</span>
                    <el-button style="float: right; margin-left: 7px; padding: 3px 0; font-size: 14px;" type="text" :disabled="readList.length===0|| readNumStyle===30" @click="readNumStyle=30;pageSizeFromRead = 10;currPageFromRead = 1;daysFlag=[0,0,1]; getMsgDataList(currPageFromRead, pageSizeFromRead, 1)">
                        近30天
                    </el-button>
                    <el-button style="float: right; padding: 3px 0; font-size: 14px;" type="text" :disabled="readList.length===0 || readNumStyle===7" @click="readNumStyle=7;pageSizeFromRead = 10;currPageFromRead = 1;daysFlag=[0,1,0]; getMsgDataList(currPageFromRead, pageSizeFromRead, 1)">
                        近7天
                    </el-button>
                    <el-button style="float: right; padding: 3px 0; font-size: 14px;" type="text" :disabled="readList.length===0 || readNumStyle===3" @click="readNumStyle=3;pageSizeFromRead = 10;currPageFromRead = 1;daysFlag=[1,0,0]; getMsgDataList(currPageFromRead, pageSizeFromRead, 1)">
                        近3天
                    </el-button>
                </div>

                <ul>
                    <li v-for="item in readList" :key="item.id" class="message-item" @click="seeMessage(item)">
                        <div class="message-item__img">
                            <span class="round-bg"><em class="iconfont" :class="item.icon" /></span>
                        </div>
                        <div class="message-item__infomation">
                            <div class="message-item__topic">
                                {{ item.workShopName }}
                            </div>
                            <div class="message-item__content">
                                <span>{{ item.msgContent }}</span>
                                <span class="message-item__date">{{ item.created.slice(0,-3) }}</span>
                            </div>
                        </div>
                    </li>
                </ul>

                <el-pagination v-if="readList.length!==0" :current-page="currPageFromRead" :page-sizes="[10, 20, 50]" :page-size="pageSizeFromRead" layout="prev, pager, next,sizes, jumper" :total="totalCountFromRead" @size-change="handlePageSizeChangeFromRead" @current-change="handleCurrentPageChangeFromRead" />
            </el-card>
        </div>
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Watch } from 'vue-property-decorator';
    import { MSG_API } from 'common/api/api';

    @Component({
        components: {
        }
    })
    export default class PackagingIndex extends Vue {

        totalCountFromRead = 1
        currPageFromRead = 1
        pageSizeFromRead = 10
        totalCountFromUnread = 1
        currPageFromUnread = 1
        pageSizeFromUnread = 10

        unreadNum=0
        readNum=0
        readNumStyle=3

        daysFlag=[0, 0, 0]
        readList: MessageObject[]=[]
        unreadList: MessageObject[]=[]
        loginUserId= sessionStorage.getItem('loginUserId')
        realName= sessionStorage.getItem('realName')
        post= sessionStorage.getItem('staff-post')
        deptName= sessionStorage.getItem('staff-location')
        gender= sessionStorage.getItem('gender')


        async mounted() {
            console.log('this.loginUserId')
            console.log(this.loginUserId)
            // await this.getIcon()
            setTimeout(() => {
                // 取已读、未读消息
                this.getMsgDataList(this.currPageFromUnread, this.pageSizeFromUnread, 0)
                this.getMsgDataList(this.currPageFromRead, this.pageSizeFromRead, 1)
            }, 500);
        }

        // 侦听消息是否有异动
        get updateMsgNum(): boolean {
            console.log('侦听到消息进来讯息')
            return this.$store.state.common.updateMsg;
        }

        @Watch('updateMsgNum', { immediate: true, deep: true })
        watchUpdateMsgNum(newStatus: boolean) {
            if (newStatus !== false) {
                this.getMsgDataList(this.currPageFromUnread, this.pageSizeFromUnread, 0)
            }
        }

        getMsgDataList(current, size, read): void {
            let daysFlagTemp = [0, 0, 0]
            if (read === 1) {
                daysFlagTemp = JSON.parse(JSON.stringify(this.daysFlag))
            }

            MSG_API.MSG_QUERY_API({
                current: current,
                size: size,
                read: read, // 已读标记,1:已读，0:未读
                threeDaysFlag: daysFlagTemp[0], // 3天标记，1:选中，0:未选中
                sevenDaysFlag: daysFlagTemp[1], // 7天标记，1:选中，0:未选中
                thirtyDaysFlag: daysFlagTemp[2], //30天标记，1:选中，0:未选中
                user: this.loginUserId // 登录用户id
            }).then(({ data }) => {
                if (read === 1) {
                    this.readList = data.data.records
                    this.readNum = data.data.total
                    this.totalCountFromRead = data.data.total
                } else {
                    this.unreadList = data.data.records
                    this.unreadNum = data.data.total
                    this.totalCountFromUnread = data.data.total
                }
            });
        }

        /**
         * @description: 跳转制目标 url
         * @param1: item {object} 该条 message object
         * @return: no
         */
        seeMessage(item) {
            console.log('item')
            console.log(item)
            if (!item.readed) {
                this.markThisReaded(item.msgId)
            }
            if (item.msgUrl !== '') {
                const targetURL = item.msgUrl.replace(/\//g, '-')

                if (this.$store.state.common.mainTabs.filter(element => element.name === targetURL).length !== 0) {
                    this.$store.commit('common/updateMainTabs', this.$store.state.common.mainTabs.filter(element => element.name !== targetURL));
                }

                setTimeout(() => {
                    this.$store.commit('common/updateMsg', true);
                    this.$router.push({
                        // targetURL + '?orderNo=' + item.orderNo
                        path: targetURL,
                        query: {
                            workShop: item.workShop,
                            orderNo: item.orderNo,
                            orderStatus: item.orderStatus
                        }
                    });
                }, 100);
            }

        }

        async markReaded() {
            const unreadTemp: string[] = []

            await MSG_API.MSG_QUERY_API({
                current: 1,
                size: 9999999,
                read: 0, // 已读标记,1:已读，0:未读
                user: this.loginUserId // 登录用户id
            }).then(({ data }) => {
                data.data.records.forEach(item => {
                    unreadTemp.push(item.msgId)
                });
            });

            if (unreadTemp.length !== 0) {
                MSG_API.MSG_READ_API({
                    ids: unreadTemp, // 用户消息id列表
                    userId: this.loginUserId
                }).then(({ data }) => {
                    console.log('v2')
                    console.log(data)
                    this.readNumStyle = 3
                    this.currPageFromRead = 1
                    this.pageSizeFromRead = 10
                    this.getMsgDataList(this.currPageFromRead, this.pageSizeFromRead, 1)
                    this.currPageFromUnread = 1
                    this.pageSizeFromUnread = 10
                    this.getMsgDataList(this.currPageFromUnread, this.pageSizeFromUnread, 0)
                    this.$store.commit('common/updateMsg', true);
                });
            }

        }

        markThisReaded(msgId) {
            console.log('msgId')
            console.log(msgId)
            MSG_API.MSG_READ_API({
                ids: [msgId], // 用户消息id列表
                userId: this.loginUserId
            }).then(() => {
                this.readNumStyle = 3
                this.currPageFromRead = 1
                this.pageSizeFromRead = 10
                this.getMsgDataList(this.currPageFromRead, this.pageSizeFromRead, 1)
                this.currPageFromUnread = 1
                this.pageSizeFromUnread = 10
                this.getMsgDataList(this.currPageFromUnread, this.pageSizeFromUnread, 0)
            });
        }

        // 改变每页条数
        handlePageSizeChangeFromRead(val: number): void {
            this.pageSizeFromRead = val;
            this.getMsgDataList(this.currPageFromRead, this.pageSizeFromRead, 1);
        }

        // 跳转页数
        handleCurrentPageChangeFromRead(val: number): void {
            this.currPageFromRead = val;
            this.getMsgDataList(this.currPageFromRead, this.pageSizeFromRead, 1);
        }

        // 改变每页条数
        handlePageSizeChangeFromUnread(val: number): void {
            this.pageSizeFromUnread = val;
            this.getMsgDataList(this.currPageFromUnread, this.pageSizeFromUnread, 0);
        }

        // 跳转页数
        handleCurrentPageChangeFromUnread(val: number): void {
            this.currPageFromUnread = val;
            this.getMsgDataList(this.currPageFromUnread, this.pageSizeFromUnread, 0);
        }

        get mainClientHeight() {
            return this.$store.state.common.mainClientHeight;
        }

        get totalNum() {
            return this.unreadNum + this.readNum
        }
    }

interface MessageObject{
        icon?: string;
        id?: string;
        msgContent?: string;
        msgStatus?: number;
        msgUrl?: string;
        operation?: string;
        orderNo?: string;
        productLine?: string;
        productLineName?: string;
        productTeam?: string;
        productTeamName?: string;
        workShop?: string;
        workShopName: string;
        readed?: boolean;
}

interface Icon{
    menuName: string;
    menuIcon?: string;
}
</script>

<style scoped>

.el-card >>> .el-card__body {
    padding: 17px 25px;
}

.message-content >>> .el-card__header {
    flex-grow: 0;
    padding: 8px 10px;
}

.message-content >>> .el-card__body {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: 1px 17px 5px 20px;
}
.el-card__body > ul {
    flex-grow: 1;
}


.message-content >>> .el-pagination__editor.el-input .el-input__inner {
    height: 24px;
    font-size: 14px;
}
.message-content >>> .el-pagination .el-select .el-input .el-input__inner {
    height: 24px;
    font-size: 14px;
}

</style>

<style lang="scss" scoped>
// @import "common/scss/temp.scss";
@import "common/scss/_variables.scss";
$icon-bg-color:#f05c4a,#333,#147fe7,#5bd171,#ffbf00;
$repeat: length($icon-bg-color);  // How often you want the pattern to repeat.

.box-card {
    border-radius: 8px;
}
.message-area {
    display: flex;
    flex-direction: column;
}

.message-header {
    flex-grow: 0;
}
.message-content {
    display: grid;
    flex-grow: 1;
    grid-auto-flow: row;
    grid-gap: 11px;
    grid-template-areas: "unread-area read-area";
    grid-template-rows: 100%;
    grid-template-columns: 1fr 1fr;
    min-width: 1250px;
    margin-bottom: 10px;
    // align-items: stretch;
    // justify-content: space-between;
    padding: 0 11px;
    .box-card {
        display: flex;
        flex-direction: column;
        border-radius: 8px;
    }
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
            top: 10px;
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
            top: 10px;
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
    height: 22px;
    font-size: 14px;
    line-height: 22px;
    span:nth-child(1) {
        align-items: flex-end;
        margin-bottom: 4px;
        color: #999;
        font-size: 0.7rem;
    }
    span:nth-child(2) {
        align-items: flex-end;
        height: 38px;
        font-size: 1.7rem;
        font-size: 30px;
        line-height: 38px;
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
    cursor: pointer;

    .message-item__img {
        width: 55px;
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
        flex-grow: 1;
        .message-item__topic {
            height: 22px;
            margin-bottom: 5px;
            color: rgba(51, 51, 51, 1);
            font-weight: 600;
            font-size: 14px;
            line-height: 22px;
        }
        .message-item__content {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            height: 22px;
            font-size: 14px;
            line-height: 22px;
            span {
                max-width: 350px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
    }
}

@for $i from 1 through $repeat {
    li.message-item:nth-child(#{length($icon-bg-color)}n+#{$i}) .round-bg {
        background: nth($icon-bg-color, $i);
    }
}


</style>
