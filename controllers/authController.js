const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY || "your-default-secret-key";
const Customer = require("../models/customerModel"); // Customer data (name, email, contact, address)
const Credential = require("../models/credentials"); // Authentication data (email, password, role)

// REGISTER FUNCTION
const register = async (req, res) => {
  try {
    const {
      full_name,
      email,
      contact_number,
      address,
      password,
      profilePicture,
    } = req.body;

    // Check if the email already exists in credentials
    const existingCred = await Credential.findOne({ email });
    if (existingCred) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Check if the phone number already exists in customers
    const existingCustomer = await Customer.findOne({ contact_number });
    if (existingCustomer) {
      return res.status(400).json({ error: "Phone number already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the Customer entry (excluding password)
    const newCustomer = new Customer({
      full_name,
      email,
      contact_number,
      address,
      profilePicture,
    });
    await newCustomer.save();

    // Create and save the Credential entry (for authentication)
    const newCredential = new Credential({
      user_id: newCustomer._id,
      email: newCustomer.email,
      password: hashedPassword,
      role: "customer", // Default role, can be expanded later
    });
    await newCredential.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// LOGIN FUNCTION
const login = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;
    let email = emailOrPhone;
    let customer;

    // Check if input is a phone number
    if (!emailOrPhone.includes("@")) {
      // If it's not an email, assume it's a phone number and fetch the email
      customer = await Customer.findOne({ contact_number: emailOrPhone });
      if (!customer) {
        return res.status(403).json({ error: "Invalid email or phone number" });
      }
      email = customer.email; // Use the email associated with the phone number
    }

    // Find credentials using email
    const cred = await Credential.findOne({ email }).populate("user_id");
    if (!cred) {
      return res.status(403).json({ error: "Invalid email or password" });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, cred.password);
    if (!isPasswordValid) {
      return res.status(403).json({ error: "Invalid email or password" });
    }

    // Fetch customer details
    if (!customer) {
      customer = await Customer.findById(cred.user_id);
      if (!customer) {
        return res.status(404).json({ error: "Customer details not found" });
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { email: cred.email, role: cred.role, full_name: customer.full_name },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ token, user: customer });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

module.exports = { register, login };
