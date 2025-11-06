////////////////////////////////////////////////////////
// Thema: Inline URL Überprüfung in JavaScript
// Datum: 2025-11-04
//
// Version: 0.0.2 [PoC]


// Konstanten
const checkDelay = 5000; // ms  -> Proof of Concept: 5000 (5 Sekunden) | Produktiv: 15 (400 Anschläge/Minute)
const urlRegEx = /(^$|((http(s))?:\/\/)([\w-]+\.)+[\w-]+([\w- ;,.\/?%&=]*))/  // Quelle: https://regex101.com/r/kM8eW3/1

// Variablen
let isValidURL = false; // Global: Kein Server-Request, wenn Eingabe keine URL ist!
let pendingRequest = false;
let lastCall = 0;


// Webseite vorbereiten: $(document).ready ohne jQuery
document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("input_btn").setAttribute("disabled", "disabled");
});

// URL Validierung
function validateURL() {
	// Werte werden bei jeder Eingabe zurückgesetzt
	let x = document.getElementById("input_url").value;
	let validateText = "Keine Eingabe";
	isValidURL = false;
	document.getElementById("input_btn").setAttribute("disabled", "disabled");

	if (x !== "") {
		if (x.match(urlRegEx)) {
			// Eingabe entspricht RegEx
			document.getElementById("validator_result").setAttribute("style", "color: green;"); // Visuelles Feedback
            document.getElementById("input_btn").removeAttribute("disabled");
            validateText = "Valide URL: " + x;
			isValidURL = true;
			remoteCheckURL();
	    } else {
			// Eingabe entspricht nicht RegEx
			document.getElementById("validator_result").setAttribute("style", "color: red;"); // Visuelles Feedback
            validateText = "Keine valide URL: " + x;
			isValidURL = false;
	    }
	}
    document.getElementById("validator_result").innerHTML = validateText;
}

// Check Request
function remoteCheckURL() {
	let currentCall = Date.now();
	let passedDelay = currentCall - lastCall;
	
	// Abbruchbedingung: Es wurde bereits ein Request ausgelöst
	if (pendingRequest) { return; }
	
	// Neuen Request auslösen
	if (passedDelay <= checkDelay) {
		// Es ist bereits ein Request ausgelöst
		pendingRequest = true; // Parallele Ausführung sperren
	    setTimeout(ajaxRequest, checkDelay - passedDelay);
		pendingRequest = false; // Sperre aufheben

		// Rückmeldung zur Visualisierung, später entfernen oder an sinnvolleren Ort verschieben
		document.getElementById("remote_check_result").innerHTML = "Der nächste Request ist ausgelöst und erfolgt in  " + (checkDelay - passedDelay) + " ms, bitte warten.";
	} else {
		// Es ist noch kein Request ausgelöst
		ajaxRequest();
	}
	
    lastCall = currentCall; // Hebelt auf Grund der Abbruchbedingung nicht den Throttle aus
}

// Der eigentliche Remote call
function ajaxRequest() {

    // So könnte ein AJAX-Request aussehen:
    /**********************************************
	const remoteServer = "remote://irgendwas.tld";
    let xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
		document.getElementById("remote_check_result").innerHTML = xhttp.responseText;
	}
	xhttp.open("GET", remoteServer, true);
	xhttp.send();
    ***********************************************/

	// Was tatsächlich geschah
	document.getElementById("remote_check_result").innerHTML = "Theoretische Antwort. (" + Date() + ")";

}