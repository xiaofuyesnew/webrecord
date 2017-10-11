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
        },
        showSingleImg: (pick, img) => {
            //添加节点
            $('body').append(`
                <div id="${pick.substr(1)}Big" class="imgshow">
                    <img src="${img}">
                    <div class="quit"></div>
                </div>
            `)
            $(pick).click(function () {
                $(`${pick}Big`).show()
            })
            $('.quit').click(function () {
                $('.imgshow').hide()
            })
        }
    }

    //调用方法
    app.setScreen()
    console.log(app.getUrlPrama('table_id'))

    $('.uploader').click(function () {
        window.location = `uploader.html?familyid=${app.getUrlPrama('table_id')}&type=50&mark=&filingyear=${$('.uploader').attr('data-year')}&title=户主照片`
    })

    //生成列表链接
    $('#condition').attr('href', `poordetail_condition.html?table_id=${app.getUrlPrama('table_id')}`)
    $('#helper').attr('href', `poordetail_helper.html?table_id=${app.getUrlPrama('table_id')}`)
    $('#result').attr('href', `poordetail_result.html?table_id=${app.getUrlPrama('table_id')}`)
    $('#punchlist').attr('href', `punchlist.html?table_id=${app.getUrlPrama('table_id')}`)

    //侧边搜索框弹出
    $('.m-dropdown .u-show').click(function () {
        $('.u-hide').animate({
            left:'0'
        },300)
        //$('.u-hide').addClass('animOut')
        $('.u-mask').show()
    })

    $('.u-mask').click(function () {
        getBack()
    })

    //侧边栏回收函数
    function getBack() {
        $('.u-hide').animate({
            left:'-80vw'
        },300)
        //$('.u-hide').removeClass('animOut')
        //$('.u-hide').addClass('animIn')
        //setTimeout(function () {
        //    $('.u-hide').removeClass('animIn')
        //}, 350)
        $('.u-mask').hide()
    }

    //收起展开
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
            console.log(JSON.parse(data).data)
            $('.uploader').attr('data-year', JSON.parse(data).data.poor.filingyear)
            $('#name').html(JSON.parse(data).data.poor.name)
            $('#area').html(JSON.parse(data).data.poor.townname + '&nbsp;' + JSON.parse(data).data.poor.villagename)
            $('#sex').html(JSON.parse(data).data.poor.sex)
            $('#birthday').html(JSON.parse(data).data.poor.birthday)
            $('#contacnumber').html(JSON.parse(data).data.poor.contacnumber)
            $('#idnumber').html(JSON.parse(data).data.poor.idnumber)
            $('#homeaddress').html(JSON.parse(data).data.poor.homeaddress)
            $('#povertyattribute').html(JSON.parse(data).data.poor.povertyattribute)
            $('#mainpovertyreason').html(JSON.parse(data).data.poor.mainpovertyreason)
            $('#otherpovertyreasons').html(JSON.parse(data).data.poor.otherpovertyreasons)
            $('#redyellowcard').html(JSON.parse(data).data.poor.redyellowcard)
            $('#familysize').html(JSON.parse(data).data.poor.familysize)
            $('#backpoor').html(JSON.parse(data).data.poor.backpoor)
            $('#backpoorreason').html(JSON.parse(data).data.poor.backpoorreason)
            $('#isoupoor').html(JSON.parse(data).data.poor.isoupoor)
            $('#outpooryear').html(JSON.parse(data).data.poor.outpooryear)
            $('#ishardpoor').html(JSON.parse(data).data.poor.ishardpoor)
            

            if (JSON.parse(data).data.familys.length === 0) {
                $('.family').html('<div class="unit nodata">暂无家庭成员信息</div>')
            } else {
                for (var i = 0; i < JSON.parse(data).data.familys.length; i++) {
                    $('.family').append(`<a href="poordetail_family.html?table_id=${app.getUrlPrama('table_id')}&no=${i}" class="unit">${i + 1}.${JSON.parse(data).data.familys[i].name}</a>`)
                }
                
            }

            if (!JSON.parse(data).data.poor.icon) {
                $('.photo').html('<div class="unit nodata">暂无家庭照片信息</div>')
            } else {
                $('.photo').append(
                    `<div class="unit flex">
                        <img id="masterIcon" src="${JSON.parse(data).data.poor.icon}">
                    </div>`
                )
                app.showSingleImg('#masterIcon', JSON.parse(data).data.poor.icon)
            }
        }
    })
})