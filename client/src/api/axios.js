import axios from "axios";
export default axios.create({
  baseURL: "https://expense-tracker-api-flame.vercel.app/",
});