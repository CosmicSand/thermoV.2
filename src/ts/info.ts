export function swipingByNextButton(event: Event) {
  const nextBtn = document.querySelector("[data-next-button]");
  console.log(event.target !== nextBtn);
  if (event.target !== nextBtn) return;
}
