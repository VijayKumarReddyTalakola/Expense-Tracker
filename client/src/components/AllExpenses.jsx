import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteExpense, getAllExpenses, getFilteredExpenses } from "../redux/userSlice";
import { formatDate } from "../utils/formatDate";
import { Link } from "react-router-dom";
import {MdDelete} from 'react-icons/md'
import { filterExpenses } from "../utils/filter";
import { toast } from "react-hot-toast";

const AllExpenses = () => {
    const dispatch = useDispatch();
    const [startDate,setStartDate] = useState("")//stores start date
    const [endDate,setEndDate] = useState("")//stores end date
    const [filteredDates, setfilteredDates] = useState({
        start: "",
        end: "",
    });  // stores start and end dates after date filter is applied
    const [query, setQuery] = useState(""); //stores the query for search
    const [isFilter,setIsFilter] = useState(false) // stores the state of  filter active  based on date filtering
    const [filteredData, setFilteredData] = useState([]) // stores filtered data after applying  the date filter
    const [searchedExpenses, setSearchedExpenses] = useState([]); // stores searched data after applying the  search

    useEffect(() => {
        dispatch(getAllExpenses());
    }, []);
    const { expenses} = useSelector((state) => state["user"]);

    const [filteredExpenses ,setFilteredExpenses] = useState([])
    useEffect(()=>{
        setFilteredExpenses(expenses)
    },[expenses])

    const handleFilter = async () => {
        if(startDate<=endDate){
            setfilteredDates({start : startDate, end : endDate})
            const response = await dispatch(getFilteredExpenses({startDate,endDate}))
            if (response.meta.requestStatus === "fulfilled") {
                const result = response.payload.expenses;
                setIsFilter(true);
                setFilteredData(result)
                if (query !== "") {
                    setSearchedExpenses(filterExpenses(query, result));
                    setFilteredExpenses(filterExpenses(query, result));
                }else{
                    setFilteredExpenses(result)
                }
                setStartDate("")
                setEndDate("")
            }  
        }else{
            toast.error("Start Date must not exceed End Date")
        }
    }

    const handleSearch = (e) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
        if(newQuery === ""){
            if(isFilter){
                setFilteredExpenses(filteredData);    
            }else{
                setFilteredExpenses(expenses)
            }
            setSearchedExpenses([]);
        }else{
            let filtered;
            if(isFilter){
                filtered = filterExpenses(newQuery, filteredData);
            }
            else{
                filtered = filterExpenses(newQuery, expenses);
            }
            setFilteredExpenses(filtered);
            setSearchedExpenses(filtered);        
        }
    };

    const clearFilters  = async () =>{
        setIsFilter(false)
        setQuery("")
        setStartDate("");
        setEndDate("");
        setfilteredDates({ start: "", end: "" });
        setFilteredData([])
        setSearchedExpenses([])
        const response = await dispatch(getAllExpenses());
        setFilteredExpenses(response.payload.expenses)
    }

    const calculateTotal = (expenses) => {
        const total = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
        return total;
    };
    
    return (
    <div className="w-full pt-20 lg:pt-24">
        <div className="w-full md:max-w-[95%] lg:max-w-[90%] flex justify-between items-center mx-auto px-2 md:px-0 ">
            <h1 className="text-2xl font-medium md:text-2xl">Your Expenses</h1>
            <Link to={'/expense/new'}>
            <button className="text-white bg-blue-600 hover:bg-blue-800 font-medium rounded-lg py-2 px-4">Add Expense</button>
            </Link>
        </div>
        { expenses.length > 0 ? (
            <div className="w-full md:max-w-[95%] lg:max-w-[90%] px-5 md:px-0 flex flex-col mx-auto">
                <div className="mt-4 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                    <div className="flex flex-col gap-y-2 sm:flex-row sm:gap-x-3  md:gap-x-1 lg:gap-x-3 sm:items-center w-full md:w-fit">
                        <input
                            placeholder="startdate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="bg-white text-gray-600 font-medium rounded-lg focus:outline-none focus:shadow-outline border-2 border-gray-400 py-2 px-4 w-full sm:w-fit md:px-2 lg:px-4"
                            type="date"
                            />     
                        <span className="font-semibold text-center ">To</span>   
                        <input
                            placeholder="enddate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="bg-white text-gray-600 font-medium rounded-lg focus:outline-none focus:shadow-outline border-2 border-gray-400 py-2 px-4 w-full sm:w-fit md:px-2 lg:px-4"
                            type="date"
                            />
                        <div className="flex w-full sm:w-fit justify-center">
                            <button onClick={handleFilter} className="mt-2 mr-3 sm:mr-2 sm:mt-0 bg-blue-600 px-5 py-2 w-fit rounded-lg font-semibold text-white dark:bg-blue-500 hover:bg-blue-800 md:px-3 lg:px-5 ">Filter</button>
                            <button onClick={clearFilters} className="mt-2 sm:mt-0 bg-red-500 px-3 py-2 w-fit rounded-lg font-medium text-white dark:bg-red-500 hover:bg-red-600">Clear Filters</button>
                        </div>        
                    </div>
                    <div className=" py-2 md:py-4 w-full sm:w-fit">
                        <input onChange={handleSearch}
                        type="search" 
                        value={query}
                        placeholder="Search Here" 
                        className="p-2 bg-white text-black border-2 w-full border-gray-400 focus:outline-none rounded-lg" />
                    </div>
                </div>
                { query && <h2 className="flex flex-wrap w-full text-xl mx-auto font-medium ">Showing results for <span className=" ml-3 text-green-600 max-w-[90%] inline-flex break-all whitespace-pre-wrap ">{query}</span></h2>}
                { isFilter && <h2 className="flex flex-wrap w-full text-xl mx-auto font-medium ">Showing results from <span className=" w-fit mx-3 text-green-600">{formatDate(filteredDates.start)}</span> to <span className= " w-fit text-green-600 ml-3">{formatDate(filteredDates.end)}</span></h2>}
                { filteredExpenses.length>0 && <h2 className="text-xl mx-auto mb-2 text-center w-fit sm:w-full font-semibold md:text-2xl md:mb-4">Total Expenditure : Rs.{calculateTotal(filteredExpenses)} </h2>}
                { filteredExpenses.length>0 ? (
                    <div className="overflow-x-auto w-full flex justify-center items-center shadow-md sm:rounded-lg">
                        <div className="w-full flex flex-col md:pt-2 ">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-200 text-left dark:bg-gray-700">
                                        <tr>
                                            <th scope="col" className="py-3 px-6 text-base md:text-lg font-semibold tracking-wider text-gray-800 dark:text-gray-400">
                                                Title
                                            </th>
                                            <th scope="col" className="py-3 px-6 text-base md:text-lg font-semibold tracking-wider text-gray-800 dark:text-gray-400">
                                                Amount
                                            </th>
                                            <th scope="col" className="py-3 px-6 text-base md:text-lg font-semibold tracking-wider text-gray-800 dark:text-gray-400">
                                                Date
                                            </th>
                                            <th scope="col" className="py-3 px-6 text-base md:text-lg font-semibold tracking-wider text-gray-800 dark:text-gray-400">
                                                Actions                                
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                        { filteredExpenses?.map((expense)=>{
                                            return (
                                            <tr key={expense._id} >
                                                <td className="py-4 px-6 text-sm sm:text-base font-medium text-gray-600 whitespace-nowrap dark:text-white">{expense?.title}</td>
                                                <td className="py-4 px-6 text-sm sm:text-base font-medium text-gray-600 whitespace-nowrap dark:text-white">Rs.{expense?.amount}</td>
                                                <td className="py-4 px-6 text-sm sm:text-base font-medium text-gray-600 whitespace-nowrap dark:text-white">{formatDate(expense?.date)}</td>
                                                <td className="flex items-center gap-x-6 py-4 px-6 text-base font-medium ">
                                                    <Link to={`/expense/update/${expense._id}`} className="text-blue-600 dark:text-blue-500 hover:text-blue-900">Edit</Link>
                                                    <MdDelete onClick={()=>dispatch(deleteExpense(expense._id))} className="text-red-500 cursor-pointer hover:text-red-700"/>
                                                </td>
                                            </tr>
                                            )})
                                        }
                                    </tbody>
                                </table>
                        </div>
                    </div>
                    ) : <p className=" mt-5 text-red-500 text-xl mx-auto text-center w-full font-semibold md:text-2xl"> No Expenses Found</p>
                }     
            </div>
            ) : (<p className="flex min-h-[30rem] justify-center items-center text-xl mx-auto w-full font-semibold md:text-2xl">You haven't added any expenses</p>)
        }
    </div>
    );
};

export default AllExpenses;
