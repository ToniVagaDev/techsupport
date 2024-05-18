import {
    PhoneService
} from "./service.js";

const service = new PhoneService();

let requests = await service.getAllRequests();

requests = Array.from(requests)
const len = requests.length

const desk = document.querySelector('.desk');
console.log(document)

let first = 0,
    last = 10;

function getNext() {
    if(last >= len) return
    first += 10;
    last += 10;
    setDesk()
}

function getPrev() {
    console.log('c')
    if(first == 0) return
    first -= 10;
    last -= 10;
    setDesk()
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
       Array.from(requests).slice(first, last).forEach( async (request, i) => {
        const specialistType =  await service.getSpecialistType(request.specialistType)
        const type = await service.getRequestType(request.typeId)
        desk.innerHTML += `
        <div class="desk-row">
        <input type="button" value = "✓" class="accept-btn">
        <span class="desk-element"> ${first+i+1} </span>
        <span  class="desk-element">
             ${specialistType.name}
        </span>
        <span class="desk-element">
            ${type.name}
        </span>
        <span class="desk-element">
            High
        </span>
        <textarea disabled class="desk-element wide"> ${request.description} </textarea>
        <input disabled type="date" value="${request.creationDate.slice(0, 10)}" class="desk-element">
    </div>`;

    if(i == 9){
        document.querySelector('.next').addEventListener('click', getNext)

        document.querySelector('.prev').addEventListener('click', getPrev)
    }
        
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
    


    document.querySelector('#pages').textContent = first+1 + '-' + last + '/' + len

}
 await setDesk();

 
