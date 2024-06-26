const md5=require("md5");
const User=require("../models/user.model");

const generate=require("../../../helpers/generate");

//[POST]/api/v1/users/register
module.exports.register=async(req,res)=>{
    const exitsEmail=await User.findOne({
        email:req.body.email,
        deleted:false
    });
    if(exitsEmail){
        res.json({
            code:400,
            message:"Email đã tồn tại!"
        });
        return ;
    }
    const infoUser={
        fullName:req.body.fullName,
        email:req.body.email,
        password:md5(req.body.password),
        token:generate.generateRandomString(30)
    };
    const user=new User(infoUser);
    await user.save();

    console.log(user)
    const token=user.token;
    res.cookie("token",token);
    res.json({
        code:200,
        message:"Tạo tài khoản thành công!",
        token:token
    });
};

//[POST]/api/v1/users/login
module.exports.login=async (req,res)=>{
    const email=req.body.email;
    const password=req.body.password;

    const user=await User.findOne({
        email:email,
        deleted:false
    })
    if(!user){
        res.json({
            code:400,
            message:"Email không tồn tại!"
        });
        return;
    }
    // console.log(email)
    // console.log(password)
    // console.log(md5(password))
    // console.log(user.password)
    if(md5(password)!==user.password){
        res.json({
            code:400,
            message:"Sai mật khẩu!"
        });
        return;
    }
    
    const token=user.token;
    res.cookie("token",token);
    res.json({
        code:200,
        message:"Đăng nhập thành công!",
        token:token
    })
}
//[POST]/api/v1/users/detail/:id
module.exports.detail=async(req,res)=>{
    const id=req.params.id;
    const user=await User.findOne({
        _id:id,
        deleted:false
    }).select("-password -token");
    res.json({
        code:200,
        message:"Thành công",
        info:user
    });
};