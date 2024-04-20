function setMask() {
    var phone = document.querySelectorAll('input[type = tel]'),
        agreement = document.querySelectorAll('.agreement')
    var phoneMaskOptions = {
            mask: '+0(000)000-00-00',
            lazy: false
        },
        agreementMaskOptions = {
            mask: '0000-0000-0000-0000',
            lazy: false
        }


    phone.forEach((element) => {
        var mask = new IMask(element, phoneMaskOptions);
    })
    agreement.forEach(element => {
        const mask = new IMask(element, agreementMaskOptions)
    })

}
setMask();