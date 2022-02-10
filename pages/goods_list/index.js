import { request } from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabs: [{
                id: 0,
                value: '综合',
                isActive: true
            },
            {
                id: 1,
                value: '销量',
                isActive: false,
            },
            {
                id: 2,
                value: '价格',
                isActive: false
            }
        ],
        goodsList: []
    },
    //接口要的参数
    QueryParams: {
        query: "",
        cid: "",
        pagenum: 1,
        pagesize: 10
    },
    totalPages: 1,
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.QueryParams.cid = options.cid
        this.getGoodList()
    },
    //标题点击事件 从子组件传递过来
    handletabsItemChange(e) {
        //1 获取被点击的标题索引
        const { index } = e.detail
            //2 修改源数组
        let { tabs } = this.data
        tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
            //3 赋值到data中
        this.setData({
            tabs
        })
    },
    async getGoodList() {
        const res = await request({ url: '/goods/search', data: this.QueryParams });
        const total = res.total
        this.totalPages = Math.ceil(total / this.QueryParams.pagesize)
        this.setData({
            //旧数据和新数据拼接
            goodsList: [...this.data.goodsList, ...res.goods]
        })

        wx.stopPullDownRefresh()
    },

    //触底刷新数据
    onReachBottom() {
        if (this.QueryParams.pagenum >= this.totalPages) {
            wx.showToast({
                title: '没有下一页数据',
            });
        } else {
            this.QueryParams.pagenum++
                this.getGoodList()
        }
    },
    //上拉刷新数据
    onPullDownRefresh() {
        this.setData({
            goodsList: []
        })
        this.QueryParams.pagenum = 1;
        this.getGoodList()
    }
})