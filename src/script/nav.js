function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

document.getElementById("home-btn").onclick = function() {
    if (typeof saveEmberState === 'function') saveEmberState();
    location.href = "../index.html";
};
document.getElementById("projects-btn").onclick = function() {
    if (typeof saveEmberState === 'function') saveEmberState();
    location.href = "../projects/index.html";
};
document.getElementById("hobbies-btn").onclick = function() {
    if (typeof saveEmberState === 'function') saveEmberState();
    location.href = "../hobbies/index.html";
};
document.getElementById("contact-btn").onclick = function() {
    if (typeof saveEmberState === 'function') saveEmberState();
    location.href = "../contact/index.html";
};