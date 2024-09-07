import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { APIUrl, handleError, handleSuccess } from '../utils'
import { ToastContainer } from 'react-toastify'
import ExpenseTable from './ExpenseTable'
import ExpenseDetails from './ExpenseDetails'
import ExpenseForm from './ExpenseForm'

function Home() {
  const [loggedInUser, setLoggedInUser] = useState('')
  const [expenses, setExpenses] = useState([]) // Make sure expenses is always an array
  const [incomeAmt, setIncomeAmt] = useState(0)
  const [expenseAmt, setExpenseAmt] = useState(0)

  const navigate = useNavigate()

  // Fetch logged-in user from localStorage when component mounts
  useEffect(() => {
    setLoggedInUser(localStorage.getItem('loggedInUser'))
  }, [])

  // Handle logout
  const handleLogout = (e) => {
    localStorage.removeItem('token')
    localStorage.removeItem('loggedInUser')
    handleSuccess('User Logged out')
    setTimeout(() => {
      navigate('/login')
    }, 1000)
  }

  // Calculate income and expenses based on transaction amounts
  useEffect(() => {
    const amounts = expenses.map((item) => item.amount)
    const income = amounts
      .filter((item) => item > 0)
      .reduce((acc, item) => acc + item, 0)
    const exp =
      amounts.filter((item) => item < 0).reduce((acc, item) => acc + item, 0) *
      -1

    setIncomeAmt(income)
    setExpenseAmt(exp)
  }, [expenses])

  // Delete an expense by ID
  const deleteExpens = async (id) => {
    try {
      const url = `${APIUrl}/expenses/${id}`
      const options = {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
        method: 'DELETE',
      }
      const response = await fetch(url, options)
      if (response.status === 403) {
        localStorage.removeItem('token')
        navigate('/login')
        return
      }
      const result = await response.json()
      handleSuccess(result?.message)
      setExpenses(result.data)
    } catch (err) {
      handleError(err)
    }
  }

  // Fetch all expenses
  const fetchExpenses = async () => {
    try {
      const url = `${APIUrl}/expenses`
      const options = {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      }
      const response = await fetch(url, options)
      if (response.status === 403) {
        localStorage.removeItem('token')
        navigate('/login')
        return
      }
      const result = await response.json()
      console.log('--result', result) // Log the full response
      setExpenses(result.data || []) // Safely handle missing data
    } catch (err) {
      handleError(err)
    }
  }

  // Add a new expense
  const addTransaction = async (data) => {
    try {
      const url = `${APIUrl}/expenses`
      const options = {
        headers: {
          Authorization: localStorage.getItem('token'),
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(data),
      }
      const response = await fetch(url, options)
      if (response.status === 403) {
        localStorage.removeItem('token')
        navigate('/login')
        return
      }
      const result = await response.json()
      handleSuccess(result?.message)
      setExpenses(result.data)
    } catch (err) {
      handleError(err)
    }
  }

  // Fetch expenses when component mounts
  useEffect(() => {
    fetchExpenses()
  }, [])

  return (
    <div>
      <div className="user-section">
        <h1>Welcome {loggedInUser}</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <ExpenseDetails incomeAmt={incomeAmt} expenseAmt={expenseAmt} />

      <ExpenseForm addTransaction={addTransaction} />

      <ExpenseTable expenses={expenses} deleteExpens={deleteExpens} />

      <ToastContainer />
    </div>
  )
}

export default Home
