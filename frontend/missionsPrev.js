let missionId = 1; // Current mission ID
let isAnswering = false; // Prevents multiple event triggers

// Main function to loop through all missions
async function startMissions() {
  while (missionId <= 30) {
    await getMission(missionId); // Wait for the mission to complete
    missionId++;
  }
  alert("All missions completed!");
}

async function getMission(id) {
  const missionDiv = document.querySelector("#mission");
  const taskInput = document.querySelector("#tasks");

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
  try {
    const bonusResponse = await fetch(
      `https://timfabritius1.pythonanywhere.com/bonus/${name}/${jsonData.pay}`
    );
    if (!bonusResponse.ok) throw new Error("Failed to fetch bonus data");
    const bonusData = await bonusResponse.json();

    const doneResponse = await fetch(
      `https://timfabritius1.pythonanywhere.com/taskdone/${name}/${missionId}`
    );
    if (!doneResponse.ok) throw new Error("Failed to mark task as done");

    alert(bonusData.travelprompt); // Show feedback to the player
  } catch (error) {
    console.error("Error during correct answer handling:", error.message);
  }
}

async function handleWrongAnswer() {
  try {
    const threatResponse = await fetch(
      `https://timfabritius1.pythonanywhere.com/raiseThreat/${name}/5`
    );
    if (!threatResponse.ok) throw new Error("Failed to raise threat");
    const threatData = await threatResponse.json();

    console.log("Threat increased:", threatData); // Log the updated threat level
  } catch (error) {
    console.error("Error during wrong answer handling:", error.message);
  }
}

// Start the mission loop
startMissions();