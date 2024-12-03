const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Lista zadań
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

let tasksExcel = [];
let tasksJava = [];
let drawnTasks = [];
let student = 1;

// Inicjalizacja list zadań
function initializeTasks() {
    tasksExcel = [];
    tasksJava = [];
    student = 1;
    drawnTasks = [];

    for (let i = 0; i < tasks.length; i++) {
        for (let j = 1; j < tasks[i].length; j++) {
            const type = tasks[i][j];
            if (type === "EX" || type === "SO") {
                tasksExcel.push(tasks[i][0] + "  " + type);
            } else {
                tasksJava.push(tasks[i][0] + "  " + type);
            }
        }
    }
}

initializeTasks();

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    if (pathname === '/') {
        // Renderowanie strony głównej
        fs.readFile(path.join(__dirname, 'public', 'index.html'), 'utf-8', (err, content) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }

            const excelCount = tasksExcel.length;
            const javaCount = tasksJava.length;

            const rendered = content
                .replace('{{excelCount}}', excelCount)
                .replace('{{javaCount}}', javaCount)
                .replace('{{textarea}}', drawnTasks.map(task => `Osoba ${task.student}:\n${task.javaTask}\n${task.excelTask}\n\n`).join(''));

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(rendered);
        });
    } else if (pathname === '/losuj') {
        // Losowanie zadania
        if (tasksExcel.length > 0 && tasksJava.length > 0) {
            const excelIndex = Math.floor(Math.random() * tasksExcel.length);
            const javaIndex = Math.floor(Math.random() * tasksJava.length);

            const excelTask = tasksExcel.splice(excelIndex, 1)[0];
            const javaTask = tasksJava.splice(javaIndex, 1)[0];

            const response = {
                student,
                javaTask,
                excelTask
            };

            drawnTasks.push(response);
            student++;

            // Reset, jeśli wylosowano 18 zadań
            if (drawnTasks.length >= 18) {
                initializeTasks();
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(response));
        } else {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Brak dostępnych zadań!' }));
        }
    } else if (pathname.startsWith('/public/')) {
        // Serwowanie plików statycznych
        const filePath = path.join(__dirname, pathname);
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not Found');
                return;
            }
            const ext = path.extname(filePath).toLowerCase();
            const mimeTypes = {
                '.css': 'text/css',
                '.js': 'application/javascript',
            };
            res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
            res.end(data);
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(3000, () => {
    console.log('Serwer działa na http://localhost:3000');
});