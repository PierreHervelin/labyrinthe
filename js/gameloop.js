var game=new Game('map');
var pauseDiv=document.querySelector('div.blink');

window.onkeydown=(e)=>{
    switch (e.key) {
        case 'ArrowLeft':
            game.getRobot(0).move('left');
            break;
        case 'ArrowRight':
            game.getRobot(0).move('right');
            break;
        case 'ArrowUp':
            game.getRobot(0).move('top');
            break;
        case 'ArrowDown':
            game.getRobot(0).move('bottom');
            break;
        default:
            break;
    }
}
window.onkeyup=(e)=>{
    switch (e.key) {
        case 'e':
            game.getRobot(0).fire();
            break;
        case ' ':
            switch (game.getState()) {
                case 'started':
                    game.pause();
                    pauseDiv.style.display='block';
                    break;
                case 'paused':
                    game.start();
                    pauseDiv.style.display='none';
                case 'stopped':
                    game.start();
                    pauseDiv.style.display='none';
                    break;
                default:
                    break;
            }
            break;
        case 'Enter':
            if(game.getState()=='started'){
                game.stop();
                pauseDiv.style.display='block';
            }
            break;
        default:
            break;
    }
}