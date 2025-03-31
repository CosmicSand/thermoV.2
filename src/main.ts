// import loginToMqtt from "./ts/login";

// const loginForm = document.querySelector<HTMLFormElement>(".login-form");
// loginForm?.addEventListener("submit", loginToMqtt);

import {
  fetch,
  saveSensorsResponsestoLocalStorage,
  sensorsResponses,
} from "./ts/login";
import { LoginData } from "./ts/login.types";
import { openAndCloseIndividualSettings } from "./ts/settings";
import { stopAlarm } from "./ts/alarm";
import { applySettings } from "./ts/settings";
import { simpleSorting } from "./ts/sorting";
import { modalWindow } from "./ts/settings";

const infoSection = document.querySelector(".greetings") as HTMLDivElement;
const loginArea = document.querySelector(".login") as HTMLDivElement;
const loginForm = document.querySelector("[data-login-form]");
export const loginData: LoginData = {
  username: import.meta.env.VITE_USERNAME,
  password: import.meta.env.VITE_PASSWORD,
  topic: import.meta.env.VITE_USER,
};

// loginArea?.classList.add("hidden");
infoSection?.classList.add("hidden");

// ==== Додавання події по кліку
loginForm?.addEventListener("submit", handleLoginSubmit);
document.addEventListener("click", settingsHandleClick);
modalWindow.addEventListener("submit", handleSubmit);
modalWindow.addEventListener("click", handleClickModal);

function handleLoginSubmit(event: Event) {
  event.preventDefault();
  console.log(event);
}

fetch(loginData);
saveSensorsResponsestoLocalStorage(loginData);

// Callback function of EventListeners for settings window

function settingsHandleClick(event: Event) {
  openAndCloseIndividualSettings(event);
  stopAlarm(event);
}

function handleSubmit(event: Event) {
  event.preventDefault();
  applySettings(event);
  const sensorNumber = (event.target as HTMLElement)?.dataset.target;
  const ownerName = sensorNumber?.split("_")[0] || "";
  simpleSorting(ownerName);
}

function handleClickModal(event: MouseEvent) {
  const dialogDimensions = modalWindow.getBoundingClientRect();
  const closeButton = (event.target as HTMLElement)?.dataset.closeBtn;
  if (
    event.clientX < dialogDimensions.left ||
    event.clientX > dialogDimensions.right ||
    event.clientY < dialogDimensions.top ||
    event.clientY > dialogDimensions.bottom ||
    closeButton
  ) {
    modalWindow.close();
  }
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
