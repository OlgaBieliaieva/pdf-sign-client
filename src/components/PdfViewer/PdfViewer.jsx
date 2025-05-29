import React, { useState } from "react";
import { Document, Page } from "react-pdf";
import SignatureOverlay from "../SignatureOverlay";
import style from "./PdfViewer.module.css";

const PdfViewer = ({
  fileData,
  items,
  onItemsChange,
  availableSignatures,
  onAddSignature,
  onAddTextBlock,
  selectedPage,
  setSelectedPage,
}) => {
  const [numPages, setNumPages] = useState(null);

  const handleLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <main className={style.mainContainer}>
      <div className={style.sideBar}>
        <h3>Доступні підписи:</h3>
        <div className={style.signsList}>
          {availableSignatures.length === 0 && (
            <div>Підписи не завантажені</div>
          )}
          {availableSignatures.map((src, i) => (
            <div className={style.signThumb} key={i}>
              <img
                key={i}
                src={src}
                alt={`Підпис ${i + 1}`}
                onClick={() => onAddSignature(src, selectedPage)}
                draggable={false}
                className={style.signItem}
              />
            </div>
          ))}
        </div>

        <button onClick={() => onAddTextBlock(selectedPage)}>
          Додати текст
        </button>
      </div>

      <div className={style.docContainer}>
        <Document
        className={style.docWrapper}
          file={fileData}
          onLoadSuccess={handleLoadSuccess}
          loading="Завантаження..."
        >
          {Array.from(new Array(numPages), (_, index) => {
            const pageNum = index + 1;
            return (
              <div
                key={pageNum}
                className={style.pageWrapper}
                onClick={() => setSelectedPage(pageNum)}
              >
                <Page pageNumber={pageNum} width={600} />
                <SignatureOverlay
                  pageNumber={pageNum}
                  items={items.filter((i) => i.page === pageNum)}
                  onItemsChange={(updatedItems) => {
                    // Оновлюємо всі items, замінюючи items цієї сторінки
                    const otherPages = items.filter((i) => i.page !== pageNum);
                    onItemsChange([...otherPages, ...updatedItems]);
                  }}
                />
              </div>
            );
          })}
        </Document>
      </div>
    </main>
  );
};

export default PdfViewer;
