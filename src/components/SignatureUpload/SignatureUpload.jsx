import React, { useRef } from "react";
import style from "./SignatureUpload.module.css"

const SignatureUpload = ({ onSignaturesLoaded }) => {
  const inputRef = useRef();

  const handleFiles = (files) => {
    const promises = Array.from(files).map(
      (file) =>
        new Promise((res) => {
          const reader = new FileReader();
          reader.onload = (e) => res(e.target.result);
          reader.readAsDataURL(file);
        })
    );

    Promise.all(promises).then(onSignaturesLoaded);
  };

  const onChange = (e) => {
    handleFiles(e.target.files);
    e.target.value = null; // очищуємо інпут
  };

  return (
    <div>
      <label className={style.iconLabel}>
        <input
          type="file"
          multiple
          accept="image/png, image/jpeg"
          onChange={onChange}
          ref={inputRef}
          className={style.visuallyHidden}
        />
        <img src="/hugeicons_png-02.svg" alt="signature file upload" width={24} height={24} />
      </label>
    </div>
  );
};

export default SignatureUpload;
