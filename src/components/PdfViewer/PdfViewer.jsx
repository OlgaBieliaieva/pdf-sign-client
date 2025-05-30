import React, { useState, useRef, useEffect } from "react";
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
  pageDimensions,
  setPageDimensions,
}) => {
  const [numPages, setNumPages] = useState(null);
  const pageRefs = useRef({});

  const handleLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // Отримуємо фактичні розміри сторінки після рендеру
  useEffect(() => {
    if (!numPages) return;

    for (let i = 1; i <= numPages; i++) {
      const ref = pageRefs.current[i];
      if (ref) {
        const rect = ref.getBoundingClientRect();
        setPageDimensions((prev) => ({
          ...prev,
          [i]: {
            width: rect.width,
            height: rect.height,
          },
        }));
      }
    }
  }, [fileData, numPages]);

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
                <div ref={(el) => (pageRefs.current[pageNum] = el)}>
                  <Page pageNumber={pageNum} width={600} />
                </div>
                <SignatureOverlay
                  pageNumber={pageNum}
                  items={items.filter((i) => i.page === pageNum)}
                  onItemsChange={(updatedItems) => {
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
