document.addEventListener('DOMContentLoaded', () => {

    let linesOfCode = 0;      
    let clickPower = 1;       
    let upgradeCost = 10;     
    let autoCodeSpeed = 0;    
    let juniorDevCost = 50;   

    let eventMultiplier = 1;  
    let luckyMultiplier = 1;  
    let costMultiplier = 1;   
    
    const HACKATHON_WAIT = 15 * 60; 
    let timeLeft = HACKATHON_WAIT;
    const LUCKY_NUMBER = 7;         

    let luckyTimeLeft = 0; 
    let luckyTimerInterval; 

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

    function showError() {
        alert("Error: Insufficient funds!\nYou need more Lines of Code.");
        countDisplay.classList.add('error-text');
        setTimeout(() => countDisplay.classList.remove('error-text'), 500);
    }

    // --- Hackathon System ---
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
            if (luckyMultiplier === 1) eventBanner.style.display = "none";
            updateUI();
        }, 30000);
    }

    // --- Lucky Button System ---
    setInterval(() => {
        let roll = Math.floor(Math.random() * 10) + 1;
        if (roll === LUCKY_NUMBER) createLuckyButton();
    }, 60000);

    function createLuckyButton() {
        const btn = document.createElement('button');
        btn.className = 'lucky-button';
        btn.innerText = '✨ BONUS ✨';
        const x = Math.random() * (window.innerWidth - 100);
        const y = Math.random() * (window.innerHeight - 100);
        btn.style.left = Math.max(10, x) + 'px';
        btn.style.top = Math.max(10, y) + 'px';
        btn.onclick = () => { triggerLuckyEvent(); btn.remove(); };
        document.body.appendChild(btn);
        setTimeout(() => { if(btn.parentNode) btn.remove(); }, 10000);
    }

    function triggerLuckyEvent() {
        const roll = Math.random() * 100;
        let selected;
        if (roll < 5) selected = { mult: 800, time: 120, msg: "GOD MODE: 800X CODE! 🏆", color: "#ff0000" };
        else if (roll < 20) selected = { mult: 100, time: 60, msg: "MEGA CODE: 100X CODE! 🔥", color: "#ff00ff" };
        else if (roll < 50) selected = { mult: 10, time: 45, msg: "10X CODE BOOST! ✨", color: "#800080" };
        else selected = { mult: 2, time: 30, msg: "2X CODE BOOST! 🐛", color: "#444" };

        luckyMultiplier = selected.mult;
        luckyTimeLeft = selected.time;
        eventBanner.style.display = "block";
        eventBanner.style.background = selected.color;
        eventBanner.innerText = `🌟 ${selected.msg}`;
        luckyTimerContainer.style.display = "block";

        clearInterval(luckyTimerInterval);
        luckyTimerInterval = setInterval(() => {
            luckyTimeLeft--;
            let mins = Math.floor(luckyTimeLeft / 60);
            let secs = luckyTimeLeft % 60;
            luckyTimerDisplay.innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
            if (luckyTimeLeft <= 0) {
                clearInterval(luckyTimerInterval);
                luckyMultiplier = 1;
                luckyTimerContainer.style.display = "none";
                if (eventMultiplier === 1) eventBanner.style.display = "none";
                updateUI();
            }
        }, 1000);
        updateUI();
    }

    // --- Core Logic ---
    clickButton.addEventListener('click', () => {
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
        } else { showError(); }
    });

    juniorButton.addEventListener('click', () => {
        let price = Math.round(juniorDevCost * costMultiplier);
        if (linesOfCode >= price) {
            linesOfCode -= price;
            autoCodeSpeed += 1;
            juniorDevCost = Math.round(juniorDevCost * 1.5);
            updateUI();
        } else { showError(); }
    });

    setInterval(() => {
        linesOfCode += (autoCodeSpeed * eventMultiplier * luckyMultiplier);
        updateUI();
    }, 1000);

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

    updateUI();
});
