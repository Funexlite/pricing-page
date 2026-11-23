"use strict";


// DOM: get Elements
const billingGroup = document.querySelector(".billing");
const billingButtons = document.querySelectorAll("[data-billing-option]");
const prices = document.querySelectorAll(".price");
const billingStatus = document.querySelector("#billing-status");
const triggers = [...document.querySelectorAll(".faq-trigger")];

let billing = "monthly";


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