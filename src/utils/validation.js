export const validateInvoiceForm = (form) => {
    const errors = {};
    if (!form.allocation_id) errors.allocation_id = 'Allocation is required';
    if (!form.amount_due || isNaN(form.amount_due)) errors.amount_due = 'Valid amount is required';
    return errors;
  };
  
  export const validatePayment = (form, maxAmount) => {
    const errors = {};
    if (!form.amount || isNaN(form.amount)) {
      errors.amount = 'Valid amount is required';
    } else if (parseFloat(form.amount) > maxAmount) {
      errors.amount = `Amount cannot exceed $${maxAmount.toFixed(2)}`;
    }
    return errors;
  };