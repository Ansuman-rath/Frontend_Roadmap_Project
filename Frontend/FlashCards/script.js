// Flashcard data with JavaScript questions and answers
const flashcards = [
    {
        question: "What is the difference between var, let, and const?",
        answer: "In JavaScript, var is function-scoped and can be re-declared; let and const are block-scoped, with let allowing re-assignment and const preventing it. However, const objects can have their contents modified."
    },
    {
        question: "What is closure in JavaScript?",
        answer: "A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned. It allows a function to 'remember' and access variables from its outer scope."
    },
    {
        question: "What is the difference between == and ===?",
        answer: "== performs type coercion before comparison, while === (strict equality) checks both value and type without coercion. === is generally preferred as it's more predictable and safer."
    },
    {
        question: "What is hoisting in JavaScript?",
        answer: "Hoisting is JavaScript's default behavior of moving declarations to the top of their scope. Variable and function declarations are hoisted, but not their initializations."
    },
    {
        question: "What is the event loop in JavaScript?",
        answer: "The event loop is a mechanism that allows JavaScript to perform non-blocking operations despite being single-threaded. It continuously checks the call stack and processes tasks from the callback queue."
    },
    {
        question: "What are promises in JavaScript?",
        answer: "Promises are objects representing the eventual completion or failure of an asynchronous operation. They provide a cleaner way to handle async operations compared to callbacks."
    },
    {
        question: "What is the difference between null and undefined?",
        answer: "undefined means a variable has been declared but not assigned a value, while null is an explicit assignment representing 'no value' or 'empty value'."
    },
    {
        question: "What is the 'this' keyword in JavaScript?",
        answer: "'this' refers to the object that is currently executing the code. Its value depends on how a function is called: global context, object method, constructor, or with call/apply/bind."
    },
    {
        question: "What is prototypal inheritance?",
        answer: "Prototypal inheritance is JavaScript's way of implementing inheritance. Objects can inherit properties and methods from other objects through their prototype chain."
    },
    {
        question: "What is the difference between synchronous and asynchronous code?",
        answer: "Synchronous code executes line by line, blocking execution until each line completes. Asynchronous code allows other operations to run while waiting for operations to complete."
    },
    {
        question: "What is a callback function?",
        answer: "A callback function is a function passed as an argument to another function, which is then invoked inside the outer function to complete some kind of routine or action."
    },
    {
        question: "What is the difference between map() and forEach()?",
        answer: "map() creates a new array with the results of calling a function for every array element, while forEach() executes a provided function once for each array element but doesn't return anything."
    },
    {
        question: "What is destructuring in JavaScript?",
        answer: "Destructuring is a way to extract values from objects or arrays into distinct variables using a syntax that mirrors the construction of array and object literals."
    },
    {
        question: "What is the spread operator?",
        answer: "The spread operator (...) allows an iterable to be expanded in places where zero or more arguments or elements are expected. It's useful for copying arrays, combining objects, etc."
    },
    {
        question: "What is the difference between slice() and splice()?",
        answer: "slice() returns a shallow copy of a portion of an array without modifying the original, while splice() changes the contents of an array by removing or replacing existing elements."
    },
    {
        question: "What is a pure function?",
        answer: "A pure function is a function that always returns the same output for the same input and has no side effects. It doesn't modify external state or depend on external state."
    },
    {
        question: "What is the difference between function declaration and function expression?",
        answer: "Function declarations are hoisted and can be called before they're defined. Function expressions are not hoisted and must be defined before they can be called."
    },
    {
        question: "What is the difference between localStorage and sessionStorage?",
        answer: "localStorage persists data until explicitly cleared, while sessionStorage only persists data for the duration of the browser session (until the tab is closed)."
    },
    {
        question: "What is the difference between shallow copy and deep copy?",
        answer: "A shallow copy creates a new object but references the same nested objects. A deep copy creates a completely independent copy of the object and all its nested objects."
    },
    {
        question: "What is the difference between call(), apply(), and bind()?",
        answer: "call() and apply() immediately invoke a function with a specified 'this' context, while bind() returns a new function with the specified 'this' context without invoking it."
    }
];

// Enhanced state management with animations
class FlashcardApp {
    constructor() {
        this.currentIndex = 0;
        this.isShowingAnswer = false;
        this.totalCards = flashcards.length;
        this.isAnimating = false;
        
        this.initializeElements();
        this.bindEvents();
        this.updateDisplay();
        this.addConfettiEffect();
    }
    
    initializeElements() {
        this.cardContent = document.getElementById('cardContent');
        this.flipButton = document.getElementById('flipButton');
        this.prevButton = document.getElementById('prevButton');
        this.nextButton = document.getElementById('nextButton');
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        this.cardCounter = document.getElementById('cardCounter');
        this.flashcard = document.getElementById('flashcard');
        
        // New elements
        this.firstButton = document.getElementById('firstButton');
        this.lastButton = document.getElementById('lastButton');
        this.helpButton = document.getElementById('helpButton');
        this.helpModal = document.getElementById('helpModal');
        this.closeHelp = document.getElementById('closeHelp');
        this.completionMessage = document.getElementById('completionMessage');
        this.restartButton = document.getElementById('restartButton');
    }
    
    bindEvents() {
        this.flipButton.addEventListener('click', () => this.toggleAnswer());
        this.prevButton.addEventListener('click', () => this.previousCard());
        this.nextButton.addEventListener('click', () => this.nextCard());
        
        // New control buttons
        this.firstButton.addEventListener('click', () => this.goToFirstCard());
        this.lastButton.addEventListener('click', () => this.goToLastCard());
        this.helpButton.addEventListener('click', () => this.showHelp());
        this.closeHelp.addEventListener('click', () => this.hideHelp());
        this.restartButton.addEventListener('click', () => this.restart());
        
        // Modal close on outside click
        this.helpModal.addEventListener('click', (e) => {
            if (e.target === this.helpModal) {
                this.hideHelp();
            }
        });
        
        // Enhanced keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.isAnimating) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.previousCard();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextCard();
                    break;
                case ' ':
                case 'Enter':
                    e.preventDefault();
                    this.toggleAnswer();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToFirstCard();
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToLastCard();
                    break;
                case 'Escape':
                    this.hideHelp();
                    break;
            }
        });
        
        // Add touch/swipe support for mobile
        this.addTouchSupport();
    }
    
    addTouchSupport() {
        let startX = 0;
        let startY = 0;
        
        this.flashcard.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        this.flashcard.addEventListener('touchend', (e) => {
            if (this.isAnimating) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Check if it's a horizontal swipe
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.nextCard();
                } else {
                    this.previousCard();
                }
            }
        });
    }
    
    async toggleAnswer() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.flashcard.classList.add('flipping');
        
        // Add sound effect (optional)
        this.playSound('flip');
        
        await this.delay(300);
        
        this.isShowingAnswer = !this.isShowingAnswer;
        this.updateCardContent();
        this.updateFlipButton();
        
        await this.delay(300);
        
        this.flashcard.classList.remove('flipping');
        this.isAnimating = false;
    }
    
    async previousCard() {
        if (this.currentIndex > 0 && !this.isAnimating) {
            this.isAnimating = true;
            this.addLoadingState();
            
            await this.delay(200);
            
            this.currentIndex--;
            this.isShowingAnswer = false;
            this.updateDisplay();
            
            this.removeLoadingState();
            this.isAnimating = false;
        }
    }
    
    async nextCard() {
        if (this.currentIndex < this.totalCards - 1 && !this.isAnimating) {
            this.isAnimating = true;
            this.addLoadingState();
            
            await this.delay(200);
            
            this.currentIndex++;
            this.isShowingAnswer = false;
            this.updateDisplay();
            
            this.removeLoadingState();
            this.isAnimating = false;
        } else if (this.currentIndex === this.totalCards - 1) {
            this.showCompletionMessage();
        }
    }
    
    goToFirstCard() {
        if (this.currentIndex !== 0 && !this.isAnimating) {
            this.currentIndex = 0;
            this.isShowingAnswer = false;
            this.updateDisplay();
        }
    }
    
    goToLastCard() {
        if (this.currentIndex !== this.totalCards - 1 && !this.isAnimating) {
            this.currentIndex = this.totalCards - 1;
            this.isShowingAnswer = false;
            this.updateDisplay();
        }
    }
    
    showHelp() {
        this.helpModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    hideHelp() {
        this.helpModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
    
    showCompletionMessage() {
        this.completionMessage.classList.add('show');
        this.createConfetti();
    }
    
    restart() {
        this.completionMessage.classList.remove('show');
        this.currentIndex = 0;
        this.isShowingAnswer = false;
        this.updateDisplay();
    }
    
    updateDisplay() {
        this.updateCardContent();
        this.updateFlipButton();
        this.updateNavigation();
        this.updateProgress();
        this.updateCardCounter();
        this.updateControlButtons();
    }
    
    updateCardContent() {
        const card = flashcards[this.currentIndex];
        
        if (this.isShowingAnswer) {
            this.cardContent.textContent = card.answer;
            this.cardContent.className = 'card-content answer';
        } else {
            this.cardContent.textContent = card.question;
            this.cardContent.className = 'card-content question';
        }
    }
    
    updateFlipButton() {
        this.flipButton.textContent = this.isShowingAnswer ? 'Hide Answer' : 'Show Answer';
    }
    
    updateNavigation() {
        this.prevButton.disabled = this.currentIndex === 0;
        this.nextButton.disabled = this.currentIndex === this.totalCards - 1;
    }
    
    updateControlButtons() {
        this.firstButton.disabled = this.currentIndex === 0;
        this.lastButton.disabled = this.currentIndex === this.totalCards - 1;
    }
    
    updateProgress() {
        const progress = ((this.currentIndex + 1) / this.totalCards) * 100;
        
        // Add animation class
        this.progressFill.classList.add('animating');
        
        setTimeout(() => {
            this.progressFill.style.width = `${progress}%`;
            this.progressText.textContent = `${Math.round(progress)}%`;
            
            // Remove animation class after animation completes
            setTimeout(() => {
                this.progressFill.classList.remove('animating');
            }, 500);
        }, 100);
    }
    
    updateCardCounter() {
        this.cardCounter.textContent = `${this.currentIndex + 1} of ${this.totalCards}`;
    }
    
    addLoadingState() {
        this.flashcard.classList.add('loading');
    }
    
    removeLoadingState() {
        this.flashcard.classList.remove('loading');
    }
    
    playSound(type) {
        // Create audio context for sound effects
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            if (type === 'flip') {
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
            }
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            // Fallback if audio context is not supported
            console.log('Audio not supported');
        }
    }
    
    addConfettiEffect() {
        // Add confetti effect when completing the deck
        this.nextButton.addEventListener('click', () => {
            if (this.currentIndex === this.totalCards - 2) {
                setTimeout(() => {
                    this.createConfetti();
                }, 500);
            }
        });
    }
    
    createConfetti() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.position = 'fixed';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.top = '-10px';
                confetti.style.width = '10px';
                confetti.style.height = '10px';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.borderRadius = '50%';
                confetti.style.pointerEvents = 'none';
                confetti.style.zIndex = '9999';
                confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
                
                document.body.appendChild(confetti);
                
                setTimeout(() => {
                    confetti.remove();
                }, 5000);
            }, i * 100);
        }
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Add fall animation for confetti
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
        }
    }
`;
document.head.appendChild(style);

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FlashcardApp();
}); 