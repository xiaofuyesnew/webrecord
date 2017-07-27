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
        url: 'http://test.360guanggu.com/fupingv1/api.php/Macro/poorDetail',
        type: 'POST',
        data: `table_id=${app.getUrlPrama('table_id')}`,
        success: (data) => {
            console.log(JSON.parse(data).data)
            
            $('#name').html(JSON.parse(data).data.poor.name)
            $('#area').html(JSON.parse(data).data.poor.townname + '&nbsp;' + JSON.parse(data).data.poor.villagename)
            /*
            $('#sex').html(JSON.parse(data).data.poor.sex)
            $('#birthday').html(JSON.parse(data).data.poor.birthday)
            $('#telephone') //暂缺
            $('#idnumber').html(JSON.parse(data).data.poor.idnumber)
            $('#homeaddress').html(JSON.parse(data).data.poor.homeaddress)
            $('#povertyattribute').html(JSON.parse(data).data.poor.povertyattribute)
            $('#mainpovertyreason').html(JSON.parse(data).data.poor.mainpovertyreason)
            */
        }
    })
})