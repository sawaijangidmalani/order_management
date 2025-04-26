import axios from "axios";

const BASE_URL = "https://order-management-tgh3.onrender.com";

// Check if Supplier Exists
export const checkSupplierExists = async (name, email) => {
  try {
    const response = await axios.get(`${BASE_URL}/supplier/checkDuplicate`, {
      params: { name, email },
    });
    return {
      nameExists: response.data.nameExists,
      emailExists: response.data.emailExists,
    };
  } catch (error) {
    console.error("Error checking supplier:", error);
    return { nameExists: false, emailExists: false };
  }
};

// Add New Supplier
export const addSupplier = async (formData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/supplier/add_supplier`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error("Error adding supplier:", error);
    throw new Error("Error adding supplier");
  }
};

// Update Existing Supplier
export const updateSupplier = async (formData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/supplier/updateSupplier`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating supplier:", error);
    throw new Error("Error updating supplier");
  }
};
