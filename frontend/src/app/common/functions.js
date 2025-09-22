import { getYearFromDate } from "@/Services/utils";
import { getAllRoomDataList } from "../room/slice";
import { getAllSchoolYearDataList } from "../schoolYear/slice";
import { getAllSubjectDataList } from "../subject/slice";
import {
  setCountryOptions,
  setRoomOptions,
  setSchoolYearOptions,
  setSubjectOptions,
} from "./slice";
import { getAllCountrys } from "../country/slice";
import { getAllStates, setStateOptions } from "../state/slice";
import { getAllDistricts, setDistrictOptions } from "../district/slice";
import {
  getAllDepartmentDataList,
  setDepartmentOptions,
} from "../departments/slice";

export const getAllSubjectOptions = ({ dispatch }) => {
  dispatch(
    getAllSubjectDataList({
      data: {},
      onSuccess: ({ message, data }) => {
        const options = data?.subjects?.map((item) => {
          return {
            label: `${item.name} - ${item.code}`,
            value: item.id,
          };
        });
        dispatch(setSubjectOptions(options));
      },
      onFailure: () => {},
    })
  );
};

export const getAllRoomOptions = ({ dispatch }) => {
  dispatch(
    getAllRoomDataList({
      data: {},
      onSuccess: ({ message, data }) => {
        const options = data?.rooms?.map((item) => {
          return {
            label: `${item.roomNumber}   (${item.roomType})`,
            value: item.id,
          };
        });
        dispatch(setRoomOptions(options));
      },
      onFailure: () => {},
    })
  );
};

export const getAllYearOptions = ({ dispatch }) => {
  dispatch(
    getAllSchoolYearDataList({
      data: {},
      onSuccess: ({ message, data }) => {
        const options = data?.schoolYears?.map((item) => {
          return {
            label: `${getYearFromDate(item.startDate)} - ${getYearFromDate(
              item.endDate
            )}`,
            value: item.id,
          };
        });
        dispatch(setSchoolYearOptions(options));
      },
      onFailure: () => {},
    })
  );
};

export const getAllCountryOptions = ({ dispatch }) => {
  dispatch(
    getAllCountrys({
      data: {},
      onSuccess: ({ message, data }) => {
        const options = data?.countries?.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
        dispatch(setCountryOptions(options));
      },
      onFailure: () => {},
    })
  );
};

export const getAllStateOptions = ({ dispatch, data = {} }) => {
  dispatch(
    getAllStates({
      data,
      onSuccess: ({ message, data }) => {
        const options = data?.states?.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
        dispatch(setStateOptions(options));
      },
      onFailure: () => {},
    })
  );
};

export const getAllDistrictOptions = ({ dispatch, data = {} }) => {
  dispatch(
    getAllDistricts({
      data,
      onSuccess: ({ message, data }) => {
        const options = data?.districts?.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
        dispatch(setDistrictOptions(options));
      },
      onFailure: () => {},
    })
  );
};

export const getAllDepartmentOptions = ({ dispatch, data = {} }) => {
  dispatch(
    getAllDepartmentDataList({
      data,
      onSuccess: ({ message, data }) => {
        const options = data?.departments?.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
        dispatch(setDepartmentOptions(options));
      },
      onFailure: () => {},
    })
  );
};
