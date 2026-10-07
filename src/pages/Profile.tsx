import { Link } from 'react-router-dom'
import { useApp } from '../hooks/useApp'
export default function Profile(){
  const {user,followed,notify,setNotify,toast}=useApp()
  if(!user)return <div className="py-24 text-center">Please <Link className="text-accent" to="/login">log in</Link> to manage your profile.</div>
  return <div className="mx-auto max-w-2xl space-y-8 px-4 py-10"><div className="flex items-center gap-4"><div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-2xl font-semibold text-white">{user.name[0].toUpperCase()}</div><div><h1 className="font-serif text-2xl font-bold">{user.name}</h1><div className="text-sm text-slate-500">{user.email}</div></div></div>
    <section><h2 className="mb-2 font-semibold">Topics you follow</h2><div className="flex flex-wrap gap-2">{followed.map(t=><span key={t} className="rounded-full bg-accent-soft px-3 py-1 text-sm text-accent">{t}</span>)}</div></section>
    <section><h2 className="mb-2 font-semibold">Location</h2><select className="input" onChange={()=>toast('Location saved')}><option>Chennai</option><option>Mumbai</option><option>Delhi</option></select></section>
    <section><h2 className="mb-2 font-semibold">Notifications</h2><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={notify} onChange={e=>{setNotify(e.target.checked);toast(e.target.checked?'Notifications on':'Notifications off')}}/>Breaking news and topic updates</label></section></div>}
