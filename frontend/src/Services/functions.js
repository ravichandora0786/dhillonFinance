import { setCountryOptions } from "../app/common/slice";
import { getAllCountrys } from "../app/country/slice";
import { getAllStates, setStateOptions } from "../app/state/slice";
import { getAllDistricts, setDistrictOptions } from "../app/district/slice";

export const getAllCountryOptions = ({ dispatch }) => {
  dispatch(
    getAllCountrys({
      data: {},
      onSuccess: ({ message, data }) => {
        console.log(message);
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
        console.log(message);
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
        console.log(message);
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
