import { showNotification } from "./showNotification";

export const copyToClipboard = (value: string) => {
  try {
    const textArea = document.createElement("textarea");
    textArea.value = value;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);

    showNotification({
      title: "Copied to clipboard",
      description: value,
    });
  } catch (error) {
    console.error("Failed to copy text:", error);
  }
};
