import React from 'react'

const ExpenseTable = ({ expenses = [], deleteExpens }) => {
  return (
    <div className="expense-list">
      {/* Check if expenses is an array and has data */}
      {expenses.length > 0 ? (
        expenses.map((expense) => (
          <div key={expense._id} className="expense-item">
            <button
              className="delete-button"
              onClick={() => deleteExpens(expense._id)}
            >
              X
            </button>
            <div className="expense-description">{expense.text}</div>
            <div
              className="expense-amount"
              style={{ color: expense.amount > 0 ? '#27ae60' : '#c0392b' }}
            >
              ₹{expense.amount}
            </div>
          </div>
        ))
      ) : (
        <p>No expenses available</p>
      )}
    </div>
  )
}

export default ExpenseTable
