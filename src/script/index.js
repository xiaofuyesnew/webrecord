$(() => {

    function onDeviceReady() {
        if (app.getUrlPrama('logout') === '1') {
            window.plugins.jPushPlugin.setTagsWithAlias([], '', function () {
                // Success callback
                console.log(tags + ' - ' + alias)
            })
        }
    }

    document.addEventListener("deviceready", onDeviceReady, false)

    //创建根节点对象
    var app = {
        el: $('#app'),
        setLocalData: () => {
            if (localStorage.checked === '1') {
                $('#remember').prop('checked', 'checked')
                $('#username').val(localStorage.username)
                $('#password').val(localStorage.password)
            }
        },
        setScreen: () => {
            app.el.css({"height": `${window.innerHeight - 20}px`})
        },
        checkCode: () => {
            $('.u-check img').attr('src', 'https://www.hiphoon.com/api.php/Login/get_codes?PHPSESSID=code')
        },
        lastLogin: () => {
            var mytime = new Date(),
                myYear = mytime.getFullYear(),
                myMonth = mytime.getMonth(),
                myDay = mytime.getDate()

            localStorage.lastYear = myYear
            localStorage.lastMonth = myMonth
            localStorage.lastDay = myDay
        },
        login: () => {
            
            var username = `username=${$('#username').val()}`,
                password = `password=${$('#password').val()}`,
                code = `code=${$('#code').val()}`,
                key = 'PHPSESSID=code',
                prama = `${username}&${password}&${code}&${key}`

            $.ajax({
                url: 'http://www.hiphoon.com/api.php/login/dutyLogin',
                type: "post",
                data: prama,
                success: (data) => {
                    if (JSON.parse(data).status === 1) {
                        localStorage.setItem('uid', JSON.parse(data).uid)
                        if ($('#remember').prop('checked')) {
                            localStorage.setItem('checked', '1')
                            localStorage.setItem('username', $('#username').val())
                            localStorage.setItem('password', $('#password').val())
                        } else {
                            localStorage.setItem('checked', '0')
                            localStorage.setItem('username', '')
                            localStorage.setItem('password', '')
                        }
                        app.lastLogin()
                        window.location = 'html/poorlist.html'
                    } else {
                        if (JSON.parse(data).info === '验证码错误') {
                            app.checkCode()
                        }
                        app.showMsg(JSON.parse(data).info)
                    }
                }
            })
        },
        autoLogin: () => {
            var nowtime = new Date(),
                nowYear = nowtime.getFullYear(),
                nowMonth = nowtime.getMonth(),
                nowDay = nowtime.getDate()

            if (!app.getUrlPrama('logout') && localStorage.username && localStorage.password) {
                if (nowYear === +localStorage.lastYear) {
                    if (nowMonth === +localStorage.lastMonth) {
                        if ((nowDay - (+localStorage.lastDay)) < 7) {
                            window.location = `html/poorlist.html`
                        }
                    }
                }
            }
        },
        getUrlPrama: (name) => {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i")
            var r = window.location.search.substr(1).match(reg)
            if (r != null) {
                return unescape(r[2])
            } 
            return null
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

    //自动登录
    app.autoLogin()

    //刷新验证码
    $('.u-check img').click(function () {
        app.checkCode()
    })

    //点击登录按钮
    $('button').click(function () {
        app.login()
    })

    app.setLocalData()
})