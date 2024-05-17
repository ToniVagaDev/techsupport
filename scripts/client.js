
import {PhoneService} from './service.js'
const service = new PhoneService();

document.querySelector('#search-btn').addEventListener('click' ,getClientByPhone);

document.querySelector('#post-request').addEventListener('click', postRequest);

const arrowBtns = document.querySelectorAll('.phone-button');
arrowBtns[0].addEventListener('click', prevPhone);
arrowBtns[1].addEventListener('click', nextPhone);
arrowBtns[2].addEventListener('click', prevAddress);
arrowBtns[3].addEventListener('click', nextAddress);

const specTypeSelect = document.querySelector('#specialist');
const specTypes = await service.getAllSpecialistType();
specTypes.forEach((type) => {
    const option = document.createElement('option');
    option.textContent = type.name;
    option.value = type._id;
    specTypeSelect.append(option);
})
const reqTypeSelect = document.querySelector('#ticket-type')
const reqType = await service.getAllRequestType()
reqType.forEach(type => {
    const option = document.createElement('option');
    option.textContent = type.name;
    option.value = type._id;
    reqTypeSelect.append(option);
})

let client
let phoneIndex = 0;
let addressIndex = 0;
function nextPhone(){
    phoneIndex = (phoneIndex + 1) % client[0].phoneNumbers.length;
    setClient(client[0])
}
function prevPhone(){
    phoneIndex = Math.abs(phoneIndex - 1) % client[0].phoneNumbers.length;
    setClient(client[0])
}
function nextAddress(){
    addressIndex = (addressIndex + 1) % client[0].address.length;
    setClient(client[0])
}
function prevAddress(){
    addressIndex = Math.abs(addressIndex - 1) % client[0].address.length;
    setClient(client[0])
}
function setClient(client){
    
    const fullName  = document.querySelector('.header'),
    agreemId = document.querySelector('.agreement'),
    phoneNumber = document.querySelector('.phone'),
    tariff = document.querySelector('.tariff'),
    address = document.querySelectorAll('.client-info-value.address input'),
    homeInternet = document.querySelector('.homeInternet'),
    email = document.querySelector('.email');
    console.log(client)
    fullName.textContent = client.fullName;
    agreemId.value = client.agreementId;
    console.log(phoneIndex)
    phoneNumber.value = client.phoneNumbers[phoneIndex].number;
    Array.from(tariff.children).forEach(option => {
        if(option.textContent == client.phoneNumbers[phoneIndex].tariff.name){
            option.setAttribute('selected', '')
        }else{
            option.removeAttribute('selected');
        }
    })
    Array.from(homeInternet.children).forEach(option => {
        if(option.textContent == client.address[addressIndex].homeInternetSpeed){
            option.setAttribute('selected', '');
        }else{
            option.removeAttribute('selected');
        }
    })
    // tariff. = client.phoneNumbers[0].tariff;
    address[0].value = client.address[addressIndex].city;
    address[1].value = client.address[addressIndex].street;
    address[2].value = client.address[addressIndex].house;
    address[3].value = client.address[addressIndex].apartment;
    document.querySelector('.container').style.filter = 'none'; 


}
  async function mapPhone(phones){ 
    return  await Promise.all( phones.map( async phone => {
        const res = await service.getPhoneById(phone);
        const tariff = await service.getTariff(res.tariff);
        res.tariff = tariff;
        // res.then(res => {
        //     res.tariff = service.getTariff(res.tariff)
        // })
        return res
    }))
}
async function mapAddress(addresses){
    return  await Promise.all( addresses.map( address => {
        return service.getAddressById(address)
    }))
}


async function getClientByPhone() {
    const phoneNumber = document.querySelector('#search').value
    const phone = await service.getPhone(phoneNumber);
    const tar = await service.getTariff(phone[0].tariff);
    client = await service.getClientByPhoneId(phone[0]._id);

    let phones = await mapPhone(Array.from(client[0].phoneNumbers));
    let addresses = await mapAddress(Array.from(client[0].address))
    client[0].phoneNumbers = phones;
    client[0].address = addresses;
    client[0].type = await service.getClientTypeById(client[0].typeId)
    // console.log(client[0])
    setClient(client[0]);
}

async function postRequest(){
    const date = new Date();
    console.log(client)
    const body = {
        status: 'open',
        creationDate: date,
        clientId: client[0]._id,
        phoneNumber: client[0].phoneNumbers[phoneIndex] /*document.querySelector('#phone').value*/,
        status: 'open',
        description: document.querySelector('#description').value,
        specialistType: document.querySelector('#specialist').value,
        typeId: document.querySelector('#ticket-type').value,
        address: client[0].address[addressIndex]
    }
    service.postRequest(body)
}

// getClientByPhone("+7(999)123-45-67")