'use strict';

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
        marker = L.marker([jsonData.latitude_deg, jsonData.longitude_deg]).addTo(map);
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

        //Losescreen change 2.5
        if (jsonData.travelled === false) {
            const delResponse = await fetch(`https://timfabritius1.pythonanywhere.com/delete/${name}`)
            window.location.href = 'gameOverScreen/gameOverScreen.html';
        }

        //Losescreen change 2
        /*const statusResponse = await fetch(`https://timfabritius1.pythonanywhere.com/raiseThreat/${name}`);
        const statusData = await statusResponse.json();
        if (statusData.money <= 0){
            const delResponse = await fetch(`https://timfabritius1.pythonanywhere.com/delete/${name}`)
            window.location.href = 'gameOverScreen/gameOverScreen.html';
        }*/

        await tableCreate();
        await modifyThreatBar();

        // update map
        map.setView(new L.LatLng(jsonData.latitude_deg, jsonData.longitude_deg), 12);
        marker = L.marker([jsonData.latitude_deg, jsonData.longitude_deg]).addTo(map);

        document.getElementById("icao").value = "";
        const responseA = await fetch("http://timfabritius1.pythonanywhere.com/kentta/"+ criteria);
        const airportData =await responseA.json();

        // get hotel
        const city = airportData.municipality;
        const responseH = await fetch(`http://timfabritius1.pythonanywhere.com/hotelPrice/${city}`);
        if (!responseH) {
            throw new Error("Failed to load location data");
        }
        const hotelData = await responseH.json();
        if (hotelData.status === 200){

            const playerChoice = confirm(`Do you want to book ${hotelData.name}, price: ${Math.floor(hotelData.price)}`)
            if (playerChoice === true) {
                await fetch(
                    `http://timfabritius1.pythonanywhere.com/invoice/${name}/${Math.floor(
                        hotelData.price)}`);

                //Losescreen change 3
                const statusResponse = await fetch(`https://timfabritius1.pythonanywhere.com/raiseThreat/${name}`);
                const statusData = await statusResponse.json();
                if (statusData.money <= 0){
                    const delResponse = await fetch(`https://timfabritius1.pythonanywhere.com/delete/${name}`)
                    window.location.href = 'gameOverScreen/gameOverScreen.html';
                }

                await tableCreate();
                threatX = 1;
            }else {
                threatX = 2;
            }
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

        //console.log(countriesData);
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
    console.log('second function called!!')
    const threatBar = document.getElementById("threat-bar");
    const threatValue = document.getElementById("threat-value");
    let bar = 30; // start value
    const barWidth = {"0":"30%","10":"37%","20":"44%","30":"51%","40":"58%","50":"65%","60":"72%","70":"79%","80":"86%","90":"93%","100":"100%"};
    let playerData = await getPlayer(name);
    let threatChange = playerData.threat;
    if (threatChange > 0) {
        threatValue.innerHTML = "+" + threatChange + "%"
    }
    else {
        threatValue.innerHTML = 0 + "%"
    }
    if ((threatChange - bar) >= 70){
            threatBar.style.width = "100%";
            failureScreen();
    }
    else if ((threatChange + bar) < 30){
            threatBar.style.width = "30%";
    }
    else {
        for (let key in barWidth) {
            if (threatChange.toString() in barWidth) {
                threatBar.style.width = barWidth[threatChange.toString()];
            }
            else{
                threatBar.style.width = barWidth[(threatChange-5).toString()];
            }
        }
    }
        const coloring = document.getElementsByClassName("coloring");
        const borderColor = document.getElementsByClassName("border-coloring");
        const textColor = document.getElementsByClassName("text-coloring");
        const inputField = document.getElementById("icao");

        if (threatChange >= 50) {
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
        if (threatChange >= 80) {
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
        if (threatChange < 50) {
            threatBar.style.backgroundColor = "#5cd595";
            inputField.style.boxShadow = "0 1px 1px 1px #5cd595 inset";
            document.body.style.background = "linear-gradient(black, #5cd595)";
            for(let i = 0; i < coloring.length; i++){
                coloring[i].style.backgroundColor = "#5cd595";
            }
            for(let i = 0; i < borderColor.length; i++){
                borderColor[i].style.borderColor = "#5cd595";
            }
            for(let i = 0; i < textColor.length; i++){
                textColor[i].style.color = "#5cd595";
            }
        }
}

// create airport list
async function createAirportList(listData){
        let selectAirports =document.createElement("div");
        selectAirports.setAttribute("id", "selectA");
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
            let option = document.createElement("div");
            option.classList.add("row");

            let value1 = document.createElement("div");
            value1.classList.add("col-2");
            value1.classList.add("px-0");
            let value1col = document.createElement("p");
            value1col.classList.add("mb-0");
            value1col.appendChild(document.createTextNode(airports[i].icao_code + " "));
            value1.appendChild(value1col);

            let value2 = document.createElement("div");
            value2.classList.add("col-10");
            let value2col = document.createElement("p");
            value2col.classList.add("mb-0");
            value2col.appendChild(document.createTextNode(airports[i].name));
            value2.appendChild(value2col);

            let value0 = document.createElement("div");
            value0.classList.add("col-2");
            value0.classList.add("ps-0");
            let value0col = document.createElement("p");
            value0col.classList.add("mb-0");
            value0col.appendChild(document.createTextNode( "   "));
            value0.appendChild(value0col);

            let value3 = document.createElement("div");
            value3.classList.add("col-5");
            //value3.classList.add("ps-0");
            let value3col = document.createElement("p");
            value3col.classList.add("mb-0");
            value3col.appendChild(document.createTextNode("Price: " +airports[i].price + " "));
            value3.appendChild(value3col);

            let value4 = document.createElement("div");
            value4.classList.add("col-5");
            let value4col = document.createElement("p");
            value4col.classList.add("mb-0");
            value4col.appendChild(document.createTextNode("CO2 value: "+airports[i].co2_emissions));
            value4.appendChild(value4col);

            option.appendChild(value1);
            option.appendChild(value2);
            option.appendChild(value0);
            option.appendChild(value3);
            option.appendChild(value4);

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

// player status table > needs export for external use
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
        row0.insertCell(0).innerHTML = "Player:";
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

// function winnerScreen
function winnerScreen() {
    //set canvas
    document.getElementById("mission").remove();
    document.getElementById("tasks").remove();
    document.querySelector("canvas").style.width = "432px";
    document.querySelector("canvas").style.height = "192px";
    const canvas = document.querySelector("canvas"),
    ctx = canvas.getContext("2d");

    // size of the canvas
    canvas.width = window.innerWidth/1.6;
    console.log(window.innerWidth/1.6);
    if (window.innerWidth/1.6 < 432){
        canvas.width = 432;
    }
    canvas.height = window.innerHeight/2;
    if (window.innerHeight/2 < 192){
        canvas.height = 192;
    }

    // draw drops
    let numbers = "0101010111001100001111100100101001001101000111001010001010001010010100010010101010010101000101110110011110110010110101001000101000110100101001011100110";
    numbers = numbers.split("");
    // columns
    let fontSize = 12,
        columns = canvas.width / fontSize;
    const drops = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }
    function drawBackground() {
        ctx.fillStyle = "rgba(0, 0, 0, .1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = "12px serif";
        for (let i = 0; i < drops.length; i++) {
            let text = numbers[Math.floor(Math.random() * numbers.length)];
            ctx.fillStyle = "#0f0";
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            drops[i]++;
            if (drops[i] * fontSize > canvas.height && Math.random() > .95) {
            drops[i] = 0;
             }
        }
    }

    // draw success text
    let xPos = 0;
    //console.log(canvas.width);
    let textS = "SUCCESS!";
    let i = 1;
    const grad=ctx.createLinearGradient(0,0,canvas.width/1.5,0);
    grad.addColorStop(0, "lime");
    grad.addColorStop(1, "#93E9BE");
    function textH1() {
        ctx.font = "4.5vw serif";
        ctx.textBaseline = "hanging";
        ctx.strokeStyle = grad;
        let textH = textS.substr(0, i);
        ctx.strokeText(textH, canvas.width/3, canvas.height/5);
        if (i <= textS.length){
            setTimeout(textH1, 6000);
            i++;
        }
        else{
            setTimeout(textH1, 0);
        }
    }

    // draw credits text
    function credits() {
        ctx.font = "2.5vw serif";
        ctx.textBaseline = "hanging";
        ctx.strokeStyle = grad;
        ctx.strokeText("Thank you for playing our game.", xPos+(canvas.width*1.22), canvas.height/2.5);
        ctx.strokeText("Tim Fabritius", xPos+(canvas.width*1.36), canvas.height/1.79);
        ctx.strokeText("Mikko Laakkonen", xPos+(canvas.width*1.32), canvas.height/1.49);
        ctx.strokeText("Joni Oksanen", xPos+(canvas.width*1.36), canvas.height/1.28);
        ctx.strokeText("Svetlana Kekkonen-Mattila", xPos+(canvas.width*1.26), canvas.height/1.12);
        if (window.innerWidth/1.6 < 700){
            xPos-= 0.3;
        }
        else{
            xPos-= 0.7;
            //console.log(xPos);
        }
        if(xPos < -(canvas.width*1.8)) {
            xPos = canvas.width/40;
        }
    }

// Loop animations
setInterval (textH1, 1000);
setInterval (credits, 35);
setInterval(drawBackground, 33);
}

// failureScreen
function failureScreen() {
    //set canvas
    document.getElementById("game_page").remove();
    document.getElementById("failure").style.width = "100%";
    document.getElementById("failure").style.height = "655px";
    document.getElementById("failure").innerHTML="<object type='text/html' data='gameOverScreen/gameOverScreen.html' ></object>";
}

/*
//Korjaisiko tämä?
function reload() {
    document.getElementById("failure").remove();
    document.getElementById("game_page").style.width = "100%";
    document.getElementById("game_page").style.height = "100%";
    document.getElementById("game_page").innerHTML="<object type='text/html' data='index.html' ></object>";
    window.location.href = "../index.html";
}
 */

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
                    backgroundMusic.volume = 0.1;
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
