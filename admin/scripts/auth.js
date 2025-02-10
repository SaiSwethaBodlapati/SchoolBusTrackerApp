const token = sessionStorage.getItem('token');
const email = sessionStorage.getItem('email');

if(!token || !email){
    window.location.href = '/public'
}
