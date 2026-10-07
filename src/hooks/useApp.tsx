import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import type { User } from '../types'
import { authService } from '../services/authService'
const load=<T,>(k:string,d:T):T=>{try{return JSON.parse(localStorage.getItem(k)||'')??d}catch{return d}}
interface Ctx{saved:string[];followed:string[];user:User|null;notify:boolean;toast:(m:string)=>void;toggleSave:(id:string)=>void;toggleFollow:(t:string)=>void;setUser:(u:User|null)=>void;setNotify:(b:boolean)=>void}
const C=createContext<Ctx>(null!)
export const useApp=()=>useContext(C)
export function AppProvider({children}:{children:ReactNode}){
  const [saved,setSaved]=useState<string[]>(()=>load('ns_saved',[]))
  const [followed,setFollowed]=useState<string[]>(()=>load('ns_follow',['Artificial Intelligence','Space','Technology','Cricket']))
  const [user,setUser]=useState<User|null>(()=>authService.current())
  const [notify,setNotify]=useState<boolean>(()=>load('ns_notify',true))
  const [toasts,setToasts]=useState<{id:number;m:string}[]>([])
  useEffect(()=>localStorage.setItem('ns_saved',JSON.stringify(saved)),[saved])
  useEffect(()=>localStorage.setItem('ns_follow',JSON.stringify(followed)),[followed])
  useEffect(()=>localStorage.setItem('ns_notify',JSON.stringify(notify)),[notify])
  const toast=(m:string)=>{const id=Date.now()+Math.random();setToasts(t=>[...t,{id,m}]);setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),2500)}
  const toggleSave=(id:string)=>{const on=saved.includes(id);setSaved(on?saved.filter(x=>x!==id):[...saved,id]);toast(on?'Removed from saved':'Article saved')}
  const toggleFollow=(t:string)=>{const on=followed.includes(t);setFollowed(on?followed.filter(x=>x!==t):[...followed,t]);toast(on?`Unfollowed ${t}`:`Following ${t}`)}
  return <C.Provider value={{saved,followed,user,notify,toast,toggleSave,toggleFollow,setUser,setNotify}}>{children}
    <div className="fixed bottom-4 right-4 z-50 space-y-2" role="status">{toasts.map(t=><div key={t.id} className="rounded-lg bg-ink px-4 py-2 text-sm text-white shadow-lg">{t.m}</div>)}</div></C.Provider>}
