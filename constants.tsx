
import { CardData, Question } from './types';

export const HOEREN_POOL: Question[] = [
  // --- PART 1: Short Conversations ---
  {
    id: 'h1_v1', part: 1, type: 'multiple-choice',
    prompt: 'Was möchte die Frau essen?',
    audioScript: 'Frau: Ich hätte gerne die Suppe. Mann: Tomatensuppe oder Gemüsesuppe? Frau: Die Tomatensuppe bitte.',
    options: ['Tomatensuppe', 'Gemüsesuppe', 'Salat'],
    correctAnswer: 'Tomatensuppe',
    hint: 'Listen for "Tomatensuppe bitte".',
    translation: 'What does the woman want to eat?'
  },
  {
    id: 'h1_v2', part: 1, type: 'multiple-choice',
    prompt: 'Wie viel kostet der Pullover?',
    audioScript: 'Frau: Entschuldigung, wie viel kostet dieser rote Pullover? Verkäufer: Der kostet normalerweise 50 Euro, aber heute ist er im Angebot für 35 Euro.',
    options: ['50 Euro', '35 Euro', '15 Euro'],
    correctAnswer: '35 Euro',
    hint: 'He mentions 50 first, but 35 is the "Angebot" (offer).',
    translation: 'How much does the sweater cost?'
  },
  {
    id: 'h1_v3', part: 1, type: 'multiple-choice',
    prompt: 'Wann kommt der Zug an?',
    audioScript: 'Frau: Entschuldigung, wann kommt der Zug aus Berlin? Mann: Er hat Verspätung. Planmäßig um 14:30 Uhr, aber er kommt erst um 14:45 Uhr.',
    options: ['14:15 Uhr', '14:30 Uhr', '14:45 Uhr'],
    correctAnswer: '14:45 Uhr',
    hint: 'The actual arrival time is delayed until 14:45.',
    translation: 'When does the train arrive?'
  },
  {
    id: 'h1_v4', part: 1, type: 'multiple-choice',
    prompt: 'Was soll Anja mitbringen?',
    audioScript: 'Mann: Hallo Anja. Kommst du heute Abend? Anja: Ja. Soll ich etwas mitbringen? Mann: Ja, bitte bring etwas zu essen mit, vielleicht Brot und Wurst. Getränke haben wir schon.',
    options: ['Getränke', 'Essen', 'Musik'],
    correctAnswer: 'Essen',
    hint: 'He says "bring etwas zu essen mit".',
    translation: 'What should Anja bring?'
  },
  {
    id: 'h1_v5', part: 1, type: 'multiple-choice',
    prompt: 'Welche Nummer hat das Taxi?',
    audioScript: 'Mann: Ich brauche ein Taxi. Kennst du die Nummer? Frau: Ja, die ist 44 88 0. Mann: Danke, 44 88 0.',
    options: ['44 88 0', '48 84 0', '44 00 8'],
    correctAnswer: '44 88 0',
    hint: 'Listen carefully to the digits: vier-vier, acht-acht, null.',
    translation: 'What number does the taxi have?'
  },
  {
    id: 'h1_v6', part: 1, type: 'multiple-choice',
    prompt: 'Wo ist die Apotheke?',
    audioScript: 'Frau: Entschuldigung, wo ist hier eine Apotheke? Mann: Gehen Sie hier geradeaus und dann die zweite Straße links. Neben der Bäckerei.',
    options: ['Neben der Post', 'Neben der Bäckerei', 'Gegenüber vom Bahnhof'],
    correctAnswer: 'Neben der Bäckerei',
    hint: 'He says "Neben der Bäckerei" (Next to the bakery).',
    translation: 'Where is the pharmacy?'
  },
  {
    id: 'h1_v7', part: 1, type: 'multiple-choice',
    prompt: 'Was macht Herr Müller morgen?',
    audioScript: 'Frau: Gehen wir morgen ins Kino, Herr Müller? Herr Müller: Morgen kann ich leider nicht. Ich muss lange arbeiten, bis 20 Uhr.',
    options: ['Er geht ins Kino', 'Er muss arbeiten', 'Er spielt Fußball'],
    correctAnswer: 'Er muss arbeiten',
    hint: 'He says "Ich muss lange arbeiten".',
    translation: 'What is Mr. Müller doing tomorrow?'
  },
  {
    id: 'h1_v8', part: 1, type: 'multiple-choice',
    prompt: 'Welches Gleis fährt der Zug?',
    audioScript: 'Mann: Entschuldigung, fährt der Zug nach München von Gleis 5? Schaffner: Nein, heute von Gleis 12. Gleis 5 ist gesperrt.',
    options: ['Gleis 5', 'Gleis 12', 'Gleis 2'],
    correctAnswer: 'Gleis 12',
    hint: 'Gleis 12 is the correct platform today.',
    translation: 'Which platform is the train leaving from?'
  },
  // --- Additional HOEREN Part 1 ---
  {
    id: 'h1_v9', part: 1, type: 'multiple-choice',
    prompt: 'Was kauft der Mann?',
    audioScript: 'Frau: Kann ich Ihnen helfen? Mann: Ja, ich suche eine Jacke. Frau: Diese hier ist sehr schön und warm. Mann: Gut, die nehme ich.',
    options: ['Eine Hose', 'Eine Jacke', 'Schuhe'],
    correctAnswer: 'Eine Jacke',
    hint: 'He says "ich suche eine Jacke" and "die nehme ich".',
    translation: 'What does the man buy?'
  },
  {
    id: 'h1_v10', part: 1, type: 'multiple-choice',
    prompt: 'Wann beginnt der Kurs?',
    audioScript: 'Mann: Entschuldigung, wann fängt der Deutschkurs an? Frau: Heute ist Dienstag? Dann beginnt er übermorgen, am Donnerstag um 18 Uhr.',
    options: ['Dienstag', 'Mittwoch', 'Donnerstag'],
    correctAnswer: 'Donnerstag',
    hint: '"Übermorgen, am Donnerstag".',
    translation: 'When does the course start?'
  },

  // --- PART 2: Announcements ---
  {
    id: 'h2_v1', part: 2, type: 'true-false',
    prompt: 'Fahrgäste nach München sollen den Bus nehmen.',
    audioScript: 'Durchsage: Achtung am Gleis 4. Der Zug nach München fällt heute aus. Bitte benutzen Sie die Busse vor dem Bahnhof.',
    options: ['Richtig', 'Falsch'],
    correctAnswer: 'Richtig',
    hint: 'The announcement says "Zug fällt aus" (train cancelled) and "benutzen Sie die Busse" (use the buses).',
    translation: 'Passengers to Munich should take the bus.'
  },
  {
    id: 'h2_v2', part: 2, type: 'true-false',
    prompt: 'Im Supermarkt kann man heute billig Fleisch kaufen.',
    audioScript: 'Durchsage: Liebe Kunden, heute haben wir ein besonderes Angebot: Rindersteak für nur 2 Euro pro Kilo. Greifen Sie zu!',
    options: ['Richtig', 'Falsch'],
    correctAnswer: 'Richtig',
    hint: 'Steak is Fleisch, and 2 Euro is "Angebot" (cheap).',
    translation: 'You can buy cheap meat in the supermarket today.'
  },
  {
    id: 'h2_v3', part: 2, type: 'true-false',
    prompt: 'Heute fahren keine U-Bahnen zum Südbahnhof.',
    audioScript: 'Durchsage: Achtung, liebe Fahrgäste. Wegen Bauarbeiten fahren heute leider keine U-Bahnen zum Südbahnhof. Bitte nutzen Sie den Bus.',
    options: ['Richtig', 'Falsch'],
    correctAnswer: 'Richtig',
    hint: 'The announcement says "keine U-Bahnen zum Südbahnhof".',
    translation: 'No subways are running to the South Station today.'
  },
  {
    id: 'h2_v4', part: 2, type: 'true-false',
    prompt: 'Der Flug LH456 fliegt heute von Gate B12.',
    audioScript: 'Durchsage: Letzter Aufruf für alle Passagiere des Lufthansa-Fluges LH456 nach London. Bitte kommen Sie sofort zum Ausgang B12. Das Gate schließt in 5 Minuten.',
    options: ['Richtig', 'Falsch'],
    correctAnswer: 'Richtig',
    hint: 'Passagiere... zum Ausgang B12.',
    translation: 'Flight LH456 is departing from Gate B12 today.'
  },
  {
    id: 'h2_v5', part: 2, type: 'true-false',
    prompt: 'Das Möbelhaus schließt erst in einer Stunde.',
    audioScript: 'Durchsage: Werte Kunden, unser Möbelhaus schließt in 15 Minuten. Bitte gehen Sie zur Kasse. Wir wünschen Ihnen einen schönen Feierabend.',
    options: ['Richtig', 'Falsch'],
    correctAnswer: 'Falsch',
    hint: 'It closes in "15 Minuten", not an hour.',
    translation: 'The furniture store is closing in one hour.'
  },
  {
    id: 'h2_v6', part: 2, type: 'true-false',
    prompt: 'Kinder unter 12 Jahren haben freien Eintritt.',
    audioScript: 'Durchsage: Willkommen im Zoo! Heute ist Kindertag. Alle Kinder unter 12 Jahren bezahlen heute keinen Eintritt. Viel Spaß!',
    options: ['Richtig', 'Falsch'],
    correctAnswer: 'Richtig',
    hint: '"keinen Eintritt" means free entry.',
    translation: 'Children under 12 have free entry.'
  },
  // --- Additional HOEREN Part 2 ---
  {
    id: 'h2_v7', part: 2, type: 'true-false',
    prompt: 'Der Intercity nach Hamburg fährt heute von Gleis 3.',
    audioScript: 'Durchsage: Achtung liebe Fahrgäste. Der Intercity 505 nach Hamburg, Abfahrt 10:20 Uhr, fährt heute nicht von Gleis 8, sondern von Gleis 3. Bitte beachten Sie die Änderung.',
    options: ['Richtig', 'Falsch'],
    correctAnswer: 'Richtig',
    hint: '"heute... von Gleis 3".',
    translation: 'The Intercity to Hamburg leaves from platform 3 today.'
  },
  {
    id: 'h2_v8', part: 2, type: 'true-false',
    prompt: 'Im "Kaufhof" gibt es heute Rabatt auf Schuhe.',
    audioScript: 'Durchsage: Willkommen im Kaufhof. Besuchen Sie unsere Sportabteilung im 3. Stock. Heute alles zum halben Preis! Sportschuhe, Trikots und Bälle.',
    options: ['Richtig', 'Falsch'],
    correctAnswer: 'Richtig',
    hint: '"Sportschuhe... zum halben Preis".',
    translation: 'There is a discount on shoes at "Kaufhof" today.'
  },

  // --- PART 3: Voicemails ---
  {
    id: 'h3_v1', part: 3, type: 'multiple-choice',
    prompt: 'Wann hat Frau Schmidt den Termin beim Arzt?',
    audioScript: 'Anrufbeantworter: Hallo Frau Schmidt, hier ist die Praxis Dr. Müller. Ihr Termin am Montag um 10 Uhr muss leider verschoben werden. Kommen Sie bitte am Dienstag um 11 Uhr.',
    options: ['Montag 10:00 Uhr', 'Dienstag 10:00 Uhr', 'Dienstag 11:00 Uhr'],
    correctAnswer: 'Dienstag 11:00 Uhr',
    hint: 'Monday is cancelled, Tuesday at 11 is the new time.',
    translation: 'When is Mrs. Schmidts doctor appointment?'
  },
  {
    id: 'h3_v2', part: 3, type: 'multiple-choice',
    prompt: 'Wann hat das Reisebüro wieder geöffnet?',
    audioScript: 'Anrufbeantworter: Herzlich willkommen beim Reisebüro Sonne. Wir haben vom 15. bis zum 30. April Urlaub. Am 2. Mai sind wir wieder für Sie da.',
    options: ['Am 15. April', 'Am 30. April', 'Am 2. Mai'],
    correctAnswer: 'Am 2. Mai',
    hint: 'They return "Am 2. Mai".',
    translation: 'When does the travel agency reopen?'
  },
  {
    id: 'h3_v3', part: 3, type: 'multiple-choice',
    prompt: 'Was ist mit dem Auto passiert?',
    audioScript: 'Anrufbeantworter: Hallo Herr Schneider, hier ist die Werkstatt. Ihr Auto ist fertig. Die Bremsen waren kaputt, aber jetzt funktioniert alles wieder. Sie können es abholen.',
    options: ['Es ist noch kaputt', 'Es ist fertig', 'Es wurde verkauft'],
    correctAnswer: 'Es ist fertig',
    hint: '"Ihr Auto ist fertig".',
    translation: 'What happened to the car?'
  },
  {
    id: 'h3_v4', part: 3, type: 'multiple-choice',
    prompt: 'Warum ruft Sabine an?',
    audioScript: 'Anrufbeantworter: Hallo Mama, hier ist Sabine. Ich habe meinen Schlüssel vergessen. Bist du heute Abend zu Hause? Ruf mich bitte an.',
    options: ['Sie hat Hunger', 'Sie hat den Schlüssel vergessen', 'Sie hat Geburtstag'],
    correctAnswer: 'Sie hat den Schlüssel vergessen',
    hint: '"Schlüssel vergessen" means forgotten keys.',
    translation: 'Why calls Sabine?'
  },
  {
    id: 'h3_v5', part: 3, type: 'multiple-choice',
    prompt: 'Wo treffen sich Michael und Peter?',
    audioScript: 'Anrufbeantworter: Hi Peter, hier ist Michael. Wir wollten uns doch beim Italiener treffen. Das klappt leider nicht. Lass uns lieber im "Café Central" treffen, okay? Bis dann!',
    options: ['Beim Italiener', 'Im Café Central', 'Im Kino'],
    correctAnswer: 'Im Café Central',
    hint: '"Lass uns lieber im Café Central treffen".',
    translation: 'Where do Michael and Peter meet?'
  },
  // --- Additional HOEREN Part 3 ---
  {
    id: 'h3_v6', part: 3, type: 'multiple-choice',
    prompt: 'Was soll Herr Klein tun?',
    audioScript: 'Anrufbeantworter: Guten Tag Herr Klein, hier ist das Autohaus. Ihr Auto ist noch nicht fertig. Wir brauchen noch ein Ersatzteil. Bitte rufen Sie uns morgen wieder an.',
    options: ['Das Auto abholen', 'Morgen anrufen', 'Bezahlen'],
    correctAnswer: 'Morgen anrufen',
    hint: '"Bitte rufen Sie uns morgen wieder an".',
    translation: 'What should Mr. Klein do?'
  },
  // --- Extracted from PDF Analysis ---
  {
    id: 'h1_v11', part: 1, type: 'multiple-choice',
    prompt: 'Welche Zimmernummer hat Herr Schneider?',
    audioScript: 'Frau: Ach, Verzeihung, wo finde ich Herrn Schneider vom Betriebsrat? Mann: Schneider. Warten Sie mal. Ich glaube, der ist in Zimmer Nummer 254. Ja, stimmt, Zimmer 254. Das ist im zweiten Stock. Da können Sie den Aufzug hier nehmen. Frau: Zweiter Stock, Zimmer 254. Okay, vielen Dank.',
    options: ['2', '245', '254'],
    correctAnswer: '254',
    hint: 'Listen for "Zimmer Nummer 254".',
    translation: 'What room number does Mr. Schneider have?'
  },
  {
    id: 'h1_v12', part: 1, type: 'multiple-choice',
    prompt: 'Was kostet der Pullover?',
    audioScript: 'Kunde: Entschuldigung, was kostet dieser Pullover jetzt? Da steht 30 Prozent billiger. Verkäuferin: Einen Moment bitte ... neunzehnfünfundneunzig. Kunde: 19,95 Euro? Verkäuferin: Ja, Euro natürlich. Kunde: Hm, ... ok, den nehme ich.',
    options: ['30,- €', '95,- €', '19,95€'],
    correctAnswer: '19,95€',
    hint: 'He confirms "19,95 Euro".',
    translation: 'How much is the sweater?'
  },
  {
    id: 'h1_v13', part: 1, type: 'multiple-choice',
    prompt: 'Wie spät ist es?',
    audioScript: 'Passant: Ach, entschuldigen Sie bitte. Passantin: Ja bitte. Passant: Haben Sie eine Uhr? Wie spät ist es bitte? Passantin: Ja – jetzt ist es gleich 5 Uhr. Passant: Was, schon 5. Vielen Dank, Wiedersehen.',
    options: ['15 Uhr', 'Gleich 5 Uhr', 'Halb 5 Uhr'],
    correctAnswer: 'Gleich 5 Uhr',
    hint: '"gleich 5 Uhr" means almost 5.',
    translation: 'What time is it?'
  },
  {
    id: 'h1_v14', part: 1, type: 'multiple-choice',
    prompt: 'Was isst die Frau im Restaurant?',
    audioScript: 'Kellner: Was wünschen Sie bitte? Gast: Ich hätte gern die Salatplatte und ein... Kellner: Entschuldigung, die Salatplatte ist leider aus, aber die Bratwurst kann ich Ihnen empfehlen ... ganz frisch heute. Gast: Nein danke ... ich esse kein Fleisch. Gibt es etwas ohne Fleisch? Kellner: Ja ... nicht mehr viel: Fisch oder Pommes. Gast: Fisch ... hm ... Tja, dann wohl die Pommes.',
    options: ['Pommes', 'Fisch', 'Wurst'],
    correctAnswer: 'Pommes',
    hint: 'She chooses "dann wohl die Pommes" because there is no salad.',
    translation: 'What does the woman eat?'
  },
  {
    id: 'h1_v15', part: 1, type: 'multiple-choice',
    prompt: 'In welche Klasse geht Frau Hegers Sohn?',
    audioScript: 'Kollege: Haben Sie Kinder, Frau Heger? Kollegin: Ja, einen Sohn. Kollege: Und wie alt ist er? Kollegin: Neun Jahre seit gestern. Kollege: Ah, dann geht er ja schon zur Schule? Kollegin: Ja klar, schon in die dritte Klasse.',
    options: ['9.Klasse', '3.Klasse', '4.Klasse'],
    correctAnswer: '3.Klasse',
    hint: '"schon in die dritte Klasse".',
    translation: 'Which grade is Mrs. Hegers son in?'
  },
  {
    id: 'h1_v16', part: 1, type: 'multiple-choice',
    prompt: 'Wie kommt die Frau in den 2. Stock?',
    audioScript: 'Kundin: Ach, entschuldigen Sie, wie komme ich denn hier in den zweiten Stock? Die Rolltreppe da vorn ist kaputt. Verkäufer: Da gehen Sie hier rechts um die Ecke und nehmen den Aufzug. Kundin: Um die Ecke rechts. Danke.',
    options: ['Mit dem Aufzug', 'Auf der Treppe', 'Mit der Rolltreppe'],
    correctAnswer: 'Mit dem Aufzug',
    hint: 'Rolltreppe is broken (kaputt), so use Aufzug.',
    translation: 'How does the woman get to the 2nd floor?'
  },
  {
    id: 'h1_v17', part: 1, type: 'multiple-choice',
    prompt: 'Wohin fährt Herr Albers?',
    audioScript: 'Kollegin: Guten Morgen, Herr Albers. So früh schon bei der Arbeit? Kollege: Ja, ich habe noch viel zu tun. Morgen fahre ich doch für 3 Wochen weg. Kollegin: Ach ja, das habʻ ich vergessen. Wohin fahren Sie denn? Kollege: Zu meinen Verwandten nach Polen.',
    options: ['In Urlaub ans Meer', 'Zur Arbeit', 'Zur Familie'],
    correctAnswer: 'Zur Familie',
    hint: '"Zu meinen Verwandten" (relatives/family).',
    translation: 'Where is Mr. Albers going?'
  },
  {
    id: 'h2_v9', part: 2, type: 'true-false',
    prompt: 'Die Reisende soll zur Information in Halle C kommen.',
    audioScript: 'Durchsage: Frau Katrin Gundlach, angekommen aus Budapest, wird zum Informationsschalter in der Ankunftshalle C gebeten. Frau Gundlach bitte zum Informationsschalter in der Ankunftshalle C.',
    options: ['Richtig', 'Falsch'],
    correctAnswer: 'Richtig',
    hint: 'Announcement calls for her to go to Info in Hall C.',
    translation: 'The traveler should come to the information desk in Hall C.'
  },
  {
    id: 'h2_v10', part: 2, type: 'true-false',
    prompt: 'Die Kunden sollen die Weihnachtsfeier besuchen.',
    audioScript: 'Durchsage: Liebe Kunden, zu Weihnachten bieten wir Ihnen Superpreise an z. B. erstklassiger italienischer Weißwein für 12 Euro 78 die Flasche. Besuchen Sie uns im 3. Stock. Frohe Weihnachten.',
    options: ['Richtig', 'Falsch'],
    correctAnswer: 'Falsch',
    hint: 'It is an ad for prices (Superpreise), not a party (Feier).',
    translation: 'Customers should visit the Christmas party.'
  },
  {
    id: 'h2_v11', part: 2, type: 'true-false',
    prompt: 'Die Fahrgäste sollen sich im Restaurant treffen.',
    audioScript: 'Durchsage: Liebe Fahrgäste. Wir sind kurz vor Würzburg. Sicherlich haben Sie schon Hunger. An der nächsten Raststätte halten wir für eine Stunde. Wir treffen uns wieder um halb eins am Bus, aber bitte pünktlich sein.',
    options: ['Richtig', 'Falsch'],
    correctAnswer: 'Falsch',
    hint: 'Meet back "am Bus" (at the bus), not in the restaurant.',
    translation: 'Passengers should meet in the restaurant.'
  },
  {
    id: 'h2_v12', part: 2, type: 'true-false',
    prompt: 'Die Fahrgäste sollen im Zug bleiben.',
    audioScript: 'Durchsage: Liebe Fahrgäste! Bitte beachten Sie. Das ist ein außerplanmäßiger Halt. Bitte hier nicht aussteigen. In ein paar Minuten erreichen wir den Bahnhof Bonn – Bad Godesberg.',
    options: ['Richtig', 'Falsch'],
    correctAnswer: 'Richtig',
    hint: '"Bitte hier nicht aussteigen" means do not get off.',
    translation: 'Passengers should stay in the train.'
  },
  {
    id: 'h2_v13', part: 2, type: 'true-false',
    prompt: 'Der Herr soll sofort zum Schalter kommen.',
    audioScript: 'Durchsage: Herr Stefan Janda gebucht auf dem Flug LH 737 nach Warschau, wird zum Schalter F7 gebeten. Der Flug wird in ein paar Minuten geschlossen. Herr Janda gebucht nach Warschau bitte nach F7.',
    options: ['Richtig', 'Falsch'],
    correctAnswer: 'Richtig',
    hint: 'Flight closing soon, please go to F7.',
    translation: 'The gentleman receives a call to come to the counter immediately.'
  },
  {
    id: 'h3_v7', part: 3, type: 'multiple-choice',
    prompt: 'Die neue Telefonnummer ist:',
    audioScript: 'Telefonansagedienst der deutschen Telekom. Die Rufnummer des Teilnehmers hat sich geändert. Bitte rufen Sie die Telefon-Auskunft an unter 11 8 33.',
    options: ['11833', '11883', '12833'],
    correctAnswer: '11833',
    hint: 'Listen for "11 8 33".',
    translation: 'The new phone number is:'
  },
  {
    id: 'h3_v8', part: 3, type: 'multiple-choice',
    prompt: 'Wo genau treffen sich die Männer?',
    audioScript: 'Hallo Jan, hier ist Boris. Du, ich bin noch im Zug. Du holst mich doch vom Bahnhof ab? Ich warte an der Information auf dich.',
    options: ['Am Zug', 'Am Bahnhof', 'An der Information'],
    correctAnswer: 'An der Information',
    hint: '"Ich warte an der Information".',
    translation: 'Where exactly do the men meet?'
  },
  {
    id: 'h3_v9', part: 3, type: 'multiple-choice',
    prompt: 'Wie lange will der Mann noch warten?',
    audioScript: 'Mensch Jan, du Penner, hier noch mal Boris. Ich bin jetzt am Bahnhof. Und du? Wo bist du denn? Ich warte schon über 20 Minuten auf dich. Zehn Minuten Zeit hast du noch ... bis 2, dann nehme ich ein Taxi.',
    options: ['20 Minuten', '2 Minuten', '10 Minuten'],
    correctAnswer: '10 Minuten',
    hint: '"Zehn Minuten Zeit hast du noch".',
    translation: 'How long does the man want to wait?'
  },
  {
    id: 'h3_v10', part: 3, type: 'multiple-choice',
    prompt: 'An welchem Tag will die Frau kommen?',
    audioScript: 'Guten Tag, hier Rogalla. Wir können am Samstag leider nicht zu Ihnen kommen. Am Sonntag haben wir aber Zeit. Rufen Sie uns doch bitte zurück, ob Ihnen das passt. Danke.',
    options: ['Am Montag', 'Am Sonntag', 'Am Samstag'],
    correctAnswer: 'Am Sonntag',
    hint: 'Saturday is cancelled, "Am Sonntag haben wir aber Zeit".',
    translation: 'Which day does the woman want to come?'
  },
  {
    id: 'h3_v11', part: 3, type: 'multiple-choice',
    prompt: 'Was ist kaputt?',
    audioScript: 'Hallo Alex. Walter hier. Kannst du schnell mal rüberkommen? Mein Computer hat einen Fehler. Ich kann nichts drucken. Melde dich doch bitte gleich, wenn du nach Hause kommst.',
    options: ['Der Fernseher', 'Der Computer', 'Das Handy'],
    correctAnswer: 'Der Computer',
    hint: '"Mein Computer hat einen Fehler".',
    translation: 'What is broken?'
  },
];

export const LESEN_POOL: Question[] = [
  // --- PART 1: Informal Correspondence ---
  {
    id: 'l1_v1', part: 1, type: 'true-false',
    context: 'Lieber Stefan, am nächsten Sonntag habe ich Geburtstag. Ich möchte dich herzlich zu meiner Party einladen. Wir grillen im Garten ab 18 Uhr. Kannst du kommen? Bitte gib mir bis Freitag Bescheid. Dein Klaus.',
    prompt: 'Die Party findet im Haus statt.',
    options: ['Richtig', 'Falsch'],
    correctAnswer: 'Falsch',
    hint: 'Klaus writes "grillen im Garten" (garden), not "im Haus" (house).',
    translation: 'The party takes place in the house.'
  },
  {
    id: 'l1_v3', part: 1, type: 'true-false',
    context: 'Hallo Kristina, vielen Dank für die Einladung zu deiner Party. Ich komme gern. Du schreibst, ich kann bei dir übernachten. Vielen Dank! Ich habe noch eine Frage: Kann ich auch meine Freundin Andrea mitbringen? Sie kommt aus Spanien und ist zurzeit bei mir zu Besuch. Schreib mir kurz! Gruß Maria.',
    prompt: 'Maria übernachtet im Hotel.',
    options: ['Richtig', 'Falsch'],
    correctAnswer: 'Falsch',
    hint: 'Kristina offered a place to stay (übernachten).',
    translation: 'Maria is staying at a hotel.'
  },
  {
    id: 'l1_v4', part: 1, type: 'true-false',
    context: 'Liebe Mama, ich bin gut in München angekommen. Die Zugfahrt war lang, aber okay. Mein Hotel ist sehr schön und liegt direkt im Zentrum. Morgen besuche ich Tante Helga. Ruf mich mal an! Deine Lisa.',
    prompt: 'Lisa ist mit dem Auto nach München gefahren.',
    options: ['Richtig', 'Falsch'],
    correctAnswer: 'Falsch',
    hint: 'She says "Die Zugfahrt", which implies she took the train.',
    translation: 'Lisa drove to Munich by car.'
  },
  {
    id: 'l1_v5', part: 1, type: 'true-false',
    context: 'Hallo Thomas, mein Fahrrad ist kaputt. Kannst du mir helfen? Du kannst das doch so gut. Ich habe Zeit am Samstagvormittag. Passt das? Ich lade dich danach auch zum Essen ein. Viele Grüße, Jens.',
    prompt: 'Jens möchte Thomas zum Essen einladen.',
    options: ['Richtig', 'Falsch'],
    correctAnswer: 'Richtig',
    hint: '"Ich lade dich danach auch zum Essen ein."',
    translation: 'Jens wants to invite Thomas to dinner.'
  },
  {
    id: 'l1_v6', part: 1, type: 'true-false',
    context: 'Liebe Frau Meier, ich kann am Montag leider nicht zur Arbeit kommen. Mein Sohn ist krank und ich muss zu Hause bleiben. Ich komme am Dienstag wieder. Viele Grüße, Petra Müller.',
    prompt: 'Petra Müller ist krank.',
    options: ['Richtig', 'Falsch'],
    correctAnswer: 'Falsch',
    hint: '"Mein Sohn ist krank" - her son is sick, not her.',
    translation: 'Petra Müller is sick.'
  },
  // Adding to LESEN Part 1
  {
    id: 'l1_v7', part: 1, type: 'true-false',
    context: 'Hallo Monika, ich habe zwei Karten für das Konzert am Samstagabend. Hast du Lust? Es fängt um 20 Uhr an. Wir können uns davor treffen. Sag mir Bescheid! Liebe Grüße, Sarah.',
    prompt: 'Sarah möchte mit Monika ins Kino gehen.',
    options: ['Richtig', 'Falsch'],
    correctAnswer: 'Falsch',
    hint: 'Sarah invites to a "Konzert" (concert), not "Kino" (cinema).',
    translation: 'Sarah wants to go to the cinema with Monika.'
  },

  // --- PART 2: Web Search / Ads ---
  {
    id: 'l2_v1', part: 2, type: 'multiple-choice',
    context: 'Sie möchten im Urlaub Deutsch lernen und am Nachmittag Sport machen.',
    prompt: 'Welche Anzeige passt?',
    options: [
      'A: Sprachschule Pro: Deutschkurse am Vormittag. Nachmittags Fußball und Schwimmen.',
      'B: Hotel Alpen: Erholung pur. Großer Garten und fantastisches Essen.'
    ],
    correctAnswer: 'A: Sprachschule Pro: Deutschkurse am Vormittag. Nachmittags Fußball und Schwimmen.',
    hint: 'Look for "Deutsch lernen" and "Sport".',
    translation: 'You want to learn German on vacation and do sports in the afternoon.'
  },
  {
    id: 'l2_v4', part: 2, type: 'multiple-choice',
    context: 'Sie möchten am Sonntagnachmittag essen gehen und draußen sitzen.',
    prompt: 'Welches Restaurant passt?',
    options: [
      'A: Restaurant Zur Mühle (Täglich 19-24 Uhr)',
      'B: Zum Schwan (12-15 Uhr Mittagstisch, großer Garten)'
    ],
    correctAnswer: 'B: Zum Schwan (12-15 Uhr Mittagstisch, großer Garten)',
    hint: 'Sundays often have "Mittagstisch", and "großer Garten" means sitting outside.',
    translation: 'You want to eat outside on Sunday afternoon.'
  },
  {
    id: 'l2_v5', part: 2, type: 'multiple-choice',
    context: 'Sie suchen eine günstige Wohnung in Berlin, möbliert.',
    prompt: 'Welche Anzeige passt?',
    options: [
      'A: Schöne 3-Zimmer-Wohnung, leer, 1200 Euro kalt. Ab sofort.',
      'B: 1-Zimmer-Appartement, Möbel vorhanden, 400 Euro. Ideal für Studenten.'
    ],
    correctAnswer: 'B: 1-Zimmer-Appartement, Möbel vorhanden, 400 Euro. Ideal für Studenten.',
    hint: '"Möbel vorhanden" means furnished, and 400 Euro is cheap (günstig).',
    translation: 'You are looking for a cheap, furnished apartment in Berlin.'
  },
  {
    id: 'l2_v6', part: 2, type: 'multiple-choice',
    context: 'Sie möchten mit dem Zug billig nach Paris fahren.',
    prompt: 'Welches Angebot wählen Sie?',
    options: [
      'A: Super-Sparpreis Europa: Mit dem ICE nach Paris ab 39 Euro.',
      'B: Air France: Flüge nach Paris ab 150 Euro.'
    ],
    correctAnswer: 'A: Super-Sparpreis Europa: Mit dem ICE nach Paris ab 39 Euro.',
    hint: '"Mit dem Zug" (by train) and "39 Euro" is cheaper than 150.',
    translation: 'You want to travel to Paris cheaply by train.'
  },
  {
    id: 'l2_v7', part: 2, type: 'multiple-choice',
    context: 'Sie wollen am Samstagabend tanzen gehen.',
    prompt: 'Wohin gehen Sie?',
    options: [
      'A: Disco "Blue Moon": Samstag ab 22 Uhr. Rock & Pop.',
      'B: Tanzschule Müller: Kurse am Montag und Mittwoch.'
    ],
    correctAnswer: 'A: Disco "Blue Moon": Samstag ab 22 Uhr. Rock & Pop.',
    hint: '"Disco" is for going out dancing on Saturday night.',
    translation: 'You want to go dancing on Saturday night.'
  },

  // --- PART 3: Signs/Notices ---
  {
    id: 'l3_v1', part: 3, type: 'true-false',
    context: 'Parkhaus am Dom: Geöffnet täglich von 6:00 bis 22:00 Uhr. Ausfahrt jederzeit möglich.',
    prompt: 'Man kann hier auch nachts um 12 Uhr mit dem Auto rausfahren.',
    options: ['Richtig', 'Falsch'],
    correctAnswer: 'Richtig',
    hint: '"Ausfahrt jederzeit möglich" means you can exit anytime, even at midnight.',
    translation: 'You can exit with your car at 12 midnight.'
  },
  {
    id: 'l3_v2', part: 3, type: 'true-false',
    context: 'Apotheke am Markt. Öffnungszeiten: Mo-Fr 8-18 Uhr, Sa 8-13 Uhr. Notdienst: Adler-Apotheke, Hauptstr. 5.',
    prompt: 'Sie können am Samstagnachmittag hier Medikamente kaufen.',
    options: ['Richtig', 'Falsch'],
    correctAnswer: 'Falsch',
    hint: 'Saturday closes at 13:00 (1 PM), so afternoon is closed.',
    translation: 'You can buy medicine here on Saturday afternoon.'
  },
  {
    id: 'l3_v3', part: 3, type: 'true-false',
    context: 'Bahnhofsplatz: Rauchen verboten!',
    prompt: 'Man darf hier Zigaretten rauchen.',
    options: ['Richtig', 'Falsch'],
    correctAnswer: 'Falsch',
    hint: '"Verboten" means forbidden.',
    translation: 'One is allowed to smoke cigarettes here.'
  },
  {
    id: 'l3_v4', part: 3, type: 'true-false',
    context: 'Aufzug außer Betrieb. Bitte benutzen Sie die Treppe.',
    prompt: 'Der Aufzug funktioniert nicht.',
    options: ['Richtig', 'Falsch'],
    correctAnswer: 'Richtig',
    hint: '"Außer Betrieb" means out of order.',
    translation: 'The elevator is not working.'
  },
  {
    id: 'l3_v5', part: 3, type: 'true-false',
    context: 'Achtung! Betreten der Baustelle verboten. Eltern haften für ihre Kinder.',
    prompt: 'Kinder dürfen hier spielen.',
    options: ['Richtig', 'Falsch'],
    correctAnswer: 'Falsch',
    hint: '"Verboten" means forbidden. It is a construction site.',
    translation: 'Children are allowed to play here.'
  },
  // Adding to LESEN Part 3
  {
    id: 'l3_v6', part: 3, type: 'true-false',
    context: 'Bibliothek: Essen und Trinken verboten. Handys bitte ausschalten.',
    prompt: 'Man darf in der Bibliothek telefonieren.',
    options: ['Richtig', 'Falsch'],
    correctAnswer: 'Falsch',
    hint: '"Handys bitte ausschalten" implies no phone calls.',
    translation: 'You are allowed to make phone calls in the library.'
  },
  // Additional Part 1
  {
    id: 'l1_v8', part: 1, type: 'true-false',
    context: 'Hallo Tina, ich bin krank und kann heute nicht zum Sport kommen. Gehst du allein? Oder wir gehen nächste Woche zusammen. Ruf mich an. Liebe Grüße, Anja.',
    prompt: 'Anja möchte nächste Woche mit Tina zum Sport gehen.',
    options: ['Richtig', 'Falsch'],
    correctAnswer: 'Richtig',
    hint: '"nächste Woche zusammen" means together next week.',
    translation: 'Anja wants to go to sports with Tina next week.'
  },
  {
    id: 'l1_v9', part: 1, type: 'true-false',
    context: 'Lieber Herr Müller, Ihr Auto ist fertig. Sie können es ab morgen 8 Uhr bei uns abholen. Die Reparatur kostet 250 Euro. Mit freundlichen Grüßen, Autowerkstatt Huber.',
    prompt: 'Herr Müller kann sein Auto heute abholen.',
    options: ['Richtig', 'Falsch'],
    correctAnswer: 'Falsch',
    hint: '"ab morgen" means starting tomorrow.',
    translation: 'Mr. Müller can pick up his car today.'
  },

  // Additional Part 2
  {
    id: 'l2_v8', part: 2, type: 'multiple-choice',
    context: 'Sie suchen eine Arbeit als Verkäuferin. Sie haben Erfahrung.',
    prompt: 'Welche Anzeige passt?',
    options: [
      'A: Bäckerei Müller sucht Verkäuferin. Erfahrung wichtig. Arbeitszeit: Vormittags.',
      'B: Suche Hilfe für Gartenarbeit am Wochenende. Keine Erfahrung nötig.'
    ],
    correctAnswer: 'A: Bäckerei Müller sucht Verkäuferin. Erfahrung wichtig. Arbeitszeit: Vormittags.',
    hint: 'Verkäuferin (sales assistant) matches the goal.',
    translation: 'You are looking for a job as a sales assistant.'
  },
  {
    id: 'l2_v9', part: 2, type: 'multiple-choice',
    context: 'Sie möchten einen Computer kaufen, aber nicht viel Geld ausgeben.',
    prompt: 'Welche Anzeige passt?',
    options: [
      'A: Computer-Welt: Die neuesten Modelle. Beste Qualität, hohe Preise.',
      'B: Student verkauft gebrauchten Laptop. 2 Jahre alt, sehr billig. Tel: 12345.'
    ],
    correctAnswer: 'B: Student verkauft gebrauchten Laptop. 2 Jahre alt, sehr billig. Tel: 12345.',
    hint: '"Gebraucht" (used) and "billig" (cheap).',
    translation: 'You want to buy a computer but not spend much money.'
  },

  // Additional Part 3
  {
    id: 'l3_v7', part: 3, type: 'true-false',
    context: 'Schwimmbad: Eintritt für Kinder unter 6 Jahren nur in Begleitung Erwachsener.',
    prompt: 'Ein Kind (5 Jahre) darf allein ins Schwimmbad gehen.',
    options: ['Richtig', 'Falsch'],
    correctAnswer: 'Falsch',
    hint: '"Nur in Begleitung" means only accompanied by adults.',
    translation: 'A child (5 years) is allowed to go to the pool alone.'
  },
  {
    id: 'l3_v8', part: 3, type: 'true-false',
    context: 'Achtung! Dieser Zug endet hier. Bitte alle aussteigen.',
    prompt: 'Die Fahrt geht weiter.',
    options: ['Richtig', 'Falsch'],
    correctAnswer: 'Falsch',
    hint: '"Endet hier" (ends here) and "alle aussteigen" (all exit).',
    translation: 'The journey continues.'
  },
  // --- Extracted from PDF Analysis ---
  {
    id: 'l1_v10', part: 1, type: 'true-false',
    context: 'Liebe Serpil, lieber Cengiz, wir heiraten! Bitte kommt am Freitag, den 5. Mai um 15 Uhr in Potsdam auf den Pfingstberg! Danach Kaffeetrinken draußen, abends Fest im Restaurant am Pfingstberg. Übernachten könnt ihr bei Freunden von uns! Sophie & Alex',
    prompt: 'Die Hochzeit beginnt am Freitagnachmittag.',
    options: ['Richtig', 'Falsch'],
    correctAnswer: 'Richtig',
    hint: 'Friday 15 Uhr (3 PM) is afternoon.',
    translation: 'The wedding starts on Friday afternoon.'
  },
  {
    id: 'l1_v11', part: 1, type: 'true-false',
    context: 'Hallo Maria! Endlich habe ich unsere Reise organisiert! Also, wir fahren am Freitag, 18.3. nach Dresden. Da gibt es im Hotel nur noch Doppelzimmer, aber ich hoffe, das ist für eine Nacht okay? Am Sonntagmorgen fahren wir dann in die Sächsische Schweiz zum Wandern.',
    prompt: 'In Dresden übernachten Anna und Maria im Hotel.',
    options: ['Richtig', 'Falsch'],
    correctAnswer: 'Richtig',
    hint: '"gibt es im Hotel nur noch Doppelzimmer".',
    translation: 'In Dresden, Anna and Maria stay in a hotel.'
  },
  {
    id: 'l2_v10', part: 2, type: 'multiple-choice',
    context: 'www.fern-und-gut.de (Exotische Länder) vs www.flugpreisvergleich.de (Billigster Flug für Sie! Alle Städte in Deutschland).',
    prompt: 'Sie möchten billig nach Berlin fliegen. Wo informieren Sie sich?',
    options: ['www.fern-und-gut.de', 'www.flugpreisvergleich.de'],
    correctAnswer: 'www.flugpreisvergleich.de',
    hint: 'Berlin is in Germany, and you want cheap (billig).',
    translation: 'You want to fly cheaply to Berlin.'
  },
  {
    id: 'l2_v11', part: 2, type: 'multiple-choice',
    context: 'Wirtshaus am Markt (Gasträume) vs Zur Kastanie (Unter Bäumen sitzen, leckeres Essen).',
    prompt: 'Sie möchten draußen essen.',
    options: ['Wirtshaus am Markt', 'Zur Kastanie'],
    correctAnswer: 'Zur Kastanie',
    hint: '"Unter Bäumen sitzen" means finding a seat under trees (outside).',
    translation: 'You want to eat outside.'
  },
  {
    id: 'l3_v9', part: 3, type: 'true-false',
    context: 'Praxis Dr. Haug. Liebe Patienten! Wir haben diese Woche Urlaub! Im Notfall 31 00 31.',
    prompt: 'Sie können heute zu Dr. Haug gehen.',
    options: ['Richtig', 'Falsch'],
    correctAnswer: 'Falsch',
    hint: '"Wir haben diese Woche Urlaub" (We are on holiday).',
    translation: 'You can go to Dr. Haug today.'
  },
  {
    id: 'l3_v10', part: 3, type: 'true-false',
    context: 'Achtung! In der Nacht vom 31.12. zum 1.1. fährt die Linie 5 alle 15 Minuten.',
    prompt: 'Der Bus fährt an Silvester.',
    options: ['Richtig', 'Falsch'],
    correctAnswer: 'Richtig',
    hint: 'It drives every 15 minutes.',
    translation: 'The bus runs on New Year\'s Eve.'
  }
];

export const SCHREIBEN_FORM_POOL = [
  {
    id: 'sf1',
    description: 'Ihr Freund, Marco Rossi (25), kommt aus Italien und möchte sich in der Bibliothek anmelden. Er wohnt in der Schillerstraße 5, 10115 Berlin. Er studiert Informatik.',
    fields: ['Name', 'Alter', 'Beruf/Studium', 'Straße', 'Postleitzahl']
  },
  {
    id: 'sf2',
    description: 'Sie sind im Urlaub in Hamburg. Sie möchten ein Zimmer im Hotel "Hanse" für 3 Nächte (2. bis 5. August) für 2 Personen reservieren. Ihr Name ist Maria Garcia.',
    fields: ['Name', 'Anreise (Datum)', 'Nächte', 'Personen', 'Ort']
  },
  {
    id: 'sf3',
    description: 'Sie heißen Anna Nowak, kommen aus Polen und wohnen jetzt in München, Goethestraße 10. Sie wollen einen Deutschkurs bei der Sprachschule "Aktiv" besuchen. Sie möchten den Abendkurs machen.',
    fields: ['Vorname', 'Familienname', 'Wohnort', 'Straße', 'Kursart']
  },
  {
    id: 'sf4',
    description: 'Sie reisen mit dem Zug von Frankfurt nach Paris. Sie kaufen eine Fahrkarte. Ihr Name ist David Smith, Sie zahlen mit Kreditkarte. Das Reisedatum ist der 12. Mai.',
    fields: ['Name', 'Von', 'Nach', 'Datum', 'Zahlungsart']
  },
  {
    id: 'sf5',
    description: 'Sie melden Ihr Kind, Lukas Meier (8 Jahre alt), beim Fußballverein an. Sie wohnen in Köln, Rheinstraße 4.',
    fields: ['Name des Kindes', 'Alter', 'Wohnort', 'Straße', 'Sportart']
  },
  {
    id: 'sf6',
    description: 'Sie möchten sich für einen Tanzkurs anmelden. Ihr Name ist Julia Weber (30). Sie wohnen in Berlin, Hauptstraße 12. Sie möchten am Wochenende tanzen.',
    fields: ['Name', 'Alter', 'Wohnort', 'Straße', 'Kurszeit']
  },
  {
    id: 'sf7',
    description: 'Sie buchen ein Einzelzimmer für Ihren Chef, Herrn Müller, im Hotel "Stern". Anreise: 10. September, Abreise: 12. September. Herr Müller braucht einen Parkplatz.',
    fields: ['Name des Gastes', 'Zimmerart', 'Anreise', 'Abreise', 'Extrawunsch']
  },
  // --- Extracted from PDF Analysis ---
  {
    id: 'sf8',
    description: 'Ihre Freundin, Eva Kadavy, macht Urlaub in Seeheim. Sie bucht für Sonntag eine Busfahrt um den Bodensee. Sie hat keine Kreditkarte.',
    fields: ['Name', 'Anzahl der Personen', 'Urlaubsort', 'Zahlungsweise', 'Reisetermin']
  },
  {
    id: 'sf9',
    description: 'Ihr Freund Vladimir Serjakov (30) aus St. Petersburg lebt in Hamburg. Er ist Reiseleiter. Seit gestern hat er 39 Grad Fieber und geht zum Arzt.',
    fields: ['Name', 'Wohnort', 'Alter', 'Beruf', 'Symptome (Was fehlt?)']
  }
];

export const SCHREIBEN_LETTER_POOL = [
  {
    id: 'sl1',
    prompt: 'Sie möchten am Samstag eine Party feiern. Schreiben Sie eine E-Mail an Ihre Freunde. Laden Sie sie ein und sagen Sie, wann die Party beginnt.',
    hint: 'Use informal greeting (Liebe Freunde...) and mention time.',
    exampleEmail: 'Liebe Freunde, am Samstag feiere ich eine Party bei mir zu Hause. Die Party beginnt um 19 Uhr. Habt ihr Zeit? Bitte sagt mir Bescheid. Viele Grüße, [Name]'
  },
  {
    id: 'sl2',
    prompt: 'Sie können morgen nicht zum Deutschkurs kommen. Schreiben Sie eine E-Mail an Ihre Lehrerin, Frau Berg. Erklären Sie, warum Sie nicht kommen können.',
    hint: 'Use formal greeting (Sehr geehrte Frau Berg...) and give a reason (krank).',
    exampleEmail: 'Sehr geehrte Frau Berg, leider kann ich morgen nicht zum Deutschkurs kommen, weil ich krank bin. Ich komme nächste Woche wieder. Mit freundlichen Grüßen, [Name]'
  },
  {
    id: 'sl3',
    prompt: 'Sie suchen eine neue Wohnung. Schreiben Sie eine E-Mail an das Wohnungsamt. Fragen Sie nach Öffnungszeiten und Formularen.',
    hint: 'Use formal greeting (Sehr geehrte Damen und Herren...).',
    exampleEmail: 'Sehr geehrte Damen und Herren, ich suche eine neue Wohnung. Wann sind Ihre Öffnungszeiten? Wo finde ich die Formulare? Vielen Dank. Mit freundlichen Grüßen, [Name]'
  },
  {
    id: 'sl4',
    prompt: 'Sie haben eine Einladung von Ihrer Freundin Laura bekommen. Sie können aber nicht kommen. Schreiben Sie eine E-Mail: Sagen Sie danke und entschuldigen Sie sich.',
    hint: 'Use informal greeting (Liebe Laura...) and say Sorry (Es tut mir leid).',
    exampleEmail: 'Liebe Laura, danke für deine Einladung. Leider kann ich nicht kommen, weil ich arbeiten muss. Es tut mir sehr leid. Viel Spaß! Liebe Grüße, [Name]'
  },
  {
    id: 'sl5',
    prompt: 'Sie möchten am Wochenende nach Berlin fahren. Schreiben Sie eine E-Mail an das Hotel "Berlin". Reservieren Sie ein Einzelzimmer für zwei Nächte.',
    hint: 'Formal greeting, specify dates and room type.',
    exampleEmail: 'Sehr geehrte Damen und Herren, ich möchte gerne ein Einzelzimmer für zwei Nächte reservieren. Ich komme am Freitag an. Haben Sie noch ein Zimmer frei? Mit freundlichen Grüßen, [Name]'
  },
  {
    id: 'sl6',
    prompt: 'Sie möchten mit Ihrer Kollegin, Frau Klein, zu Mittag essen. Schreiben Sie eine E-Mail: Wann und Wo?',
    hint: 'Formal greeting, suggest time and place.',
    exampleEmail: 'Liebe Frau Klein, haben Sie heute Zeit für ein Mittagessen? Wir können um 12 Uhr in die Kantine gehen. Passt das? Viele Grüße, [Name]'
  },
  {
    id: 'sl7',
    prompt: 'Sie fahren in den Urlaub. Schreiben Sie Ihrem Nachbarn, Herrn Kurz. Er soll bitte Ihre Blumen gießen.',
    hint: 'Formal or informal depending on relationship, ask for help.',
    exampleEmail: 'Lieber Herr Kurz, ich bin nächste Woche im Urlaub. Können Sie bitte meine Blumen gießen? Der Schlüssel liegt unter der Matte. Vielen Dank! Liebe Grüße, [Name]'
  },
  // --- Extracted from PDF Analysis ---
  {
    id: 'sl8',
    prompt: 'Sie möchten im August Dresden besuchen. Schreiben Sie an die Touristeninformation: Fragen Sie nach Kulturprogramm (Museen) und Hoteladressen.',
    hint: 'Formal greeting. Ask for information.',
    exampleEmail: 'Sehr geehrte Damen und Herren, ich plane im August einen Urlaub in Dresden. Können Sie mir Informationen zum Kulturprogramm (Museen, etc.) schicken? Haben Sie auch eine Liste mit Hotels? Vielen Dank. Mit freundlichen Grüßen, [Name]'
  },
  {
    id: 'sl9',
    prompt: 'Ihr Kollege, Herr Jensch, lädt Sie zur Geburtstagsfeier ein. Schreiben Sie: Sie kommen später und fragen Sie, ob Sie helfen können.',
    hint: 'Polite greeting. Thank him. Explain delay.',
    exampleEmail: 'Lieber Herr Jensch, danke für die Einladung! Ich komme gerne, aber ich komme etwas später, weil ich noch einen Termin habe. Kann ich Ihnen beim Vorbereiten helfen? Viele Grüße, [Name]'
  }
];

export const SPEAKING_WORD_CARDS: CardData[] = [
  // Existing
  { id: 'sw1', type: 'word', content: 'Auto', topic: 'Verkehr', icon: 'fa-car', imageUrl: '', exampleQuestion: 'Haben Sie ein Auto?', exampleAnswer: 'Ja, ich habe ein kleines Auto.' },
  { id: 'sw2', type: 'word', content: 'Brot', topic: 'Essen & Trinken', icon: 'fa-bread-slice', imageUrl: '', exampleQuestion: 'Essen Sie gern Brot?', exampleAnswer: 'Ja, ich esse jeden Morgen Brot.' },
  { id: 'sw3', type: 'word', content: 'Kaffee', topic: 'Essen & Trinken', icon: 'fa-coffee', imageUrl: '', exampleQuestion: 'Trinken Sie gern Kaffee?', exampleAnswer: 'Nein, ich trinke lieber Tee.' },
  { id: 'sw4', type: 'word', content: 'Wochenende', topic: 'Freizeit', icon: 'fa-calendar-days', imageUrl: '', exampleQuestion: 'Was machen Sie am Wochenende?', exampleAnswer: 'Am Wochenende gehe ich ins Kino.' },
  { id: 'sw5', type: 'word', content: 'Zeitung', topic: 'Medien', icon: 'fa-newspaper', imageUrl: '', exampleQuestion: 'Lesen Sie jeden Tag die Zeitung?', exampleAnswer: 'Ja, beim Frühstück.' },
  { id: 'sw6', type: 'word', content: 'Fahrrad', topic: 'Verkehr', icon: 'fa-bicycle', imageUrl: '', exampleQuestion: 'Fahren Sie gern Fahrrad?', exampleAnswer: 'Ja, das macht Spaß.' },
  { id: 'sw7', type: 'word', content: 'Wohnung', topic: 'Wohnen', icon: 'fa-house', imageUrl: '', exampleQuestion: 'Wie groß ist Ihre Wohnung?', exampleAnswer: 'Meine Wohnung hat drei Zimmer.' },
  { id: 'sw8', type: 'word', content: 'Beruf', topic: 'Arbeit', icon: 'fa-briefcase', imageUrl: '', exampleQuestion: 'Was sind Sie von Beruf?', exampleAnswer: 'Ich bin Ingenieur.' },

  // New Additions
  { id: 'sw9', type: 'word', content: 'Urlaub', topic: 'Reisen', icon: 'fa-plane', imageUrl: '', exampleQuestion: 'Wann machen Sie Urlaub?', exampleAnswer: 'Im Sommer fahre ich nach Spanien.' },
  { id: 'sw10', type: 'word', content: 'Sport', topic: 'Freizeit', icon: 'fa-futbol', imageUrl: '', exampleQuestion: 'Treiben Sie Sport?', exampleAnswer: 'Ja, ich spiele Fußball.' },
  { id: 'sw11', type: 'word', content: 'Familie', topic: 'Persönliches', icon: 'fa-users', imageUrl: '', exampleQuestion: 'Ist Ihre Familie groß?', exampleAnswer: 'Nein, ich habe nur einen Bruder.' },
  { id: 'sw12', type: 'word', content: 'Sprache', topic: 'Lernen', icon: 'fa-language', imageUrl: '', exampleQuestion: 'Welche Sprachen sprechen Sie?', exampleAnswer: 'Ich spreche Englisch und ein bisschen Deutsch.' },
  { id: 'sw13', type: 'word', content: 'Obst', topic: 'Essen & Trinken', icon: 'fa-apple-whole', imageUrl: '', exampleQuestion: 'Essen Sie gern Obst?', exampleAnswer: 'Ja, Äpfel und Bananen.' },
  { id: 'sw14', type: 'word', content: 'Arzt', topic: 'Gesundheit', icon: 'fa-user-doctor', imageUrl: '', exampleQuestion: 'Wann gehen Sie zum Arzt?', exampleAnswer: 'Wenn ich krank bin.' },
  { id: 'sw15', type: 'word', content: 'Computer', topic: 'Arbeit', icon: 'fa-computer', imageUrl: '', exampleQuestion: 'Haben Sie einen Computer?', exampleAnswer: 'Ja, ich brauche ihn für die Arbeit.' },
  { id: 'sw16', type: 'word', content: 'Lust', topic: 'Freizeit', icon: 'fa-face-smile', imageUrl: '', exampleQuestion: 'Haben Sie Lust auf Kino?', exampleAnswer: 'Ja, sehr gerne.' },
  { id: 'sw17', type: 'word', content: 'Preis', topic: 'Einkaufen', icon: 'fa-tag', imageUrl: '', exampleQuestion: 'Ist der Preis gut?', exampleAnswer: 'Ja, das ist sehr billig.' },
  { id: 'sw18', type: 'word', content: 'Stadt', topic: 'Wohnen', icon: 'fa-city', imageUrl: '', exampleQuestion: 'Wohnen Sie in der Stadt?', exampleAnswer: 'Nein, ich wohne auf dem Land.' },
  { id: 'sw19', type: 'word', content: 'Freunde', topic: 'Soziales', icon: 'fa-user-group', imageUrl: '', exampleQuestion: 'Treffen Sie oft Freunde?', exampleAnswer: 'Ja, am Wochenende.' },
  { id: 'sw20', type: 'word', content: 'Garten', topic: 'Wohnen', icon: 'fa-seedling', imageUrl: '', exampleQuestion: 'Haben Sie einen Garten?', exampleAnswer: 'Ja, einen kleinen Garten.' },
  // --- Extracted from PDF Analysis ---
  { id: 'sw21', type: 'word', content: 'Frühstück', topic: 'Essen & Trinken', icon: 'fa-mug-hot', imageUrl: '', exampleQuestion: 'Was essen Sie zum Frühstück?', exampleAnswer: 'Brötchen mit Marmelade.' },
  { id: 'sw22', type: 'word', content: 'Lieblingsessen', topic: 'Essen & Trinken', icon: 'fa-utensils', imageUrl: '', exampleQuestion: 'Was ist Ihr Lieblingsessen?', exampleAnswer: 'Pizza ist mein Lieblingsessen.' },
  { id: 'sw23', type: 'word', content: 'Fleisch', topic: 'Essen & Trinken', icon: 'fa-drumstick-bite', imageUrl: '', exampleQuestion: 'Essen Sie oft Fleisch?', exampleAnswer: 'Nein, ich bin Vegetarier.' },
  { id: 'sw24', type: 'word', content: 'Arbeitszeit', topic: 'Beruf', icon: 'fa-clock', imageUrl: '', exampleQuestion: 'Wie sind Ihre Arbeitszeiten?', exampleAnswer: 'Von 8 bis 17 Uhr.' },
  { id: 'sw25', type: 'word', content: 'Kollegen', topic: 'Beruf', icon: 'fa-users', imageUrl: '', exampleQuestion: 'Sind Ihre Kollegen nett?', exampleAnswer: 'Ja, wir verstehen uns gut.' },
  { id: 'sw26', type: 'word', content: 'Spaß', topic: 'Beruf', icon: 'fa-face-smile', imageUrl: '', exampleQuestion: 'Macht Ihnen die Arbeit Spaß?', exampleAnswer: 'Ja, sehr viel Spaß.' },
  { id: 'sw27', type: 'word', content: 'Schwimmen', topic: 'Sport', icon: 'fa-person-swimming', imageUrl: '', exampleQuestion: 'Gehen Sie gern schwimmen?', exampleAnswer: 'Im Sommer ja.' },
  { id: 'sw28', type: 'word', content: 'Ball', topic: 'Sport', icon: 'fa-baseball', imageUrl: '', exampleQuestion: 'Haben Sie einen Ball?', exampleAnswer: 'Ja, einen Fußball.' }
];

export const SPEAKING_PICTURE_CARDS: CardData[] = [
  // Existing
  { id: 'sp1', type: 'picture', content: 'Fenster aufmachen', icon: 'fa-window-maximize', imageUrl: '', exampleQuestion: 'Können Sie bitte das Fenster aufmachen?', exampleAnswer: 'Ja, sofort.' },
  { id: 'sp2', type: 'picture', content: 'Stift leihen', icon: 'fa-pen', imageUrl: '', exampleQuestion: 'Kannst du mir einen Stift leihen?', exampleAnswer: 'Ja, hier ist einer.' },
  { id: 'sp3', type: 'picture', content: 'Tür zumachen', icon: 'fa-door-closed', imageUrl: '', exampleQuestion: 'Machen Sie bitte die Tür zu.', exampleAnswer: 'Klar, mache ich.' },
  { id: 'sp4', type: 'picture', content: 'Rauchen verboten', icon: 'fa-ban-smoking', imageUrl: '', exampleQuestion: 'Darf man hier rauchen?', exampleAnswer: 'Nein, hier ist Rauchverbot.' },
  { id: 'sp5', type: 'picture', content: 'Rechnung bezahlen', icon: 'fa-file-invoice-dollar', imageUrl: '', exampleQuestion: 'Kann ich bitte die Rechnung haben?', exampleAnswer: 'Gerne, das macht 20 Euro.' },
  { id: 'sp6', type: 'picture', content: 'Milch kaufen', icon: 'fa-bottle-water', imageUrl: '', exampleQuestion: 'Kaufst du bitte eine Flasche Milch?', exampleAnswer: 'Ja, mache ich.' },
  { id: 'sp7', type: 'picture', content: 'Buch lesen', icon: 'fa-book', imageUrl: '', exampleQuestion: 'Lies mir bitte das Buch vor.', exampleAnswer: 'Ja, gerne.' },
  { id: 'sp8', type: 'picture', content: 'Kaffee trinken', icon: 'fa-mug-hot', imageUrl: '', exampleQuestion: 'Möchten Sie eine Tasse Kaffee?', exampleAnswer: 'Ja, bitte mit Milch.' },

  // New Additions
  { id: 'sp9', type: 'picture', content: 'Ruhe bitte', icon: 'fa-volume-xmark', imageUrl: '', exampleQuestion: 'Seien Sie bitte leise.', exampleAnswer: 'Entschuldigung, ich bin jetzt still.' },
  { id: 'sp10', type: 'picture', content: 'Telefonieren', icon: 'fa-phone', imageUrl: '', exampleQuestion: 'Kann ich mal telefonieren?', exampleAnswer: 'Ja, mein Handy liegt auf dem Tisch.' },
  { id: 'sp11', type: 'picture', content: 'Platz nehmen', icon: 'fa-chair', imageUrl: '', exampleQuestion: 'Nehmen Sie bitte Platz.', exampleAnswer: 'Danke schön.' },
  { id: 'sp12', type: 'picture', content: 'Unterschreiben', icon: 'fa-signature', imageUrl: '', exampleQuestion: 'Unterschreiben Sie hier bitte.', exampleAnswer: 'Wo soll ich unterschreiben?' },
  { id: 'sp13', type: 'picture', content: 'Taxi rufen', icon: 'fa-taxi', imageUrl: '', exampleQuestion: 'Können Sie mir ein Taxi rufen?', exampleAnswer: 'Ja, es kommt in 5 Minuten.' },
  { id: 'sp14', type: 'picture', content: 'Uhrzeit sagen', icon: 'fa-clock', imageUrl: '', exampleQuestion: 'Wie viel Uhr ist es?', exampleAnswer: 'Es ist halb drei.' },
  { id: 'sp15', type: 'picture', content: 'Wasser geben', icon: 'fa-glass-water', imageUrl: '', exampleQuestion: 'Kann ich bitte ein Glas Wasser haben?', exampleAnswer: 'Ja, natürlich, hier bitte.' },
  { id: 'sp16', type: 'picture', content: 'Tasche tragen', icon: 'fa-bag-shopping', imageUrl: '', exampleQuestion: 'Können Sie mir mit der Tasche helfen?', exampleAnswer: 'Ja, sie ist sehr schwer.' },

  // --- Extracted from PDF Analysis ---
  { id: 'sp17', type: 'picture', content: 'CD', icon: 'fa-compact-disc', imageUrl: '', exampleQuestion: 'Haben Sie eine CD?', exampleAnswer: 'Ja, Musik von Mozart.' },
  { id: 'sp18', type: 'picture', content: 'Stuhl', icon: 'fa-chair', imageUrl: '', exampleQuestion: 'Ist der Stuhl frei?', exampleAnswer: 'Ja, bitte setzen Sie sich.' },
  { id: 'sp19', type: 'picture', content: 'Apfel', icon: 'fa-apple-whole', imageUrl: '', exampleQuestion: 'Möchten Sie einen Apfel?', exampleAnswer: 'Ja, gern.' },
  { id: 'sp20', type: 'picture', content: 'Koffer', icon: 'fa-suitcase', imageUrl: '', exampleQuestion: 'Ist das Ihr Koffer?', exampleAnswer: 'Nein, meiner ist rot.' },
  { id: 'sp21', type: 'picture', content: 'Radio', icon: 'fa-radio', imageUrl: '', exampleQuestion: 'Kann ich das Radio anmachen?', exampleAnswer: 'Bitte nicht, ich lerne.' }
];
