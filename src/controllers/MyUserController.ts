import { Request, Response } from "express";
import User from "../models/user";

const getCurrentUser = async (req: Request, res: Response) =>{
  try{
    const currentUser = await User.findOne({
      _id:req.userId
    })
    if(!currentUser){
      return res.status(404).json({message: "User not found"})

    }

    res.json(currentUser);
  }catch(error){
    console.log(error)
    return res.status(500).json({message: "Something went wrong"});
  }

}

const createCurrentUser = async (req: Request, res: Response) => {
  //Check if user exists
  //create user if it doesnt exist
  //return user object to calling client

  try {
    const { auth0Id } = req.body;
    const existingUser = await User.findOne({ auth0Id });

    if (existingUser) {
      return res.status(200).send();
    }

    const newUser = new User(req.body);

    await newUser.save();

    res.status(201).json(newUser.toObject());
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error Creating user" });
  }
};

//function to populate user profile page 
const updateCurrentUser = async (req: Request, res: Response) => {
  try {
    const { name, addressLine1, country, city } = req.body;

    //need to find some way to find mongodb id of user (use auth0Id)
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    //by being specific in our handler properties, we ignore any additional properties that are part of the user like email and auth
    user.name = name;
    user.addressLine1 = addressLine1;
    user.city = city;
    user.country = country;

    await user.save();

    //send back user to calling client
    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error updating user" });
  }
};

export default {
  createCurrentUser,
  updateCurrentUser,
  getCurrentUser,
};
