document.getElementById("home-btn").onclick = function() {
    if (typeof saveEmberState === 'function') saveEmberState();
    location.href = "index.html";
};
document.getElementById("showcase-btn").onclick = function() {
    if (typeof saveEmberState === 'function') saveEmberState();
    location.href = "showcase.html";
};
document.getElementById("download-btn").onclick = function() {
    if (typeof saveEmberState === 'function') saveEmberState();
    location.href = "download.html";
};
document.getElementById("contact-btn").onclick = function() {
    if (typeof saveEmberState === 'function') saveEmberState();
    location.href = "contact.html";
};