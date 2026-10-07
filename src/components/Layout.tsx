import { useState, FormEvent } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Search, Bell, Menu, X, Globe2 } from 'lucide-react'
import { useApp } from '../hooks/useApp'
import { authService } from '../services/authService'
const links=[['/','Home'],['/explore','Explore'],['/stories','Stories'],['/following','Following'],['/saved','Saved']]
const cls=({isActive}:{isActive:boolean})=>`text-sm font-medium ${isActive?'text-accent':'text-slate-600 hover:text-ink'}`
export default function Layout(){
  const {user,setUser,notify}=useApp();const nav=useNavigate();const [open,setOpen]=useState(false);const [q,setQ]=useState('')
  const go=(e:FormEvent)=>{e.preventDefault();if(q.trim())nav(`/search?q=${encodeURIComponent(q)}`)}
  return <div className="flex min-h-screen flex-col">
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur"><div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
      <Link to="/" className="flex items-center gap-2 font-serif text-xl font-bold"><Globe2 className="text-accent" size={22}/>NewsSphere</Link>
      <nav className="hidden gap-6 md:flex">{links.map(([to,l])=><NavLink key={to} to={to} end={to==='/'} className={cls}>{l}</NavLink>)}</nav>
      <form onSubmit={go} className="relative ml-auto hidden sm:block"><Search size={16} className="absolute left-3 top-2.5 text-slate-400"/><input aria-label="Search" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search news…" className="input w-56 pl-9"/></form>
      <Link to="/profile" aria-label="Notifications" className="relative ml-auto rounded p-2 hover:bg-slate-100 sm:ml-0"><Bell size={18}/>{notify&&<span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500"/>}</Link>
      {user?<div className="flex items-center gap-2"><Link to="/profile" aria-label="Profile" className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">{user.name[0].toUpperCase()}</Link>
        <button className="btn-ghost hidden sm:inline-flex" onClick={()=>{authService.logout();setUser(null);nav('/')}}>Log out</button></div>
        :<Link to="/login" className="btn-primary">Log in</Link>}
      <button className="md:hidden" aria-label="Menu" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></div>
      {open&&<nav className="space-y-3 border-t px-4 py-3 md:hidden">{links.map(([to,l])=><div key={to}><NavLink to={to} end={to==='/'} onClick={()=>setOpen(false)} className={cls}>{l}</NavLink></div>)}</nav>}</header>
    <main className="flex-1"><Outlet/></main>
    <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500">© 2026 NewsSphere · Understand the story, not just the headline.</footer></div>}
