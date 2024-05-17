const ls =  localStorage;
// if(!ls.getItem("token")){
//     document.location.href = 'auth.html'
// }


class AuthService {
    _apiBase = 'http://localhost:5500/auth';

    async postResource(url, body, headers = ''){
        const res = await fetch(`${this._apiBase}/${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({...body})
        });
        
        // console.log(res.status)
        if (!res.ok) {
            
            throw new Error( (await res.json()).message);
        }
        return await res.json()
    }
    
    async logIn(body, headers = ''){
        return await this.postResource('/login', body, headers)
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
   
}

const service = new AuthService();

async function logIn(){
    const login = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    const token = await service.logIn({login, password})
    console.log(token);
    ls.setItem('token' , token.token)
    document.location.href = 'index.html'
    
}

// export { AuthService}
