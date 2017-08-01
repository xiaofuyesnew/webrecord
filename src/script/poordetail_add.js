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

    $('.u-add').click(function () {

        var content = $('#content').val(),
            prama = `familyid=${app.getUrlPrama('familyid')}&content=${content}`

        console.log(content)

        if (!content) {

            app.showMsg('请填写内容后提交！')

        } else {

            $.ajax({
                url: 'http://www.hiphoon.com/api.php/Duty/addHelpRecord',
                type: 'POST',
                data: prama,
                success: (data) => {

                    app.showMsg(JSON.parse(data).info)
                    
                    setTimeout(() => {
                        window.location = `poordetail_record.html?table_id=${app.getUrlPrama('table_id')}`
                    }, 3000)
                }
            })
        }
    })
})