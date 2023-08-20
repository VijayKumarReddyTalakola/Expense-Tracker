import mongoose from 'mongoose';
import Expense from '../models/expenseModel.js'

// get all expenses
export const getAllExpenses = async (req, res) => {
  try{
    const userId = req.userId;
    const expenses = await Expense.find({ userId }).select("-userId").sort({ createdAt: -1 })
    return res.status(200).json({message: "Expenses Data Sent",expenses});
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// get a single expense
export const getExpense = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "No such expense found" });
    }
    const expense = await Expense.findById(id).select("-userId");
    if (!expense) {
      return res.status(404).json({ error: "No such expense found" });
    }
    return res.status(200).json({message : "Expense Details",expense});
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// create a new expense
export const addExpense = async (req, res) => {
  try {
    const { title, amount } = req.body;
    if (!title || !amount) {
      return res.status(400).json({ error: "Please fill all fields" });
    }
    const userId = req.userId;
    req.body.userId = userId;
    const expense = await Expense.create(req.body);
    const allExpenses = await Expense.find({ userId }).select("-userId").sort({ createdAt: -1 })
    return res.status(200).json({message: "Expense Added", allExpenses});
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// delete a expense
export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "No such expense found" });
    }
    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({ error: "No such expense found" });
    }
    const response = await Expense.findByIdAndDelete(id);
    const allExpenses = await Expense.find({userId : req.userId }).select("-userId").sort({createdAt: -1});
    return res.status(200).json({message:"Expense Deleted",allExpenses});
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// update a expense
export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "No such expense found" });
    }
    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({ error: "No such expense found" });
    }
    const updatedExpense = await Expense.findByIdAndUpdate( { _id: id }, req.body ,{
      new:true,
      runValidators : true
    });
    const allExpenses = await Expense.find({ userId: req.userId }).select("-userId").sort({createdAt : -1});
    return res.status(200).json({ message : "Expense Updated",allExpenses});
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const getFilteredExpenses = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    if (!startDate || !endDate) {
      return res.status(400).json({ error: "Please provide both dates" });
    }
    const expenses = await Expense.find({ userId : req.userId, date: { $gte: startDate, $lte: endDate } }).select("-userId").sort({createdAt:-1})
    return res.status(200).json({message : "Requested Expenses",expenses})
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};