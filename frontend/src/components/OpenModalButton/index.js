// frontend/src/components/OpenModalButton/index.js
import React from "react";
import { useModal } from "../../context/Modal";


function OpenModalButton({
  modalComponent, 
  buttonText, 
  onButtonClick, 
  onModalClose, 
}) {
  
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {

    if (typeof onButtonClick === "function") onButtonClick();

    if (typeof onModalClose === "function") setOnModalClose(onModalClose);
   
    setModalContent(modalComponent);
  };


  return <button onClick={onClick}>{buttonText}</button>;
}

export default OpenModalButton;
