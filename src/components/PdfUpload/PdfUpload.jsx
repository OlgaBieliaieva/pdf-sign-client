import React from "react";
import style from "./PdfUpload.module.css";

const PdfUpload = ({ onFileSelected }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    onFileSelected(file); // Передаємо файл напряму
  };

  return (
    <div>
      <label className={style.iconLabel}>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className={style.visuallyHidden}
        />
        <img src="/carbon_generate-pdf.svg" alt="pdf file upload" width={24} height={24} />
      </label>
    </div>
  );
};

export default PdfUpload;
