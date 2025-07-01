import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function EditExpanse() {
  const { id } = useParams(); // expense id from url param
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [expenseCategoryId, setExpenseCategoryId] = useState('');
  const [expenseDate, setExpenseDate] = useState('');
  const [amount, setAmount] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [expenseFor, setExpenseFor] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load categories and expense data
  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, expRes] = await Promise.all([
          fetch('http://didar.intelsofts.com/Laravel_React/B_POS/public/api/expensecategories'),
          fetch(`http://didar.intelsofts.com/Laravel_React/B_POS/public/api/expenses/${id}`)
        ]);
        const categoriesData = await catRes.json();
        const expenseData = await expRes.json();

        setCategories(categoriesData);
        setExpenseCategoryId(expenseData.expense_category_id);
        setExpenseDate(expenseData.expense_date);
        setAmount(expenseData.amount);
        setReferenceNumber(expenseData.reference_number);
        setExpenseFor(expenseData.expense_for);
        setDescription(expenseData.description || '');
      } catch (error) {
        console.error('Failed to load data:', error);
        alert('Failed to load expense data.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      expense_category_id: expenseCategoryId,
      expense_date: expenseDate,
      amount: parseFloat(amount),
      reference_number: referenceNumber,
      expense_for: expenseFor,
      description,
    };

    try {
      const res = await fetch(`http://didar.intelsofts.com/Laravel_React/B_POS/public/api/expenses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        navigate('/pages/expanse/expanselist');
      } else {
        const errorData = await res.json();
        alert('Update failed: ' + JSON.stringify(errorData));
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('An error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading expense data...</div>;

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h4>Edit Expense</h4>
          <h6>Update your Expense</h6>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Expense Category */}
              <div className="col-lg-3 col-sm-6 col-12">
                <div className="form-group">
                  <label>Expense Category</label>
                  <select
                    className="form-control"
                    value={expenseCategoryId}
                    onChange={(e) => setExpenseCategoryId(e.target.value)}
                    required
                  >
                    <option value="">Choose Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Expense Date */}
              <div className="col-lg-3 col-sm-6 col-12">
                <div className="form-group">
                  <label>Expense Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Amount */}
              <div className="col-lg-3 col-sm-6 col-12">
                <div className="form-group">
                  <label>Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Reference No */}
              <div className="col-lg-3 col-sm-6 col-12">
                <div className="form-group">
                  <label>Reference No.</label>
                  <input
                    type="text"
                    className="form-control"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                  />
                </div>
              </div>

              {/* Expense for */}
              <div className="col-lg-12">
                <div className="form-group">
                  <label>Expense for</label>
                  <input
                    type="text"
                    className="form-control"
                    value={expenseFor}
                    onChange={(e) => setExpenseFor(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="col-lg-12">
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="col-lg-12">
                <button
                  type="submit"
                  className="btn btn-submit me-2"
                  disabled={submitting}
                >
                  {submitting ? 'Updating...' : 'Update'}
                </button>
                <button
                  type="button"
                  className="btn btn-cancel"
                  onClick={() => window.history.back()}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditExpanse;
