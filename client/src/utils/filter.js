export const filterExpenses = (query, expenses) => {
    if (!query) {
        return expenses;
    }
    const filteredData = expenses?.filter((item) =>
        item.title?.toLowerCase().includes(query?.toLowerCase()) ||
        item.amount?.toLowerCase().includes(query?.toLowerCase())
    );
    return filteredData;
};