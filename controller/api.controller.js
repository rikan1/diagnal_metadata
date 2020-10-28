const { User } = require('./../models/users.model');
const jwt = require('jsonwebtoken');


exports.getAllUsers = async (req,res)=>{
    try{
        const users = await User.find({});
        res.send(users);

    }catch(e){
        res.status(500).send(e);
    }
};

exports.createNewUser = async (req,res)=>{
    let data = req.body;
    const user = new User(data);

    try{
        let savedUser = await user.save();
        res.send({
            email:savedUser.email,
            name: savedUser.name
        });
    }catch(e){
        console.log(e);
        res.status(400).send(e);
    }
};

exports.login = async (req,res)=>{
    let data = req.body;
    if(!data.email){
        return res.status('400').send({message:"Please provide a email"});
    }

    if(!data.password){
        return res.status('400').send({message:"Please provide a password"});
    }

    try{
        const user = await User.findOne({email:data.email}).select('+password');
        if(user){
            // console.log(user);
            user.comparePassword(data.password, function(err, isMatch) {
                if (err){
                    console.log('>>',err);
                    return res.status(500).send(err);
                } 

                if(isMatch){
                    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET);
                    res.send({
                        email: user.email,
                        token
                    });
                }else{
                    return res.status(400).send({message:'Password is incorrect.'});
                }

                // console.log('Password123:', isMatch); // -> Password123: true
            });

        }else{
            return res.status(400).send({message:"email is not valid"});
        }

    }catch(e){
        console.log('<<<',e);
        res.status(500).send(e);
    }
};