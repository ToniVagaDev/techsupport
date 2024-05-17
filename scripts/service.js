class PhoneService {
    _apiBase = 'http://localhost:5500/api';

    async postResource(url, body, headers = ''){
        console.log(JSON.stringify(body))
        const res = await fetch(`${this._apiBase}/${url}`, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : `bearer ${localStorage.getItem('token')}`
            },

            body: JSON.stringify({...body})
        });
        // console.log(res.status)
        if (!res.ok) {
            if(res.status == 403) {
                document.location.href = 'auth.html';
            }
            throw new Error(`Could not fetch ${url} ` +
                `received ${res.status}`, (await res.json()).message);
        }
        return await res.json()
    }
    
    async postRequest(body, headers = ''){
        this.postResource('/request', body, headers)
    }

    async getResource(url) {

        const res = await fetch(`${this._apiBase}/${url}`, {
            method: 'GET',
            headers: {
                'Authorization' : `bearer ${localStorage.getItem('token')}`
            }
        });
        // console.log(res.status)
        if (!res.ok) {
            if(res.status == 403) {
                document.location.href = 'auth.html';
            }
            throw new Error( (await res.json()).message);
        }
        return await res.json()
    }
    async getAllRequests(){
        return await this.getResource('/requests')
    }
    async getRequest(id){
        return await this.getResource(`/request/${id}`)
    }
    async getAllRequestType(){
        return await this.getResource('/requestTypes')
    }
    async getRequestType(id){
        return await this.getResource(`/requestType/${id}`)
    }
    async getAllSpecialistType(){
        return await this.getResource('/specialistTypes')
    }
    async getSpecialistType(id){
        return await this.getResource(`/specialistType/${id}`)
    }
    async getPhoneId(phone) {
        return await this.getResource(`/phones/id/${phone}`)
    }

    async getPhoneById(id) {
        return await this.getResource(`/phones/${id}`)
    }

    async getAddressById(id) {
        return await this.getResource(`/address/${id}`)
    }

    async getClientTypeById(id) {
        return await this.getResource(`/clientType/${id}`)
    }

    async getPhone(phone) {
        return await this.getResource(`/phones/phone/${phone}`)
    }

    async getTariff(tariffId) {
        return await this.getResource(`tariffs/${tariffId}`)
    }

    async getClientByPhoneId(phoneId) {
        return await this.getResource(`/client/phone/${phoneId}`)
    }

}
export { PhoneService}