import { request } from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        leftMenuList: [],
        rightMenuList: [],
        currentIndex: 0,
        srcollTop: -1
    },
    //接口的返回数据
    Cates: [],
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        /* 
        0 Web中的本地存储和小程序钟的本地存储的区别
          1 写代码的方式不一样
            web:localStroge.setItem('key','value') localStroge.getItem('key')
            小程序：wx.setStorageSync('key','value')
          2 web：不管存入的是什么类型的数据，最终都会先调用以下 toString(),把数据变成了字符串 再存入进去
          3 小程序：不存在类型转换的这个操作 存什么类型取什么类型
        */

        //判断是否有数据
        const Cates = wx.getStorageSync("cates")
        if (!Cates) {
            this.getCates();
        } else {
            if (Date.now() - Cates.time > 1000 * 10) {
                this.getCates();
            } else {
                this.Cates = Cates.data
                let leftMenuList = this.Cates.map(v => v.cat_name)
                let rightMenuList = this.Cates[0].children
                this.setData({
                    leftMenuList,
                    rightMenuList
                })
            }
        }

    },
    //获取分类数据
    async getCates() {
        const res = await request({ url: '/categories' })
        this.Cates = res

        //将接口的数据存入本地存储中
        wx.setStorageSync("cates", { time: Date.now(), data: this.Cates })
        let leftMenuList = this.Cates.map(v => v.cat_name)
        let rightMenuList = this.Cates[0].children

        this.setData({
            leftMenuList,
            rightMenuList
        })
    },
    //左侧菜单的点击事件
    handleItemTap(e) {
        /* 
        1 获取被点击的标题身上的索引
        2 给data的currentIndex赋值就可以了
        3 根据不同的索引来渲染右侧的商品内容
        */
        const { index } = e.currentTarget.dataset
        let rightMenuList = this.Cates[index].children;
        this.setData({
            currentIndex: index,
            rightMenuList,
            srcollTop: 0
        })
    }


})