async function getMission(id) {
  try {
    const response = await fetch("https://timfabritius1.pythonanywhere.com/tehtava/" + id);
    if (!response.ok) {
      throw new Error('Failed to fetch mission data');
    }
    const jsonData = await response.json();
    missionDiv.innerHTML = jsonData.text;
    const handleKeyPress = async function (event, id) {
      if (event.keyCode === 13) {
        event.preventDefault();

        try {
          let response = await fetch("https://timfabritius1.pythonanywhere.com/tehtava/" + id);
          if (!response.ok) {
            throw new Error('Failed to fetch task data');
          }
          let jsonData = await response.json();

          if (!jsonData || !jsonData.answer || !jsonData.pay) {
            console.error('Invalid response data:', jsonData);
            return;
          }

          if (taskInput.value === jsonData.answer) {
            const response1 = await fetch("https://timfabritius1.pythonanywhere.com/bonus/" + name + "/" + jsonData.pay);
            if (!response1.ok) {
              throw new Error('Failed to fetch bonus data');
            }
            const jsonData1 = await response1.json();
            const response2 = await fetch("https://timfabritius1.pythonanywhere.com/taskdone/" + name + "/" + id);
            if (!response2.ok) {
              throw new Error('Failed to mark task as done');
            }
            const jsonData2 = await response2.json();
            missionid++;
            alert(jsonData1.travelprompt);
          } else {
            const response1 = await fetch("https://timfabritius1.pythonanywhere.com/raiseThreat/5");
            if (!response1.ok) {
              throw new Error('Failed to raise threat');
            }
            const jsonData1 = await response1.json();
            console.log(jsonData1); // Process or log the response
          }
        } catch (error) {
          console.error('Error during fetch:', error.message);
        }
      }
    };

    taskInput.addEventListener("keypress", handleKeyPress);
  } catch (error) {
    console.log(error.message);
  }
}
const missionDiv = document.querySelector("#mission");
let missionid = 1;
const taskInput = document.querySelector("#tasks");
while ( missionid <= 30){
  getMission(missionid);
}



