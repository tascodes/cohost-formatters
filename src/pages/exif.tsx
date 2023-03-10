import clsx from "clsx";
import EXIF from "exif-js";
import { ReactElement, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import FormatterLayout from "../components/FormatterLayout";
import type { NextPageWithLayout } from "./_app";

type ExifData = {
  Make?: string;
  Model?: string;
  XResolution?: number;
  YResolution?: number;
  ResolutionUnit?: number;
  Software?: string;
  Copyright?: string;
  ExifIFDPointer?: number;
  ExposureTime?: number;
  FNumber?: number;
  ExposureProgram?: string;
  ISOSpeedRatings?: number;
  undefined?: string;
  ExifVersion?: string;
  DateTimeOriginal?: string;
  DateTimeDigitized?: string;
  ShutterSpeedValue?: number;
  ApertureValue?: number;
  BrightnessValue?: number;
  ExposureBias?: number;
  MaxApertureValue?: number;
  MeteringMode?: string;
  LightSource?: string;
  Flash?: string;
  FocalLength?: number;
  PixelXDimension?: number;
  PixelYDimension?: number;
  FocalPlaneXResolution?: number;
  FocalPlaneYResolution?: number;
  FocalPlaneResolutionUnit?: number;
  SensingMethod?: string;
  FileSource?: string;
  SceneType?: string;
  CustomRendered?: string;
  ExposureMode?: 1;
  WhiteBalance?: string;
  FocalLengthIn35mmFilm?: number;
  SceneCaptureType?: string;
  Sharpness?: string;
  SubjectDistanceRange?: string;
  thumbnail?: {
    Compression?: number;
    JpegIFOffset?: number;
    JpegIFByteCount?: number;
  };
};

type ExifItemIds =
  | "MakeAndModel"
  | "ExposureTime"
  | "ISOSpeedRatings"
  | "FocalLength"
  | "FNumber"
  | "WhiteBalance"
  | "ExposureProgram";

const exifItems: {
  id: ExifItemIds;
  name: string;
}[] = [
  {
    id: "MakeAndModel",
    name: "Camera",
  },
  {
    id: "FocalLength",
    name: "Focal Length",
  },
  {
    id: "ISOSpeedRatings",
    name: "ISO",
  },
  {
    id: "ExposureTime",
    name: "Exposure Time",
  },
  {
    id: "FNumber",
    name: "F-Stop",
  },
];

const formatValue = <T extends ExifItemIds>(
  id: T,
  name: string,
  value?: number | string
) => {
  if (!value) {
    return "";
  }

  switch (id) {
    case "ExposureTime":
      return `${1 / (value as number)}"`;
    case "FocalLength":
      return `${value}mm`;
    case "FNumber":
      return `f/${value}`;
    default:
      return `${name} ${value}`;
  }
};

const Exif: NextPageWithLayout = () => {
  const [checkedItems, setCheckedItems] = useState([
    true,
    true,
    true,
    true,
    true,
    false,
    false,
  ]);

  const [exifData, setExifData] = useState<ExifData>();
  const [isMissingData, setIsMissingData] = useState(false);

  const [leftColor, setLeftColor] = useState("#f8fafc");
  const [rightColor, setRightColor] = useState("#f1f5f9");
  const [textColor, setTextColor] = useState("#000000");

  const handleCheckedChange = (index: number) => {
    const updatedCheckedItems = [...checkedItems];
    updatedCheckedItems[index] = !updatedCheckedItems[index];
    setCheckedItems(updatedCheckedItems);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles);
    if (!acceptedFiles?.length) {
      return;
    }

    const file = acceptedFiles[0];
    EXIF.getData(file as unknown as string, function (this: File) {
      const data = EXIF.getAllTags(this);
      if (data) {
        console.log(data);
        setIsMissingData(false);
        setExifData(data);
      } else {
        setIsMissingData(true);
      }
    });
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const prettyExif = (data: ExifData) => {
    const checked = exifItems
      .filter((value, idx) => checkedItems[idx])
      .map((item) => item);

    return checked.map((item) => {
      if (item.id === "MakeAndModel") {
        return { label: `${data.Make} ${data.Model}`, id: item.id };
      }
      return {
        label: formatValue(item.id, item.name, data[item.id]),
        id: item.id,
      };
    });
  };

  const transformHtml = (formatted: ReturnType<typeof prettyExif>) => {
    return `
      <div style="display: flex;position: relative;padding-left: 1rem;padding-right: 1rem;padding-top: 2rem;padding-bottom: 2rem;border-radius: 0.5rem;box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);width: fit-content;background:linear-gradient(135deg, ${leftColor}, ${rightColor});color: ${textColor};">
        ${formatted
          .map(({ label, id }) => {
            return `<div style="padding-left: 0.5rem;padding-right: 0.5rem;${
              id === "MakeAndModel" ? "font-weight:700;" : ""
            }">${label}</div>`;
          })
          .join("\n")}</div>
    `;
  };

  return (
    <>
      <h1 className="my-4 text-2xl font-bold">EXIF Data Formatter</h1>
      <h2 className="my-4 text-xl font-bold">Step 1: Upload an Image</h2>
      <div className="w-full grow" {...getRootProps()}>
        <div>
          <div
            className={clsx(
              "mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6 hover:bg-gray-50 dark:hover:bg-slate-800",
              isDragActive && "bg-indigo-50"
            )}
          >
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-slate-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-slate-600 dark:text-slate-50">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                >
                  <span>Upload a file</span>
                  <input
                    {...getInputProps()}
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500">PNG, JPG, GIF, HEIF</p>
      </div>
      <h2 className="mb-4 mt-8 text-xl font-bold">
        Step 2: Choose Data to Include
      </h2>
      <fieldset>
        <div className="divide-y divide-slate-200 border-t border-b border-slate-200 dark:divide-slate-600 dark:border-slate-600">
          {exifItems.map((item, itemIdx) => (
            <div key={itemIdx} className="relative flex items-start py-4">
              <div className="min-w-0 flex-1 text-sm">
                <label
                  htmlFor={`person-${item.id}`}
                  className="select-none font-medium text-slate-700 dark:text-slate-100"
                >
                  {item.name}
                </label>
              </div>
              <div className="ml-3 flex h-5 items-center">
                <input
                  id={`person-${item.id}`}
                  name={`person-${item.id}`}
                  type="checkbox"
                  checked={checkedItems[itemIdx]}
                  onChange={() => handleCheckedChange(itemIdx)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
            </div>
          ))}
        </div>
      </fieldset>
      <h2 className="mb-4 mt-8 text-xl font-bold">Step 3: Customize</h2>
      {exifData && (
        <>
          <h3 className="my-4 text-lg font-bold">Preview</h3>

          <div
            className="relative flex w-fit rounded-lg py-8 px-4 font-atkinson text-black shadow-md"
            style={{
              color: textColor,
              background: `linear-gradient(135deg, ${leftColor}, ${rightColor})`,
            }}
          >
            {prettyExif(exifData).map(({ label, id }) => {
              return (
                <div
                  className={clsx("px-2", id === "MakeAndModel" && "font-bold")}
                  key={id}
                >
                  {label}
                </div>
              );
            })}
          </div>
        </>
      )}
      <div className="mt-8 flex max-w-xs flex-col gap-3">
        <div>
          <label
            className="block flex items-center justify-between rounded-lg p-2 text-sm font-medium text-slate-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2"
            htmlFor="left-color"
          >
            Left Color
            <div
              style={{ backgroundColor: leftColor }}
              className="ml-2 h-12 w-12 rounded-full border border-slate-100 shadow dark:border-slate-500"
            ></div>
            <input
              id="left-color"
              className="sr-only"
              type="color"
              value={leftColor}
              onChange={(e) => {
                setLeftColor(e.target.value);
              }}
            />
          </label>
        </div>

        <div>
          <label
            className="block flex items-center justify-between rounded-lg p-2 text-sm font-medium text-slate-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2"
            htmlFor="right-color"
          >
            Right Color
            <div
              style={{ backgroundColor: rightColor }}
              className="ml-2 h-12 w-12 rounded-full border border-slate-200 shadow dark:border-slate-500"
            ></div>
            <input
              id="right-color"
              className="sr-only"
              type="color"
              value={rightColor}
              onChange={(e) => {
                setRightColor(e.target.value);
              }}
            />
          </label>
        </div>

        <div>
          <label
            className="block flex items-center justify-between rounded-lg p-2 text-sm font-medium text-slate-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2"
            htmlFor="text-color"
          >
            Text Color
            <div
              style={{ backgroundColor: textColor }}
              className="ml-2 h-12 w-12 rounded-full border border-slate-100 shadow dark:border-slate-500"
            ></div>
            <input
              id="text-color"
              className="sr-only"
              type="color"
              value={textColor}
              onChange={(e) => {
                setTextColor(e.target.value);
              }}
            />
          </label>
        </div>
      </div>

      {!!exifData && (
        <>
          <h2 className="mb-4 mt-8 text-xl font-bold">Step 4: Copy HTML</h2>
          <div className="rounded-lg border border-slate-100 bg-white p-4 shadow dark:border-slate-700 dark:bg-slate-800">
            <code>{transformHtml(prettyExif(exifData))}</code>
          </div>
        </>
      )}
    </>
  );
};

Exif.getLayout = (page: ReactElement) => {
  return <FormatterLayout>{page}</FormatterLayout>;
};

export default Exif;
