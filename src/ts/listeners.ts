import {
  fetch,
  sensorsResponses,
  addToAndRefreshObject,
  isNeedsAutoSorting,
  statesForSorting,
} from "./login";
import { LoginData } from "./login.types";
import { swipingPressingBtns, swipingPressingLoginBtn } from "./info";
import { openAndCloseIndividualSettings } from "./settings";
import { stopAlarm } from "./alarm";
import { applySettings, modalWindow } from "./settings";
import { simpleSorting, simpleSortingBoilers, sorting } from "./sorting";
import { cardCreation } from "./cardcreation";

export function submitForLoginEventListener() {
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
    const topicInput = loginForm.elements.namedItem(
      "topic"
    ) as HTMLInputElement;
    const portInput = loginForm.elements.namedItem("port") as HTMLInputElement;

    const loginData: LoginData = {
      username: usernameInput.value.trim(),
      password: passwordInput.value.trim(),
      topic: topicInput.value.toUpperCase().trim(),
      port: Number(portInput.value.trim()),
    };

    fetch(loginData)
      .then((client) => {
        const { username, topic } = loginData;
        client.on("connect", () => {
          console.log("Підключено");
          client.subscribe(`${username}/${topic ? topic + "/" : "#"}`);
          // client.subscribe(`${username}/#`);
        });

        client.on("message", (_, message) => {
          const messageStr = message.toString().slice(0, -1);
          if (messageStr) {
            addToAndRefreshObject(messageStr);
            isNeedsAutoSorting(sensorsResponses);
            cardCreation(sensorsResponses);
            sorting(sensorsResponses, statesForSorting);
          }
        });

        swipingPressingLoginBtn(event);
      })
      .catch(() => {
        console.log("Fuck");
      });
  });
}

// Modal input eventListener. It enable or disable "Apply" button
export function modalInputsEventListener(
  name: string,
  high: string,
  low: string,
  alarmtime: string
) {
  modalWindow.addEventListener("input", (event: Event) => {
    const applyBtn = modalWindow.querySelector(
      "[data-apply-btn]"
    ) as HTMLButtonElement;
    const nameInput = modalWindow.querySelector(
      "[data-current-name]"
    ) as HTMLInputElement;
    const highInput = modalWindow.querySelector(
      "[data-current-high]"
    ) as HTMLInputElement;
    const lowInput = modalWindow.querySelector(
      "[data-current-low]"
    ) as HTMLInputElement;
    const alarmtimeInput = modalWindow.querySelector(
      "[data-current-time]"
    ) as HTMLInputElement;
    const activeInput = event.target as HTMLInputElement;
    if (
      ((activeInput.value.trim().length !== 0 &&
        nameInput.value.trim() !== name) ||
        highInput.value !== high ||
        lowInput.value !== low ||
        alarmtimeInput.value !== alarmtime) &&
      parseInt(highInput.value) > parseInt(lowInput.value)
    ) {
      applyBtn.disabled = false;
    } else {
      applyBtn.disabled = true;
    }
  });
}

// General click Event listener for openning modal, swiping infopage

export function clickEventListenerGeneral() {
  document.addEventListener("click", (event: Event) => {
    //   swipingSectionsPressingBtns(event);
    swipingPressingBtns(event);
    openAndCloseIndividualSettings(event);
    stopAlarm(event);
  });
}

// Event listeners for Modal - submit form and click

export function submitModalEventListener() {
  modalWindow.addEventListener("submit", (event: Event) => {
    event.preventDefault();
    applySettings(event);
    const sensorNumber = (event.target as HTMLElement)?.dataset.target;
    const ownerName = sensorNumber?.split("_")[0] || "";
    simpleSorting(ownerName);
    simpleSortingBoilers(ownerName);
  });
}

export function closeByClickModalEventListener() {
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
}
