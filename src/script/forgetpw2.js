$(() => {
    var app = {
        el: $('#app'),
        setScreen: () => {
            app.el.css({"height": `${window.innerHeight - 20}px`})
        },
        loadBtn: () => {
            $('.u-forget button').click(() => {
                var pwReg = /^[0-9a-zA-Z]{6,}$/,
                    newPassword = $('#newPassword').val(),
                    conPassword = $('#conPassword').val(),
                    uid = `uid=${localStorage.id}`,
                    pwd = `pwd=${$('#conPassword').val()}`,
                    prama = `${uid}&${pwd}`

                if (!pwReg.test(newPassword)) {
                    app.showMsg('密码至少6位')
                } else if (newPassword !== conPassword) {
                    app.showMsg('确认密码不正确')
                } else {
                    console.log(prama)
                    $.ajax({
                        url: 'http://120.76.203.56:8002/api.php/Login/password',
                        type: "POST",
                        data: prama,
                        success: (data) => {
                            console.log(JSON.parse(data))
                        }
                    })
                }
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