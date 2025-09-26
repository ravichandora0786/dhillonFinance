// View Field.js
import React from "react";

const ViewField = ({ label, value }) => {
  return (
    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
      <div className="text-xs text-slate-400">{label || "--"}</div>
      <div className="mt-1 text-sm text-slate-800 font-medium break-words">
        {value || "--"}
      </div>
    </div>
  );
};

export default ViewField;
