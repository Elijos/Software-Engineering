/**
 * Author: Emmanuel Simiyu(A00439371)

    This java script details the functioning of various aspects of the game;
    such as the timer, buttons and navigation.
    It also checks to see whether an input provided matches the right answer 
    and calculates a score based on the timer.
 */
//constants for various elements of the program
const startButton = document.getElementById("start-btn");
const hints = document.getElementById("hinter");
const nextP = document.getElementById("next");
const speaker = document.getElementById("micBtn");
const writer = document.getElementById("keyBtn");
const pictures = document.getElementById("imageBox");
const input = document.getElementById("submission");
const inputBox = document.getElementById("text1");
const next = document.getElementById("nexter");
const submitter = document.getElementById("submit");
const qq = document.getElementById("queBox");
const yessir = document.getElementById("yessir");
const nosir = document.getElementById("nosir");

var timerRunning = false;
var stillgoing = false;
var myImage = document.getElementById("image");
// array of image questions
var imageArray = [
  "kutputi.jpg",
  "sisip.jpg",
  "mui'n.jpg",
  "tu'aqan.jpg",
  "wi'katkn.jpg",
  "wskwijinu.jpg",
];
// array of correct answers
var answers = ["kutputi", "sisip", "muin", "tuaqan", "wikatkn", "wskwijinu"];
var form = document.createElement("form");
var grades = [];
var i, grade, time;

let totalTime = 45;
let form_data = new FormData(form);

//initiates game sequence
function startGame() {
  startButton.style.display = "none";
  hints.style.display = "flex";
  nextP.style.display = "flex";
  speaker.style.display = "flex";
  writer.style.display = "flex";
  i = 0;
  grades = [];
  myImage.setAttribute("src", imageArray[i]);
  document.getElementById("score").innerHTML = "0";
  pictures.classList.remove("hide");
  $("#imageBox").show();
  $("#about").hide();
  $("#score").show();
  $("#scorelbl").show();
}

//display the next image if not at the last image, otherwise call for the end of the round
function nextPic() {
  if (!timerRunning) {
    grades.push(0);
    i++;
    if (i > imageArray.length - 1) {
      if (!stillgoing) {
        stillgoing = true;
        submitScore();
      }
    } else {
      myImage.setAttribute("src", imageArray[i]);
      $("#text1").hide();
      $("#submission").hide();
    }
  }
}

//Takes user back to the game's home page
function backtoStart() {
  $("#start-btn").show();
  $("#about").show();
  $("#score").hide();
  $("#scorelbl").hide();
  $("#text1").hide();
  $("#form").hide();
  $("#imageBox").hide();
  $("#keyBtn").hide();
  $("#micBtn").hide();
  stillgoing = false;
  timerRunning = false;
}

//Timer counts down while checking for audio input from user
function micTimer() {
  //stop users from being able to over click timer resulting in a faster clock
  if (!timerRunning) {
    document.getElementById("timer").innerHTML = totalTime.toString();
    timerRunning = true;

    time = totalTime;
    let barTime = totalTime * 40;
    let newTime = barTime;
    let interval = window.setInterval(setTimer, 1000);
    let barInterval = window.setInterval(bar, 25);
    $("#text1").hide();

    //set timer to intitiate countdown
    function setTimer() {
      if (time == 0) {
        clearInterval(interval);
        clearInterval(barInterval);
        timerRunning = false;
        document.getElementById("timer").innerHTML = totalTime.toString();
        document.getElementById("myBar").style.backgroundColor = "rgb(0,177,0)";
        document.getElementById("myBar").style.width = "100%";
      } else {
        time--;
        document.getElementById("timer").innerHTML = time;
      }
    }

    //set bar to behave as the timer does
    function bar() {
      newTime--;
      let percentage = (newTime / barTime) * 100;
      if (percentage < 20) {
        document.getElementById("myBar").style.backgroundColor = "red";
      } else if (percentage < 50) {
        document.getElementById("myBar").style.backgroundColor = "orange";
      } else if (percentage < 70) {
        document.getElementById("myBar").style.backgroundColor = "yellow";
      }
      document.getElementById("myBar").style.width = percentage + "%";
    }

    app();
  }
}

//Timer counts down while checking for text input from user
function textTimer() {
  //stop users from being able to over click timer resulting in a faster clock
  if (!timerRunning) {
    document.getElementById("timer").innerHTML = totalTime.toString();
    timerRunning = true;

    time = totalTime;
    let barTime = totalTime * 40;
    let newTime = barTime;
    let interval = window.setInterval(setTimer, 1000);
    let barInterval = window.setInterval(bar, 25);

    //set timer to initiate countdown
    function setTimer() {
      if (time == 0) {
        clearInterval(interval);
        clearInterval(barInterval);
        timerRunning = false;
        document.getElementById("timer").innerHTML = totalTime.toString();
        document.getElementById("myBar").style.backgroundColor = "rgb(0,177,0)";
        document.getElementById("myBar").style.width = "100%";
      } else {
        time--;
        document.getElementById("timer").innerHTML = time;
      }
    }

    //set bar to behave correspondingly with timer
    function bar() {
      newTime--;
      let percentage = (newTime / barTime) * 100;
      if (percentage < 20) {
        document.getElementById("myBar").style.backgroundColor = "red";
      } else if (percentage < 50) {
        document.getElementById("myBar").style.backgroundColor = "orange";
      } else if (percentage < 70) {
        document.getElementById("myBar").style.backgroundColor = "yellow";
      }
      document.getElementById("myBar").style.width = percentage + "%";
    }

    $("#micBtn").hide();
    $("#text1").show();
    $("#submission").show();
    //check if answer is right
    input.addEventListener("click", () => {
      var answer = document.getElementById("text1").value;
      console.log(answers[i]);
      if (answer == answers[i]) {
        //perform if answer is right
        inputBox.style.backgroundColor = "rgba(40, 241, 90, 0.76)";
        grade = Math.round((time / totalTime) * 100);
        grades.push(grade);
        document.getElementById("score").innerHTML = grade.toString();
        $("#nexter").show();
        $("#submission").hide();
        i++;
        //display next question if not at last index
        next.addEventListener("click", () => {
          time = 0;
          document.getElementById("text1").value = "";
          if (i > imageArray.length - 1) {
            if (!stillgoing) {
              stillgoing = true;
              timerRunning = true;
              time = 0;
              setTimer();
              submitScore();
            }
          } else {
            myImage.setAttribute("src", imageArray[i]);
            inputBox.style.backgroundColor = "rgba(34, 60, 80, 0.16)";
          }
          $("#nexter").hide();
          $("#text1").hide();
          $("#micBtn").show();
        });
      } else {
        //prompt user to retry
        inputBox.style.backgroundColor = "rgba(255, 0, 0, 0.76)";
        document.getElementById("text1").value = "";
      }
    });
  }
}

//Calculate average score and pass it in to the scoreboard
function submitScore() {
  $("#keyBtn").hide();
  $("#micBtn").hide();
  var sum = 0;
  for (let a = 0; a < grades.length; a++) {
    sum += grades[a];
  }
  var avg = Math.round(sum / grades.length);
  $("#queBox").show();
  $("#imageBox").hide();
  $("#text1").hide();
  $("#submission").hide();
  $("#keyBtn").hide();
  $("#micBtn").hide();
  $("#nexter").hide();
  yessir.addEventListener("click", () => {
    $("#queBox").hide();
    backtoStart();
  });
  nosir.addEventListener("click", () => {
    $("#queBox").hide();
    $("#form").show();
    document.getElementById("score").innerHTML = avg.toString();
    submitter.addEventListener("click", () => {
      var userId = document.getElementById("user").value;
      var date = document.getElementById("day").value;
      form_data.append("name", userId);
      form_data.append("score", avg.toString());
      $(() => {
        $.ajax({
          type: "POST",
          url: "http://ugdev.cs.smu.ca:7000/submitdata",
          data: form_data,
          contentType: false,
          cache: false,
          processData: false,
          success: (data) => {
            console.log(data);
          },
        });
      });
      backtoStart();
    });
  });
}

let recognizer;

function predictWord() {
  // Array of words that the recognizer is trained to recognize.
  const words = recognizer.wordLabels();
  recognizer.listen(
    ({ scores }) => {
      // Turn scores into a list of (score,word) pairs.
      scores = Array.from(scores).map((s, i) => ({ score: s, word: words[i] }));
      // Find the most probable word.
      scores.sort((s1, s2) => s2.score - s1.score);
      checkString(scores[0].word);
    },
    { probabilityThreshold: 0.85 }
  );
}

//check whether the audio input matches the right answer and assign score value
function checkString(a) {
  //compare audio input with answer
  if (a == answers[i]) {
    grade = Math.round((time / totalTime) * 100);
    grades.push(grade);
    document.getElementById("score").innerHTML = grade.toString();
    $("#nexter").show();
    i++;
    next.addEventListener("click", () => {
      time = 0;
      if (i > imageArray.length - 1) {
        if (!stillgoing) {
          stillgoing = true;
          timerRunning = true;
          time = 0;
          submitScore();
        }
      } else {
        myImage.setAttribute("src", imageArray[i]);
      }
      $("#nexter").hide();
      $("#keyBtn").show();
    });
  }
}

async function app() {
  recognizer = speechCommands.create(
    "BROWSER_FFT",
    null,
    "https://ugdev.cs.smu.ca/~group12/model.json",
    "https://ugdev.cs.smu.ca/~group12/metadata.json"
  );
  await recognizer.ensureModelLoaded();
  predictWord();
}
