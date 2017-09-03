$(() => {
    var dataList = []

    //创建根节点对象
    var app = {
        el: $('#app'),
        setScreen: () => {
            app.el.css({"height": `${window.innerHeight - 20}px`})
        },
        showMsg: (msg) => {
            $('.msg').html(msg).show(() => {
                $('.msg').css({'opacity': '1'})
                setTimeout(() => {
                    $('.msg').css({'opacity': '0'})
                }, 2000)
                setTimeout(() => {
                    $('.msg').hide()
                }, 3000)
            })
        },
        getUrlPrama: (name) => {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i")
            var r = window.location.search.substr(1).match(reg)
            if (r != null) {
                return unescape(r[2])
            } 
            return null
        },
        imgPrev: (imglist) => {
            $('.imgmulshow .left').click(function () {
                if (+$('.imgmulshow img').attr('data-now') - 1 >= 0) {
                    $('.imgmulshow img').attr('src', imglist[+$('.imgmulshow img').attr('data-now') - 1])
                    $('.imgmulshow img').attr('data-now', +$('.imgmulshow img').attr('data-now') - 1)
                } else {
                    app.showMsg('前面没有图片')
                }
            })
        },
        imgNext: (imglist) => {
            $('.imgmulshow .right').click(function () {
                if (+$('.imgmulshow img').attr('data-now') + 1 < imglist.length) {
                    $('.imgmulshow img').attr('src', imglist[+$('.imgmulshow img').attr('data-now') + 1])
                    $('.imgmulshow img').attr('data-now', +$('.imgmulshow img').attr('data-now') + 1)
                } else {
                    app.showMsg('后面没有图片')
                }
            })
        }
    }
    
    //调用方法
    app.setScreen()
    console.log(app.getUrlPrama('table_id'))

    //生成列表链接
    $('#condition').attr('href', `poordetail_condition.html?table_id=${app.getUrlPrama('table_id')}`)
    $('#basic').attr('href', `poordetail_basic.html?table_id=${app.getUrlPrama('table_id')}`)
    $('#helper').attr('href', `poordetail_helper.html?table_id=${app.getUrlPrama('table_id')}`)
    $('#punchlist').attr('href', `punchlist.html?table_id=${app.getUrlPrama('table_id')}`)

    //政策福利清单链接
    $('#sharelist').attr('href', `sharelist.html?table_id=${app.getUrlPrama('table_id')}`)

    //侧边搜索框弹出
    $('.m-dropdown .u-show').click(function () {
        $('.u-hide').addClass('animOut')
        $('.u-mask').show()
    })

    $('.u-mask').click(function () {
        getBack()
    })

    //侧边栏回收函数
    function getBack() {
        $('.u-hide').removeClass('animOut')
        $('.u-hide').addClass('animIn')
        setTimeout(function () {
            $('.u-hide').removeClass('animIn')
        }, 350)
        $('.u-mask').hide()
    }

    $('.arrow').click(function () {
        if ($(this).hasClass('up')) {
            $(this).removeClass('up').addClass('down')
            $(this).parent().next().slideToggle()
        } else {
            $(this).removeClass('down').addClass('up')
            $(this).parent().next().slideToggle()
        }
    })

    $.ajax({
        url: 'http://120.76.203.56:8002/api.php/Duty/poorDetail',
        type: 'POST',
        data: `uid=${localStorage.uid}&username=${localStorage.username}&password=${localStorage.password}&table_id=${app.getUrlPrama('table_id')}`,
        success: (data) => {

            $('.uploader').attr('data-year', JSON.parse(data).data.poor.filingyear)
            console.log(JSON.parse(data))

            //基本信息
            $('#name').html(JSON.parse(data).data.poor.name)
            $('#area').html(JSON.parse(data).data.poor.townname + '&nbsp;' + JSON.parse(data).data.poor.villagename)

            // 政策性资金清单
                //dataList.push({id: '1', value: '产业扶贫-之前', mark: 1, type: 30}, {id: '2', value: '产业扶贫-现在', mark: 2, type: 30})
            
                $('#method').html(`${JSON.parse(data).data.poor2.help_measure}`)

                for (var i = 0; i < JSON.parse(data).data.industrys.length; i++) {
                    dataList.push({value: `${JSON.parse(data).data.industrys[i].industry.type_name}-之前`, mark: 1, type: 30, indId: `${JSON.parse(data).data.industrys[i].id}`}, {value: `${JSON.parse(data).data.industrys[i].industry.type_name}-之后`, mark: 2, type: 30, indId: `${JSON.parse(data).data.industrys[i].id}`})
                    $('#industry').next().append(`
                        <div class="list listcont">
                            <div class="unit">
                                <span>年份：</span><span class="right">${JSON.parse(data).data.industrys[i].year}</span>
                            </div>
                        </div>
                        <div class="list listcont">
                            <div class="unit">
                                <span>产业类型：</span><span class="right">${`${JSON.parse(data).data.industrys[i].industry_id}` === '1' ? '养殖业' : (`${JSON.parse(data).data.industrys[i].industry_id}` === '2' ? '种植业' : '其他')}</span>
                            </div>
                        </div>
                        <div class="list listcont">
                            <div class="unit">
                                <span>主要产业：</span><span class="right">${JSON.parse(data).data.industrys[i].industry.type_name}</span>
                            </div>
                        </div>
                        <div class="list listcont">
                            <div class="unit">
                                <span>产业规模：</span><span class="right">${JSON.parse(data).data.industrys[i].num}${JSON.parse(data).data.industrys[i].industry.unit}</span>
                            </div>
                        </div>
                        <div class="list listcont">
                            <div class="unit">
                                <span>产业发展成本：</span><span class="right">${JSON.parse(data).data.industrys[i].develop_cost}元</span>
                            </div>
                            <div class="unit">
                                <span>政府补贴产业发展资金：</span><span class="right">${JSON.parse(data).data.industrys[i].develop_fund}元</span>
                            </div>
                            <div class="unit">
                                <span>预计产生效益：</span><span class="right">${JSON.parse(data).data.industrys[i].estimate_gross_income}元</span>
                            </div>
                            <div class="unit">
                                <span>实际产生效益：</span><span class="right">${JSON.parse(data).data.industrys[i].actual_gross_income}元</span>
                            </div>
                            <div class="unit">
                                <span>发展是否遇到困难：</span><span class="right">${JSON.parse(data).data.industrys[i].is_difficult}</span>
                            </div>
                            <div class="unit">
                                <span>主要困难为：</span><span class="right">${JSON.parse(data).data.industrys[i].main_difficult}</span>
                            </div>
                        </div>
                    `)
                    
                    if (JSON.parse(data).data.industrys[i].images1.length) {
                        var imgList1 = []
                        for (var j = 0; j < JSON.parse(data).data.industrys[i].images1.length; j++) {
                            imgList1.push(JSON.parse(data).data.industrys[i].images1[j].picture)
                        }
                        //console.log(imgList1)
                        if (JSON.parse(data).data.industrys[i].images2.length) {
                            var imgList2 = []
                            for (var j = 0; j < JSON.parse(data).data.industrys[i].images2.length; j++) {
                                imgList2.push(JSON.parse(data).data.industrys[i].images2[j].picture)
                            }
                            //console.log(imgList1)
                            $('#industry').next().append(`
                                <div class="list listcont">
                                    <div class="unit flex">
                                        <img data-list=${JSON.stringify(imgList1)} src="${JSON.parse(data).data.industrys[i].images1[0].picture}">
                                        <img data-list=${JSON.stringify(imgList2)} src="${JSON.parse(data).data.industrys[i].images2[0].picture}">
                                    </div>
                                </div>
                            `)
                        } else {
                            $('#industry').next().append(`
                                <div class="list listcont">
                                    <div class="unit flex">
                                        <img data-list=${JSON.stringify(imgList1)} src="${JSON.parse(data).data.industrys[i].images1[0].picture}">
                                    </div>
                                </div>
                            `)
                        }
                    } else {
                        if (JSON.parse(data).data.industrys[i].images2.length) {
                            var imgList2 = []
                            for (var j = 0; j < JSON.parse(data).data.industrys[i].images2.length; j++) {
                                imgList2.push(JSON.parse(data).data.industrys[i].images2.picture)
                            }
                            $('#industry').next().append(`
                                <div class="list listcont">
                                    <div class="unit flex">
                                        <img data-list=${JSON.stringify(imgList2)} src="${JSON.parse(data).data.industrys[i].images2[0].picture}">
                                    </div>
                                </div>
                            `)
                        }
                    }
                }
            

            //享受政策资金清单汇总 
            for (var key in JSON.parse(data).data.moneyTotal) {
                $('#totalmoney').append(`
                    <div class="unit">
                        ${key}年总金额：${JSON.parse(data).data.moneyTotal[key]}元
                    </div>
                `)
            }
            //享受政策资金清单
            for (var i = 0; i < JSON.parse(data).data.moneys.length; i++) {
                $('#sharelist').next().append(`
                    <div class="list rcd">
                        <div class="unit"><span class="title">发放年度：</span><span>${JSON.parse(data).data.moneys[i].year}</span></div>
                        <div class="unit"><span class="title">资金名称：</span><span>${JSON.parse(data).data.moneys[i].name}</span></div>
                        <div class="unit"><span class="title">发放金额(元)：</span><span>${JSON.parse(data).data.moneys[i].money}元</span></div>
                        <div class="unit"><span class="title">发放方式：</span><span>${JSON.parse(data).data.moneys[i].grant_form}</span></div>
                        <div class="unit"><span class="title">备注：</span><span>${JSON.parse(data).data.moneys[i].remark}</span></div>
                    </div>
                `)
            }
            //易地搬迁或者危房改造
            if (JSON.parse(data).data.poor.relocationsite) {
                $('#dangerhouse').hide()
                $('#dangerhouse').next().hide()
                
                dataList.push({id: '3', value: '易地搬迁-之前', mark: 1, type: 31}, {id: '4', value: '易地搬迁-现在', mark: 2, type: 31})

                //易地搬迁
                $('#r-loc').html(JSON.parse(data).data.poor.relocationsite)
                $('#r-area').html(JSON.parse(data).data.poor.buildingarea)

                
                if (JSON.parse(data).data.condition31s_mark1.length) {
                    var imgList31s1 = []
                    for (var j = 0; j < JSON.parse(data).data.condition31s_mark1.length; j++) {
                        imgList31s1.push(JSON.parse(data).data.condition31s_mark1[j].picture)
                    }
                    if (JSON.parse(data).data.condition31s_mark2.length) {
                        var imgList31s2 = []
                        for (var j = 0; j < JSON.parse(data).data.condition31s_mark2.length; j++) {
                            imgList31s2.push(JSON.parse(data).data.condition31s_mark2[j].picture)
                        }
                        $('#relocation').next().append(`
                            <div class="list listcont">
                                <div class="unit flex">
                                <img data-list=${JSON.stringify(imgList31s1)} src="${JSON.parse(data).data.condition31s_mark1[0].picture}">
                                <img data-list=${JSON.stringify(imgList31s2)} src="${JSON.parse(data).data.condition31s_mark2[0].picture}">
                                </div>
                            </div>
                        `)
                    } else {
                        $('#relocation').next().append(`
                            <div class="list listcont">
                                <div class="unit flex">
                                <img data-list=${JSON.stringify(imgList31s1)} src="${JSON.parse(data).data.condition31s_mark1[0].picture}">
                                </div>
                            </div>
                        `)
                    }
                } else {
                    if (JSON.parse(data).data.condition31s_mark2.length) {
                        var imgList31s2 = []
                        for (var j = 0; j < JSON.parse(data).data.condition31s_mark2.length; j++) {
                            imgList31s2.push(JSON.parse(data).data.condition31s_mark2[j].picture)
                        }
                        $('#relocation').next().append(`
                            <div class="list listcont">
                                <div class="unit flex">
                                <img data-list=${JSON.stringify(imgList31s2)} src="${JSON.parse(data).data.condition31s_mark2[0].picture}">
                                </div>
                            </div>
                        `)
                    }
                }
            } else {
                $('#relocation').next().hide()
                $('#relocation').hide()

                dataList.push({id: '3', value: '危房改造-之前', mark: 1, type: 32}, {id: '4', value: '危房改造-现在', mark: 2, type: 32})

                //危房改造
                $('#dh-area').html(JSON.parse(data).data.poor.rebulidarea)
                $('#dh-level').html(JSON.parse(data).data.poor.dangerouslevel)
                $('#dh-money').html(JSON.parse(data).data.poor.subsidymoney)
                
                if (JSON.parse(data).data.condition32s_mark1.length) {
                    var imgList32s1 = []
                    for (var j = 0; j < JSON.parse(data).data.condition32s_mark1.length; j++) {
                        imgList32s1.push(JSON.parse(data).data.condition32s_mark1[j].picture)
                    }
                    if (JSON.parse(data).data.condition32s_mark2.length) {
                        var imgList32s2 = []
                        for (var j = 0; j < JSON.parse(data).data.condition32s_mark2.length; j++) {
                            imgList32s2.push(JSON.parse(data).data.condition32s_mark2[j].picture)
                        }
                        $('#dangerhouse').next().append(`
                            <div class="list listcont">
                                <div class="unit flex">
                                <img data-list=${JSON.stringify(imgList32s1)} src="${JSON.parse(data).data.condition32s_mark1[0].picture}">
                                <img data-list=${JSON.stringify(imgList32s2)} src="${JSON.parse(data).data.condition32s_mark2[0].picture}">
                                </div>
                            </div>
                        `)
                    } else {
                        $('#dangerhouse').next().append(`
                            <div class="list listcont">
                                <div class="unit flex">
                                <img data-list=${JSON.stringify(imgList32s1)} src="${JSON.parse(data).data.condition32s_mark1[0].picture}">
                                </div>
                            </div>
                        `)
                    }
                } else {
                    if (JSON.parse(data).data.condition32s_mark2.length) {
                        var imgList32s2 = []
                        for (var j = 0; j < JSON.parse(data).data.condition32s_mark2.length; j++) {
                            imgList32s2.push(JSON.parse(data).data.condition32s_mark2[j].picture)
                        }
                        $('#dangerhouse').next().append(`
                            <div class="list listcont">
                                <div class="unit flex">
                                <img data-list=${JSON.stringify(imgList32s2)} src="${JSON.parse(data).data.condition32s_mark2[0].picture}">
                                </div>
                            </div>
                        `)
                    }
                }
            }
            
            //该户享受到的扶贫政策
            $('#polity').html(JSON.parse(data).data.poor.poor_policy)

            //家庭收入清单
            $('#wage').html(JSON.parse(data).data.poor.wageincome)
            $('#prop').html(JSON.parse(data).data.poor.propertyincome)
            $('#buss').html(JSON.parse(data).data.poor.productiveincome)
            $('#trans').html(JSON.parse(data).data.poor.transferredincome)
            $('#total').html(JSON.parse(data).data.poor.totalincome)
            
            if (JSON.parse(data).data.condition33s_mark1.length) {
                var imgList33s1 = []
                for (var j = 0; j < JSON.parse(data).data.condition33s_mark1.length; j++) {
                    imgList33s1.push(JSON.parse(data).data.condition33s_mark1[j].picture)
                }
                if (JSON.parse(data).data.condition33s_mark2.length) {
                    var imgList33s2 = []
                    for (var j = 0; j < JSON.parse(data).data.condition33s_mark2.length; j++) {
                        imgList33s2.push(JSON.parse(data).data.condition33s_mark2[j].picture)
                    }
                    $('#familyincome').next().append(`
                        <div class="list listcont">
                            <div class="unit flex">
                            <img data-list=${JSON.stringify(imgList33s1)} src="${JSON.parse(data).data.condition33s_mark1[0].picture}">
                            <img data-list=${JSON.stringify(imgList33s2)} src="${JSON.parse(data).data.condition33s_mark2[0].picture}">
                            </div>
                        </div>
                    `)
                } else {
                    $('#familyincome').next().append(`
                        <div class="list listcont">
                            <div class="unit flex">
                            <img data-list=${JSON.stringify(imgList33s1)} src="${JSON.parse(data).data.condition33s_mark1[0].picture}">
                            </div>
                        </div>
                    `)
                }
            } else {
                if (JSON.parse(data).data.condition33s_mark2.length) {
                    var imgList33s2 = []
                    for (var j = 0; j < JSON.parse(data).data.condition33s_mark2.length; j++) {
                        imgList33s2.push(JSON.parse(data).data.condition33s_mark2[j].picture)
                    }
                    $('#familyincome').next().append(`
                        <div class="list listcont">
                            <div class="unit flex">
                            <img data-list=${JSON.stringify(imgList33s2)} src="${JSON.parse(data).data.condition33s_mark2[0].picture}">
                            </div>
                        </div>
                    `)
                }
            }

            dataList.push({id: '1', value: '家庭收入清单-之前', mark: 1, type: 33}, {id: '2', value: '家庭收入清单-现在', mark: 2, type: 33})

            var typeSelect = new MobileSelect({
                trigger: '.uploader',
                title: '选择相册',
                wheels: [
                    {data: dataList}
                ],
                callback: function (indexArr, data) {
                    //console.log(data)
                    $('.uploader').html('')
                    if (data[0].type !== 30) {
                        window.location = `uploader.html?familyid=${app.getUrlPrama('table_id')}&type=${data[0].type}&mark=${data[0].mark}&filingyear=${$('.uploader').attr('data-year')}&title=${data[0].value}`
                    } else {
                        window.location = `uploader.html?familyid=${app.getUrlPrama('table_id')}&type=${data[0].type}&mark=${data[0].mark}&indId=${data[0].indId}&filingyear=${$('.uploader').attr('data-year')}&title=${data[0].value}`
                    }
                }
            })
            
            $('img').click(function () {
                var imgList
                if ($(this).attr('data-list')){
                    $('.imgmulshow').remove()
                    imgList = JSON.parse($(this).attr('data-list'))
                    //console.log(imgList)
                    $('body').append(`
                        <div class="imgmulshow">
                            <div class="left"></div>
                            <div class="right"></div>
                            <img data-now="0" src="${imgList[0]}">
                            <div class="quit"></div>
                        </div>
                    `)
                    $('.imgmulshow').show()
                    $('.imgmulshow .quit').click(function () {
                        $('.imgmulshow').hide()
                    })
                    app.imgNext(imgList)
                    app.imgPrev(imgList)
                }
            })
        }
    })
})