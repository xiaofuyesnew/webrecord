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

    //新增按钮链接
    //$('.u-add').attr('href', `poordetail_add.html?table_id=${app.getUrlPrama('table_id')}`)

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

    console.log(myDate.getFullYear())


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

        //清楚原始内容
        $('.cont .lists .rcd').remove()

        getBack()
    })

    $.ajax({
        url: 'http://test.360guanggu.com/fupingv1/api.php/Macro/poorDetail',
        type: 'POST',
        data: `table_id=${app.getUrlPrama('table_id')}`,
        success: (data) => {
            console.log(JSON.parse(data).data)
            
            $('#name').html(JSON.parse(data).data.poor.name)
            $('#area').html(JSON.parse(data).data.poor.townname + '&nbsp;' + JSON.parse(data).data.poor.villagename)
            
            for (var i = 0; i < JSON.parse(data).data.records.length; i++) {
                $('.lists').append(`
                    <div class="list rcd">
                        <div class="unit record">${JSON.parse(data).data.records[i].content}</div>
                        <div class="unit date"><span>${JSON.parse(data).data.records[i].create_time}</span></div>
                    </div>
                `)
            }

            $('.u-add').attr('href', `poordetail_add.html?table_id=${app.getUrlPrama('table_id')}&familyid=${JSON.parse(data).data.poor.familyid}`)
        }
    })
})