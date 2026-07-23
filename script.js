// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCe8eKTgo8Y3J9NJ-liUuTRYHBbA5O-2LM",
  authDomain: "jumpgameproject-da942.firebaseapp.com",
  databaseURL: "https://jumpgameproject-da942-default-rtdb.firebaseio.com",
  projectId: "jumpgameproject-da942",
  storageBucket: "jumpgameproject-da942.appspot.com",
  messagingSenderId: "967008799896",
  appId: "1:967008799896:web:63b08775fde066f00f94ed",
  measurementId: "G-1SL1TFD4M4"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

let player = document.getElementById("player");
let countDisplay = document.getElementById("count");
let jumpCount = 0;
let isJumping = false;
let currentUser = null;

// Gmail Login
document.getElementById("loginBtn").addEventListener("click", () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).then(result => {
    currentUser = result.user;
    alert("Logged in as " + currentUser.displayName);
  }).catch(err => {
    alert("Login failed: " + err.message);
  });
});

// Jump Logic
function jump() {
  if (jumpCount < 20 && !isJumping) {
    isJumping = true;
    jumpCount++;
    countDisplay.textContent = jumpCount;
    player.style.bottom = "140px";
    setTimeout(() => {
      player.style.bottom = "40px";
      isJumping = false;
    }, 500);

    // স্কোর Firebase এ সেভ করা
    if (currentUser) {
      db.ref("scores/" + currentUser.uid).set({
        name: currentUser.displayName,
        score: jumpCount
      });
    }
  } else if (jumpCount >= 20) {
    jumpCount = 0;
    countDisplay.textContent = jumpCount;
  }
}

document.addEventListener("click", jump);
document.addEventListener("touchstart", jump);

// Top 10 স্কোরবোর্ড দেখানো
db.ref("scores").orderByChild("score").limitToLast(10).on("value", snapshot => {
  let board = document.getElementById("scoreboard");
  board.innerHTML = "<h4>Top 10 Players</h4>";
  let scores = [];
  snapshot.forEach(child => {
    scores.push(child.val());
  });
  scores.reverse().forEach(data => {
    board.innerHTML += data.name + " : " + data.score + "<br>";
  });
});
