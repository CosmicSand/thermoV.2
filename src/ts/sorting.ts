import SensorsResponse from "./login.types";
import StatesForSorting from "./sorting.types";

export function sorting(
  sensorsResponses: SensorsResponse,
  statesForSorting: StatesForSorting
) {
  const ownersNamesArray = Object.keys(sensorsResponses).toSorted((a, b) =>
    a.localeCompare(b)
  );
  for (let ownerName of ownersNamesArray) {
    // Array of NodeElements of sensors except boilers and gateways
    if (!statesForSorting[ownerName]) continue;

    const allSensors: NodeListOf<Element> = document.querySelectorAll(
      `[data-sensor=${ownerName}] > [data-sensor='true']`
    );

    // True array of sensors from NodeElements array
    const trueArrayOfAllSensors = [...allSensors].toSorted((a, b) =>
      a.id.localeCompare(b.id)
    );
    const ownersControlAreaForSensors = document.querySelector(
      `[data-sensor=${ownerName}]`
    ) as HTMLDivElement;

    // Clear the container before appending new elements

    ownersControlAreaForSensors.innerHTML = "";

    // Append each sensor element to the container
    trueArrayOfAllSensors.forEach((el) => {
      const element = el as HTMLDivElement;
      ownersControlAreaForSensors.appendChild(element);
    });
  }
}
export function simpleSorting(ownerName: string): void {
  const allSensors: NodeListOf<Element> = document.querySelectorAll(
    `[data-sensor=${ownerName}] > [data-sensor="true"]`
  );
  console.log(allSensors);

  // True array of sensors from NodeElements array
  const trueArrayOfAllSensors = [...allSensors].toSorted(
    (a, b) =>
      (a as HTMLElement).dataset?.name?.localeCompare(
        (b as HTMLElement).dataset?.name || ""
      ) || 0
  );
  const ownersControlAreaForSensors = document.querySelector(
    `[data-sensor=${ownerName}]`
  ) as HTMLDivElement;

  // Clear the container before appending new elements

  ownersControlAreaForSensors.innerHTML = "";

  // Append each sensor element to the container
  trueArrayOfAllSensors.forEach((el) => {
    const element = el as HTMLDivElement;
    ownersControlAreaForSensors.appendChild(element);
  });
}
