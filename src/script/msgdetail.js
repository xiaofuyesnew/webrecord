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
    console.log(app.getUrlPrama('id'))
    $.ajax({
        url: `http://120.76.203.56:8002/api.php/Duty/messageDetail?uid=${localStorage.uid}&username=${localStorage.username}&password=${localStorage.password}&id=${app.getUrlPrama('id')}`,
        type: 'GET',
        success: (data) => {
            console.log(JSON.parse(data))
            $('.title').html(JSON.parse(data).detail.type)
            $('.detail').html(JSON.parse(data).detail.content)
            $('.time').html(JSON.parse(data).detail.start_time.substring(0, 19))
        }
    })

})