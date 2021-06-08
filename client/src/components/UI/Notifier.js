export default class Notifier {
    constructor() {
        this.ref = document.createElement('div');
        this.ref.classList.add('notifier');
        this.ref.innerHTML = 'Access Granted';
        document.body.appendChild(this.ref);
        this.timeout = null;
    }

    showGoodNotification(text) {
        this.ref.innerHTML = text;
        this.ref.style.animationName = 'flash-good'
        this.ref.style.borderColor = 'var(--green)'
        this.ref.style.display = 'flex';
        this.hide();
    }

    showBadNotification(text) {
        this.ref.innerHTML = text;
        this.ref.style.borderColor = 'var(--red)'
        this.ref.style.animationName = 'flash-bad'
        this.ref.style.display = 'flex';
        this.hide();
    }

    hide() {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.ref.style.display = 'none';
        }, 3000)
    }
}