export default class Toolbar {
    constructor(io) {
        this.io = io;

        this.ref = document.createElement('div');
        this.ref.classList.add('toolbar');
        this.turnIndicator = document.createElement('div');
        this.turnIndicator.classList.add('turn');
        document.body.appendChild(this.ref);
        this.ref.appendChild(this.turnIndicator);

        this.io.on('turn', isMyTurn => {
            this.showTurn(isMyTurn);
        });
    }

    showTurn(isMyTurn) {
        if (isMyTurn) {
            this.turnIndicator.innerHTML = 'Your turn';
            this.turnIndicator.style.color = 'green';
        } else {
            this.turnIndicator.innerHTML = 'Enemy turn';
            this.turnIndicator.style.color = 'red';
        }
    }
}