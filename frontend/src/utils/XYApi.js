export function handelXYError(response){
    if(response.data.success) return
    throw new Error(response.data.errorMsg)
}