import { useState } from "react";
import API from "../services/api";

export default function AddEmployee() {

  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    salary: "",
    department: "",
  });

  const handleChange = (e) => {
    setEmployee({
      ...employee,
      [e.target.name]: e.target.value,
    });
  };

  const addEmployee = async () => {

    try {

      await API.post("employees/", employee);

      alert("Employee Added");

    } catch (error) {

      console.log(error);

    }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow">

      <h1 className="text-2xl font-bold mb-5">
        Add Employee
      </h1>

      <div className="grid gap-3">

        <input
          type="text"
          name="name"
          placeholder="Name"
          className="border p-3 rounded"
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border p-3 rounded"
          onChange={handleChange}
        />

        <input
          type="number"
          name="salary"
          placeholder="Salary"
          className="border p-3 rounded"
          onChange={handleChange}
        />

        <input
          type="text"
          name="department"
          placeholder="Department"
          className="border p-3 rounded"
          onChange={handleChange}
        />

        <button
          onClick={addEmployee}
          className="bg-black text-white p-3 rounded"
        >
          Add Employee
        </button>

      </div>

    </div>
  );
}