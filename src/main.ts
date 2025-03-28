// import loginToMqtt from "./ts/login";

// const loginForm = document.querySelector<HTMLFormElement>(".login-form");
// loginForm?.addEventListener("submit", loginToMqtt);

import fetch from "./ts/login";
import openAndCloseIndividualSettings from "./ts/settings";

const infoSection = document.querySelector<HTMLDivElement>(".greetings");

const loginArea = document.querySelector<HTMLDivElement>(".login");

loginArea?.classList.add("hidden");
infoSection?.classList.add("hidden");

// ==== Додавання події по кліку

document.addEventListener("click", settingsHandleClick);

fetch(import.meta.env.VITE_USERNAME, import.meta.env.VITE_PASSWORD);

// Callback function of EventListeners for settings window

function settingsHandleClick(event: Event) {
  openAndCloseIndividualSettings(event);
  stopAlarm(event);
}

// ==== Функція зйомну блимання сигналізації

function stopAlarm(event: Event): void {
  //   const modalWindow = document.querySelector(
  //     ".modal"
  //   ) as HTMLDialogElement | null;
  //   if (!modalWindow) return;
  //   modalWindow.dataset.target = (event.target as HTMLElement)?.dataset.stopAlarm;
  //   (modalWindow as HTMLDialogElement)?.showModal();
  if (!(event.target as HTMLElement)?.dataset.stopAlarm) return;

  const alarmElements = document.querySelectorAll('[data-blink="true"]');
  alarmElements.forEach((el) => {
    (el as HTMLElement).dataset.stopped = "true";
    (el as HTMLElement).dataset.blink = "false";
  });
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
