import User from '../models/userModel.js'
import bcrypt from "bcryptjs";

// login user
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
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
    return res.status(200).json({ user, token });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Register user
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
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
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};