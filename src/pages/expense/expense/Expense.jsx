import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

function Expense() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch expenses data on component mount
  useEffect(() => {
    fetch('http://didar.intelsofts.com/Laravel_React/B_POS/public/api/expenses')
      .then(res => res.json())
      .then(data => {
        setExpenses(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch expenses:', err);
        setLoading(false);
      });
  }, []);

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;

    try {
      const res = await fetch(`http://didar.intelsofts.com/Laravel_React/B_POS/public/api/expenses/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setExpenses(expenses.filter(expense => expense.id !== id));
      } else {
        console.error('Failed to delete expense');
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h4>Expense List</h4>
          <h6>Manage your Expenses</h6>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
        
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Expense Categorie</th>
                    <th>Reference Number</th>
                    <th>Expense For</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
  {expenses.length === 0 ? (
    <tr>
      <td colSpan="8" className="text-center">No expenses found.</td>
    </tr>
  ) : (
    expenses.map(expense => (
      <tr key={expense.id}>
        <td>{expense.id}</td>
        <td>{expense.category?.name || 'Null'}</td>
        <td>{expense.reference_number}</td>
        <td>{expense.expense_for}</td>
        <td>{expense.amount}</td>
        <td>{expense.expense_date}</td>
        <td>{expense.description || 'N/A'}</td>
        <td>
          <NavLink to={`/pages/expanse/expanse/edit/${expense.id}`} className="me-3">
            <i className="bi bi-pencil-square" style={{ fontSize: '20px' }}></i>
          </NavLink>
          <button
            onClick={() => handleDelete(expense.id)}
            className="btn btn-link p-0"
            title="Delete"
          >
            <i className="bi bi-trash" style={{ fontSize: '20px', color: 'red' }}></i>
          </button>
        </td>
      </tr>
    ))
  )}
</tbody>
              </table>
            </div>
        
        </div>
      </div>
    </div>
  );
}

export default Expense;
