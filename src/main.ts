// import loginToMqtt from "./ts/login";

// const loginForm = document.querySelector<HTMLFormElement>(".login-form");
// loginForm?.addEventListener("submit", loginToMqtt);

import {
  fetch,
  sensorsResponses,
  addToAndRefreshObject,
  isNeedsAutoSorting,
  statesForSorting,
} from "./ts/login";
import { LoginData } from "./ts/login.types";
import { swipingPressingBtns, swipingPressingLoginBtn } from "./ts/info";
import { openAndCloseIndividualSettings } from "./ts/settings";
import { stopAlarm } from "./ts/alarm";
import { applySettings } from "./ts/settings";
import { simpleSorting, sorting } from "./ts/sorting";
import { cardCreation } from "./ts/cardcreation";
import { modalWindow } from "./ts/settings";

const infoSection = document.querySelector(".greetings") as HTMLDivElement;
const loginArea = document.querySelector(".login") as HTMLDivElement;
const monitorArea = document.querySelector(".monitor") as HTMLDivElement;
const loginForm = document.querySelector("[data-login-form]");
export const loginData: LoginData = {
  username: import.meta.env.VITE_USERNAME,
  password: import.meta.env.VITE_PASSWORD,
  topic: import.meta.env.VITE_USER,
};
// loginArea?.classList.add("hidden");
// infoSection?.classList.add("hidden");

// ==== Додавання подій

loginForm?.addEventListener("submit", (event: Event) => {
  event.preventDefault();
  const loginForm = event.currentTarget as HTMLFormElement;
  const usernameInput = loginForm.elements.namedItem(
    "name"
  ) as HTMLInputElement;
  const passwordInput = loginForm.elements.namedItem(
    "password"
  ) as HTMLInputElement;
  const topicInput = loginForm.elements.namedItem("topic") as HTMLInputElement;
  const portInput = loginForm.elements.namedItem("port") as HTMLInputElement;

  const username = usernameInput.value.toLowerCase();
  const password = passwordInput.value.toLowerCase();
  const topic = passwordInput.value.toUpperCase();
  const port = passwordInput.value;

  fetch(loginData)
    .then((client) => {
      const { username, topic } = loginData;

      client.on("connect", () => {
        console.log("Підключено");
        client.subscribe(`${username}/${topic ? topic + "/" : "#"}`);
      });

      client.on("message", (_, message) => {
        const messageStr = message.toString().slice(0, -1);
        console.log(messageStr);
        if (messageStr) {
          addToAndRefreshObject(messageStr);
          isNeedsAutoSorting(sensorsResponses);
          cardCreation(sensorsResponses);
          sorting(sensorsResponses, statesForSorting);
        }
      });

      //   saveSensorsResponsestoLocalStorage(loginData);
      swipingPressingLoginBtn(event);
    })
    .catch(() => {
      console.log("fuck");
    });

  //   infoSection?.classList.remove("hidden");
  //   monitorArea?.classList.remove("hidden");
});
document.addEventListener("click", (event: Event) => {
  //   swipingSectionsPressingBtns(event);
  swipingPressingBtns(event);
  openAndCloseIndividualSettings(event);
  stopAlarm(event);
});
modalWindow.addEventListener("submit", (event: Event) => {
  event.preventDefault();
  applySettings(event);
  const sensorNumber = (event.target as HTMLElement)?.dataset.target;
  const ownerName = sensorNumber?.split("_")[0] || "";
  simpleSorting(ownerName);
});
modalWindow.addEventListener("click", (event: MouseEvent) => {
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
});

// fetch(loginData);
// saveSensorsResponsestoLocalStorage(loginData);

// ==== Функція сортування
// function sorting() {
//   const allSensors: NodeListOf<Element> = document.querySelectorAll(
//     "[data-sensor='true']"
//   );
//   const arrayOfAllSensors = [...allSensors].toSorted((a, b) =>
//     a.id.localeCompare(b.id)
//   );
//   const ownersControlAreaForSensors = document.querySelector(
//     `[data-sensor=${import.meta.env.VITE_USER}]`
//   ) as HTMLDivElement;

//   // Clear the container before appending new elements
//   ownersControlAreaForSensors.innerHTML = "";

//   // Append each sensor element to the container
//   arrayOfAllSensors.forEach((el) => {
//     const element = el as HTMLDivElement;
//     ownersControlAreaForSensors.appendChild(element);
//   });
// }
