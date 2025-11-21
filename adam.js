// Pobieramy elementy z DOM
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('mainNav');
const navLinks = document.querySelectorAll('.nav a');

// Funkcja do toggle menu
function toggleMenu() {
hamburger.classList.toggle('active');
nav.classList.toggle('active');

// Blokujemy/przywracamy scroll na body gdy menu jest otwarte
if (nav.classList.contains('active')) {
document.body.style.overflow = 'hidden';
} else {
document.body.style.overflow = 'auto';
}
}

// Event listener dla hamburgera
hamburger.addEventListener('click', toggleMenu);

// Event listener dla każdego linka w nawigacji
navLinks.forEach(link => {
link.addEventListener('click', () => {
// Zamykamy menu po kliknięciu w link (na mobile)
if (window.innerWidth <= 768) {
hamburger.classList.remove('active');
nav.classList.remove('active');
document.body.style.overflow = 'auto';
}

// Dodajemy efekt kliknięcia
link.style.transform = 'scale(0.95)';
setTimeout(() => {
link.style.transform = '';
}, 200);
});
});

// Zamykamy menu gdy klikniemy poza nim
document.addEventListener('click', (e) => {
if (!hamburger.contains(e.target) && !nav.contains(e.target)) {
hamburger.classList.remove('active');
nav.classList.remove('active');
document.body.style.overflow = 'auto';
}
});

// Obsługa zmiany rozmiaru okna
window.addEventListener('resize', () => {
if (window.innerWidth > 768) {
// Na desktop zawsze pokazujemy menu i resetujemy styl body
nav.classList.remove('active');
hamburger.classList.remove('active');
document.body.style.overflow = 'auto';
}
});

// Dodajemy smooth scroll dla anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
anchor.addEventListener('click', function (e) {
e.preventDefault();
const target = document.querySelector(this.getAttribute('href'));
if (target) {
target.scrollIntoView({
behavior: 'smooth',
block: 'start'
});
}
});
});

// Dodajemy efekt parallax dla headera
window.addEventListener('scroll', () => {
const header = document.querySelector('.header');
const scrolled = window.pageYOffset;
const rate = scrolled * -0.5;

header.style.transform = `translateY(${rate}px)`;
});

// Dodajemy efekt ładowania strony
window.addEventListener('load', () => {
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease';

setTimeout(() => {
document.body.style.opacity = '1';
}, 100);
});

const accordionButtons = document.querySelectorAll(".accordion-btn");

accordionButtons.forEach(button => {
    button.addEventListener("click", () => {
        const content = button.nextElementSibling;

        content.classList.toggle("show");
        button.classList.toggle("active");
    });
});

const form = document.getElementById("contactForm");
const button = document.getElementById("sendBtn");
const successMsg = document.getElementById("success");
const errorMsg = document.getElementById("error");

form.addEventListener("submit", async (event) => {
event.preventDefault();

// =============================
// ✅ HONEYPOT – BOT STOP
// =============================
const botField = document.getElementById("honeypot").value;
if (botField !== "") {
console.log("Zablokowano bota.");
return;
}

// =============================
// ✅ SANITIZACJA INPUTÓW
// =============================
function sanitize(input) {
return input
.replace(/</g, "&lt;")
.replace(/>/g, "&gt;");
}

const name = sanitize(document.getElementById("name").value.trim());
const email = sanitize(document.getElementById("email").value.trim());
const message = sanitize(document.getElementById("message").value.trim());

// =============================
// ✅ WALIDACJA
// =============================
if (!name || !email || !message) {
errorMsg.textContent = "Uzupełnij wszystkie pola!";
errorMsg.style.display = "block";
successMsg.style.display = "none";

setTimeout(() => {
errorMsg.style.display = "none";
}, 3000);
return;
}

// =============================
// ✅ BLOKADA PRZYCISKU
// =============================
button.disabled = true;
button.textContent = "Wysyłanie...";

try {
// =============================
// ✅ WYSYŁKA NA FORMSPREE
// =============================
const response = await fetch(form.action, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ name, email, message })
});

// =============================
// ✅ GDY OK
// =============================
if (response.ok) {
successMsg.style.display = "block";
errorMsg.style.display = "none";
form.reset();

setTimeout(() => {
successMsg.style.display = "none";
}, 3000);

} else {
// =============================
// ✅ GDY ERROR Z SERWERA
// =============================
errorMsg.style.display = "block";
successMsg.style.display = "none";

setTimeout(() => {
errorMsg.style.display = "none";
}, 3000);
}

} catch (err) {
// =============================
// ✅ GDY CRASH / BRAK INTERNETU
// =============================
errorMsg.style.display = "block";
successMsg.style.display = "none";

setTimeout(() => {
errorMsg.style.display = "none";
}, 3000);
}

// =============================
// ✅ ODBLOKOWANIE BUTTONA
// =============================
setTimeout(() => {
button.disabled = false;
button.textContent = "Wyślij";
}, 3000);
});