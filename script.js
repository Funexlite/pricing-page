"use strict";


// DOM: get Elements
const billingGroup = document.querySelector(".billing");
const billingButtons = document.querySelectorAll("[data-billing-option]");
const prices = document.querySelectorAll(".price");
const billingStatus = document.querySelector("#billing-status");
const triggers = [...document.querySelectorAll(".faq-trigger")];

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let billing = "monthly";
const frames = new WeakMap();


// FAQ Accordion
function setOpen(trigger, open) {
  const panel = document.getElementById(trigger.getAttribute("aria-controls"));
  trigger.setAttribute("aria-expanded", String(open));
  panel.classList.toggle("open", open);
  panel.inert = !open; 
}

triggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const willOpen = trigger.getAttribute("aria-expanded") !== "true";
    // Only one answer open at a time
    triggers.forEach((other) => setOpen(other, other === trigger && willOpen));
  });
});

// Billing animation
function animateNumber(el, to, duration = 450) {
  cancelAnimationFrame(frames.get(el));
  const from = Number(el.textContent);
  if (reduceMotion.matches || from === to) {
    el.textContent = to;
    return;
  }
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // fast at first, then slows down
    el.textContent = Math.round(from + (to - from) * eased);
    if (progress < 1) frames.set(el, requestAnimationFrame(tick));
  }
  frames.set(el, requestAnimationFrame(tick));
}


// Billing
function renderPrice(price, animate) {
  const monthly = Number(price.dataset.monthly);
  const yearly = Number(price.dataset.yearly);
  const total = Number(price.dataset.yearlyTotal);
  const value = billing === "yearly" ? yearly : monthly;

  const amount = price.querySelector(".amount");
  const per = price.querySelector(".per");
  const readout = price.querySelector(".price-text"); 
  const note = price.closest(".plan").querySelector(".billing-note");

  if (animate) animateNumber(amount, value);
  else amount.textContent = value;

  if (monthly === 0) {
    per.textContent = "";
    note.textContent = "Free forever. No card needed.";
    readout.textContent = "Free";
    return;
  }

  per.textContent = "/month";
  note.textContent = billing === "yearly" ? `Billed $${total} a year` : "Billed monthly";
  readout.textContent =
    billing === "yearly"
      ? `${value} dollars a month, billed ${total} dollars a year`
      : `${value} dollars a month, billed monthly`;
}

function setBilling(next, { animate = true, announce = true } = {}) {
  billing = next;
  billingButtons.forEach((btn) => {
    btn.setAttribute("aria-pressed", String(btn.dataset.billingOption === next));
  });
  prices.forEach((price) => renderPrice(price, animate));
  if (announce) {
    billingStatus.textContent =
      next === "yearly" ? "Showing yearly prices. You get two months free." : "Showing monthly prices.";
  }
}

billingGroup.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-billing-option]");
  if (btn && btn.dataset.billingOption !== billing) setBilling(btn.dataset.billingOption);
});

setBilling("monthly", { animate: false, announce: false });