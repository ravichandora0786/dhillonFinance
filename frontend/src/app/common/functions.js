import { setCountryOptions } from "./slice";
import { getAllCountrys } from "../country/slice";
import { getAllStates, setStateOptions } from "../state/slice";
import { getAllDistricts, setDistrictOptions } from "../district/slice";

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
