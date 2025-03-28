const TypeRight = {
  elements: {
    userInput: document.getElementById("inptarea"),
    startButton: document.getElementById("startbutton"),
    wordsContainer: document.getElementById("words-container"),
  },
  originalSentence: "",
  typedText: "",

  init() {
    this.elements.startButton.addEventListener("click", () => this.startSession());
    this.elements.userInput.addEventListener("keydown", (e) => this.handleInput(e));
  },

  async getSentence() {
    try {
      const response = await fetch("http://api.quotable.io/random");
      const data = await response.json();
      return data.content;
    } catch (error) {
      console.error("Error fetching sentence:", error);
      return "Failed to fetch a sentence. Please try again.";
    }
  },

  async startSession() {
    this.originalSentence = await this.getSentence();
    this.elements.wordsContainer.innerHTML = this.originalSentence
      .split("")
      .map((char) => `<span>${char}</span>`)
      .join("");

    // Reset typed text
    this.typedText = "";

    // Reset and enable input
    this.elements.userInput.value = "";
    this.elements.userInput.disabled = false;
    this.elements.userInput.focus();
  },

  handleInput(e) {
    e.preventDefault();

    const key = e.key;

    if (key === "Backspace") {
      // Remove the last character if Backspace is pressed
      this.typedText = this.typedText.slice(0, -1);
    } else if (key.length === 1) {
      // Add the character to typedText if it's a valid key
      this.typedText += key;
    }

    this.updateFeedback();
  },

  updateFeedback() {
    const originalChars = this.originalSentence.split("");
    const typedChars = this.typedText.split("");
    const spans = this.elements.wordsContainer.querySelectorAll("span");

    // Update character feedback
    spans.forEach((span, index) => {
      if (index < typedChars.length) {
        if (typedChars[index] === originalChars[index]) {
          span.className = "correct-input";
        } else {
          span.className = "incorrect-input";
        }
      } else {
        span.className = "";
      }
    });
  },
};

TypeRight.init();
