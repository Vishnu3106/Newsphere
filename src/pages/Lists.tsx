import { Link } from 'react-router-dom'
import { Bookmark } from 'lucide-react'
import NewsCard from '../components/NewsCard'
import { useApp } from '../hooks/useApp'
import { articles, stories, topics } from '../data/data'
const wrap=(t:string,c:React.ReactNode)=><div className="mx-auto max-w-6xl px-4 py-8"><h1 className="mb-6 font-serif text-3xl font-bold">{t}</h1>{c}</div>
export function Stories(){return wrap('Stories',<div className="grid gap-5 md:grid-cols-2">{stories.map(s=><Link key={s.storyId} to={`/story/${s.storyId}`} className="rounded-xl border border-slate-200 p-5 hover:shadow-md"><div className="text-xs text-slate-500">{s.category} · {s.articles.length} reports</div><h2 className="font-serif text-xl font-semibold">{s.title}</h2><p className="mt-1 text-sm text-slate-600">{s.summary}</p></Link>)}</div>)}
export function Saved(){const {saved}=useApp();const list=articles.filter(a=>saved.includes(a.articleId))
  return wrap('Saved news',list.length?<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map(a=><NewsCard key={a.articleId} a={a}/>)}</div>
  :<div className="py-20 text-center text-slate-500"><Bookmark className="mx-auto mb-3" size={32}/><p className="font-medium text-ink">Nothing saved yet</p><p className="text-sm">Tap the bookmark on any article to keep it here.</p><Link to="/explore" className="btn-primary mt-4">Explore news</Link></div>)}
export function Following(){const {followed,toggleFollow}=useApp()
  return wrap('Following',<div className="grid gap-4 sm:grid-cols-2">{topics.map(t=>{const on=followed.includes(t);const m=articles.filter(a=>a.tags.includes(t));return(
    <div key={t} className="flex items-center justify-between rounded-xl border border-slate-200 p-4"><div><div className="font-semibold">{t}</div><div className="text-xs text-slate-500">{m.length} updates{m[0]&&` · Latest: ${m[0].title}`}</div></div>
    <button onClick={()=>toggleFollow(t)} className={on?'btn-ghost':'btn-primary'}>{on?'Following':'Follow'}</button></div>)})}</div>)}
export function ForYou(){const {followed}=useApp();const list=articles.filter(a=>a.tags.some(t=>followed.includes(t)))
  return wrap('Your personalized news',<><p className="mb-4 text-sm text-slate-500">Because you follow {followed.join(', ')||'topics'}</p><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map(a=><NewsCard key={a.articleId} a={a}/>)}</div></>)}
