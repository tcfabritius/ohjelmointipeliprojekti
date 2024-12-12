// gameOver.js

// Modal elements
const modal = document.getElementById("gameOverModal");
const skullJaw = document.getElementById("skullJaw");
const skullTop = document.getElementById("skullTop");
const restartButton = document.getElementById("restartButton");

// Function to show the modal
function gameOverModal() {
    modal.style.display = "flex";
    animateSkull();
}

// Function to animate the skull
function animateSkull() {
    let startTime = null;

    //Lerp-animation
    function lerp(start, end, t) {
        return start + t * (end - start);
    }

    function animate(time) {
        if (!startTime) startTime = time;

        //Duration (currently 1 second)
        const progress = (time - startTime) / 550;

        // Creates a looping effect
        const t = Math.abs(Math.sin(progress * Math.PI));

        // Animate jaw and skull top
        const jawY = lerp(20, 50, t);
        const topY = lerp(10, -10, t);
        skullJaw.style.transform = `translateY(${jawY}px)`;
        skullTop.style.transform = `translateY(${topY}px)`;

        // Repeat animation
        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

// Restart button functionality
    restartButton.addEventListener("click", () => {
    modal.style.display = "none";

    // Insert restart game logic here
    console.log("Game restarted");
    reload();
});

// Simulate game over (for testing, 1s)
 setTimeout(gameOverModal, 1000);
