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

    var typeSelect = new MobileSelect({
        trigger: '.uploader',
        title: '选择相册',
        wheels: [
            {data: [{id: '1', value: '家庭住房状况-之前', mark: 1, type: 3}, {id: '2', value: '家庭住房状况-现在', mark: 2, type: 3}, {id: '3', value: '家庭饮水状况-之前', mark: 1, type: 4}, {id: '4', value: '家庭饮水状况-现在', mark: 2, type: 4}]}
        ],
        callback: function (indexArr, data) {
            console.log(data)
            $('.uploader').html('')
            window.location = `uploader.html?familyid=${app.getUrlPrama('table_id')}&type=${data[0].type}&mark=${data[0].mark}&filingyear=${$('.uploader').attr('data-year')}`
        }
    })

    //生成列表链接
    $('#basic').attr('href', `poordetail_basic.html?table_id=${app.getUrlPrama('table_id')}`)
    $('#helper').attr('href', `poordetail_helper.html?table_id=${app.getUrlPrama('table_id')}`)
    $('#result').attr('href', `poordetail_result.html?table_id=${app.getUrlPrama('table_id')}`)
    $('#punchlist').attr('href', `punchlist.html?table_id=${app.getUrlPrama('table_id')}`)

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
            $('.uploader').attr('data-year', JSON.parse(data).data.poor.filingyear)
            console.log(JSON.parse(data).data)
            $('#name').html(JSON.parse(data).data.poor.name)
            $('#area').html(JSON.parse(data).data.poor.townname + '&nbsp;' + JSON.parse(data).data.poor.villagename)

            if (JSON.parse(data).data.poor.isdangeroushouse === "是") {
                $('#house').html(`<span class="title">是否危房：</span>是；<span class="title">危房等级：</span>${JSON.parse(data).data.poor.dangerousgrade}；<span class="title">面积：</span>${JSON.parse(data).data.poor.dangerousarea}㎡`)
            } else {
                $('#house').html(`<span class="title">是否危房：</span>${JSON.parse(data).data.poor.isdangeroushouse}；<span class="title">面积：</span>${JSON.parse(data).data.poor.dangerousarea}㎡`)
            }

            $('#water').html(`<span class="title">是否饮水困难：</span>${JSON.parse(data).data.poor.isdrinkwaterdiff}；<span class="title">是否饮水安全：</span>${JSON.parse(data).data.poor.iswatersafe}`)

            if (JSON.parse(data).data.condition3s_mark1.length && JSON.parse(data).data.condition3s_mark1.length) {
                if (!JSON.parse(data).data.condition3s_mark1[0].picture && !JSON.parse(data).data.condition3s_mark2[0].picture) {
                    $('#housephoto').html('<div class="unit nodata">暂无照片信息</div>')
                } else {
                    $('#housephoto').append(
                        `<div class="unit flex">
                            <img src="http://www.hiphoon.com${JSON.parse(data).data.condition3s_mark1[0].picture}">
                            <img src="http://www.hiphoon.com${JSON.parse(data).data.condition3s_mark2[0].picture}">
                        </div>`
                    )
                }
            }

            if (JSON.parse(data).data.condition4s_mark1.length && JSON.parse(data).data.condition4s_mark1.length) {
                if (!JSON.parse(data).data.condition4s_mark1[0].picture && !JSON.parse(data).data.condition4s_mark2[0].picture) {
                    $('#waterphoto').html('<div class="unit nodata">暂无照片信息</div>')
                } else {
                    $('#waterphoto').append(
                        `<div class="unit flex">
                            <img src="http://www.hiphoon.com${JSON.parse(data).data.condition4s_mark1[0].picture}">
                            <img src="http://www.hiphoon.com${JSON.parse(data).data.condition4s_mark2[0].picture}">
                        </div>`
                    )
                }
            }
        }
    })
})