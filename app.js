const express = require('express');
const session = require('express-session');
const app = express();
const port = 3000;

// Lista zadań (pytania do losowania)
const tasks = [
    ["1. Decyzyjny problem plecakowy", "BS", "DZ", "SO", "AZ"],
    ["2. Ogólny problem plecakowy", "BS", "DZ", "SO"],
    ["4. Problem doboru załogi statku kosmicznego", "BS", "SO"],
    ["6. Problem odgadywania liczby", "DZ", "MC", "BS", "EX"],
    ["7. Problem planowania produkcji mebli", "SO"],
    ["8. Problem planowania diety dziecka", "SO"],
    ["9. Problem planowania zawartości zestawu paszowego", "SO"],
    ["10. Problem czterech hetmanów", "SO", "GT"],
    ["11. Problem planowania liczebności klas", "BS", "SO"],
    ["12. Problem wysyłania pociągów", "SO"],
    ["13. Problem przydziału maszyn", "BS", "SO"],
    ["14. Problem transportu węgla", "SO"],
    ["15. Problem transportu produktów", "SO"],
    ["16. Problem produkcji samochodów", "BS", "SO"],
    ["17. Problem transportu koni", "SO"],
    ["20. Problem przewidywania liczebności populacji królików", "DZ", "EX", "PD"],
    ["21. Problem przewidywania wzrostu PKB", "EX", "PROGRAM"],
    ["22. Problem przewidywania oprocentowania od lokaty", "EX", "PROGRAM"],
    ["28. Problem wydawania reszty", "AZ", "SO"]
];

const maksymalnaLiczbaOsob = 10;

app.use(session({
    secret: 'sekretnyKlucz', // Klucz do szyfrowania sesji
    resave: false,
    saveUninitialized: true
}));

app.set('view engine', 'ejs');
app.use(express.static('public'));

// Funkcja losująca dwa unikalne zadania
function losujDwaZadania() {
    const wylosowaneZadania = [];
    while (wylosowaneZadania.length < 2) {
        const losowyIndeks = Math.floor(Math.random() * tasks.length);
        const zadanie = tasks[losowyIndeks];
        const nazwaZadania = zadanie[0];
        const etykietyZadania = zadanie.slice(1);
        const zadanieObj = { nazwa: nazwaZadania, etykiety: etykietyZadania };

        if (!wylosowaneZadania.some(z => z.nazwa === zadanieObj.nazwa)) {
            wylosowaneZadania.push(zadanieObj);
        }
    }
    return wylosowaneZadania;
}

function resetSession(req) {
    req.session.history = [];
    req.session.indexOsoby = 0;
    req.session.completed = false;
}

app.get('/', (req, res) => {
    if (!req.session.history) {
        req.session.history = [];
        req.session.indexOsoby = 0;
    }

    res.render('index', { history: req.session.history, osoba: req.session.indexOsoby < maksymalnaLiczbaOsob });
});

app.get('/losuj', (req, res) => {
    if (req.session.indexOsoby < maksymalnaLiczbaOsob) {
        const osoba = `Osoba ${req.session.indexOsoby + 1}`;
        const wylosowaneZadania = losujDwaZadania();
        req.session.history.push({ osoba, zadania: wylosowaneZadania });
        req.session.indexOsoby++;

        res.redirect('/');
    } else {
        res.render('index', { history: req.session.history, osoba: false, error: "Osiągnięto maksymalną liczbę 10 osób." });
    }
});

app.get('/reset', (req, res) => {
    resetSession(req);
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Serwer działa na http://localhost:${port}`);
});
