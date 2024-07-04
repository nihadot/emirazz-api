import City from "../model/City.js";

export const fetchProjectsByCity = async(items,status)=>{
    let arr = [];
    for (let item of items) {
        if (item?.cityRef) {
            const cityInfo = await City.findById(item?.cityRef);
            if(cityInfo){
                if(status){
                    arr.push({cityInfo:cityInfo,...item._doc});
                }else{
                    arr.push({cityInfo:cityInfo,...item});
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