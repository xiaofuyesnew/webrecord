$(() => {
    var onDeviceReady = function() {
        initiateUI()
        navigator.geolocation.getCurrentPosition(function(position){}, function(error){})
    }

    var onTagsWithAlias = function(event) {
        
    }

    var onOpenNotification = function(event) {
        try {
            var alertContent;
            if (device.platform == "Android") {
                alertContent = event.alert
                window.location = `msgdetail.html?id=${event.extras.msgid}`
            } else {
                alertContent = event.aps.alert
                window.location = `msgdetail.html?id=${event.msgid}`
            }
        } catch (exception) {
            console.log("JPushPlugin:onOpenNotification" + exception)
        }
    }

    var onReceiveNotification = function(event) {
        try {
            var alertContent
            if (device.platform == "Android") {
                alertContent = event.alert
            } else {
                alertContent = event.aps.alert
            }
        } catch (exception) {
            console.log(exception)
        }
    }

    var onReceiveMessage = function(event) {
        try {
            var message
            if (device.platform == "Android") {
                message = event.message
            } else {
                message = event.content
            }
        } catch (exception) {
            console.log("JPushPlugin:onReceiveMessage-->" + exception)
        }
    }

    var initiateUI = function() {
        try {
            window.plugins.jPushPlugin.init();
            if (device.platform != "Android") {
                window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0)
            } else {
                window.plugins.jPushPlugin.setStatisticsOpen(true)
            }
        } catch (exception) {
            console.log(exception)
        }

        try {
            window.plugins.jPushPlugin.setTagsWithAlias([localStorage.uid], '', function () {
                      // Success callback
                console.log(tags + ' - ' + alias)
                alert('OK')
            })
        } catch (exception) {
            console.log(exception)
        }
    }

    document.addEventListener("jpush.setTagsWithAlias", onTagsWithAlias, false)
    document.addEventListener("deviceready", onDeviceReady, false)
    document.addEventListener("jpush.openNotification", onOpenNotification, false)
    document.addEventListener("jpush.receiveNotification", onReceiveNotification, false)
    document.addEventListener("jpush.receiveMessage", onReceiveMessage, false)
    
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
        }
    }

    //调用方法
    app.setScreen()

    function bell() {
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
    }

    $.ajax({
        url: `http://www.hiphoon.com/api.php/Duty/isTodayMsg?uid=${localStorage.uid}`,
        type: 'GET',
        success: (data) => {
            bell()
        }
    })

    //按需加载
    function needLoad() {
        var page = 0,
            prama = `uid=${localStorage.uid}`

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
                    url: 'http://www.hiphoon.com/api.php/Duty/helpList',
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
                            <div class="bar"></div>
                            <div class="list">
                    <div class="unit-h">
                        <div class="hidden">
                        <span class="title">姓名：</span>
                        <span class="text">${data.data.datas[i].name}</span>
                        </div>
                        <a class="more" href="poordetail_basic.html?table_id=${data.data.datas[i].table_id}"></a>
                    </div>
                    <div class="unit left">
                        <span class="title">村镇：</span>
                        <span class="text">${data.data.datas[i].townname} ${data.data.datas[i].villagename}</span>
                    </div>
                    <div class="unit over right">
                        <span class="title">贫困属性：</span>
                        <span class="text">${data.data.datas[i].povertyattribute}</span>
                    </div>
                    <div class="unitbtn">
                        <a class="btn addrecord" href="poordetail_add.html?table_id=${data.data.datas[i].table_id}&familyid=${data.data.datas[i].table_id}">新增帮扶记录</a>
                        <a class="btn ${data.data.datas[i].is_sign ? 'punchok' : 'punch'} pc" ${data.data.datas[i].is_sign ? '' : `href="punch.html?familyid=${data.data.datas[i].familyid}"`}>${data.data.datas[i].is_sign ? '已签到' : '签到'}</a>
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

    needLoad() 
})