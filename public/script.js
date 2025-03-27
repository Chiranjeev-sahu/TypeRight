const TypeRight = {
    elements: {
        userInput: document.getElementById("inptarea"),
        startButton: document.getElementById("startbutton"),
        wordsContainer: document.getElementById("words-container"),
    },
    originalSentence: "",
    typedText: "",

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
        this.elements.wordsContainer.textContent = this.originalSentence;
        this.elements.userInput.value = "";
        this.elements.userInput.disabled = false;
        this.elements.userInput.focus();
    },

    init() {
        this.elements.startButton.addEventListener("click", () => this.startSession());
        this.elements.userInput.addEventListener("input", () => this.handleInput());
    },

    handleInput() {
        this.typedText = this.elements.userInput.value;
        const isCorrect = this.originalSentence.startsWith(this.typedText);

        this.elements.userInput.classList.remove("correct-input", "incorrect-input");
        if (isCorrect) {
            this.elements.userInput.classList.add("correct-input");
        } else {
            this.elements.userInput.classList.add("incorrect-input");
        }
    },
};

TypeRight.init();
