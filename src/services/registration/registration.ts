document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registrationForm") as HTMLFormElement;
  const eventNameDisplay = document.getElementById("selectedEventName");

  const params = new URLSearchParams(window.location.search);
  const eventSlug = params.get("event");

  if (eventSlug && eventNameDisplay) {
    const readableName = eventSlug.replace(/-/g, " ");
    eventNameDisplay.textContent = readableName;
  }

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="inline-block animate-spin mr-2">◌</span> Processing...`;

    // Simulate API call
    setTimeout(() => {
      window.location.href = "/pages/thank-you.html";
    }, 1500);
  });
});
