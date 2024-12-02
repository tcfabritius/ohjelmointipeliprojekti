async function getMission(id){
  const missionDiv = document.querySelector("#mission");
  try {
    const response = await fetch("https://timfabritius1.pythonanywhere.com/tehtava/"+id);
    const jsonData = await response.json();
    missionDiv.textContent = jsonData.text;
  } catch (error) {
    console.log(error.message);
  }
}
getMission(2);

const taskInput = document.querySelector("#tasks");
taskInput.addEventListener("keypress", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    taskInput.submit();
  }
});