import Developer from "../model/Developer.js";

export const fetchProjectsByDeveloper = async(items,status)=>{
    let arr = [];
    for (let item of items) {
        if (item?.developerRef) {
            const developerInfo = await Developer.findById(item?.developerRef);
            if(developerInfo){
                if(status){
                    arr.push({developerInfo:developerInfo,...item._doc});
                }else{
                    arr.push({developerInfo:developerInfo,...item});
                }
            }else{
                if(status){
                    arr.push({...item._doc});
                }else{
                    arr.push({...item});
                }
            }
        }else{
            if(status){
                arr.push({...item._doc});
            }else{
                arr.push({...item});
            }
        }
      }
    return arr;
}