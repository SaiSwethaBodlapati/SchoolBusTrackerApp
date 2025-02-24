const token = localStorage.getItem('token');
const email = localStorage.getItem('email');

if(!token || !email){
    window.location.href = '/public'
}
