// Movie sequence and control variables
let isPlaying = false;
let currentScene = "title";
let animations = [];

// DOM Elements
const titleScreen = document.getElementById("title-screen");
const movieScreen = document.getElementById("movie-screen");
const creditsScreen = document.getElementById("credits-screen");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const restartBtn = document.getElementById("restart-btn");
const backToStartBtn = document.getElementById("back-to-start-btn");
const rider = document.getElementById("rider");
const background = document.getElementById("background");
const road = document.getElementById("road");

// Movie scenes/sequences
const movieScenes = [
  {
    duration: 5000, // 5 seconds
    setup: () => {
      // Opening scene - rider appears
      rider.style.left = "-150px";
      rider.style.transition = "left 3s ease-out";
      setTimeout(() => {
        rider.style.left = "50px";
      }, 100);
    },
  },
  {
    duration: 8000, // 8 seconds
    setup: () => {
      // Rider speeds up
      road.style.animationDuration = "3s";
      background.style.animationDuration = "15s";

      // Add some movement to the rider
      rider.classList.add("speeding");
    },
  },
  {
    duration: 6000, // 6 seconds
    setup: () => {
      // Rider does a trick
      rider.classList.add("trick");
      setTimeout(() => {
        rider.classList.remove("trick");
      }, 5000);
    },
  },
  {
    duration: 4000, // 4 seconds
    setup: () => {
      // Rider slows down for finale
      road.style.animationDuration = "5s";
      background.style.animationDuration = "20s";
      rider.classList.remove("speeding");
    },
  },
  {
    duration: 5000, // 5 seconds
    setup: () => {
      // Finale - rider rides into the sunset
      rider.style.transition = "left 4s ease-in, bottom 4s ease-in";
      rider.style.left = "850px";
      rider.style.bottom = "60%";
      setTimeout(() => {
        showCredits();
      }, 4000);
    },
  },
];

// Event Listeners
startBtn.addEventListener("click", startMovie);
pauseBtn.addEventListener("click", togglePause);
restartBtn.addEventListener("click", restartMovie);
backToStartBtn.addEventListener("click", backToStart);

// Functions to control the movie
function startMovie() {
  titleScreen.classList.add("hidden");
  movieScreen.classList.remove("hidden");
  isPlaying = true;

  // Run through each movie scene
  let timeOffset = 0;

  movieScenes.forEach((scene, index) => {
    const timeout = setTimeout(() => {
      if (isPlaying) {
        scene.setup();
      }
    }, timeOffset);

    animations.push(timeout);
    timeOffset += scene.duration;
  });
}

function togglePause() {
  if (isPlaying) {
    // Pause all animations
    isPlaying = false;
    pauseBtn.textContent = "Resume";
    document.querySelectorAll("*").forEach((element) => {
      const computedStyle = window.getComputedStyle(element);
      const animationName = computedStyle.getPropertyValue("animation-name");
      if (animationName !== "none") {
        element.style.animationPlayState = "paused";
      }
      const transition = computedStyle.getPropertyValue("transition");
      if (transition !== "none") {
        element.classList.add("paused");
      }
    });
  } else {
    // Resume animations
    isPlaying = true;
    pauseBtn.textContent = "Pause";
    document.querySelectorAll("*").forEach((element) => {
      element.style.animationPlayState = "";
      element.classList.remove("paused");
    });
  }
}

function restartMovie() {
  // Clear all animation timeouts
  animations.forEach((timeout) => clearTimeout(timeout));
  animations = [];

  // Reset elements to initial state
  rider.style = "";
  background.style = "";
  road.style = "";
  rider.className = "character";

  // Restart the movie
  startMovie();
}

function showCredits() {
  movieScreen.classList.add("hidden");
  creditsScreen.classList.remove("hidden");
  currentScene = "credits";
}

function backToStart() {
  // Clear all animation timeouts
  animations.forEach((timeout) => clearTimeout(timeout));
  animations = [];

  // Reset elements to initial state
  rider.style = "";
  background.style = "";
  road.style = "";
  rider.className = "character";

  creditsScreen.classList.add("hidden");
  titleScreen.classList.remove("hidden");
  currentScene = "title";
}

// Add some CSS classes for animations
document.head.insertAdjacentHTML(
  "beforeend",
  `
<style>
    .speeding {
        animation: speedEffect 0.5s infinite alternate !important;
    }

    .trick {
        animation: doTrick 1s 5 !important;
    }

    .paused {
        transition: none !important;
    }

    @keyframes speedEffect {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(5deg); }
    }

    @keyframes doTrick {
        0% { transform: rotate(0deg); }
        25% { transform: rotate(90deg) scale(0.8); }
        50% { transform: rotate(180deg) scale(0.8); }
        75% { transform: rotate(270deg) scale(0.8); }
        100% { transform: rotate(360deg); }
    }
</style>
`
);
