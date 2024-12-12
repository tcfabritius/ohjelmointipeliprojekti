//This file handles the mission rotation logic.


let missionId = 1; // Current mission ID

let isAnswering = false; // Prevents multiple event triggers

async function getMission(id) {
  const missionDiv = document.querySelector("#mission");
  const taskInput = document.querySelector("#taskInput");

  if (!missionDiv || !taskInput) {
    console.error("Mission or task input element is missing!");
    return;
  }

  try {
    const response = await fetch(`https://timfabritius1.pythonanywhere.com/tehtava/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch mission data");
    }

    const jsonData = await response.json();
    missionDiv.innerHTML = jsonData.text; // Display mission text
    taskInput.value = ""; // Clear input field

    // Wait for user input and handle the task
    await waitForAnswer(taskInput, jsonData);

  } catch (error) {
    console.error("Error during fetch:", error.message);
  }
}

function waitForAnswer(taskInput, jsonData) {
  return new Promise((resolve) => {
    taskInput.onkeypress = async function handleTask(event) {
      if (event.key === "Enter" && !isAnswering) {
        isAnswering = true; // Prevent double triggers
        event.preventDefault();

        // Answer validation
        if (taskInput.value === jsonData.answer) {
          // Correct answer
          await handleCorrectAnswer(jsonData);
          //external function to update table-content
          await tableCreate();
          console.log("Correct!")
          console.log("Player's answer:", taskInput.value.trim());
          console.log("Correct answer:", jsonData.answer.trim());
        } else {
          // Wrong answer
          await handleWrongAnswer();
          console.log("sorry, Wrong")
          console.log("Player's answer:", taskInput.value.trim());
          console.log("Correct answer:", jsonData.answer.trim());
        }

        taskInput.value = ""; // Clear input field
        isAnswering = false; // Allow next input
        resolve(); // Mission is completed, proceed to the next
      }
    };
  });
}

async function handleCorrectAnswer(jsonData) {
  try
  {
    const bonusResponse = await fetch(`https://timfabritius1.pythonanywhere.com/bonus/${name}/${jsonData.pay}`);

    if (!bonusResponse.ok)
        throw new Error("Failed to fetch bonus data");

    const bonusData = await bonusResponse.json();
    const doneResponse = await fetch(`https://timfabritius1.pythonanywhere.com/taskdone/${name}/${missionId}`);

    if (!doneResponse.ok)
        throw new Error("Failed to mark task as done");

    alert(bonusData.travelprompt); // Show feedback to the player
  } catch (error) {
    console.error("Error during correct answer handling:", error.message);
  }
}

async function handleWrongAnswer() {
  try
  {
    let threat = threatX * 5;
    const threatResponse = await fetch(`https://timfabritius1.pythonanywhere.com/raiseThreat/${name}/${threat}`);

    if (!threatResponse.ok)
        throw new Error("Failed to raise threat");

    const threatData = await threatResponse.json();
    console.log("Threat increased:", threatData); // Log the updated threat level
    modifyThreatBar(); //access a function in hackerGame.js
  }
  catch (error)
  {
    console.error("Error during wrong answer handling:", error.message);
  }
}

// Main function to loop through all missions
async function startMissions() {

  const statusResponse = await fetch(`https://timfabritius1.pythonanywhere.com/tulosruutu/${name}`);

    if (!statusResponse.ok)
        throw new Error("Failed to fetch bonus data");

    const statusData = await statusResponse.json();
    missionId = parseInt(statusData.tehtavat)
    missionId++;

  while (missionId <= 30)
  {
    await getMission(missionId); // Wait for the mission to complete
    missionId++;
  }
  console.log("All missions completed!");
  winnerScreen();
  }

// Start the mission loop
startMissions();