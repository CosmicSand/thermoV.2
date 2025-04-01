export function swipingByNextButton(event: Event) {
  const nextBtn = document.querySelector("[data-next-button]");
  console.log(event.target !== nextBtn);
  if (event.target !== nextBtn) return;

  const greetingsFirstPart = document.querySelector("[data-first-part]");
  const greetingsSecondPart = document.querySelector("[data-second-part]");
  greetingsFirstPart?.classList.add("anime");
  greetingsFirstPart?.addEventListener("animationend", () => {
    greetingsFirstPart?.classList.add("hidden");
    greetingsFirstPart?.classList.remove("anime");
    greetingsSecondPart?.classList.remove("hidden");
  });
}
