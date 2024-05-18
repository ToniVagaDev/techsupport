import {
    PhoneService
} from './service.js'
const service = new PhoneService();

document.querySelector('#search-btn').addEventListener('click', getClientByPhone);

document.querySelector('#post-request').addEventListener('click', postRequest);

document.querySelector('#post-client').addEventListener('click', postClient);

document.querySelectorAll('.client-modal input[type = "search"]').forEach(item => {
    item.addEventListener('focus', createAddressDatalist)
})
const arrowBtns = document.querySelectorAll('.phone-button');
arrowBtns[0].addEventListener('click', prevPhone);
arrowBtns[1].addEventListener('click', nextPhone);
arrowBtns[2].addEventListener('click', prevAddress);
arrowBtns[3].addEventListener('click', nextAddress);



function createSelect(selector, selectionArr) {
    const select = document.querySelector(selector)
    selectionArr.forEach(type => {
        const option = document.createElement('option');
        option.textContent = type.name;
        option.value = type._id;
        select.append(option);
    })
}

async function createAddressDatalist(filter) {
    document.querySelector('#cities').innerHTML = "";
    document.querySelector('#streets').innerHTML = "";
    document.querySelector('#houses').innerHTML = "";
    document.querySelector('#apartments').innerHTML = "";

    let cities = [],
        streets = [],
        houses = [],
        apartments = []
    const addresses = await service.getAllAddresses(),
        cityInput = document.querySelector('.city'),
        streetInput = document.querySelector('.street'),
        houesInput = document.querySelector('.house');
        
    addresses.forEach((address) => {
        cities.push(address.city);
        if(address.city == cityInput.value) streets.push(address.street);
        if(address.street == streetInput.value) houses.push(address.house);
        if(address.house == houesInput.value) apartments.push(address.apartment)
    })
    const uniqueCities = [...new Set(cities)]
    const uniqueStreets = [...new Set(streets)]
    const uniqueHouses = [...new Set(houses)]
    const uniqueApartments = [...new Set(apartments)]
    uniqueCities.forEach(city => {
        const option = document.createElement('option');
        option.textContent = city;
        document.querySelector('#cities').append(option);
    })
    uniqueStreets.forEach(street => {
        const option = document.createElement('option');
        option.textContent = street;
        document.querySelector('#streets').append(option);
    })
    uniqueHouses.forEach(house => {
        const option = document.createElement('option');
        option.textContent = house;
        document.querySelector('#houses').append(option);
    })
    uniqueApartments.forEach(apartment => {
        const option = document.createElement('option');
        option.textContent = apartment;
        document.querySelector('#apartments').append(option);
    })

}
createSelect('#ticket-type', await service.getAllRequestType());
createSelect('#specialist', await service.getAllSpecialistType());
createSelect('#client-type', await service.getAllClientType());
createSelect('#client-type2', await service.getAllClientType());
createSelect('#tariff', await service.getAllTariff());




let client
let phoneIndex = 0;
let addressIndex = 0;

function nextPhone() {
    phoneIndex = (phoneIndex + 1) % client[0].phoneNumbers.length;
    setClient(client[0])
}

function prevPhone() {
    phoneIndex = Math.abs(phoneIndex - 1) % client[0].phoneNumbers.length;
    setClient(client[0])
}

function nextAddress() {
    addressIndex = (addressIndex + 1) % client[0].address.length;
    setClient(client[0])
}

function prevAddress() {
    addressIndex = Math.abs(addressIndex - 1) % client[0].address.length;
    setClient(client[0])
}

function setClient(client) {

    const fullName = document.querySelector('.header'),
        agreemId = document.querySelector('.agreement'),
        phoneNumber = document.querySelector('.phone'),
        tariff = document.querySelector('.tariff'),
        address = document.querySelectorAll('.client-info-value.address input'),
        homeInternet = document.querySelector('.homeInternet'),
        email = document.querySelector('.email');

    console.log(client)
    fullName.textContent = client.fullName;
    agreemId.value = client.agreementId;
    email.value = client.email;
    console.log(phoneIndex)
    phoneNumber.value = client.phoneNumbers[phoneIndex].number;
    Array.from(tariff.children).forEach(option => {
        if (option.textContent == client.phoneNumbers[phoneIndex].tariff.name) {
            option.setAttribute('selected', '')
        } else {
            option.removeAttribute('selected');
        }
    })
    Array.from(homeInternet.children).forEach(option => {
        if (option.textContent == client.address[addressIndex].homeInternetSpeed) {
            option.setAttribute('selected', '');
        } else {
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
async function mapPhone(phones) {
    return await Promise.all(phones.map(async phone => {
        const res = await service.getPhoneById(phone);
        const tariff = await service.getTariff(res.tariff);
        res.tariff = tariff;
        // res.then(res => {
        //     res.tariff = service.getTariff(res.tariff)
        // })
        return res
    }))
}
async function mapAddress(addresses) {
    return await Promise.all(addresses.map(address => {
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

async function postRequest() {
    const date = new Date();
    console.log(client)
    const body = {
        status: 'open',
        creationDate: date,
        clientId: client[0]._id,
        phoneNumber: client[0].phoneNumbers[phoneIndex] /*document.querySelector('#phone').value*/ ,
        status: 'open',
        description: document.querySelector('#description').value,
        specialistType: document.querySelector('#specialist').value,
        typeId: document.querySelector('#ticket-type').value,
        address: client[0].address[addressIndex]
    }
    service.postRequest(body)
}
async function postClient() {
    const phone = {
        number: document.querySelector('#phoneNumbers').value,
        tariff: document.querySelector('#tariff').value,
    }
    const address = {
        city: document.querySelector('.city').value,
        street: document.querySelector('.street').value,
        house: document.querySelector('.house').value,
        apartment: document.querySelector('.apartment').value
    }

    const newPhone = await service.postPhone(phone);
    const newAddress = await service.getAddressByAddress(address)
    newAddress.homeInternetSpeed = document.querySelector('#home-internet-speed').value;
    const client = {
        phoneNumbers:[newPhone._id],
        address: [newAddress._id],
        fullName: document.querySelector('#fullName').value,
        agreementId: document.querySelector('#agreementId').value,
        typeId: document.querySelector('#client-type2').value,
        agreementId: document.querySelector('#agreementId').value,
    }
    await service.postClient(client);
}


// getClientByPhone("+7(999)123-45-67")