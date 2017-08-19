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
                console.log(JSON.parse(data))
    
                //基本信息
                $('#name').html(JSON.parse(data).data.poor.name)
                $('#area').html(JSON.parse(data).data.poor.townname + '&nbsp;' + JSON.parse(data).data.poor.villagename)
    
                //产业扶贫或者政策兜底
                if (JSON.parse(data).data.industrys) {
                    dataList.push({id: '1', value: '产业扶贫-之前', mark: 1, type: 30}, {id: '2', value: '产业扶贫-现在', mark: 2, type: 30})
                
                    $('#method').html('产业扶贫')
    
                    for (var i = 0; i < JSON.parse(data).data.industrys.length; i++) {
                        $('#industry').next().append(`
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
                        `)
    
                        if (JSON.parse(data).data.industrys[i].images1 && JSON.parse(data).data.industrys[i].images2) {
                            $('#industry').next().append(`
                                <div class="list listcont">
                                    <div class="unit flex">
                                        <img src="${JSON.parse(data).data.industrys[i].images1[0].picture}">
                                        <img src="${JSON.parse(data).data.industrys[i].images2[0].picture}">
                                    </div>
                                </div>
                            `)
                        }
                    }
                } else {
                    $('#method').html('政策兜底')
                    $('#industry').hide()
                    $('#industry').next().hide()
                }
    
                //享受政策资金清单汇总
                for (var key in JSON.parse(data).data.moneyTotal) {
                    $('#totalmoney').append(`
                        <div class="unit">
                            ${key}年：${JSON.parse(data).data.moneyTotal[key]}元
                        </div>
                    `)
                }
                //享受政策资金清单
                for (var i = 0; i < JSON.parse(data).data.moneys.length; i++) {
                    $('#sharelist').next().append(`
                        <div class="list rcd">
                            <div class="unit"><span class="title">资金名称：</span><span>${JSON.parse(data).data.moneys[i].name}</span></div>
                            <div class="unit"><span class="title">发放年度：</span><span>${JSON.parse(data).data.moneys[i].year}</span></div>
                            <div class="unit"><span class="title">发放金额：</span><span>${JSON.parse(data).data.moneys[i].money}元</span></div>
                        </div>
                    `)
                }
                //异地搬迁或者危房改造
                if (JSON.parse(data).data.poor.relocationsite) {
                    $('#dangerhouse').hide()
                    $('#dangerhouse').next().hide()
                    
                    dataList.push({id: '3', value: '异地搬迁-之前', mark: 1, type: 31}, {id: '4', value: '异地搬迁-现在', mark: 2, type: 31})

                    //异地搬迁
                    $('#r-loc').html(JSON.parse(data).data.poor.relocationsite)
                    $('#r-area').html(JSON.parse(data).data.poor.buildingarea)
    
                    if (JSON.parse(data).data.condition3s_mark1.length && JSON.parse(data).data.condition3s_mark1.length) {
                        $('#relocation').next().append(`
                            <div class="list listcont">
                                <div class="unit flex">
                                    <img src="${JSON.parse(data).data.condition3s_mark1[0].picture}">
                                    <img src="${JSON.parse(data).data.condition3s_mark2[0].picture}">
                                </div>
                            </div>
                        `)  
                    }
                } else {
                    $('#relocation').next().hide()
                    $('#relocation').hide()

                    dataList.push({id: '3', value: '危房改造-之前', mark: 1, type: 32}, {id: '4', value: '危房改造-现在', mark: 2, type: 32})

                    //危房改造
                    $('#dh-area').html(JSON.parse(data).data.poor.rebulidarea)
                    $('#dh-level').html(JSON.parse(data).data.poor.dangerouslevel)
                    $('#dh-money').html(JSON.parse(data).data.poor.subsidymoney)
                    
                    if (JSON.parse(data).data.condition3s_mark1.length && JSON.parse(data).data.condition3s_mark1.length) {
                        $('#dangerhouse').next().append(`
                            <div class="list listcont">
                                <div class="unit flex">
                                    <img src="${JSON.parse(data).data.condition3s_mark1[0].picture}">
                                    <img src="${JSON.parse(data).data.condition3s_mark2[0].picture}">
                                </div>
                            </div>
                        `)  
                    }
                }
                
                //家庭收入清单
                $('#wage').html(JSON.parse(data).data.poor.wageincome)
                $('#prop').html(JSON.parse(data).data.poor.propertyincome)
                $('#buss').html(JSON.parse(data).data.poor.productiveincome)
                $('#trans').html(JSON.parse(data).data.poor.transferredincome)
                $('#total').html(JSON.parse(data).data.poor.totalincome)
                
                if (JSON.parse(data).data.condition33s_mark1.length && JSON.parse(data).data.condition33s_mark1.length) {
                    $('#familyincome').next().append(`
                        <div class="list listcont">
                            <div class="unit flex">
                                <img src="${JSON.parse(data).data.condition33s_mark1[0].picture}">
                                <img src="${JSON.parse(data).data.condition33s_mark2[0].picture}">
                            </div>
                        </div>
                    `)  
                }

                dataList.push({id: '1', value: '家庭收入清单-之前', mark: 1, type: 33}, {id: '2', value: '家庭收入清单-现在', mark: 2, type: 33})

                var typeSelect = new MobileSelect({
                    trigger: '.uploader',
                    title: '选择相册',
                    wheels: [
                        {data: dataList}
                    ],
                    callback: function (indexArr, data) {
                        console.log(data)
                        $('.uploader').html('')
                        window.location = `uploader.html?familyid=${app.getUrlPrama('table_id')}&type=${data[0].type}&mark=${data[0].mark}&filingyear=${$('.uploader').attr('data-year')}&title=${data[0].value}`
                    }
                })
            }
        })
    })