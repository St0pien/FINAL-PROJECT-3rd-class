export default class Menu {
    constructor(onStart) {
        this.ref = document.createElement('div');
        this.ref.classList.add('menu');
        document.body.appendChild(this.ref);

        this.startButton = document.createElement('button');
        this.startButton.classList.add('button');
        this.ref.appendChild(this.startButton);

        this.showStats();

        this.startButton.addEventListener('click', onStart);
        this.startButton.innerHTML = 'Start';

        this.loading = document.querySelector('.loading');
        this.loading.remove();
        
        this.loadingText = this.loading.querySelector('.text');
        this.loadingText.innerHTML = 'Waiting for enemy';
    }

    showStats() {
        this.nick = document.createElement('div');
        this.nick.classList.add('nick');
        this.stats = document.createElement('div');
        this.stats.classList.add('stats');
        this.wins = document.createElement('div');
        this.wins.classList.add('wins');
        this.defeats = document.createElement('div');
        this.defeats.classList.add('defeats');
        this.ratio = document.createElement('div');
        this.ratio.classList.add('ratio');

        fetch(`${process.env.API_URL}stats`)
        .then(res => res.json())
        .then(data => {
            const { user, wins, defeats } = data;

            this.nick.innerHTML = user;
            this.wins.innerHTML = `${wins} wins`;
            this.defeats.innerHTML = `${defeats} defeats`;
            const ratio = wins && defeats ? wins/(wins+defeats) : 0;
            this.ratio.innerHTML = `${ratio.toFixed(2)} win rate`;
        });

        this.stats.appendChild(this.wins);
        this.stats.appendChild(this.defeats);
        this.stats.appendChild(this.ratio);
        this.stats.appendChild(this.nick);

        this.ref.appendChild(this.stats);
    }

    wait() {
        this.startButton.remove();
        this.stats.remove();
        this.ref.appendChild(this.loading);
    }

    load() {    
        this.loadingText.innerHTML = 'Loading...';
    }

    hide() {
        this.ref.remove();
    }
}