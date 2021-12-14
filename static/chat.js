/** Chatbot - displays sample conversations.
 * Authors: Srna Bojchin and Ben Boekema*/

/**author: Ben*/
$("#tsparticles")
  .particles()
  .ajax("particles.json", function (container) {});

const selectElement = document.querySelector(".form-select");

/**Display the conversation between the player and computer and play the appropirate
 * audio when clicked - author: Srna */
selectElement.addEventListener("change", (event) => {
  const youResult = document.querySelector(".youResult");
  youResult.textContent = `${event.target.value}`;
  if (`${event.target.value}` == "Tala'sitaq l'mu'jaq?") {
    //conversation 1
    //display response
    const compResult = document.querySelector(".compResult");
    compResult.textContent = "Wesimkwatq npuktuk.";
    //play audio on click
    document.getElementById("youAudio").addEventListener("click", function () {
      var music = new Audio("../static/audio/c2.1.mp3");
      music.play();
      this.removeEventListener("click", arguments.callee);
    });
    document.getElementById("compAudio").addEventListener("click", function () {
      var music = new Audio("../static/audio/c2.2.mp3");
      music.play();
      this.removeEventListener("click", arguments.callee);
    });
  } else if (`${event.target.value}` == "Mijisin?") {
    //conversation 2
    //display response
    const compResult = document.querySelector(".compResult");
    compResult.textContent = "E'e malqutman atuomkimn.";
    //play audio on click
    document.getElementById("youAudio").addEventListener("click", function () {
      var music = new Audio("../static/audio/c3.1.mp3");
      music.play();
      this.removeEventListener("click", arguments.callee);
    });
    document.getElementById("compAudio").addEventListener("click", function () {
      var music = new Audio("../static/audio/c3.2.mp3");
      music.play();
      this.removeEventListener("click", arguments.callee);
    });
  } else if (`${event.target.value}` == "Tami elien?") {
    //conversation 3
    //display response
    const compResult = document.querySelector(".compResult");
    compResult.textContent = "Eliey nitapek.";
    //play audio on click
    document.getElementById("youAudio").addEventListener("click", function () {
      var music = new Audio("../static/audio/c4.1.mp3");
      music.play();
      this.removeEventListener("click", arguments.callee);
    });
    document.getElementById("compAudio").addEventListener("click", function () {
      var music = new Audio("../static/audio/c4.2.mp3");
      music.play();
      this.removeEventListener("click", arguments.callee);
    });
  } else if (`${event.target.value}` == "Nepan?") {
    //conversation 4
    //display response
    const compResult = document.querySelector(".compResult");
    compResult.textContent = "E'e ketuksi.";
    //play audio on click
    document.getElementById("youAudio").addEventListener("click", function () {
      var music = new Audio("../static/audio/c5.1.mp3");
      music.play();
      this.removeEventListener("click", arguments.callee);
    });
    document.getElementById("compAudio").addEventListener("click", function () {
      var music = new Audio("../static/audio/c5.2.mp3");
      music.play();
      this.removeEventListener("click", arguments.callee);
    });
  } else if (`${event.target.value}` == "Ketu almijkan kwijmuk?") {
    //conversation 5
    //display response
    const compResult = document.querySelector(".compResult");
    compResult.textContent = "Moqo, asan teke'k.";
    //play audio on click
    document.getElementById("youAudio").addEventListener("click", function () {
      var music = new Audio("../static/audio/c6.1.mp3");
      music.play();
      this.removeEventListener("click", arguments.callee);
    });
    document.getElementById("compAudio").addEventListener("click", function () {
      var music = new Audio("../static/audio/c6.2.mp3");
      music.play();
      this.removeEventListener("click", arguments.callee);
    });
  } else if (`${event.target.value}` == "Koqoey ketutmn?") {
    //conversation 6
    //display response
    const compResult = document.querySelector(".compResult");
    compResult.textContent = "Wius, tapatatk, wisawipuneksit aqq alawel.";
    //play audio on click
    document.getElementById("youAudio").addEventListener("click", function () {
      var music = new Audio("../static/audio/c8.1.mp3");
      music.play();
      this.removeEventListener("click", arguments.callee);
    });
    document.getElementById("compAudio").addEventListener("click", function () {
      var music = new Audio("../static/audio/c8.2.mp3");
      music.play();
      this.removeEventListener("click", arguments.callee);
    });
  } else if (`${event.target.value}` == "Naji kwitameyk?") {
    //conversation 7
    //display response
    const compResult = document.querySelector(".compResult");
    compResult.textContent = "A'a, skmali nmismap a'pim.";
    //play audio on click
    document.getElementById("youAudio").addEventListener("click", function () {
      var music = new Audio("../static/audio/c9.1.mp3");
      music.play();
      this.removeEventListener("click", arguments.callee);
    });
    document.getElementById("compAudio").addEventListener("click", function () {
      var music = new Audio("../static/audio/c9.2.mp3");
      music.play();
      this.removeEventListener("click", arguments.callee);
    });
  } else if (`${event.target.value}` == "Eyk ikkij ki'kuaq?") {
    //conversation 8
    //display response
    const compResult = document.querySelector(".compResult");
    compResult.textContent = "Moqo, elietaq kwijk.";
    //play audio on click
    document.getElementById("youAudio").addEventListener("click", function () {
      var music = new Audio("../static/audio/c10.1.mp3");
      music.play();
      this.removeEventListener("click", arguments.callee);
    });
    document.getElementById("compAudio").addEventListener("click", function () {
      var music = new Audio("../static/audio/c10.2.mp3");
      music.play();
      this.removeEventListener("click", arguments.callee);
    });
  } else {
    //clear out screen
    const compResult = document.querySelector(".compResult");
    compResult.textContent = "";
  }
});

/*Open when someone clicks on the span element - author: Ben*/
function openNav() {
  document.getElementById("myNav").style.width = "100%";
}

/*Close when someone clicks on the "x" symbol inside the overlay - author: Ben*/
function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}
