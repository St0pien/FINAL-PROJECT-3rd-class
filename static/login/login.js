const btn = document.querySelector('#btn');
const message = document.querySelector('#message');
const link = document.querySelector('a');

const login = document.querySelector('#login');
const password = document.querySelector('#password');

function send() {
    fetch('', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            login: login.value,
            password: password.value,
        })
    })
    .then(res => res.text())
    .then(text => {
        if (text != "OK") {
            message.innerHTML = text;
        } else {
            location.replace('/');
        }
    });
}

btn.addEventListener('click', send);
addEventListener('keypress', e => {
    if (e.code == "Enter") send();
});
