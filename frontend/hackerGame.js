'use strict';

// Music
function toggleMusic() {
    if (music.paused) {
        music.play();
    } else {
        music.pause();
    }
}

// create player id
async function initPlayer(name) {
        try {
            const responseP = await fetch(`http://timfabritius1.pythonanywhere.com/init/${name}`);
            if (!responseP.ok) {
                throw new Error("Failed to init player");
            }
        } catch (error) {
            console.log(error.message);
        }
}

// get current player location
async function getCurrentLocation(name){
        try {
        const response = await fetch("https://timfabritius1.pythonanywhere.com/getLocation/"+name);
        if (!response.ok) {
            throw new Error("Failed to load location");
        }
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
        if (!response) {
            throw new Error("Failed to load location data");
        }
        const jsonData = await response.json();
        await tableCreate();
        // update map
        map.setView(new L.LatLng(jsonData.latitude_deg, jsonData.longitude_deg), 12);
        L.marker([jsonData.latitude_deg, jsonData.longitude_deg]).addTo(map);
        document.getElementById("icao").value = "";
        const responseA = await fetch("http://timfabritius1.pythonanywhere.com/kentta/"+ criteria);
        const airportData =await responseA.json();
        const city = airportData.municipality;
        const responseH = await fetch(`http://timfabritius1.pythonanywhere.com/hotelPrice/${city}`);
        if (!response) {
            throw new Error("Failed to load location data");
        }
        const hotelData = await responseH.json();

        const playerChoise = confirm(`Do you want to book ${hotelData.name} : ${Math.floor(hotelData.price)}`)
        if (playerChoise === true){
            await fetch(`http://timfabritius1.pythonanywhere.com/invoice/${name}/${Math.floor(hotelData.price)}`);
            // update player game status
            threatX = 1;
        }
        else {
            threatX = 2;
        }
    } catch (error) {
        console.log(error.message);
    }
});

//change country
const srcBtn = document.querySelector("#srcBtn");
srcBtn.addEventListener("click", async function changeCountry(evt) {
    evt.preventDefault();
    let selectCountry =document.createElement("select");
    selectCountry.setAttribute("id", "selectC");
    selectCountry.setAttribute("size", "7");
    try {
        const responseC = await fetch("http://timfabritius1.pythonanywhere.com/maat");
        if (!responseC.ok) {
            throw new Error("Failed to load countries data");
        }
        const countriesData = await responseC.json();
        console.log(countriesData);
        let countries = countriesData.countries;
        for (let i = 0; i < countries.length; i++){
            let option = document.createElement("option");
            option.value = countries[i].name;
            option.appendChild(document.createTextNode(countries[i].name));
            selectCountry.appendChild(option);
        }
            let clearDiv = document.getElementById("outerMenu");
    if (clearDiv.firstChild) {
        clearDiv.removeChild(clearDiv.firstChild);
    }
    let menuDiv = document.createElement("div");
    menuDiv.setAttribute("id", "menu");
    clearDiv.appendChild(menuDiv);
    menu.append(selectCountry);
    //get player selection
    selectCountry.onchange = function() {
        let selectedOption = selectCountry.options[selectCountry.selectedIndex];
        let countryName = selectedOption.value;
        //console.log(countryName);
    for (let i = 0; i < countries.length; i++){
        if (countries[i].name  === countryName ){
            //console.log(countries[i].iso_country);
            newAirports(countries[i].iso_country);
        }
    }
    }
    } catch (error) {
        console.log(error.message);
    }
});

// get player data function
async function getPlayer(name){
    try {
        const response = await fetch("http://timfabritius1.pythonanywhere.com/tulosruutu/"+name);
        if (!response.ok) {
            throw new Error("Failed to load player data");
        }
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

// create airport list
async function createAirportList(listData){
        let selectAirports =document.createElement("select");
        selectAirports.setAttribute("id", "selectA");
        selectAirports.setAttribute("size", "7");
        selectAirports.classList.add("container");
        let airportsData;
        if (listData === undefined) {
            airportsData = await playerAirports();
        }
        else{
            airportsData = listData;
        }
        console.log(airportsData);
        let airports = airportsData.airports;
        for (let i = 0; i < airports.length; i++){
            let option = document.createElement("option");
            option.classList.add("row");
            option.classList.add("countryAports");

            let value1 = document.createElement("div");
            value1.classList.add("col-4");
            value1.classList.add("ps-0");
            let value1col = document.createElement("p");
            value1col.appendChild(document.createTextNode(airports[i].icao_code + " "));
            value1.appendChild(value1col);

            let value2 = document.createElement("div");
            value2.classList.add("col-8");
            let value2col = document.createElement("p");
            value2col.appendChild(document.createTextNode(airports[i].name));
            value2.appendChild(value2col);

            option.appendChild(value1);
            option.appendChild(value2);
            selectAirports.appendChild(option);
        }
        return selectAirports;
}

// new country airports
async function newAirports(newCountry) {
    try {
        let airportLocation = newCountry;
        const response2 = await fetch(`http://timfabritius1.pythonanywhere.com/travel_menu/${name}/${airportLocation}`);
        if (!response2.ok) {
            throw new Error("Failed to load location airports");
        }
        const countryData = await response2.json();
        //console.log(countryData);
        if (countryData.status === 404){
            let clearDiv = document.getElementById("outerMenu");
        if (clearDiv.firstChild) {
            clearDiv.removeChild(clearDiv.firstChild);
        }
        let menuDiv = document.createElement("div");
        menuDiv.setAttribute("id", "menu");
        clearDiv.appendChild(menuDiv);
        document.getElementById("menu").innerHTML = "No airports found for the specified country";
        }
        else {
            playerMenu(countryData);
        }
    } catch (error) {
        console.log(error.message);
    }
}

// current country airports
async function playerAirports() {
    const playerData = await getPlayer(name);
    let playerLocation = playerData.location;
    try {
        const response1 = await fetch("http://timfabritius1.pythonanywhere.com/kentta/"+ playerLocation);
        if (!response1.ok) {
            throw new Error("Failed to load player location data");
        }
        const locationData = await response1.json();
        let airportLocation = locationData.iso_country;
        const response2 = await fetch(`http://timfabritius1.pythonanywhere.com/travel_menu/${name}/${airportLocation}`);
        if (!response2.ok) {
            throw new Error("Failed to load local airports");
        }
        const countryData = await response2.json();
        return countryData;
    } catch (error) {
        console.log(error.message);
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
        row1.insertCell(0).innerHTML = playerData.tehtavat;
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

// current menu list
async function playerMenu(newMenu) {
    let clearDiv = document.getElementById("outerMenu");
    if (clearDiv.firstChild) {
        clearDiv.removeChild(clearDiv.firstChild);
    }
    let menuDiv = document.createElement("div");
    menuDiv.setAttribute("id", "menu");
    clearDiv.appendChild(menuDiv);
    let currentMenu;
    if (newMenu === undefined) {
        currentMenu = await createAirportList();
    }
    else{
        currentMenu = newMenu;
        currentMenu = await createAirportList(currentMenu);
    }
    menu.append(currentMenu);
}



//Main
const name = prompt("Please type your name:");
if (name !== ""){
    initPlayer(name);
    const backgroundMusic = document.getElementById('background-music');
    document.body.addEventListener("click", () => {
        if (backgroundMusic.paused) {
            backgroundMusic.play()
                .then(() => {
                    console.log("Background music started!");
                })
                .catch(error => {
                    console.error("Error playing music:", error);
                });
        }
    });
}
let threatX = 1;
getCurrentLocation(name);
modifyThreatBar();
tableCreate();
playerMenu();
toggleMusic();

