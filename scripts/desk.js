import {
    PhoneService
} from "./service.js";

const service = new PhoneService();

let requests = await service.getAllRequests();
requests = Array.from(requests)
requests.sort(function(a, b) {
    return b.priority - a.priority; 
})

let len = requests.length

const desk = document.querySelector('.desk');
console.log(document)

let first = 0,
    last = 10;

function getNext() {
    if (last >= len) return
    first += 10;
    last += 10;
    setDesk()
}

function getPrev() {
    console.log('c')
    if (first == 0) return
    first -= 10;
    last -= 10;
    setDesk()
}

// chooseRequest(){
//     localStorage.setItem('request', )
// }
document.querySelectorAll('.owner-filter-element')[0].addEventListener('click', getRequest(service.getAllRequests()))
document.querySelectorAll('.owner-filter-element')[1].addEventListener('click', getRequest(service.getAllClosedRequests()))
document.querySelectorAll('.owner-filter-element')[2].addEventListener('click', getRequest(service.getAllFailedRequests()))

function getRequest(reqs) {
    return async (e) => {
        requests = await reqs
        len = requests.length
        document.querySelector('.owner-filter-element.active').classList.toggle('active')
        e.target.classList.add('active')
        setDesk();
    }

}

async function setDesk() {

    desk.innerHTML = ''
    desk.innerHTML = `
        <div class="desk-row">
        <input type="checkbox" name="" id="">
        <span class="desk-element header"> № </span>
        <span class="desk-element header"> Specialist </span>
        <span class="desk-element header"> Type </span>
        <span class="desk-element header"> Priority </span>
        <span class="desk-element header wide"> Description </span>
        <span class="desk-element header"> Date </span>
        <!-- <span class="desk-element wide">
            <Address>Address</Address>
        </span>
        <span class="desk-element"> Номер телефона</span> -->
        </div>

    `
    const setRows = () => {
        Array.from(requests).slice(first, last).forEach(async (request, i) => {
            let priority;
            if (request.priority == 0){
                priority = 'Низкий'
            }
            else if (request.priority == 100){
                priority = 'Средний'
            }else if (request.priority == 200){
                priority = 'Высокий'
            }
                const specialistType = await service.getSpecialistType(request.specialistType)
            const type = await service.getRequestType(request.typeId)
            desk.innerHTML += `
        <div class="desk-row">
        <input onclick = 'if(localStorage.getItem("request")){alert("у вас уже есть обращение"); return} localStorage.setItem("request", "${request._id}") ; document.location.href = "ticket.html";   ' type="button" value = "✓" class="accept-btn">
        <span class="desk-element"> ${first+i+1} </span>
        <span  class="desk-element">
             ${specialistType.name}
        </span>
        <span class="desk-element">
            ${type.name}
        </span>
        <span class="desk-element">
            ${priority}
        </span>
        <textarea disabled class="desk-element wide"> ${request.description} </textarea>
        <input disabled type="date" value="${request.creationDate.slice(0, 10)}" class="desk-element">
    </div>`;


            document.querySelector('.next').addEventListener('click', getNext)

            document.querySelector('.prev').addEventListener('click', getPrev)


        })
    }
    setRows()


    desk.innerHTML += `<div class="desk-row last-row">
    <div class="last">
       <span id = "pages">1/100</span> 
       <span class="arrow prev"><</span> 
       <span class="arrow next">></span>                 
    </div>
    
    </div>`;



    document.querySelector('#pages').textContent = first + 1 + '-' + last + '/' + len

}
await setDesk();