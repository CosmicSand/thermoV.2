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
import { simpleSorting, sorting } from "./ts/sorting";
import { cardCreation } from "./ts/cardcreation";
import {
  submitModalEventListener,
  closeByClickModalEventListener,
  clickEventListenerGeneral,
} from "./ts/listeners";

const loginData: LoginData = {
  username: import.meta.env.VITE_USERNAME,
  password: import.meta.env.VITE_PASSWORD,
  topic: import.meta.env.VITE_USER,
};
// loginArea?.classList.add("hidden");
// infoSection?.classList.add("hidden");

// ==== Додавання подій
const loginForm = document.querySelector("[data-login-form]");
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

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  const topic = topicInput.value.toUpperCase().trim();
  const port = portInput.value.trim();

  fetch(loginData)
    .then((client) => {
      const { username, topic } = loginData;

      client.on("connect", () => {
        console.log("Підключено");
        client.subscribe(`${username}/${topic ? topic + "/" : "#"}`);
      });

      client.on("message", (_, message) => {
        const messageStr = message.toString().slice(0, -1);
        // console.log(messageStr);
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
      console.log("Fuck");
    });
});

clickEventListenerGeneral();
submitModalEventListener();
closeByClickModalEventListener();

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
