import { request } from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodsObj: {},
        isCollect: false
    },
    GoodsInfo: {},
    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function() {
        let pages = getCurrentPages()
        let currentPage = pages[pages.length - 1]
        let options = currentPage.options
        const { goods_id } = options
        this.getGoodsDetail(goods_id)
    },
    //获取商品详情数据
    async getGoodsDetail(goods_id) {
        const goodsObj = await request({ url: "/goods/detail", data: { goods_id } })
        this.GoodsInfo = goodsObj
            //获取缓存中的商品收藏的数组
        let collect = wx.getStorageSync("collect") || []
            //判断当前商品是否被收藏
        let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id)
        this.setData({
            goodsObj,
            isCollect
        })
    },
    //点击轮播图，放大预览
    handlePrevewImage(e) {
        const urls = this.GoodsInfo.pics.map(v => v.pics_mid);
        const current = e.currentTarget.dataset.url;
        wx.previewImage({
            urls,
            current
        })
    },
    handleCartAdd() {
        //获取缓存中的购物车 数组
        let cart = wx.getStorageSync("cart") || [];
        //判断是商品对象是否存在于购物车数组中
        let index = cart.findIndex(v => v.goods_id = this.GoodsInfo.goods_id);
        if (index === -1) {
            //不存在第一次添加
            this.GoodsInfo.num = 1;
            cart.push(this.GoodsInfo)
        } else {
            //已经存在购物车数据 执行num++
            cart[index].num++

        }
        //把购物车重新添加到缓存中
        wx.setStorageSync("cart", cart);
        wx.showToast({
            title: '加入成功',
            icon: 'success',
            mask: true
        })
    },
    //点击 商品收藏图标
    handleCollext() {
        let isCollect = false
            //获取缓存中的商品收藏数组
        let collect = wx.getStorageSync("collect") || []
            //判断该商品是否被收藏过
        let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id)
            //当index!=-1表示 已经收藏过
        if (index !== -1) {
            //能找到已经收藏过了 则删除
            collect.splice(index, 1)
            isCollect = false
            wx.showToast({
                title: '取消成功',
                icon: 'success',
                mask: true
            })
        } else {
            collect.push(this.GoodsInfo)
            isCollect = true
            wx.showToast({
                title: '收藏成功',
                icon: 'success',
                mask: true
            })
        }
        //把数组存入缓存中
        wx.setStorageSync('collect', collect)
        this.setData({
            isCollect
        })
    }
})