import ReactModal from "react-modal";
import React, { FormEvent } from "react";
import Image from "next/image";
import { CustomModalProps } from "../utils/types";

export default function CustomModal(props: CustomModalProps) {
  const { handleModalSubmit, isOpen, userName, handleUsernameInput } = props;
  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleModalSubmit();
  };

  return (
    <ReactModal
      style={{
        // Add your custom modal styles here
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.75)",
        },
        content: {
          width: "80%",
          margin: "auto",
        },
      }}
      isOpen={isOpen}
    >
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            src="/profile.svg"
            alt="profile"
            className="mx-auto"
            width={50}
            height={50}
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            닉네임을 입력해 주세요
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleFormSubmit}>
            <div>
              <div className="mt-2">
                <input
                  required
                  className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="닉네임을 입력해 주세요"
                  type="text"
                  value={userName}
                  onChange={handleUsernameInput}
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                확인
              </button>
            </div>
          </form>
        </div>
      </div>
    </ReactModal>
  );
}
