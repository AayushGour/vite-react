// Application Level Reducer

import { SET_EMPLOYEE_DETAILS_DATA } from "./action-types";

// import { TEST_ACTION } from "./action-types";

// Initial Application state
const initialState = {
    employeeDetails: {},
}

// Reducer to change state based on the action
const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_EMPLOYEE_DETAILS_DATA:
            return ({ ...state, employeeDetails: action?.payload });
        // case TEST_ACTION:

        //     break;

        default:
            return state;
    }
}
export default appReducer;