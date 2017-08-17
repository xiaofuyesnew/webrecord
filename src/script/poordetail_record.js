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

    //侧边搜索框弹出
    $('.m-dropdown .u-show').click(function () {
        $('.u-hide').addClass('animOut')
        $('.u-mask').show()
    })

    $('.u-mask').click(function () {
        getBack()
    })

    //侧边栏回收函数
    function getBack() {
        $('.u-hide').removeClass('animOut')
        $('.u-hide').addClass('animIn')
        setTimeout(function () {
            $('.u-hide').removeClass('animIn')
        }, 350)
        $('.u-mask').hide()
    }

    //生成时间搜索
    var year = {data:[]},
        month = {data:[]},
        date = {data:[]},
        myDate = new Date(),
        today = [(myDate.getFullYear() - 2000), myDate.getMonth(), (myDate.getDate() - 1)]

    for (var i = 0; i < 36; i++) {
        year.data.push({
            id: String(i),
            value: '' + (2000 + i)
        })
    }

    for (var i = 0; i < 12; i++) {
        month.data.push({
            id: String(i),
            value: i + 1 < 10 ? '0' + (i + 1) : '' + (i + 1)
        })
    }
    
    for (var i = 0; i < 31; i++) {
        date.data.push({
            id: String(i),
            value: i + 1 < 10 ? '0' + (i + 1) : '' + (i + 1)
        })
    }

    var timeSelect = new MobileSelect({
        trigger: '#time',
        title: '选择时间',
        wheels: [
            year,
            month,
            date
        ],
        position: today,
        callback: function (indexArr, data) {
            $('#time').html(`${data[0].value}-${data[1].value}-${data[2].value}`)
        }
    })
    

    //重置按钮
    $('#reset').click(function () {
        $('#keyword').val('')
        $('#time').html('不限')
    })

    //搜索按钮
    $('#search').click(function () {
        var keyword = $('#keyword').val(),
            time = $('#time').html()

        //清除原始内容
        $('.cont .lists .rcd').remove()
        $('.dropload-down').remove()

        if (time === '不限') {
            time = ''
        }

        getBack()

        needLoad(keyword, time)
    })

    var getRecordList = () => {

        var prama = `uid=${localStorage.uid}&username=${localStorage.username}&password=${localStorage.password}&table_id=${app.getUrlPrama('table_id')}`

        $.ajax({
            url: 'http://120.76.203.56:8002/api.php/Duty/poorDetail',
            type: 'POST',
            data: prama,
            success: (data) => {

                console.log(JSON.parse(data).data)
            
                $('#name').html(JSON.parse(data).data.poor.name)
                $('#area').html(JSON.parse(data).data.poor.townname + '&nbsp;' + JSON.parse(data).data.poor.villagename)

                $('.u-add').attr('href', `poordetail_add.html?table_id=${app.getUrlPrama('table_id')}&familyid=${JSON.parse(data).data.poor.familyid}`)
            
            }
        })
    }

    //按需加载
    function needLoad(keyword, time) {

        var page = 0,
            prama = `uid=${localStorage.uid}&username=${localStorage.username}&password=${localStorage.password}&table_id=${app.getUrlPrama('table_id')}`,
            okeyword = `&keyword=${keyword}`,
            otime = `&time=${time}`

        if (keyword !== '') {
            prama += okeyword
        }

        if (time !== '') {
            prama += otime
        }

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
                    url: 'http://120.76.203.56:8002/api.php/Duty/poorDetail',
                    data: prama + newPage,
                    dataType: 'json',
                    success: function (data) {
                        console.log(data)
                        
                        if (page === 1) {
                            app.showMsg(`总共有${data.data.records.count}条记录`)
                        }
                        
                        var arrLen = data.data.records.datas.length
                    
                        if (arrLen > 0) {
                            for (var i = 0; i < arrLen; i++) {
                            result += `
                                <div class="list rcd">
                                    <div class="unit record">${data.data.records.datas[i].content}</div>
                                    <div class="unit date"><span>${data.data.records.datas[i].create_time}</span></div>
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
                        me.resetload()
                    }
                })
            }
        })
    }


    getRecordList()
    needLoad('', '')
})