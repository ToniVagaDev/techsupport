import {
    PhoneService
} from './service.js'
const service = new PhoneService();

// document.querySelectorAll('input.client-info-value, select.client-info-value, .client-info-value.address input ').forEach(inp => {
//     inp.setAttribute('disabled','')
// })
function disableFields(selector) {
    document.querySelectorAll(selector).forEach(inp => {
        inp.setAttribute('disabled', '')
    })
}
if (localStorage.getItem('type') == 'специалист 1-ой линии' || localStorage.getItem('type') == 'специалист 2-ой линии') {
    disableFields('.admin')
} else if (localStorage.getItem('type') != 'руководитель') {
    disableFields('.edit,input.client-info-value, select.client-info-value, .client-info-value.address input ')
}
document.querySelector('.client-delete').addEventListener('click',async () => {
    await service.deleteclient(client[0]._id)
    document.location.reload();
})

document.querySelector('#search-btn').addEventListener('click', getClientByPhone);

document.querySelector('#post-request').addEventListener('click', postRequest);

document.querySelector('#post-client').addEventListener('click', postClient);

document.querySelectorAll('.client-modal input[type = "search"], .client-info-value.address input[type = "search"]').forEach(item => {
    item.addEventListener('focus', createAddressDatalist)
})
const arrowBtns = document.querySelectorAll('.phone-button');
arrowBtns[0].addEventListener('click', async () => {
    await service.updateClient({
        _id: client[0]._id,
        rating: document.querySelector('.rating').value,
        typeId: document.querySelector('#client-type').value
    })
    document.location.reload()
})
arrowBtns[0 + 1].addEventListener('click', prevPhone);
arrowBtns[1 + 1].addEventListener('click', async () => {
    service.deletePhone(client[0].phoneNumbers[phoneIndex]._id);
    getClientByPhone()
});
arrowBtns[2 + 1].addEventListener('click', async () => {
    console.log(client[0].phoneNumbers)

    const phone = await service.postPhone({
        number: document.querySelector('.phone').value,
        balance: 0,
        tariff: document.querySelector('.tariff').value
    })
    console.log(phone)
    await service.updateClient({
        _id: client[0]._id,
        phoneNumbers: [...(client[0].phoneNumbers.map((number) => {
            return number._id
        })), phone._id]
    })
    getClientByPhone()
});
arrowBtns[3 + 1].addEventListener('click', nextPhone);
arrowBtns[4 + 1].addEventListener('click', async () => {
    await service.updatePhone({
        _id: client[0].phoneNumbers[phoneIndex]._id,
        tariff: document.querySelector('.client-info-value.tariff').value
    })
    getClientByPhone();
});
arrowBtns[5 + 1].addEventListener('click', prevAddress);
arrowBtns[6 + 1].addEventListener('click', async () => {
    await service.updateClient({
        _id: client[0]._id,
        address: [...client[0].address.filter((addr) => addr._id != client[0].address[addressIndex]._id).map(addr => addr._id)]
    })
    getClientByPhone();
});
arrowBtns[7 + 1].addEventListener('click', async () => {
    const addressInput = document.querySelectorAll('.client-info-value.address input[type = "search"]')
    const newAddress = await service.getAddressByAddress({
        city: addressInput[0].value,
        street: addressInput[1].value,
        house: addressInput[2].value,
        apartment: addressInput[3].value
    });
    const updatedAddress = await service.updateAddress({
        _id: newAddress._id,
        homeInternetSpeed: document.querySelector('.client-info-value.homeInternet').value
    })
    const updatedClient = await service.updateClient({
        _id: client[0]._id,
        address: [...client[0].address.map(addr => addr._id), newAddress._id]
    })
    getClientByPhone();
});
arrowBtns[8 + 1].addEventListener('click', nextAddress);
arrowBtns[9 + 1].addEventListener('click', async () => {
    await service.updateAddress({
        _id: client[0].address[addressIndex]._id,
        homeInternetSpeed: document.querySelector('.client-info-value.homeInternet').value
    });
    getClientByPhone();
});



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
        cityInputClient = document.querySelectorAll('.client-info-value.address input[type = "search"]'),
        streetInput = document.querySelector('.street'),
        houesInput = document.querySelector('.house');
    localStorage.setItem('city', cityInput.value || cityInputClient[0].value)
    localStorage.setItem('street', streetInput.value || cityInputClient[1].value)
    localStorage.setItem('house', houesInput.value || cityInputClient[2].value)

    addresses.forEach((address) => {
        cities.push(address.city);
        if (address.city == localStorage.getItem('city')) streets.push(address.street);
        if (address.street == localStorage.getItem('street')) houses.push(address.house);
        if (address.house == localStorage.getItem('house')) apartments.push(address.apartment)
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
createSelect('.tariff', await service.getAllTariff());




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
        agreemId = document.querySelector('.client-info-value.agreement'),
        phoneNumber = document.querySelector('.phone'),
        tariff = document.querySelector('.tariff'),
        address = document.querySelectorAll('.client-info-value.address input'),
        homeInternet = document.querySelector('.homeInternet'),
        rating = document.querySelector('.rating'),
        date = document.querySelector('.client-info-value.date');

    fullName.textContent = client.fullName;
    date.value = client.creationDate.slice(0, 10)
    agreemId.value = client.agreementId;
    console.log(addressIndex)
    phoneNumber.value = client.phoneNumbers[phoneIndex].number;
    // Array.from(tariff.children).forEach(option => {
    //     if (option.textContent == client.phoneNumbers[phoneIndex].tariff.name) {
    //         option.setAttribute('selected', '')
    //     } else {
    //         option.removeAttribute('selected');
    //     }
    // })
    // Array.from(homeInternet.children).forEach(option => {
    //     if (option.textContent == client.address[addressIndex].homeInternetSpeed) {
    //         option.setAttribute('selected', '');
    //     } else {
    //         option.removeAttribute('selected');
    //     }
    // })
    homeInternet.value = client.address[addressIndex].homeInternetSpeed;
    tariff.value = client.phoneNumbers[phoneIndex].tariff._id;
    rating.value = client.rating;
    address[0].value = client.address[addressIndex].city;
    address[1].value = client.address[addressIndex].street;
    address[2].value = client.address[addressIndex].house;
    address[3].value = client.address[addressIndex].apartment;
    document.querySelector('.container').style.filter = 'none';

    // document.querySelector('#phoneNumbers').value = client.phoneNumbers[phoneIndex].number
    // document.querySelector('#tariff').value = client.phoneNumbers[phoneIndex].tariff._id
    // document.querySelector('.city').value = client.address[addressIndex].city
    // document.querySelector('.street').value = client.address[addressIndex].street
    // document.querySelector('.house').value = client.address[addressIndex].house
    // document.querySelector('.apartment').value = client.address[addressIndex].apartment
    // document.querySelector('#home-internet-speed').value = client.address[addressIndex].homeInternetSpeed
    // document.querySelector('#fullName').value = client.fullName
    // document.querySelector('#agreementId').value =client.agreementId
    // document.querySelector('#client-type2').value = client.typeId


}
async function mapPhone(phones) {
    return await Promise.all(phones.map(async phone => {
        const res = await service.getPhoneById(phone);
        console.log(res)
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
    console.log(phone)
    // const tar = await service.getTariff(phone[0].tariff);
    try {
            client = await service.getClientByPhoneId(phone[0]._id);
            console.log(client)

        } catch (error) {
           alert('клиент не найден') 
           document.location.reload()
        }
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
        address: client[0].address[addressIndex],
        priority: document.querySelector('#priority').value
    }
    service.postRequest(body)
    setClient(client[0])
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
    let newPhone = null, newAddress = null;
    if (phone.number)  newPhone = await service.postPhone(phone);
    if(address.city){ newAddress = await service.getAddressByAddress(address)
    newAddress.homeInternetSpeed = document.querySelector('#home-internet-speed').value;}
    const client = {
        phoneNumbers: newPhone ? [newPhone._id]: [],
        address: newAddress ? [newAddress._id]: [],
        fullName: document.querySelector('#fullName').value,
        agreementId: document.querySelector('#agreementId').value,
        typeId: document.querySelector('#client-type2').value,
        agreementId: document.querySelector('#agreementId').value,
    }
    await service.postClient(client);
    document.location.reload();
}


// getClientByPhone("+7(999)123-45-67")