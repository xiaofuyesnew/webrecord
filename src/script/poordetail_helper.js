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

    var typeSelect = new MobileSelect({
        trigger: '.uploader',
        title: '选择相册',
        wheels: [
            {data: [{id: '1', value: '帮扶责任人个人照片', type: 200}, {id: '2', value: '帮扶责任人与户主合照', type: 201}]}
        ],
        callback: function (indexArr, data) {
            console.log(data)
            $('.uploader').html('')
            window.location = `uploader.html?familyid=${app.getUrlPrama('table_id')}&table_id=${$('.uploader').attr('data-id')}&type=${data[0].type}&mark=&filingyear=${$('.uploader').attr('data-year')}&title=${data[0].value}`
        }
    })

    //生成列表链接
    $('#condition').attr('href', `poordetail_condition.html?table_id=${app.getUrlPrama('table_id')}`)
    $('#basic').attr('href', `poordetail_basic.html?table_id=${app.getUrlPrama('table_id')}`)
    $('#result').attr('href', `poordetail_result.html?table_id=${app.getUrlPrama('table_id')}`)
    $('#record').attr('href', `poordetail_record_true.html?table_id=${app.getUrlPrama('table_id')}`)
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
            $('.uploader').attr('data-year', JSON.parse(data).data.dutys[0].filingyear)
            $('.uploader').attr('data-id', JSON.parse(data).data.dutys[0].table_id)
            $('#name').html(JSON.parse(data).data.poor.name)
            $('#area').html(JSON.parse(data).data.poor.townname + '&nbsp;' + JSON.parse(data).data.poor.villagename)
            $('#dutyname').html(JSON.parse(data).data.dutys[0].name)
            $('#sex').html(JSON.parse(data).data.dutys[0].sex)
            $('#telephone').html(JSON.parse(data).data.dutys[0].contacnumber)
            $('#company').html(JSON.parse(data).data.dutys[0].orgname)
            
            if (JSON.parse(data).data.dutys[0].icon) {
                $('.photo .unit').append(`
                    <img id="personal" src='${JSON.parse(data).data.dutys[0].icon}'>
                `)
                app.showSingleImg('#personal', JSON.parse(data).data.dutys[0].icon)
            }

            if (JSON.parse(data).data.dutys[0].photo) {
                $('.photo .unit').append(`
                    <img id="together" src='${JSON.parse(data).data.dutys[0].photo}'>
                `)
                app.showSingleImg('#together', JSON.parse(data).data.dutys[0].photo)
            }
        }
    })
})