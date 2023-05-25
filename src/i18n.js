import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      fileInvalidType: "File type must be {{ messageSuffix }}",
      fileTooLarge: "File is larger than {{ maxSize }}{{ unit }}",
      fileTooSmall: "File is smaller than {{ minSize }}{{ unit }}",
      tooManyFiles: "Too many files",
    },
  },
  ja: {
    translation: {
      fileInvalidType:
        "アップロードできるファイルの拡張子は {{ messageSuffix }} です",
      fileTooLarge:
        "アップロードできる最大ファイルサイズは {{ maxSize }}{{ unit }} です",
      fileTooSmall:
        "アップロードできる最小ファイルサイズは {{ minSize }}{{ unit }} です",
      tooManyFiles: "アップロードできるファイル数を超えています",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
