import User from '../models/userModel.js'
import bcrypt from "bcryptjs";

// login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if(!email || !password) {
      return res.status(400).json({error : "Please fill all details"})
    }
    const user  = await User.findOne({email})
    if(!user){
      return res.status(404).json({error : "User not Found"})
    }
    const match = await bcrypt.compare(password, user.password);
    if(!match){
      return res.status(401).json({error : "Invalid Credentials"});
    }
    const token = await user.createAccessToken();
    return res.status(200).json({message : "Login Successful", user, token });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Register user
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({error : "Please fill all details"});
    }
    const isUser = await User.findOne({ email: email });
    if (isUser) {
      return res.status(409).json({error : "User Already Exists"});
    }
    const hashedPassword = await bcrypt.hashSync(password,10)
    req.body.password = hashedPassword;
    const user = await User.create(req.body)  
    const token = await user.createAccessToken();  
    return res.status(200).json({ message : "Registration Successful",user,token });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};