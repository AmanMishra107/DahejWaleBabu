// Preloader functionality with money rain animation
document.addEventListener('DOMContentLoaded', function() {
  // Create money rain elements
  const moneyRainContainer = document.querySelector('.money-rain-container');
  const moneyCount = 30;
  
  for (let i = 0; i < moneyCount; i++) {
    createMoneyElement(moneyRainContainer);
  }
  
  // Simulate loading progress
  const loaderBar = document.querySelector('.loader-bar');
  const loaderPercentage = document.querySelector('.loader-percentage');
  const preloader = document.querySelector('.preloader');
  
  let progress = 0;
  // Increased increment value to make loading faster (approximately 4 seconds)
  const interval = setInterval(() => {
    progress += Math.random() * 8;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      
      // Hide preloader after a short delay
      setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 500);
      }, 500);
    }
    
    loaderBar.style.width = `${progress}%`;
    loaderPercentage.textContent = `${Math.round(progress)}%`;
  }, 100);
});

// Function to create money elements
function createMoneyElement(container) {
  const money = document.createElement('div');
  money.classList.add('money');
  
  // Random position, size, and animation duration
  const size = Math.random() * 30 + 20;
  const left = Math.random() * 100;
  const duration = Math.random() * 5 + 3;
  const delay = Math.random() * 5;
  
  money.style.width = `${size}px`;
  money.style.height = `${size / 2}px`;
  money.style.left = `${left}%`;
  money.style.animationDuration = `${duration}s`;
  money.style.animationDelay = `${delay}s`;
  
  // Apply coin styling to every 5th element
  if (container.children.length % 5 === 0) {
    money.style.width = `${size}px`;
    money.style.height = `${size}px`;
    money.style.animationDuration = `${duration}s, ${duration * 0.5}s`;
  }
  
  container.appendChild(money);
}


// DOM Elements
const dowryForm = document.getElementById('dowryForm');
const jobTypeSelect = document.getElementById('jobType');
const salaryGroup = document.getElementById('salaryGroup');
const resultsModal = document.getElementById('resultsModal');
const closeButton = document.querySelector('.close-button');

const resultMessage = document.getElementById('resultMessage');
const breakdownList = document.getElementById('breakdownList');
const generatedList = document.getElementById('generatedList');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Add fancy animations on load with staggered timing
    document.querySelectorAll('section').forEach((section, index) => {
        section.classList.add('fade-in-element');
        
        setTimeout(() => {
            section.classList.add('visible');
        }, 300 * index);
    });
    
    // Show salary field only for relevant job types
    if(jobTypeSelect) {
        jobTypeSelect.addEventListener('change', function() {
            if (this.value === 'private' || this.value === 'government' || this.value === 'business') {
                salaryGroup.style.display = 'block';
            } else {
                salaryGroup.style.display = 'none';
            }
        });
    }
    
    // Form submission
    if(dowryForm) {
        dowryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateDowry();
        });
    }
    
    // Close the modal when clicking the close button
    if(closeButton) {
        closeButton.addEventListener('click', function() {
            resultsModal.style.display = 'none';
        });
    }
    
    // Close the modal when clicking outside of it
    window.addEventListener('click', function(e) {
        if (resultsModal && e.target === resultsModal) {
            resultsModal.style.display = 'none';
        }
    });
    
    // Add some interactivity to the nav links
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('mouseover', function() {
            this.style.color = getComputedStyle(document.documentElement).getPropertyValue('--primary');
        });
        
        link.addEventListener('mouseout', function() {
            this.style.color = getComputedStyle(document.documentElement).getPropertyValue('--dark');
        });
    });
    
    // Initialize tabs for leaderboard
    initTabs();
    
    // Initialize leaderboard data
    initLeaderboard();
    

    
    // Initialize quiz
    initQuiz();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize calculator if exists
    if(jobTypeSelect) {
        jobTypeSelect.dispatchEvent(new Event('change'));
    }
});

// Scroll to calculator function for CTA button with smooth scroll
function scrollToCalculator() {
    const calculator = document.getElementById('calculator');
    calculator.scrollIntoView({ behavior: 'smooth' });
}

// Dowry Calculation Function
function calculateDowry() {
    // Get form values
    const formData = new FormData(dowryForm);
    const userData = {
        name: formData.get('name') || 'Anonymous',
        age: parseInt(formData.get('age')),
        gender: formData.get('gender'),
        education: formData.get('education'),
        jobType: formData.get('jobType'),
        salary: parseInt(formData.get('salary')) || 0,
        height: parseInt(formData.get('height')),
        skinTone: formData.get('skinTone'),
        fitness: formData.get('fitness'),
        parentsJob: formData.get('parentsJob'),
        house: formData.get('house'),
        cars: parseInt(formData.get('cars')),
        siblings: parseInt(formData.get('siblings')),
        location: formData.get('location'),
        foreign: formData.get('foreign') === 'on',
        talent: formData.get('talent') === 'on',
        smoke: formData.get('smoke') === 'on',
        drink: formData.get('drink') === 'on'
    };
    
    // Calculate base amount
    let baseAmount = 100000; // Starting with 1 lakh rupees as base
    let breakdown = [];
    
    // Education factors
    const educationValues = {
        'none': -50000,
        'school': 0,
        'graduate': 200000,
        'postgraduate': 500000,
        'phd': 1000000
    };
    
    if (userData.education in educationValues) {
        baseAmount += educationValues[userData.education];
        breakdown.push({
            factor: 'Education',
            amount: educationValues[userData.education],
            note: `${userData.education.charAt(0).toUpperCase() + userData.education.slice(1)} education`
        });
    }
    
    // Job & Salary factors
    let jobFactor = 0;
    if (userData.jobType === 'unemployed') {
        jobFactor = -100000;
    } else if (userData.jobType === 'private') {
        jobFactor = Math.min(userData.salary * 1.5, 1000000);
    } else if (userData.jobType === 'government') {
        jobFactor = Math.min(userData.salary * 2, 2000000);
    } else if (userData.jobType === 'business') {
        jobFactor = Math.min(userData.salary * 2.5, 3000000);
    }
    
    baseAmount += jobFactor;
    breakdown.push({
        factor: 'Job & Income',
        amount: jobFactor,
        note: userData.jobType === 'unemployed' 
            ? 'Unemployed' 
            : `${userData.jobType.charAt(0).toUpperCase() + userData.jobType.slice(1)} job with salary`
    });
    
    // Physical attributes
    const heightFactor = Math.max(0, (userData.height - 150) * 1000);
    baseAmount += heightFactor;
    breakdown.push({
        factor: 'Height',
        amount: heightFactor,
        note: `${userData.height} cm tall`
    });
    
    const skinToneValues = {
        'veryFair': 200000,
        'fair': 100000,
        'medium': 0,
        'dark': -50000
    };
    
    if (userData.skinTone in skinToneValues) {
        baseAmount += skinToneValues[userData.skinTone];
        breakdown.push({
            factor: 'Skin Tone',
            amount: skinToneValues[userData.skinTone],
            note: `${userData.skinTone.charAt(0).toUpperCase() + userData.skinTone.slice(1)} skin tone`
        });
    }
    
    const fitnessValues = {
        'athletic': 200000,
        'fit': 100000,
        'average': 0,
        'unfit': -50000
    };
    
    if (userData.fitness in fitnessValues) {
        baseAmount += fitnessValues[userData.fitness];
        breakdown.push({
            factor: 'Fitness',
            amount: fitnessValues[userData.fitness],
            note: `${userData.fitness.charAt(0).toUpperCase() + userData.fitness.slice(1)} fitness level`
        });
    }
    
    // Family background
    const parentsJobValues = {
        'business': 300000,
        'government': 200000,
        'corporate': 150000,
        'other': 0
    };
    
    if (userData.parentsJob in parentsJobValues) {
        baseAmount += parentsJobValues[userData.parentsJob];
        breakdown.push({
            factor: 'Parents\' Profession',
            amount: parentsJobValues[userData.parentsJob],
            note: `${userData.parentsJob.charAt(0).toUpperCase() + userData.parentsJob.slice(1)} background`
        });
    }
    
    const houseFactor = userData.house === 'owned' ? 300000 : 0;
    baseAmount += houseFactor;
    breakdown.push({
        factor: 'Housing',
        amount: houseFactor,
        note: userData.house === 'owned' ? 'Owns a house' : 'Rented accommodation'
    });
    
    const carFactor = userData.cars * 200000;
    baseAmount += carFactor;
    breakdown.push({
        factor: 'Cars Owned',
        amount: carFactor,
        note: `${userData.cars} car(s)`
    });
    
    // More siblings can mean more dowry expectations in some contexts
    const siblingFactor = -50000 * userData.siblings;
    baseAmount += siblingFactor;
    breakdown.push({
        factor: 'Siblings',
        amount: siblingFactor,
        note: `${userData.siblings} sibling(s)`
    });
    
    // Location preference
    const locationValues = {
        'rural': 0,
        'urban': 150000,
        'metro': 300000
    };
    
    if (userData.location in locationValues) {
        baseAmount += locationValues[userData.location];
        breakdown.push({
            factor: 'Location',
            amount: locationValues[userData.location],
            note: `${userData.location.charAt(0).toUpperCase() + userData.location.slice(1)} living preference`
        });
    }
    
    // Extra perks
    if (userData.foreign) {
        baseAmount += 1000000;
        breakdown.push({
            factor: 'Foreign Citizenship',
            amount: 1000000,
            note: 'NRI/Foreign citizenship status'
        });
    }
    
    if (userData.talent) {
        baseAmount += 100000;
        breakdown.push({
            factor: 'Special Talents',
            amount: 100000,
            note: 'Has special talents'
        });
    }
    
    // Bad habits reduce the amount
    if (userData.smoke) {
        baseAmount -= 200000;
        breakdown.push({
            factor: 'Smoking Habit',
            amount: -200000,
            note: 'Smokes regularly'
        });
    }
    
    if (userData.drink) {
        baseAmount -= 150000;
        breakdown.push({
            factor: 'Drinking Habit',
            amount: -150000,
            note: 'Drinks alcohol'
        });
    }
    
    // Gender adjustment (just for the satirical purpose of the app)
    if (userData.gender === 'female') {
        baseAmount = Math.min(baseAmount * 0.2, 200000); // Traditionally, women's families pay dowry
        breakdown.push({
            factor: 'Gender Adjustment',
            amount: 'Recalculated',
            note: 'Traditional dowry expectations are from bride\'s family'
        });
    }
    
    // Ensure minimum amount is not negative
    baseAmount = Math.max(baseAmount, 0);
    
    // Format the amount with commas
    const formattedAmount = baseAmount.toLocaleString('en-IN');
    
    // Display results
    dowryAmount.textContent = formattedAmount;
    
    // Generate a custom message based on the amount - Gen Z style
    let message = '';
    if (baseAmount === 0) {
        message = "Congrats bestie! You're giving $0 vibes. We stan a dowry-free queen/king! 💅";
    } else if (baseAmount < 500000) {
        message = "Not me calculating your low-key dowry price! It's giving budget-friendly energy! ✨";
    } else if (baseAmount < 1000000) {
        message = "Mid tier dowry, not gonna lie. Very much giving average vibes! 🤷‍♀️";
    } else if (baseAmount < 3000000) {
        message = "OK this is srsly a vibe! Premium tier unlocked! Your in-laws are gonna be shook! 🔥";
    } else {
        message = "No cap frfr, this is extra AF! Elite tier unlocked! Bougie in-laws will be living for this! 💸";
    }
    
    resultMessage.textContent = message;
    
    // Display breakdown with animations
    breakdownList.innerHTML = '';
    
    breakdown.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${item.factor}: ${item.note}</span>
            <span>₹${typeof item.amount === 'number' ? item.amount.toLocaleString('en-IN') : item.amount}</span>
        `;
        li.style.opacity = '0';
        li.style.transform = 'translateY(10px)';
        breakdownList.appendChild(li);
        
        setTimeout(() => {
            li.style.transition = 'all 0.3s ease';
            li.style.opacity = '1';
            li.style.transform = 'translateY(0)';
        }, 100 * index);
    });
    
    // Display the modal with animation
    resultsModal.style.display = 'flex';
    resultsModal.style.opacity = '0';
    setTimeout(() => {
        resultsModal.style.transition = 'opacity 0.3s ease';
        resultsModal.style.opacity = '1';
    }, 10);
    
    // Save to leaderboard if name is provided
    if (userData.name !== 'Anonymous') {
        saveToLeaderboard(userData.name, baseAmount, userData.gender);
    }
}

// Share results function with updated message
function shareResult(platform) {
    const amount = dowryAmount.textContent;
    const message = `OMG! The Dahej Wale Babu says I'm worth ₹${amount}! 🤑 Check your value too: https://dahej-wale-babu.vercel.app #dahejwalebabu`;
    
    let shareUrl = '';
    
    switch (platform) {
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
            break;
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(message)}`;
            break;
       
    }
    
    window.open(shareUrl, '_blank');
}

// Init Tab System
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Hide all tab content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Show the selected tab content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Leaderboard System
let leaderboardData = {
    topGrooms: [
        { name: 'Aryan S.', value: 7500000, badge: 'Gold-Plated Groom' },
        { name: 'Kabir R.', value: 6200000, badge: 'Diamond Tier' },
        { name: 'Virat M.', value: 5800000, badge: 'Platinum Status' },
        { name: 'Dev J.', value: 4900000, badge: 'Premium Package' },
        { name: 'Rohan A.', value: 3800000, badge: 'Luxury Class' }
    ],
    budgetBrides: [
        { name: 'Priya K.', value: 180000, badge: 'Budget Queen' },
        { name: 'Neha T.', value: 210000, badge: 'Practical Pick' },
        { name: 'Meera S.', value: 250000, badge: 'Value Deal' },
        { name: 'Anjali P.', value: 290000, badge: 'Affordable Gem' },
        { name: 'Sanya R.', value: 320000, badge: 'Sensible Choice' }
    ],
    dowryFree: [
        { name: 'Zoya M.', reason: 'Equality advocate', badge: 'Freedom Fighter' },
        { name: 'Raghav S.', reason: 'Values over valuables', badge: 'Progress Champion' },
        { name: 'Aisha K.', reason: 'Breaking traditions', badge: 'Dowry Disruptor' },
        { name: 'Karan B.', reason: 'Modern mindset', badge: 'Change Maker' },
        { name: 'Tanya P.', reason: 'Family opposed practice', badge: 'Tradition Breaker' }
    ]
};

function initLeaderboard() {
    // Load leaderboard data from localStorage if available
    const savedData = localStorage.getItem('leaderboardData');
    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            // Merge with default data, keeping saved entries
            leaderboardData = {
                topGrooms: [...parsedData.topGrooms || [], ...leaderboardData.topGrooms].slice(0, 10),
                budgetBrides: [...parsedData.budgetBrides || [], ...leaderboardData.budgetBrides].slice(0, 10),
                dowryFree: [...parsedData.dowryFree || [], ...leaderboardData.dowryFree].slice(0, 10)
            };
        } catch (e) {
            console.error('Error loading leaderboard data', e);
        }
    }
    
    // Render leaderboard
    renderLeaderboard('top-grooms', leaderboardData.topGrooms);
    renderLeaderboard('budget-brides', leaderboardData.budgetBrides);
    renderLeaderboard('dowry-free', leaderboardData.dowryFree, true);
}

function renderLeaderboard(tabId, data, isDowryFree = false) {
    const listContainer = document.querySelector(`#${tabId} .leaderboard-list`);
    if (!listContainer) return;
    
    listContainer.innerHTML = '';
    
    data.forEach((item, index) => {
        const listItem = document.createElement('div');
        listItem.className = `leaderboard-item ${index < 3 ? 'top-rank' : ''}`;
        listItem.style.animationDelay = `${index * 0.1}s`;
        
        if (isDowryFree) {
            listItem.innerHTML = `
                <span class="rank">#${index + 1}</span>
                <span class="name">${item.name}</span>
                <span class="value">${item.reason}</span>
                <span class="badge">${item.badge}</span>
            `;
        } else {
            listItem.innerHTML = `
                <span class="rank">#${index + 1}</span>
                <span class="name">${item.name}</span>
                <span class="value">₹${item.value.toLocaleString('en-IN')}</span>
                <span class="badge">${item.badge}</span>
            `;
        }
        
        listContainer.appendChild(listItem);
    });
}

function saveToLeaderboard(name, value, gender) {
    if (gender === 'male' && value > 3000000) {
        // Add to top grooms if high value
        leaderboardData.topGrooms.push({
            name: name,
            value: value,
            badge: getBadgeForValue(value)
        });
        
        // Sort and keep only top 10
        leaderboardData.topGrooms.sort((a, b) => b.value - a.value);
        leaderboardData.topGrooms = leaderboardData.topGrooms.slice(0, 10);
        
        // Re-render the leaderboard
        renderLeaderboard('top-grooms', leaderboardData.topGrooms);
    } else if (gender === 'female' && value < 400000) {
        // Add to budget brides if low value
        leaderboardData.budgetBrides.push({
            name: name,
            value: value,
            badge: getBadgeForLowValue(value)
        });
        
        // Sort and keep only top 10 (ascending for budget brides)
        leaderboardData.budgetBrides.sort((a, b) => a.value - b.value);
        leaderboardData.budgetBrides = leaderboardData.budgetBrides.slice(0, 10);
        
        // Re-render the leaderboard
        renderLeaderboard('budget-brides', leaderboardData.budgetBrides);
    } else if (value === 0) {
        // Add to dowry-free warriors
        leaderboardData.dowryFree.push({
            name: name,
            reason: 'Chose zero dowry',
            badge: 'Dowry-Free Warrior'
        });
        
        // Keep only top 10
        leaderboardData.dowryFree = leaderboardData.dowryFree.slice(0, 10);
        
        // Re-render the leaderboard
        renderLeaderboard('dowry-free', leaderboardData.dowryFree, true);
    }
    
    // Save to localStorage
    localStorage.setItem('leaderboardData', JSON.stringify(leaderboardData));
}

function getBadgeForValue(value) {
    if (value > 7000000) return 'Gold-Plated Groom';
    if (value > 5000000) return 'Diamond Tier';
    if (value > 4000000) return 'Platinum Status';
    if (value > 3000000) return 'Premium Package';
    return 'Luxury Class';
}

function getBadgeForLowValue(value) {
    if (value < 100000) return 'Budget Queen';
    if (value < 200000) return 'Practical Pick';
    if (value < 300000) return 'Value Deal';
    if (value < 350000) return 'Affordable Gem';
    return 'Sensible Choice';
}


// Quiz System - Indian Dahej Edition
const quizQuestions = [
    {
        question: "Shaadi mein kya sabse important hai?",
        options: [
            "500+ guests wali destination wedding (Ambani style)",
            "Family aur close friends ke saath simple function",
            "Sirf couple pe focus karne wali intimate ceremony",
            "Court marriage aur phir dinner party"
        ],
        emoji: "💒"
    },
    {
        question: "Agar koi aapko material conditions ke saath proposal de, toh aap kya karenge?",
        options: [
            "Accept kar lenge agar conditions reasonable hain",
            "Counter offer denge apni conditions ke saath",
            "Turant reject karke walk away kar jayenge",
            "Better terms ke liye negotiate karenge"
        ],
        emoji: "💍"
    },
    {
        question: "Aapke hone wale in-laws 'shagun' ki demand kar rahe hain. Aap:",
        options: [
            "Jo maanga hai woh de denge (khush sasural = sukhi ghar)",
            "Thoda modest gift offer karenge (compromise bhi zaroori hai)",
            "Politely explain karenge ki aap aise exchanges mein believe nahi karte",
            "Unko ghost kar denge (red flag hai bhai!)"
        ],
        emoji: "🎁"
    },
    {
        question: "Life partner mein aapke liye sabse important kya hai?",
        options: [
            "Financial stability aur social status (practical sochna zaroori hai)",
            "Compatibility aur shared values (understanding matters)",
            "Intelligence aur ambition (power couple vibes)",
            "Kindness aur emotional connection (pyaar hi sab kuch hai)"
        ],
        emoji: "❤️"
    },
    {
        question: "Shaadi se pehle aapko bada inheritance mil gaya. Aap kya karenge?",
        options: [
            "Future spouse se chupayenge (mera paisa mera hai)",
            "Information share karenge but paisa separate rakhenge",
            "Couple ke future ke liye joint wealth consider karenge",
            "Saara paisa ek extravagant wedding pe uda denge"
        ],
        emoji: "💰"
    }
];

const quizResults = [
    {
        title: "Raja/Rani Material",
        description: "Aap ekdum traditional vibes de rahe hain! Aapko customs aur social standing ki kadar hai, aur 'reasonable' dahej system mein participate karne mein koi problem nahi hai. Aapke in-laws aapse bahut khush honge, lekin aapka wallet shayad utna khush na ho!",
        emoji: "👑",
        gif: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnN3aDljYTR2OHE5ZHJtaWc5Z3YwMDh2M2JnczZzeWw5dnQzdW5vdSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/fxsqOYnIMEefC/giphy.gif"
    },
    {
        title: "Middle-Class Marvel",
        description: "Aap practical bhi hain aur flexible bhi! Aap samajhte hain ki traditions ka apna place hai, lekin unhe modernize karne se bhi nahi darte. Aap dahej pe negotiate kar sakte hain lekin kabhi overboard nahi jayenge. Traditional aur progressive ka perfect balance!",
        emoji: "✨",
        gif: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmljeTQ4dWVzbGt2a2d4MW9kMGtmZTZhcXB5N2ExMGxkb3p1bDBwYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/g9582DNuQppxC/giphy.gif"
    },
    {
        title: "Dahej-Free Warrior",
        description: "Aap equality ke total champion hain! Aap dahej system ke strongly against hain aur apne values pe compromise nahi karenge. Aapka manna hai ki shaadi love aur compatibility ke baare mein honi chahiye, na ki financial transactions ke baare mein. Hum stan karte hain aise progressive icon ko!",
        emoji: "✊",
        gif: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmw4M2ZhazVtcm53YXc3bTN0Z25zYXlsamN4OHUyanByOTA4czdmNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKrK8bgvi39joNG/giphy.gif"
    },
    {
        title: "Confused Negotiator",
        description: "Aap mixed signals de rahe hain! Ek pal traditional, dusre pal progressive. Theory mein dahej ke against ho sakte hain lekin wedding expenses pe flex kar sakte hain. Aapke in-laws constantly guess karte rahenge ki aap kahan stand karte hain!",
        emoji: "🤔",
        gif: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExYWo2bGVleXNxaW15NGZ1bHN0ODg2bmM1a2pwZzVqZnJkYXR6N25wdSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/4JVTF9zR9BicshFAb7/giphy.gif"
    }
];

let currentQuestion = 0;
let quizAnswers = [];

function initQuiz() {
    const startButton = document.getElementById('startQuiz');
    if (!startButton) return;
    
    startButton.addEventListener('click', startQuiz);
    
    // Preload quiz questions with enhanced styling
    const quizQuestionsElement = document.querySelector('.quiz-questions');
    if (quizQuestionsElement) {
        quizQuestions.forEach((q, index) => {
            const questionElement = document.createElement('div');
            questionElement.className = `question ${index === 0 ? 'active' : ''}`;
            questionElement.id = `question-${index}`;
            
            let optionsHTML = '';
            q.options.forEach((option, optIndex) => {
                optionsHTML += `
                    <div class="answer-option" data-index="${optIndex}">
                        <span class="option-number">${optIndex + 1}</span>
                        <span class="option-text">${option}</span>
                    </div>
                `;
            });
            
            questionElement.innerHTML = `
                <div class="question-emoji">${q.emoji}</div>
                <div class="question-number">Question ${index + 1}/5</div>
                <h3>${q.question}</h3>
                <div class="answer-options">
                    ${optionsHTML}
                </div>
                <div class="quiz-navigation">
                    ${index > 0 ? '<button class="quiz-btn prev-btn"><i class="fas fa-arrow-left"></i> Previous</button>' : ''}
                    ${index < quizQuestions.length - 1 ? 
                        '<button class="quiz-btn next-btn" disabled>Next <i class="fas fa-arrow-right"></i></button>' : 
                        '<button class="quiz-btn finish-btn" disabled>See Results <i class="fas fa-check-circle"></i></button>'}
                </div>
            `;
            
            quizQuestionsElement.appendChild(questionElement);
        });
        
        // Add event listeners to options
        document.querySelectorAll('.answer-option').forEach(option => {
            option.addEventListener('click', selectAnswer);
        });
        
        // Add event listeners to navigation buttons
        document.querySelectorAll('.prev-btn').forEach(button => {
            button.addEventListener('click', prevQuestion);
        });
        
        document.querySelectorAll('.next-btn').forEach(button => {
            button.addEventListener('click', nextQuestion);
        });
        
        document.querySelectorAll('.finish-btn').forEach(button => {
            button.addEventListener('click', finishQuiz);
        });
    }
}

function startQuiz() {
    const startScreen = document.querySelector('.quiz-start');
    const questionsScreen = document.querySelector('.quiz-questions');
    
    // Add animation for transition
    startScreen.style.animation = 'fadeOutUp 0.5s forwards';
    
    setTimeout(() => {
        startScreen.style.display = 'none';
        questionsScreen.style.display = 'block';
        questionsScreen.style.animation = 'fadeInUp 0.5s forwards';
        
        // Reset quiz state
        currentQuestion = 0;
        quizAnswers = [];
        updateQuizProgress();
    }, 500);
}

function selectAnswer(e) {
    const selectedOption = e.currentTarget;
    const optionIndex = parseInt(selectedOption.getAttribute('data-index'));
    const questionContainer = selectedOption.closest('.question');
    
    // Remove selected class from all options in this question
    questionContainer.querySelectorAll('.answer-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selected class to clicked option with animation
    selectedOption.classList.add('selected');
    selectedOption.style.animation = 'pulse 0.5s';
    
    // Enable the next/finish button
    const nextButton = questionContainer.querySelector('.next-btn, .finish-btn');
    if (nextButton) {
        nextButton.disabled = false;
        nextButton.classList.add('btn-active');
    }
    
    // Save answer
    const questionIndex = parseInt(questionContainer.id.split('-')[1]);
    quizAnswers[questionIndex] = optionIndex;
    
    // Add funny reaction based on answer
    showAnswerReaction(questionIndex, optionIndex, questionContainer);
}

function showAnswerReaction(questionIndex, optionIndex, container) {
    // Remove any existing reaction
    const existingReaction = container.querySelector('.answer-reaction');
    if (existingReaction) {
        existingReaction.remove();
    }
    
    // Create funny reactions based on question and answer
    const reactions = [
        // Question 1 reactions
        [
            "Ambani would be proud! 💎",
            "Simple and sweet, just like ghar ka khana! 🍛",
            "Intimate vibes only! No drama! 🧘‍♀️",
            "Court marriage? Sasural wale heart attack na le lein! 😱"
        ],
        // Question 2 reactions
        [
            "Conditions apply* Terms and services may vary! 📝",
            "Counter offer! Shark Tank India mein aana chahiye aapko! 🦈",
            "No compromise gang! Attitude! 😎",
            "Negotiation skills on point! MBA kiye ho kya? 📊"
        ],
        // Question 3 reactions
        [
            "Sasural Simar Ka next star aap hi ho! 🌟",
            "Thoda compromise, thoda stand - perfectly balanced! 🧘‍♂️",
            "Progressive soch! Naya Bharat! 🇮🇳",
            "Ghost mode activated! Block bhi kar doge kya? 👻"
        ],
        // Question 4 reactions
        [
            "Practical choice! Ghar chalane ke liye paisa chahiye! 💵",
            "Values matter! Sundar Pichai approves! 👍",
            "Power couple in the making! LinkedIn pe post karenge! 💼",
            "Pyaar > Paisa! Bollywood approves! 🎬"
        ],
        // Question 5 reactions
        [
            "Secret bank account! Smart move! 🏦",
            "Transparency with boundaries! Modern times! 🔄",
            "Joint account warriors! Communist party salutes you! ☭",
            "Big fat Indian wedding incoming! Pandit ji ready rakho! 🕉️"
        ]
    ];
    
    // Create and add the reaction element
    const reactionDiv = document.createElement('div');
    reactionDiv.className = 'answer-reaction';
    reactionDiv.textContent = reactions[questionIndex][optionIndex];
    reactionDiv.style.animation = 'bounceIn 0.5s';
    
    container.appendChild(reactionDiv);
}

function nextQuestion() {
    if (currentQuestion < quizQuestions.length - 1) {
        // Hide current question with animation
        const currentQuestionElement = document.querySelector(`#question-${currentQuestion}`);
        currentQuestionElement.style.animation = 'fadeOutLeft 0.3s forwards';
        
        setTimeout(() => {
            currentQuestionElement.classList.remove('active');
            
            // Show next question with animation
            currentQuestion++;
            const nextQuestionElement = document.querySelector(`#question-${currentQuestion}`);
            nextQuestionElement.classList.add('active');
            nextQuestionElement.style.animation = 'fadeInRight 0.3s forwards';
            
            updateQuizProgress();
        }, 300);
    }
}

function prevQuestion() {
    if (currentQuestion > 0) {
        // Hide current question with animation
        const currentQuestionElement = document.querySelector(`#question-${currentQuestion}`);
        currentQuestionElement.style.animation = 'fadeOutRight 0.3s forwards';
        
        setTimeout(() => {
            currentQuestionElement.classList.remove('active');
            
            // Show previous question with animation
            currentQuestion--;
            const prevQuestionElement = document.querySelector(`#question-${currentQuestion}`);
            prevQuestionElement.classList.add('active');
            prevQuestionElement.style.animation = 'fadeInLeft 0.3s forwards';
            
            updateQuizProgress();
        }, 300);
    }
}

function updateQuizProgress() {
    const progressFill = document.getElementById('quizProgress');
    if (progressFill) {
        const progressPercentage = ((currentQuestion + 1) / quizQuestions.length) * 100;
        progressFill.style.width = `${progressPercentage}%`;
        
        // Add animation to progress bar
        progressFill.style.transition = 'width 0.5s cubic-bezier(0.65, 0, 0.35, 1)';
    }
}

function finishQuiz() {
    // Calculate result
    const result = calculateQuizResult();
    
    // Hide questions with animation
    const questionsScreen = document.querySelector('.quiz-questions');
    questionsScreen.style.animation = 'fadeOutDown 0.5s forwards';
    
    setTimeout(() => {
        // Display result with animation
        showQuizResult(result);
    }, 500);
}

function calculateQuizResult() {
    // Enhanced scoring system based on answers
    // 0-1 points: Traditional (Royal)
    // 2-3 points: Mixed (Marvel)
    // 4-5 points: Progressive (Warrior)
    // Otherwise: Confused
    
    let traditionalScore = 0;
    let progressiveScore = 0;
    
    // Question 1: 0 is most traditional, 3 is most progressive
    if (quizAnswers[0] === 0) traditionalScore += 2;
    else if (quizAnswers[0] === 3) progressiveScore += 2;
    else if (quizAnswers[0] === 2) progressiveScore += 1;
    
    // Question 2: 2 is most progressive, 1 is most traditional
    if (quizAnswers[1] === 2) progressiveScore += 2;
    else if (quizAnswers[1] === 1) traditionalScore += 2;
    
    // Question 3: 0 is most traditional, 2 is most progressive
    if (quizAnswers[2] === 0) traditionalScore += 2;
    else if (quizAnswers[2] === 2) progressiveScore += 2;
    
    // Question 4: 0 is more traditional, 3 is more progressive
    if (quizAnswers[3] === 0) traditionalScore += 1;
    else if (quizAnswers[3] === 3) progressiveScore += 1;
    
    // Question 5: 0 is more traditional, 2 is more progressive
    if (quizAnswers[4] === 0) traditionalScore += 1;
    else if (quizAnswers[4] === 2) progressiveScore += 1;
    
    // Determine result
    if (traditionalScore > progressiveScore + 2) return 0; // Raja/Rani
    if (progressiveScore > traditionalScore + 2) return 2; // Warrior
    if (Math.abs(traditionalScore - progressiveScore) <= 2) return 1; // Marvel
    
    return 3; // Confused
}

function showQuizResult(resultIndex) {
    const questionsScreen = document.querySelector('.quiz-questions');
    const resultScreen = document.querySelector('.quiz-result');
    const shareSection = document.querySelector('.share-quiz-result');
    
    // Hide questions, show result
    questionsScreen.style.display = 'none';
    resultScreen.style.display = 'block';
    resultScreen.style.animation = 'fadeInUp 0.8s forwards';
    
    // Display result content with enhanced styling
    const result = quizResults[resultIndex];
    resultScreen.innerHTML = `
        <div class="result-card">
            <div class="result-header">
                <div class="result-emoji">${result.emoji}</div>
                <h2 class="result-title">${result.title}</h2>
            </div>
            <div class="result-gif">
                <img src="${result.gif}" alt="${result.title}" />
            </div>
            <p class="result-description">${result.description}</p>
            
            <div class="result-badge">
                <div class="badge-icon">🏆</div>
                <div class="badge-text">
                    <span>Achievement Unlocked</span>
                    <strong>${result.title}</strong>
                </div>
            </div>
            
            <div class="funny-advice">
                ${getFunnyAdvice(resultIndex)}
            </div>
        </div>
    `;
    
    // Show share buttons with animation
    shareSection.style.display = 'block';
    shareSection.style.animation = 'fadeInUp 0.8s 0.3s forwards';
    
    // Add confetti effect for fun
    addConfettiEffect();
}

function getFunnyAdvice(resultIndex) {
    const adviceByType = [
        // Raja/Rani
        [
            "Tip: Apne dahej demands ki itemized list Excel mein maintain karein. Organization is key! 📊",
            "Sasural mein impression ke liye gold-plated iPhone gift karein. Budget tight ho toh sticker bhi chalega! 📱",
            "Shaadi ke baad in-laws ko daily good morning message bhejne ka reminder set karein! ⏰"
        ],
        // Middle-Class Marvel
        [
            "Tip: Dahej mein manga hua furniture IKEA se bhi mil sakta hai. Assembled nahi toh kya hua! 🛋️",
            "Compromise formula: Honeymoon pe Goa jao, Switzerland ke Instagram filters use karo! 🏖️",
            "Relatives ko dikhane ke liye branded clothes, ghar pe comfortable pajamas! Perfect balance! 👕"
        ],
        // Dahej-Free Warrior
        [
            "Tip: Anti-dahej quotes apne WhatsApp status pe daily update karein! Awareness is key! 📱",
            "Shaadi mein 'No Gifts Please, Your Presence is Present Enough' ka banner lagayein! 🎁",
            "In-laws ko progressive documentaries ki subscription gift karein! Education matters! 🎬"
        ],
        // Confused Negotiator
        [
            "Tip: Apne mood swings ke hisaab se dahej policy rakhein. Flexibility is your strength! 🔄",
            "Kabhi traditional, kabhi modern - wardrobe jaise personality bhi mix and match rakhein! 👔",
            "Decision making mein confused ho toh coin toss karein! Heads = progressive, Tails = traditional! 🪙"
        ]
    ];
    
    // Randomly select one piece of advice
    const randomIndex = Math.floor(Math.random() * adviceByType[resultIndex].length);
    return adviceByType[resultIndex][randomIndex];
}

function addConfettiEffect() {
    // Add simple confetti effect with CSS
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    
    // Create 50 confetti pieces
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.animationDelay = `${Math.random() * 3}s`;
        confetti.style.backgroundColor = getRandomColor();
        
        confettiContainer.appendChild(confetti);
    }
    
    document.body.appendChild(confettiContainer);
    
    // Remove confetti after animation completes
    setTimeout(() => {
        confettiContainer.remove();
    }, 6000);
}

function getRandomColor() {
    const colors = [
        '#FFC107', // Yellow
        '#FF5722', // Deep Orange
        '#E91E63', // Pink
        '#9C27B0', // Purple
        '#3F51B5', // Indigo
        '#2196F3', // Blue
        '#009688', // Teal
        '#4CAF50', // Green
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

function shareQuizResult(platform) {
    const resultTitle = document.querySelector('.result-title').textContent;
    const message = `OMG! Main ek "${resultTitle}" nikla Dahej Personality Quiz mein! 😱 Tum bhi check karo apna dahej personality:  https://dahej-wale-babu.vercel.app #DahejDetector`;
    
    let shareUrl = '';
    
    switch (platform) {
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
            break;
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(message)}`;
            break;
       
    }
    
    window.open(shareUrl, '_blank');
}

// Enhanced Dowry Demand Generator with Indian Cultural Context
const demandItems = {
  extravagant: [
      { item: "5-acre farmhouse in Lonavala with swimming pool", emoji: "🏡" },
      { item: "Latest Range Rover with chauffeur for 2 years", emoji: "🚙" },
      { item: "Entire floor in a South Delhi apartment complex", emoji: "🏢" },
      { item: "Gold-plated Ganesh idol (5 kg minimum)", emoji: "🙏" },
      { item: "Destination wedding in Udaipur Palace (500 guests)", emoji: "👰" },
      { item: "Solitaire diamond set from Jaipur's royal jeweler", emoji: "💎" },
      { item: "Fully furnished penthouse in Mumbai's Worli area", emoji: "🏙️" },
      { item: "Chartered flight for baraat procession", emoji: "✈️" },
      { item: "Investment in Ambani's next business venture", emoji: "💰" }
  ],
  bougie: [
      { item: "Audi Q7 (white only, with sunroof)", emoji: "🚗" },
      { item: "1 kg gold jewelry from Tanishq (latest collection)", emoji: "💍" },
      { item: "3BHK flat in a gated society (east-facing only)", emoji: "🏘️" },
      { item: "Sabyasachi trousseau with 21 designer sarees", emoji: "👗" },
      { item: "Honeymoon package to Switzerland (minimum 15 days)", emoji: "🏔️" },
      { item: "Complete home appliances from Croma (extended warranty)", emoji: "🔌" },
      { item: "Fixed deposit of ₹51 lakh in bride's name (but in-laws keep passbook)", emoji: "🏦" },
      { item: "Platinum jewelry set for mother-in-law", emoji: "👵" },
      { item: "iPhone 15 Pro Max for all immediate family members", emoji: "📱" }
  ],
  modest: [
      { item: "Just a small 2BHK flat in a 'good area'", emoji: "🏢" },
      { item: "Only 500 grams of gold (we're being reasonable)", emoji: "🪙" },
      { item: "Simple Maruti Dzire (white color for shubh muhurat)", emoji: "🚗" },
      { item: "Modest wedding at 5-star hotel (just family and close friends - 200 people)", emoji: "💒" },
      { item: "Monthly pocket money for husband (very reasonable ₹25,000)", emoji: "💸" },
      { item: "Complete bedroom set from HomeTown (no EMI please)", emoji: "🛏️" },
      { item: "Just one trip to Goa every year (5-star resort only)", emoji: "🏖️" },
      { item: "Small solitaire mangalsutra (1 carat minimum)", emoji: "📿" }
  ]
};

const funnyTwists = [
  "Plus ₹1.25 lakh extra if bride knows how to make perfect round rotis",
  "₹51,000 discount if bride has an MBA from IIM (but promises not to use it)",
  "Extra ₹2 lakh if bride agrees to touch feet of all relatives every morning",
  "Special package: ₹1 lakh off if bride deletes all male contacts from phone",
  "Surcharge of ₹5 lakh if bride cannot sing at least 5 bhajans perfectly",
  "Additional ₹3 lakh if bride's complexion matches our family's 'fair and lovely' standards",
  "Discount of ₹2 lakh if bride agrees to never visit her mayka more than twice a year",
  "Premium of ₹7 lakh if bride cannot make at least 15 varieties of sabzi",
  "Extra ₹1.5 lakh if bride agrees to wake up at 5 AM to perform puja before office",
  "Surcharge for each inch of bride's height above 5'4\" (tall brides need more dowry)",
  "Special consideration: ₹4 lakh off if horoscope matches 32/36 gunas instead of just 30/36",
  "Auspicious offer: Pay extra ₹1.11 lakh for wedding on Akshaya Tritiya"
];
function generateDowryList() {
    const userName = document.getElementById('demandName').value || 'Anonymous User';
    const style = document.getElementById('demandStyle').value;
    
    let items = [];
    
    // Select items based on style
    if (style === 'random') {
        // Mix from all categories
        const allItems = [
            ...demandItems.extravagant,
            ...demandItems.bougie,
            ...demandItems.modest
        ];
        
        // Shuffle and pick random number between 4-7
        items = shuffleArray(allItems).slice(0, Math.floor(Math.random() * 4) + 4);
    } else {
        // Pick from specific category
        items = shuffleArray(demandItems[style]).slice(0, Math.floor(Math.random() * 4) + 4);
    }
    
    // Add 1-2 funny twists
    const twists = shuffleArray(funnyTwists).slice(0, Math.floor(Math.random() * 2) + 1);
    
    // Calculate total (random amount)
    let baseAmount = 0;
    
    if (style === 'extravagant') {
        baseAmount = Math.floor(Math.random() * 50) + 50; // 50-100 crore
    } else if (style === 'bougie') {
        baseAmount = Math.floor(Math.random() * 30) + 20; // 20-50 crore
    } else {
        baseAmount = Math.floor(Math.random() * 15) + 5; // 5-20 crore
    }
    
    // Generate the HTML
    const generatedContainer = document.getElementById('generatedList');
    generatedContainer.innerHTML = `
        <h4>✨ Official Dowry Demand for ${userName} ✨</h4>
        <div class="demand-list">
            <ul id="demandItemsList"></ul>
        </div>
        <div id="twistsContainer" class="mt-4"></div>
        <p class="mt-4"><strong>Total Value:</strong> Approximately ₹${baseAmount} crore (negotiable, but not really)</p>
        <p><em>* No cap fr fr. The vibes gotta match the price.</em></p>
    `;
    
    // Add items with animation delay
    const demandList = document.getElementById('demandItemsList');
    
    items.forEach((item, index) => {
        setTimeout(() => {
            const li = document.createElement('li');
            li.className = 'demand-item';
            li.innerHTML = `<span class="demand-emoji">${item.emoji}</span> ${item.item}`;
            demandList.appendChild(li);
        }, 100 * index);
    });
    
    // Add twists with animation delay
    const twistsContainer = document.getElementById('twistsContainer');
    
    setTimeout(() => {
        twistsContainer.innerHTML = '<h4 class="mt-3">Special Conditions:</h4>';
        
        twists.forEach((twist, index) => {
            setTimeout(() => {
                const twistElement = document.createElement('div');
                twistElement.className = 'demand-item';
                twistElement.innerHTML = `<span class="demand-emoji">🔥</span> ${twist}`;
                twistsContainer.appendChild(twistElement);
            }, 100 * index);
        });
    }, 100 * items.length);
    
    // Show share buttons
    document.querySelector('.share-demand').style.display = 'block';
}

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function shareDemand(platform) {
    const userName = document.getElementById('demandName').value || 'Someone';
    const message = `Check out the outrageous dowry demands for ${userName}! 😱 The Dahej wale babu(DWB) is wild! Try it yourself: https://dahej-wale-babu.vercel.app/`;
    
    let shareUrl = '';
    
    switch (platform) {
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
            break;
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(message)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
            break;
    }
    
    window.open(shareUrl, '_blank');
}

// Scroll Animations
function initScrollAnimations() {
    // Add fade-in class to elements we want to animate on scroll
    document.querySelectorAll('.leaderboard-item, .awareness-card, .meme').forEach(item => {
        item.classList.add('fade-in-element');
    });
    
    // Function to check if an element is in viewport
    const isInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    };
    
    // Function to handle scroll
    const handleScroll = () => {
        document.querySelectorAll('.fade-in-element').forEach(element => {
            if (isInViewport(element) && !element.classList.contains('visible')) {
                element.classList.add('visible');
            }
        });
    };
    
    // Listen for scroll events
    window.addEventListener('scroll', handleScroll);
    
    // Trigger once on load
    handleScroll();
}

// Add some initial styling
document.addEventListener('DOMContentLoaded', function() {
    // Set initial opacity and transform for fade-in animations
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        // Make sections visible after a short delay
        setTimeout(() => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, 100);
    });
    
    // Initialize calculator if exists
    if (jobTypeSelect) {
        jobTypeSelect.dispatchEvent(new Event('change'));
    }
});
//chatbot
document.addEventListener('DOMContentLoaded', function() {
   
  
    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const toggleText = themeToggle ? themeToggle.querySelector('.toggle-text') : null;
    
    themeToggle?.addEventListener('click', function() {
      document.body.classList.toggle('gold-mode');
      
      if (document.body.classList.contains('gold-mode')) {
        toggleText.textContent = 'Switch to Normal Mode';
        themeToggle.querySelector('.toggle-icon').textContent = '✨';
      } else {
        toggleText.textContent = 'Switch to Gold Mode';
        themeToggle.querySelector('.toggle-icon').textContent = '💰';
      }
    });
   // Pledge Section Functionality
   const nameForPledge = document.getElementById('nameForPledge');
   const agreementPledge = document.getElementById('agreementPledge');
   const takePledge = document.getElementById('takePledge');
   const pledgeName = document.getElementById('pledgeName');
   const pledgeDate = document.getElementById('pledgeDate');
   const heroesList = document.getElementById('heroesList');
   const shareSection = document.querySelector('.share-pledge');
   const certificateElement = document.getElementById('certificate');

   // Set today's date
   const today = new Date();
   if (pledgeDate) {
       pledgeDate.textContent = today.toLocaleDateString('en-US', { 
           year: 'numeric', 
           month: 'long', 
           day: 'numeric' 
       });
   }

   // Enable/disable pledge button based on checkbox
   agreementPledge?.addEventListener('change', function() {
       if (takePledge) {
           takePledge.disabled = !this.checked;
       }
   });

   // Update certificate name as user types
   nameForPledge?.addEventListener('input', function() {
       if (pledgeName) {
           pledgeName.textContent = this.value || "Your Name";
       }
   });

   // Take pledge functionality
   takePledge?.addEventListener('click', function() {
       const name = nameForPledge.value.trim() || "Anonymous Hero";
       
       // Add to heroes list
       if (heroesList) {
           const heroItem = document.createElement('div');
           heroItem.className = 'hero-item';
           heroItem.innerHTML = `
               <span class="hero-name">${name}</span>
               <span class="hero-badge">Dowry-Free Hero</span>
           `;
           heroesList.prepend(heroItem);
       }
       
       // Show confirmation and enable sharing
       if (shareSection) {
           shareSection.style.display = 'block';
           
           // Add download button if not exists
           if (!document.getElementById('downloadCertificateBtn')) {
               const downloadBtn = document.createElement('button');
               downloadBtn.id = 'downloadCertificateBtn';
               downloadBtn.className = 'download-btn';
               downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download Certificate';
               downloadBtn.addEventListener('click', downloadCertificate);
               shareSection.appendChild(downloadBtn);
           }
       }
       
       // Save to local storage
       const heroes = JSON.parse(localStorage.getItem('pledgeHeroes') || '[]');
       heroes.push({
           name: name,
           date: today.toLocaleDateString()
       });
       localStorage.setItem('pledgeHeroes', JSON.stringify(heroes));
       
       // Show success message
       alert(`Thank you, ${name}! You are now a Dowry-Free Hero! Your pledge has been recorded.`);
   });

   // Certificate download functionality
   async function downloadCertificate() {
       if (!certificateElement) {
           console.error('Certificate element not found');
           return;
       }

       const name = nameForPledge?.value.trim() || "Anonymous Hero";

       try {
           // Add temporary class for better capture
           certificateElement.classList.add('certificate-capture');

           const canvas = await html2canvas(certificateElement, {
               scale: 2,
               logging: false,
               useCORS: true,
               allowTaint: true,
               backgroundColor: null
           });

           // Remove temporary class
           certificateElement.classList.remove('certificate-capture');

           // Create download link
           const link = document.createElement('a');
           link.download = `dowry-free-pledge-${name.replace(/\s+/g, '-').toLowerCase()}.png`;
           link.href = canvas.toDataURL('image/png');
           document.body.appendChild(link);
           link.click();
           document.body.removeChild(link);
       } catch (error) {
           console.error('Error generating certificate:', error);
           alert('Failed to download certificate. Please try again later.');
           certificateElement.classList.remove('certificate-capture');
       }
   }

   // Load heroes from local storage on page load
   function loadHeroes() {
       if (!heroesList) return;
       
       const heroes = JSON.parse(localStorage.getItem('pledgeHeroes') || '[]');
       heroes.forEach(hero => {
           const heroItem = document.createElement('div');
           heroItem.className = 'hero-item';
           heroItem.innerHTML = `
               <span class="hero-name">${hero.name}</span>
               <span class="hero-badge">Dowry-Free Hero</span>
           `;
           heroesList.appendChild(heroItem);
       });
   }

   // Initialize on page load
   loadHeroes();
  
    // Scam Alert Section Functionality
    const analyzeProposal = document.getElementById('analyzeProposal');
    const riskFill = document.getElementById('riskFill');
    const riskPercentage = document.getElementById('riskPercentage');
    const riskVerdict = document.getElementById('riskVerdict');
    const riskFactorsList = document.getElementById('riskFactorsList');
    const reportScam = document.getElementById('reportScam');
    
    analyzeProposal?.addEventListener('click', function() {
      const salary = document.getElementById('proposalSalary').value;
      const job = document.getElementById('proposalJob').value;
      const demands = document.getElementById('proposalDemands').value;
      const relatives = document.getElementById('proposalRelatives').value;
      
      // Show results section
      const resultsSection = document.querySelector('.scam-results');
      if (resultsSection) {
        resultsSection.style.display = 'block';
      }
      
      // Calculate risk score
      let risk = 0;
      const riskFactors = [];
      
      // Salary factor
      if (!salary || parseInt(salary) < 20000) {
        risk += 20;
        riskFactors.push("Low income but potential high expectations");
      }
      
      // Job factor
      if (job === 'unemployed') {
        risk += 30;
        riskFactors.push("Unemployed groom/bride may be looking for financial security through dowry");
      } else if (job === 'government') {
        risk += 15;
        riskFactors.push("Government job often used as leverage for higher dowry demands");
      }
      
      // Demands factor
      if (demands) {
        const demandKeywords = ['gift', 'car', 'gold', 'cash', 'property', 'house', 'flat', 'jewelry', 'money', 'pay'];
        demandKeywords.forEach(keyword => {
          if (demands.toLowerCase().includes(keyword)) {
            risk += 10;
            if (!riskFactors.includes("Direct or indirect dowry demands detected in conversation")) {
              riskFactors.push("Direct or indirect dowry demands detected in conversation");
            }
          }
        });
        
        if (demands.length > 100) {
          risk += 10;
          riskFactors.push("Extensive list of expectations may indicate materialistic tendencies");
        }
      }
      
      // Family involvement factor
      if (relatives === 'high') {
        risk += 25;
        riskFactors.push("High involvement of extended family is often a red flag for dowry pressure");
      } else if (relatives === 'medium') {
        risk += 15;
        riskFactors.push("Moderate family involvement in marriage discussions - monitor closely");
      }
      
      // Cap risk at 100%
      risk = Math.min(100, risk);
      
      // Update UI with risk assessment
      if (riskFill) riskFill.style.width = `${risk}%`;
      if (riskPercentage) riskPercentage.textContent = `${risk}%`;
      
      // Set verdict based on risk level
      if (riskVerdict) {
        if (risk < 30) {
          riskVerdict.textContent = "Green Flag! Low risk of dowry demands detected.";
          riskVerdict.style.backgroundColor = "rgba(16, 185, 129, 0.2)";
        } else if (risk < 60) {
          riskVerdict.textContent = "Warning! Medium risk of dowry expectations.";
          riskVerdict.style.backgroundColor = "rgba(245, 158, 11, 0.2)";
        } else {
          riskVerdict.textContent = "Red Alert! High risk of dowry demands.";
          riskVerdict.style.backgroundColor = "rgba(239, 68, 68, 0.2)";
        }
      }
      
      // Update risk factors list
      if (riskFactorsList) {
        riskFactorsList.innerHTML = '';
        if (riskFactors.length === 0) {
          riskFactorsList.innerHTML = '<li>No significant risk factors detected</li>';
        } else {
          riskFactors.forEach(factor => {
            const li = document.createElement('li');
            li.textContent = factor;
            riskFactorsList.appendChild(li);
          });
        }
      }
    });
    
    reportScam?.addEventListener('click', function() {
      // Open modal or redirect to resources page
      alert("This would connect you to legal resources and dowry reporting services. For now, please check the resources listed below.");
    });
  
    
    // Smooth scroll for navigation
    window.scrollToCalculator = function() {
      const calculator = document.getElementById('calculator');
      if (calculator) {
        calculator.scrollIntoView({ behavior: 'smooth' });
      }
    };
    
    // Add scroll animation to elements
    const animatedElements = document.querySelectorAll('.pledge-certificate, .story-card, .escape-step');
    
    function checkVisibility() {
      animatedElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        const isVisible = (elementTop < window.innerHeight) && (elementBottom > 0);
        
        if (isVisible) {
          element.classList.add('visible');
        }
      });
    }
    
    // Initial check on page load
    checkVisibility();
    
    // Check on scroll
    window.addEventListener('scroll', checkVisibility);
  });
  
  // Add CSS for animated elements if not included in the main CSS
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addAnimationStyles);
  } else {
    addAnimationStyles();
  }
  
  function addAnimationStyles() {
    if (!document.querySelector('style#animation-style')) {
      const style = document.createElement('style');
      style.id = 'animation-style';
      style.innerHTML = `
        .pledge-certificate, .story-card, .escape-step {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        
        .pledge-certificate.visible, .story-card.visible, .escape-step.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `;
      document.head.appendChild(style);
    }
  }
// Form section reveal animation
document.addEventListener('DOMContentLoaded', function() {
    const formSections = document.querySelectorAll('.form-section');
    
    // Make all form sections visible initially to prevent them from being hidden
    formSections.forEach(section => {
      section.classList.add('visible');
    });
    
    // Set up intersection observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          entry.target.classList.add('animated');
        }
      });
    }, { threshold: 0.2 });
    
    // Observe each form section
    formSections.forEach(section => {
      section.classList.add('scroll-reveal');
      observer.observe(section);
    });
  });
  // Add this to your existing script.js file

// Bento grid loading animations
document.addEventListener('DOMContentLoaded', function() {
    // Animate bento items with delay
    const bentoItems = document.querySelectorAll('.bento-item');
    
    setTimeout(() => {
      bentoItems.forEach(item => {
        const delay = item.getAttribute('data-delay') || 0;
        setTimeout(() => {
          item.classList.add('loaded');
        }, delay * 1000);
      });
    }, 500);
    
    // Counter animation
    const counters = document.querySelectorAll('.counter-number');
    
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const duration = 60000; // 60 seconds
      const step = target / (duration / 30); // Update every 30ms
      let current = 0;
      
      const updateCounter = () => {
        current += step;
        if (current < target) {
          counter.textContent = Math.floor(current);
          setTimeout(updateCounter, 30);
        } else {
          counter.textContent = target;
        }
      };
      
      // Start counter animation after bento items have loaded
      setTimeout(updateCounter, 1500);
    });
  });
  
  // Existing scrollToCalculator function
  function scrollToCalculator() {
    const calculatorSection = document.getElementById('calculator');
    calculatorSection.scrollIntoView({ behavior: 'smooth' });
  }
  
// Add tilt effect to fun elements
document.addEventListener('DOMContentLoaded', function() {
  const tiltElements = document.querySelectorAll('.meme-generator, .meme-gallery, .meme');
  
  tiltElements.forEach(element => {
    element.classList.add('tilt-effect');
    
    element.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const moveX = (x - centerX) / (rect.width / 2) * 10;
      const moveY = (y - centerY) / (rect.height / 2) * 10;
      
      this.style.setProperty('--x', moveX);
      this.style.setProperty('--y', moveY);
    });
    
    element.addEventListener('mouseleave', function() {
      this.style.setProperty('--x', 0);
      this.style.setProperty('--y', 0);
    });
  });
  
  // Add confetti effect to fun buttons
  const funButtons = document.querySelectorAll('.fun-button');
  
  funButtons.forEach(button => {
    button.addEventListener('click', function() {
      createConfetti(this);
    });
  });
  
  function createConfetti(element) {
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    document.body.appendChild(confettiContainer);
    
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = `${centerX + (Math.random() * 200 - 100)}px`;
      confetti.style.width = `${Math.random() * 10 + 5}px`;
      confetti.style.height = `${Math.random() * 10 + 5}px`;
      confetti.style.backgroundColor = getRandomColor();
      confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
      confettiContainer.appendChild(confetti);
    }
    
    setTimeout(() => {
      confettiContainer.remove();
    }, 5000);
  }
  
  function getRandomColor() {
    const colors = [
      '#8b5cf6', '#6366f1', '#ec4899', '#f43f5e', '#10b981', 
      '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6', '#6366f1'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  // Add shimmer effect to elements
  const memeElements = document.querySelectorAll('.meme');
  memeElements.forEach((meme, index) => {
    meme.classList.add('shimmer');
    meme.style.setProperty('--i', index);
  });
});
//facts and
 document.addEventListener('DOMContentLoaded', function() {
        // Facts Slider Functionality
        const factsSlider = document.getElementById('factsSlider');
        const prevFactBtn = document.getElementById('prevFact');
        const nextFactBtn = document.getElementById('nextFact');
        const factDots = document.querySelectorAll('.slider-dot');
        
        let currentFactIndex = 0;
        const factCards = document.querySelectorAll('.fact-card');
        
        // Initialize dots
        updateDots(currentFactIndex);
        
        // Next button click
        nextFactBtn.addEventListener('click', function() {
            if (currentFactIndex < factCards.length - 1) {
                currentFactIndex++;
                scrollToFact(currentFactIndex);
            } else {
                // Loop back to first fact
                currentFactIndex = 0;
                scrollToFact(currentFactIndex);
            }
        });
        
        // Previous button click
        prevFactBtn.addEventListener('click', function() {
            if (currentFactIndex > 0) {
                currentFactIndex--;
                scrollToFact(currentFactIndex);
            } else {
                // Loop to last fact
                currentFactIndex = factCards.length - 1;
                scrollToFact(currentFactIndex);
            }
        });
        
        // Dot navigation
        factDots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                currentFactIndex = index;
                scrollToFact(currentFactIndex);
            });
        });
        
        // Scroll to specific fact
        function scrollToFact(index) {
            const factCard = factCards[index];
            factsSlider.scrollTo({
                left: factCard.offsetLeft - factsSlider.offsetLeft,
                behavior: 'smooth'
            });
            updateDots(index);
        }
        
        // Update active dot
        function updateDots(index) {
            factDots.forEach((dot, i) => {
                if (i === index) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
        
        // Handle scroll events to update dots
        factsSlider.addEventListener('scroll', function() {
            const scrollPosition = factsSlider.scrollLeft;
            factCards.forEach((card, index) => {
                const cardPosition = card.offsetLeft - factsSlider.offsetLeft;
                const cardWidth = card.offsetWidth;
                
                if (scrollPosition >= cardPosition - cardWidth / 2 && 
                    scrollPosition < cardPosition + cardWidth / 2) {
                    currentFactIndex = index;
                    updateDots(currentFactIndex);
                }
            });
        });
        
   
// Reaction buttons functionality
const reactionButtons = document.querySelectorAll('.reaction-btn');

// Load saved reactions from localStorage
document.addEventListener('DOMContentLoaded', function() {
    // Load previously saved reactions
    loadSavedReactions();
});

function loadSavedReactions() {
    // For each fact card, check if user has a saved reaction
    document.querySelectorAll('.fact-card').forEach(card => {
        const factId = card.querySelector('.fact-number').textContent;
        const savedReaction = localStorage.getItem(`fact-reaction-${factId}`);
        
        if (savedReaction) {
            // Find the button with this reaction and activate it
            const button = card.querySelector(`.reaction-btn[data-reaction="${savedReaction}"]`);
            if (button) {
                button.classList.add('active');
            }
        }
    });
}

reactionButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get the fact card this button belongs to
        const factCard = this.closest('.fact-card');
        const factId = factCard.querySelector('.fact-number').textContent;
        const reactionType = this.dataset.reaction;
        
        // Check if this button is already active
        const isActive = this.classList.contains('active');
        
        // Remove active class from all reaction buttons in this card
        const cardButtons = factCard.querySelectorAll('.reaction-btn');
        cardButtons.forEach(btn => {
            // If a button was active, decrease its count
            if (btn.classList.contains('active')) {
                const btnCount = btn.querySelector('.reaction-count');
                let count = parseInt(btnCount.textContent);
                count--;
                btnCount.textContent = count;
                btn.classList.remove('active');
            }
        });
        
        // If the clicked button wasn't already active, activate it and increase count
        if (!isActive) {
            this.classList.add('active');
            const countElement = this.querySelector('.reaction-count');
            let count = parseInt(countElement.textContent);
            count++;
            countElement.textContent = count;
            
            // Save to localStorage
            localStorage.setItem(`fact-reaction-${factId}`, reactionType);
        } else {
            // If it was already active, we've deactivated it, so remove from storage
            localStorage.removeItem(`fact-reaction-${factId}`);
        }
    });
});

        
        // Download toolkit button
        const downloadBtn = document.querySelector('.download-btn');
        
        downloadBtn.addEventListener('click', function() {
            alert('Your Dowry PPT is being downloaded. This would typically download a PPTx file.');
        });
    });

    // AOS (Animate On Scroll) Initialization
document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS library if it exists
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true
    });
  } else {
    // If AOS is not loaded, add it dynamically
    const aosCSS = document.createElement('link');
    aosCSS.rel = 'stylesheet';
    aosCSS.href = 'https://unpkg.com/aos@next/dist/aos.css';
    document.head.appendChild(aosCSS);
    
    const aosScript = document.createElement('script');
    aosScript.src = 'https://unpkg.com/aos@next/dist/aos.js';
    aosScript.onload = function() {
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
      });
    };
    document.body.appendChild(aosScript);
  }
  
  // Animate statistics counter when in viewport
  const statNumbers = document.querySelectorAll('.stat-number');
  
  // Check if IntersectionObserver is supported
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const countTo = parseInt(target.getAttribute('data-count'));
          
          animateCounter(target, 0, countTo, 2000);
          observer.unobserve(target);
        }
      });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
      observer.observe(stat);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    statNumbers.forEach(stat => {
      const countTo = parseInt(stat.getAttribute('data-count'));
      animateCounter(stat, 0, countTo, 2000);
    });
  }
  
  // Counter animation function
  function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentCount = Math.floor(progress * (end - start) + start);
      element.textContent = currentCount;
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }
});
// Terms of Use Overlay Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Get elements
  const termsOverlay = document.getElementById('terms-overlay');
  const closeTermsBtn = document.querySelector('.close-terms-btn');
  const acceptTermsBtn = document.querySelector('.accept-terms-btn');
  const termsLink = document.querySelector('.footer-legal-link[data-tab="terms"]');
  
  // Function to open terms overlay
  function openTermsOverlay() {
    termsOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling of background
    
    // Initialize AOS for terms sections if AOS is available
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
  }
  
  // Function to close terms overlay
  function closeTermsOverlay() {
    termsOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Re-enable scrolling
  }
  
  // Event listeners
  termsLink.addEventListener('click', function(e) {
    e.preventDefault();
    openTermsOverlay();
  });
  
  closeTermsBtn.addEventListener('click', closeTermsOverlay);
  
  acceptTermsBtn.addEventListener('click', closeTermsOverlay);
  
  // Close when clicking outside the terms container
  termsOverlay.addEventListener('click', function(e) {
    if (e.target === termsOverlay) {
      closeTermsOverlay();
    }
  });
  
  // Add scroll highlight effect for terms sections
  const termsSections = document.querySelectorAll('.terms-section');
  
  function highlightVisibleSections() {
    termsSections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const isVisible = (
        rect.top >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
      );
      
      if (isVisible) {
        section.classList.add('highlight-section');
      } else {
        section.classList.remove('highlight-section');
      }
    });
  }
  
  // Add event listener to terms content for scroll
  const termsContent = document.querySelector('.terms-content');
  if (termsContent) {
    termsContent.addEventListener('scroll', highlightVisibleSections);
  }
  
  // Add animation to highlighted text
  const highlightedElements = document.querySelectorAll('.highlight-text, .highlight-warning');
  highlightedElements.forEach(element => {
    element.addEventListener('mouseover', function() {
      this.style.transform = 'scale(1.05)';
      this.style.transition = 'transform 0.3s ease';
    });
    
    element.addEventListener('mouseout', function() {
      this.style.transform = 'scale(1)';
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements - Check if elements exist before accessing them
  const chatMessages = document.getElementById('chat-messages');
  const messageInput = document.getElementById('message-input');
  const sendButton = document.getElementById('send-button');
  const brideMode = document.getElementById('bride-mode');
  const groomMode = document.getElementById('groom-mode');
  const negotiationScore = document.getElementById('negotiation-score');
  const scoreValue = document.getElementById('score-value');
  const negotiationMessage = document.getElementById('negotiation-message');
  
  // Exit early if chat elements don't exist
  if (!chatMessages || !messageInput || !sendButton) {
    console.log('Chat elements not found on this page');
    return;
  }
  
  // Chat state
  let currentMode = 'bride'; // Default mode
  let score = 50; // Start with neutral score
  let conversationStage = 'introduction'; // Track the stage of the conversation

  // Initialize the chat with a welcome message
  setTimeout(() => {
      addBotMessage(getWelcomeMessage(currentMode));
  }, 500);

  // Event Listeners
  sendButton.addEventListener('click', handleUserMessage);
  messageInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleUserMessage();
      }
  });

  // Mode switching
  if (brideMode && groomMode) {
    brideMode.addEventListener('click', function() {
        if (currentMode !== 'bride') {
            currentMode = 'bride';
            updateActiveMode();
            resetChat();
        }
    });

    groomMode.addEventListener('click', function() {
        if (currentMode !== 'groom') {
            currentMode = 'groom';
            updateActiveMode();
            resetChat();
        }
    });
  }

  function updateActiveMode() {
      brideMode.classList.toggle('active', currentMode === 'bride');
      groomMode.classList.toggle('active', currentMode === 'groom');
  }

  function resetChat() {
      // Clear chat
      chatMessages.innerHTML = '';
      // Reset score
      updateScore(50);
      // Reset conversation stage
      conversationStage = 'introduction';
      // Add welcome message for the new mode
      addBotMessage(getWelcomeMessage(currentMode));
  }

  function handleUserMessage() {
      const message = messageInput.value.trim();
      if (message === '') return;

      // Add user message to chat
      addUserMessage(message);
      
      // Clear input
      messageInput.value = '';
      
      // Show typing indicator
      showTypingIndicator();
      
      // Analyze message and respond after a realistic delay
      setTimeout(() => {
          // Remove typing indicator
          removeTypingIndicator();
          
          // Process message and respond
          const response = generateResponse(message, currentMode);
          addBotMessage(response.message);
          
          // Update score based on the message sentiment
          updateScore(score + response.scoreChange);
          
          // Update conversation stage
          conversationStage = response.nextStage || conversationStage;
      }, 1000 + Math.random() * 1000);
  }

  // Rest of your functions remain the same
  function addUserMessage(message) {
      const messageElement = document.createElement('div');
      messageElement.className = 'cxl2p9 plt8m3';
      messageElement.textContent = message;
      chatMessages.appendChild(messageElement);
      chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function addBotMessage(message) {
      const messageElement = document.createElement('div');
      messageElement.className = 'cxl2p9 aqj4k1';
      messageElement.textContent = message;
      chatMessages.appendChild(messageElement);
      chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTypingIndicator() {
      const typingIndicator = document.createElement('div');
      typingIndicator.className = 'wzx9c5';
      typingIndicator.id = 'typing-indicator';
      chatMessages.appendChild(typingIndicator);
      chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function removeTypingIndicator() {
      const typingIndicator = document.getElementById('typing-indicator');
      if (typingIndicator) {
          typingIndicator.remove();
      }
  }

  function updateScore(newScore) {
      // Limit score between 0 and 100
      score = Math.max(0, Math.min(100, newScore));
      
      // Update the score bar and value
      if (negotiationScore && scoreValue) {
          negotiationScore.style.width = `${score}%`;
          scoreValue.textContent = score;
          
          // Update message based on score
          if (negotiationMessage) {
              if (score >= 80) {
                  negotiationMessage.textContent = 'Great progress! Agreement is likely.';
              } else if (score >= 60) {
                  negotiationMessage.textContent = 'Good direction. Continue positive dialogue.';
              } else if (score >= 40) {
                  negotiationMessage.textContent = 'Neutral position - Keep negotiating.';
              } else if (score >= 20) {
                  negotiationMessage.textContent = 'Tensions rising. Try a different approach.';
              } else {
                  negotiationMessage.textContent = 'Negotiation failing. Significant changes needed.';
              }
          }
      }
  }

  function getWelcomeMessage(mode) {
      if (mode === 'bride') {
          return "Welcome to the Dahej Dialogue simulator. You are now in the role of the bride's family. How would you like to approach the dowry discussion with the groom's family?";
      } else {
          return "Welcome to the Dahej Dialogue simulator. You are now in the role of the groom's family. How would you like to approach the dowry discussion with the bride's family?";
      }
  }

  function generateResponse(message, mode) {
      // Analyze message sentiment (basic NLP simulation)
      const lowerMessage = message.toLowerCase();
      let scoreChange = 0;
      let responseMessage = '';
      let nextStage = conversationStage;
      
      // Positive language detection
      const positiveWords = ['agree', 'respect', 'understand', 'compromise', 'fair', 'reasonable', 'happy', 'satisfied', 'partnership', 'together', 'equality', 'respect', 'love'];
      
      // Negative language detection
      const negativeWords = ['demand', 'expect', 'must', 'require', 'insist', 'expensive', 'mandatory', 'disagree', 'never', 'unfair', 'unreasonable', 'costly'];
      
      // Dowry-related terms
      const dowryTerms = ['dowry', 'dahej', 'gift', 'money', 'gold', 'jewelry', 'property', 'car', 'house', 'cash'];
      
      // Count sentiment words
      let positiveCount = positiveWords.filter(word => lowerMessage.includes(word)).length;
      let negativeCount = negativeWords.filter(word => lowerMessage.includes(word)).length;
      let dowryMentions = dowryTerms.filter(term => lowerMessage.includes(term)).length;
      
      // Determine score change based on sentiment and mode
      if (mode === 'bride') {
          // For bride's family, positive language and refusing dowry increases score
          if (positiveCount > negativeCount && dowryMentions > 0) {
              scoreChange = 5;
          } else if (positiveCount > negativeCount) {
              scoreChange = 3;
          } else if (lowerMessage.includes('no dowry') || lowerMessage.includes('against dowry')) {
              scoreChange = 10;
          } else if (negativeCount > positiveCount && dowryMentions > 0) {
              scoreChange = -5;
          } else if (negativeCount > positiveCount) {
              scoreChange = -3;
          }
      } else {
          // For groom's family, positive language and refusing dowry increases score
          if (positiveCount > negativeCount && lowerMessage.includes('no dowry')) {
              scoreChange = 10;
          } else if (positiveCount > negativeCount && !dowryMentions) {
              scoreChange = 5;
          } else if (positiveCount > negativeCount) {
              scoreChange = 3;
          } else if (negativeCount > positiveCount && dowryMentions > 1) {
              scoreChange = -10;
          } else if (negativeCount > positiveCount) {
              scoreChange = -5;
          }
      }
      
      // Generate appropriate response based on the conversation stage
      switch (conversationStage) {
          case 'introduction':
              if (dowryMentions > 0) {
                  responseMessage = mode === 'bride' 
                      ? "I see you've mentioned dowry early in our discussion. We should discuss what this means for both families. What are your thoughts on how this tradition affects the marriage relationship?"
                      : "I notice you're bringing up dowry matters. We should consider whether this practice is appropriate in our modern society. What are your thoughts on marriage without dowry?";
                  nextStage = 'discussing_dowry';
              } else if (positiveCount > negativeCount) {
                  responseMessage = "Thank you for your positive approach. It's important to build understanding between our families. Would you like to discuss the wedding arrangements first, or shall we address financial matters?";
                  nextStage = 'planning';
              } else {
                  responseMessage = "Let's start our conversation by focusing on the couple's happiness and future together. What are your priorities for this marriage alliance?";
                  nextStage = 'priorities';
              }
              break;
              
          case 'discussing_dowry':
              if (lowerMessage.includes('no dowry') || lowerMessage.includes('against dowry')) {
                  responseMessage = "I'm glad to hear you're against the dowry system. This progressive thinking ensures that our families can focus on the couple's happiness rather than material exchanges.";
                  scoreChange += 5;
                  nextStage = 'agreement';
              } else if (positiveCount > negativeCount) {
                  responseMessage = "I appreciate your thoughtful approach to this sensitive topic. Perhaps we can focus on how both families can support the couple without resorting to traditional dowry practices?";
                  nextStage = 'alternatives';
              } else {
                  responseMessage = mode === 'bride'
                      ? "I understand there are traditions to consider, but we should remember that dowry demands can create unnecessary pressure. Can we discuss how to honor traditions while respecting modern values?"
                      : "While I understand your perspective, we should consider that dowry practices can be harmful. Perhaps we can discuss how both families can contribute to the couple's future in healthier ways?";
              }
              break;
              
          case 'priorities':
          case 'planning':
              if (dowryMentions > 0) {
                  responseMessage = "You've brought up financial matters. It's important to remember that Indian law prohibits dowry demands. Let's focus instead on how both families can support the couple's future together.";
                  nextStage = 'discussing_dowry';
              } else if (lowerMessage.includes('education') || lowerMessage.includes('career') || lowerMessage.includes('future')) {
                  responseMessage = "I'm glad we're focusing on what truly matters - the couple's future, education, and careers. This is much more important than material exchanges.";
                  scoreChange += 3;
                  nextStage = 'agreement';
              } else {
                  responseMessage = "As we plan this marriage, let's ensure we're creating a foundation of mutual respect and equality. What values do you believe are most important for the couple's relationship?";
              }
              break;
              
          case 'alternatives':
              if (positiveCount > negativeCount) {
                  responseMessage = "Your approach is refreshing. Perhaps instead of traditional dowry, both families could contribute to helping the couple establish their new home or save for their future?";
                  nextStage = 'agreement';
              } else {
                  responseMessage = "Consider that modern marriages thrive on equality and mutual respect. Financial demands can strain relationships before they even begin.";
              }
              break;
              
          case 'agreement':
              responseMessage = "I think we're making real progress in our discussion. Focusing on the couple's happiness and future rather than material exchanges will lead to a stronger marriage foundation.";
              scoreChange += 2;
              nextStage = 'conclusion';
              break;
              
          case 'conclusion':
              responseMessage = "Thank you for this productive conversation. It seems we're aligned on creating a positive environment for the marriage, free from the pressures of dowry. This bodes well for our families' future relationship.";
              scoreChange += 2;
              break;
              
          default:
              responseMessage = "I value this open dialogue between our families. What other aspects of the marriage would you like to discuss?";
      }
      
      return {
          message: responseMessage,
          scoreChange: scoreChange,
          nextStage: nextStage
      };
  }
});
// Mode switching for Dahej Dialogue Simulator
document.addEventListener('DOMContentLoaded', function() {
  const brideMode = document.getElementById('bride-mode');
  const groomMode = document.getElementById('groom-mode');
  const dialogueContainer = document.querySelector('.dialogue-container');
  
  // Set default mode
  document.body.classList.add('bride-mode');
  
  brideMode.addEventListener('click', function() {
    // Remove groom mode and add bride mode
    document.body.classList.remove('groom-mode');
    document.body.classList.add('bride-mode');
    
    // Update active button
    brideMode.classList.add('active');
    groomMode.classList.remove('active');
    
    // Add transition animation
    dialogueContainer.classList.add('mode-transition');
    setTimeout(() => {
      dialogueContainer.classList.remove('mode-transition');
    }, 500);
    
    // Update avatars and any other mode-specific elements
    updateAvatars('bride');
  });
  
  groomMode.addEventListener('click', function() {
    // Remove bride mode and add groom mode
    document.body.classList.remove('bride-mode');
    document.body.classList.add('groom-mode');
    
    // Update active button
    groomMode.classList.add('active');
    brideMode.classList.remove('active');
    
    // Add transition animation
    dialogueContainer.classList.add('mode-transition');
    setTimeout(() => {
      dialogueContainer.classList.remove('mode-transition');
    }, 500);
    
    // Update avatars and any other mode-specific elements
    updateAvatars('groom');
  });
  
  function updateAvatars(mode) {
    // This function can be expanded to update avatars or other elements
    // based on the selected mode
    const aiMessages = document.querySelectorAll('.aqj4k1');
    const userMessages = document.querySelectorAll('.plt8m3');
    
    if (mode === 'bride') {
      aiMessages.forEach(msg => {
        // Update AI avatar for bride mode (groom's family)
        const avatar = msg.querySelector('.avatar-img');
        if (avatar) {
          avatar.src = 'https://api.dicebear.com/6.x/bottts/svg?seed=groom';
        }
      });
      
      userMessages.forEach(msg => {
        // Update user avatar for bride mode
        const avatar = msg.querySelector('.avatar-img');
        if (avatar) {
          avatar.src = 'https://api.dicebear.com/6.x/personas/svg?seed=bride';
        }
      });
    } else {
      aiMessages.forEach(msg => {
        // Update AI avatar for groom mode (bride's family)
        const avatar = msg.querySelector('.avatar-img');
        if (avatar) {
          avatar.src = 'https://api.dicebear.com/6.x/bottts/svg?seed=bride';
        }
      });
      
      userMessages.forEach(msg => {
        // Update user avatar for groom mode
        const avatar = msg.querySelector('.avatar-img');
        if (avatar) {
          avatar.src = 'https://api.dicebear.com/6.x/personas/svg?seed=groom';
        }
      });
    }
    
    // You can also update the negotiation score colors or other elements here
  }
});

// Navbar Interactions
document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navContainer = document.querySelector('.nav-container');
  
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
      this.classList.toggle('active');
      navContainer.classList.toggle('active');
    });
  }
  
  // Navbar scroll effect
  window.addEventListener('scroll', function() {
    const header = document.querySelector('.site-header');
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
  
  // Smooth scrolling for navbar links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Close mobile menu if open
      if (mobileMenuBtn && mobileMenuBtn.classList.contains('active')) {
        mobileMenuBtn.classList.remove('active');
        navContainer.classList.remove('active');
      }
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
});

// stories 
   // Store for all stories
   let stories = [];
   let currentFilter = 'all';

   // DOM elements
   const storyForm = document.getElementById('storyForm');
   const storyList = document.getElementById('storyList');
   const emptyState = document.getElementById('emptyState');
   const tabButtons = document.querySelectorAll('.tab-btn');

   // Sample pre-written stories
   const sampleStories = [
       // Funny Demand stories
       {
           id: 'sample1',
           title: "The Golden Toilet Saga",
           content: "My future in-laws insisted on a gold-plated toilet as part of the dowry. When I asked why, they said it was because their son 'deserves a royal experience'! We had a good laugh about it, and eventually they admitted they were just testing our sense of humor.",
           category: "funny",
           author: "Priya Sharma",
           date: new Date(2024, 3, 2).toISOString(),
           reactions: {
               like: 24,
               dislike: 2,
               wow: 15
           },
           userReaction: null
       },
       {
           id: 'sample2',
           title: "The Pizza Dowry",
           content: "My fiancé's family demanded that I bring 50 pizzas for everyone at the wedding as my 'special contribution'. They said it was a new tradition in their family! Turns out it was a joke because I'm a chef at a pizza restaurant. We ended up serving gourmet pizzas at our reception and everyone loved it!",
           category: "funny",
           author: "Anita Patel",
           date: new Date(2024, 2, 15).toISOString(),
           reactions: {
               like: 35,
               dislike: 0,
               wow: 7
           },
           userReaction: null
       },
       
       // Weird Demand stories
       {
           id: 'sample3',
           title: "The Exact Shoe Size",
           content: "My in-laws demanded that I bring exactly 21 pairs of shoes of specific sizes as dowry. Not 20, not 22, but exactly 21. When asked why, they said it was an 'auspicious number'. Later we found out that they wanted to distribute shoes to underprivileged children in their community, but were too embarrassed to admit their charitable intentions!",
           category: "weird",
           author: "Neha Gupta",
           date: new Date(2024, 1, 20).toISOString(),
           reactions: {
               like: 18,
               dislike: 3,
               wow: 42
           },
           userReaction: null
       },
       {
           id: 'sample4',
           title: "The Family Parrot",
           content: "The strangest dowry request I received was to bring my childhood pet parrot to my new home. Apparently, my mother-in-law believed that parrots bring good fortune. The weird part? Our parrot only speaks English, but my in-laws only speak Hindi! Now they're taking English classes to communicate with the bird!",
           category: "weird",
           author: "Ravi Malhotra",
           date: new Date(2024, 2, 5).toISOString(),
           reactions: {
               like: 27,
               dislike: 1,
               wow: 31
           },
           userReaction: null
       },
       
       // Success stories
       {
           id: 'sample5',
           title: "Education Over Gold",
           content: "When talks of marriage began, my now-husband's family suggested a traditional dowry. I was worried, but my husband intervened and said he only wanted one thing - that I complete my PhD which I had put on hold. His family fully supported this and even helped fund my education. Today, I'm a professor and we celebrate 5 happy years of marriage!",
           category: "success",
           author: "Dr. Meera Krishnan",
           date: new Date(2024, 0, 10).toISOString(),
           reactions: {
               like: 86,
               dislike: 0,
               wow: 23
           },
           userReaction: null
       },
       {
           id: 'sample6',
           title: "Planting A Future Together",
           content: "Instead of traditional dowry, my husband's family requested that we plant 100 trees in their village. We made it a pre-wedding ceremony where both families came together to plant trees. The village now has a small forest called 'Love Grove' and we visit every anniversary to plant more trees. It's become a tradition for others in the village too!",
           category: "success",
           author: "Amit and Sunita Verma",
           date: new Date(2024, 2, 28).toISOString(),
           reactions: {
               like: 105,
               dislike: 0,
               wow: 47
           },
           userReaction: null
       },
       {
           id: 'sample7',
           title: "The Joint Business Venture",
           content: "My in-laws suggested that instead of spending money on dowry, we should invest in a small business together. Our families pooled resources to start a handicraft store that employs local artisans. Three years later, our business supports 15 families and has become a popular tourist spot. The best dowry was this partnership that brought our families closer!",
           category: "success",
           author: "Kavita Singh",
           date: new Date(2024, 3, 1).toISOString(),
           reactions: {
               like: 67,
               dislike: 1,
               wow: 32
           },
           userReaction: null
       }
   ];

   // Load stories from local storage or use sample stories if none exist
   function loadStories() {
       const storedStories = localStorage.getItem('dahejStories');
       if (storedStories) {
           stories = JSON.parse(storedStories);
       } else {
           // Use sample stories if no stories exist in local storage
           stories = sampleStories;
           saveStories(); // Save the sample stories to local storage
       }
       updateStoriesDisplay();
   }

   // Save stories to local storage
   function saveStories() {
       localStorage.setItem('dahejStories', JSON.stringify(stories));
   }

   // Generate a unique ID for stories
   function generateId() {
       return '_' + Math.random().toString(36).substr(2, 9);
   }

   // Add a new story
   function addStory(title, content, category, author) {
       const newStory = {
           id: generateId(),
           title,
           content,
           category,
           author: author || 'Anonymous',
           date: new Date().toISOString(),
           reactions: {
               like: 0,
               dislike: 0,
               wow: 0
           },
           userReaction: null
       };

       stories.unshift(newStory); // Add to the beginning
       saveStories();
       updateStoriesDisplay();
   }

   // Update the stories display based on current filter
   function updateStoriesDisplay() {
       // Clear the list except for the empty state
       const storyItems = storyList.querySelectorAll('.story-card');
       storyItems.forEach(item => item.remove());

       // Filter stories based on current selection
       const filteredStories = currentFilter === 'all' 
           ? stories 
           : stories.filter(story => story.category === currentFilter);

       // Show or hide empty state
       if (filteredStories.length === 0) {
           emptyState.style.display = 'block';
       } else {
           emptyState.style.display = 'none';

           // Create and append story elements
           filteredStories.forEach(story => {
               const storyElement = createStoryElement(story);
               storyList.appendChild(storyElement);
           });
       }
   }

   // Create a story card element
   function createStoryElement(story) {
       const storyCard = document.createElement('li');
       storyCard.className = `story-card ${story.category}`;
       
       // Format date
       const storyDate = new Date(story.date);
       const formattedDate = `${storyDate.toLocaleDateString()} at ${storyDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;

       // Category label text
       const categoryLabels = {
           'funny': 'Funny Demand',
           'weird': 'Weird Demand',
           'success': 'Success Story'
       };

       storyCard.innerHTML = `
           <span class="story-tag ${story.category}">${categoryLabels[story.category]}</span>
           <h3 class="story-title">${story.title}</h3>
           <p class="story-content">${story.content}</p>
           <p class="story-author">Shared by ${story.author} • ${formattedDate}</p>
           <div class="reaction-buttons">
               <button class="reaction-btn ${story.userReaction === 'like' ? 'active' : ''}" data-reaction="like" data-story-id="${story.id}">
                   👍 <span class="reaction-count">${story.reactions.like}</span>
               </button>
               <button class="reaction-btn ${story.userReaction === 'dislike' ? 'active' : ''}" data-reaction="dislike" data-story-id="${story.id}">
                   👎 <span class="reaction-count">${story.reactions.dislike}</span>
               </button>
               <button class="reaction-btn ${story.userReaction === 'wow' ? 'active' : ''}" data-reaction="wow" data-story-id="${story.id}">
                   😮 <span class="reaction-count">${story.reactions.wow}</span>
               </button>
           </div>
       `;

       // Add event listeners to reaction buttons
       const reactionButtons = storyCard.querySelectorAll('.reaction-btn');
       reactionButtons.forEach(button => {
           button.addEventListener('click', handleReaction);
       });

       return storyCard;
   }

   // Handle reactions
   function handleReaction(event) {
       const button = event.currentTarget;
       const reaction = button.dataset.reaction;
       const storyId = button.dataset.storyId;
       
       const story = stories.find(s => s.id === storyId);
       if (!story) return;

       // If user already reacted the same way, remove the reaction
       if (story.userReaction === reaction) {
           story.reactions[reaction]--;
           story.userReaction = null;
       } 
       // If user reacted differently before, update both reactions
       else if (story.userReaction) {
           story.reactions[story.userReaction]--;
           story.reactions[reaction]++;
           story.userReaction = reaction;
       } 
       // If first time reacting
       else {
           story.reactions[reaction]++;
           story.userReaction = reaction;
       }

       saveStories();
       updateStoriesDisplay();
   }

   // Handle form submission
   storyForm.addEventListener('submit', function(e) {
       e.preventDefault();
       
       const title = document.getElementById('storyTitle').value.trim();
       const content = document.getElementById('storyContent').value.trim();
       const category = document.getElementById('storyCategory').value;
       const author = document.getElementById('authorName').value.trim();
       
       if (!title || !content || !category) {
           alert('Please fill all required fields.');
           return;
       }
       
       addStory(title, content, category, author);
       
       // Reset form
       storyForm.reset();
   });

   // Handle tab clicks
   tabButtons.forEach(button => {
       button.addEventListener('click', function() {
           // Update active state
           tabButtons.forEach(btn => btn.classList.remove('active'));
           this.classList.add('active');
           
           // Update filter
           currentFilter = this.dataset.category;
           
           // Update display
           updateStoriesDisplay();
       });
   });

   // Initialize the application
   document.addEventListener('DOMContentLoaded', function() {
       loadStories();
   });


//face analyzer
// DOM Elements
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const captureBtn = document.getElementById('captureBtn');
const uploadBtn = document.getElementById('uploadBtn');
const fileInput = document.getElementById('fileInput');
const errorMessage = document.getElementById('errorMessage');
const loading = document.getElementById('loading');
const results = document.getElementById('results');
const dowryAmount = document.getElementById('dowryAmount');
const metricsContainer = document.getElementById('metricsContainer');
const resetBtn = document.getElementById('resetBtn');

// Global variables
let model;
let streaming = false;
let currentImage;
let lastAnalysis = null; // Store the last analysis for comparison
let analyzedFaces = []; // History of analyzed faces
let cameraStream = null;

// Configuration options
const CONFIG = {
  minDetectionConfidence: 0.8,
  maxDetectionAge: 100, // milliseconds
  modelOptions: {
    maxFaces: 1,
    returnTensors: false,
    predictIrises: true
  },
  animationDuration: 1500, // ms for the counting animation
  baseAmount: 1000000, // Base dowry amount
  scoreMultiplier: 3.5, // Increased multiplier for more dramatic results
  enableDebug: false, // Set to true to see debug information
  autoCapture: false, // Set to true to automatically capture when a face is detected
  autoCaptureConfidence: 0.9, // Confidence level needed for auto capture
  autoCaptureDelay: 3000, // Wait time before auto capture in ms
  enhancedAnalysis: true, // Enable advanced facial metrics
  saveFaceHistory: true // Save history of analyzed faces
};

// Debugging utilities
const debug = {
  log: function(message) {
    if (CONFIG.enableDebug) {
      console.log(`[Dowry AI] ${message}`);
    }
  },
  error: function(message, error) {
    if (CONFIG.enableDebug) {
      console.error(`[Dowry AI Error] ${message}`, error);
    }
  },
  face: function(face) {
    if (CONFIG.enableDebug && face) {
      console.log('[Dowry AI] Face detected:', face);
    }
  }
};

// Load the BlazeFace model with improved error handling
async function loadModel() {
  try {
    debug.log('Loading BlazeFace model...');
    loading.style.display = 'block';
    model = await blazeface.load(CONFIG.modelOptions);
    loading.style.display = 'none';
    debug.log('BlazeFace model loaded successfully');
    return true;
  } catch (error) {
    loading.style.display = 'none';
    showError('Failed to load face detection model. Please check your internet connection and refresh.');
    debug.error('Error loading model:', error);
    return false;
  }
}

// Initialize the application with better error handling
async function init() {
  debug.log('Initializing application...');
  
  try {
    // Add event listeners
    startBtn.addEventListener('click', toggleCamera);
    captureBtn.addEventListener('click', captureFace);
    uploadBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileUpload);
    resetBtn.addEventListener('click', resetAnalysis);
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Add resize listener for responsive canvas
    window.addEventListener('resize', adjustCanvasForScreenSize);
    
    // Load model in background
    setTimeout(() => {
      loadModel();
    }, 100);
    
    debug.log('Application initialized successfully');
  } catch (error) {
    debug.error('Error during initialization:', error);
    showError('Failed to initialize application. Please refresh the page.');
  }
}

// Handle keyboard shortcuts
function handleKeyboardShortcuts(e) {
  if (e.key === 'c' && streaming && !captureBtn.disabled) {
    captureFace(); // Capture with 'c' key
  } else if (e.key === 's') {
    toggleCamera(); // Start/stop camera with 's' key
  } else if (e.key === 'u') {
    fileInput.click(); // Upload with 'u' key
  } else if (e.key === 'r' && results.style.display === 'block') {
    resetAnalysis(); // Reset with 'r' key
  }
}

// Adjust canvas for screen size
function adjustCanvasForScreenSize() {
  if (streaming && video.videoWidth) {
    const aspectRatio = video.videoWidth / video.videoHeight;
    const maxWidth = Math.min(500, window.innerWidth - 40);
    canvas.width = maxWidth;
    canvas.height = maxWidth / aspectRatio;
  }
}

// Improved camera toggle with device selection
async function toggleCamera() {
  if (streaming) {
    stopCamera();
    startBtn.textContent = 'Start Camera';
    captureBtn.disabled = true;
    return;
  }
  
  try {
    // Try to access the user's camera
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    
    if (videoDevices.length === 0) {
      throw new Error('No camera detected');
    }
    
    // Use front camera if available (for mobile devices)
    const frontCamera = videoDevices.find(device => 
      device.label.toLowerCase().includes('front') ||
      device.label.toLowerCase().includes('user')
    );
    
    const constraints = {
      video: frontCamera 
        ? { deviceId: { exact: frontCamera.deviceId } }
        : { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
    };
    
    cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = cameraStream;
    
    video.onloadedmetadata = () => {
      video.play();
      streaming = true;
      startBtn.textContent = 'Stop Camera';
      captureBtn.disabled = false;
      
      // Adjust canvas size
      adjustCanvasForScreenSize();
      
      // Start face detection loop
      detectFaces();
      
      // Set up auto-capture if enabled
      if (CONFIG.autoCapture) {
        setupAutoCapture();
      }
    };
    
  } catch (error) {
    showError('Unable to access camera. Please ensure you have given camera permissions.');
    debug.error('Error accessing camera:', error);
  }
}

// Auto-capture setup
let autoCaptureTimeout = null;
function setupAutoCapture() {
  let faceDetectedCount = 0;
  let lastDetectionTime = 0;
  
  const checkFaceStability = async () => {
    if (!streaming) return;
    
    try {
      const predictions = await model.estimateFaces(video, false);
      const now = Date.now();
      
      if (predictions.length === 1 && 
          predictions[0].probability[0] > CONFIG.autoCaptureConfidence) {
        
        faceDetectedCount++;
        
        // If face has been stable for several frames
        if (faceDetectedCount > 15) {
          clearTimeout(autoCaptureTimeout);
          autoCaptureTimeout = setTimeout(() => {
            if (streaming) {
              debug.log('Auto-capturing face...');
              captureFace();
            }
          }, CONFIG.autoCaptureDelay);
        }
      } else {
        faceDetectedCount = 0;
        clearTimeout(autoCaptureTimeout);
      }
      
      lastDetectionTime = now;
      
      if (streaming) {
        setTimeout(checkFaceStability, 200);
      }
    } catch (error) {
      debug.error('Error in auto-capture:', error);
      if (streaming) {
        setTimeout(checkFaceStability, 500);
      }
    }
  };
  
  checkFaceStability();
}

// Stop the camera with resource cleanup
function stopCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
  }
  
  if (video.srcObject) {
    video.srcObject = null;
  }
  
  // Clear timeouts
  clearTimeout(autoCaptureTimeout);
  
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  streaming = false;
}

// Advanced face detection with landmarks
async function detectFaces() {
  if (!streaming || !model) return;
  
  try {
    const predictions = await model.estimateFaces(video, false);
    
    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (predictions.length > 0) {
      // Draw boxes around detected faces with enhanced visualization
      predictions.forEach(prediction => {
        const start = prediction.topLeft;
        const end = prediction.bottomRight;
        const size = [end[0] - start[0], end[1] - start[1]];
        const confidence = prediction.probability[0].toFixed(2);
        
        // Draw face box with rounded corners
        ctx.strokeStyle = '#9b87f5';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(start[0], start[1], size[0], size[1], 10);
        ctx.stroke();
        
        // Draw confidence score
        ctx.fillStyle = 'rgba(155, 135, 245, 0.7)';
        ctx.fillRect(start[0], start[1] - 20, 70, 20);
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.fillText(`Conf: ${confidence}`, start[0] + 5, start[1] - 5);
        
        // Draw facial landmarks if available
        if (prediction.landmarks) {
          prediction.landmarks.forEach(landmark => {
            ctx.fillStyle = '#4ade80';
            ctx.beginPath();
            ctx.arc(landmark[0], landmark[1], 2, 0, 2 * Math.PI);
            ctx.fill();
          });
        }
      });
    }
    
    // Continue detection loop with adaptive frame rate
    const nextFrameDelay = predictions.length > 0 ? 10 : 100;
    setTimeout(() => requestAnimationFrame(detectFaces), nextFrameDelay);
    
  } catch (error) {
    debug.error('Error in face detection:', error);
    setTimeout(() => requestAnimationFrame(detectFaces), 500); // Continue despite error, with delay
  }
}

// Enhanced face capture with snapshot effect
async function captureFace() {
  if (!streaming || !model) return;
  
  try {
    // Snapshot effect
    const flashOverlay = document.createElement('div');
    flashOverlay.style.position = 'absolute';
    flashOverlay.style.top = '0';
    flashOverlay.style.left = '0';
    flashOverlay.style.width = '100%';
    flashOverlay.style.height = '100%';
    flashOverlay.style.backgroundColor = 'white';
    flashOverlay.style.opacity = '0.7';
    flashOverlay.style.transition = 'opacity 0.5s';
    flashOverlay.style.pointerEvents = 'none';
    document.querySelector('.camera-container').appendChild(flashOverlay);
    
    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Play camera shutter sound
    const shutterSound = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU3LjU2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAkJCQkJCQkJCQkJCQkJCQwMDAwMDAwMDAwMDAwMDAwMDQ0NDQ0NDQ0NDQ0NDQ0NDQ0P////////////////////////////////8AAAAATGF2YzU3LjY0AAAAAAAAAAAAAAAAJAYHf/7jKAAAAAAAAAAAAAAAAAAAAP/jiMQAC0gAAAAAggoFBQUEBAMDTLIi/+MoxAwEEgKIAKkQZDLMHIJi4DXQG5fOBRGMHwOsTDkc4CD4OAgQY7J/4EHwcBAYiAP/BP/gg+BAYiDgIEHwcBAYiD4OCD4/4IEHwfBB8HwfBAg+D4IEHwIECBAg+CBB8HwQIPggMRBwEBiIOAgQfAgQIPggQfB/y5//3IEHwfB8EBiIECD4IEHwfAgQfBAYiDgIECDgMRAgQIPBwGIgQIPp//XHggQIPggMRBwECD4IEHwfBAg+CBIR/////8Z//+MYxBsL2P6ILwmYAP/xjGMYxgGAgwEGAYCCHggQIEHwQIPggMRBwECBAg/BAg+CBAg+CAwkHAQIEHAYiBAg+DgMRAgQQYCDAYCCBAg+CBB8EBiIAgQIECD4IEHwQIPBwGIgQIPggQfBAYiBAg+CBB8HwQGAgwGAgQIPggQfB8EBiIECD4IECCBggwGAgQIEEGAhEECD4IEHwQGIgQIPggQfBAgQQIPggMRAgQfBAg4DEQIPggMRAg+D4IEHwQIPBw/DgQ//2Q==');
    shutterSound.volume = 0.3;
    shutterSound.play().catch(() => {}); // Ignore autoplay restrictions
    
    // Get image data for analysis and store it
    currentImage = canvas.toDataURL('image/png');
    
    // Fade out flash effect
    setTimeout(() => {
      flashOverlay.style.opacity = '0';
      setTimeout(() => {
        flashOverlay.remove();
      }, 500);
    }, 100);
    
    // Process the captured image
    processImage(canvas);
    
  } catch (error) {
    showError('An error occurred during capture. Please try again.');
    debug.error('Error capturing face:', error);
  }
}

// Improved file upload handling with validation and preview
function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
  if (!validTypes.includes(file.type)) {
    showError('Please upload an image file (JPEG, PNG, WEBP)');
    return;
  }
  
  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    showError('Image is too large. Please upload an image smaller than 10MB.');
    return;
  }
  
  // Stop camera if it's active
  if (streaming) {
    stopCamera();
    startBtn.textContent = 'Start Camera';
    captureBtn.disabled = true;
  }
  
  // Show loading indicator
  loading.style.display = 'block';
  
  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      // Resize canvas to match image dimensions with max width/height constraints
      const maxDimension = 800;
      let width = img.width;
      let height = img.height;
      
      if (width > height && width > maxDimension) {
        height = (height * maxDimension) / width;
        width = maxDimension;
      } else if (height > maxDimension) {
        width = (width * maxDimension) / height;
        height = maxDimension;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw the image on the canvas with high quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, width, height);
      
      // Store the image for potential download
      currentImage = canvas.toDataURL('image/png');
      
      // Process the uploaded image
      processImage(canvas);
    };
    
    img.onerror = () => {
      loading.style.display = 'none';
      showError('Failed to load image. The file may be corrupted.');
    };
    
    img.src = event.target.result;
  };
  
  reader.onerror = () => {
    loading.style.display = 'none';
    showError('Failed to read the image file.');
  };
  
  reader.readAsDataURL(file);
}

// Enhanced image processing with improved error handling
async function processImage(imageElement) {
  if (!model) {
    await loadModel();
    if (!model) {
      showError('Face detection model not loaded. Please refresh and try again.');
      return;
    }
  }
  
  try {
    loading.style.display = 'block';
    hideError();
    results.style.display = 'none';
    
    // Detect faces in the image with retries
    let predictions = null;
    let retries = 3;
    
    while (retries > 0 && !predictions) {
      try {
        predictions = await model.estimateFaces(imageElement, false);
        break;
      } catch (error) {
        retries--;
        if (retries === 0) throw error;
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
    
    if (!predictions || predictions.length === 0) {
      loading.style.display = 'none';
      showError('No face detected. Please ensure your face is clearly visible and well-lit.');
      return;
    }
    
    if (predictions.length > 1) {
      loading.style.display = 'none';
      showError('Multiple faces detected. Please ensure only one person is in the frame.');
      return;
    }
    
    // Enhanced analytics with progress indication
    const steps = ['Analyzing facial structure...', 'Calculating facial symmetry...', 'Estimating genetic markers...', 'Projecting career trajectory...', 'Finalizing dowry valuation...'];
    const progressElement = document.createElement('div');
    progressElement.className = 'progress-text';
    progressElement.style.textAlign = 'center';
    progressElement.style.marginTop = '10px';
    loading.appendChild(progressElement);
    
    // Process each step with delay for realistic feel
    for (let i = 0; i < steps.length; i++) {
      progressElement.textContent = steps[i];
      await new Promise(resolve => setTimeout(resolve, 600));
    }
    
    // Simulate gender detection (with 70% chance of being male for demo purposes)
    const isMale = Math.random() < 0.7;
    
    if (!isMale) {
      loading.style.display = 'none';
      showError('Only male faces are supported for dowry estimation. Please try again with a male face.');
      return;
    }
    
    // Advanced face analysis
    const analysisResults = analyzeFace(predictions[0]);
    
    // Store this analysis if history is enabled
    if (CONFIG.saveFaceHistory) {
      analyzedFaces.push({
        timestamp: new Date(),
        image: currentImage,
        results: analysisResults
      });
      
      // Limit history to last 5 analyses
      if (analyzedFaces.length > 5) {
        analyzedFaces.shift();
      }
    }
    
    // Save last analysis for comparison
    lastAnalysis = analysisResults;
    
    // Display results with animation
    displayResults(analysisResults);
    
    // Hide loading indicator
    loading.style.display = 'none';
    
  } catch (error) {
    loading.style.display = 'none';
    showError('An error occurred during analysis. Please try again.');
    debug.error('Error analyzing face:', error);
  }
}

// Advanced facial analysis with enhanced metrics
function analyzeFace(prediction) {
  debug.face(prediction);
  
  // Extract face dimensions and landmarks
  const faceWidth = prediction.bottomRight[0] - prediction.topLeft[0];
  const faceHeight = prediction.bottomRight[1] - prediction.topLeft[1];
  const faceAspectRatio = faceWidth / faceHeight;
  
  // Get landmarks if available
  const landmarks = prediction.landmarks || [];
  
  // Generate random scores for various fake "metrics" with some consistency
  const facialSymmetryScore = randomScore(60, 98, 0.8);
  const jawlineStrengthScore = randomScore(50, 99, 0.7);
  const eyeAlignmentScore = randomScore(70, 95, 0.85);
  const foreheadProportionScore = randomScore(65, 90, 0.9);
  const noseStructureScore = randomScore(55, 100, 0.75);
  const educationGuessScore = randomScore(60, 95, 0.8);
  const careerPotentialScore = randomScore(70, 98, 0.85);
  
  // Add enhanced metrics if enabled
  let enhancedMetrics = {};
  if (CONFIG.enhancedAnalysis) {
    enhancedMetrics = {
      geneticFitness: {
        score: randomScore(65, 97, 0.8),
        description: "Estimated genetic compatibility and health indicators",
        value: 0 // Will be calculated later
      },
      socialStatusProjection: {
        score: randomScore(55, 99, 0.75),
        description: "Projected social standing based on facial features",
        value: 0
      },
      leadershipPotential: {
        score: randomScore(60, 96, 0.85),
        description: "Leadership qualities determined by facial structure",
        value: 0
      }
    };
  }
  
  // Calculate overall score (weighted average) with more complex formula
  const baseMetrics = {
    facialSymmetry: facialSymmetryScore * 0.15,
    jawlineStrength: jawlineStrengthScore * 0.1,
    eyeAlignment: eyeAlignmentScore * 0.1,
    foreheadProportion: foreheadProportionScore * 0.1,
    noseStructure: noseStructureScore * 0.15,
    educationGuess: educationGuessScore * 0.2,
    careerPotential: careerPotentialScore * 0.2
  };
  
  let weightSum = Object.values(baseMetrics).reduce((sum, val) => sum + val, 0);
  let overallRating = Math.round(weightSum);
  
  if (CONFIG.enhancedAnalysis) {
    // Add enhanced metrics to overall calculation
    const enhancedWeight = 0.1; // Each enhanced metric gets 10% weight
    const enhancedSum = Object.keys(enhancedMetrics).reduce((sum, key) => {
      return sum + (enhancedMetrics[key].score * enhancedWeight);
    }, 0);
    
    // Adjust overall rating with enhanced metrics
    overallRating = Math.round(overallRating * (1 - (Object.keys(enhancedMetrics).length * enhancedWeight)) + enhancedSum);
  }
  
  // Calculate mock dowry amount with exponential scaling for higher scores
  const baseAmount = CONFIG.baseAmount;
  const scoreMultiplier = CONFIG.scoreMultiplier * Math.pow(overallRating / 50, 1.5);
  const totalAmount = Math.round(baseAmount * scoreMultiplier / 10000) * 10000;
  
  // Calculate values for each metric based on overall amount
  const metrics = {
    facialSymmetry: {
      score: facialSymmetryScore,
      description: "Facial symmetry indicates genetic health and attractiveness",
      value: Math.round(totalAmount * 0.15)
    },
    jawlineStrength: {
      score: jawlineStrengthScore,
      description: "Strong jawline suggests masculinity and strength",
      value: Math.round(totalAmount * 0.1)
    },
    eyeAlignment: {
      score: eyeAlignmentScore,
      description: "Well-aligned eyes indicate focus and attention to detail",
      value: Math.round(totalAmount * 0.1)
    },
    foreheadProportion: {
      score: foreheadProportionScore,
      description: "Forehead proportion suggests intellectual capacity",
      value: Math.round(totalAmount * 0.1)
    },
    noseStructure: {
      score: noseStructureScore,
      description: "Nose structure indicates character and heritage",
      value: Math.round(totalAmount * 0.15)
    },
    educationGuess: {
      score: educationGuessScore,
      description: "Estimated education level based on facial features",
      value: Math.round(totalAmount * 0.2)
    },
    careerPotential: {
      score: careerPotentialScore,
      description: "Projected career success based on appearance",
      value: Math.round(totalAmount * 0.2)
    }
  };
  
  // Add enhanced metrics if enabled
  if (CONFIG.enhancedAnalysis) {
    Object.keys(enhancedMetrics).forEach(key => {
      enhancedMetrics[key].value = Math.round(totalAmount * 0.1);
      metrics[key] = enhancedMetrics[key];
    });
  }
  
  return {
    totalAmount,
    metrics,
    overallRating,
    faceProperties: {
      width: faceWidth,
      height: faceHeight,
      aspectRatio: faceAspectRatio,
      confidence: prediction.probability[0]
    }
  };
}

// Enhanced results display with animations and comparisons
function displayResults(result) {
  // Format the dowry amount with currency formatting and animation
  const formattedAmount = '₹' + result.totalAmount.toLocaleString();
  animateCounter(dowryAmount, formattedAmount);
  
  // Clear previous metrics
  metricsContainer.innerHTML = '';
  
  // Add comparison with previous analysis if available
  if (lastAnalysis && lastAnalysis !== result && analyzedFaces.length > 1) {
    const comparisonDiv = document.createElement('div');
    comparisonDiv.className = 'comparison-info';
    comparisonDiv.innerHTML = `
      <h3>Comparison with Previous Analysis</h3>
      <p>Previous value: ₹${lastAnalysis.totalAmount.toLocaleString()}</p>
      <p>Difference: ${result.totalAmount > lastAnalysis.totalAmount ? '+' : ''}₹${(result.totalAmount - lastAnalysis.totalAmount).toLocaleString()}</p>
    `;
    metricsContainer.appendChild(comparisonDiv);
  }
  
  // Add each metric as a card with animated progress bars
  for (const [key, metric] of Object.entries(result.metrics)) {
    const metricCard = document.createElement('div');
    metricCard.className = 'metric-card';
    metricCard.setAttribute('data-metric', key);
    
    const title = formatTitle(key);
    const scoreEmoji = getScoreEmoji(metric.score);
    
    metricCard.innerHTML = `
      <div class="metric-title">
        <span>${title} ${scoreEmoji}</span>
        <span class="metric-score">${metric.score}/100</span>
      </div>
      <div class="metric-description">${metric.description}</div>
      <div class="progress-container">
        <div class="progress-bar" style="width: 0%;"></div>
      </div>
      <div class="metric-value">₹${metric.value.toLocaleString()}</div>
    `;
    
    metricsContainer.appendChild(metricCard);
    
    // Animate progress bars with delay
    setTimeout(() => {
      const progressBar = metricCard.querySelector('.progress-bar');
      progressBar.style.transition = 'width 1s ease-out';
      progressBar.style.width = `${metric.score}%`;
    }, 100 * Object.keys(result.metrics).indexOf(key));
  }
  
// Add share and download buttons
const actionButtons = document.createElement('div');
actionButtons.className = 'action-buttons';
actionButtons.innerHTML = `
  <button id="shareBtn" class="action-button share-btn" title="Share Results">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="18" cy="5" r="3"></circle>
      <circle cx="6" cy="12" r="3"></circle>
      <circle cx="18" cy="19" r="3"></circle>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
    </svg>
  </button>
  <button id="downloadBtn" class="action-button download-btn">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
    Download Image
  </button>
`;
  
  metricsContainer.appendChild(actionButtons);
  
  // Add event listeners for share and download
  document.getElementById('shareBtn').addEventListener('click', () => shareResults(result));
  document.getElementById('downloadBtn').addEventListener('click', () => downloadResultImage(result));
  
  // Show the results container with animation
  results.style.display = 'block';
  results.style.opacity = '0';
  results.style.transform = 'translateY(20px)';
  
  setTimeout(() => {
    results.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
    results.style.opacity = '1';
    results.style.transform = 'translateY(0)';
  }, 100);
  
  // Scroll to results with smooth animation
  results.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Animated counter effect for dowry amount
function animateCounter(element, targetValue) {
  // Extract the numeric part and format
  const targetNumber = parseInt(targetValue.replace(/[^0-9]/g, ''));
  const prefix = targetValue.replace(/[0-9,]/g, '');
  
  // Start from a lower value (about 20% of target)
  let currentNumber = Math.round(targetNumber * 0.2);
  const duration = CONFIG.animationDuration;
  const frameRate = 30;
  const increment = (targetNumber - currentNumber) / (duration / 1000 * frameRate);
  
  // Clear any existing content and set initial value
  element.textContent = prefix + currentNumber.toLocaleString();
  
  // Start animation
  const interval = setInterval(() => {
    currentNumber += increment;
    
    // Ensure we don't exceed the target
    if (currentNumber >= targetNumber) {
      currentNumber = targetNumber;
      clearInterval(interval);
    }
    
    // Update the display
    element.textContent = prefix + Math.round(currentNumber).toLocaleString();
  }, 1000 / frameRate);
}

// Share results on social media
function shareResults(result) {
  // Create share text
  const shareText = `I just calculated my dowry value with Dowry AI: ₹${result.totalAmount.toLocaleString()}! Try it yourself!`;
  
  // Try to use Web Share API if available
  if (navigator.share) {
    navigator.share({
      title: 'My Dowry AI Results',
      text: shareText,
      url: window.location.href
    }).catch(err => {
      console.error('Error sharing:', err);
      // Fallback - copy to clipboard
      copyToClipboard(shareText);
      showError('Link copied to clipboard');
    });
  } else {
    // Fallback - copy to clipboard
    copyToClipboard(shareText);
    showError('Link copied to clipboard');
  }
}

// Helper function to copy text to clipboard
function copyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

// Download result as an image
function downloadResultImage(result) {
  if (!currentImage) return;
  
  // Create a new canvas for the combined image
  const resultCanvas = document.createElement('canvas');
  const resultCtx = resultCanvas.getContext('2d');
  
  // Load the face image
  const img = new Image();
  img.onload = () => {
    // Set canvas size
    resultCanvas.width = 800;
    resultCanvas.height = 600;
    
    // Fill background
    resultCtx.fillStyle = '#1A1F2C';
    resultCtx.fillRect(0, 0, resultCanvas.width, resultCanvas.height);
    
    // Add title
    resultCtx.fillStyle = '#9b87f5';
    resultCtx.font = 'bold 24px Arial';
    resultCtx.textAlign = 'center';
    resultCtx.fillText('Dowry AI Analysis Results', resultCanvas.width / 2, 40);
    
    // Draw original image
    const imgWidth = 300;
    const imgHeight = (img.height * imgWidth) / img.width;
    resultCtx.drawImage(img, 50, 70, imgWidth, imgHeight);
    
    // Add dowry amount
    resultCtx.fillStyle = '#ffffff';
    resultCtx.font = 'bold 28px Arial';
    resultCtx.textAlign = 'center';
    resultCtx.fillText(`Estimated Dowry: ₹${result.totalAmount.toLocaleString()}`, resultCanvas.width / 2, 50 + imgHeight + 50);
    
    // Add metrics
    resultCtx.font = '16px Arial';
    resultCtx.textAlign = 'left';
    let yPos = 50 + imgHeight + 90;
    
    Object.entries(result.metrics).slice(0, 4).forEach(([key, metric]) => {
      const title = formatTitle(key);
      resultCtx.fillStyle = '#9b87f5';
      resultCtx.fillText(`${title}: ${metric.score}/100`, 400, yPos);
      
      // Draw progress bar
      resultCtx.fillStyle = 'rgba(255,255,255,0.2)';
      resultCtx.fillRect(400, yPos + 10, 300, 10);
      resultCtx.fillStyle = '#9b87f5';
      resultCtx.fillRect(400, yPos + 10, 300 * (metric.score / 100), 10);
      
      yPos += 40;
    });
    
    // Add disclaimer
    resultCtx.fillStyle = 'rgba(255,255,255,0.6)';
    resultCtx.font = '12px Arial';
    resultCtx.textAlign = 'center';
    resultCtx.fillText('This is a satirical application and should not be taken seriously.', resultCanvas.width / 2, resultCanvas.height - 20);
    
    // Convert canvas to image and trigger download
    resultCanvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'dowry-ai-result.png';
      a.click();
      URL.revokeObjectURL(url);
    });
  };
  img.src = currentImage;
}

// Get appropriate emoji based on score
function getScoreEmoji(score) {
  if (score >= 90) return '🔥';
  if (score >= 80) return '✨';
  if (score >= 70) return '👍';
  if (score >= 50) return '😐';
  return '👎';
}

// Generate a random score within a range with consistency factor
function randomScore(min, max, consistencyFactor = 0.5) {
  // Generate a completely random score
  const randomValue = Math.floor(Math.random() * (max - min + 1)) + min;
  
  // If we have a previous analysis, use it for consistency
  if (lastAnalysis && consistencyFactor > 0) {
    const metrics = lastAnalysis.metrics;
    // Look for similar metrics in previous analysis for consistency
    const previousScores = Object.values(metrics).map(m => m.score);
    if (previousScores.length > 0) {
      // Calculate average of previous scores
      const avgPreviousScore = previousScores.reduce((sum, s) => sum + s, 0) / previousScores.length;
      // Mix random value with average of previous scores based on consistency factor
      return Math.round(randomValue * (1 - consistencyFactor) + avgPreviousScore * consistencyFactor);
    }
  }
  
  return randomValue;
}

// Helper function to format metric keys as readable titles
function formatTitle(key) {
  return key
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
}

// Reset analysis to start again
function resetAnalysis() {
  results.style.display = 'none';
  fileInput.value = ''; // Clear file input
}

// Show error message with auto-hide
function showError(message, duration = 5000) {
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
  
  // Make it fade in
  errorMessage.style.opacity = '0';
  setTimeout(() => {
    errorMessage.style.transition = 'opacity 0.3s ease';
    errorMessage.style.opacity = '1';
  }, 10);
  
  // Auto-hide after duration
  setTimeout(() => {
    errorMessage.style.opacity = '0';
    setTimeout(() => {
      errorMessage.style.display = 'none';
    }, 300);
  }, duration);
}

// Hide error message
function hideError() {
  errorMessage.style.display = 'none';
}

// Initialize the application when the page loads
window.addEventListener('DOMContentLoaded', init);

// Add support for PointerEvent if available (better for mobile)
if (window.PointerEvent) {
  document.body.style.touchAction = 'none';
}

// Add custom polyfill for roundRect if not supported
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
    if (typeof radius === 'number') {
      radius = {tl: radius, tr: radius, br: radius, bl: radius};
    } else {
      radius = {...{tl: 0, tr: 0, br: 0, bl: 0}, ...radius};
    }
    this.beginPath();
    this.moveTo(x + radius.tl, y);
    this.lineTo(x + width - radius.tr, y);
    this.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    this.lineTo(x + width, y + height - radius.br);
    this.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    this.lineTo(x + radius.bl, y + height);
    this.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    this.lineTo(x, y + radius.tl);
    this.quadraticCurveTo(x, y, x + radius.tl, y);
    this.closePath();
  };
}
// Reset analysis to start again
function resetAnalysis() {
  results.style.display = 'none';
  fileInput.value = ''; // Clear file input
  
  // Scroll to the top of the face analyzer section
  const faceAnalyzerSection = document.getElementById('face-analyzer');
  if (faceAnalyzerSection) {
    faceAnalyzerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Add this function to your existing script.js file
function initNeonCursorEffect() {
  const taglines = document.querySelectorAll('.tagline-text');
  
  taglines.forEach(tagline => {
    tagline.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Update the position of the pseudo-element
      this.style.setProperty('--cursor-x', x + 'px');
      this.style.setProperty('--cursor-y', y + 'px');
    });
    
    // Reset cursor when leaving the element
    tagline.addEventListener('mouseleave', function() {
      this.style.cursor = 'default';
      setTimeout(() => {
        this.style.cursor = 'none';
      }, 50);
    });
  });
}

// Call this function when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Add this line to your existing DOMContentLoaded event handler
  // or create this handler if it doesn't exist
  initNeonCursorEffect();
});

// Smooth Scroll Up and Down Button for Mobile
function initScrollButtons() {
  // Create scroll buttons container
  const scrollButtonsContainer = document.createElement('div');
  scrollButtonsContainer.className = 'scroll-buttons-container';
  
  // Create scroll up button
  const scrollUpButton = document.createElement('button');
  scrollUpButton.className = 'scroll-button scroll-up-button';
  scrollUpButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
  scrollUpButton.setAttribute('aria-label', 'Scroll up');
  
  // Create scroll down button
  const scrollDownButton = document.createElement('button');
  scrollDownButton.className = 'scroll-button scroll-down-button';
  scrollDownButton.innerHTML = '<i class="fas fa-chevron-down"></i>';
  scrollDownButton.setAttribute('aria-label', 'Scroll down');
  
  // Create scroll indicator
  const scrollIndicator = document.createElement('div');
  scrollIndicator.className = 'scroll-indicator';
  scrollIndicator.innerHTML = '<div class="scroll-indicator-fill"></div>';
  
  // Add buttons and indicator to container
  scrollButtonsContainer.appendChild(scrollUpButton);
  scrollButtonsContainer.appendChild(scrollIndicator);
  scrollButtonsContainer.appendChild(scrollDownButton);
  
  // Add container to body
  document.body.appendChild(scrollButtonsContainer);
  
  // Scroll up button click event - scroll by viewport height
  scrollUpButton.addEventListener('click', function() {
      const scrollAmount = window.innerHeight * 0.8; // 80% of viewport height
      const targetPosition = Math.max(0, window.scrollY - scrollAmount);
      
      window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
      });
  });
  
  // Scroll down button click event - scroll by viewport height
  scrollDownButton.addEventListener('click', function() {
      const scrollAmount = window.innerHeight * 0.8; // 80% of viewport height
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const targetPosition = Math.min(maxScroll, window.scrollY + scrollAmount);
      
      window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
      });
  });
  
  // Show/hide buttons based on scroll position
  window.addEventListener('scroll', function() {
    const scrollY = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const quizSection = document.getElementById('quiz');
    
    if (!quizSection) return;
    
    // Get quiz section position
    const quizRect = quizSection.getBoundingClientRect();
    const quizTop = quizRect.top + window.scrollY;
    
    // Check if we're below or at the quiz section
    const isInValidSection = scrollY >= quizTop - 100;
    
    // Update scroll indicator
    const scrollPercentage = (scrollY / (maxScroll)) * 100;
    const indicatorFill = scrollButtonsContainer.querySelector('.scroll-indicator-fill');
    indicatorFill.style.height = `${Math.min(100, scrollPercentage)}%`;
    
    // Show container only when in valid section on mobile
    if (window.innerWidth <= 768) {
        if (isInValidSection) {
            scrollButtonsContainer.classList.add('active');
            
            // Show scroll up button when not at the top
            if (scrollY > 100) {
                scrollUpButton.classList.add('visible');
            } else {
                scrollUpButton.classList.remove('visible');
            }
            
            // Show scroll down button when not at the bottom
            if (scrollY < maxScroll - 100) {
                scrollDownButton.classList.add('visible');
            } else {
                scrollDownButton.classList.remove('visible');
            }
        } else {
            scrollButtonsContainer.classList.remove('active');
        }
    } else {
        scrollButtonsContainer.classList.remove('active');
    }
});

// Check on load and resize
function checkVisibility() {
    const scrollY = window.scrollY;
    const quizSection = document.getElementById('quiz');
    
    if (!quizSection) return;
    
    // Get quiz section position
    const quizRect = quizSection.getBoundingClientRect();
    const quizTop = quizRect.top + window.scrollY;
    
    // Check if we're below or at the quiz section
    const isInValidSection = scrollY >= quizTop - 100;
    
    if (isInValidSection && window.innerWidth <= 768) {
        scrollButtonsContainer.classList.add('active');
    } else {
        scrollButtonsContainer.classList.remove('active');
    }
}
  // Check on load and resize
  window.addEventListener('load', checkVisibility);
  window.addEventListener('resize', checkVisibility);
}

// Initialize scroll buttons when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // ... existing DOMContentLoaded code ...
  
  // Initialize scroll buttons
  initScrollButtons();
});

// Quiz Loading Animation
function initQuizLoadingAnimation() {
  const quizSection = document.getElementById('quiz');
  
  if (!quizSection) return;
  
  // Create loading container
  const loadingContainer = document.createElement('div');
  loadingContainer.className = 'quiz-loading-container';
  
  // Create spinner
  const spinner = document.createElement('div');
  spinner.className = 'quiz-loading-spinner';
  
  // Create loading text
  const loadingText = document.createElement('div');
  loadingText.className = 'quiz-loading-text';
  loadingText.textContent = 'Loading Quiz...';
  
  // Create progress bar container
  const progressContainer = document.createElement('div');
  progressContainer.className = 'quiz-loading-progress';
  
  // Create progress bar
  const progressBar = document.createElement('div');
  progressBar.className = 'quiz-loading-progress-bar';
  progressContainer.appendChild(progressBar);
  
  // Create status text
  const statusText = document.createElement('div');
  statusText.className = 'quiz-loading-status';
  statusText.textContent = 'Preparing questions...';
  
  // Add elements to loading container
  loadingContainer.appendChild(spinner);
  loadingContainer.appendChild(loadingText);
  loadingContainer.appendChild(progressContainer);
  loadingContainer.appendChild(statusText);
  
  // Add loading container to quiz section
  quizSection.style.position = 'relative';
  quizSection.appendChild(loadingContainer);
  
  // Set up intersection observer to detect when quiz section is visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Show loading animation when quiz section comes into view
        loadingContainer.classList.add('active');
        
        // Simulate loading progress
        let progress = 0;
        const totalTime = 4000; // 4 seconds
        const interval = 50; // Update every 50ms
        const steps = totalTime / interval;
        const increment = 100 / steps;
        
        const loadingMessages = [
          'Preparing questions...',
          'Analyzing difficulty levels...',
          'Calibrating scoring system...',
          'Loading quiz data...',
          'Almost ready...'
        ];
        
        const progressInterval = setInterval(() => {
          progress += increment;
          progressBar.style.width = `${Math.min(progress, 100)}%`;
          
          // Update status message at certain progress points
          if (progress < 20) {
            statusText.textContent = loadingMessages[0];
          } else if (progress < 40) {
            statusText.textContent = loadingMessages[1];
          } else if (progress < 60) {
            statusText.textContent = loadingMessages[2];
          } else if (progress < 80) {
            statusText.textContent = loadingMessages[3];
          } else {
            statusText.textContent = loadingMessages[4];
          }
          
          if (progress >= 100) {
            clearInterval(progressInterval);
            
            // Hide loading animation after completion
            setTimeout(() => {
              loadingContainer.classList.remove('active');
              
              // Optional: Add a class to the quiz section to show it's ready
              quizSection.classList.add('quiz-ready');
            }, 200);
          }
        }, interval);
        
        // Stop observing after triggering once
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 }); // Trigger when 30% of the quiz section is visible
  
  observer.observe(quizSection);
}

// Initialize quiz loading animation when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
  // ... existing DOMContentLoaded code ...
  
  // Initialize quiz loading animation
  initQuizLoadingAnimation();
});

// Initialize smooth scroll
const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 800,
  speedAsDuration: true,
  easing: 'easeInOutQuart'
});


// Enhanced scroll to top functionality
document.addEventListener('DOMContentLoaded', function() {
  const scrollToTopButton = document.getElementById('scrollToTop');
  const footer = document.querySelector('footer') || document.body.lastElementChild;
  let isScrolling = false;
  let scrollTimeout;

  // Show/hide button with throttled scroll event
  window.addEventListener('scroll', function() {
      if (!isScrolling) {
          isScrolling = true;
          
          const footerRect = footer.getBoundingClientRect();
          const footerTop = footerRect.top;
          const windowHeight = window.innerHeight;
          const scrollProgress = (window.scrollY / (document.documentElement.scrollHeight - windowHeight)) * 100;

          // Update button visibility and progress indicator
          if (footerTop <= windowHeight + 100 || scrollProgress > 30) {
              scrollToTopButton.style.transform = 'translateY(0)';
              scrollToTopButton.style.opacity = '1';
              scrollToTopButton.style.display = 'flex';
              
              // Add progress indicator
              scrollToTopButton.style.background = `conic-gradient(
                  var(--primary) ${scrollProgress}%,
                  rgba(139, 92, 246, 0.2) ${scrollProgress}%
              )`;
          } else {
              scrollToTopButton.style.transform = 'translateY(20px)';
              scrollToTopButton.style.opacity = '0';
          }

          // Debounce hide animation
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
              if (scrollToTopButton.style.opacity === '0') {
                  scrollToTopButton.style.display = 'none';
              }
          }, 300);

          setTimeout(() => {
              isScrolling = false;
          }, 100);
      }
  }, { passive: true });

// Smoother scroll to top with enhanced easing
scrollToTopButton.addEventListener('click', function() {
  const duration = 5000; // Increased to 5 seconds for extra slow animation
  const start = window.scrollY;
  const startTime = performance.now();

  function easeInOutExpo(t) {
      return t === 0
          ? 0
          : t === 1
          ? 1
          : t < 0.5
          ? Math.pow(2, 20 * t - 10) / 2
          : (2 - Math.pow(2, -20 * t + 10)) / 2;
  }

  function scrollAnimation(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      window.scrollTo({
          top: start * (1 - easeInOutExpo(progress)),
          behavior: 'auto'
      });

      if (progress < 1) {
          requestAnimationFrame(scrollAnimation);
      }
  }

  requestAnimationFrame(scrollAnimation);
});
    // Enhanced hover effects with smoother transitions
    scrollToTopButton.addEventListener('mouseenter', () => {
      scrollToTopButton.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      scrollToTopButton.style.transform = 'translateY(-8px) scale(1.15)';
  });

  scrollToTopButton.addEventListener('mouseleave', () => {
      scrollToTopButton.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      scrollToTopButton.style.transform = 'translateY(0) scale(1)';
  });
});