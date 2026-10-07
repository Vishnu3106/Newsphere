import { Link } from 'react-router-dom'
import { Bookmark, MapPin, Layers } from 'lucide-react'
import type { Article } from '../types'
import { useApp } from '../hooks/useApp'
import { ago } from '../utils/format'
export const Highlight=({text,q}:{text:string;q?:string})=>{
  const i=q?text.toLowerCase().indexOf(q.toLowerCase()):-1
  if(!q||i<0)return <>{text}</>
  return <>{text.slice(0,i)}<mark className="bg-yellow-100">{text.slice(i,i+q.length)}</mark>{text.slice(i+q.length)}</>}
export default function NewsCard({a,q}:{a:Article;q?:string}){
  const {saved,toggleSave}=useApp();const on=saved.includes(a.articleId)
  return <article className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:shadow-md">
    <img src={a.image} alt="" loading="lazy" className="h-40 w-full bg-slate-100 object-cover"/>
    <div className="flex flex-1 flex-col p-4">
      <div className="flex items-center gap-2 text-xs"><span className="rounded-full bg-accent-soft px-2 py-0.5 font-medium text-accent">{a.category}</span><span className="font-semibold text-slate-700">{a.source}</span><span className="text-slate-400">· {ago(a.publishedAt)}</span></div>
      <Link to={`/story/${a.storyId}`} className="mt-2 font-serif text-lg font-semibold leading-snug hover:text-accent"><Highlight text={a.title} q={q}/></Link>
      <p className="mt-1 line-clamp-2 text-sm text-slate-600"><Highlight text={a.description} q={q}/></p>
      <div className="mt-auto flex items-center justify-between pt-3 text-xs text-slate-500">
        <span className="flex items-center gap-1"><MapPin size={12}/>{a.location}</span>
        <div className="flex items-center gap-2">
          <Link to={`/story/${a.storyId}`} className="flex items-center gap-1 text-accent"><Layers size={12}/>Story</Link>
          <button aria-label={on?'Remove from saved':'Save article'} onClick={()=>toggleSave(a.articleId)} className="rounded p-1 hover:bg-slate-100"><Bookmark size={16} className={on?'fill-accent text-accent':''}/></button>
        </div></div></div></article>}
