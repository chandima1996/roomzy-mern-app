import React from "react";
import AddHotelForm from "../components/admin/AddHotelForm"; // Import the form

const AdminPage = () => {
  return (
    <div className="container mx-auto p-4 flex justify-center">
      <div className="w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>
        <div className="flex justify-center">
          <AddHotelForm />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
