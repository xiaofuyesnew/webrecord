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

    $.ajax({
        url: `http://www.hiphoon.com/api.php/Duty/unreadMessage?uid=${localStorage.uid}`,
        type: 'GET',
        success: (data) => {
            var jsonData = JSON.parse(data)
            console.log(JSON.parse(data))
            if (jsonData.status === 1) {
                $('.u-notice').css({
                    background: 'url(../image/noticebell-spot.png) left center / 28px no-repeat'
                })
                if (+jsonData.sum < 9) {
                    $('.ntc-num').html(jsonData.sum)
                }
            } else {
                $('.u-notice').css({
                    background: 'url(../image/noticebell-nospot.png) left center / 28px no-repeat'
                })
            }
        }
    })

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

    //生成时间搜索
    var year = {data:[]},
        month = {data:[]},
        date = {data:[]},
        myDate = new Date(),
        today = [(myDate.getFullYear() - 2000), myDate.getMonth(), (myDate.getDate() - 1)]

    for (var i = 0; i < 36; i++) {
        year.data.push({
            id: String(i),
            value: '' + (2000 + i)
        })
    }

    for (var i = 0; i < 12; i++) {
        month.data.push({
            id: String(i),
            value: i + 1 < 10 ? '0' + (i + 1) : '' + (i + 1)
        })
    }
    
    for (var i = 0; i < 31; i++) {
        date.data.push({
            id: String(i),
            value: i + 1 < 10 ? '0' + (i + 1) : '' + (i + 1)
        })
    }

    var timeSelect = new MobileSelect({
        trigger: '#time',
        title: '选择时间',
        wheels: [
            year,
            month,
            date
        ],
        position: today,
        callback: function (indexArr, data) {
            $('#time').html(`${data[0].value}-${data[1].value}-${data[2].value}`)
        }
    })
    

    //重置按钮
    $('#reset').click(function () {
        $('#name').val('')
        $('#time').html('不限')
    })

    //搜索按钮
    $('#search').click(function () {
        var name = $('#name').val(),
            time = $('#time').html()

        //清除原始内容
        $('.cont .lists .rcd').remove()
        $('.dropload-down').remove()

        if (time === '不限') {
            time = ''
        }

        getBack()

        needLoad(name, time)
    })

    //按需加载
    function needLoad(name, time) {

        var page = 0,
            prama = `uid=${localStorage.uid}`,
            oname = `&name=${name}`,
            otime = `&time=${time}`

        if (name !== '') {
            prama += oname
        }

        if (time !== '') {
            prama += otime
        }

        $('.cont').dropload({
            scrollArea : window,
            loadDownFn : (me) => {
                page++
                var result = '',
                    newPage =''
                newPage += `&page=${page}`
                console.log(prama + newPage)
                $.ajax({
                    type: 'POST',
                    url: 'http://www.hiphoon.com/api.php/Duty/HelpRecordList',
                    data: prama + newPage,
                    dataType: 'json',
                    success: function (data) {
                        console.log(data)
                        
                        if (page === 1) {
                            app.showMsg(`总共有${data.data.count}条记录`)
                        }
                        
                        var arrLen = data.data.datas.length
                    
                        if (arrLen > 0) {
                            for (var i = 0; i < arrLen; i++) {
                            result += `
                                <div class="list rcd">
                                    <div class="unit"><span class="title">姓名：</span>${data.data.datas[i].name}</div>
                                    <div class="unit record">${data.data.datas[i].content}</div>
                                    <div class="unit date"><span>${data.data.datas[i].create_time}</span></div>
                                    <div class="unitbtn">
                                        <a class="btn change" href="changerecord.html?id=${data.data.datas[i].id}">修改</a>
                                        <a class="btn delete" data-id="?id=${data.data.datas[i].id}">删除</a>
                                    </div>
                                </div>`
                            }
                        } else {
                            me.lock()
                            me.noData()
                        }

                        $('.lists').append(result)
                        me.resetload()
                    },
                    error: function (xhr, type) {
                        alert('数据加载错误请重试！')
                        me.resetload()
                    }
                })
            }
        })
    }

    needLoad('', '')

    $(document).on('click', '.delete', function () {
        var id = $(this).attr('data-id')

        $.ajax({
            url: `http://www.hiphoon.com/api.php/Duty/delHelpRecord${id}`,
            type: 'GET',
            success: (data) => {
                app.showMsg(JSON.parse(data).info)
            }
        })

        setTimeout(function () {

            //清除原始内容
            $('.cont .lists .rcd').remove()
            $('.dropload-down').remove()

            needLoad('', '')
        }, 3000)
    })
})