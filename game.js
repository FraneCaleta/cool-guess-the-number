class GuessTheNumber {
  constructor() {
    this.targetNumber = null;
    this.attempts = 0;
    this.MAX_ATTEMPTS = 10;
    this.numberRange = { min: 1, max: 100 };
    this.currentRange = { min: 1, max: 100 };
    this.failedAttempts = 0;
    this.initializeElements();
    this.initializeGame();
    this.setupEventListeners();
    this.initializeParticles();
    this.newGame();
  }

  initializeElements() {
    this.numberDisplay = document.getElementById("targetNumber");
    this.numberContainer = document.getElementById("numberDisplay");
    this.guessInput = document.getElementById("guessInput");
    this.guessButton = document.getElementById("guessButton");
    this.feedback = document.getElementById("feedback");
    this.attemptsValue = document.getElementById("attemptsValue");
    this.rangeValue = document.getElementById("rangeValue");
    this.newGameButton = document.getElementById("newGame");
    this.particlesContainer = document.getElementById("particles");
    this.newGameBtn = document.getElementById("newGame");
  }

  initializeParticles() {
    // Create particles for background
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.width = `${Math.random() * 5 + 1}px`;
      particle.style.height = particle.style.width;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 5}s`;
      this.particlesContainer.appendChild(particle);
    }
  }

  initializeGame() {
    this.numberRange = { min: 1, max: 100 };
    this.failedAttempts = 0;
    this.newGame();
  }
  
  showGameOver() {
    // Show game over message
    this.showFeedback(`Game Over! The number was ${this.targetNumber}`, 'game-over');
    
    // Reveal the number
    this.numberDisplay.textContent = this.targetNumber;
    this.numberContainer.classList.add('wrong');
    
    // Disable input
    this.guessInput.disabled = true;
    this.guessButton.disabled = true;
    
    // Show new game button
    this.newGameBtn.classList.add('show');
    
    // Animate the game over state
    gsap.fromTo(
      this.feedback,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'back.out' }
    );
  }

  setupEventListeners() {
    this.guessButton.addEventListener("click", () => this.makeGuess());
    this.newGameButton.addEventListener("click", () => this.newGame());
    this.guessInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.makeGuess();
    });

    // Add focus effect for input
    this.guessInput.addEventListener("focus", () => {
      this.guessInput.parentElement.classList.add("focused");
    });
    this.guessInput.addEventListener("blur", () => {
      this.guessInput.parentElement.classList.remove("focused");
    });
  }

  newGame() {
    this.targetNumber =
      Math.floor(
        Math.random() * (this.numberRange.max - this.numberRange.min + 1)
      ) + this.numberRange.min;
    this.currentRange = {
      min: this.numberRange.min,
      max: this.numberRange.max,
    };
    this.attempts = 0;
    this.failedAttempts = 0;
    this.guessInput.value = "";

    // Reset UI
    this.numberDisplay.textContent = "?";
    this.numberContainer.className = "number-display animate__animated";
    this.feedback.className = "feedback";
    this.attemptsValue.textContent = "0";
    this.updateRangeDisplay();
    this.guessInput.disabled = false;
    this.guessButton.disabled = false;
    this.newGameBtn.classList.remove("show");

    // Focus input
    setTimeout(() => this.guessInput.focus(), 500);

    // Animate in
    gsap.fromTo(
      this.numberContainer,
      { scale: 0.5, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
    );
  }

  makeGuess() {
    const guess = parseInt(this.guessInput.value);

    if (isNaN(guess) || guess < 1 || guess > 100) {
      this.showFeedback("Please enter a number between 1 and 100", "error");
      this.shakeInput();
      return;
    }

    this.attempts++;
    this.attemptsValue.textContent = this.attempts;

    if (guess === this.targetNumber) {
      this.handleCorrectGuess();
    } else {
      this.failedAttempts++;
      if (this.failedAttempts >= this.MAX_ATTEMPTS) {
        this.showGameOver();
      } else {
        this.handleWrongGuess(guess);
      }
    }
  }

  handleCorrectGuess() {
    this.showFeedback("Congratulations! You found the number!", "correct");
    this.numberDisplay.textContent = this.targetNumber;
    this.numberContainer.classList.add("correct");

    // Add confetti effect
    this.createConfetti();

    this.guessInput.disabled = true;
    this.guessButton.disabled = true;
    
    // Show new game button
    this.newGameBtn.classList.add("show");

    // Bounce animation for correct guess
    gsap.fromTo(
      this.numberContainer,
      { y: 0 },
      {
        y: -20,
        duration: 0.2,
        yoyo: true,
        repeat: 5,
        ease: "power1.inOut",
      }
    );
  }
  handleWrongGuess(guess) {
    this.numberContainer.classList.add("wrong");

    // Update range based on guess
    if (guess < this.targetNumber) {
      this.currentRange.min = Math.max(this.currentRange.min, guess + 1);
      this.showFeedback("Too low! Try a higher number.", "wrong");
    } else {
      this.currentRange.max = Math.min(this.currentRange.max, guess - 1);
      this.showFeedback("Too high! Try a lower number.", "wrong");
    }

    this.updateRangeDisplay();
    this.shakeNumber();
  }
  handleGameOver() {
    this.showFeedback(
      `Game over! The number was ${this.targetNumber}`,
      "wrong"
    );
    this.guessInput.disabled = true;
    this.guessButton.disabled = true;

    // Shake the game card
    gsap.fromTo(
      ".game-card",
      { x: 0 },
      {
        x: [-10, 10, -10, 10, 0],
        duration: 0.5,
        ease: "power1.inOut",
      }
    );
  }
  updateRangeDisplay() {
    this.rangeValue.textContent = `${this.currentRange.min} - ${this.currentRange.max}`;
    const rangeBox = this.rangeValue.closest(".stat-box");
    rangeBox.classList.add("highlight");

    // Animate the range update
    gsap.fromTo(
      rangeBox,
      { scale: 1 },
      {
        scale: 1.1,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power1.inOut",
      }
    );

    setTimeout(() => rangeBox.classList.remove("highlight"), 500);
  }
  showFeedback(message, type) {
    this.feedback.textContent = message;
    this.feedback.className = "feedback";
    this.feedback.classList.add(type, "show");

    // Auto-hide feedback after delay if it's not the game over message
    if (!message.includes("Game over")) {
      setTimeout(() => {
        this.feedback.classList.remove("show");
      }, 3000);
    }
  }
  shakeInput() {
    gsap.fromTo(
      this.guessInput,
      { x: 0 },
      {
        x: [-5, 5, -5, 5, 0],
        duration: 0.3,
        ease: "power1.inOut",
      }
    );
  }
  shakeNumber() {
    gsap.fromTo(
      this.numberContainer,
      { x: 0 },
      {
        x: [-10, 10, -10, 10, 0],
        duration: 0.5,
        ease: "power1.inOut",
        onComplete: () => {
          this.numberContainer.classList.remove("wrong");
        },
      }
    );
  }
  createConfetti() {
    const colors = [
      "#6366f1",
      "#8b5cf6",
      "#ec4899",
      "#f43f5e",
      "#f59e0b",
      "#10b981",
    ];

    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.width = `${Math.random() * 10 + 5}px`;
      confetti.style.height = confetti.style.width;
      confetti.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.top = "0";
      confetti.style.opacity = Math.random() * 0.5 + 0.5;

      document.body.appendChild(confetti);

      gsap.to(confetti, {
        y: window.innerHeight,
        x: (Math.random() - 0.5) * 200,
        rotation: Math.random() * 360,
        duration: Math.random() * 3 + 2,
        ease: "power1.out",
        onComplete: () => {
          confetti.remove();
        },
      });
    }
  }
}

// Initialize the game when the page loads
document.addEventListener("DOMContentLoaded", () => {
  // Initialize GSAP for smooth animations
  gsap.registerPlugin();

  // Start the game
  const game = new GuessTheNumber();

  // Add keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      game.newGame();
    }
  });
});

// Add styles for confetti
const style = document.createElement("style");
style.textContent = `
    .confetti {
        position: fixed;
        pointer-events: none;
        z-index: 1000;
        border-radius: 50%;
        will-change: transform, opacity;
    }
    
    .particle {
        position: absolute;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 50%;
        pointer-events: none;
        z-index: -1;
        animation: float 15s linear infinite;
    }
    
    @keyframes float {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
