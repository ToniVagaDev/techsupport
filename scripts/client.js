class PhoneService {
    _apiBase = 'http://localhost:5000/api';

    async getResource(url){
        
        const res = await fetch(`${this._apiBase}/${url}`,{
            method: 'GET'
        });
        console.log(res.status)
        if(!res.ok){
            throw new Error(`Could not fetch ${url}` + 
            `received ${res.status}`);
        }
        return await res.json()
    }

    async getId(phone){
         return await this.getResource(`/phones/id/${phone}`)
    }

    async getPhone(phone){
        return await this.getResource(`/phones/${phone}`)
    }
   
}

l
const service =new PhoneService();
async function getPhoneId(phone){
    console.log( await service.getPhone(phone))
}
getPhoneId("+7(999)123-45-67")

 
