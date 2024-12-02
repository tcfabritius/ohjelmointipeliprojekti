'use strict';

// get current player location
async function getCurrentLocation(name){
        try {
        const response = await fetch("https://timfabritius1.pythonanywhere.com/getLocation/"+name);
        const jsonData = await response.json();
        map.setView(new L.LatLng(jsonData.latitude_deg, jsonData.longitude_deg), 12);
        L.marker([jsonData.latitude_deg, jsonData.longitude_deg]).addTo(map);
    } catch (error) {
        console.log(error.message);
    }
}

// change location, location ICAO
const locQuery = document.querySelector("#icaoSearch");
locQuery.addEventListener("submit", async function changeLocation(evt) {
    evt.preventDefault();
    // get value of input element
    const criteria = document.getElementById("icao").value;
    //console.log(criteria);
    try {

        const response = await fetch(`http://timfabritius1.pythonanywhere.com/matkusta/${name}/${criteria}`);
        const jsonData = await response.json();
        await tableCreate();

        // update map
        map.setView(new L.LatLng(jsonData.latitude_deg, jsonData.longitude_deg), 12);
        L.marker([jsonData.latitude_deg, jsonData.longitude_deg]).addTo(map);
        document.getElementById("icao").value = "";
    } catch (error) {
        console.log(error.message);
    }
});

// get player data function
async function getPlayer(name){
    try {
        const response = await fetch("https://timfabritius1.pythonanywhere.com/pelaaja/"+name);
        const jsonData = await response.json();
        //console.log(jsonData)
        return jsonData;
    } catch (error) {
        console.log(error.message);
    }
}
// thread bar & change color function
async function modifyThreatBar() {
    const threatBar = document.getElementById("threat-bar");
    const threatValue = document.getElementById("threat-value");
    let tValue = 0;
    let bar = 25; // start value 25
    //let playerData = await getPlayer(name);
    let threatChange = 20;//playerData.threat;

        if ((threatChange - bar) > 75){
          threatBar.style.width = "100%";
        }
        else if ((threatChange + bar) < 25){
          threatBar.style.width = "25%";
        }
        else{
        bar += threatChange;
        tValue += threatChange;
        threatBar.style.width = bar + "%";
        }
        const coloring = document.getElementsByClassName("coloring");
        const borderColor = document.getElementsByClassName("border-coloring");
        const textColor = document.getElementsByClassName("text-coloring");
        const inputField = document.getElementById("icao");

        if (bar >= 50) {
            threatBar.style.backgroundColor = "#bcd65e";
            inputField.style.boxShadow = "0 1px 1px 1px #bcd65e inset";
            document.body.style.background = "linear-gradient(black, #bcd65e)";
            for(let i = 0; i < coloring.length; i++){
                coloring[i].style.backgroundColor = "#bcd65e";
            }
            for(let i = 0; i < borderColor.length; i++){
                borderColor[i].style.borderColor = "#bcd65e";
            }
            for(let i = 0; i < textColor.length; i++){
                textColor[i].style.color = "#bcd65e";
            }
        }
        if (bar >= 80) {
            threatBar.style.backgroundColor = "#d65e5e";
            inputField.style.boxShadow = "0 1px 1px 1px #d65e5e inset";
            document.body.style.background = "linear-gradient(black, #d65e5e)";
            for(let i = 0; i < coloring.length; i++){
                coloring[i].style.backgroundColor = "#d65e5e";
            }
            for(let i = 0; i < borderColor.length; i++){
                borderColor[i].style.borderColor = "#d65e5e";
            }
            for(let i = 0; i < textColor.length; i++){
                textColor[i].style.color = "#d65e5e";
            }
        }
}
// player status table
async function tableCreate() {
    let clearDiv = document.getElementById("outerStatus");
    if(clearDiv.firstChild) {
        clearDiv.removeChild(clearDiv.firstChild);
            }
    let statusDiv = document.createElement("div");
        statusDiv.setAttribute("id", "status");
        clearDiv.appendChild(statusDiv);

        let playerData = await getPlayer(name);
        const status = document.getElementById("status"),
        tbl = document.createElement("table");
        tbl.style.width = "100%";
        const row0 = tbl.insertRow();
        row0.insertCell(0).innerHTML = playerData.id;
        row0.insertCell(0).innerHTML = "PLayer:";
        const row1 = tbl.insertRow();
        row1.insertCell(0).innerHTML = "";
        row1.insertCell(0).innerHTML = "Missions completed:";
        const row2 = tbl.insertRow();
        row2.insertCell(0).innerHTML = playerData.location;
        row2.insertCell(0).innerHTML = "Location:";
        const row3 = tbl.insertRow();
        row3.insertCell(0).innerHTML = playerData.money;
        row3.insertCell(0).innerHTML = "Money:";
        const row4 = tbl.insertRow();
        row4.insertCell(0).innerHTML = playerData.co2_consumed;
        row4.insertCell(0).innerHTML = "CO2 emissions:";
    status.append(tbl);
}

//Main
getCurrentLocation(name);
modifyThreatBar();
tableCreate();