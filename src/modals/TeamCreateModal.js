import React from "react";

const TeamNotCreatedModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-8 max-w-lg w-4/5 mx-auto">
        <h2 className="text-lg font-bold mb-4 text-center">チーム未作成</h2>
        <p className="text-center">チームが作成されるまでお待ちください</p>
        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={onClose}
            className="mt-8 col-span-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            はい
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamNotCreatedModal;
