$(() => {
    
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
            url: 'http://www.hiphoon.com/api.php/Duty/poorDetail',
            type: 'POST',
            data: `table_id=${app.getUrlPrama('table_id')}`,
            success: (data) => {
                console.log(JSON.parse(data))
    
                //基本信息
                $('#name').html(JSON.parse(data).data.poor.name)
                $('#area').html(JSON.parse(data).data.poor.townname + '&nbsp;' + JSON.parse(data).data.poor.villagename)
    
                //产业扶贫或者政策兜底
                if (JSON.parse(data).data.industrys) {
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
                                        <img src="http://www.hiphoon.com${JSON.parse(data).data.industrys[i].images1[0].picture}">
                                        <img src="http://www.hiphoon.com${JSON.parse(data).data.industrys[i].images2[0].picture}">
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
                for (var i = 0; i < JSON.parse(data).data.years.length; i++) {
                    $('#totalmoney').append(`
                        <div class="unit">
                            ${JSON.parse(data).data.years[i].year}年：${JSON.parse(data).data.years[i].sum}元
                        </div>
                    `)
                }
                //享受政策资金清单
                for (var i = 0; i < JSON.parse(data).data.shares.length; i++) {
                    $('#sharelist').next().append(`
                        <div class="list rcd">
                            <div class="unit"><span class="title">资金名称：</span><span>${JSON.parse(data).data.shares[i].fund_name}</span></div>
                            <div class="unit"><span class="title">发放年度：</span><span>${JSON.parse(data).data.shares[i].year}</span></div>
                            <div class="unit"><span class="title">发放金额：</span><span>${JSON.parse(data).data.shares[i].grant_funds}元</span></div>
                        </div>
                    `)
                }
                //异地搬迁或者危房改造
                if (JSON.parse(data).data.poor.relocationsite) {
                    $('#dangerhouse').hide()
                    $('#dangerhouse').next().hide()
    
                    //异地搬迁
                    $('#r-loc').html(JSON.parse(data).data.poor.relocationsite)
                    $('#r-area').html(JSON.parse(data).data.poor.buildingarea)
    
                    if (JSON.parse(data).data.condition3s_mark1.length && JSON.parse(data).data.condition3s_mark1.length) {
                        $('#relocation').next().append(`
                            <div class="list listcont">
                                <div class="unit flex">
                                    <img src="http://www.hiphoon.com${JSON.parse(data).data.condition3s_mark1[0].picture}">
                                    <img src="http://www.hiphoon.com${JSON.parse(data).data.condition3s_mark2[0].picture}">
                                </div>
                            </div>
                        `)  
                    }
                } else {
                    $('#relocation').next().hide()
                    $('#relocation').hide()
    
                    //危房改造
                    $('#dh-area').html(JSON.parse(data).data.poor.rebulidarea)
                    $('#dh-level').html(JSON.parse(data).data.poor.dangerouslevel)
                    $('#dh-money').html(JSON.parse(data).data.poor.subsidymoney)
                    
                    if (JSON.parse(data).data.condition3s_mark1.length && JSON.parse(data).data.condition3s_mark1.length) {
                        $('#dangerhouse').next().append(`
                            <div class="list listcont">
                                <div class="unit flex">
                                    <img src="http://www.hiphoon.com${JSON.parse(data).data.condition3s_mark1[0].picture}">
                                    <img src="http://www.hiphoon.com${JSON.parse(data).data.condition3s_mark2[0].picture}">
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
                                <img src="http://www.hiphoon.com${JSON.parse(data).data.condition33s_mark1[0].picture}">
                                <img src="http://www.hiphoon.com${JSON.parse(data).data.condition33s_mark2[0].picture}">
                            </div>
                        </div>
                    `)  
                }
            }
        })
    })