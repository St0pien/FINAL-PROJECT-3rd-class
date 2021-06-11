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

        this.nicks = document.createElement('div');
        this.nicks.classList.add('nicks');

        this.player = document.createElement('span');
        this.player.classList.add('player-nick');
        this.nicks.appendChild(this.player);

        const vs = document.createElement('span');
        vs.classList.add('vs');
        vs.innerHTML = " VS ";
        this.nicks.appendChild(vs);

        this.enemy = document.createElement('span');
        this.enemy.classList.add('enemy-nick');
        this.nicks.appendChild(this.enemy);

        this.ref.appendChild(this.nicks);
    }

    showTurn(isMyTurn) {
        if (isMyTurn) {
            this.turnIndicator.innerHTML = 'Your turn';
            this.turnIndicator.style.color = 'var(--green)';
            this.turnIndicator.style.textShadow = '1px 1px 10px green';
        } else {
            this.turnIndicator.innerHTML = 'Enemy turn';
            this.turnIndicator.style.color = 'var(--red)';
            this.turnIndicator.style.textShadow = '1px 1px 10px red';
        }
    }

    setAction(action) {
        this.actionIndicator.innerHTML = action
    }

    setNicks(player, enemy) {
        this.player.innerHTML = player;
        this.enemy.innerHTML = enemy;
    }
}