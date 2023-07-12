const signUpUserDetails = require('../models/signup');
const bcrypt = require('bcrypt');

//for eg if we keep email column in form as blank and if i submit data will not be added to the database table (remove required text from signup.html page then only it works)
/*
function isstringvalid(string){
    if(string === undefined || string.length === 0){
        return true;
    }else{
        return false;
    }
} */

//Sign Up page:
exports.adduserDB = async (req,res,next) =>{
    try{
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        console.log('from req.body>>>',name,email,password);

        /*
        if(isstringvalid(name) || isstringvalid(email) || isstringvalid(password)){
            return res.status(400).json({success:false,message:'please fill all the details of the form'});
        } */
        //for eg if we keep email column in form as blank and if i submit data will not be added to the database table (remove required text from signup.html page then only it works)
        if(name ==="" || email ==="" || password === ""){
            return res.status(400).json({success:false,message:"please fill all the details of the form"});
        }

        //when executing this code, it will search the signUpUserDetails table for any records where the email column matches the email value you provided.
        //The result, stored in the uniqueEmail variable, will be an array of objects representing the matching user details.
        //You can then check the length of the uniqueEmail array to determine if a user with the provided email already exists in the database.
        //If the length is not zero, it indicates that there is a matching record, meaning the email is already taken.

        //if user trying to add existing mail id sending error from backend
        const uniqueEmail = await signUpUserDetails.findAll({where:{email:email}});
        //it will find wheather the entered mail id matches with existing mail id
        if(uniqueEmail.length !== 0){
            //if email id matches we comes to know that 
            return res.status(500).json({success:false,message:'user already exist,change the Email'})
        }
        /* 
        else if(uniqueEmail.length === 0){
        const data = await signUpUserDetails.create({
            name:name,
            email:email,
            password:password
        });
        
        
        res.json({success:true,message:'Signup succesfull,login to enter a page'});
        }
        */

        //Your users's password is at risk!!! :
        //here we are taking password,adding salt to it and then we are doing password encription using "blowfish algorithm"
        //so that we will get different different hash value eventhough userA,userB password are same
        //these hash value we will be storing in database as password
        const saltrounds = 10; //by defautl value of saltroud will be 10
        //This line defines the number of salt rounds to be used during the password hashing process.
        //The higher the number, the more secure the hash will be, but it will also take longer to compute.
        bcrypt.hash(password, saltrounds, async (err,hash) =>{
            console.log(err);

            const data = await signUpUserDetails.create({
            name:name,
            email:email,
            password:hash
        });
        
        })

        
        res.json({success:true,message:'Signup succesfull,login to enter a page'});
    }catch(error){
        console.log('error from adduserdb',error);
        res.json({success:false,message:'user already exist..please signup with new email'});
    }
}

