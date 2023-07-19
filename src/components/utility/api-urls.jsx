const BASE_URL = import.meta.env?.VITE_BASE_URL;

export const loginUrl = BASE_URL + "api/v1/login";
export const signUpUrl = BASE_URL + "api/signup";
export const refreshTokenUrl = BASE_URL + "api/refreshToken";
export const getUsersListUrl = BASE_URL + "api/v1/get-all-users";
export const getEmployeesListUrl = BASE_URL + "api/v1/get-all-employees";
export const getClientsListUrl = BASE_URL + "api/v1/get-all-clients";
export const createClientUrl = BASE_URL + "api/v1/create-client";
export const getClientByIdUrl = BASE_URL + "api/v1/get-client";
export const getEmployeeByIdUrl = BASE_URL + "api/v1/get-employee";
export const getEmployeeInsuranceByIdUrl = BASE_URL + "api/v1/get-employee-insurance";
export const updateEmployeeInsuranceUrl = BASE_URL + "api/v1/update-employee-insurance";
export const createEmployeeUrl = BASE_URL + "api/v1/create-employee";
export const getDashboardDataUrl = BASE_URL + "api/v1/dashboard";