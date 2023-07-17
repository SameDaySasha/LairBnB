import React, { useRef, useState, useContext } from "react";
import ReactDOM from "react-dom";
import "./Modal.css";

// Create a new context for the modal
const ModalContext = React.createContext();

// ModalProvider component that provides the modal context to children components
export function ModalProvider({ children }) {
  // Create a reference to attach to the modal's div, allowing us to control it
  const modalRef = useRef();
  // State to hold what will be rendered inside the modal
  const [modalContent, setModalContent] = useState(null);
  // State to hold a callback function that will be called when the modal is closing
  const [onModalClose, setOnModalClose] = useState(null);

  // Function to close the modal, reset modal content and call the onModalClose callback
  const closeModal = () => {
    // Clear the modal contents
    setModalContent(null);
    // If callback function is provided, call it and then reset it to null:
    if (typeof onModalClose === "function") {
      onModalClose();
      setOnModalClose(null);
    }
  };

  // The value that the context provider will pass down to descendants
  const contextValue = {
    modalRef, // reference to the div that the modal is rendered into
    modalContent, // content to be rendered in the modal
    setModalContent, // setter function for the content to be rendered in the modal
    setOnModalClose, // setter function for the onModalClose callback
    closeModal, // function to close the modal
  };

  // Return the provider with the value, and the children components it wraps, as well as the div the modal will be attached to
  return (
    <>
      <ModalContext.Provider value={contextValue}>
        {children}
      </ModalContext.Provider>
      <div ref={modalRef} />
    </>
  );
}

// Modal component that will be portalled into the div referenced by modalRef
export function Modal() {
  // Get modal related variables from the context
  const { modalRef, modalContent, closeModal } = useContext(ModalContext);

  // If there is no modalRef or no content for the modal, don't render anything
  if (!modalRef.current || !modalContent) return null;

  // Use createPortal to render the modal into the div referenced by modalRef
  return ReactDOM.createPortal(
    <div id="modal">
     
      <div id="modal-background" onClick={closeModal} />
      <div id="modal-content">{modalContent}</div>
    </div>,
    modalRef.current
  );
}

// Export a hook that provides the modal context
export const useModal = () => useContext(ModalContext);
