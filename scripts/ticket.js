import {
    PhoneService
} from "./service.js";
const reader = new FileReader();
const service = new PhoneService();
try {
    const request = await service.getRequest(localStorage.getItem('request'))
    if (request.status == 'open') await service.updateRequest({_id: localStorage.getItem("request"),specialistId: [...request.specialistId, localStorage.getItem("id")] , status: "in progress"});
else if(request.status == 'closed') {localStorage.setItem('request', '')}
const client = await service.getClientById(request.clientId);
const phone = await service.getPhoneById(request.phoneNumber);
const clientType = await service.getClientTypeById(client.typeId)
const requestType = await service.getRequestType(request.typeId)
const address = await service.getAddressById(request.address)
document.querySelector('#fullname').textContent = client.fullName;
document.querySelector('#phone').textContent = phone.number;
document.querySelector('#client-type').textContent = clientType.name;
document.querySelector('#address').textContent = `Г. ${address.city}, ул. ${address.street}, дом ${address.house}, квартира ${address.apartment}`;
document.querySelector('#date').textContent = request.creationDate.slice(0, 16).split('T').join(' ');
document.querySelector('#request-type').textContent = requestType.name;
document.querySelector('#description').textContent = request.description;
document.querySelector('#done').textContent = request.work;
console.log(request.status)
if(request.status == 'closed'){
    document.querySelector('#close-req').classList.add('non-active')
}
if(request.status == 'failed' || request.status == 'closed'){
    const btnSupportSpec = document.createElement('a')
    btnSupportSpec.textContent = 'Номер специалиста'
    btnSupportSpec.classList.add('button')
    btnSupportSpec.addEventListener('click' , async () => {  alert((await service.getSupportSpecialist(request.specialistId[0])).phoneNumber)})
    document.querySelector('.button-container').prepend(btnSupportSpec)
}
async function closeRequest() {
    console.log(document.querySelector('#imageFile'))
    console.log(document.querySelector('#imageFile').files)
    const formData = new FormData();

    formData.append('_id',request._id)
    Array.from(document.querySelector('#imageFile').files).forEach(file => {
        formData.append('imgfile', file)
    })
    Array.from(document.querySelector('#audioFile').files).forEach(file => {
        formData.append('audiofile', file)
    })
    if(document.querySelector('#solutionCheckBox').checked){
        formData.append('status', 'failed')
    }
     else  formData.append('status', 'closed')

     formData.append('work', document.querySelector('#resolution').value)
    console.log(formData.get('imgfile'))

    const response = await fetch('http://localhost:5500/api/requests', {
        method: 'PUT',
        headers: {
        //             "Content-Type": "multipart/form-data",
                    'Authorization' : `bearer ${localStorage.getItem('token')}`
                },
        body: formData
    });
    localStorage.setItem('request', '')
    document.location.href = 'index.html'
    // console.log(formData)
    // const response = await fetch('http://localhost:5500/api/requestsfuck', {
    //     method: 'PUT',
    //     headers: {
    //         // "Content-Type": "multipart/form-data",
    //         // 'Authorization' : `bearer ${localStorage.getItem('token')}`
    //     },
    //     body: formData
    // })
    // if (!res.ok) {
    //     if (res.status == 403) {
    //         document.location.href = 'auth.html';
    //     }
    //     throw new Error(`Could not fetch ${url} ` +
    //         `received ${res.status}`, (await res.json()).message);
    // };


}

document.querySelector('#request-close-btn').addEventListener('click', closeRequest)
request.executionMaterials.forEach((file) => {
    console.log(file)
    document.querySelector('.files-modal').innerHTML += `
    <img class = "req-img" src = "src/${file}">
    `
})
request.audioMaterials.forEach((file) => {
    console.log(file)
    document.querySelector('.files-modal').innerHTML += `
    <audio controls src = "src/${file}"></audio>
    `
})

} catch (error) {
    alert("Нет обращения")
    document.location.href = 'index.html'

}


