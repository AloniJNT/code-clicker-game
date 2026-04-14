document.addEventListener('DOMContentLoaded', () => {

    // --- GAME DATA ---
    let linesOfCode = 0;
    let clickPower = 1;
    let upgradeCost = 10;
    let autoCodeSpeed = 0;
    let juniorDevCost = 50;

    // --- EVENT & TIMER DATA ---
    let eventMultiplier = 1; 
    let costMultiplier = 1;
    const HACKATHON_WAIT = 15 * 60; // 15 minutes in seconds
    let timeLeft = HACKATHON_WAIT;

    // --- ELEMENTS ---
    const countDisplay = document.getElementById('count');
    const timerDisplay = document.getElementById('event-timer');
    const powerDisplay = document.getElementById('click-power');
    const autoDisplay = document.getElementById('auto-speed');
    const eventBanner = document.getElementById('event-banner');
    const clickButton = document.getElementById('code-button');
    const upgradeButton = document.getElementById('upgrade-keyboard');
    const juniorButton = document.getElementById('buy-junior');

    // --- 1. THE COUNTDOWN TIMER LOOP ---
    setInterval(() => {
        if (eventMultiplier === 1) { // Only count down if event is not active
            timeLeft--;
            if (timeLeft <= 0) {
                startHackathon();
                timeLeft = HACKATHON_WAIT; // Reset timer
            }
            updateTimerUI();
        }
    }, 1000);

    function updateTimerUI() {
        let mins = Math.floor(timeLeft / 60);
        let secs = timeLeft % 60;
        timerDisplay.innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // --- 2. HACKATHON LOGIC ---
    function startHackathon() {
        eventMultiplier = 3;
        costMultiplier = 0.5;
        eventBanner.style.display = "block";
        timerDisplay.innerText = "LIVE!";
        updateUI();

        // Event lasts 30 seconds
        setTimeout(() => {
            eventMultiplier = 1;
            costMultiplier = 1;
            eventBanner.style.display = "none";
            updateUI();
        }, 30000);
    }

    // --- 3. CLICKING & UPGRADES ---
    clickButton.addEventListener('click', () => {
        linesOfCode += (clickPower * eventMultiplier);
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

    // --- 4. AUTO-CLICKER LOOP ---
    setInterval(() => {
        linesOfCode += (autoCodeSpeed * eventMultiplier);
        updateUI();
    }, 1000);

    // --- 5. MAIN UI UPDATER ---
    function updateUI() {
        countDisplay.innerText = Math.floor(linesOfCode);
        powerDisplay.innerText = (clickPower * eventMultiplier);
        autoDisplay.innerText = (autoCodeSpeed * eventMultiplier);
        
        upgradeButton.innerText = `Better Keyboard (Cost: ${Math.round(upgradeCost * costMultiplier)})`;
        juniorButton.innerText = `Hire Junior Dev (Cost: ${Math.round(juniorDevCost * costMultiplier)})`;
    }
});
