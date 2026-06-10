import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export function createUser(req, res) {

    if(req.user == null){
        res.status(401).json({
            message: "Please login and try again"
        })
        return
    }
    if(req.user.role != "admin"){
        res.status(403).json({ 
            message: "You must be an admin to create a user"
        })
        return
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const user = new User(
        {
            email : req.body.email,
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            password : hashedPassword
        }
    )
    user.save().then(
        ()=>{
            res.json({
                message : "User created successfully"
            })
        }
    ).catch(
        ()=>{
            res.json({
                message : "Error creating user"
            })
        }
    )
}

export function loginUser(req, res) {
    User.findOne(
        {
            email : req.body.email
        }
    ).then(
        (user)=>{
            if(user == null){
                res.status(404).json(
                    {
                        message : "User not found"
                    }
                )
            }
            else{
                const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
                if(isPasswordValid){

                    const token = jwt.sign(
                        {
                            email : user.email,
                            firstName : user.firstName,
                            lastName : user.lastName,
                            role : user.role,
                            isEmailVerified : user.isEmailVerified
                        },
                        "jwt-secret"
                    )

                    res.json(
                        {
                            message : "Login successful",
                            token : token
                        }
                    )


                }
                else{
                    res.status(401).json(
                        {
                            message : "Invalid password"
                        }
                    )
                }
            }
        }
    )
}
