/**
 *  Action Columns Component
 * @format
 */
import Link from "next/link";
import PropTypes from "prop-types";
import React from "react";

// ✅ Import MUI Icons
import EditIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import DeleteIcon from "@mui/icons-material/DeleteForeverOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";

export default function ActionColumnsComponent({
  showDeleteButton = false,
  showPermissionButton = false,
  showEditButton = false,
  showViewButton = false,
  showEditLink = false,
  showViewLink = false,
  viewOnClick = () => {},
  deleteOnClick = () => {},
  editOnClick = () => {},
  permissionOnClick = () => {},
  editOnLink = "",
  viewOnLink = "",
}) {
  return (
    <div className="flex items-center justify-center space-x-2">
      {showEditButton && (
        <button
          type="button"
          className="text-gray-600 not-first:rounded-full p-1 flex justify-center align-middle hover:bg-hover hover:text-primary"
          onClick={editOnClick}
        >
          <EditIcon fontSize="small" />
        </button>
      )}

      {showEditLink && (
        <Link
          className="text-gray-600 rounded-full p-1 flex justify-center align-middle hover:bg-hover hover:text-primary"
          href={editOnLink}
        >
          <EditIcon fontSize="small" />
        </Link>
      )}

      {showPermissionButton && (
        <button
          type="button"
          className="text-gray-600 rounded-full p-1 flex justify-center align-middle hover:bg-hover hover:text-primary"
          onClick={permissionOnClick}
        >
          <AdminPanelSettingsOutlinedIcon fontSize="small" />
        </button>
      )}

      {showDeleteButton && (
        <button
          type="button"
          className="text-danger rounded-full p-1 flex justify-center align-middle hover:bg-hover"
          onClick={deleteOnClick}
        >
          <DeleteIcon fontSize="small" />
        </button>
      )}

      {showViewButton && (
        <button
          type="button"
          className="text-gray-600 rounded-full p-1 flex justify-center align-middle hover:bg-hover hover:text-primary"
          onClick={viewOnClick}
        >
          <VisibilityIcon fontSize="small" />
        </button>
      )}

      {showViewLink && (
        <Link
          className="text-gray-600 rounded-full p-1 flex justify-center align-middle hover:bg-hover hover:text-primary"
          href={viewOnLink}
        >
          <VisibilityIcon fontSize="small" />
        </Link>
      )}
    </div>
  );
}

ActionColumnsComponent.propTypes = {
  showDeleteButton: PropTypes.bool,
  showEditButton: PropTypes.bool,
  showViewButton: PropTypes.bool,
  showViewLink: PropTypes.bool,
  showEditLink: PropTypes.bool,
  viewOnClick: PropTypes.func,
  viewOnLink: PropTypes.string,
  deleteOnClick: PropTypes.func,
  editOnClick: PropTypes.func,
  editOnLink: PropTypes.string,
};
