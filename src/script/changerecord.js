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

    app.setScreen()

    $.ajax({
        url: `http://www.hiphoon.com/api.php/Duty/getHelpRecord?id=${app.getUrlPrama('id')}`,
        type: 'GET',
        success: (data) => {
            console.log(JSON.parse(data).data.content)
            $('#content').val(JSON.parse(data).data.content)
        }
    })

    $('.u-add').click(function () {

        var content = $('#content').val(),
            prama = `id=${app.getUrlPrama('id')}&content=${content}`

        console.log(content)

        if (!content) {

            app.showMsg('请填写内容后提交！')

        } else {

            $.ajax({
                url: 'http://www.hiphoon.com/api.php/Duty/updHelpRecord',
                type: 'POST',
                data: prama,
                success: (data) => {

                    app.showMsg(JSON.parse(data).info)
                    
                    setTimeout(() => {
                        window.location = `poorrecord.html`
                    }, 3000)
                }
            })   
        }
    })
})