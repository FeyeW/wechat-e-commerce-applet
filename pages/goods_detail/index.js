import { request } from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodsObj: {}
    },
    GoodsInfo:{},
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const { goods_id } = options
        this.getGoodsDetail(goods_id)
    },
   //获取商品详情数据
    async getGoodsDetail(goods_id) {
        const goodsObj = await request({ url: "/goods/detail", data: { goods_id } })
        this.GoodsInfo=goodsObj
        this.setData({
            goodsObj
        })
    },
    //点击轮播图，放大预览
    handlePrevewImage(e)
    {
      const urls=this.GoodsInfo.pics.map(v=>v.pics_mid);
      const current=e.currentTarget.dataset.url;
      wx.previewImage({
        urls,
        current
      })
    },
    handleCartAdd()
    {
     //获取缓存中的购物车 数组
     let cart=wx.getStorageSync("cart")||[];
     //判断是商品对象是否存在于购物车数组中
     let index=cart.findIndex(v=>v.goods_id=this.GoodsInfo.goods_id);
     if(index===-1)
     {
         //不存在第一次添加
         this.GoodsInfo.num=1;
         cart.push(this.GoodsInfo)
     }
     else{
         //已经存在购物车数据 执行num++
         cart[index].num++

     }
     //把购物车重新添加到缓存中
     wx.setStorageSync("cart",cart);
     wx.showToast({
       title: '加入成功',
       icon:'success',
       mask:true
     })
    }
})