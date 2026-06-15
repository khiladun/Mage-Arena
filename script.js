// ---------- GAME STATE ----------
let playerHP = 100;
let monsterHP = 100;
let currentLevel = 1;
let currentAnswer = null;
let currentQuestionText = "";
let canAttack = true;

// DOM elements
const welcomeDiv = document.getElementById('welcome');
const levelsDiv = document.getElementById('levels');
const fightDiv = document.getElementById('fight');
const playerEl = document.getElementById('player');
const monsterEl = document.getElementById('monster');
const bossNameSpan = document.getElementById('bossName');
const questionEl = document.getElementById('question');
const answerInput = document.getElementById('answer');
const msgDiv = document.getElementById('msg');
const arenaBg = document.getElementById('arenaBg');
const pHPspan = document.getElementById('pHP');
const mHPspan = document.getElementById('mHP');
const pBarDiv = document.getElementById('pBar');
const mBarDiv = document.getElementById('mBar');

function updateUI() {
    pHPspan.innerText = Math.max(0, playerHP);
    mHPspan.innerText = Math.max(0, monsterHP);
    let pPercent = Math.max(0, (playerHP / 100) * 100);
    let mPercent = Math.max(0, (monsterHP / 100) * 100);
    pBarDiv.style.width = pPercent + "%";
    mBarDiv.style.width = mPercent + "%";
}

// ========== MATH QUESTION GENERATORS ==========

// 🌳 FRACTION FOREST (simplify, add, compare)
function generateFractionQuestion() {
    const types = ['add', 'subtract', 'compare'];
    const type = types[Math.floor(Math.random() * 3)];
    
    if (type === 'add') {
        let num1 = Math.floor(Math.random() * 7) + 1;
        let den1 = Math.floor(Math.random() * 6) + 2;
        let num2 = Math.floor(Math.random() * 7) + 1;
        let den2 = Math.floor(Math.random() * 6) + 2;
        let common = den1 * den2;
        let newNum1 = num1 * den2;
        let newNum2 = num2 * den1;
        let resultNum = newNum1 + newNum2;
        let gcd = (a,b) => b === 0 ? a : gcd(b, a % b);
        let divisor = gcd(Math.abs(resultNum), common);
        let simpNum = resultNum / divisor;
        let simpDen = common / divisor;
        currentAnswer = simpDen === 1 ? simpNum.toString() : `${simpNum}/${simpDen}`;
        currentQuestionText = `${num1}/${den1} + ${num2}/${den2} = ? (simplify)`;
    } 
    else if (type === 'subtract') {
        let num1 = Math.floor(Math.random() * 8) + 2;
        let den1 = Math.floor(Math.random() * 6) + 2;
        let num2 = Math.floor(Math.random() * (num1-1)) + 1;
        let den2 = Math.floor(Math.random() * 6) + 2;
        let common = den1 * den2;
        let newNum1 = num1 * den2;
        let newNum2 = num2 * den1;
        let resultNum = newNum1 - newNum2;
        if (resultNum <= 0) resultNum = 1;
        let gcd = (a,b) => b === 0 ? a : gcd(b, a % b);
        let divisor = gcd(resultNum, common);
        let simpNum = resultNum / divisor;
        let simpDen = common / divisor;
        currentAnswer = simpDen === 1 ? simpNum.toString() : `${simpNum}/${simpDen}`;
        currentQuestionText = `${num1}/${den1} - ${num2}/${den2} = ? (simplify)`;
    }
    else {
        let num1 = Math.floor(Math.random() * 7) + 1;
        let den1 = Math.floor(Math.random() * 6) + 2;
        let num2 = Math.floor(Math.random() * 7) + 1;
        let den2 = Math.floor(Math.random() * 6) + 2;
        let val1 = num1 / den1;
        let val2 = num2 / den2;
        let symbol = val1 > val2 ? '>' : (val1 < val2 ? '<' : '=');
        currentAnswer = symbol;
        currentQuestionText = `Compare: ${num1}/${den1} ? ${num2}/${den2} ( > , < , = )`;
    }
    questionEl.innerText = `🌳 ${currentQuestionText}`;
}

// 🏜️ DECIMAL DESERT (addition, subtraction, multiplication)
function generateDecimalQuestion() {
    const types = ['add', 'subtract', 'multiply'];
    const type = types[Math.floor(Math.random() * 3)];
    
    if (type === 'add') {
        let d1 = (Math.random() * 90 + 10).toFixed(1);
        let d2 = (Math.random() * 90 + 10).toFixed(1);
        let result = (parseFloat(d1) + parseFloat(d2)).toFixed(1);
        currentAnswer = parseFloat(result).toString();
        currentQuestionText = `${d1} + ${d2} = ?`;
    }
    else if (type === 'subtract') {
        let d1 = (Math.random() * 90 + 20).toFixed(1);
        let d2 = (Math.random() * (parseFloat(d1)-5) + 5).toFixed(1);
        let result = (parseFloat(d1) - parseFloat(d2)).toFixed(1);
        currentAnswer = parseFloat(result).toString();
        currentQuestionText = `${d1} - ${d2} = ?`;
    }
    else {
        let d1 = (Math.random() * 9 + 1).toFixed(1);
        let d2 = (Math.random() * 9 + 1).toFixed(1);
        let result = (parseFloat(d1) * parseFloat(d2)).toFixed(2);
        currentAnswer = parseFloat(result).toString();
        currentQuestionText = `${d1} × ${d2} = ?`;
    }
    questionEl.innerText = `🏜️ ${currentQuestionText}`;
}

// ⛰️ PERCENTAGE PEAKS (find percent, percent of number)
function generatePercentageQuestion() {
    const types = ['percentOf', 'whatPercent'];
    const type = types[Math.floor(Math.random() * 2)];
    
    if (type === 'percentOf') {
        let percent = [10, 15, 20, 25, 30, 40, 50, 60, 75][Math.floor(Math.random() * 9)];
        let number = [40, 60, 80, 100, 120, 150, 200][Math.floor(Math.random() * 7)];
        let result = (percent / 100) * number;
        currentAnswer = Number.isInteger(result) ? result.toString() : result.toFixed(1);
        currentQuestionText = `What is ${percent}% of ${number}?`;
    }
    else {
        let part = Math.floor(Math.random() * 60) + 20;
        let whole = Math.floor(Math.random() * (100 - part)) + part;
        let percent = (part / whole) * 100;
        let rounded = Math.round(percent * 10) / 10;
        currentAnswer = rounded.toString();
        currentQuestionText = `${part} is what % of ${whole}? (round to 1 decimal)`;
    }
    questionEl.innerText = `⛰️ ${currentQuestionText}`;
}

// 🐉 DRAGON BOSS - Standard 6 mixed problems
function generateDragonQuestion() {
    const topics = ['fractionOp', 'decimalOp', 'percentReal', 'ratio', 'area', 'average'];
    const topic = topics[Math.floor(Math.random() * topics.length)];
    
    if (topic === 'fractionOp') {
        let num1 = Math.floor(Math.random() * 8) + 2;
        let den1 = Math.floor(Math.random() * 7) + 2;
        let num2 = Math.floor(Math.random() * 6) + 1;
        let den2 = Math.floor(Math.random() * 7) + 2;
        let result = (num1/den1) + (num2/den2);
        let rounded = Math.round(result * 100) / 100;
        currentAnswer = rounded.toString();
        currentQuestionText = `${num1}/${den1} + ${num2}/${den2} = ? (decimal to 2dp)`;
    }
    else if (topic === 'decimalOp') {
        let d1 = (Math.random() * 50 + 10).toFixed(2);
        let d2 = (Math.random() * 20 + 1).toFixed(2);
        let result = parseFloat(d1) * parseFloat(d2);
        let rounded = Math.round(result * 100) / 100;
        currentAnswer = rounded.toString();
        currentQuestionText = `${d1} × ${d2} = ? (2 decimal places)`;
    }
    else if (topic === 'percentReal') {
        let price = [50, 80, 120, 200, 350][Math.floor(Math.random() * 5)];
        let discount = [10, 15, 20, 25][Math.floor(Math.random() * 4)];
        let finalPrice = price * (1 - discount/100);
        currentAnswer = finalPrice.toFixed(2);
        currentQuestionText = `💰 Item: $${price}, ${discount}% off. Final price?`;
    }
    else if (topic === 'ratio') {
        let ratioA = Math.floor(Math.random() * 5) + 2;
        let ratioB = Math.floor(Math.random() * 5) + 2;
        let totalParts = ratioA + ratioB;
        let totalAmount = (Math.floor(Math.random() * 80) + 40);
        let shareA = (totalAmount * ratioA) / totalParts;
        currentAnswer = Math.round(shareA).toString();
        currentQuestionText = `Ratio ${ratioA}:${ratioB}, total $${totalAmount}. Find larger share?`;
    }
    else if (topic === 'area') {
        let length = Math.floor(Math.random() * 15) + 5;
        let width = Math.floor(Math.random() * 12) + 4;
        let area = length * width;
        currentAnswer = area.toString();
        currentQuestionText = `Rectangle: ${length}m × ${width}m. Area?`;
    }
    else {
        let nums = [12, 15, 18, 22, 25, 30, 35];
        let a = nums[Math.floor(Math.random() * nums.length)];
        let b = nums[Math.floor(Math.random() * nums.length)];
        let c = nums[Math.floor(Math.random() * nums.length)];
        let avg = Math.round((a + b + c) / 3);
        currentAnswer = avg.toString();
        currentQuestionText = `Mean of ${a}, ${b}, ${c} = ?`;
    }
    questionEl.innerText = `🐉 DRAGON: ${currentQuestionText}`;
}

// Main question dispatcher
function generateNewQuestion() {
    if (currentLevel === 1) generateFractionQuestion();
    else if (currentLevel === 2) generateDecimalQuestion();
    else if (currentLevel === 3) generatePercentageQuestion();
    else generateDragonQuestion();
    
    answerInput.value = "";
    answerInput.focus();
}

// Normalize answer for comparison (handle fractions, decimals, symbols)
function normalizeAnswer(userInput, correctAnswer) {
    let user = userInput.trim().toLowerCase();
    let correct = correctAnswer.toString().toLowerCase();
    
    // handle fraction comparison
    if (correct.includes('/')) {
        let [num, den] = correct.split('/');
        let userNum = parseFloat(user);
        let correctNum = parseFloat(num) / parseFloat(den);
        if (!isNaN(userNum) && Math.abs(userNum - correctNum) < 0.01) return true;
        return user === correct;
    }
    // handle > < = symbols
    if (correct === '>' || correct === '<' || correct === '=') {
        return user === correct;
    }
    // handle numbers
    let userNum = parseFloat(user);
    let correctNum = parseFloat(correct);
    if (!isNaN(userNum) && !isNaN(correctNum)) {
        return Math.abs(userNum - correctNum) < 0.01;
    }
    return user === correct;
}

// ========== VISUAL EFFECTS ==========
function launchFireball() {
    const arena = document.querySelector('.arena');
    if (!arena) return;
    const wizardRect = playerEl.getBoundingClientRect();
    const arenaRect = arena.getBoundingClientRect();
    const monsterRect = monsterEl.getBoundingClientRect();
    let startX = (wizardRect.left + wizardRect.width/2) - arenaRect.left;
    let endX = (monsterRect.left + monsterRect.width/2) - arenaRect.left;
    let startY = (wizardRect.top + wizardRect.height/2) - arenaRect.top;
    
    const fireball = document.createElement('div');
    fireball.className = 'fireball';
    fireball.textContent = '🔥';
    fireball.style.position = 'absolute';
    fireball.style.left = startX - 30 + 'px';
    fireball.style.top = startY - 30 + 'px';
    fireball.style.fontSize = '52px';
    arena.appendChild(fireball);
    
    const styleSheet = document.createElement('style');
    const animName = `customFireball_${Date.now()}`;
    styleSheet.textContent = `
        @keyframes ${animName} {
            0% { left: ${startX - 30}px; opacity: 1; transform: scale(0.5) rotate(0deg); }
            40% { transform: scale(1.3) rotate(25deg); }
            85% { left: ${endX - 30}px; opacity: 1; transform: scale(1.2) rotate(50deg); }
            100% { left: ${endX - 30}px; opacity: 0; transform: scale(1.6) rotate(70deg); }
        }
    `;
    document.head.appendChild(styleSheet);
    fireball.style.animation = `${animName} 0.45s cubic-bezier(0.25, 1, 0.5, 1) forwards`;
    setTimeout(() => { if(fireball.remove) fireball.remove(); styleSheet.remove(); }, 500);
}

function impactExplosion() {
    const arena = document.querySelector('.arena');
    const monsterRect = monsterEl.getBoundingClientRect();
    const arenaRect = arena.getBoundingClientRect();
    const impactX = (monsterRect.left + monsterRect.width/2) - arenaRect.left;
    const impactY = (monsterRect.top + monsterRect.height/2) - arenaRect.top;
    const burst = document.createElement('div');
    burst.className = 'impact-burst';
    burst.textContent = '💥';
    burst.style.position = 'absolute';
    burst.style.left = impactX - 30 + 'px';
    burst.style.top = impactY - 30 + 'px';
    burst.style.fontSize = '60px';
    arena.appendChild(burst);
    setTimeout(() => burst.remove(), 300);
}

function animateMonsterHit() {
    monsterEl.classList.add('hitShake');
    setTimeout(() => monsterEl.classList.remove('hitShake'), 400);
    monsterEl.style.filter = 'drop-shadow(0 0 8px red) brightness(1.5)';
    setTimeout(() => monsterEl.style.filter = '', 150);
}

function animateWizardHurt() {
    playerEl.classList.add('playerHitShake');
    setTimeout(() => playerEl.classList.remove('playerHitShake'), 400);
    playerEl.style.filter = 'drop-shadow(0 0 6px #ff5555) brightness(1.3)';
    setTimeout(() => playerEl.style.filter = '', 200);
}

function wizardCastGlow() {
    playerEl.classList.add('castGlow');
    setTimeout(() => playerEl.classList.remove('castGlow'), 300);
}

// ========== COMBAT ==========
function attack() {
    console.log("Attack called!"); // Debug log
    if (!canAttack) {
        msgDiv.innerText = "🌀 Wait for the spell to finish...";
        return;
    }
    let rawAnswer = answerInput.value.trim();
    if (rawAnswer === "") {
        msgDiv.innerText = "❓ Enter your answer, mage!";
        return;
    }
    
    canAttack = false;
    let isCorrect = normalizeAnswer(rawAnswer, currentAnswer);
    
    if (isCorrect) {
        wizardCastGlow();
        launchFireball();
        setTimeout(() => {
            let damage = (currentLevel === 4) ? 22 : (currentLevel === 3 ? 19 : (currentLevel === 2 ? 17 : 15));
            monsterHP = Math.max(0, monsterHP - damage);
            updateUI();
            animateMonsterHit();
            impactExplosion();
            msgDiv.innerText = `🔥🔥 SPELL HITS! -${damage} DAMAGE 🔥🔥`;
            
            if (monsterHP <= 0) {
                finishBattle(true);
                return;
            }
            generateNewQuestion();
            canAttack = true;
        }, 320);
    } else {
        msgDiv.innerText = `💢 SPELL FAILED! MONSTER ATTACKS! 💢`;
        animateWizardHurt();
        let enemyDamage = (currentLevel === 4) ? 15 : (currentLevel === 3 ? 12 : 10);
        playerHP = Math.max(0, playerHP - enemyDamage);
        updateUI();
        monsterEl.style.transform = 'scale(1.1)';
        setTimeout(() => monsterEl.style.transform = '', 200);
        
        if (playerHP <= 0) {
            finishBattle(false);
            return;
        }
        generateNewQuestion();
        canAttack = true;
    }
}

function finishBattle(isWin) {
    if (isWin) {
        msgDiv.innerText = "🏆 VICTORY! THE MAGE PREVAILS! 🏆";
        const arena = document.querySelector('.arena');
        for(let i = 0; i < 8; i++) {
            let spark = document.createElement('div');
            spark.textContent = '✨';
            spark.style.position = 'absolute';
            spark.style.left = Math.random() * 80 + 10 + '%';
            spark.style.top = Math.random() * 70 + 10 + '%';
            spark.style.fontSize = '28px';
            spark.style.pointerEvents = 'none';
            spark.style.animation = 'impactPop 0.6s ease-out forwards';
            arena.appendChild(spark);
            setTimeout(() => spark.remove(), 700);
        }
        setTimeout(() => resetToMenu(), 2400);
    } else {
        msgDiv.innerText = "💀 GAME OVER... THE MONSTER WINS 💀";
        playerEl.style.filter = 'grayscale(0.8)';
        setTimeout(() => resetToMenu(), 2400);
    }
    canAttack = false;
}

function resetToMenu() {
    playerHP = 100;
    monsterHP = 100;
    currentLevel = 1;
    canAttack = true;
    fightDiv.classList.add("hidden");
    welcomeDiv.classList.remove("hidden");
    playerEl.style.filter = '';
    monsterEl.style.filter = '';
    updateUI();
}

function startGame(level) {
    currentLevel = level;
    playerHP = 100;
    monsterHP = 100;
    canAttack = true;
    
    arenaBg.setAttribute('data-level', level);
    
    if (level === 1) {
        monsterEl.textContent = '🌳👹';
        bossNameSpan.innerHTML = '🌳 FOREST GUARDIAN';
        monsterHP = 100;
    } else if (level === 2) {
        monsterEl.textContent = '🏜️🐲';
        bossNameSpan.innerHTML = '🏜️ DECIMAL WYRM';
        monsterHP = 100;
    } else if (level === 3) {
        monsterEl.textContent = '⛰️👺';
        bossNameSpan.innerHTML = '⛰️ PERCENT TROLL';
        monsterHP = 100;
    } else {
        monsterEl.textContent = '🐉🔥';
        bossNameSpan.innerHTML = '🐉 DRAGON BOSS 🐉';
        monsterHP = 130;
    }
    
    // Reset HP display for boss
    if (level === 4) {
        mHPspan.innerText = '130';
        mBarDiv.style.width = '130%';
    } else {
        mHPspan.innerText = '100';
        mBarDiv.style.width = '100%';
    }
    
    updateUI();
    generateNewQuestion();
    
    levelsDiv.classList.add("hidden");
    fightDiv.classList.remove("hidden");
    msgDiv.innerText = "⚔️ CAST YOUR SPELL! ANSWER CORRECTLY TO ATTACK! ⚔️";
    answerInput.value = "";
    answerInput.focus();
}

function showLevels() {
    welcomeDiv.classList.add("hidden");
    levelsDiv.classList.remove("hidden");
}

// Make attack function globally available
window.attack = attack;
window.showLevels = showLevels;
window.startGame = startGame;

// Fix Enter key event listener - use keydown instead of keypress for better compatibility
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !fightDiv.classList.contains('hidden') && canAttack) {
        e.preventDefault(); // Prevent any form submission
        attack();
    }
});

// Also add direct event listener to input field
if (answerInput) {
    answerInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !fightDiv.classList.contains('hidden') && canAttack) {
            e.preventDefault();
            attack();
        }
    });
}

// Add this function to go back to welcome page
function showWelcome() {
    fightDiv.classList.add("hidden");
    levelsDiv.classList.add("hidden");
    welcomeDiv.classList.remove("hidden");
    playerHP = 100;
    monsterHP = 100;
    canAttack = true;
    updateUI();
}

// Add this function to confirm before leaving fight
function confirmBackToMenu() {
    if (confirm("Return to main menu? Your progress will be lost.")) {
        showWelcome();
    }
}

// Update the resetToMenu function to use showWelcome
function resetToMenu() {
    playerHP = 100;
    monsterHP = 100;
    currentLevel = 1;
    canAttack = true;
    showWelcome();
    playerEl.style.filter = '';
    monsterEl.style.filter = '';
    updateUI();
}

// Make sure showWelcome and confirmBackToMenu are globally available
window.showWelcome = showWelcome;
window.confirmBackToMenu = confirmBackToMenu;

updateUI();
console.log("Game loaded - Enter key should work!");