'use strict';


const locQuery = document.querySelector("#icaoSearch");
locQuery.addEventListener("submit", async function(evt) {
    evt.preventDefault();
    // get value of input element
    const criteria = document.getElementById("icao").value;
    //console.log(criteria);
    try {
        const response = await fetch("https://timfabritius1.pythonanywhere.com/kentta/"+criteria);
        const jsonData = await response.json();
        //console.log(criteria, jsonData);
        map.setView(new L.LatLng(jsonData.latitude_deg, jsonData.longitude_deg), 12);
        document.getElementById("icao").value = "";
    } catch (error) {
        console.log(error.message);
    }
});
