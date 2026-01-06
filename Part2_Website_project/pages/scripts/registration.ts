document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registrationForm") as HTMLFormElement;
  
  const params = new URLSearchParams(window.location.search);
  const eventId = params.get("id");

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const payload = {
      eventId: eventId ? parseInt(eventId) : null,
      name: formData.get("name"),
      email: formData.get("email"),
      phonenumber: formData.get("phonenumber")
    };

    const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="inline-block animate-spin mr-2">◌</span> Registering...`;

    try {
      const response = await fetch("http://localhost:3000/api/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        window.location.href = "/pages/thank-you.html";
      } else {
        throw new Error("Registration failed");
      }
    } catch (err) {
      alert("Error: Could not complete registration.");
      submitBtn.disabled = false;
      submitBtn.textContent = "Register Now";
    }
  });
});