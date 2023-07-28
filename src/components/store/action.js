// Application Level Redux actions

import axios from "axios";
import { toast } from "react-toastify";
import { getClientByIdUrl, getEmployeeByIdUrl } from "../utility/api-urls";
import { SET_EMPLOYEE_DETAILS_DATA } from "./action-types";
import store from "./store";

export const fetchEmployeeDetails = async (dispatch, employeeId) => {
    const employeeDetailsObj = store.getState()?.appReducer?.employeeDetails;
    if (Object.keys(employeeDetailsObj)?.length > 0 && employeeDetailsObj?._id === employeeId) {
        return employeeDetailsObj;
    } else {
        const config = {
            method: "get",
            url: getEmployeeByIdUrl,
            params: {
                employeeId
            }
        }
        return axios(config).then((resp) => {
            dispatch({ type: SET_EMPLOYEE_DETAILS_DATA, payload: resp?.data?.data })
            return resp?.data?.data;
        }).catch((e) => {
            console.error(e);
            toast.error(e?.response?.data?.message);
        })
    }
}