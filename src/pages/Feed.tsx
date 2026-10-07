import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import NewsCard from '../components/NewsCard'
import { newsService } from '../services/newsService'
import { categories, sources } from '../data/data'
export default function Feed({search=false}:{search?:boolean}){
  const [p]=useSearchParams();const q=p.get('q')||''
  const [cat,setCat]=useState(p.get('cat')||'All');const [src,setSrc]=useState('');const [days,setDays]=useState(0)
  const res=newsService.search({q,category:cat,source:src,days})
  return <div className="mx-auto max-w-6xl px-4 py-8">
    <h1 className="font-serif text-3xl font-bold">{search?<>Search results for: <span className="text-accent">{q||'all news'}</span></>:'Explore'}</h1>
    <p className="mt-1 text-sm text-slate-500">{res.length} results</p>
    <div className="mt-6 grid gap-8 lg:grid-cols-[220px_1fr]">
      <aside className="space-y-5 text-sm">
        {([['Category',['All',...categories],cat,setCat],['Source',['',...sources],src,setSrc]] as const).map(([t,opts,v,set])=>
          <label key={t} className="block"><span className="mb-1 block font-semibold">{t}</span><select className="input" value={v} onChange={e=>set(e.target.value)}>{opts.map(o=><option key={o} value={o}>{o||'All sources'}</option>)}</select></label>)}
        <label className="block"><span className="mb-1 block font-semibold">Date</span><select className="input" value={days} onChange={e=>setDays(+e.target.value)}><option value={0}>Any time</option><option value={1}>Today</option><option value={7}>This week</option><option value={30}>This month</option></select></label></aside>
      {res.length?<div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{res.map(a=><NewsCard key={a.articleId} a={a} q={q}/>)}</div>
      :<div className="py-20 text-center text-slate-500"><SearchX className="mx-auto mb-3" size={32}/>No articles match your filters.</div>}</div></div>}
