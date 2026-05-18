const MODES = {
  focus: {
    label: "专注",
    seconds: 25 * 60,
    readyStatus: "准备开始"
  },
  short: {
    label: "短休息",
    seconds: 5 * 60,
    readyStatus: "短休息准备"
  },
  long: {
    label: "长休息",
    seconds: 15 * 60,
    readyStatus: "长休息准备"
  }
};

const timeDisplay = document.querySelector("#timeDisplay");
const statusText = document.querySelector("#statusText");
const startButton = document.querySelector("#startButton");
const pauseButton = document.querySelector("#pauseButton");
const resetButton = document.querySelector("#resetButton");
const modeLabel = document.querySelector("#modeLabel");
const completedCount = document.querySelector("#completedCount");
const progressCircle = document.querySelector("#progressCircle");
const modeButtons = document.querySelectorAll(".mode-button");

const circleLength = progressCircle.getTotalLength();

let currentMode = "focus";
let remainingSeconds = MODES[currentMode].seconds;
let timerId = null;
let completedFocusCount = 0;

progressCircle.style.strokeDasharray = circleLength;

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function getTotalSeconds() {
  return MODES[currentMode].seconds;
}

function renderProgress() {
  const totalSeconds = getTotalSeconds();
  const elapsedRatio = (totalSeconds - remainingSeconds) / totalSeconds;
  progressCircle.style.strokeDashoffset = circleLength * (1 - elapsedRatio);
}

function render() {
  timeDisplay.textContent = formatTime(remainingSeconds);
  modeLabel.textContent = MODES[currentMode].label;
  completedCount.textContent = `今日完成 ${completedFocusCount} 次`;
  renderProgress();

  modeButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.mode === currentMode);
  });
}

function setStatus(text) {
  statusText.textContent = text;
}

function stopTimer() {
  clearInterval(timerId);
  timerId = null;
}

function resetCurrentMode(status = MODES[currentMode].readyStatus) {
  stopTimer();
  remainingSeconds = getTotalSeconds();
  setStatus(status);
  render();
}

function switchMode(mode) {
  if (!MODES[mode] || mode === currentMode) {
    return;
  }

  currentMode = mode;
  resetCurrentMode(MODES[currentMode].readyStatus);
}

function finishTimer() {
  stopTimer();
  remainingSeconds = 0;

  if (currentMode === "focus") {
    completedFocusCount += 1;
    setStatus("专注完成，休息一下");
  } else {
    setStatus("休息结束，准备专注");
  }

  render();
}

function startTimer() {
  if (timerId !== null || remainingSeconds === 0) {
    return;
  }

  setStatus(currentMode === "focus" ? "专注中" : "休息中");

  timerId = setInterval(() => {
    remainingSeconds -= 1;

    if (remainingSeconds <= 0) {
      finishTimer();
      return;
    }

    render();
  }, 1000);
}

function pauseTimer() {
  if (timerId === null) {
    return;
  }

  stopTimer();
  setStatus("已暂停");
}

function resetTimer() {
  resetCurrentMode(MODES[currentMode].readyStatus);
}

modeButtons.forEach((button) => {
  button.addEventListener("click", () => switchMode(button.dataset.mode));
});

startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
resetButton.addEventListener("click", resetTimer);

render();
