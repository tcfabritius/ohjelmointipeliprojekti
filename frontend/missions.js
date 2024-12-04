let missionId = 1; // Nykyinen tehtävä ID
let isAnswering = false; // Estää moninkertaiset tapahtumakutsut

async function getMission(id) {
  const missionDiv = document.querySelector("#mission");
  const taskInput = document.querySelector("#tasks");

  if (!missionDiv || !taskInput) {
    console.error("Mission or task input element is missing!");
    return;
  }

  try {
    const response = await fetch("https://timfabritius1.pythonanywhere.com/tehtava/" + id);

    if (!response.ok) {
      throw new Error("Failed to fetch mission data");
    }

    const jsonData = await response.json();
    missionDiv.innerHTML = jsonData.text; // Näytetään tehtävän teksti
    //taskInput.value = ""; // Tyhjennetään syötekenttä

    // Kuunnellaan pelaajan vastausta
    taskInput.onkeypress = async function handleTask(event) {
      if (event.key === "Enter" && !isAnswering) {
        isAnswering = true; // Estä kaksoisklikkaukset
        event.preventDefault();

        //Vastaustarkistelu
        if (taskInput.value.trim().toUpperCase() === jsonData.answer.trim().toUpperCase()) {
          // Oikea vastaus
          await handleCorrectAnswer(jsonData);
          //taskInput.value = "";
          console.log("Correct!")
          console.log("Player's answer:", taskInput.value.trim());
          console.log("Correct answer:", jsonData.answer.trim());
        } else {
          // Väärä vastaus
          await handleWrongAnswer();
          //taskInput.value = "";
                    console.log("sorry, Wrong")
          console.log("Player's answer:", taskInput.value.trim());
          console.log("Correct answer:", jsonData.answer.trim());
        }

        // Siirrytään seuraavaan tehtävään
        missionId++;
        if (missionId <= 30) {
          await getMission(missionId); // Ladataan seuraava tehtävä
        } else {
          alert("Kaikki tehtävät suoritettu!");
        }

        isAnswering = false; // Sallitaan seuraava syöte
      }
    };
  } catch (error) {
    console.error("Error during fetch:", error.message);
  }
}

async function handleCorrectAnswer(jsonData) {
  try {
    const bonusResponse = await fetch(
      "https://timfabritius1.pythonanywhere.com/bonus/" + name + "/" + jsonData.pay
    );
    if (!bonusResponse.ok) throw new Error("Failed to fetch bonus data");
    const bonusData = await bonusResponse.json();

    const doneResponse = await fetch(
      "https://timfabritius1.pythonanywhere.com/taskdone/" + name + "/" + missionId
    );
    if (!doneResponse.ok) throw new Error("Failed to mark task as done");

    alert(bonusData.travelprompt); // Näytetään pelaajalle palautetta
  } catch (error) {
    console.error("Error during correct answer handling:", error.message);
  }
}

async function handleWrongAnswer() {
  try {
    const threatResponse = await fetch(
      "https://timfabritius1.pythonanywhere.com/raiseThreat/" + name + "/5"
    );
    if (!threatResponse.ok) throw new Error("Failed to raise threat");
    const threatData = await threatResponse.json();

    console.log("Threat increased:", threatData); // Näytä uhkatason päivitys
  } catch (error) {
    console.error("Error during wrong answer handling:", error.message);
  }
}

// Aloita tehtävä
getMission(missionId);
