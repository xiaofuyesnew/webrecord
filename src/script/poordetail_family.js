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
    
        var typeSelect = new MobileSelect({
            trigger: '.uploader',
            title: '选择相册',
            wheels: [
                {data: [{id: '1', value: '家庭成员-之前', mark: 1, type: 100}, {id: '2', value: '家庭成员-现在', mark: 2, type: 100}]}
            ],
            callback: function (indexArr, data) {
                console.log(data)
                $('.uploader').html('')
                window.location = `uploader.html?familyid=${app.getUrlPrama('table_id')}&type=${data[0].type}&mark=${data[0].mark}&filingyear=${$('.uploader').attr('data-year')}&title=${data[0].value}`
            }
        })
    
        //收起展开
        $('.arrow').click(function () {
            if ($(this).hasClass('up')) {
                $(this).removeClass('up').addClass('down')
                $(this).parent().next().slideToggle()
            } else {
                $(this).removeClass('down').addClass('up')
                $(this).parent().next().slideToggle()
            }
        })
    
        $.ajax({
            url: 'http://www.hiphoon.com/api.php/Macro/poorDetail',
            type: 'POST',
            data: `table_id=${app.getUrlPrama('table_id')}`,
            success: (data) => {
                var family = JSON.parse(data).data.familys[+(app.getUrlPrama('no'))]
                console.log(JSON.parse(data).data)
                console.log(JSON.parse(data).data.familys[+(app.getUrlPrama('no'))])
                $('#name').html(JSON.parse(data).data.poor.name)
                $('#area').html(JSON.parse(data).data.poor.townname + '&nbsp;' + JSON.parse(data).data.poor.villagename)
                $('#familyname').html(family.name)
                $('#sex').html(family.sex)
                $('#birthday').html(family.birthday)
                $('#relation').html(family.relationship)
                $('#education').html(family.educationdegree)
                $('#school').html(family.studenstatus)
                $('#skill').html(family.worksituation)
                $('#health').html(family.healthcondition)
                
    
                if (!family.icon) {
                    $('.photo').html('<div class="unit nodata">暂无家庭照片信息</div>')
                } else {
                    $('.photo').append(
                        `<div class="unit flex">
                            <img src="http://www.hiphoon.com${family.icon}">
                        </div>`
                    )
                }
            }
        })
    })