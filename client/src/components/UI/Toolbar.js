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

        this.actionIndicator = document.createElement('div');
        this.actionIndicator.classList.add('action');
        this.ref.appendChild(this.actionIndicator);
    }

    showTurn(isMyTurn) {
        if (isMyTurn) {
            this.turnIndicator.innerHTML = 'Your turn';
            this.turnIndicator.style.color = 'green';
            this.turnIndicator.style.textShadow = '1px 1px 10px green';
        } else {
            this.turnIndicator.innerHTML = 'Enemy turn';
            this.turnIndicator.style.color = 'red';
            this.turnIndicator.style.textShadow = '1px 1px 10px red';
        }
    }

    setAction(action) {
        this.actionIndicator.innerHTML = action
    }
}