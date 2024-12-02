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