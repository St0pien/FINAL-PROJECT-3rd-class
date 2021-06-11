const btn = document.querySelector('#btn');
const message = document.querySelector('#message');
const link = document.querySelector('a');

const login = document.querySelector('#login');
const password = document.querySelector('#password');
const confirmPass = document.querySelector('#confirm');

function send() {
    fetch('', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            login: login.value,
            password: password.value,
            confirm: confirmPass.value
        })
    })
    .then(res => res.text())
    .then(text => {
        if (text != "OK") {
            message.innerHTML = text;
        } else {
            link.style.display = "block";
            message.innerHTML = "Now you can login";
        }
    });
}

btn.addEventListener('click', send);
addEventListener('keypress', e => {
    if (e.code == "Enter") send();
});
