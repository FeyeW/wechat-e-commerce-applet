// pages/feedback/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabs: [{
                id: 0,
                value: '体验问题',
                isActive: true
            },
            {
                id: 1,
                value: '商品、商家投诉',
                isActive: false,
            },
        ],
        chooseImage: [],
        textVal: ''
    },
    UpLoadImages: [],
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
    handleChooseImg() {
        //调用小程序内置的选择图片api
        wx.chooseImage({
            count: 9,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (result) => {
                this.setData({
                    chooseImage: [...this.data.chooseImage, ...result.tempFilePaths]
                })
            },

        });
    },
    handleRemoveImg(e) {
        const { index } = e.currentTarget.dataset;
        let { chooseImage } = this.data
        chooseImage.splice(index, 1)
        this.setData({
            chooseImage
        })
    },
    handleTextInput(e) {
        this.setData({
            textVal: e.detail.value
        })
    },
    handleFormSubmit() {
        const { textVal, chooseImage } = this.data
        if (!textVal.trim()) {
            wx.showToast({
                title: '输入不合法',
                icon: 'none',
                mask: true,
            });
            return
        }

        wx.showLoading({
            title: '正在上传中',
            mask: true
        })

        if (chooseImage.length != 0) {
            chooseImage.forEach((v, i) => {
                wx.uploadFile({
                    url: ' https://images.ac.cn/Home/Index/UploadAction/',
                    filePath: v,
                    name: "file",
                    formData: {},
                    success: (result) => {
                        let url = JSON.parse(result.data).url
                        this.UpLoadImages.push(url)

                        console.log('chengg')
                        if (i === chooseImage.length - 1) {
                            wx.hideLoading();
                            this.setData({
                                textVal: '',
                                chooseImage: []
                            })
                            wx.navigateBack({
                                delta: s
                            });
                        }
                    },

                });

            })
        } else {
            wx.hideLoading()
            wx.navigateBack({
                delta: 1
            });
        }


    }
})