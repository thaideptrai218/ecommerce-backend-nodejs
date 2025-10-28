export const getSelectData = (select = []) => {
    return Object.fromEntries(select.map((el) => [el, 1]));
};

export const getUnSelectData = (select = []) => {
    return Object.fromEntries(select.map((el) => [el, 0]));
};
