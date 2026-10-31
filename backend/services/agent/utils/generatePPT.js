import pptxgen from "pptxgenjs";

export const generatePPT = async (data) => {
  const ppt = new pptxgen();

  ppt.layout = "LAYOUT_WIDE";
  ppt.author = "Intesa AI";
  ppt.title = data?.title;
  ppt.subject = data?.title;
  ppt.company = "Intesa AI";
  ppt.lang = "en-US";
  ppt.theme = {
    headFontFace: "Aptos",
    bodyFontFace: "Aptos",
    lang: "en-US",
  };

  


};
