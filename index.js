document.addEventListener('DOMContentLoaded', () => {
    // קצב הגדלת המחירים המרכזי
    const PRICE_GROWTH = 1.5; 

    // משתני המשחק
    let linesOfCode = 0;
    let clickPower = 1;
    
    let upgradeCost = 10;
    let juniorDevCost = 50;
    let seniorDevCost = 250;
    let aiCopilotCost = 1000;

    let juniorCount = 0;
    let seniorCount = 0;
    let aiCount = 0;
    let autoCodeSpeed = 0;

    let eventMultiplier = 1;
    let luckyMultiplier = 1;
    let costMultiplier = 1;
    
    let timeLeft = 15 * 60; 
    let luckyTimeLeft = 0;
    let eventDurationLeft = 0;
    
    let luckyTimerInterval;
    let eventInterval;

    // אלמנטים מה-UI
    const countDisplay = document.getElementById('count');
    const timerDisplay = document.getElementById('event-timer');
    const luckyTimerDisplay = document.getElementById('lucky-timer');
    const luckyTimerContainer = document.getElementById('lucky-timer-container');
    const powerDisplay = document.getElementById('click-power');
    const autoDisplay = document.getElementById('auto-speed');
    const eventBanner = document.getElementById('event-banner');
    
    const shopContainer = document.getElementById('developer-shop');
    const openShopBtn = document.getElementById('shop-toggle-btn');
    const closeShopBtn = document.getElementById('close-shop-btn');

    const clickButton = document.getElementById('code-button');
    const upgradeButton = document.getElementById('upgrade-keyboard');
    const juniorButton = document.getElementById('buy-junior');
    const seniorButton = document.getElementById('buy-senior');
    const aiButton = document.getElementById('buy-ai');

    const sellKeyboardButton = document.getElementById('sell-keyboard');
    const sellJuniorButton = document.getElementById('sell-junior');
    const sellSeniorButton = document.getElementById('sell-senior');
    const sellAiButton = document.getElementById('sell-ai');

    openShopBtn.onclick = () => shopContainer.style.display = 'block';
    closeShopBtn.onclick = () => shopContainer.style.display = 'none';

    function formatShortNumber(num) {
        if (num >= 1e12) return (num / 1e12).toFixed(2).replace(/\.0$/, '') + 'T';
        if (num >= 1e9)  return (num / 1e9).toFixed(2).replace(/\.0$/, '') + 'B';
        if (num >= 1e6)  return (num / 1e6).toFixed(2).replace(/\.0$/, '') + 'M';
        if (num >= 1e3)  return (num / 1e3).toFixed(2).replace(/\.0$/, '') + 'K';
        return Math.floor(num).toString();
    }

    function updateUI() {
        const totalMult = eventMultiplier * luckyMultiplier;
        autoCodeSpeed = (juniorCount * 1) + (seniorCount * 5) + (aiCount * 20);

        countDisplay.innerText = formatShortNumber(linesOfCode);
        powerDisplay.innerText = formatShortNumber(clickPower * totalMult);
        autoDisplay.innerText = formatShortNumber(autoCodeSpeed * totalMult);
        
        upgradeButton.innerText = `Upgrade Keyboard (Cost: ${formatShortNumber(upgradeCost * costMultiplier)})`;
        juniorButton.innerText = `Hire Junior Dev (+1/s) (Cost: ${formatShortNumber(juniorDevCost * costMultiplier)})`;
        seniorButton.innerText = `Hire Senior Dev (+5/s) (Cost: ${formatShortNumber(seniorDevCost * costMultiplier)})`;
        aiButton.innerText = `Deploy AI Copilot (+20/s) (Cost: ${formatShortNumber(aiCopilotCost * costMultiplier)})`;
    }

    function formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    }

    setInterval(() => {
        if (eventMultiplier === 1) {
            timeLeft--;
            timerDisplay.innerText = formatTime(timeLeft);
            if (timeLeft <= 0) { startHackathon(); timeLeft = 15 * 60; }
        }
    }, 1000);

    function startHackathon() {
        eventMultiplier = 3; costMultiplier = 0.5; eventDurationLeft = 30;
        eventBanner.style.display = "block"; eventBanner.style.background = "#ffcc00"; eventBanner.style.color = "#000";

        clearInterval(eventInterval);
        eventInterval = setInterval(() => {
            eventDurationLeft--;
            eventBanner.innerText = `🚀 HACKATHON! 3X CODE & 50% OFF! (${eventDurationLeft}s)`;
            if (eventDurationLeft <= 0) {
                clearInterval(eventInterval);
                eventMultiplier = 1; costMultiplier = 1;
                if (luckyMultiplier === 1) eventBanner.style.display = "none";
                updateUI();
            }
        }, 1000);
    }

    setInterval(() => {
        if (Math.floor(Math.random() * 5) + 1 === 3) {
            const btn = document.createElement('button');
            btn.className = 'lucky-button'; btn.innerText = '✨ BONUS ✨';
            btn.style.left = Math.random() * (window.innerWidth - 100) + 'px';
            btn.style.top = Math.random() * (window.innerHeight - 100) + 'px';
            btn.onclick = () => { triggerLuckyEvent(); btn.remove(); if(window.confetti) confetti(); };
            document.body.appendChild(btn);
            setTimeout(() => btn.remove(), 10000);
        }
    }, 25000);

    function triggerLuckyEvent() {
        const roll = Math.random() * 100;
        let s = roll < 5 ? {m:800, t:120, msg:"GOD MODE: 800X!", col:"#ff0000"} :
                roll < 20 ? {m:100, t:60, msg:"MEGA: 100X!", col:"#ff00ff"} :
                roll < 50 ? {m:10, t:45, msg:"10X BOOST!", col:"#800080"} : {m:2, t:30, msg:"2X BOOST!", col:"#444"};

        luckyMultiplier = s.m; luckyTimeLeft = s.t;
        eventBanner.style.display = "block"; eventBanner.style.background = s.col; eventBanner.style.color = "#fff";
        eventBanner.innerText = `🌟 ${s.msg}`;
        luckyTimerContainer.style.display = "block";

        clearInterval(luckyTimerInterval);
        luckyTimerInterval = setInterval(() => {
            luckyTimeLeft--;
            luckyTimerDisplay.innerText = formatTime(luckyTimeLeft);
            if (luckyTimeLeft <= 0) {
                clearInterval(luckyTimerInterval); luckyMultiplier = 1;
                luckyTimerContainer.style.display = "none";
                if (eventMultiplier === 1) eventBanner.style.display = "none";
                updateUI();
            }
        }, 1000);
    }

    function triggerError() {
        countDisplay.classList.add('error-text');
        setTimeout(() => countDisplay.classList.remove('error-text'), 500);
    }

    clickButton.onclick = () => { linesOfCode += (clickPower * eventMultiplier * luckyMultiplier); updateUI(); };

    upgradeButton.onclick = () => {
        const price = Math.round(upgradeCost * costMultiplier);
        if (linesOfCode >= price) { linesOfCode -= price; clickPower++; upgradeCost *= PRICE_GROWTH; updateUI(); } 
        else { triggerError(); }
    };

    juniorButton.onclick = () => {
        const price = Math.round(juniorDevCost * costMultiplier);
        if (linesOfCode >= price) { linesOfCode -= price; juniorCount++; juniorDevCost *= PRICE_GROWTH; updateUI(); } 
        else { triggerError(); }
    };

    seniorButton.onclick = () => {
        const price = Math.round(seniorDevCost * costMultiplier);
        if (linesOfCode >= price) { linesOfCode -= price; seniorCount++; seniorDevCost *= PRICE_GROWTH; updateUI(); } 
        else { triggerError(); }
    };

    aiButton.onclick = () => {
        const price = Math.round(aiCopilotCost * costMultiplier);
        if (linesOfCode >= price) { linesOfCode -= price; aiCount++; aiCopilotCost *= PRICE_GROWTH; updateUI(); } 
        else { triggerError(); }
    };

    
    sellKeyboardButton.onclick = () => {
        if (clickPower > 1) { linesOfCode += Math.round((upgradeCost / PRICE_GROWTH) * 0.7); clickPower--; upgradeCost /= PRICE_GROWTH; updateUI(); }
    };
    sellJuniorButton.onclick = () => {
        if (juniorCount > 0) { linesOfCode += Math.round((juniorDevCost / PRICE_GROWTH) * 0.7); juniorCount--; juniorDevCost /= PRICE_GROWTH; updateUI(); }
    };
    sellSeniorButton.onclick = () => {
        if (seniorCount > 0) { linesOfCode += Math.round((seniorDevCost / PRICE_GROWTH) * 0.7); seniorCount--; seniorDevCost /= PRICE_GROWTH; updateUI(); }
    };
    sellAiButton.onclick = () => {
        if (aiCount > 0) { linesOfCode += Math.round((aiCopilotCost / PRICE_GROWTH) * 0.7); aiCount--; aiCopilotCost /= PRICE_GROWTH; updateUI(); }
    };

    setInterval(() => {
        const totalAuto = (juniorCount * 1) + (seniorCount * 5) + (aiCount * 20);
        linesOfCode += (totalAuto * eventMultiplier * luckyMultiplier);
        updateUI();
    }, 1000);

    updateUI();
});
