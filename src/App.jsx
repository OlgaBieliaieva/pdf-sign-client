import React, { useState, useEffect } from "react";
import Header from "./components/Header/Header";
import PdfViewer from "./components/PdfViewer/PdfViewer";
import axios from "axios";
import style from "./App.module.css";

function App() {
  const [pdfData, setPdfData] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedPage, setSelectedPage] = useState(1);
  const [pageDimensions, setPageDimensions] = useState({});
  const [availableSignatures, setAvailableSignatures] = useState(() => {
    const saved = localStorage.getItem("savedSignatures");
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "savedSignatures",
      JSON.stringify(availableSignatures)
    );
  }, [availableSignatures]);

  const handleSignaturesChange = (uploadedImages) => {
    console.log(uploadedImages);
    setAvailableSignatures((prev) => [
      ...prev,
      ...uploadedImages.filter(Boolean),
    ]);
  };

  const addSignatureToPage = (src, pageNumber) => {
    const newSig = {
      id: Date.now().toString(),
      type: "image",
      src,
      x: 100,
      y: 100,
      page: pageNumber,
    };
    setItems((prev) => [...prev, newSig]);
  };

  const addTextBlockToPage = (pageNumber) => {
    const newTextBlock = {
      id: Date.now().toString(),
      type: "text",
      text: "Редагуйте текст",
      x: 100,
      y: 100,
      width: 200,
      height: 80,
      page: pageNumber,
    };
    setItems((prev) => [...prev, newTextBlock]);
  };

  const handleItemsChange = (updatedItems) => {
    setItems(updatedItems);
  };

  const handleSubmit = async () => {
    if (!pdfData) {
      alert("Будь ласка, завантажте PDF.");
      return;
    }

    const signatureItem = items.find((item) => item.type === "image");
    if (!signatureItem) {
      alert("Будь ласка, додайте хоча б один підпис.");
      return;
    }
    const textItem = items.find((item) => item.type === "text");
    const formData = new FormData();
    formData.append("pdf", pdfData, pdfData.name || "document.pdf");
    formData.append("x", signatureItem.x.toString());
    formData.append("y", signatureItem.y.toString());
    formData.append("page", signatureItem.page.toString());
    formData.append("imageBase64", signatureItem.src);
    const pageSize = pageDimensions?.[signatureItem.page];
    if (pageSize) {
      formData.append("canvasWidth", pageSize.width.toString());
      formData.append("canvasHeight", pageSize.height.toString());
    }

    if (textItem) {
      formData.append("label", textItem.text);
      formData.append("labelX", (textItem.x + 4).toString());
      formData.append("labelY", (textItem.y + 6).toString());
    }

    try {
      const response = await axios.post(
        // "http://localhost:3001/api/sign",
        "https://pdf-sign-api.onrender.com/api/sign",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob", // <-- ключовий момент
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "signed.pdf";
      document.body.appendChild(link);
      link.click();

      // Очистка
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      alert("Файл успішно завантажено!");
    } catch (err) {
      console.error("Помилка відправки:", err);
      alert("Не вдалося підписати та завантажити PDF.");
    }
  };

  return (
    <div className={style.mainContainer}>
      <Header
        onFileSelected={setPdfData}
        onSignaturesLoaded={handleSignaturesChange}
        download={handleSubmit}
      />

      <PdfViewer
        fileData={pdfData}
        items={items}
        onItemsChange={handleItemsChange}
        availableSignatures={availableSignatures}
        onAddSignature={addSignatureToPage}
        onAddTextBlock={addTextBlockToPage}
        selectedPage={selectedPage}
        setSelectedPage={setSelectedPage}
        pageDimensions={pageDimensions}
        setPageDimensions={setPageDimensions}
      />
    </div>
  );
}

export default App;
