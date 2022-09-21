
document.addEventListener("DOMContentLoaded", function(event) {

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    const keyboardFrequencyMap = {
        '90': 261.625565300598634,  //Z - C
        '83': 277.182630976872096, //S - C#
        '88': 293.664767917407560,  //X - D
        '68': 311.126983722080910, //D - D#
        '67': 329.627556912869929,  //C - E
        '86': 349.228231433003884,  //V - F
        '71': 369.994422711634398, //G - F#
        '66': 391.995435981749294,  //B - G
        '72': 415.304697579945138, //H - G#
        '78': 440.000000000000000,  //N - A
        '74': 466.163761518089916, //J - A#
        '77': 493.883301256124111,  //M - B
        '81': 523.251130601197269,  //Q - C
        '50': 554.365261953744192, //2 - C#
        '87': 587.329535834815120,  //W - D
        '51': 622.253967444161821, //3 - D#
        '69': 659.255113825739859,  //E - E
        '82': 698.456462866007768,  //R - F
        '53': 739.988845423268797, //5 - F#
        '84': 783.990871963498588,  //T - G
        '54': 830.609395159890277, //6 - G#
        '89': 880.000000000000000,  //Y - A
        '55': 932.327523036179832, //7 - A#
        '85': 987.766602512248223,  //U - B
    }

    const pictures = {
        '90': "https://github.com/madisonwfong/compsoundlab1pics/blob/main/IMG_1330.JPG?raw=true",  //Z - C
        '83': "https://github.com/madisonwfong/compsoundlab1pics/blob/main/IMG_1331.JPG?raw=true", //S - C#
        '88': "https://github.com/madisonwfong/compsoundlab1pics/blob/main/IMG_1332.JPG?raw=true",  //X - D
        '68': "https://github.com/madisonwfong/compsoundlab1pics/blob/main/IMG_1333.JPG?raw=true", //D - D#
        '67': "https://github.com/madisonwfong/compsoundlab1pics/blob/main/IMG_1334.JPG?raw=true",  //C - E
        '86': "https://github.com/madisonwfong/compsoundlab1pics/blob/main/IMG_1335.JPG?raw=true",  //V - F
        '71': "https://github.com/madisonwfong/compsoundlab1pics/blob/main/IMG_1336.JPG?raw=true", //G - F#
        '66': "https://github.com/madisonwfong/compsoundlab1pics/blob/main/IMG_1337.JPG?raw=true",  //B - G
        '72': "https://github.com/madisonwfong/compsoundlab1pics/blob/main/IMG_1338.JPG?raw=true", //H - G#
        '78': "https://github.com/madisonwfong/compsoundlab1pics/blob/main/IMG_1339.JPG?raw=true",  //N - A
        '74': "https://github.com/madisonwfong/compsoundlab1pics/blob/main/IMG_1340.JPG?raw=true", //J - A#
        '77': "https://github.com/madisonwfong/compsoundlab1pics/blob/main/IMG_1341.JPG?raw=true",  //M - B
        '81': "https://github.com/madisonwfong/compsoundlab1pics/blob/main/IMG_1342.JPG?raw=true",  //Q - C
        '50': "https://github.com/madisonwfong/compsoundlab1pics/blob/main/IMG_1343.JPG?raw=true", //2 - C#
        '87': "https://github.com/madisonwfong/compsoundlab1pics/blob/main/IMG_1344.JPG?raw=true",  //W - D
        '51': "https://github.com/madisonwfong/compsoundlab1pics/blob/main/IMG_1345.JPG?raw=true", //3 - D#
        '69': "https://github.com/madisonwfong/compsoundlab1pics/blob/main/IMG_1346.JPG?raw=true",  //E - E
        '82': "https://github.com/madisonwfong/compsoundlab1pics/blob/main/IMG_1347.JPG?raw=true",  //R - F
        '53': "https://github.com/madisonwfong/compsoundlab1pics/blob/main/IMG_1348.JPG?raw=true", //5 - F#
        '84': "https://github.com/madisonwfong/compsoundlab1pics/blob/main/IMG_1349.JPG?raw=true",  //T - G
        '54': "https://github.com/madisonwfong/compsoundlab1pics/blob/main/IMG_1350.JPG?raw=true", //6 - G#
        '89': "https://github.com/madisonwfong/compsoundlab1pics/blob/main/IMG_1351.JPG?raw=true",  //Y - A
        '55': "https://github.com/madisonwfong/compsoundlab1pics/blob/main/IMG_1352.JPG?raw=true", //7 - A#
        '85': "https://github.com/madisonwfong/compsoundlab1pics/blob/main/IMG_1353.JPG?raw=true",  //U - B
    }

    const globalGain = audioCtx.createGain(); //this will control the volume of all notes
    globalGain.gain.setValueAtTime(0.8, audioCtx.currentTime)
    globalGain.connect(audioCtx.destination);

window.addEventListener('keydown', keyDown, false);
window.addEventListener('keyup', keyUp, false);

activeOscillators = {}
gainNodes = {}
var notes_playing = 0; // tracks how many notes are playing

function keyDown(event) {
    const key = (event.detail || event.which).toString();
    if (pictures[key]) {
        image.src = pictures[key];
    } else {
        image.src = "https://github.com/madisonwfong/compsoundlab1pics/blob/main/IMG_1329.JPG?raw=true";
    }
    if (keyboardFrequencyMap[key] && !activeOscillators[key]) {
        notes_playing++; // if another key is pressed, increment number of notes playing
        playNote(key);
    }
}

function keyUp(event) {
    const key = (event.detail || event.which).toString();
    if (keyboardFrequencyMap[key] && activeOscillators[key]) {
        notes_playing--; // decrease number of notes playing
        gainNodes[key].gain.cancelScheduledValues(audioCtx.currentTime);
        gainNodes[key].gain.setTargetAtTime(0, audioCtx.currentTime, 0.01); // release
        activeOscillators[key].stop(audioCtx.currentTime + 2); // add buffer
        delete activeOscillators[key];
        delete gainNodes[key];
    }
}

function playNote(key) {
    const osc = audioCtx.createOscillator();
    osc.frequency.setValueAtTime(keyboardFrequencyMap[key], audioCtx.currentTime);
    if (document.getElementById('sine').checked) { // pick checked wave
        osc.type = 'sine'
    } else if (document.getElementById('sawtooth').checked) {
        osc.type = 'sawtooth'
    } else if (document.getElementById('square').checked) {
        osc.type = 'square'
    } else if (document.getElementById('triangle').checked) {
        osc.type = 'triangle'
    }
    const newNode = audioCtx.createGain(); // create new gain node
    newNode.gain.setValueAtTime(0, audioCtx.currentTime);
    // using notes_playing to control the gain
    newNode.gain.setTargetAtTime(0.8/notes_playing, audioCtx.currentTime, 0.01); // attack
    newNode.gain.setTargetAtTime(0.5/notes_playing, audioCtx.currentTime + 0.01, 0.01); // decay + sustain
    osc.connect(newNode).connect(audioCtx.destination);
    osc.start();
    activeOscillators[key] = osc;
    gainNodes[key] = newNode;
  }

});