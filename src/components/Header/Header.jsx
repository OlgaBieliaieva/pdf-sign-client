import PdfUpload from "../PdfUpload/PdfUpload";
import SignatureUpload from "../SignatureUpload/SignatureUpload";
import style from "./Header.module.css";

function Header({ onFileSelected, onSignaturesLoaded, download }) {
  return (
    <header className={style.header}>
      <div className={style.headerContainer}>
        <div className={style.logoWrapper}>
          <img src="/catppuccin_pdf.svg" alt="logo" width={40} height={40} />
          <span>DocSign</span>
        </div>
        <div className={style.tools}>
          <div className={style.toolsContainer}>
            <PdfUpload onFileSelected={onFileSelected} />
            <SignatureUpload onSignaturesLoaded={onSignaturesLoaded} />
          </div>
          <button className={style.mainButton} onClick={download}>
            <img
              src="/download-rounded.svg"
              alt="logo"
              width={24}
              height={24}
            />
            Завантажити файл
          </button>
        </div>
      </div>
    </header>
  );
}
export default Header;
