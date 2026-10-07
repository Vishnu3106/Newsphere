import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import { useApp } from '../hooks/useApp'
export default function Auth({register=false}:{register?:boolean}){
  const {setUser,toast}=useApp();const nav=useNavigate();const [f,setF]=useState({name:'',email:'',pw:'',pw2:''})
  const submit=async(e:FormEvent)=>{e.preventDefault()
    if(register&&f.pw!==f.pw2)return toast('Passwords do not match')
    setUser(register?await authService.register(f.name,f.email,f.pw):await authService.login(f.email,f.pw));toast('Welcome to NewsSphere');nav('/')}
  const F=(k:keyof typeof f,l:string,t='text')=><label className="block text-sm font-medium">{l}<input required type={t} className="input mt-1" value={f[k]} onChange={e=>setF({...f,[k]:e.target.value})}/></label>
  return <div className="mx-auto max-w-sm px-4 py-16"><h1 className="font-serif text-3xl font-bold">{register?'Create your account':'Welcome back'}</h1>
    <form onSubmit={submit} className="mt-6 space-y-4">{register&&F('name','Name')}{F('email','Email','email')}{F('pw','Password','password')}{register&&F('pw2','Confirm password','password')}
      {!register&&<div className="flex justify-between text-sm"><label className="flex gap-2"><input type="checkbox"/>Remember me</label><a href="#" className="text-accent">Forgot password?</a></div>}
      <button className="btn-primary w-full justify-center">{register?'Register':'Login'}</button>
      <button type="button" className="btn-ghost w-full justify-center" onClick={()=>toast('Google sign-in is mocked')}>Continue with Google</button></form>
    <p className="mt-6 text-center text-sm text-slate-500">{register?<>Have an account? <Link className="text-accent" to="/login">Log in</Link></>:<>New here? <Link className="text-accent" to="/register">Register</Link></>}</p></div>}
