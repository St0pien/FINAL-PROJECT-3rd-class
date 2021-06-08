export default class EndScreen {
    constructor(text, videoPath, color) {
        this.ref = document.createElement('div');
        this.ref.classList.add('end-screen');

        this.alert = document.createElement('div');
        this.alert.classList.add('end-alert');
        this.alert.innerHTML = text + "<br>";
        this.alert.style.color = color;
        this.alert.style.borderColor = color;
        this.ref.appendChild(this.alert);
        
        this.background = document.createElement('video');
        this.background.classList.add('end-background');
        this.background.autoplay = true;
        this.background.loop = true;
        this.background.controls = false;
        this.background.src = videoPath;
        this.ref.appendChild(this.background);

        this.link = document.createElement('a');
        this.link.href = "/";
        this.link.innerHTML = "return";
        this.link.style.borderColor = color;
        this.alert.appendChild(this.link);


        document.body.appendChild(this.ref);
    }
}
