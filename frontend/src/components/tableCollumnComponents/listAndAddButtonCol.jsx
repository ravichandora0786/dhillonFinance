/**
 *  List And Add Button Columns Component
 * @format
 */
import React from "react";
import { Add as AddIcon } from "@mui/icons-material";

export default function ListAndAddButtonColumnsComponent({
  plusButtonOnClick = () => {},
  numberButtonOnClick = () => {},
  totalCountNumber = 0,
}) {
  return (
    <div className="flex flex-row justify-center gap-2 text-center text-xs font-bold">
      {/* Number Button */}
      <button
        className="px-3 py-1 rounded-md bg-primary text-white text-xs font-bold hover:bg-primary/80 transition"
        onClick={numberButtonOnClick}
      >
        {totalCountNumber}
      </button>

      {/* Plus Button */}
      <button
        className=" p-0 transition cursor-pointer text-gray-600"
        onClick={plusButtonOnClick}
      >
        <AddIcon
          fontSize="small"
          //   sx={{ fontSize: 22  }}
        />
      </button>
    </div>
  );
}
