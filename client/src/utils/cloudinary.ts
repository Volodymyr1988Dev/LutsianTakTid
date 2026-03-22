export function cloudinary(url:string,width: number){

if(!url.includes("/upload/")) return url

return url.replace(
"/upload/",
`/upload/f_auto,q_auto:good,c_limit,w_${width}/`
)

}