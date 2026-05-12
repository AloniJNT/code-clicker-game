document.addEventListener('DOMContentLoaded', () => {
    // --- משתני המשחק ---
    let linesOfCode = 0;
    let clickPower = 1;
    let upgradeCost = 10;
    let autoCodeSpeed = 0;
    let juniorDevCost = 50;

    let eventMultiplier = 1;
    let luckyMultiplier = 1;
    let costMultiplier = 1;
    
    let timeLeft = 15 * 60; // האקתון
    let luckyTimeLeft = 0;
    let eventDurationLeft = 0;
    
    let luckyTimerInterval;
    let eventInterval;

    // --- אלמנטים מה-UI ---
    const countDisplay = document.getElementById('count');
    const timerDisplay = document.getElementById('event-timer');
    const luckyTimerDisplay = document.getElementById('lucky-timer');
    const luckyTimerContainer = document.getElementById('lucky-timer-container');
    const powerDisplay = document.getElementById('click-power');
    const autoDisplay = document.getElementById('auto-speed');
    const eventBanner = document.getElementById('event-banner');
    const clickButton = document.getElementById('code-button');
    const upgradeButton = document.getElementById('upgrade-keyboard');
    const juniorButton = document.getElementById('buy-junior');
    const sellKeyboardButton = document.getElementById('sell-keyboard');
    const sellJuniorButton = document.getElementById('sell-junior');

    // --- עדכון UI ---
    function updateUI() {
        const totalMult = eventMultiplier * luckyMultiplier;
        countDisplay.innerText = Math.floor(linesOfCode).toLocaleString();
        powerDisplay.innerText = (clickPower * totalMult).toLocaleString();
        autoDisplay.innerText = (autoCodeSpeed * totalMult).toLocaleString();
        
        upgradeButton.innerText = `Upgrade Keyboard (Cost: ${Math.round(upgradeCost * costMultiplier)})`;
        juniorButton.innerText = `Hire Junior Dev (Cost: ${Math.round(juniorDevCost * costMultiplier)})`;
    }

    function formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    }

    // --- מערכת האקתון ---
    setInterval(() => {
        if (eventMultiplier === 1) {
            timeLeft--;
            timerDisplay.innerText = formatTime(timeLeft);
            if (timeLeft <= 0) {
                startHackathon();
                timeLeft = 15 * 60;
            }
        }
    }, 1000);

    function startHackathon() {
        eventMultiplier = 3;
        costMultiplier = 0.5;
        eventDurationLeft = 30;
        eventBanner.style.display = "block";
        eventBanner.style.background = "#ffcc00";
        eventBanner.style.color = "#000";

        clearInterval(eventInterval);
        eventInterval = setInterval(() => {
            eventDurationLeft--;
            eventBanner.innerText = `🚀 HACKATHON! 3X CODE & 50% OFF! (${eventDurationLeft}s)`;
            if (eventDurationLeft <= 0) {
                clearInterval(eventInterval);
                eventMultiplier = 1;
                costMultiplier = 1;
                if (luckyMultiplier === 1) eventBanner.style.display = "none";
                updateUI();
            }
        }, 1000);
    }

    // --- כפתור מזל (מערכת בונוסים) ---
    setInterval(() => {
        if (Math.floor(Math.random() * 5) + 1 === 3) {
            const btn = document.createElement('button');
            btn.className = 'lucky-button';
            btn.innerText = '✨ BONUS ✨';
            btn.style.left = Math.random() * (window.innerWidth - 100) + 'px';
            btn.style.top = Math.random() * (window.innerHeight - 100) + 'px';
            btn.onclick = () => { triggerLuckyEvent(); btn.remove(); if(window.confetti) confetti(); };
            document.body.appendChild(btn);
            setTimeout(() => btn.remove(), 10000);
        }
    }, 35000);

    function triggerLuckyEvent() {
        const roll = Math.random() * 100;
        let s = roll < 5 ? {m:800, t:120, msg:"GOD MODE: 800X!", col:"#ff0000"} :
                roll < 20 ? {m:100, t:60, msg:"MEGA: 100X!", col:"#ff00ff"} :
                roll < 50 ? {m:10, t:45, msg:"10X BOOST!", col:"#800080"} : {m:2, t:30, msg:"2X BOOST!", col:"#444"};

        luckyMultiplier = s.m;
        luckyTimeLeft = s.t;
        eventBanner.style.display = "block";
        eventBanner.style.background = s.col;
        eventBanner.style.color = "#fff";
        eventBanner.innerText = `🌟 ${s.msg}`;
        luckyTimerContainer.style.display = "block";

        clearInterval(luckyTimerInterval);
        luckyTimerInterval = setInterval(() => {
            luckyTimeLeft--;
            luckyTimerDisplay.innerText = formatTime(luckyTimeLeft);
            if (luckyTimeLeft <= 0) {
                clearInterval(luckyTimerInterval);
                luckyMultiplier = 1;
                luckyTimerContainer.style.display = "none";
                if (eventMultiplier === 1) eventBanner.style.display = "none";
                updateUI();
            }
        }, 1000);
    }

    // --- קליקים וקניות ---
    clickButton.onclick = () => {
        linesOfCode += (clickPower * eventMultiplier * luckyMultiplier);
        updateUI();
    };

    upgradeButton.onclick = () => {
        const price = Math.round(upgradeCost * costMultiplier);
        if (linesOfCode >= price) {
            linesOfCode -= price;
            clickPower++;
            upgradeCost *= 1.5;
            updateUI();
        } else {
            countDisplay.classList.add('error-text');
            setTimeout(() => countDisplay.classList.remove('error-text'), 500);
        }
    };

    juniorButton.onclick = () => {
        const price = Math.round(juniorDevCost * costMultiplier);
        if (linesOfCode >= price) {
            linesOfCode -= price;
            autoCodeSpeed++;
            juniorDevCost *= 1.5;
            updateUI();
        }
    };

    sellKeyboardButton.onclick = () => {
        if (clickPower > 1) {
            linesOfCode += Math.round((upgradeCost / 1.5) * 0.7);
            clickPower--;
            upgradeCost /= 1.5;
            updateUI();
        }
    };

    sellJuniorButton.onclick = () => {
        if (autoCodeSpeed > 0) {
            linesOfCode += Math.round((juniorDevCost / 1.5) * 0.7);
            autoCodeSpeed--;
            juniorDevCost /= 1.5;
            updateUI();
        }
    };

    // קצב אוטומטי
    setInterval(() => {
        linesOfCode += (autoCodeSpeed * eventMultiplier * luckyMultiplier);
        updateUI();
    }, 1000);

    updateUI();
});
