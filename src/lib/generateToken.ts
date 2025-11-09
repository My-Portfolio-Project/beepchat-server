
import {  Response } from 'express';
const jwt = require('jsonwebtoken')



async function generateToken  (id: string, res: Response){

    if(!id) {
        return res.status(400).json({
            message: 'No Id'
        })
    }

    const token  =  jwt.sign({id}, process.env.JWT_SEC,{expiresIn: "7d"})

    res.cookie('token', token , {
        httpOnly: true,
        sameSite:process.env.Node === 'production' ,
        secure: true,
        maxAge: 7 * 60 * 60 * 1000

    })



    return token
    
}


module.exports = generateToken