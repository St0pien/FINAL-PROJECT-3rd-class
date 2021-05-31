export default class Menu {
    constructor(onStart) {
        this.ref = document.createElement('div');
        this.ref.classList.add('menu');
        document.body.appendChild(this.ref);

        this.startButton = document.createElement('button');
        this.startButton.classList.add('start');
        this.ref.appendChild(this.startButton);

        this.startButton.addEventListener('click', onStart);
        this.startButton.innerHTML = 'Start';

        this.loading = document.createElement('div');
        this.loading.classList.add('loading');
        this.loading.innerHTML = 'Waiting for enemy...';
    }

    wait() {
        this.startButton.remove();
        this.ref.appendChild(this.loading);
    }

    load() {
        this.loading.innerHTML = 'Loading...';
    }

    hide() {
        this.ref.remove();
    }
}