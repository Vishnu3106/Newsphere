export const ago=(iso:string)=>{const h=(Date.now()-+new Date(iso))/36e5;return h<1?`${Math.max(1,Math.round(h*60))}m ago`:h<24?`${Math.round(h)}h ago`:`${Math.round(h/24)}d ago`}
export const clock=(iso:string)=>new Date(iso).toLocaleTimeString([],{hour:'numeric',minute:'2-digit'})
