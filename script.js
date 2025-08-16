// حالة اللعبة
let gameState = {
    stars: 0,
    level: 1,
    currentBuilding: null,
    currentChallenge: 0,
    challengeScore: 0,
    unlockedBuildings: ['letters'],
    challenges: {
        letters: [
            {
                question: "اختر الحروف من بين الكلمات التالية:",
                options: ["في", "كتاب", "على", "قلم", "من", "بيت"],
                correct: ["في", "على", "من"],
                type: "multiple"
            },
            {
                question: "أي من هذه حروف الجر؟",
                options: ["إلى", "يكتب", "طالب", "تحت"],
                correct: ["إلى", "تحت"],
                type: "multiple"
            },
            {
                question: "اختر حرف العطف:",
                options: ["و", "كتب", "طاولة", "ف"],
                correct: ["و", "ف"],
                type: "multiple"
            }
        ],
        nouns: [
            {
                question: "اختر الأسماء من بين الكلمات التالية:",
                options: ["كتاب", "يكتب", "قلم", "يقرأ", "طالب", "يلعب"],
                correct: ["كتاب", "قلم", "طالب"],
                type: "multiple"
            },
            {
                question: "أي من هذه أسماء الحيوانات؟",
                options: ["قط", "شجرة", "كلب", "سيارة", "عصفور", "كتاب"],
                correct: ["قط", "كلب", "عصفور"],
                type: "multiple"
            },
            {
                question: "اختر الأسماء المؤنثة:",
                options: ["فاطمة", "أحمد", "مدرسة", "كتاب", "سيارة", "قلم"],
                correct: ["فاطمة", "مدرسة", "سيارة"],
                type: "multiple"
            }
        ],
        verbs: [
            {
                question: "اختر الأفعال من بين الكلمات التالية:",
                options: ["يكتب", "كتاب", "يقرأ", "قلم", "يلعب", "طالب"],
                correct: ["يكتب", "يقرأ", "يلعب"],
                type: "multiple"
            },
            {
                question: "أي من هذه أفعال ماضية؟",
                options: ["كتب", "يكتب", "قرأ", "يقرأ", "لعب", "يلعب"],
                correct: ["كتب", "قرأ", "لعب"],
                type: "multiple"
            },
            {
                question: "اختر الأفعال المضارعة:",
                options: ["يدرس", "درس", "يأكل", "أكل", "يجري", "جرى"],
                correct: ["يدرس", "يأكل", "يجري"],
                type: "multiple"
            }
        ],
        sentences: [
            {
                question: "اختر الجملة الاسمية:",
                options: ["الطالب مجتهد", "يكتب الطالب", "الكتاب مفيد", "يقرأ أحمد"],
                correct: ["الطالب مجتهد", "الكتاب مفيد"],
                type: "multiple"
            },
            {
                question: "اختر الجملة الفعلية:",
                options: ["يلعب الطفل", "الطفل نشيط", "تطير الطائرة", "الطائرة سريعة"],
                correct: ["يلعب الطفل", "تطير الطائرة"],
                type: "multiple"
            }
        ]
    }
};

// عناصر DOM
const screens = {
    start: document.getElementById('start-screen'),
    game: document.getElementById('game-screen'),
    challenge: document.getElementById('challenge-screen'),
    success: document.getElementById('success-screen')
};

const elements = {
    startBtn: document.getElementById('start-btn'),
    backBtn: document.getElementById('back-btn'),
    starCount: document.getElementById('star-count'),
    level: document.getElementById('level'),
    guideText: document.getElementById('guide-text'),
    challengeTitle: document.getElementById('challenge-title'),
    challengeArea: document.getElementById('challenge-area'),
    challengeScore: document.getElementById('challenge-score'),
    checkAnswer: document.getElementById('check-answer'),
    nextChallenge: document.getElementById('next-challenge'),
    feedbackArea: document.getElementById('feedback-area'),
    feedbackMessage: document.getElementById('feedback-message'),
    successMessage: document.getElementById('success-message'),
    earnedStars: document.getElementById('earned-stars'),
    continueBtn: document.getElementById('continue-btn')
};

// الرسائل التوجيهية
const guideMessages = {
    letters: "ممتاز! تعلمت الحروف. الآن يمكنك دخول حي الأسماء!",
    nouns: "رائع! أتقنت الأسماء. ساحة الأفعال في انتظارك!",
    verbs: "عظيم! تعلمت الأفعال. حديقة الجمل مفتوحة الآن!",
    sentences: "مبروك! أصبحت خبيراً في قواعد اللغة العربية!",
    default: "اختر أحد المباني لتبدأ التعلم!"
};

// بدء اللعبة
function initGame() {
    showScreen('start');
    updateUI();
    
    // إضافة مستمعي الأحداث
    elements.startBtn.addEventListener('click', () => showScreen('game'));
    elements.backBtn.addEventListener('click', () => showScreen('game'));
    elements.checkAnswer.addEventListener('click', checkAnswer);
    elements.nextChallenge.addEventListener('click', nextChallenge);
    elements.continueBtn.addEventListener('click', () => showScreen('game'));
    
    // إضافة مستمعي أحداث المباني
    document.querySelectorAll('.building').forEach(building => {
        building.addEventListener('click', () => {
            const buildingType = building.dataset.building;
            if (gameState.unlockedBuildings.includes(buildingType)) {
                startChallenge(buildingType);
            }
        });
    });
}

// عرض شاشة معينة
function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenName].classList.add('active');
}

// تحديث واجهة المستخدم
function updateUI() {
    elements.starCount.textContent = gameState.stars;
    elements.level.textContent = gameState.level;
    
    // تحديث حالة المباني
    document.querySelectorAll('.building').forEach(building => {
        const buildingType = building.dataset.building;
        const statusElement = building.querySelector('.building-status');
        
        if (gameState.unlockedBuildings.includes(buildingType)) {
            building.classList.remove('locked');
            statusElement.textContent = 'متاح';
            statusElement.className = 'building-status unlocked';
        } else {
            building.classList.add('locked');
            statusElement.textContent = 'مغلق';
            statusElement.className = 'building-status locked';
        }
    });
    
    // تحديث رسالة المرشد
    const lastUnlocked = gameState.unlockedBuildings[gameState.unlockedBuildings.length - 1];
    elements.guideText.textContent = guideMessages[lastUnlocked] || guideMessages.default;
}

// بدء تحدي
function startChallenge(buildingType) {
    gameState.currentBuilding = buildingType;
    gameState.currentChallenge = 0;
    gameState.challengeScore = 0;
    
    const buildingNames = {
        letters: 'تحدي الحروف',
        nouns: 'تحدي الأسماء',
        verbs: 'تحدي الأفعال',
        sentences: 'تحدي الجمل'
    };
    
    elements.challengeTitle.textContent = buildingNames[buildingType];
    elements.challengeScore.textContent = `النقاط: ${gameState.challengeScore}`;
    
    showScreen('challenge');
    loadChallenge();
}

// تحميل تحدي
function loadChallenge() {
    const challenges = gameState.challenges[gameState.currentBuilding];
    const challenge = challenges[gameState.currentChallenge];
    
    if (!challenge) {
        completeBuilding();
        return;
    }
    
    elements.challengeArea.innerHTML = `
        <div class="challenge-question">${challenge.question}</div>
        <div class="word-options">
            ${challenge.options.map(option => 
                `<div class="word-option" data-word="${option}">${option}</div>`
            ).join('')}
        </div>
    `;
    
    // إضافة مستمعي أحداث للخيارات
    document.querySelectorAll('.word-option').forEach(option => {
        option.addEventListener('click', () => {
            option.classList.toggle('selected');
        });
    });
    
    elements.checkAnswer.style.display = 'inline-block';
    elements.nextChallenge.style.display = 'none';
    elements.feedbackMessage.textContent = '';
    elements.feedbackMessage.className = '';
}

// فحص الإجابة
function checkAnswer() {
    const challenges = gameState.challenges[gameState.currentBuilding];
    const challenge = challenges[gameState.currentChallenge];
    const selectedOptions = Array.from(document.querySelectorAll('.word-option.selected'))
        .map(option => option.dataset.word);
    
    const correctAnswers = challenge.correct;
    const isCorrect = selectedOptions.length === correctAnswers.length && 
        selectedOptions.every(answer => correctAnswers.includes(answer)) &&
        correctAnswers.every(answer => selectedOptions.includes(answer));
    
    // تلوين الإجابات
    document.querySelectorAll('.word-option').forEach(option => {
        const word = option.dataset.word;
        if (correctAnswers.includes(word)) {
            option.classList.add('correct');
        } else if (option.classList.contains('selected')) {
            option.classList.add('incorrect');
        }
        option.style.pointerEvents = 'none';
    });
    
    if (isCorrect) {
        gameState.challengeScore += 10;
        elements.feedbackMessage.textContent = '🎉 إجابة صحيحة! أحسنت!';
        elements.feedbackMessage.className = 'feedback-correct';
    } else {
        elements.feedbackMessage.textContent = '❌ إجابة خاطئة. حاول مرة أخرى!';
        elements.feedbackMessage.className = 'feedback-incorrect';
    }
    
    elements.challengeScore.textContent = `النقاط: ${gameState.challengeScore}`;
    elements.checkAnswer.style.display = 'none';
    elements.nextChallenge.style.display = 'inline-block';
}

// التحدي التالي
function nextChallenge() {
    gameState.currentChallenge++;
    loadChallenge();
}

// إكمال مبنى
function completeBuilding() {
    const earnedStars = Math.max(5, gameState.challengeScore);
    gameState.stars += earnedStars;
    
    // فتح المبنى التالي
    const buildingOrder = ['letters', 'nouns', 'verbs', 'sentences'];
    const currentIndex = buildingOrder.indexOf(gameState.currentBuilding);
    if (currentIndex < buildingOrder.length - 1) {
        const nextBuilding = buildingOrder[currentIndex + 1];
        if (!gameState.unlockedBuildings.includes(nextBuilding)) {
            gameState.unlockedBuildings.push(nextBuilding);
        }
    }
    
    // رفع المستوى
    if (gameState.stars >= gameState.level * 20) {
        gameState.level++;
    }
    
    elements.earnedStars.textContent = earnedStars;
    elements.successMessage.textContent = `لقد أكملت ${getBuildingName(gameState.currentBuilding)} بنجاح!`;
    
    showScreen('success');
    updateUI();
}

// الحصول على اسم المبنى
function getBuildingName(buildingType) {
    const names = {
        letters: 'بيت الحروف',
        nouns: 'حي الأسماء',
        verbs: 'ساحة الأفعال',
        sentences: 'حديقة الجمل'
    };
    return names[buildingType];
}

// بدء اللعبة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initGame);

