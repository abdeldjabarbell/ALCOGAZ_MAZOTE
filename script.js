document.addEventListener('DOMContentLoaded', function () {
    let menuIcon = document.querySelector('#menu-icon');
    let navbar = document.querySelector('.navbar');

    menuIcon.onclick = () => {
        menuIcon.classList.toggle('bx-x');
        navbar.classList.toggle('active');
    };

    ScrollReveal({
        reset: true,
        distance: '80px',
        duration: 2000,
        delay: 200
    });

    ScrollReveal().reveal('.home-content, .heading, header, .up-cv', { origin: 'top' });
    ScrollReveal().reveal('.home-img, .services-container, .portfolio-box, .contact form, .content-cv', { origin: 'bottom' });
    ScrollReveal().reveal('.home-content h1, .about-img', { origin: 'left' });
    ScrollReveal().reveal('.home-content p, .about-content', { origin: 'right' });
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, addDoc, updateDoc, getDocs,getDoc, doc, setDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js";

// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDlWYiP7SFMPta9DaMs7utDTBxSU6WdZEI",
    authDomain: "alcogazmaz.firebaseapp.com",
    projectId: "alcogazmaz",
    storageBucket: "alcogazmaz.appspot.com",
    messagingSenderId: "1000525897161",
    appId: "1:1000525897161:web:4efb02a029e958a30d1c18",
    measurementId: "G-0PJK3SL0PT"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

document.getElementById('ajoutChauff').addEventListener('click', () => showSaveDriverForm());
const element = document.getElementById("element");
const nvelement = document.getElementById("nvelement");
const watingpage = document.getElementById("watingpage");
watingpage.style.display = "flex";

afficherlesjourshomepage();

function showSaveDriverForm() {
    nvelement.style.display = "flex";
    element.innerHTML = `
        <h2>إضافة سائق</h2>
        <form id="saveDriverForm">
            <label for="driverName">الاسم:</label>
            <input type="text" id="driverName" required><br>
            <label for="driverSurname">اللقب:</label>
            <input type="text" id="driverSurname" required><br>
            <label for="driverMatricule">الرقم التعريفي:</label>
            <input type="text" id="driverMatricule" required><br>
            <button type="submit" id="driverajoutbtn">إضافة سائق</button>
            <button id="returnToHome" class="redbutton">العودة إلى الصفحة الرئيسية</button>
        </form>
    `;
    element.classList.remove('hidden');
    document.getElementById('saveDriverForm').addEventListener('submit', saveDriver);
    document.getElementById('returnToHome').addEventListener('click', () => {
        element.innerHTML = ``;
        nvelement.style.display = "none";
        document.getElementById('menu-icon').click();
    });
}

async function saveDriver(e) {
    e.preventDefault();
    const driverName = document.getElementById('driverName').value;
    const driverSurname = document.getElementById('driverSurname').value;
    const driverMatricule = document.getElementById('driverMatricule').value;

    watingpage.style.display = "flex";

    const driverajoutbtn_sub = document.getElementById('driverajoutbtn');
    driverajoutbtn_sub.style.display = "none";
    try {
        await addDoc(collection(db, "drivers"), {
            name: driverName,
            surname: driverSurname,
            matricule: driverMatricule
        });
        showAlert('تم حفظ السائق بنجاح');
        driverajoutbtn_sub.style.display = "flex";
        element.classList.remove('hidden');
        nvelement.style.display = "none";
        document.getElementById('menu-icon').click();
        watingpage.style.display = "none";

    } catch (error) {
        driverajoutbtn_sub.style.display = "flex";
        console.error("Error saving driver:", error);
        watingpage.style.display = "none";
        showAlert('خطأ أثناء حفظ السائق', 'error');
    }
}

function showAlert(message, type = 'success') {
    const alertBox = document.createElement('div');
    alertBox.className = `alert alert-${type}`;
    alertBox.textContent = message;
    document.body.appendChild(alertBox);
    setTimeout(() => alertBox.remove(), 3000);
}

const addjour = document.getElementById("addjour");
addjour.addEventListener('click', () => {
    nvelement.style.display = "flex";

    element.innerHTML = `
    <h2>بدء اليوم</h2>
       <form id="startDayForm">
        <label for="initialGorge">القيمة الأولية للغورج:</label>
        <input type="number" id="initialGorge" step="any" required><br>
        <label for="initialConteur">القيمة الأولية للعداد:</label>
        <input type="number" id="initialConteur" step="any" required><br>
        <button type="submit">ابدأ</button>
        <button id="closestartdaytbtn" class="redbutton">العودة إلى الصفحة الرئيسية</button>
    </form>
    `;
    document.getElementById('closestartdaytbtn').addEventListener('click', () => {
        element.innerHTML = ``;
        nvelement.style.display = "none";
    });
    document.getElementById('startDayForm').addEventListener('submit', startDay);
});

function generateUniqueId() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  const dateString = `${year}${month}${day}`;

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < 15; i++) { // 15 caractères aléatoires pour un total de 23
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return dateString + randomString;
}

async function startDay(e) {
    e.preventDefault();
    const initialGorge = parseFloat(document.getElementById('initialGorge').value);
    const initialConteur = parseFloat(document.getElementById('initialConteur').value);
    watingpage.style.display = "flex";

    const varid = generateUniqueId();

    try {
        await setDoc(doc(db, "dayStart", varid), {
            initialGorge: initialGorge,
            initialConteur: initialConteur,
            startedAt: new Date(), // Enregistre la date et l'heure de début
            statut: "en_cours",
            endGorge: "",
            endConteur: "",
            endedAt: "" // Date et heure de fin
        });
        watingpage.style.display = "none";
        element.innerHTML = ``;
        watingpage.style.display = "none";
        nvelement.style.display = "none";
        showAlert('تم بدء اليوم بنجاح');
        location.reload();
        
    } catch (error) {
        console.error("Error starting day:", error);
        watingpage.style.display = "none";

        showAlert('خطأ أثناء بدء اليوم', 'error');
        
    }
}

async function afficherlesjourshomepage() {
    const joursbackround = document.getElementById('joursbackround');

    function formatDate(timestamp) {
        const date = timestamp.toDate();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Janvier est 0 !
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    loadDays();

    async function loadDays() {
        try {
            const collecRef = collection(db, "dayStart");
            const q = query(collecRef, orderBy("startedAt", "desc"));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                watingpage.style.display = "none";
            } else {
                querySnapshot.forEach((doc) => {
                    const day = doc.data();
                    const day_id = doc.id;
                    const statut = day.statut;
                    watingpage.style.display = "none";

                    let formattedDate = "";
                    if (day.startedAt) {
                        const date = day.startedAt;
                        formattedDate = formatDate(date);
                    }
                    const divday = document.createElement("div");
                    if (statut === "en_cours") {
                        divday.className = "jourencour";
                        addjour.style.display = "none";
                        watingpage.style.display = "none";
                        
                        divday.addEventListener('click', () => {
                            showConsumptionForm(day_id);
                        });
                    }

                    if (statut === "fin") {
                        divday.className = "jour";
                        watingpage.style.display = "none";

                        divday.addEventListener('click', () => {
                            showlesResous(day_id);
                        });
                    }
                    const divdayp = document.createElement("p");
                    divdayp.innerHTML = formattedDate;

                    joursbackround.appendChild(divday);
                    divday.appendChild(divdayp);
                });
            }

        } catch (error) {
            console.error("Error loading drivers:", error);
            showAlert('خطأ أثناء تحميل السائقين', 'error');
        }
    }
}

function showConsumptionForm(day_id) {
    nvelement.style.display = "flex";
    element.innerHTML = `
        <h2>إضافة استهلاك</h2>
        <form id="consumptionForm">
            <label for="driverSelect">اختر سائق:</label>
            <select id="driverSelect"></select><br>
            <label for="consumptionAmount">كمية الاستهلاك:</label>
            <input type="number" id="consumptionAmount" step="any" required><br>
        </form>
            <button id="consumptionForm_submit" class="greenbtn">إضافة استهلاك</button>
            <button id="returnToHome" class="redbutton">العودة إلى الصفحة الرئيسية</button>
            <br>
            <br>
            <div class="ligne"></div>
            <br>
            <br>
            <button id="finaliserlajournee" class="orangebtn">إنهاء اليوم</button>
    `;

    element.classList.remove('hidden');

    document.getElementById('consumptionForm_submit').addEventListener('click', function(e) {
        addConsumption(e, day_id);
    });

    document.getElementById('finaliserlajournee').addEventListener('click', function(e) {
        endDay(day_id);
    });

    document.getElementById('returnToHome').addEventListener('click', () => {
        element.innerHTML = ``;
        element.classList.add('hidden');
        nvelement.style.display = "none";
    });
    loadDrivers();
}

async function loadDrivers() { 
    const driverSelect = document.getElementById('driverSelect');
    driverSelect.innerHTML = '<option value="" selected disabled>----- ---- </option>';

    try {
        const querySnapshot = await getDocs(collection(db, "drivers"));
        querySnapshot.forEach((doc) => {
            const driver = doc.data();
            const option = document.createElement('option');
            option.value = doc.id;
            option.textContent = `${driver.name} ${driver.surname} -  ${driver.matricule}`;
            driverSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading drivers:", error);
        showAlert('خطأ أثناء تحميل السائقين', 'error');
    }
}

async function addConsumption(e, day_id) {
    e.preventDefault();
    const driverId = document.getElementById('driverSelect').value;
    const consumptionAmount = parseFloat(document.getElementById('consumptionAmount').value);
    
    if (!day_id) {
        console.error("Invalid day_id");
        showAlert('خطأ: معرف اليوم غير صحيح', 'error');
        return;
    }

    try {
        const consumptionsRef = collection(db, "dayStart", day_id, "consommations");
        
        if (!driverId) {
            showAlert('اختر سائقًا', 'error');
        } else if (!consumptionAmount) {
            showAlert('أدخل كمية الاستهلاك', 'error');
        } else {
            await addDoc(consumptionsRef, {
                driverId: driverId,
                amount: consumptionAmount,
                timestamp: new Date() // Enregistre automatiquement la date
            });
            element.innerHTML = ``;
            showConsumptionForm(day_id); 
            
            showAlert('تمت إضافة الاستهلاك بنجاح');
        }

    } catch (error) {
        console.error("Error adding consumption:", error);
        showAlert('خطأ أثناء إضافة الاستهلاك', 'error');
    }
}

async function endDay(day_id) {
    const endGorge = parseFloat(prompt("القيمة النهائية للغورج:"));
    const endConteur = parseFloat(prompt("القيمة النهائية للعداد:"));

    if (isNaN(endGorge) || isNaN(endConteur)) {
        showAlert('يرجى إدخال قيم صالحة للغورج والعداد.', 'error');
        return;
    }

    try {
        watingpage.style.display = "flex";

        const consumptionsRefendday = doc(db, "dayStart", day_id);

        await updateDoc(consumptionsRefendday, {
            endGorge: endGorge,
            endConteur: endConteur,
            endedAt: new Date(), // Assurez-vous que cette valeur est correcte
            statut: "fin",
        }, { merge: true });
        location.reload();
        showAlert('تم إيقاف اليوم بنجاح');
        
    } catch (error) {
        watingpage.style.display = "none";
        console.error("Error ending day:", error);
        showAlert('خطأ أثناء إيقاف اليوم', 'error');
    }
}



async function showlesResous(day_id) {
    watingpage.style.display = "flex";
    nvelement.style.display = "flex";
    const element = document.getElementById('element');

    if (!element) {
        console.error("Element with id 'element' not found.");
        return;
    }
    let html = ``;

    // Récupérer le snapshot de la collection "dayStart" avec l'identifiant "day_id"
    const consumptionsSnap = await getDoc(doc(db, "dayStart", day_id));

    // Vérifier si le document existe
    if (consumptionsSnap.exists()) {
        // Obtenir les données du document
        const dataDayStartEnd = consumptionsSnap.data();
    
        // Extraire les valeurs spécifiques
        const gstart = dataDayStartEnd.initialGorge;
        const cstart = dataDayStartEnd.initialConteur;
        const datestart = dataDayStartEnd.startedAt;

        // Construire le contenu HTML
        html += `
        <br>
                    <br><br>
            <br><br>
            <br><br>
            <br><br>
            <br><br>
            <br><br>
        <button id="exporttoexcelday" class="greenbtn">تصدير الى اكسل  </button>
        <button id="returnToHomeConDay" class="redbutton">العودة إلى الصفحة الرئيسية</button>
        <br> <br><br>
        <div class="ligne"></div>
        <br><br>
        <br>
        <h2> معلومات بداية اليوم  </h2>
        <table id="dayStartTable">
            <thead>
                <tr>
                    <th>قيمة العداد بداية اليوم</th>
                    <th>لجورج بداية اليوم</th>
                    <th> الوقت   </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${cstart}</td>
                    <td>${gstart}</td>
                    <td>${formatDate(datestart)}</td>
                </tr>
            </tbody>
        </table>
        <br>
        `;
    } else {
        // Gérer le cas où le document n'existe pas
        console.log("Document not found!");
    }

    html += `
    <br>
    <h2> نتاءىج استهلاك البنزين اليومي  </h2>

    <table id="consumptionTable">
        <thead>
            <tr>
                <th>الاسم</th>
                <th>اللقب</th>
                <th>الرمز</th>
                <th>الاستهلاك (لترات)</th>
                <th>تاريخ الاستهلاك</th>
            </tr>
        </thead>
        <tbody>
    `;

    try {
        const driversSnapshot = await getDocs(collection(db, "drivers"));
        const consumptionsSnapshot = await getDocs(collection(db, "dayStart", day_id, "consommations"));

        const driverMap = {};

        driversSnapshot.forEach((doc) => {
            const driver = doc.data();
            driverMap[doc.id] = {
                name: driver.name,
                surname: driver.surname,
                matricule: driver.matricule,
                consumption: 0,
                consumptionDate: null
            };
        });

        consumptionsSnapshot.forEach((doc) => {
            const consumption = doc.data();

            if (driverMap[consumption.driverId]) {
                driverMap[consumption.driverId].consumption += consumption.amount;
                driverMap[consumption.driverId].consumptionDate = consumption.timestamp;
            }
        });

        Object.values(driverMap).forEach(driver => {
            if (driver.consumption !== 0) {
                html += `
                <tr>
                    <td>${driver.name}</td>
                    <td>${driver.surname}</td>
                    <td>${driver.matricule}</td>
                    <td>${driver.consumption}</td>
                    <td>${driver.consumptionDate ? formatDate(driver.consumptionDate) : ''}</td>
                </tr>
                `;
            }
        });

        html += `
        </tbody>
    </table>
    `;

        // Vérifier si le document existe
        if (consumptionsSnap.exists()) {
            // Obtenir les données du document
            const dataDayStartEnd = consumptionsSnap.data();
        
            const gend = dataDayStartEnd.endGorge;
            const cend = dataDayStartEnd.endConteur;
            const timeend = dataDayStartEnd.endedAt;

        
            // Construire le contenu HTML
            html += `
            <br>
            <h2> معلومات نهاية اليوم  </h2>
            <table id="dayEndTable">
                <thead>
                    <tr>
                        <th>قيمة العداد بداية اليوم</th>
                        <th>لجورج بداية اليوم</th>
                         <th> الوقت</th>

                    </tr>
                </thead>
                <tbody>
                    <tr>

                        <td>${cend}</td>
                        <td>${gend}</td>
                        <td>${formatDate(timeend)}</td>
                    </tr>
                </tbody>
            </table>
            <br><br>
            <br><br>
            <br><br>
            <br><br>
            <br><br>
            <br><br>
            <br><br>
            <br><br>
             `;
        } else {
            // Gérer le cas où le document n'existe pas
            console.log("Document not found!");
        }
        watingpage.style.display = "none";

        element.innerHTML = html;
        element.classList.remove('hidden');

        const returnToHomeConDay = document.getElementById('returnToHomeConDay');
        const exporttoexcelday = document.getElementById('exporttoexcelday');

        returnToHomeConDay.addEventListener('click', () => {
            element.innerHTML = "";
            nvelement.style.display = "none";
        });

        exporttoexcelday.addEventListener('click', () => {
            const dataDayStartEnd = consumptionsSnap.data();
            const datestart = dataDayStartEnd.startedAt;
            watingpage.style.display="flex";
            exportToExcel(datestart);
        });

    } catch (error) {
        console.error("Error loading dashboard data:", error);
        showAlert('Erreur lors du chargement du tableau de bord', 'error');
    }
}

function exportToExcel(datestart) {
    const workbook = XLSX.utils.book_new();

    // Obtenir les données des tables
    const dayStartTable = document.getElementById('dayStartTable');
    const consumptionTable = document.getElementById('consumptionTable');
    const dayEndTable = document.getElementById('dayEndTable');

    // Convertir les tables en JSON
    const dayStartData = XLSX.utils.sheet_to_json(XLSX.utils.table_to_sheet(dayStartTable), { header: 1 });
    const consumptionData = XLSX.utils.sheet_to_json(XLSX.utils.table_to_sheet(consumptionTable), { header: 1 });
    const dayEndData = XLSX.utils.sheet_to_json(XLSX.utils.table_to_sheet(dayEndTable), { header: 1 });

    // Fusionner les données en une seule feuille
    const combinedData = [
        [],
        ['معلومات بداية اليوم '],
        ...dayStartData,
        [],
        [],

        ['نتاءىج استهلاك البنزين اليومي '],
        ...consumptionData,
        [],
        [],
        ['معلومات نهاية اليوم '],
        ...dayEndData
    ];

    // Créer une nouvelle feuille de calcul avec les données combinées
    const combinedSheet = XLSX.utils.aoa_to_sheet(combinedData);

    // Formater les dates et heures dans les cellules appropriées
    formatSheetDates(combinedSheet, combinedData);

    // Ajouter des styles aux cellules
    applyStyles(combinedSheet, combinedData);

    // Ajouter la feuille au classeur
    XLSX.utils.book_append_sheet(workbook, combinedSheet, 'Rapport quotidien');

    const dateTodayForFile = formatDateFichiet(datestart);

    // Exportation du fichier
    XLSX.writeFile(workbook, 'Rapport_Daily_mazot_' + dateTodayForFile + '.xlsx');
    watingpage.style.display = "none";
}

function formatSheetDates(sheet, data) {
    const dateColumns = [2, 4]; // Colonnes contenant les dates (ajustez selon vos données)

    for (let R = 1; R < data.length; R++) {
        for (let C of dateColumns) {
            if (sheet[XLSX.utils.encode_cell({r: R, c: C})]) {
                const cell = sheet[XLSX.utils.encode_cell({r: R, c: C})];
                const date = new Date(cell.v);
                cell.t = 'd';
                cell.z = 'yyyy-mm-dd hh:mm:ss';
                cell.v = date;
            }
        }
    }
}

function applyStyles(sheet, data) {
    const range = XLSX.utils.decode_range(sheet['!ref']);
    for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellAddress = {c: C, r: R};
            const cellRef = XLSX.utils.encode_cell(cellAddress);
            if (!sheet[cellRef]) continue;
            sheet[cellRef].s = {
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } }
                },
                fill: {
                    fgColor: { rgb: (R === 0 || data[R][0] === '') ? "FFFF00" : "FFFFFF" }
                }
            };
        }
        
    }
}





function formatDateFichiet (datestart) {
    const date = datestart.toDate();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}_${month}_${year}`;
}




function formatDate(timestamp) {
    const date = timestamp.toDate();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day} / ${month} / ${year}    ${hours}:${minutes}`;
}