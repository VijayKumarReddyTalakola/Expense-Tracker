import './App.css'
import Login from './pages/Login'
import { BrowserRouter as Router ,Routes,Route} from 'react-router-dom'
import Register from './pages/Register'
import ProtectedLayout from './components/ProtectedLayout'
import { Toaster } from 'react-hot-toast'
import AllExpenses from './components/AllExpenses'
import AddExpense from './components/AddExpense'
import UpdateExpenseDetails from './components/UpdateExpenseDetails'
function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/login' element ={<Login />} />
          <Route path='/register' element ={<Register />} />
          <Route path='/' element ={<ProtectedLayout />} >
            <Route index element={<AllExpenses/>}/>
            <Route path='/expense/new' element={<AddExpense/>}/>
            <Route path='/expense/update/:id' element={<UpdateExpenseDetails/>}/>
          </Route>
        </Routes>
        <Toaster position='top-right'/>
      </Router>
    </>
  )
}

export default App
