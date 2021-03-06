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
                return decodeURI(r[2])
                //unescape(r[2])
            } 
            return null
        }
    }

    app.setScreen()

    //显示标题
    $('.m-title').html(app.getUrlPrama('title'))

    $('.u-add').click(function () {
        var prama = '',
            server = ''

        if (app.getUrlPrama('type') === '50') {
            
            console.log(app.getUrlPrama('type'))
            prama = `uid=${localStorage.uid}&username=${localStorage.username}&password=${localStorage.password}&familyid=${app.getUrlPrama('familyid')}&type=${app.getUrlPrama('type')}&mark=${app.getUrlPrama('mark')}&filingyear=${app.getUrlPrama('filingyear')}&sorder=&icon=${$($('.rmkcontent')).attr('data-url')}`
            
            server = 'http://120.76.203.56:8002/api.php/Duty/savePoorImg'
            
        } else if (app.getUrlPrama('type') === '100') {
            console.log(app.getUrlPrama('type'))
            prama = `uid=${localStorage.uid}&username=${localStorage.username}&password=${localStorage.password}&table_id=${app.getUrlPrama('table_id')}&type=${app.getUrlPrama('type')}&mark=${app.getUrlPrama('mark')}&filingyear=${app.getUrlPrama('filingyear')}&sorder=&icon=${$($('.rmkcontent')).attr('data-url')}`
                    
            server = 'http://120.76.203.56:8002/api.php/Duty/saveFamilyImg'
            
        } else if (app.getUrlPrama('type') === '200') {
            console.log(app.getUrlPrama('type'))
            prama = `uid=${localStorage.uid}&username=${localStorage.username}&password=${localStorage.password}&familyid=${app.getUrlPrama('familyid')}&table_id=${app.getUrlPrama('table_id')}&type=${app.getUrlPrama('type')}&mark=${app.getUrlPrama('mark')}&filingyear=${app.getUrlPrama('filingyear')}&sorder=&icon=${$($('.rmkcontent')).attr('data-url')}`
                            
            server = 'http://120.76.203.56:8002/api.php/Duty/saveDutyIcon'

        } else if (app.getUrlPrama('type') === '201') {
            console.log(app.getUrlPrama('type'))
            prama = `uid=${localStorage.uid}&username=${localStorage.username}&password=${localStorage.password}&familyid=${app.getUrlPrama('familyid')}&table_id=${app.getUrlPrama('table_id')}&type=${app.getUrlPrama('type')}&mark=${app.getUrlPrama('mark')}&filingyear=${app.getUrlPrama('filingyear')}&sorder=&photo=${$($('.rmkcontent')).attr('data-url')}`
                            
            server = 'http://120.76.203.56:8002/api.php/Duty/saveDutyPhoto'

        } else if (app.getUrlPrama('type') === '30') {
            console.log(app.getUrlPrama('type'))
            prama = `uid=${localStorage.uid}&username=${localStorage.username}&password=${localStorage.password}&familyid=${app.getUrlPrama('familyid')}&id=${app.getUrlPrama('indId')}&type=${app.getUrlPrama('type')}&mark=${app.getUrlPrama('mark')}&filingyear=${app.getUrlPrama('filingyear')}&sorder=`
            
            server = 'http://120.76.203.56:8002/api.php/Duty/saveIndustryImg'
            
        } else {
            console.log(app.getUrlPrama('type'))
            prama = `uid=${localStorage.uid}&username=${localStorage.username}&password=${localStorage.password}&familyid=${app.getUrlPrama('familyid')}&type=${app.getUrlPrama('type')}&mark=${app.getUrlPrama('mark')}&filingyear=${app.getUrlPrama('filingyear')}&sorder=`
            
            server = 'http://120.76.203.56:8002/api.php/Duty/saveImg'
        }

        app.showMsg('开始上传，请稍等')
        
        for (var i = 0; i < $('.rmkcontent').length; i++) {
            //alert(`${prama}&picture=${$($('.rmkcontent')[i]).attr('data-url')}&remark=${$($('.rmkcontent')[i]).val()}`)
            $.ajax({
                url: server,
                type: 'POST',
                data: `${prama}&picture=${$($('.rmkcontent')[i]).attr('data-url')}&remark=${$($('.rmkcontent')[i]).val()}`,
                async: false,
                success: (data) => {
                    //alert(data)
                    if ($('.rmkcontent').length === i + 1) {
                        app.showMsg('信息已经保存')
                        setTimeout(function () {
                            window.history.back()
                        }, 3000)
                    }
                }
            })
        }
    })
})