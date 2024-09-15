import { PhoneService } from "./service.js";

const service = new PhoneService();
let editId;

// else noHaram = ['специалист 2-ой линии','специалист 1-ой линии','инженер', 'менеджер по работе с клиентами']
function createSelect(selector, selectionArr) {
    // if(localStorage.getItem('type') == 'ADMIN') selectionArr = selectionArr.filter(item => item.name == 'руководитель') 
    //     else selectionArr = selectionArr.filter(item => (item.name != 'руководитель' && item.name != 'ADMIN'))
    const select = document.querySelector(selector)
    selectionArr.forEach(type => {
        
            const option = document.createElement('option');
            option.textContent = type.name;
            option.value = type._id;
            select.append(option);
        
    })
}

createSelect('#specialist-type', await service.getAllSpecialistType())
createSelect('#specialist-typeEdit', await service.getAllSpecialistType())
function delUser(id){
    return async () => {await service.deleteSupportSpecialist(id); document.location.reload()}
}

const users = await service.getAllSupportSpecialist()
Array.from(users).forEach((user,i) => {

    document.querySelector('#userList').innerHTML += `<tr>
    <td>${i+1}</td>
    <td>${user.login}</td>
    <td>${user.phoneNumber}</td>
    <td>${user.type.name}</td>
    <td>
        <span class ="action-buttons delete" id="action-button${i}" >Удалить</span>/<span class ="action-buttons edit" id="edit-button${i}" >Изменить</span>
    </td>
</tr>`    
})
document.querySelectorAll(`.delete`).forEach((btn, i) => {
    btn.addEventListener('click', delUser(users[i]._id))
})
document.querySelectorAll(`.edit`).forEach((btn, i) => {
    btn.addEventListener('click', updateSpec(i))
})
function updateSpec(i){
    return () =>{
        document.querySelector(`#editUserForm`).style.display = 'block';
        document.querySelector('#userNameEdit').value = users[i].login;
        document.querySelector('#userPhoneEdit').value = users[i].phoneNumber;
        document.querySelector('#specialist-typeEdit').value = users[i].typeId
        editId = users[i]._id;

    } 
}
function registration(){
    service.postSupportSpecialist({
        login: document.querySelector('#userName').value,
        phoneNumber: document.querySelector('#userPhone').value,
        password: document.querySelector('#userPassword').value,
        typeId: document.querySelector('#specialist-type').value
    })
    document.location.reload()
}
function edit(){
    console.log()
    service.updateSupportSpecialist({
        _id: editId,
        login: document.querySelector('#userNameEdit').value,
        phoneNumber: document.querySelector('#userPhoneEdit').value,
        password: document.querySelector('#userPasswordEdit').value,
        typeId: document.querySelector('#specialist-typeEdit').value
    })
    document.location.reload()
}

document.querySelector('#editUserForm .submit-button').addEventListener('click', edit)
document.querySelector('#addUserForm .submit-button').addEventListener('click', registration )
