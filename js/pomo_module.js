let pomoModule = (function() {
    'use strict';
  
    let _min = 0;
    let _sec = 0;
    let _timer = null;

    // Lade alle Pomodoros aus einem Google Sheets und gebe das Objekt als "Callback" zurück.
    function _getPomodoros(callback) {
        fetch('https://sheets.googleapis.com/v4/spreadsheets/1K1dWeDZHljYJsGbN9EM89S88UFNY_4TKs-if8WVaRLM/values/Sheet1!A:G?key=AIzaSyBd-CbMdBKKyU8nj5zDgzBroPj97mh6QiQ')
        .then(function (data) {
            return data.text();
        })
        .then(function (text) {
            let pomoObject = JSON.parse(text);
            // nehme die erste Zeile weg, da diese den Titel enthält
            pomoObject.values.shift();
            callback(pomoObject.values);
        })
        .catch(function (error) {
            let errorText = document.querySelector('#error');
            errorText.innerHTML = error;
        })
    }

    function _startTimer(minuten, sekunden){        
        _min = minuten;
        _sec = sekunden;
        _timer = new easytimer.Timer();
        _timer.start({countdown: true, startValues: {seconds: _sec, minutes: _min}});
        _timer.on('secondsUpdated', function (timer) {
            _tick(timer);
        })
        _timer.on('targetAchieved', function (e) {
            _finish();
        });
        
    }

    function _tick(timer) {
        let t_sekunde = _timer.getTimeValues().seconds;
        let t_minute = _timer.getTimeValues().minutes;
        let time = _timer.getTimeValues().toString(['minutes', 'seconds']);
        let totaleSekunden = 25 * 60;
        let aktuelleSekunden = t_minute * 60 + t_sekunde;
        let prozentFortschritt = 100 / totaleSekunden * aktuelleSekunden;

        // Prozentfortschritt umkehren
        prozentFortschritt = 100 - prozentFortschritt;
        
        document.querySelector('#pomo_zeit').innerHTML = time;
        document.querySelector('#pomo_balken').style.width = prozentFortschritt + "%";
        document.title = "Pomodoro - " + time;

        // Um den Wiedereinstieg zu finden:
        let pomodoroObjekt = JSON.parse(localStorage.getItem('pomodoro'))
        pomodoroObjekt.minuten = t_minute;
        pomodoroObjekt.sekunden = t_sekunde;
        pomodoroObjekt.neu = false;  // ab jetzt soll der Pomodoro gespeichert weitergehen
        // setzte das pomodoro-Objekt wieder in den Local Storage
        localStorage.setItem('pomodoro', JSON.stringify(pomodoroObjekt))
    } 

    function _finish() {
        // TODO: Pomodoro in Sheets eintragen.

        // audio
        let finish = document.querySelector('#audio_ende');
        console.log(finish);
        
        finish.play();

        // Botschaft
        document.querySelector('#pomo_zeit').innerHTML = "Der Pomodoro ist erfolgreich abgeschlossen!";

        document.querySelector('#pomo_pause').style.display = 'inline';
        document.querySelector('#pomo_abbrechen').style.display = 'none';
    }

    return {
        schreibeListe: function(id, liste_element) {
            let liste = document.querySelector("#" + id);

            _getPomodoros(function (pomos) {
                liste.innerHTML = '';
                pomos.forEach(function (item) {
                    let subtitle = '';
                    subtitle += item[0];
                    subtitle += ' - ';
                    subtitle += item[1];
                    subtitle += ' | ';
                    
                    if (item[3] == "0") {
                        subtitle += '<span class="liste__untertitel--gruen">abgeschlossen</span>';
                    } else {
                        subtitle += '<span class="liste__untertitel--rot">abgebrochen</span>';
                    }

                    subtitle += ' | ';
                    subtitle += item[6];
                    subtitle += ' | ';
                    subtitle += item[5];

                    let eintrag = liste_element.replace('{{title}}', item[4]);
                    eintrag = eintrag.replace('{{subtitle}}', subtitle);
                    liste.innerHTML += eintrag;
                });
            });
        },

        startNeu: function (ereignis) {
            ereignis.preventDefault();

            let name = document.getElementsByName('uebung_name')[0].value;
            let projekt = document.getElementsByName('uebung_project')[0].value;
            let bemerkung = document.getElementsByName('uebung_bemerkung')[0].value

            let pomodoroObjekt = {
                name: name,
                projekt: projekt,
                bemerkung: bemerkung,
                minuten: 25,
                sekunden: 0,
                neu: true
            }

            // setzte das pomodoro-Objekt in den Local Storage
            localStorage.setItem('pomodoro', JSON.stringify(pomodoroObjekt))

            // Auf Timer-Seite weiterleiten
            location.href = "timer.html";
        },

        timer: function () {
            let pomodoroObjekt = JSON.parse(localStorage.getItem('pomodoro'))
            console.log(pomodoroObjekt);
            document.querySelector('#pomo_titel').innerHTML = pomodoroObjekt.name + " (" + pomodoroObjekt.projekt + ")";
            document.querySelector('#pomo_subtitel').innerHTML = pomodoroObjekt.bemerkung;
            
            if (pomodoroObjekt.neu == true) {
                _startTimer(pomodoroObjekt.minuten, pomodoroObjekt.sekunden)
                console.log('neu');
            } else {
                _startTimer(pomodoroObjekt.minuten, pomodoroObjekt.sekunden)
                console.log('alt')
            }
        },

        abbrechen: function () {
            var ask = window.confirm("Bist du sicher, dass du den Pomodoro abbrechen willst?");
            if (ask) {
                // TODO: Pomodoro in Sheets eintragen.
                window.location.href = "index.html";
            }
        }
    };
  }());