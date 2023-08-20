import express from "express";
import { addExpense, deleteExpense, getAllExpenses, getExpense, getFilteredExpenses, updateExpense } from "../controllers/expenseController.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

router.use(requireAuth);

router.route('/').get(getAllExpenses).post(addExpense)
router.route('/:id').get(getExpense).patch(updateExpense).delete(deleteExpense)
router.route('/filter').post(getFilteredExpenses)

export default router;
