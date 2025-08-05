import React from "react";

function Modal({ title, open, onClose, children, onSubmit }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl text-blue-950 font-bold mb-4">{title}</h2>

        <div>{children}</div>


        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="bg-white text-gray-700 border-1 border-bg-gray-700 border-solid rounded-lg py-2 px-4 cursor-pointer mr-2 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="bg-blue-950 text-white border-1 border-bg-red-500 border-solid rounded-lg py-2 px-4 cursor-pointer hover:bg-blue-900"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
