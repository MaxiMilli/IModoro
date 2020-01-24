// **********************
// *      index         *
// **********************

// Wenn das Dokument geladen wurde, führe loadFunc() aus
document.addEventListener('DOMContentLoaded', loadFunc);

// Lade und zeige alle Objekte
function loadFunc() {
    // Das Registrationsformular
    var pomoListe = document.querySelector('#pomodoro_liste');
    if (pomoListe) {
        // Rufe die Funktion 'schreibeListe' aus dem Modul auf und übergebe ein Template.
        pomoModule.schreibeListe('pomodoro_liste', `
        <div class="liste__eintrag">
            <div class="liste__titel">{{title}}</div>
            <div class="liste__untertitel">{{subtitle}}</div>
        </div>
        `);
    }

    var pomoNeu = document.querySelector('#pomodoro_neu_formular');
    if (pomoNeu) {
        pomoNeu.addEventListener('submit', pomoModule.startNeu);
    }

    let pomoTimer = document.querySelector('#pomodoro_timer');
    if (pomoTimer) {
        pomoModule.timer()
        document.querySelector('#pomo_abbrechen').addEventListener('click', pomoModule.abbrechen)
    }
} // Ende loadFunc