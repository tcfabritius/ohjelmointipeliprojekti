'use strict';

const locQuery = document.querySelector("#icao");
locQuery.addEventListener("submit", async function(evt) {
    evt.preventDefault();
    // get value of input element
    const criteria = document.getElementById("icao").value;
    console.log(criteria);
    try {
        const response = await fetch("https://timfabritius1.pythonanywhere.com/kentta/"+criteria);
        const jsonData = await response.json();
        console.log(criteria, jsonData);
    } catch (error) {
        console.log(error.message);
    }
});