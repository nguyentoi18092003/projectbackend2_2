const Task=require("../models/task.model");
const paginationHelper=require("../../../helpers/pagination");
const searchHelper=require("../../../helpers/search");
//[GET]/api/v1/tasks
module.exports.index= async(req,res)=>{
    const find={
        deleted:false
    };
    //Chuc nang search
    const objectSearch=searchHelper(req.query);
    if(objectSearch.regex){
        find.title=objectSearch.regex;
    }
    //End Chuc nang search

    // Bộ lọc theo trang thai
    if(req.query.status){
        find.status=req.query.status;
    }
    // Hết bộ lọc theo trang thai
     //phan trang
     const countTasks= await Task.countDocuments(find);
     let objectPagination= paginationHelper(
         {
         currentPage:1,
         // mac dinh neu k truyen page tren url thi no se mac dinh la 1 
         limitItems:2
         },
         req.query,
         countTasks
         );
     
     //end phan trang

    //Sort
    const sort={}
    if(req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey]=req.query.sortValue;
    }
    //End sort
    const tasks=await Task.find(find)
    .sort(sort)//neu sort ma rong thi no cu lay theo mac dinh
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);
    res.json(tasks)
}
//[GET]/api/v1/tasks/detail/:id
module.exports.detail=async(req,res)=>{
        const id=req.params.id;
        const task= await Task.findOne({
            _id: id,
            deleted: false
        });
        res.json(task);

}
//[PATCH]//api/v1/tasks/change-status/:id
module.exports.changeStatus=async(req,res)=>{
    try{
        const id=req.params.id;
        const status=req.body.status;
        await Task.updateOne({_id:id} ,{status :status});
        res.json({
            code:200,
            message:"Cập nhật trạng thái thành công!"
        });
    }catch(error){
        res.json({
            code:400,
            message:"Cập nhật trạng thái không thành công!"
        });
    }
};