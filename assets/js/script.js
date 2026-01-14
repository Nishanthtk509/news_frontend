/* ===============================
   DRAWER
=============================== */

const applyBtn = document.getElementById('applyFiltersBtn');
applyBtn?.addEventListener('click', () => {
  applyFilters();
  closeDrawer();
});

const toggle = document.getElementById('navToggle');
const drawer = document.getElementById('navDrawer');
const closeBtn = document.getElementById('closeDrawer');
const backdrop = document.getElementById('backdrop');

function openDrawer() {
  drawer?.classList.add('open');
  backdrop?.classList.add('visible');
}

function closeDrawer() {
  drawer?.classList.remove('open');
  backdrop?.classList.remove('visible');
}

toggle?.addEventListener('click', openDrawer);
closeBtn?.addEventListener('click', closeDrawer);
backdrop?.addEventListener('click', closeDrawer);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeDrawer();
});


/* ===============================
   FILTERS
=============================== */

const desktopSearch = document.getElementById("desktopSearch");
const drawerSearch  = document.getElementById("drawerSearch");
const desktopCategory = document.getElementById("desktopCategory");
const desktopMedia = document.getElementById("desktopMedia");
const desktopDate = document.getElementById("desktopDate");
const drawerCategory = document.getElementById("drawerCategory");
const drawerMedia = document.getElementById("drawerMedia");
const drawerDate = document.getElementById("drawerDate");
const grid = document.getElementById("grid");
const gridCards = grid ? [...grid.querySelectorAll(".card")] : [];
const noResults = document.getElementById("noResults");

function resetFilters() {
  [desktopSearch, drawerSearch, desktopCategory, desktopMedia, desktopDate, drawerCategory, drawerMedia, drawerDate]
    .forEach(el => el && (el.value = ""));
}

function applyFilters() {
  const search = (desktopSearch?.value || drawerSearch?.value || "").toLowerCase();
  const cat = desktopCategory?.value || drawerCategory?.value || "";
  const med = desktopMedia?.value || drawerMedia?.value || "";
  const date = desktopDate?.value || drawerDate?.value || "";

  let count = 0;
  gridCards.forEach(card => {
    const ok =
      (!search || card.textContent.toLowerCase().includes(search)) &&
      (!cat || card.dataset.category === cat) &&
      (!med || card.dataset.media === med) &&
      (!date || card.dataset.date === date);

    card.style.display = ok ? "" : "none";
    if (ok) count++;
  });

  noResults?.classList.toggle("hidden", count !== 0);
}

[desktopSearch, drawerSearch].forEach(el => el?.addEventListener("input", applyFilters));
[desktopCategory, desktopMedia, desktopDate, drawerCategory, drawerMedia, drawerDate]
  .forEach(el => el?.addEventListener("change", applyFilters));

resetFilters();
applyFilters();


/* ===============================
   THEME
=============================== */

const desktopToggle = document.getElementById("themeToggle");
const mobileToggle = document.getElementById("themeToggleMobile");

const themes = {
  dark: {
    body: "#000", text: "#fff", drawer: "#18181b", modal:"#0008", modalContent:"#111"
  },
  light: {
    body: "#fff", text:"#000", drawer:"#f5f5f5", modal:"#0006", modalContent:"#fff"
  }
};

function applyTheme(theme){
  const s = themes[theme];
  document.body.style.background = s.body;
  document.body.style.color = s.text;

  document.getElementById("navDrawer")?.style.setProperty("background", s.drawer);
  document.getElementById("modal")?.style.setProperty("background", s.modal);
  document.getElementById("modalContent")?.style.setProperty("background", s.modalContent);

  localStorage.setItem("theme", theme);
}

const savedTheme = localStorage.getItem("theme") || "light";
applyTheme(savedTheme);
if (desktopToggle) desktopToggle.checked = savedTheme === "dark";
if (mobileToggle) mobileToggle.checked = savedTheme === "dark";

desktopToggle?.addEventListener("change", () => {
  const t = desktopToggle.checked ? "dark" : "light";
  applyTheme(t);
  if (mobileToggle) mobileToggle.checked = desktopToggle.checked;
});

mobileToggle?.addEventListener("change", () => {
  if (desktopToggle) {
    desktopToggle.checked = mobileToggle.checked;
    desktopToggle.dispatchEvent(new Event("change"));
  }
});


/* ===============================
   LOGIN MODAL
=============================== */

let loginClickCount = 0;

const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");
const layer = document.getElementById("successLayer");
const spinner = document.getElementById("spinner");
const check = document.getElementById("checkmark");
const cross = document.getElementById("cross");
const textSuccess = document.getElementById("successText");
const textFail = document.getElementById("failText");
const pulse = document.getElementById("pulseBg");

function openModal(){
  closeDrawer();
  modal?.classList.remove("hidden");
  modal?.classList.add("flex");
  modalContent?.classList.remove("modal-slide-out","shake");
}

function resetAnimations(){
  spinner?.classList.remove("hidden");
  check?.classList.add("hidden");
  cross?.classList.add("hidden");
  textSuccess?.classList.add("hidden");
  textFail?.classList.add("hidden");
  pulse?.classList.add("hidden");
}

function simulateLogin(){
  openModal();
  loginClickCount++;

  if(loginClickCount % 2) showFail();
  else showSuccess();
}

function showSuccess(){
  resetAnimations();
  layer?.classList.remove("hidden");

  setTimeout(()=>{
    spinner?.classList.add("hidden");
    check?.classList.remove("hidden");
    textSuccess?.classList.remove("hidden");
    pulse?.classList.remove("hidden");

    setTimeout(()=>{
      modal?.classList.add("hidden");
      layer?.classList.add("hidden");
      resetAnimations();
    },1200);
  },1000);
}

function showFail(){
  resetAnimations();
  layer?.classList.remove("hidden");

  setTimeout(()=>{
    spinner?.classList.add("hidden");
    cross?.classList.remove("hidden");
    textFail?.classList.remove("hidden");
    modalContent?.classList.add("shake");

    setTimeout(()=>{
      modalContent?.classList.remove("shake");
      layer?.classList.add("hidden");
    },1000);
  },800);
}

/* ===============================
   MODAL CLOSE
=============================== */

function closeModal() {
  modalContent?.classList.add("modal-slide-out");

  setTimeout(() => {
    modal?.classList.add("hidden");
    modal?.classList.remove("flex");
    layer?.classList.add("hidden");
    resetAnimations();
  }, 300);
}


/* ===============================
   NAVBAR BACKGROUND ON SCROLL
=============================== */

const navbar = document.querySelector("nav");

function updateNavbarBg() {
  if (!navbar) return;

  if (window.scrollY > 10) {
    // Light or dark mode aware
    const isDark = localStorage.getItem("theme") === "dark";

    navbar.style.background = isDark
      ? "rgba(0,0,0,0.75)"
      : "rgba(255,255,255,0.95)";

    navbar.style.backdropFilter = "blur(10px)";
    navbar.style.borderBottom = isDark
      ? "1px solid rgba(255,255,255,0.08)"
      : "1px solid rgba(0,0,0,0.08)";
  } else {
    // Reset to transparent
    navbar.style.background = "transparent";
    navbar.style.backdropFilter = "none";
    navbar.style.borderBottom = "none";
  }
}

window.addEventListener("scroll", updateNavbarBg);
updateNavbarBg();


const signupModal = document.getElementById("signupModal");
const signupContent = document.getElementById("signupContent");
const signupBtn = document.getElementById("signupBtn");
const signupError = document.getElementById("signupError");

function openSignup() {
  closeModal(); // close login modal if open
  signupModal?.classList.remove("hidden");
  signupModal?.classList.add("flex");
}

function closeSignup() {
  signupModal?.classList.add("hidden");
  signupModal?.classList.remove("flex");
  signupError?.classList.add("hidden");

  // Reset fields
  document.getElementById("signupUsername").value = "";
  document.getElementById("signupPassword").value = "";
  document.getElementById("signupConfirm").value = "";
}

// Switch between login and signup modals
function switchToLogin() {
  closeSignup();
  openModal();
}

// Signup button logic
signupBtn?.addEventListener("click", () => {
  const username = document.getElementById("signupUsername").value.trim();
  const password = document.getElementById("signupPassword").value;
  const confirm = document.getElementById("signupConfirm").value;

  if (!username || !password || !confirm) {
    signupError.textContent = "All fields are required.";
    signupError.classList.remove("hidden");
    return;
  }

  if (password !== confirm) {
    signupError.textContent = "Passwords do not match!";
    signupError.classList.remove("hidden");
    return;
  }

  // ✅ Successful signup simulation using animation
  signupError.classList.add("hidden");
  showSignupSuccess(username); // replace alert with animation
});


function showSignupSuccess(username) {
  resetAnimations(); // reuse your existing function
  layer?.classList.remove("hidden");

  textSuccess.textContent = `Account created for: ${username}`;
  textSuccess.classList.remove("hidden");

  setTimeout(() => {
    spinner?.classList.add("hidden");
    check?.classList.remove("hidden");
    pulse?.classList.remove("hidden");

    setTimeout(() => {
      signupModal?.classList.add("hidden");
      layer?.classList.add("hidden");
      resetAnimations();
    }, 1200);
  }, 500);
}

function showSignupFail(message) {
  resetAnimations();
  layer?.classList.remove("hidden");

  textFail.textContent = message;
  textFail.classList.remove("hidden");

  cross?.classList.remove("hidden");
  pulse?.classList.add("hidden");

  setTimeout(() => {
    layer?.classList.add("hidden");
    resetAnimations();
  }, 1200);
}


/* ===============================
   FORGOT PASSWORD MODAL
=============================== */

const forgotModal = document.getElementById("forgotModal");
const forgotContent = document.getElementById("forgotContent");
const forgotBtn = document.getElementById("forgotBtn");
const forgotError = document.getElementById("forgotError");

function openForgot() {
  closeModal();       // close login modal if open
  closeSignup();      // close signup modal if open
  forgotModal?.classList.remove("hidden");
  forgotModal?.classList.add("flex");
}

function closeForgot() {
  forgotModal?.classList.add("hidden");
  forgotModal?.classList.remove("flex");
  forgotError?.classList.add("hidden");

  // Reset field
  document.getElementById("forgotUsername").value = "";
}

// Switch back to login
function switchToLoginFromForgot() {
  closeForgot();
  openModal();
}

// Forgot password button logic
forgotBtn?.addEventListener("click", () => {
  const username = document.getElementById("forgotUsername").value.trim();

  if (!username) {
    forgotError.textContent = "Please enter your username or email.";
    forgotError.classList.remove("hidden");
    return;
  }

  // ✅ Simulate password reset success
  forgotError.classList.add("hidden");
  showForgotSuccess(username);
});

// Show success animation for forgot password
function showForgotSuccess(username) {
  resetAnimations(); // reuse existing spinner/check/pulse
  layer?.classList.remove("hidden");

  textSuccess.textContent = `Password reset link sent to: ${username}`;
  textSuccess.classList.remove("hidden");

  setTimeout(() => {
    spinner?.classList.add("hidden");
    check?.classList.remove("hidden");
    pulse?.classList.remove("hidden");

    setTimeout(() => {
      forgotModal?.classList.add("hidden");
      layer?.classList.add("hidden");
      resetAnimations();
    }, 1200);
  }, 500);
}

// Show failure (optional)
function showForgotFail(message) {
  resetAnimations();
  layer?.classList.remove("hidden");

  textFail.textContent = message;
  textFail.classList.remove("hidden");

  cross?.classList.remove("hidden");
  pulse?.classList.add("hidden");

  setTimeout(() => {
    layer?.classList.add("hidden");
    resetAnimations();
  }, 1200);
}



  function toggleLike(btn) {
    const icon = btn.querySelector("i");

    icon.classList.toggle("ph-heart");
    icon.classList.toggle("ph-fill");

    btn.classList.toggle("text-red-500");
  }








