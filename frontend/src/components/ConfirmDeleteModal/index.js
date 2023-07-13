import { useModal } from "../../context/Modal";

function ConfirmDeleteModal({ onConfirm }) {
  const { closeModal } = useModal();

  return (
    <div>
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to remove this spot?</p>
      <button onClick={onConfirm}>Yes (Delete Spot)</button>
      <button onClick={closeModal}>No (Keep Spot)</button>
    </div>
  );
}

export default ConfirmDeleteModal;
