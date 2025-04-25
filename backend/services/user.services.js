import User from "../db/models/user.model.js";

export const createUser = async ({ email, password }) => { // Function to create a new user
  if (!email || !password) {// Check if email and password are provided
    throw new Error("Email and password are required"); // If not, throw an error
  }

  const hashedPassword = await User.hashPassword(password); // Hash the password using the hashPassword method from the User model

  const user = await User.create({ // Create a new user in the database and the user object is returned which contains the user details like email and hashed password
    email,
    password: hashedPassword,
  });

  return user;  // Return the created user
};


export const getAllUser = async(userId)=>{
  const allUsers = await User.find({_id: {$ne: userId}}); // Find all users except the one with the given userId 
  // console.log(allUsers);
  return allUsers; // Return the list of users
}



