// middleware function that validates the data submitted by a customer for registering or logging in
const validateData = function(req, res, next) {
  const { name, number, email, password  } = req.body;

  // function to check the validity of the email address entered by the customer
  // return true if email is valid and false otherwise
  function validateEmail(customerEmail) {
    return /^[^\s@]+@(gmail\.com|yahoo\.com|hotmail\.com)$/.test(customerEmail);
  }
  
  // function to check if phone number is valid (10 digits && starts with 0)
  function validatePhoneNumber(phoneNumber) {
    // remove any non-digit characters from the phone number
    phoneNumber = phoneNumber.replace(/\D/g, '');
    // return /^0\d{9}$/.test(phoneNumber);
    // return /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/.test(phoneNumber);
    return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(phoneNumber);
}

  // for register route
  if (req.path === "/register") {
    console.log(!email.length);
    // if customer does not fill in all required information
    if (![name, number, email, password].every(Boolean)) {
      return res.status(401).send("Missing Credentials");  
    }
    // if email is invalid 
    else if (!validateEmail(email)) {
      return res.status(401).send("Invalid Email");
    }
    // if phone number is invalid
    else if (!validatePhoneNumber(number)) {
      return res.status(401).send("Invalid Phone Number")
    }
  } 
  
  // for login route
  else if (req.path === "/login") {
    if (![email, password].every(Boolean)) {
      return res.status(401).send("Missing Credentials");
    } 
    else if (!validateEmail(email)) {
      return res.status(401).send("Invalid Email");
    }
  }
  next();
};

module.exports = validateData;