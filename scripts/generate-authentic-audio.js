
import { GoogleGenAI } from "@google/genai";
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load env vars
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envLocalPath = path.resolve(__dirname, '../.env.local');

let apiKey = process.env.GEMINI_API_KEY;

if (fs.existsSync(envLocalPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envLocalPath));
    if (envConfig.GEMINI_API_KEY) {
        apiKey = envConfig.GEMINI_API_KEY;
    }
}

if (!apiKey) {
    // Fallback checks
    apiKey = process.env.VITE_GEMINI_API_KEY || process.env.API_KEY;
}

if (!apiKey) {
    console.error("Error: GEMINI_API_KEY not found");
    process.exit(1);
}

const client = new GoogleGenAI({ apiKey });

// Copied HOEREN_POOL content
const HOEREN_POOL = [
    // --- PART 1: Short Conversations ---
    {
        id: 'h1_v1', part: 1, type: 'multiple-choice',
        prompt: 'Was möchte die Frau essen?',
        audioScript: 'Frau: Ich hätte gerne die Suppe. Mann: Tomatensuppe oder Gemüsesuppe? Frau: Die Tomatensuppe bitte.',
        options: ['Tomatensuppe', 'Gemüsesuppe', 'Salat'],
        correctAnswer: 'Tomatensuppe',
        hint: 'Listen for "Tomatensuppe bitte".',
        translation: 'What does the woman want to eat?',
        context: "Restaurant ambience, clinking cutlery"
    },
    {
        id: 'h1_v2', part: 1, type: 'multiple-choice',
        prompt: 'Wie viel kostet der Pullover?',
        audioScript: 'Frau: Entschuldigung, wie viel kostet dieser rote Pullover? Verkäufer: Der kostet normalerweise 50 Euro, aber heute ist er im Angebot für 35 Euro.',
        options: ['50 Euro', '35 Euro', '15 Euro'],
        correctAnswer: '35 Euro',
        hint: 'He mentions 50 first, but 35 is the "Angebot" (offer).',
        translation: 'How much does the sweater cost?',
        context: "Clothing store, soft background music"
    },
    {
        id: 'h1_v3', part: 1, type: 'multiple-choice',
        prompt: 'Wann kommt der Zug an?',
        audioScript: 'Frau: Entschuldigung, wann kommt der Zug aus Berlin? Mann: Er hat Verspätung. Planmäßig um 14:30 Uhr, aber er kommt erst um 14:45 Uhr.',
        options: ['14:15 Uhr', '14:30 Uhr', '14:45 Uhr'],
        correctAnswer: '14:45 Uhr',
        hint: 'The actual arrival time is delayed until 14:45.',
        translation: 'When does the train arrive?',
        context: "Train station platform, distant trains"
    },
    {
        id: 'h1_v4', part: 1, type: 'multiple-choice',
        prompt: 'Was soll Anja mitbringen?',
        audioScript: 'Mann: Hallo Anja. Kommst du heute Abend? Anja: Ja. Soll ich etwas mitbringen? Mann: Ja, bitte bring etwas zu essen mit, vielleicht Brot und Wurst. Getränke haben wir schon.',
        options: ['Getränke', 'Essen', 'Musik'],
        correctAnswer: 'Essen',
        hint: 'He says "bring etwas zu essen mit".',
        translation: 'What should Anja bring?',
        context: "Phone call, slightly muffled voices"
    },
    {
        id: 'h1_v5', part: 1, type: 'multiple-choice',
        prompt: 'Welche Nummer hat das Taxi?',
        audioScript: 'Mann: Ich brauche ein Taxi. Kennst du die Nummer? Frau: Ja, die ist 44 88 0. Mann: Danke, 44 88 0.',
        options: ['44 88 0', '48 84 0', '44 00 8'],
        correctAnswer: '44 88 0',
        hint: 'Listen carefully to the digits: vier-vier, acht-acht, null.',
        translation: 'What number does the taxi have?',
        context: "Quiet living room"
    },
    {
        id: 'h1_v6', part: 1, type: 'multiple-choice',
        prompt: 'Wo ist die Apotheke?',
        audioScript: 'Frau: Entschuldigung, wo ist hier eine Apotheke? Mann: Gehen Sie hier geradeaus und dann die zweite Straße links. Neben der Bäckerei.',
        options: ['Neben der Post', 'Neben der Bäckerei', 'Gegenüber vom Bahnhof'],
        correctAnswer: 'Neben der Bäckerei',
        hint: 'He says "Neben der Bäckerei" (Next to the bakery).',
        translation: 'Where is the pharmacy?',
        context: "Street noise, cars passing"
    },
    {
        id: 'h1_v7', part: 1, type: 'multiple-choice',
        prompt: 'Was macht Herr Müller morgen?',
        audioScript: 'Frau: Gehen wir morgen ins Kino, Herr Müller? Herr Müller: Morgen kann ich leider nicht. Ich muss lange arbeiten, bis 20 Uhr.',
        options: ['Er geht ins Kino', 'Er muss arbeiten', 'Er spielt Fußball'],
        correctAnswer: 'Er muss arbeiten',
        hint: 'He says "Ich muss lange arbeiten".',
        translation: 'What is Mr. Müller doing tomorrow?',
        context: "Office environment, typing sounds"
    },
    {
        id: 'h1_v8', part: 1, type: 'multiple-choice',
        prompt: 'Welches Gleis fährt der Zug?',
        audioScript: 'Mann: Entschuldigung, fährt der Zug nach München von Gleis 5? Schaffner: Nein, heute von Gleis 12. Gleis 5 ist gesperrt.',
        options: ['Gleis 5', 'Gleis 12', 'Gleis 2'],
        correctAnswer: 'Gleis 12',
        hint: 'Gleis 12 is the correct platform today.',
        translation: 'Which platform is the train leaving from?',
        context: "Train station hall, echoey"
    },
    // --- Additional HOEREN Part 1 ---
    {
        id: 'h1_v9', part: 1, type: 'multiple-choice',
        prompt: 'Was kauft der Mann?',
        audioScript: 'Frau: Kann ich Ihnen helfen? Mann: Ja, ich suche eine Jacke. Frau: Diese hier ist sehr schön und warm. Mann: Gut, die nehme ich.',
        options: ['Eine Hose', 'Eine Jacke', 'Schuhe'],
        correctAnswer: 'Eine Jacke',
        hint: 'He says "ich suche eine Jacke" and "die nehme ich".',
        translation: 'What does the man buy?',
        context: "Department store"
    },
    {
        id: 'h1_v10', part: 1, type: 'multiple-choice',
        prompt: 'Wann beginnt der Kurs?',
        audioScript: 'Mann: Entschuldigung, wann fängt der Deutschkurs an? Frau: Heute ist Dienstag? Dann beginnt er übermorgen, am Donnerstag um 18 Uhr.',
        options: ['Dienstag', 'Mittwoch', 'Donnerstag'],
        correctAnswer: 'Donnerstag',
        hint: '"Übermorgen, am Donnerstag".',
        translation: 'When does the course start?',
        context: "School hallway, chatter"
    },
    // --- Extracted from PDF Analysis ---
    {
        id: 'h1_v11', part: 1, type: 'multiple-choice',
        prompt: 'Welche Zimmernummer hat Herr Schneider?',
        audioScript: 'Frau: Ach, Verzeihung, wo finde ich Herrn Schneider vom Betriebsrat? Mann: Schneider. Warten Sie mal. Ich glaube, der ist in Zimmer Nummer 254. Ja, stimmt, Zimmer 254. Das ist im zweiten Stock. Da können Sie den Aufzug hier nehmen. Frau: Zweiter Stock, Zimmer 254. Okay, vielen Dank.',
        options: ['2', '245', '254'],
        correctAnswer: '254',
        hint: 'Listen for "Zimmer Nummer 254".',
        translation: 'What room number does Mr. Schneider have?',
        context: "Office reception"
    },
    {
        id: 'h1_v12', part: 1, type: 'multiple-choice',
        prompt: 'Was kostet der Pullover?',
        audioScript: 'Kunde: Entschuldigung, was kostet dieser Pullover jetzt? Da steht 30 Prozent billiger. Verkäuferin: Einen Moment bitte ... neunzehnfünfundneunzig. Kunde: 19,95 Euro? Verkäuferin: Ja, Euro natürlich. Kunde: Hm, ... ok, den nehme ich.',
        options: ['30,- €', '95,- €', '19,95€'],
        correctAnswer: '19,95€',
        hint: 'He confirms "19,95 Euro".',
        translation: 'How much is the sweater?',
        context: "Shop checkout"
    },
    {
        id: 'h1_v13', part: 1, type: 'multiple-choice',
        prompt: 'Wie spät ist es?',
        audioScript: 'Passant: Ach, entschuldigen Sie bitte. Passantin: Ja bitte. Passant: Haben Sie eine Uhr? Wie spät ist es bitte? Passantin: Ja – jetzt ist es gleich 5 Uhr. Passant: Was, schon 5. Vielen Dank, Wiedersehen.',
        options: ['15 Uhr', 'Gleich 5 Uhr', 'Halb 5 Uhr'],
        correctAnswer: 'Gleich 5 Uhr',
        hint: '"gleich 5 Uhr" means almost 5.',
        translation: 'What time is it?',
        context: "Street, outdoor"
    },
    {
        id: 'h1_v14', part: 1, type: 'multiple-choice',
        prompt: 'Was isst die Frau im Restaurant?',
        audioScript: 'Kellner: Was wünschen Sie bitte? Gast: Ich hätte gern die Salatplatte und ein... Kellner: Entschuldigung, die Salatplatte ist leider aus, aber die Bratwurst kann ich Ihnen empfehlen ... ganz frisch heute. Gast: Nein danke ... ich esse kein Fleisch. Gibt es etwas ohne Fleisch? Kellner: Ja ... nicht mehr viel: Fisch oder Pommes. Gast: Fisch ... hm ... Tja, dann wohl die Pommes.',
        options: ['Pommes', 'Fisch', 'Wurst'],
        correctAnswer: 'Pommes',
        hint: 'She chooses "dann wohl die Pommes" because there is no salad.',
        translation: 'What does the woman eat?',
        context: "Busy restaurant"
    },
    {
        id: 'h1_v15', part: 1, type: 'multiple-choice',
        prompt: 'In welche Klasse geht Frau Hegers Sohn?',
        audioScript: 'Kollege: Haben Sie Kinder, Frau Heger? Kollegin: Ja, einen Sohn. Kollege: Und wie alt ist er? Kollegin: Neun Jahre seit gestern. Kollege: Ah, dann geht er ja schon zur Schule? Kollegin: Ja klar, schon in die dritte Klasse.',
        options: ['9.Klasse', '3.Klasse', '4.Klasse'],
        correctAnswer: '3.Klasse',
        hint: '"schon in die dritte Klasse".',
        translation: 'Which grade is Mrs. Hegers son in?',
        context: "Office break room"
    },
    {
        id: 'h1_v16', part: 1, type: 'multiple-choice',
        prompt: 'Wie kommt die Frau in den 2. Stock?',
        audioScript: 'Kundin: Ach, entschuldigen Sie, wie komme ich denn hier in den zweiten Stock? Die Rolltreppe da vorn ist kaputt. Verkäufer: Da gehen Sie hier rechts um die Ecke und nehmen den Aufzug. Kundin: Um die Ecke rechts. Danke.',
        options: ['Mit dem Aufzug', 'Auf der Treppe', 'Mit der Rolltreppe'],
        correctAnswer: 'Mit dem Aufzug',
        hint: 'Rolltreppe is broken (kaputt), so use Aufzug.',
        translation: 'How does the woman get to the 2nd floor?',
        context: "Department store"
    },
    {
        id: 'h1_v17', part: 1, type: 'multiple-choice',
        prompt: 'Wohin fährt Herr Albers?',
        audioScript: 'Kollegin: Guten Morgen, Herr Albers. So früh schon bei der Arbeit? Kollege: Ja, ich habe noch viel zu tun. Morgen fahre ich doch für 3 Wochen weg. Kollegin: Ach ja, das habʻ ich vergessen. Wohin fahren Sie denn? Kollege: Zu meinen Verwandten nach Polen.',
        options: ['In Urlaub ans Meer', 'Zur Arbeit', 'Zur Familie'],
        correctAnswer: 'Zur Familie',
        hint: '"Zu meinen Verwandten" (relatives/family).',
        translation: 'Where is Mr. Albers going?',
        context: "Office"
    },

    // --- PART 2: Announcements ---
    {
        id: 'h2_v1', part: 2, type: 'true-false',
        prompt: 'Fahrgäste nach München sollen den Bus nehmen.',
        audioScript: 'Durchsage: Achtung am Gleis 4. Der Zug nach München fällt heute aus. Bitte benutzen Sie die Busse vor dem Bahnhof.',
        options: ['Richtig', 'Falsch'],
        correctAnswer: 'Richtig',
        hint: 'The announcement says "Zug fällt aus" (train cancelled) and "benutzen Sie die Busse" (use the buses).',
        translation: 'Passengers to Munich should take the bus.',
        context: "Train station PA System. Echoey."
    },
    {
        id: 'h2_v2', part: 2, type: 'true-false',
        prompt: 'Im Supermarkt kann man heute billig Fleisch kaufen.',
        audioScript: 'Durchsage: Liebe Kunden, heute haben wir ein besonderes Angebot: Rindersteak für nur 2 Euro pro Kilo. Greifen Sie zu!',
        options: ['Richtig', 'Falsch'],
        correctAnswer: 'Richtig',
        hint: 'Steak is Fleisch, and 2 Euro is "Angebot" (cheap).',
        translation: 'You can buy cheap meat in the supermarket today.',
        context: "Supermarket PA System. Background beeping."
    },
    {
        id: 'h2_v3', part: 2, type: 'true-false',
        prompt: 'Heute fahren keine U-Bahnen zum Südbahnhof.',
        audioScript: 'Durchsage: Achtung, liebe Fahrgäste. Wegen Bauarbeiten fahren heute leider keine U-Bahnen zum Südbahnhof. Bitte nutzen Sie den Bus.',
        options: ['Richtig', 'Falsch'],
        correctAnswer: 'Richtig',
        hint: 'The announcement says "keine U-Bahnen zum Südbahnhof".',
        translation: 'No subways are running to the South Station today.',
        context: "Subway station announcement. Noisy."
    },
    {
        id: 'h2_v4', part: 2, type: 'true-false',
        prompt: 'Der Flug LH456 fliegt heute von Gate B12.',
        audioScript: 'Durchsage: Letzter Aufruf für alle Passagiere des Lufthansa-Fluges LH456 nach London. Bitte kommen Sie sofort zum Ausgang B12. Das Gate schließt in 5 Minuten.',
        options: ['Richtig', 'Falsch'],
        correctAnswer: 'Richtig',
        hint: 'Passagiere... zum Ausgang B12.',
        translation: 'Flight LH456 is departing from Gate B12 today.',
        context: "Airport Gate PA System."
    },
    {
        id: 'h2_v5', part: 2, type: 'true-false',
        prompt: 'Das Möbelhaus schließt erst in einer Stunde.',
        audioScript: 'Durchsage: Werte Kunden, unser Möbelhaus schließt in 15 Minuten. Bitte gehen Sie zur Kasse. Wir wünschen Ihnen einen schönen Feierabend.',
        options: ['Richtig', 'Falsch'],
        correctAnswer: 'Falsch',
        hint: 'It closes in "15 Minuten", not an hour.',
        translation: 'The furniture store is closing in one hour.',
        context: "Store PA system."
    },
    {
        id: 'h2_v6', part: 2, type: 'true-false',
        prompt: 'Kinder unter 12 Jahren haben freien Eintritt.',
        audioScript: 'Durchsage: Willkommen im Zoo! Heute ist Kindertag. Alle Kinder unter 12 Jahren bezahlen heute keinen Eintritt. Viel Spaß!',
        options: ['Richtig', 'Falsch'],
        correctAnswer: 'Richtig',
        hint: '"keinen Eintritt" means free entry.',
        translation: 'Children under 12 have free entry.',
        context: "Zoo Entrance Loudspeaker. Birds chirping."
    },
    // --- Additional HOEREN Part 2 ---
    {
        id: 'h2_v7', part: 2, type: 'true-false',
        prompt: 'Der Intercity nach Hamburg fährt heute von Gleis 3.',
        audioScript: 'Durchsage: Achtung liebe Fahrgäste. Der Intercity 505 nach Hamburg, Abfahrt 10:20 Uhr, fährt heute nicht von Gleis 8, sondern von Gleis 3. Bitte beachten Sie die Änderung.',
        options: ['Richtig', 'Falsch'],
        correctAnswer: 'Richtig',
        hint: '"heute... von Gleis 3".',
        translation: 'The Intercity to Hamburg leaves from platform 3 today.',
        context: "Train station platform announcement."
    },
    {
        id: 'h2_v8', part: 2, type: 'true-false',
        prompt: 'Im "Kaufhof" gibt es heute Rabatt auf Schuhe.',
        audioScript: 'Durchsage: Willkommen im Kaufhof. Besuchen Sie unsere Sportabteilung im 3. Stock. Heute alles zum halben Preis! Sportschuhe, Trikots und Bälle.',
        options: ['Richtig', 'Falsch'],
        correctAnswer: 'Richtig',
        hint: '"Sportschuhe... zum halben Preis".',
        translation: 'There is a discount on shoes at "Kaufhof" today.',
        context: "Department store PA."
    },
    {
        id: 'h2_v9', part: 2, type: 'true-false',
        prompt: 'Die Reisende soll zur Information in Halle C kommen.',
        audioScript: 'Durchsage: Frau Katrin Gundlach, angekommen aus Budapest, wird zum Informationsschalter in der Ankunftshalle C gebeten. Frau Gundlach bitte zum Informationsschalter in der Ankunftshalle C.',
        options: ['Richtig', 'Falsch'],
        correctAnswer: 'Richtig',
        hint: 'Announcement calls for her to go to Info in Hall C.',
        translation: 'The traveler should come to the information desk in Hall C.',
        context: "Airport paging system."
    },
    {
        id: 'h2_v10', part: 2, type: 'true-false',
        prompt: 'Die Kunden sollen die Weihnachtsfeier besuchen.',
        audioScript: 'Durchsage: Liebe Kunden, zu Weihnachten bieten wir Ihnen Superpreise an z. B. erstklassiger italienischer Weißwein für 12 Euro 78 die Flasche. Besuchen Sie uns im 3. Stock. Frohe Weihnachten.',
        options: ['Richtig', 'Falsch'],
        correctAnswer: 'Falsch',
        hint: 'It is an ad for prices (Superpreise), not a party (Feier).',
        translation: 'Customers should visit the Christmas party.',
        context: "Supermarket christmas music playing."
    },
    {
        id: 'h2_v11', part: 2, type: 'true-false',
        prompt: 'Die Fahrgäste sollen sich im Restaurant treffen.',
        audioScript: 'Durchsage: Liebe Fahrgäste. Wir sind kurz vor Würzburg. Sicherlich haben Sie schon Hunger. An der nächsten Raststätte halten wir für eine Stunde. Wir treffen uns wieder um halb eins am Bus, aber bitte pünktlich sein.',
        options: ['Richtig', 'Falsch'],
        correctAnswer: 'Falsch',
        hint: 'Meet back "am Bus" (at the bus), not in the restaurant.',
        translation: 'Passengers should meet in the restaurant.',
        context: "Bus interior microphone."
    },
    {
        id: 'h2_v12', part: 2, type: 'true-false',
        prompt: 'Die Fahrgäste sollen im Zug bleiben.',
        audioScript: 'Durchsage: Liebe Fahrgäste! Bitte beachten Sie. Das ist ein außerplanmäßiger Halt. Bitte hier nicht aussteigen. In ein paar Minuten erreichen wir den Bahnhof Bonn – Bad Godesberg.',
        options: ['Richtig', 'Falsch'],
        correctAnswer: 'Richtig',
        hint: '"Bitte hier nicht aussteigen" means do not get off.',
        translation: 'Passengers should stay in the train.',
        context: "onboard train announcement."
    },
    {
        id: 'h2_v13', part: 2, type: 'true-false',
        prompt: 'Der Herr soll sofort zum Schalter kommen.',
        audioScript: 'Durchsage: Herr Stefan Janda gebucht auf dem Flug LH 737 nach Warschau, wird zum Schalter F7 gebeten. Der Flug wird in ein paar Minuten geschlossen. Herr Janda gebucht nach Warschau bitte nach F7.',
        options: ['Richtig', 'Falsch'],
        correctAnswer: 'Richtig',
        hint: 'Flight closing soon, please go to F7.',
        translation: 'The gentleman receives a call to come to the counter immediately.',
        context: "Airport paging system."
    },

    // --- PART 3: Voicemails ---
    {
        id: 'h3_v1', part: 3, type: 'multiple-choice',
        prompt: 'Wann hat Frau Schmidt den Termin beim Arzt?',
        audioScript: 'Anrufbeantworter: Hallo Frau Schmidt, hier ist die Praxis Dr. Müller. Ihr Termin am Montag um 10 Uhr muss leider verschoben werden. Kommen Sie bitte am Dienstag um 11 Uhr.',
        options: ['Montag 10:00 Uhr', 'Dienstag 10:00 Uhr', 'Dienstag 11:00 Uhr'],
        correctAnswer: 'Dienstag 11:00 Uhr',
        hint: 'Monday is cancelled, Tuesday at 11 is the new time.',
        translation: 'When is Mrs. Schmidts doctor appointment?',
        context: "Telephone voicemail filtering"
    },
    {
        id: 'h3_v2', part: 3, type: 'multiple-choice',
        prompt: 'Wann hat das Reisebüro wieder geöffnet?',
        audioScript: 'Anrufbeantworter: Herzlich willkommen beim Reisebüro Sonne. Wir haben vom 15. bis zum 30. April Urlaub. Am 2. Mai sind wir wieder für Sie da.',
        options: ['Am 15. April', 'Am 30. April', 'Am 2. Mai'],
        correctAnswer: 'Am 2. Mai',
        hint: 'They return "Am 2. Mai".',
        translation: 'When does the travel agency reopen?',
        context: "Phone answering machine."
    },
    {
        id: 'h3_v3', part: 3, type: 'multiple-choice',
        prompt: 'Was ist mit dem Auto passiert?',
        audioScript: 'Anrufbeantworter: Hallo Herr Schneider, hier ist die Werkstatt. Ihr Auto ist fertig. Die Bremsen waren kaputt, aber jetzt funktioniert alles wieder. Sie können es abholen.',
        options: ['Es ist noch kaputt', 'Es ist fertig', 'Es wurde verkauft'],
        correctAnswer: 'Es ist fertig',
        hint: '"Ihr Auto ist fertig".',
        translation: 'What happened to the car?',
        context: "Phone voice."
    },
    {
        id: 'h3_v4', part: 3, type: 'multiple-choice',
        prompt: 'Warum ruft Sabine an?',
        audioScript: 'Anrufbeantworter: Hallo Mama, hier ist Sabine. Ich habe meinen Schlüssel vergessen. Bist du heute Abend zu Hause? Ruf mich bitte an.',
        options: ['Sie hat Hunger', 'Sie hat den Schlüssel vergessen', 'Sie hat Geburtstag'],
        correctAnswer: 'Sie hat den Schlüssel vergessen',
        hint: '"Schlüssel vergessen" means forgotten keys.',
        translation: 'Why calls Sabine?',
        context: "Mobile phone voice."
    },
    {
        id: 'h3_v5', part: 3, type: 'multiple-choice',
        prompt: 'Wo treffen sich Michael und Peter?',
        audioScript: 'Anrufbeantworter: Hi Peter, hier ist Michael. Wir wollten uns doch beim Italiener treffen. Das klappt leider nicht. Lass uns lieber im "Café Central" treffen, okay? Bis dann!',
        options: ['Beim Italiener', 'Im Café Central', 'Im Kino'],
        correctAnswer: 'Im Café Central',
        hint: '"Lass uns lieber im Café Central treffen".',
        translation: 'Where do Michael and Peter meet?',
        context: "Mobile phone voice."
    },
    // --- Additional HOEREN Part 3 ---
    {
        id: 'h3_v6', part: 3, type: 'multiple-choice',
        prompt: 'Was soll Herr Klein tun?',
        audioScript: 'Anrufbeantworter: Guten Tag Herr Klein, hier ist das Autohaus. Ihr Auto ist noch nicht fertig. Wir brauchen noch ein Ersatzteil. Bitte rufen Sie uns morgen wieder an.',
        options: ['Das Auto abholen', 'Morgen anrufen', 'Bezahlen'],
        correctAnswer: 'Morgen anrufen',
        hint: '"Bitte rufen Sie uns morgen wieder an".',
        translation: 'What should Mr. Klein do?',
        context: "Answering machine beep then voice."
    },
    {
        id: 'h3_v7', part: 3, type: 'multiple-choice',
        prompt: 'Die neue Telefonnummer ist:',
        audioScript: 'Telefonansagedienst der deutschen Telekom. Die Rufnummer des Teilnehmers hat sich geändert. Bitte rufen Sie die Telefon-Auskunft an unter 11 8 33.',
        options: ['11833', '11883', '12833'],
        correctAnswer: '11833',
        hint: 'Listen for "11 8 33".',
        translation: 'The new phone number is:',
        context: "Robotic phone system voice."
    },
    {
        id: 'h3_v8', part: 3, type: 'multiple-choice',
        prompt: 'Wo genau treffen sich die Männer?',
        audioScript: 'Hallo Jan, hier ist Boris. Du, ich bin noch im Zug. Du holst mich doch vom Bahnhof ab? Ich warte an der Information auf dich.',
        options: ['Am Zug', 'Am Bahnhof', 'An der Information'],
        correctAnswer: 'An der Information',
        hint: '"Ich warte an der Information".',
        translation: 'Where exactly do the men meet?',
        context: "Mobile call from noisy train."
    },
    {
        id: 'h3_v9', part: 3, type: 'multiple-choice',
        prompt: 'Wie lange will der Mann noch warten?',
        audioScript: 'Mensch Jan, du Penner, hier noch mal Boris. Ich bin jetzt am Bahnhof. Und du? Wo bist du denn? Ich warte schon über 20 Minuten auf dich. Zehn Minuten Zeit hast du noch ... bis 2, dann nehme ich ein Taxi.',
        options: ['20 Minuten', '2 Minuten', '10 Minuten'],
        correctAnswer: '10 Minuten',
        hint: '"Zehn Minuten Zeit hast du noch".',
        translation: 'How long does the man want to wait?',
        context: "Angry man on phone, street noise."
    },
    {
        id: 'h3_v10', part: 3, type: 'multiple-choice',
        prompt: 'An welchem Tag will die Frau kommen?',
        audioScript: 'Guten Tag, hier Rogalla. Wir können am Samstag leider nicht zu Ihnen kommen. Am Sonntag haben wir aber Zeit. Rufen Sie uns doch bitte zurück, ob Ihnen das passt. Danke.',
        options: ['Am Montag', 'Am Sonntag', 'Am Samstag'],
        correctAnswer: 'Am Sonntag',
        hint: 'Saturday is cancelled, "Am Sonntag haben wir aber Zeit".',
        translation: 'Which day does the woman want to come?',
        context: "Polite phone message."
    },
    {
        id: 'h3_v11', part: 3, type: 'multiple-choice',
        prompt: 'Was ist kaputt?',
        audioScript: 'Hallo Alex. Walter hier. Kannst du schnell mal rüberkommen? Mein Computer hat einen Fehler. Ich kann nichts drucken. Melde dich doch bitte gleich, wenn du nach Hause kommst.',
        options: ['Der Fernseher', 'Der Computer', 'Das Handy'],
        correctAnswer: 'Der Computer',
        hint: '"Mein Computer hat einen Fehler".',
        translation: 'What is broken?',
        context: "Phone message."
    },
];

// WAV Header Utility
function getWavHeader(dataLength, sampleRate, numChannels, bitsPerSample) {
    const header = Buffer.alloc(44);
    header.write('RIFF', 0);
    header.writeUInt32LE(36 + dataLength, 4);
    header.write('WAVE', 8);
    header.write('fmt ', 12);
    header.writeUInt32LE(16, 16);
    header.writeUInt16LE(1, 20);
    header.writeUInt16LE(numChannels, 22);
    header.writeUInt32LE(sampleRate, 24);
    header.writeUInt32LE(sampleRate * numChannels * (bitsPerSample / 8), 28);
    header.writeUInt16LE(numChannels * (bitsPerSample / 8), 32);
    header.writeUInt16LE(bitsPerSample, 34);
    header.write('data', 36);
    header.writeUInt32LE(dataLength, 40);
    return header;
}

async function generateAuthenticAudio(item) {
    const outputPath = path.resolve(__dirname, `../public/audio/${item.id}.wav`);

    // if (fs.existsSync(outputPath)) {
    //     console.log(`Skipping ${item.id} - already exists`);
    //     return;
    // }

    console.log(`Generating authentic audio for ${item.id} (${item.context})...`);

    const prompt = `
    Generate a realistic audio recording of the following German dialogue.
    CONTEXT/SCENE: ${item.context || "Neutral environment"}.
    ACTING: Natural, native German speakers. ${item.part === 2 ? "Professional public announcement style." : "Casual conversation."}
    
    DIALOGUE SCRIPT:
    ${item.audioScript}
    `;

    try {
        const response = await client.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: {
                role: "user",
                parts: [{ text: prompt }]
            },
            config: {
                responseModalities: ["AUDIO"],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: "Kore" } // Using Kore as base, but aiming for multimodal 'acting'
                    }
                }
            }
        });

        const part = response.candidates?.[0]?.content?.parts?.[0];
        if (part && part.inlineData) {
            const pcmBuffer = Buffer.from(part.inlineData.data, 'base64');
            // Gemini 2.0 Flash Audio output is typically 24kHz single channel
            const header = getWavHeader(pcmBuffer.length, 24000, 1, 16);
            const wavBuffer = Buffer.concat([header, pcmBuffer]);

            fs.writeFileSync(outputPath, wavBuffer);
            console.log(`Saved ${item.id}.wav`);
        } else {
            console.error(`No audio data for ${item.id}. Response:`, JSON.stringify(response.candidates?.[0]));
        }

    } catch (error) {
        if ((error.status === 429 || error.code === 429)) {
            console.error("Rate limit hit. Waiting 60s...");
            await new Promise(resolve => setTimeout(resolve, 60000));
            return generateAuthenticAudio(item);
        }
        console.error(`Error generating ${item.id}:`, error.message);
    }
}

async function main() {
    console.log("Starting AUTHENTIC audio generation...");

    // Process sequentially to respect rate limits
    for (const item of HOEREN_POOL) {
        await generateAuthenticAudio(item);
        // Small delay
        await new Promise(r => setTimeout(r, 4000));
    }
    console.log("Audio generation complete!");
}

main();
