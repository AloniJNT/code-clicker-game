document.addEventListener('DOMContentLoaded', () => {

    // --- 1. משתני נתונים (נתוני המשחק הבסיסיים) ---
    let linesOfCode = 0;      
    let clickPower = 1;       
    let upgradeCost = 10;     
    let autoCodeSpeed = 0;    
    let juniorDevCost = 50;   

    // --- 2. מערכת אירועים ובונוסים ---
    let eventMultiplier = 1;  // מכפיל האקתון (פי 3)
    let luckyMultiplier = 1;  // מכפיל מזל (נע בין 2 ל-800)
    let costMultiplier = 1;   // מכפיל מחירים (0.5 בהאקתון)
    
    const HACKATHON_WAIT = 15 * 60; // זמן המתנה להאקתון (15 דקות)
    let timeLeft = HACKATHON_WAIT;
    const LUCKY_NUMBER = 7;         // המספר שצריך לצאת בהגרלה כדי שכפתור יופיע

    // משתנים עבור הטיימר של איוונט המזל
    let luckyTimeLeft = 0; 
    let luckyTimerInterval; 

    // --- 3. חיבור לאלמנטים ב-HTML ---
    const countDisplay = document.getElementById('count');
    const timerDisplay = document.getElementById('event-timer');
    const luckyTimerDisplay = document.getElementById('lucky-timer'); // השעון עצמו
    const luckyTimerContainer = document.getElementById('lucky-timer-container'); // ה-div העוטף
    const powerDisplay = document.getElementById('click-power');
    const autoDisplay = document.getElementById('auto-speed');
    const eventBanner = document.getElementById('event-banner');
    const clickButton = document.getElementById('code-button');
    const upgradeButton = document.getElementById('upgrade-keyboard');
    const juniorButton = document.getElementById('buy-junior');

    // --- 4. ניהול זמן האקתון (האירוע המובנה) ---
    setInterval(() => {
        if (eventMultiplier === 1) { 
            timeLeft--;
            if (timeLeft <= 0) {
                startHackathon();
                timeLeft = HACKATHON_WAIT;
            }
            updateTimerUI();
        }
    }, 1000);

    function startHackathon() {
        eventMultiplier = 3;
        costMultiplier = 0.5;
        eventBanner.style.display = "block";
        eventBanner.style.background = "#ffcc00";
        eventBanner.innerText = "🚀 HACKATHON ACTIVE! 3X CODE & 50% OFF!";
        updateUI();

        setTimeout(() => {
            eventMultiplier = 1;
            costMultiplier = 1;
            // אם אין בונוס מזל פעיל, נעלים את הבאנר
            if (luckyMultiplier === 1) eventBanner.style.display = "none";
            updateUI();
        }, 30000);
    }

    // --- 5. מערכת כפתור המזל (Lucky Button) ---
    // הגרלה פעם בדקה אם להוציא כפתור
    setInterval(() => {
        let roll = Math.floor(Math.random() * 10) + 1;
        if (roll === LUCKY_NUMBER) createLuckyButton();
    }, 60000);

    function createLuckyButton() {
        const btn = document.createElement('button');
        btn.className = 'lucky-button';
        btn.innerText = '✨ BONUS ✨';
        
        // מיקום רנדומלי על המסך
        const x = Math.random() * (window.innerWidth - 150) + 50;
        const y = Math.random() * (window.innerHeight - 150) + 50;
        btn.style.left = x + 'px';
        btn.style.top = y + 'px';
        
        btn.onclick = () => {
            triggerLuckyEvent();
            btn.remove();
        };
        
        document.body.appendChild(btn);
        // הכפתור נעלם אחרי 10 שניות אם לא לחצו
        setTimeout(() => { if(btn.parentNode) btn.remove(); }, 10000);
    }

    // הפעלת האיוונט והפעלת הטיימר שלו
    function triggerLuckyEvent() {
        const roll = Math.random() * 100;
        let selected;

        // הגרלת סוג הבונוס והזמן שלו (בשניות) לפי נדירות
        if (roll < 5) { // 5% סיכוי
            selected = { mult: 800, time: 120, msg: "GOD MODE: 800X CODE! 🏆", color: "#ff0000" };
        } else if (roll < 20) { // 15% סיכוי
            selected = { mult: 100, time: 60, msg: "MEGA CODE: 100X CODE! 🔥", color: "#ff00ff" };
        } else if (roll < 50) { // 30% סיכוי
            selected = { mult: 10, time: 45, msg: "10X CODE BOOST! ✨", color: "#800080" };
        } else { // 50% סיכוי
            selected = { mult: 2, time: 30, msg: "2X CODE BOOST! 🐛", color: "#444" };
        }

        // עדכון המכפיל והזמן שנותר
        luckyMultiplier = selected.mult;
        luckyTimeLeft = selected.time;

        // הצגת האלמנטים על המסך
        eventBanner.style.display = "block";
        eventBanner.style.background = selected.color;
        eventBanner.innerText = `🌟 ${selected.msg}`;
        luckyTimerContainer.style.display = "block";

        // איפוס טיימר קודם אם היה פעיל
        clearInterval(luckyTimerInterval);

        // לולאת הטיימר של האיוונט
        luckyTimerInterval = setInterval(() => {
            luckyTimeLeft--;
            
            // חישוב דקות ושניות לתצוגה
            let mins = Math.floor(luckyTimeLeft / 60);
            let secs = luckyTimeLeft % 60;
            luckyTimerDisplay.innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

            // כשנגמר זמן הבונוס
            if (luckyTimeLeft <= 0) {
                clearInterval(luckyTimerInterval);
                luckyMultiplier = 1;
                luckyTimerContainer.style.display = "none";
                
                // בדיקה אם להעלים באנר או להחזיר להאקתון
                if (eventMultiplier === 1) eventBanner.style.display = "none";
                else {
                    eventBanner.style.background = "#ffcc00";
                    eventBanner.innerText = "🚀 HACKATHON ACTIVE! 3X CODE & 50% OFF!";
                }
                updateUI();
            }
        }, 1000);

        updateUI();
    }

    // --- 6. ליבת המשחק (קליקים ושדרוגים) ---
    clickButton.addEventListener('click', () => {
        // הכפלת כל המכפילים בבת אחת (אפקט קומבו!)
        linesOfCode += (clickPower * eventMultiplier * luckyMultiplier);
        updateUI();
    });

    upgradeButton.addEventListener('click', () => {
        let price = Math.round(upgradeCost * costMultiplier);
        if (linesOfCode >= price) {
            linesOfCode -= price;
            clickPower += 1;
            upgradeCost = Math.round(upgradeCost * 1.5);
            updateUI();
        }
    });

    juniorButton.addEventListener('click', () => {
        let price = Math.round(juniorDevCost * costMultiplier);
        if (linesOfCode >= price) {
            linesOfCode -= price;
            autoCodeSpeed += 1;
            juniorDevCost = Math.round(juniorDevCost * 1.5);
            updateUI();
        }
    });

    // ייצור אוטומטי של קוד כל שנייה
    setInterval(() => {
        linesOfCode += (autoCodeSpeed * eventMultiplier * luckyMultiplier);
        updateUI();
    }, 1000);

    // --- 7. עדכון ממשק משתמש ---
    function updateUI() {
        countDisplay.innerText = Math.floor(linesOfCode).toLocaleString();
        const currentMult = eventMultiplier * luckyMultiplier;
        powerDisplay.innerText = (clickPower * currentMult).toLocaleString();
        autoDisplay.innerText = (autoCodeSpeed * currentMult).toLocaleString();
        
        upgradeButton.innerText = `Better Keyboard (Cost: ${Math.round(upgradeCost * costMultiplier)})`;
        juniorButton.innerText = `Hire Junior Dev (Cost: ${Math.round(juniorDevCost * costMultiplier)})`;
    }

    function updateTimerUI() {
        let mins = Math.floor(timeLeft / 60);
        let secs = timeLeft % 60;
        timerDisplay.innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    updateUI(); // הרצה ראשונית
});
