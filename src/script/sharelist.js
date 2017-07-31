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
        url: 'http://test.360guanggu.com/fupingv1/api.php/Duty/poorDetail',
        type: 'POST',
        data: `table_id=${app.getUrlPrama('table_id')}`,
        success: (data) => {
            console.log(JSON.parse(data))
            for (var i = 0; i < JSON.parse(data).data.years.length; i++) {
                $('#kanban').append(`
                    <div class="unit">
                        ${JSON.parse(data).data.years[i].year}年：${JSON.parse(data).data.years[i].sum}元
                    </div>
                `)
            }
            
            for (var i = 0; i < JSON.parse(data).data.shares.length; i++) {
                $('.cont .lists').append(`
                    <div class="list rcd">
                        <div class="unit"><span class="title">资金名称：</span><span>${JSON.parse(data).data.shares[i].fund_name}</span></div>
                        <div class="unit"><span class="title">发放年度：</span><span>${JSON.parse(data).data.shares[i].year}</span></div>
                        <div class="unit"><span class="title">发放金额：</span><span>${JSON.parse(data).data.shares[i].grant_funds}元</span></div>
                    </div>
                `)
            }
        }
    })
})