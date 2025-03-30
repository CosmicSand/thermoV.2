// import loginToMqtt from "./ts/login";

// const loginForm = document.querySelector<HTMLFormElement>(".login-form");
// loginForm?.addEventListener("submit", loginToMqtt);

import fetch from "./ts/login";
import { closeModal, openAndCloseIndividualSettings } from "./ts/settings";
import { stopAlarm } from "./ts/alarm";
import { applySettings } from "./ts/settings";
import { simpleSorting } from "./ts/sorting";

const infoSection = document.querySelector<HTMLDivElement>(".greetings");

const loginArea = document.querySelector<HTMLDivElement>(".login");

loginArea?.classList.add("hidden");
infoSection?.classList.add("hidden");

// ==== Додавання події по кліку

document.addEventListener("click", settingsHandleClick);
document.addEventListener("submit", handleSubmit);

fetch(import.meta.env.VITE_USERNAME, import.meta.env.VITE_PASSWORD);

// Callback function of EventListeners for settings window

function settingsHandleClick(event: Event) {
  openAndCloseIndividualSettings(event);
  stopAlarm(event);
  closeModal(event);
}

function handleSubmit(event: Event) {
  event.preventDefault();
  applySettings(event);
  const sensorNumber = (event.target as HTMLElement)?.dataset.target;
  const ownerName = sensorNumber?.split("_")[0] || "";
  simpleSorting(ownerName);
}

// ==== Функція сортування
function sorting() {
  const allSensors: NodeListOf<Element> = document.querySelectorAll(
    "[data-sensor='true']"
  );
  const arrayOfAllSensors = [...allSensors].toSorted((a, b) =>
    a.id.localeCompare(b.id)
  );
  const ownersControlAreaForSensors = document.querySelector(
    `[data-sensor=${import.meta.env.VITE_USER}]`
  ) as HTMLDivElement;

  // Clear the container before appending new elements
  ownersControlAreaForSensors.innerHTML = "";

  // Append each sensor element to the container
  arrayOfAllSensors.forEach((el) => {
    const element = el as HTMLDivElement;
    ownersControlAreaForSensors.appendChild(element);
  });
}
