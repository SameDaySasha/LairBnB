import { useModal } from "../../context/Modal";

function ConfirmDeleteModal({ onConfirm, itemType }) {
  const { closeModal } = useModal();

  return (
    <div>
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to delete this {itemType}?</p>
      <button onClick={onConfirm}>Yes (Delete {itemType})</button>
      <button onClick={closeModal}>No (Keep {itemType})</button>
    </div>
  );
}

export default ConfirmDeleteModal;
