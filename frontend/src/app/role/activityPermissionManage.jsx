"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";

import DataTableComponent from "@/components/dataTableComponent";
import InputBox from "@/components/ui/inputBox";
import LoadingButton from "@/components/ui/loadingButton";
import TitleAndDescription from "@/components/ui/titleAndDescription";
import SingleParagraphColumn from "@/components/tableCollumnComponents/singleParagraphCol";
import {
  createORupdateActivityPermission,
  getActivityPermissionsByRoleId,
  getAllRoles,
  setActivityModuleData,
  setActivityPermissionData,
  setAllModuleList,
  setModulePagination,
  setModuleSearchData,
  setRoleId,
} from "./slice";
import {
  selectActivityModuleData,
  selectActivityPermissionData,
  selectAllModuleList,
  selectModulePagination,
  selectModuleSearchData,
} from "./selector";
import { getAllActivityMasters } from "@/app/activityMaster/slice";
import SelectDropDown from "@/components/ui/selectDropDown";
import { getAllPermissions } from "../permissions/slice";

const ActivityPermissionManage = ({ roleId, permissions }) => {
  const create = true;
  const navigate = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [roleOptions, setRoleOptions] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const pagination = useSelector(selectModulePagination);
  const permissionList = useSelector(selectAllModuleList);
  const activityModulesList = useSelector(selectActivityModuleData);
  const moduleSearchData = useSelector(selectModuleSearchData);
  const activityPermissionData = useSelector(selectActivityPermissionData);

  const searchFields = [
    {
      name: "name",
      label: "Module",
      onChange: (e) => {
        const value = e.target.value;
        dispatch(setModuleSearchData({ ...moduleSearchData, name: value }));
      },
    },
  ];

  // Columns with checkbox
  const columns = () => [
    {
      header: () => <div className="">Module name</div>,
      accessorKey: "name",
      cell: ({ getValue }) => (
        <SingleParagraphColumn value={getValue()} className={"font-bold"} />
      ),
    },
    ...(permissionList?.permissions?.map((permission) => ({
      header: permission.name,
      accessorKey: permission.id,
      cell: ({ row }) => {
        const activityId = row.original.id;
        const permissionId = permission.id;

        const isChecked = !!activityPermissionData?.activities?.find(
          (a) =>
            a.activityId === activityId &&
            a.permissionIds?.includes(permissionId)
        );

        return (
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) =>
              handlePermissionToggle(activityId, permissionId, e.target.checked)
            }
          />
        );
      },
    })) ?? []),
    // 🔹 View All column
    {
      header: "View All",
      accessorKey: "viewAll",
      cell: ({ row }) => {
        const activityId = row.original.id;

        // find existing activity
        const activity = activityPermissionData?.activities?.find(
          (a) => a.activityId === activityId
        );

        // Check if all permissions of this activity are included
        const allPermissions =
          permissionList?.permissions?.map((p) => p.id) ?? [];
        const isAllChecked =
          activity &&
          allPermissions.every((pid) => activity.permissionIds?.includes(pid));

        return (
          <input
            type="checkbox"
            checked={isAllChecked}
            onChange={(e) =>
              handleViewAllToggle(activityId, allPermissions, e.target.checked)
            }
          />
        );
      },
    },
  ];

  // Single permission toggle
  const handlePermissionToggle = (activityId, permissionId, checked) => {
    // activities ka deep copy banaya
    let updatedActivities = JSON.parse(
      JSON.stringify(activityPermissionData?.activities || [])
    );

    const existingActivity = updatedActivities.find(
      (a) => a.activityId === activityId
    );

    if (checked) {
      // Add permission
      if (existingActivity) {
        if (!existingActivity.permissionIds.includes(permissionId)) {
          existingActivity.permissionIds = [
            ...existingActivity.permissionIds,
            permissionId,
          ];
        }
      } else {
        updatedActivities.push({
          activityId,
          permissionIds: [permissionId],
        });
      }
    } else {
      // Remove permission
      if (existingActivity) {
        existingActivity.permissionIds = existingActivity.permissionIds.filter(
          (pid) => pid !== permissionId
        );

        // agar koi permission nahi bachi to activity bhi hata do
        if (existingActivity.permissionIds.length === 0) {
          updatedActivities = updatedActivities.filter(
            (a) => a.activityId !== activityId
          );
        }
      }
    }

    const updatedData = {
      ...activityPermissionData,
      activities: updatedActivities,
    };

    // dispatch(setActivityPermissionData(updatedData));
    createUpdateActivityPermissions(updatedData);
  };

  // View All toggle
  const handleViewAllToggle = (activityId, permissionIds, checked) => {
    // Deep copy banaya activities ka
    let updatedActivities = JSON.parse(
      JSON.stringify(activityPermissionData?.activities || [])
    );

    const existingActivity = updatedActivities.find(
      (a) => a.activityId === activityId
    );

    if (checked) {
      // Assign all permissions
      if (existingActivity) {
        existingActivity.permissionIds = [...new Set(permissionIds)];
      } else {
        updatedActivities.push({
          activityId,
          permissionIds: [...permissionIds],
        });
      }
    } else {
      // Uncheck all → remove activity from list
      updatedActivities = updatedActivities.filter(
        (a) => a.activityId !== activityId
      );
    }

    const updatedData = {
      ...activityPermissionData,
      activities: updatedActivities,
    };

    // dispatch(setActivityPermissionData(updatedData));
    createUpdateActivityPermissions(updatedData);
  };

  const handleRefrsh = () => {
    dispatch(setModulePagination({ pageIndex: 0, pageSize: 10 }));
    dispatch(setModuleSearchData({ name: "" }));
  };

  //   Apis Functions
  const createUpdateActivityPermissions = (activities) => {
    dispatch(
      createORupdateActivityPermission({
        data: activities,
        onSuccess: (res) => {
          getActivityPermissionsListByRoleId(roleId);
        },
        onFailure: (err) => {
          console.error("Error:", err);
        },
      })
    );
  };

  const getActivityPermissionsListByRoleId = (roleId) => {
    dispatch(
      getActivityPermissionsByRoleId({
        id: roleId,
        onSuccess: ({ data }) => {
          dispatch(setActivityPermissionData(data));
        },
        onFailure: ({ message }) => {
          console.error("Failed to fetch role permissions:", message);
        },
      })
    );
  };

  const getAllActivityMastersList = (activityMasterSearchData, pagination) => {
    dispatch(
      getAllActivityMasters({
        data: {
          page: pagination?.pageIndex + 1,
          limit: pagination?.pageSize,
          name: activityMasterSearchData?.name,
        },
        onSuccess: ({ message, data }) => {
          dispatch(setActivityModuleData(data));
        },
        onFailure: () => {},
      })
    );
  };
  const getAllPermissionsList = () => {
    dispatch(
      getAllPermissions({
        data: {
          page: 1,
          limit: 200,
          name: "",
        },
        onSuccess: ({ message, data }) => {
          dispatch(setAllModuleList(data));
        },
        onFailure: () => {},
      })
    );
  };

  const getAllRoleListForOptions = () => {
    dispatch(
      getAllRoles({
        data: {
          name: "",
        },
        onSuccess: ({ message, data }) => {
          const roles = data?.roles?.map((item) => {
            return {
              label: item.name,
              value: item.id,
            };
          });
          setRoleOptions(roles);
        },
        onFailure: () => {},
      })
    );
  };
  useEffect(() => {
    getAllActivityMastersList(moduleSearchData, pagination);
    getAllPermissionsList();
  }, [moduleSearchData, pagination]);
  useEffect(() => {
    if (roleId) {
      getActivityPermissionsListByRoleId(roleId);
    }
  }, [roleId]);
  useEffect(() => {
    getAllRoleListForOptions();
  }, []);

  return (
    <>
      <div className="w-full flex flex-col gap-4 justify-between  p-4">
        <div className="w-full flex flex-row justify-start items-center">
          <button
            onClick={() => {
              dispatch(setRoleId(""));
            }}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 font-medium cursor-pointer"
          >
            <ArrowBackIcon fontSize="small" />
            <span>Back</span>
          </button>
        </div>
        <div className="w-full flex flex-row justify-between items-center">
          <TitleAndDescription
            title="Roles & Permissions"
            description="Manage your roles and their permissions"
          />
        </div>

        <div className="flex-auto w-full bg-white py-2 rounded-lg flex items-center gap-4">
          {/* Search Input */}
          <div className="flex flex-column gap-2 flex-1">
            {searchFields.map((field, index) => (
              <div key={index} className="relative flex-1 max-w-[200px]">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <InputBox
                  type="text"
                  placeholder={`Search ${field?.label}`}
                  className="pl-10"
                  onChange={field?.onChange}
                  value={moduleSearchData?.[field.name] ?? ""}
                />
              </div>
            ))}
            <div className="relative flex-1 max-w-[200px]">
              <SelectDropDown
                name={"roleSearch"}
                options={roleOptions}
                value={roleOptions.find((opt) => opt.value === roleId)}
                onChange={(option) => dispatch(setRoleId(option.value))}
                placeholder={`Select Role`}
                isSearchable={true}
                isClearable={false}
                disabled={false}
              />
            </div>
          </div>

          {/* Refresh Button */}
          <div>
            <LoadingButton
              name={"refresh"}
              type={"button"}
              isLoading={false}
              disabled={false}
              variant="secondary"
              onClick={handleRefrsh}
            >
              <RefreshIcon />
            </LoadingButton>
          </div>
        </div>
        <div className="flex-auto w-full">
          <DataTableComponent
            columns={columns()}
            data={activityModulesList?.activities || []}
            pagination={pagination}
            setPagination={(newPagination) =>
              dispatch(setModulePagination(newPagination))
            }
            totalRows={activityModulesList?.totalItems}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
          />
        </div>
      </div>
    </>
  );
};
export default ActivityPermissionManage;
