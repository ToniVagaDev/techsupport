class PhoneService {
    _apiBase = 'http://localhost:5500/api';

    async postResource(url, request, headers){
        const res = await fetch(`${this._apiBase}/${url}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(request)
        });
        // console.log(res.status)
        if (!res.ok) {
            throw new Error(`Could not fetch ${url} ` +
                `received ${res.status}`);
        }
        return await res.json()
    }

    async getResource(url) {

        const res = await fetch(`${this._apiBase}/${url}`, {
            method: 'GET',
        });
        // console.log(res.status)
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}` +
                `received ${res.status}`);
        }
        return await res.json()
    }
    async getAllSpecialistType(){
        return await this.getResource('/specialistTypes')
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