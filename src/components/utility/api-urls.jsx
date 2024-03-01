const BASE_URL = import.meta.env?.VITE_BASE_URL;

export const loginUrl = BASE_URL + "api/v1/login";
export const signUpUrl = BASE_URL + "api/signup";
export const refreshTokenUrl = BASE_URL + "api/refreshToken";

export const getUsersListUrl = BASE_URL + "api/v1/get-all-users";
export const getDashboardDataUrl = BASE_URL + "api/v1/dashboard";

export const getClientsListUrl = BASE_URL + "api/v1/get-all-clients";
export const createClientUrl = BASE_URL + "api/v1/create-client";
export const getClientByIdUrl = BASE_URL + "api/v1/get-client";
export const updateClientByIdUrl = BASE_URL + "api/v1/update-client";
export const deleteClientByIdUrl = BASE_URL + "api/v1/delete-client";
export const updateEstimateUrl = BASE_URL + "api/v1/update-estimate";
export const getEstimateDataUrl = BASE_URL + "api/v1/get-estimate-data";

export const createEmployeeUrl = BASE_URL + "api/v1/create-employee";
export const getEmployeesListUrl = BASE_URL + "api/v1/get-all-employees";
export const getEmployeeByIdUrl = BASE_URL + "api/v1/get-employee";
export const updateEmployeeDetailsUrl = BASE_URL + "api/v1/update-employee";
export const deleteEmployeeByIdUrl = BASE_URL + "api/v1/delete-employee";


export const getEmployeeInsuranceByIdUrl = BASE_URL + "api/v1/get-employee-insurance";
export const updateEmployeeInsuranceUrl = BASE_URL + "api/v1/update-employee-insurance";

export const createAgencyUrl = BASE_URL + "api/v1/create-agency";
export const getAgencysListUrl = BASE_URL + "api/v1/get-all-agencys";
export const getAgencyByIdUrl = BASE_URL + "api/v1/get-agency";
export const updateAgencyByIdUrl = BASE_URL + "api/v1/update-agency";

export const addEmployeeEngagementUrl = BASE_URL + "api/v1/add-employee-engagement";
export const getEmployeeEngagementListUrl = BASE_URL + "api/v1/get-employee-engagement-history";

export const getAttendanceDataUrl = BASE_URL + "api/v1/get-attendance-data";
export const markAttendanceUrl = BASE_URL + "api/v1/mark-attendance";

export const getEmployeesSalaryDetailsUrl = BASE_URL + "api/v1/get-employees-salary";
export const updateEmployeesSalaryDetailsUrl = BASE_URL + "api/v1/update-employees-salary";

export const getClientPaymentDetailsUrl = BASE_URL + "api/v1/get-payment-data";
export const getClientInvoiceDetailsUrl = BASE_URL + "api/v1/get-invoice-data";

export const getClientRegisterDataUrl = BASE_URL + "api/v1/get-register-data";
export const saveInvoiceDataUrl = BASE_URL + "api/v1/save-invoice-data";