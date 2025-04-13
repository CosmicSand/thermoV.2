import { swipingPressingBtns, swipingPressingLoginBtn } from "./info";
import { openAndCloseIndividualSettings } from "./settings";
import { stopAlarm } from "./alarm";
import { applySettings, modalWindow } from "./settings";
import { simpleSorting, sorting } from "./sorting";

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
