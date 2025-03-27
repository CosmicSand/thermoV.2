// import loginToMqtt from "./ts/login";

// const loginForm = document.querySelector<HTMLFormElement>(".login-form");
// loginForm?.addEventListener("submit", loginToMqtt);

import fetch from "./ts/login";
import sensorsResponses from "./ts/login";
import SensorsResponse from "./ts/login.types";
const infoSection = document.querySelector<HTMLDivElement>(".greetings");

const loginArea = document.querySelector<HTMLDivElement>(".login");

loginArea?.classList.add("hidden");
infoSection?.classList.add("hidden");

// ==== Додавання події по кліку

document.addEventListener("click", settingsHandleClick);

fetch(import.meta.env.VITE_USERNAME, import.meta.env.VITE_PASSWORD);

// Callback function of EventListeners for settings window

async function settingsHandleClick(event: Event) {
  console.log(event.target);
  const sensor = (event.target as HTMLElement)?.dataset.name;
  const openSettingsBtn = document.querySelector(
    `.open-settings-btn[data-name=${sensor}]`
  );
  const closeSettingsBtn = document.querySelector(
    `#${sensor} .close-settings-btn`
  );
  const settingsWindow = document.querySelector(`#${sensor} .settings`);
  const stopAlarmBtn = document.querySelector(".stop-alarm-btn");
  //   console.log(openSettingsBtn);

  if (
    (event.target as HTMLElement)?.dataset.name == sensor &&
    (event.target as HTMLElement) !== openSettingsBtn &&
    (event.target as HTMLElement) !== closeSettingsBtn &&
    (event.target as HTMLElement) !== stopAlarmBtn
  ) {
    settingsWindow?.classList.remove("visually-hidden");

    //  Відкриття вікна налаштувань
  } else if ((event.target as HTMLElement) == closeSettingsBtn) {
    settingsWindow?.classList.add("visually-hidden");

    return;
  } else if ((event.target as HTMLElement) == stopAlarmBtn) {
    console.log((event.target as HTMLElement) == stopAlarmBtn);
    stopAlarm();
    sorting();
  } else {
    console.log("ddd");
  }
}

function stopAlarm(): void {
  const alarmElements = document.querySelectorAll('[data-blink="true"]');
  console.log(alarmElements);
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
