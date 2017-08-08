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
        }
    }

    //调用方法
    app.setScreen()

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
                    url: 'http://www.hiphoon.com/api.php/Duty/messageList',
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
                            <a href="msgdetail.html?id=${data.data.datas[i].id}">
                                <div class="list rcd ${data.data.datas[i].is_read !== '2' ? '' : 'noread'}">
                                    <div class="unit record">${data.data.datas[i].type}</div>
                                    <div class="unit date"><span>${data.data.datas[i].start_time.substring(0, 19)}</span></div>
                                </div>
                            </a>`
                            }
                        } else {
                            me.lock()
                            me.noData()
                        }

                        $('.lists').append(result)
                        me.resetload()
                    },
                    error: function (xhr, type) {
                        me.resetload()
                    }
                })
            }
        })
    }

    needLoad()
})