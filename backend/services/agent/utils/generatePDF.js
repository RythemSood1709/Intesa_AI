import PDFDocument from "pdfkit";

const generatePDF = async (data) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
      info: {
        Author: "Intesa AI",
        Title: data?.title,
        Creator: "Intesa AI",
      },
    });

    const chunks=[]

    doc.on("data", )
  });
};
