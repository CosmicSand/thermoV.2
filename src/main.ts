import {
  submitForLoginEventListener,
  submitModalEventListener,
  closeByClickModalEventListener,
  clickEventListenerGeneral,
  modalInputsEventListener,
} from "./ts/listeners";

submitForLoginEventListener();
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
