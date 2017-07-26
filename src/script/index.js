$(() => {
    //创建根节点对象
    var app = {
        el: $('#app'),
        setLocalData: () => {
            if (localStorage.username && localStorage.password) {
                $('#username').val(localStorage.username)
                $('#password').val(localStorage.password)
            }
        },
        setScreen: () => {
            app.el.css({"height": `${window.innerHeight - 20}px`})
        },
        loadBtn: () => {
            $('.u-login button').click(() => {
                $('.sp-wraper').show(() => {
                    $('.sp-wraper').css({'opacity': '1'})
                })
                setTimeout(() => {
                    $('.sp-wraper').css({'opacity': '0'});
                }, 3000)
                setTimeout(() => {
                    window.location = 'html/macroresult.html'
                }, 5000)
            })
        },
        checkCode: () => {
            $('.u-check img').click(function () {
                    $('.u-check img').attr('src', 'http://test.360guanggu.com/fupingv1/api.php/Login/get_codes?PHPSESSID=code')
            })
        },
        login: () => {
            $('button').click(function () {
                var username = `username=${$('#username').val()}`,
                    password = `password=${$('#password').val()}`,
                    code = `code=${$('#code').val()}`,
                    key = 'PHPSESSID=code',
                    prama = `${username}&${password}&${code}&${key}`
                    console.log(prama)
                $.ajax({
                    url: 'http://test.360guanggu.com/fupingv1/api.php/Login/login',
                    type: "post",
                    data: prama,
                    success: (data) => {
                        if (JSON.parse(data).status === 1) {
                            localStorage.setItem('uid', JSON.parse(data).uid)
                            if ($('#remember').prop('checked')) {
                                localStorage.setItem('username', $('#username').val())
                                localStorage.setItem('password', $('#password').val())
                            } else {
                                localStorage.setItem('username', '')
                                localStorage.setItem('password', '')
                            }
                            console.log(localStorage)
                            window.location = 'html/main.html'
                        } else {
                            app.showMsg(JSON.parse(data).info)
                        }
                        console.log(JSON.parse(data))
                    }
                })
            })
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
    app.setLocalData()
    app.checkCode()
    app.login()

})