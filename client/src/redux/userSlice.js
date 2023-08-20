import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../api/axios";
import { toast } from "react-hot-toast";

const token = localStorage.getItem("token");
const user = localStorage.getItem("user");

const initialState = {
  isLoading: false,
  user: user ? JSON.parse(user) : null,
  expenses: [],
  expense: {},
  token,
  filteredExpenses: [],
};

export const registerUser = createAsyncThunk(
  "/api/user/register",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/user/register", payload);
      return response.data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const userLogin = createAsyncThunk(
  "/api/user/login",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/user/login", payload);
      return response.data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const addExpense = createAsyncThunk(
  "/api/expense/(post)",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/expense/", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const getAllExpenses = createAsyncThunk(
  "/api/expense/(get)",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/expense/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return response.data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const getExpenseDetails = createAsyncThunk(
  "/api/expense/:id(get)",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/expense/${payload.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return response.data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const deleteExpense = createAsyncThunk(
  "/api/expense/:id(delete)",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/expense/${payload}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return response.data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const updateExpense = createAsyncThunk(
  "/api/expense/:id(patch)",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/expense/${payload.id}`,payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      return response.data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const getFilteredExpenses = createAsyncThunk(
  "/api/expense/filter(post)",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/expense/filter`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    logout: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.reload();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(registerUser.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      localStorage.setItem("token", payload.token);
      localStorage.setItem("user", JSON.stringify(payload.user));
      state.token = payload.token;
      state.user = payload.user;
      toast.success(payload.message);
    });
    builder.addCase(registerUser.rejected, (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload.error);
    });

    builder.addCase(userLogin.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(userLogin.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      localStorage.setItem("token", payload.token);
      localStorage.setItem("user", JSON.stringify(payload.user));
      state.token = payload.token;    
      state.user = payload.user;
      toast.success(payload.message);
    });
    builder.addCase(userLogin.rejected, (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload.error);
    });

    builder.addCase(addExpense.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addExpense.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.expenses = payload.allExpenses;
      toast.success(payload.message);
    });
    builder.addCase(addExpense.rejected, (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload.error);
    });

    builder.addCase(getAllExpenses.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getAllExpenses.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.expenses = payload.expenses;
    });
    builder.addCase(getAllExpenses.rejected, (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload.error);
    });

    builder.addCase(getExpenseDetails.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getExpenseDetails.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.expense = payload.expense;
      toast.success(payload.message);
    });
    builder.addCase(getExpenseDetails.rejected, (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload.error);
    });

    builder.addCase(deleteExpense.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteExpense.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.expenses = payload.allExpenses;
      toast.success(payload.message);
    });
    builder.addCase(deleteExpense.rejected, (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload.error);
    });

    builder.addCase(updateExpense.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateExpense.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.expenses = payload.allExpenses;
      toast.success(payload.message);
    });
    builder.addCase(updateExpense.rejected, (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload.error);
    });

    builder.addCase(getFilteredExpenses.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getFilteredExpenses.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.filteredExpenses = payload.expenses;
      toast.success(payload.message);
    });
    builder.addCase(getFilteredExpenses.rejected, (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload.error);
    });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;