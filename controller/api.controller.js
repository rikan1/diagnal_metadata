const { User } = require('./../models/users.model');
const { File } = require('./../models/files.model');
const { Folder } = require('./../models/folders.model');


const jwt = require('jsonwebtoken');


// exports.getAllUsers = async (req,res)=>{
//     try{
//         const users = await User.find({});
//         res.send(users);

//     }catch(e){
//         res.status(500).send(e);
//     }
// };

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

exports.addFile = async (req,res)=>{
    let data = req.body;
    const {user} = req;

    data.userId = user._id;
    const file = new File(data);

    try{

        if(data.name){
            let existFile = await File.find({name:data.name.toLowerCase(),userId:user._id});
            if(existFile.length){
                return res.status(400).send({message:'Same file already exits.'});
            }
        }

        if(data.folderId){
            let existFolder = await Folder.findById({_id:data.folderId});
            if(existFolder && existFolder.userId.toString() !== user._id.toString()){
                return res.status(400).send({message:'You can not add files to folders of others.'});
            }
        }

        let savedFile = await file.save();
        res.send(savedFile);
    }catch(e){
        console.log(e);
        res.status(400).send(e);
    }
};

exports.addFolder = async (req,res)=>{
    let data = req.body;
    const {user} = req;

    data.userId = user._id;
    const folder = new Folder(data);

    try{

        if(data.name){
            let existFolder = await Folder.find({name:data.name.toLowerCase(),userId:user._id});
            if(existFolder.length){
                return res.status(400).send({message:'Same folder already exits.'});
            }
        }
       
        let savedFolder = await folder.save();
        res.send(savedFolder);
    }catch(e){
        console.log(e);
        res.status(400).send(e);
    }
};

exports.moveFile = async (req,res)=>{

    const {user} = req;
    const {fromFolder,toFolder} = req.body;

    if(!fromFolder){
        return res.status(400).send({message:"formFolder id is required!"});
    }
    if(!toFolder){
        return res.status(400).send({message:"toFolder id is required!"});
    }

    try{

        const fromFolderDetail = await Folder.findById({_id:fromFolder});

        if(fromFolderDetail && fromFolderDetail.userId.toString() !== user._id.toString()){
            return res.status(400).send({message:'From folder is not yours.'});
        }

        const toFolderDetail = await Folder.findById({_id:fromFolder});

        if(toFolderDetail && toFolderDetail.userId.toString() !== user._id.toString()){
            return res.status(400).send({message:'to folder is not yours.'});
        }

        await File.updateMany({folderId:fromFolder},{folderId:toFolder});
        res.send({message:"Files moved successfully."})

    }catch(e){
        console.log(e);
        res.status(400).send(e);
    }
};

exports.home = async (req,res)=>{

    const {user} = req;

    try{
        const files = await File.find({userId:user._id,folderId:{$exists:false}}).count();
        const folders = await Folder.find({userId:user._id}).count();

        res.send({
            files,
            folders
        });
    }catch(e){
        console.log(e);
        res.status(400).send(e);
    }
};

exports.getFilesFromFolder = async (req,res)=>{
    const {user} = req;
    const {folderId} = req.query;
    if(!folderId){
        return res.status(400).send({message:"folder id is required!"});
    }
    try{

        const folder = await Folder.findById({_id:folderId});
        if(folder && folder.userId.toString() !== user._id.toString()){
            return res.status(400).send({message:'You can not see files of this folder.'});
        }

        const files = await File.find({folderId});
        res.send(files);

    }catch(e){
        console.log(e);
        res.status(400).send(e);
    }
}