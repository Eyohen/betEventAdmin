import React from "react";

const ConfirmationPopup = ({ email, onCancel, onConfirm }) => {
  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-300 p-4 rounded shadow-lg z-50">
      <p className="mb-2">
        Are you sure you want to mark participant with email: {email}?
      </p>
      <button
        className="px-4 py-2 bg-red-500 text-white rounded mr-2"
        onClick={onCancel}
      >
        Cancel
      </button>
      <button
        className="px-4 py-2 bg-green-500 text-white rounded"
        onClick={onConfirm}
      >
        Confirm
      </button>
    </div>
  );
};

export default ConfirmationPopup;
