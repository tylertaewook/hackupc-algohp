import tableDataDevelopment from "./variables/tableDataDevelopment";
import tableDataCheck from "./variables/tableDataCheck";
import CheckTable from "./components/CheckTable";
import tableDataColumns from "./variables/tableDataColumns";
import { CircleSpinnerOverlay, FerrisWheelSpinner } from 'react-spinner-overlay'
import { useState } from "react";
import { Button } from "antd";


const Tables = () => {
  const [loading, setLoading] = useState(false)
  function redirectAfterDelay(): void {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      window.location.href = "/admin/default";
    }, 3500);
  }

  return (
    <div>
      <div className="mt-10 grid h-full grid-cols-1">
        <UploadFile />
      </div>
      <div className="mt-3 flex justify-center">
        <Button className="w-40 px-10 pb-10 text-2xl font-bold bg-brandLinear" onClick={redirectAfterDelay}>Submit</Button>
      </div>
      <>
        <CircleSpinnerOverlay
        　　loading={loading} 
        overlayColor="rgba(0,153,255,0.2)"
        />
      </>
    </div>
  );
};

const UploadFile = () => {
  return (
    <div className="flex w-full items-center justify-center">
      <label className="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600">
        <div className="flex flex-col items-center justify-center pb-6 pt-5">
          <svg
            aria-hidden="true"
            className="mb-3 h-10 w-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            ></path>
          </svg>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            SVG, PNG, JPG or GIF (MAX. 800x400px)
          </p>
        </div>
        <input id="dropzone-file" type="file"/>
      </label>
    </div>
  );
};

export default Tables;
