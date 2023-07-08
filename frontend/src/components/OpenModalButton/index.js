// frontend/src/components/OpenModalButton/index.js
import React from "react";
// Import the useModal hook from your Modal context
import { useModal } from "../../context/Modal";

// This component takes in a component to render in the modal,
// text for the button that opens the modal,
// and two optional callback functions: one for when the button is clicked
// and another for when the modal is closed
function OpenModalButton({
  modalComponent, // The component to render inside the modal
  buttonText, // The text for the button that opens the modal
  onButtonClick, // Optional: callback for when the button that opens the modal is clicked
  onModalClose, // Optional: callback for when the modal is closed
}) {
  // Retrieve the setters for the modal content and the onModalClose callback
  // from the modal context
  const { setModalContent, setOnModalClose } = useModal();

  // This function is called when the button is clicked
  const onClick = () => {
    // If the onButtonClick prop is a function, call it
    if (typeof onButtonClick === "function") onButtonClick();
    // If the onModalClose prop is a function, set it as the onModalClose callback
    if (typeof onModalClose === "function") setOnModalClose(onModalClose);
    // Set the content of the modal to the modalComponent prop
    setModalContent(modalComponent);
  };

  // Render a button with the provided buttonText, and set its onClick handler to the above function
  return <button onClick={onClick}>{buttonText}</button>;
}

export default OpenModalButton;
