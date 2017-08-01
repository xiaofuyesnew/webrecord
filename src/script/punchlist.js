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

    //按需加载
    function needLoad() {
        var page = 0,
            prama = `uid=${localStorage.uid}&familyid=${app.getUrlPrama('table_id')}`

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
                    url: 'http://www.hiphoon.com/api.php/Duty/signList',
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
                            <div class="bar"></div>
                                <div class="list">
                                <div class="unit-h">
                                    <span class="title">签到成功</span>
                                </div>
                                <div class="unit-h">
                                    <div class="icon"></div>
                                    <span class="address left">${data.data.datas[i].address}</span>
                                    <span class="time right">${data.data.datas[i].sign_time}</span>
                                </div>
                            </div>`
                            }
                        } else {
                            me.lock()
                            me.noData()
                        }

                        $('.lists').append(result)
                        me.resetload()
                    },
                    error: function (xhr, type) {
                        alert('数据加载错误请重试！')
                        me.resetload()
                    }
                })
            }
        })
    }

    needLoad()

})