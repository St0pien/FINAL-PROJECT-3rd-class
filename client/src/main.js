import Main from './components/Main';
import './css/main.css';

function init() {
    const container = document.querySelector('#root');
    new Main(container);
}

init();
