let files = [];
let user = {
    role: 'user'
}
document.body.onload  = roleChecker;
function roleChecker(){
    if (user.role == 'user'){
        const fields = document.querySelectorAll(`.desk input , .desk select , .desk textarea ,
          .client-info input , .client-info select , .client-info textarea ,
          .client-info-side input , .client-info-side select , .client-info-side textarea`)
        fields.forEach((item)=>{
            item.setAttribute('disabled', '');
            item.setAttribute('title', 'изменять данные может только администратор')
        })
    }
}

function dropFiles() {
    const dropZone = document.querySelector(".file-input"),
          input = document.querySelector('#ticketScreens');

    if (dropZone) {
        let hoverClassName = 'hover';

        dropZone.addEventListener("dragenter", function (e) {
            e.preventDefault();
            dropZone.classList.add(hoverClassName);
        });

        dropZone.addEventListener("dragover", function (e) {
            e.preventDefault();
            dropZone.classList.add(hoverClassName);
        });

        dropZone.addEventListener("dragleave", function (e) {
            e.preventDefault();
            dropZone.classList.remove(hoverClassName);
        });

        // Это самое важное событие, событие, которое дает доступ к файлам
        dropZone.addEventListener("drop", function (e) {
            e.preventDefault();
            dropZone.classList.remove(hoverClassName);

            let reader = new FileReader();
            files.push(Array.from(e.dataTransfer.files));
            console.log(files[0]);

            // reader.onload = e => console.log(e.target.result);
            reader.onload = e => document.querySelector('#im').src = e.target.result;
            reader.readAsDataURL(files[files.length-1][0]);
            // TODO что-то делает с файлами...
        });
    }
}
dropFiles();

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

function toggleNav() {
    let areas = window.getComputedStyle(document.querySelector('body'))['grid-template-areas'].split(' ')
    document.querySelector('nav').classList.toggle('hide');

    if (areas[3] == '"nav') areas[3] = '"main';
    else if (areas[3] == '"main') areas[3] = '"nav';
    document.querySelector('body').style.gridTemplateAreas = areas.join(' ')

}

function hideAside() {
    let areas = window.getComputedStyle(document.querySelector('body'))['grid-template-areas'].split(' ')
    document.querySelector('aside').classList.toggle('hide');

    if (areas[5] == 'aside"') areas[5] = 'main"';
    else if (areas[5] == 'main"') areas[5] = 'aside"';
    document.querySelector('body').style.gridTemplateAreas = areas.join(' ')

}

function newTicket() {
    document.querySelector('.new-ticket-popup').classList.toggle('hide');
    document.querySelector('main').style.filter = 'blur(10px)';
    document.querySelector('main').style.pointerEvents = 'none';
}

function endTicket() {
    console.log('click button')
    document.querySelector('.close-form').classList.toggle('hide');
    document.querySelector('.close-form-background').classList.toggle('hide');
    document.querySelector('main').style.filter = 'blur(10px)';
    document.querySelector('main').style.pointerEvents = 'none';
}
function closeEndTicket() {
    document.querySelector('.close-form').classList.toggle('hide');
    document.querySelector('.close-form-background').classList.toggle('hide');
    document.querySelector('main').style.filter = 'none';
    document.querySelector('main').style.pointerEvents = 'all';
    console.log('close')
}

function closeNewTicket() {
    document.querySelector('.new-ticket-popup').classList.toggle('hide');
    document.querySelector('main').style.filter = 'none'
    document.querySelector('main').style.pointerEvents = 'all';

}
// newTicket();