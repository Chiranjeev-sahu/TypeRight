const TypeRight = {
  elements: {
    userInput: document.getElementById("inptarea"),
    startButton: document.getElementById("startbutton"),
    wordsContainer: document.getElementById("words-container"),
    chart: document.getElementById("chart"),
    glowingContainer: document.querySelector(".glowing-container"),
  },
  originalSentence: "",
  typedText: "",
  startTime: null,
  chartInstance: null,
  dataPoints: {
    wpm: [],
    accuracy: [],
  },
  isCompleted: false,

  init() {
    this.elements.startButton.addEventListener("click", () => this.startSession());
    this.elements.userInput.addEventListener("keydown", (e) => this.handleInput(e));
    this.initChart(); // Initialize the chart
  },

  async getSentence() {
    const randomIndex = Math.floor(Math.random() * sentences.length);
    return sentences[randomIndex];
  },
  

  async startSession() {
    this.elements.startButton.textContent='Start';
    this.originalSentence = await this.getSentence();
    this.elements.wordsContainer.innerHTML = this.originalSentence
      .split("")
      .map((char) => `<span>${char}</span>`)
      .join("");

    this.typedText = ""; // Reset typed text
    this.elements.userInput.value = "";
    this.elements.userInput.disabled = false;
    this.elements.userInput.focus();
    this.startTime = Date.now(); // Record the start time
    this.isCompleted = false; // Reset completion flag
    this.resetChart(); // Clear previous data from the chart
  },

  handleInput(e) {
    if (this.isCompleted) return;

    e.preventDefault();

    const key = e.key;

    if (key === "Backspace") {
      this.typedText = this.typedText.slice(0, -1); // Remove last character
    } else if (key.length === 1) {
      this.typedText += key; // Add valid key
    }

    this.updateFeedback();

    if (this.typedText.length >= this.originalSentence.length) {
      this.completeSession();
    } else {
      this.updateMetrics(); // Update WPM and accuracy
    }
  },

  updateFeedback() {
    const originalChars = this.originalSentence.split("");
    const typedChars = this.typedText.split("");
    const spans = this.elements.wordsContainer.querySelectorAll("span");

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

  updateMetrics() {
    const elapsedTime = (Date.now() - this.startTime) / 1000 / 60; // Convert to minutes
    const wordCount = this.typedText.split(" ").length;
    const wpm = Math.floor(wordCount / elapsedTime);

    const correctChars = this.typedText
      .split("")
      .filter((char, index) => char === this.originalSentence[index]).length;
    const accuracy = Math.floor((correctChars / this.originalSentence.length) * 100);

    this.dataPoints.wpm.push(wpm);
    this.dataPoints.accuracy.push(accuracy);

    this.updateChart(wpm, accuracy);
  },

  completeSession() {
    this.isCompleted = true;
    this.elements.userInput.disabled = true;

    const averageWPM =
      this.dataPoints.wpm.reduce((sum, val) => sum + val, 0) / this.dataPoints.wpm.length;
    const averageAccuracy =
      this.dataPoints.accuracy.reduce((sum, val) => sum + val, 0) / this.dataPoints.accuracy.length;

    this.displayResults(averageWPM.toFixed(2), averageAccuracy.toFixed(2));
  },

  initChart() {
    const ctx = this.elements.chart.getContext("2d");
    this.chartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: [], // Time intervals or typing stages
        datasets: [
          {
            label: "Words Per Minute (WPM)",
            data: [],
            borderColor: "rgba(47, 177, 177, 1)",
            backgroundColor: "rgba(47, 177, 177, 0.2)",
            fill: true,
          },
          {
            label: "Accuracy (%)",
            data: [],
            borderColor: "rgba(180, 72, 89, 1)",
            backgroundColor: "rgba(180, 72, 89, 0.2)",
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: "Time (s)",
            },
          },
          y: {
            title: {
              display: true,
              text: "Metrics",
            },
            min: 0,
            max: 100,
          },
        },
      },
    });
  },

  updateChart(wpm, accuracy) {
    const timestamp = (Date.now() - this.startTime) / 1000; // Elapsed time in seconds

    this.chartInstance.data.labels.push(timestamp.toFixed(1)); // Add timestamp
    this.chartInstance.data.datasets[0].data.push(wpm); // Add WPM
    this.chartInstance.data.datasets[1].data.push(accuracy); // Add accuracy

    this.chartInstance.update(); // Refresh chart
  },

  resetChart() {
    this.chartInstance.data.labels = [];
    this.chartInstance.data.datasets[0].data = [];
    this.chartInstance.data.datasets[1].data = [];
    this.chartInstance.update();
  },
  
  displayResults(averageWPM, averageAccuracy) {
    const resultsContainer = document.createElement("div");
    resultsContainer.classList.add("results-container");
    resultsContainer.innerHTML = `
    <h3>Session Summary</h3>
    <p><strong>Average WPM:</strong> ${averageWPM}</p>
    <p><strong>Average Accuracy:</strong> ${averageAccuracy}%</p>
    `;
    
    this.elements.glowingContainer.insertAdjacentElement("afterend", resultsContainer);
    
    // Smooth transition
    resultsContainer.style.opacity = 0;
    setTimeout(() => {
      resultsContainer.style.transition = "opacity 0.5s ease";
      resultsContainer.style.opacity = 1;
    }, 100);
    this.elements.startButton.textContent='Restart';
  },
};

TypeRight.init();
