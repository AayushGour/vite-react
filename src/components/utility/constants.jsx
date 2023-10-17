export const rolesList = {
    ADMIN: 'ADMIN',
    SUPERADMIN: 'SUPERADMIN',
    EMPLOYEE: 'EMPLOYEE',
    CLIENT: 'CLIENT',
    USER: 'USER',
};

export const getComputedSalaryData = (formData, key = "", val = "") => {
    const newColumn = { ...formData };
    if (key !== "") {
        newColumn[key] = val;
    }

    newColumn.esi = ((Number(newColumn?.salary) + Number(newColumn?.additionalAllowance)) * 0.0325).toFixed(0);
    // newColumn.pf = 15000 * 0.13;
    newColumn.subTotalA = Number(newColumn?.salary) + Number(newColumn?.additionalAllowance) + Number(newColumn?.washingAllowance);
    newColumn.earnedLeave = (Number(newColumn?.subTotalA) / 26 * 15 / 12).toFixed(0)
    newColumn.nfh = (Number(newColumn?.subTotalA) / 26 * 15 / 12).toFixed(0)
    newColumn.pf = getPf(formData?.pfConfig || "standard", newColumn);
    newColumn.bonus = ((Number(formData?.salary)) * 0.0833).toFixed(0);
    newColumn.subTotalB = Number(newColumn?.pf) + Number(newColumn?.esi) + Number(newColumn?.uniformCharges) + Number(newColumn?.nfh) + Number(newColumn?.bonus) + Number(newColumn?.earnedLeave);
    newColumn.relievingCharges = ((Number(newColumn?.subTotalA) + Number(newColumn?.subTotalB)) / 6).toFixed(0);
    newColumn.subTotalC = Number(newColumn?.subTotalA) + Number(newColumn?.subTotalB) + Number(newColumn?.relievingCharges);
    newColumn.serviceCharges = (Number(newColumn.subTotalC) * Number(formData.serviceChargePercentage)).toFixed(0);
    newColumn.total = (Number(newColumn.subTotalC) + Number(newColumn.serviceCharges)).toFixed(0)
    newColumn.grandTotal = Number(newColumn?.noOfEmployees) * Number(newColumn.total);
    return newColumn;
}

export const getPf = (selectedValue, columnData) => {
    const pfPercent = 0.13; // 13%
    if (!!selectedValue && !Array.isArray(selectedValue) && selectedValue?.includes("standard")) {
        return ((Number(columnData?.salary) > 15000 ? 15000 : Number(columnData?.salary)) * pfPercent).toFixed(0); // 13% pf
    } else if (!!selectedValue && Array.isArray(selectedValue) && selectedValue?.length > 0) {
        const vals = selectedValue?.reduce((acc, curr) => {
            return Number(acc) + Number(columnData?.[curr])
        }, 0);
        return (Number(vals) * pfPercent).toFixed(0); // 13% pf
    } else if (!!selectedValue && Array.isArray(selectedValue) && selectedValue?.length === 0) {
        return 15000 * pfPercent; // 13% pf
    } else if (typeof selectedValue === 'string') {
        return (Number(columnData?.[selectedValue]) * pfPercent).toFixed(0); // 13% pf
    }
};

export function numberToWords(price) {
    var sglDigit = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"],
        dblDigit = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"],
        tensPlace = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"],
        handle_tens = function (dgt, prevDgt) {
            return 0 == dgt ? "" : " " + (1 == dgt ? dblDigit[prevDgt] : tensPlace[dgt])
        },
        handle_utlc = function (dgt, nxtDgt, denom) {
            return (0 != dgt && 1 != nxtDgt ? " " + sglDigit[dgt] : "") + (0 != nxtDgt || dgt > 0 ? " " + denom : "")
        };

    var str = "",
        digitIdx = 0,
        digit = 0,
        nxtDigit = 0,
        words = [];
    if (price += "", isNaN(parseInt(price))) str = "";
    else if (parseInt(price) > 0 && price.length <= 10) {
        for (digitIdx = price.length - 1; digitIdx >= 0; digitIdx--) switch (digit = price[digitIdx] - 0, nxtDigit = digitIdx > 0 ? price[digitIdx - 1] - 0 : 0, price.length - digitIdx - 1) {
            case 0:
                words.push(handle_utlc(digit, nxtDigit, ""));
                break;
            case 1:
                words.push(handle_tens(digit, price[digitIdx + 1]));
                break;
            case 2:
                words.push(0 != digit ? " " + sglDigit[digit] + " Hundred" + (0 != price[digitIdx + 1] && 0 != price[digitIdx + 2] ? " and" : "") : "");
                break;
            case 3:
                words.push(handle_utlc(digit, nxtDigit, "Thousand"));
                break;
            case 4:
                words.push(handle_tens(digit, price[digitIdx + 1]));
                break;
            case 5:
                words.push(handle_utlc(digit, nxtDigit, "Lakh"));
                break;
            case 6:
                words.push(handle_tens(digit, price[digitIdx + 1]));
                break;
            case 7:
                words.push(handle_utlc(digit, nxtDigit, "Crore"));
                break;
            case 8:
                words.push(handle_tens(digit, price[digitIdx + 1]));
                break;
            case 9:
                words.push(0 != digit ? " " + sglDigit[digit] + " Hundred" + (0 != price[digitIdx + 1] || 0 != price[digitIdx + 2] ? " and" : " Crore") : "")
        }
        str = words.reverse().join("")
    } else str = "";
    return str

}