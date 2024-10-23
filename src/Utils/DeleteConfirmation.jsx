import React from "react";

const DeleteConfirmation = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-5  rounded-lg shadow-lg max-w-xs w-full">
        <h2 className="text-xl font-semibold mb-4 p-5 bg-gray-300">Delete Confirmation</h2>
        <p className="mb-6">Are you sure you want to delete this item?</p>
        <div className="flex justify-between">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded "
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-black rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
