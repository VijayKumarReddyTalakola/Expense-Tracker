import Expense from '../models/expenseModel.js'
import mongoose from 'mongoose';

// get all expenses
export const getAllExpenses = async (req, res) => {
  const userId = req.userId;
  const expenses = await Expense.find({ userId }).select("-userId").sort({ createdAt: -1 })
  return res.status(200).json(expenses);
};

// get a single expense
export const getExpense = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such expense" });
  }
  const expense = await Expense.findById(id).select("-userId");
  if (!expense) {
    return res.status(404).json({ error: "No such expense" });
  }
  return res.status(200).json(expense);
};

// create a new expense
export const addExpense = async (req, res) => {
  const { title, amount } = req.body;
  try {
    if (!title || !amount) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }
    const userId = req.userId;
    req.body.userId = userId;
    const expense = await Expense.create(req.body);
    const allExpenses = await Expense.find({userId}).select("-userId")
    return res.status(200).json({expense, allExpenses});
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// delete a expense
export const deleteExpense = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "No such expense" });
    }
    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({ error: "No such expense" });
    }
    const response = await Expense.findByIdAndDelete(id);
    const allExpenses = await Expense.find({userId : req.userId }).select("-userId");
    return res.status(200).json(allExpenses);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// update a expense
export const updateExpense = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "No such expense" });
    }
    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({ error: "No such expense" });
    }
    const updatedExpense = await Expense.findByIdAndUpdate( { _id: id }, { ...req.body },{
      new:true,
      runValidators : false
    });
    const allExpenses = await Expense.find({ userId: req.userId }).select("-userId");
    return res.status(200).json(allExpenses);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};