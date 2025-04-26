import axios from "axios";

const BASE_URL = "https://order-management-tgh3.onrender.com";

// Check if Customer Exists
export const checkCustomerExists = async (name, email) => {
  try {
    const response = await axios.get(`${BASE_URL}/customer/checkDuplicate`, {
      params: { name, email },
    });
    return {
      nameExists: response.data.nameExists,
      emailExists: response.data.emailExists,
    };
  } catch (error) {
    console.error("Error checking customer:", error);
    return { nameExists: false, emailExists: false };
  }
};

// Add New Customer
export const addCustomer = async (formData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/customer/add_customer`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error("Error adding customer:", error);
    throw new Error("Error adding customer");
  }
};

// Update Existing Customer
export const updateCustomer = async (formData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/customer/updateCustomer`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating customer:", error);
    throw new Error("Error updating customer");
  }
};

// Fetch All Customers
export const getCustomers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/customer/getCustomerData`);
    return response.data;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw new Error("Error fetching customers");
  }
};

// Delete Customer
export const deleteCustomer = async (email) => {
  try {
    const response = await axios.delete(`${BASE_URL}/customer/deleteCustomer`, {
      data: { email },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw new Error("Error deleting customer");
  }
};
