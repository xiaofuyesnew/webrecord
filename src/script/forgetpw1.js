$(() => {
    var app = {
        el: $('#app'),
        setScreen: () => {
            app.el.css({"height": `${window.innerHeight - 20}px`})
        },
        loadBtn: () => {
            $($('.u-forget button')[0]).click(() => {
                var emailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
                    username = `username=${$('#username').val()}`,
                    mail = `mail=${$('#mail').val()}`,
                    prama = `${username}&${mail}`
                if ($('#username').val() === '') {
                    app.showMsg('请输入用户名')
                } else if (!emailReg.test($('#mail').val())) {
                    app.showMsg('邮箱格式不正确')
                } else {
                    $.ajax({
                        url: 'http://test.360guanggu.com/fupingv1/api.php/Login/add',
                        type: "POST",
                        data: prama,
                        success: (data) => {
                            app.showMsg('发送成功')
                        }
                    })
                    
                }
            })
            $($('.u-forget button')[1]).click(() => {
                var emailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
                    username = `username=${$('#username').val()}`,
                    mail = `mail=${$('#mail').val()}`,
                    code = `code=${$('#code').val()}`,
                    prama = `${username}&${mail}&${code}`
                $.ajax({
                    url: 'http://test.360guanggu.com/fupingv1/api.php/Login/checkEmailCode',
                    type: "POST",
                    data: prama,
                    success: (data) => {
                        console.log(JSON.parse(data))
                        if (JSON.parse(data).status === 1) {
                            localStorage.setItem('id', JSON.parse(data).id)
                            window.location = 'forgetpw2.html'
                        } else {
                            app.showMsg(JSON.parse(data).info)
                        }
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

    app.setScreen()
    app.loadBtn()
})