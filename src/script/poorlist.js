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
                    url: 'http://test.360guanggu.com/fupingv1/api.php/Duty/helpList',
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
                        <div class="hidden">
                        <span class="title">姓名：</span>
                        <span class="text">${data.data.datas[i].name}</span>
                        </div>
                        <a class="more" href="poordetail_basic.html?table_id=${data.data.datas[i].table_id}"></a>
                    </div>
                    <div class="unit left">
                        <span class="title">村镇：</span>
                        <span class="text">${data.data.datas[i].townname} ${data.data.datas[i].villagename}</span>
                    </div>
                    <div class="unit over right">
                        <span class="title">贫困属性：</span>
                        <span class="text">${data.data.datas[i].povertyattribute}</span>
                    </div>
                    <div class="unitbtn">
                        <a class="btn addrecord" href="poordetail_add.html?table_id=${data.data.datas[i].table_id}&familyid=${data.data.datas[i].table_id}">新增帮扶记录</a>
                        <a class="btn ${data.data.datas[i].is_sign ? 'punchok' : 'punch'} pc" data-fi="?familyid=${data.data.datas[i].familyid}">${data.data.datas[i].is_sign ? '已签到' : '签到'}</a>
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

    $(document).on('click', '.pc', function () {
        console.log('hit')
        var fiText = $(this).attr('data-fi')

        if (!$(this).hasClass('punchok')) {

            window.location = `punch.html${fiText}`
            /*
            $.ajax({
                url: 'http://test.360guanggu.com/fupingv1/api.php/Duty/isTodaySign',
                type: 'POST',
                data: `uid=${localStorage.uid}`,
                success: (data) => {
                    console.log(JSON.parse(data))
                    if (JSON.parse(data).status === 1) {
                        window.location = `punch.html${fiText}`
                    } else if (JSON.parse(data).status === 0) {
                        app.showMsg('今天已签到')
                    }
                }
            })*/
        }
    })
})