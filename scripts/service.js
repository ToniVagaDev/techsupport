class PhoneService {
    _apiBase = 'http://localhost:5500/api';
    async delResource(url) {

        const res = await fetch(`${this._apiBase}/${url}`, {
            method: 'DELETE',
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

    async deleteSupportSpecialist(id){
        return await this.delResource(`specialist/${id}`)
    }

    async deletePhone(id){
        return await this.delResource(`phones/${id}`)
    }

    async deleteAddress(id){
        return await this.delResource(`address/${id}`)
    }
    async deleteclient(id){
        return await this.delResource(`client/${id}`)
    }
    async postResource(url, body, method = 'POST' ){
        const res = await fetch(`${this._apiBase}/${url}`, {
            method: `${method}`,
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
    async postSupportSpecialist(body){
        return await this.postResource('/specialist', body)

    }

    async postRequest(body){
        return await this.postResource('/request', body)
    }
    async updateRequest( body){
        return await this.postResource('/requests', body, 'PUT')
    }

    async postClient(body){
        return await this.postResource('/client', body)
    }
    async updateClient(body){
        return await this.postResource('/client', body, 'PUT')
    }


    async postPhone(body){
        return await this.postResource('/phones', body)
    }
    async updatePhone(body){
        return await this.postResource('/phones', body, 'PUT')
    }


    async postAddress(body){
        return await this.postResource('/address', body)
    }
    async updateAddress(body){
        return await this.postResource('/address', body, 'PUT')
    }
    async updateSupportSpecialist(body){
        return await this.postResource('/specialists', body, 'PUT')
    }

    async updateTariff(body){
        return await this.postResource('/tariffs', body, 'PUT')
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

    async getAllSupportSpecialist(){
        return await this.getResource('/specialists')
    }
    async getSupportSpecialist(id){
        return await this.getResource(`/specialist/${id}`)
    }

    async getAllRequests(){
        return await this.getResource('/requests')
    }
    async getAllClosedRequests(){
        return await this.getResource('/requests/closed')
    }
    async getAllFailedRequests(){
        return await this.getResource('/requests/failed')
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
    async getAllAddresses() {
        return await this.getResource(`/addresses`)
    }
    async getAddressByAddress(address) {
        console.log(Object.values(address).join('.'))
        return await this.getResource(`/address/byAddress/${Object.values(address).join('.')}`)
    }

    async getClientTypeById(id) {
        return await this.getResource(`/clientType/${id}`)
    }
    async getAllClientType(){
        return await this.getResource('/clientTypes')
    }

    async getPhone(phone) {
        return await this.getResource(`/phones/phone/${phone}`)
    }

    async getTariff(tariffId) {
        return await this.getResource(`tariffs/${tariffId}`)
    }

    async getAllTariff() {
        return await this.getResource(`tariffs`)
    }

    async getClientByPhoneId(phoneId) {
        return await this.getResource(`/client/phone/${phoneId}`)
    }

    async getClientById(Id) {
        return await this.getResource(`client/${Id}`)
    }

}
export { PhoneService}