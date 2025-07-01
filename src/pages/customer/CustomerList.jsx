import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

function CustomerList() {
  const [customers, setCustomers] = useState([]);
   const [loading, setLoading] = useState(true);
   

  useEffect(() => {
    fetch('http://didar.intelsofts.com/Laravel_React/B_POS/public/api/customers')
      .then(res => res.json())
      .then(data =>{
            setCustomers(data);
            setLoading(false);
      } )
       .catch(err => {
        console.error('Failed to fetch stocks:', err);
        setLoading(false);
      });
  }, []);


  const deleteCustomer = async (id) => {
    try {
      const res = await fetch(`http://didar.intelsofts.com/Laravel_React/B_POS/public/api/customers/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!res.ok) throw new Error('Delete failed');
      setCustomers((prev) => prev.filter((customer) => customer.id !== id));
    } catch (err) {
      console.error('Delete error:', err.message);
    }
  };

  
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      deleteCustomer(id);
    }
  };
  if (loading) return <p>Loading ...</p>;
  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h4>Customer List</h4>
          <h6>Manage your Customers</h6>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          

          <div className="table-responsive">
            <table className="table datanew">
              <thead>
                <tr>
                  <th>
                    <label className="checkboxs">
                      <input type="checkbox" id="select-all" />
                      <span className="checkmarks"></span>
                    </label>
                  </th>
                  <th>Id</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(customer=> (
                  <tr key={customer.id}>
                    <td>
                      <label className="checkboxs">
                        <input type="checkbox" />
                        <span className="checkmarks"></span>
                      </label>
                    </td>
                    <td>{ customer.id}</td>
                    <td>{customer.name}</td>
                    <td>{customer.phone || 'N/A'}</td>
                    <td>{customer.email || 'N/A'}</td>
                    <td>{customer.address || 'N/A'}</td>
                    <td>{customer.description || 'N/A'}</td>
                    <td>
                      <NavLink className="me-3" to={`/pages/customer/customerlist/edit/${customer.id}`}>
                        <i className="bi bi-pencil-square" style={{ fontSize: '20px' }}></i>
                      </NavLink>
                       <button onClick={() => handleDelete(customer.id)} className="btn btn-link p-0">
                          <i className="bi bi-trash" style={{ fontSize: '20px', color: 'red' }}></i>
                        </button>
                    </td>
                  </tr>
                ))}
                {customers.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerList;
 