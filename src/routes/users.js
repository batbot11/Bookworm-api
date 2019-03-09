import express from "express";
import User from "../models/User";
import ParseErrors from "../utils/ParseErrors";
import {sendConfirmationEmail} from "../mailer"; 

const router = express.Router();

router.post("/", (req, res) => {
    const {email, password} = req.body.data;
    const user = new User({email});
    user.setPassword(password);
    user.setConfirmationToken();
    user.save()
    .then(userRecord => {
        sendConfirmationEmail(userRecord)
       return res.status(200).json({user: userRecord.toAuthJson()})})
    .catch(err => res.status(400).json({errors: ParseErrors(err.errors) })); 

})

router.post("/confirmation", (req, res) => {
    const token = req.body.token;
    User.findOneAndUpdate(
        {confirmationToken: token},
        {confirmationToken: "", confirmed: true},
        {new: true}
    )
    .then(user => 
        user ? res.status(200).json({user: user.toAuthJson()}) : res.status(400).json({})
        )
})

export default router;