import { animate } from "motion";

export type NotificationOptions = {
  title: string;
  description?: string;
  duration?: number;
  type?: "success" | "error" | "info";
};

export function showNotification({
  title,
  description,
  duration = 0.5,
  type = "success",
}: NotificationOptions) {
  const alertDiv = document.createElement("div");
  alertDiv.innerHTML = `
    <strong>${title}</strong>
    ${description ? `<p>${description}</p>` : ""}
  `;
  alertDiv.style.position = "fixed";
  alertDiv.style.top = "80px";
  alertDiv.style.right = "100px";
  alertDiv.style.backgroundColor =
    type === "success" ? "#4CAF50" : type === "error" ? "#F44336" : "#2196F3";
  alertDiv.style.color = "white";
  alertDiv.style.padding = "10px 20px";
  alertDiv.style.borderRadius = "5px";
  alertDiv.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
  alertDiv.style.opacity = "0";
  alertDiv.style.zIndex = "9999999";

  document.body.appendChild(alertDiv);

  // Animate appearance
  animate(alertDiv, { opacity: 1, top: "100px" }, { duration });

  // Remove the alert after 3 seconds
  setTimeout(() => {
    animate(alertDiv, { opacity: 0, top: "80px" }, { duration }).finished.then(
      () => {
        document.body.removeChild(alertDiv);
      }
    );
  }, 5000);
}
