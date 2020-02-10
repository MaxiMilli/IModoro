// **********************
// *      index         *
// **********************

// Wenn das Dokument geladen wurde, führe die Funktion 'loadFunc' aus
document.addEventListener('DOMContentLoaded', loadFunc);

// Globale Variablen
let timer;
let name;
let beschreibung;

// Führe aus, sobald die Webseite fertig gealden hat
function loadFunc() {
    // Blende den Timer aus, da noch keiner gestartet wurde
    document.querySelector('#pomodoroTimer').style.display = 'none'

    // Füge den Eventlistener zu, welcher auf das Formular hört
    let formular = document.querySelector('#pomodoroNeuFormular');
    formular.addEventListener('submit', neuerPomodoroStarten);

    // Erstelle die Liste mit allen vergangenen Pomodoros
    erstelleListe()
}

function erstelleListe() {
    let pomodoroSammlung = JSON.parse(localStorage.getItem('pomodoro'));    
    for (pomodoro in pomodoroSammlung) {
        erstelleListenEintrag(pomodoroSammlung[pomodoro]);
    }
}

function neuerPomodoroStarten(paramEvent) {
    // hindere JavaScript vor allen standardmässigen Befehlen
    paramEvent.preventDefault()

    // verändere die Ansicht der Sections
    document.querySelector('#pomodoroTimer').style.display = 'block';
    document.querySelector('#pomodoroNeu').style.display = 'none';

    // Starte den Pomodoro und führe diese Funktion aus
    startePomodoro()
}

function erstelleListenEintrag(paraPomodoroObjekt) {

    // selektiere das Listenfeld
    let liste = document.querySelector("#pomodoroListe");
    
    // Erstelle einen neuen Artikel (ein Artikel ist bei uns einen Pomodoro in der Liste)
    let eintrag = document.createElement('article');
    
    // Erstelle den Titel mit einem 'h4'-Element
    let eintragTitel = document.createElement('h4');
    eintragTitel.innerText = paraPomodoroObjekt.name; // Gib dem Titel den Titel-Text, welcerh übergeben wurde
    eintrag.appendChild(eintragTitel); // füge den Titel zum Artikel hinzu
    
    // Erstelle den Untertitel als Paragraph
    let eintragBemerkung = document.createElement('p');
    let eintragBemerkungText = paraPomodoroObjekt.beschr; // Text des Paragraphen

    // füge einen Text hinten an, je nach dem ob der Pomodor fertig gemacht wurde
    if (paraPomodoroObjekt.fertig) {
        eintragBemerkungText += " | fertig";
    } else {
        eintragBemerkungText += " | abgebrochen";
    }
    eintragBemerkung.innerText = eintragBemerkungText;
    eintrag.appendChild(eintragBemerkung); // füge die Bemerkung zum Artikel hinzu
    
    // Element in der Liste am Schluss einfügen
    liste.appendChild(eintrag); 
}

function startePomodoro() {
    // Erstelle einen Timer
    timer = new easytimer.Timer();
    timer.start({countdown: true, startValues: {seconds: 10, minutes: 0}});
    timer.on('secondsUpdated', timerTick)
    timer.on('targetAchieved', timerFinish);

    // Hole die Werte aus dem Formular
    name = document.querySelector('#uebungName').value
    beschreibung = document.querySelector('#uebungBeschreibung').value

    //Abbrechen vorbereiten
    let abbruchFormular = document.querySelector('#pomodoroAbbruchFormular');
    abbruchFormular.addEventListener('submit', brechePomodoroAb)
}

function brechePomodoroAb() {
    // Timer beenden
    timer.stop();
    timer.reset();

    // PomodoroTimer zurücksetzen
    document.querySelector('#pomoBalken').style.width = '0%';
    document.querySelector('.timer__zeit').innerHTML = '..:..';

    // Ansicht wechseln
    document.querySelector('#pomodoroTimer').style.display = 'none';
    document.querySelector('#pomodoroNeu').style.display = 'block';

    // Pomodoro eintragen
    pomodoroEintragen(false)
}

function timerTick() {
    // verändere den Zeit-Text
    document.querySelector('.timer__zeit').innerHTML = timer.getTimeValues().minutes + ":" + timer.getTimeValues().seconds;
    
    // verändere den Balken
    let prozentFortschritt = 100 / 25 * timer.getTimeValues().minutes; // Prozent in Miuten ausrechnen
    prozentFortschritt = 100 - prozentFortschritt; // Prozentzahl umkehren
    document.querySelector('#pomoBalken').style.width = prozentFortschritt + "%"; // Auf Balken anwenden
}

function timerFinish() {
    // Pomodoro speichern (true, weil der Pomodoro erfolgreich beendet wurde)
    pomodoroEintragen(true);

    // Titel verändern
    document.querySelector('.timer__zeit').innerHTML = 'Fertig!';
    
    // Player konfigurieren
    let audioObject = document.querySelector('#audioPlayer');
    audioObject.play();
    audioObject.onended = function() {
        location.reload();
    };
}

function pomodoroEintragen(paramComplete) {
    // Zeit und localStorage in Variablen speichern
    let zeitInSekunden = new Date().getTime();
    let pomodoroSammlung = JSON.parse(localStorage.getItem('pomodoro'));

    // Pomodoro-Objekt erstellen
    let neuerEintragObjekt = {
        name: name,
        beschr: beschreibung,
        zeitstempel: zeitInSekunden,
        fertig: paramComplete
    };

    // Füge den neuen Pomodoro dem localStorage-Array an
    pomodoroSammlung.push(neuerEintragObjekt);

    // speichere das die ganze Sammlung
    localStorage.setItem('pomodoro', JSON.stringify(pomodoroSammlung));
}