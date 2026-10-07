import { Link, useParams } from 'react-router-dom'
import { ArrowRight, Plus, RefreshCw } from 'lucide-react'
import { storyService } from '../services/storyService'
import NewsCard from '../components/NewsCard'
import { clock } from '../utils/format'
export default function StoryDetails(){
  const s=storyService.get(useParams().id)
  if(!s)return <div className="py-24 text-center">Story not found. <Link to="/stories" className="text-accent">Browse stories</Link></div>
  const related=storyService.list().filter(x=>x.category===s.category&&x.storyId!==s.storyId).flatMap(x=>x.articles).slice(0,3)
  return <div className="mx-auto max-w-4xl space-y-12 px-4 py-10">
    <header><div className="text-xs font-bold uppercase tracking-wider text-accent">Story · {s.category} · {s.location}</div>
      <h1 className="mt-2 font-serif text-4xl font-bold leading-tight">{s.title}</h1><p className="mt-3 text-lg text-slate-600">{s.summary}</p>
      <div className="mt-4 text-sm font-medium text-slate-700">{s.sources.join(' • ')}</div></header>
    <section><h2 className="mb-5 text-sm font-bold uppercase tracking-wider text-slate-500">Story timeline</h2>
      <ol className="space-y-6 border-l-2 border-slate-200 pl-6">{s.timeline.map(t=>{const a=s.articles.find(x=>x.articleId===t.articleId)!
        return <li key={t.articleId} className="relative"><span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-accent ring-4 ring-white"/>
          <div className="text-sm font-semibold text-accent">{clock(t.time)}</div><div className="font-semibold">{t.label}</div><div className="text-sm text-slate-600">{a.source}: {a.title}</div></li>})}</ol></section>
    <section><h2 className="mb-5 text-sm font-bold uppercase tracking-wider text-slate-500">What changed?</h2>
      <div className="divide-y rounded-xl border border-slate-200">{s.updates.map(u=><div key={u.field} className="p-4 text-sm">
        <div className="mb-2 flex items-center gap-2 font-semibold">{u.prev?<RefreshCw size={14} className="text-amber-600"/>:<Plus size={14} className="text-green-600"/>}{u.field}</div>
        {u.prev?<div className="flex flex-wrap items-center gap-2"><span className="rounded bg-red-50 px-2 py-1 text-red-700 line-through">{u.prev}</span><ArrowRight size={14}/><span className="rounded bg-green-50 px-2 py-1 text-green-800">{u.next}</span></div>
        :<span className="rounded bg-green-50 px-2 py-1 text-green-800">+ {u.next}</span>}</div>)}</div></section>
    <section><h2 className="mb-5 text-sm font-bold uppercase tracking-wider text-slate-500">Report comparison</h2>
      <div className="overflow-x-auto rounded-xl border border-slate-200"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-500"><tr>{['Source','Published','Headline','Key information'].map(h=><th key={h} className="p-3 font-medium">{h}</th>)}</tr></thead>
        <tbody>{s.articles.map(a=><tr key={a.articleId} className="border-t"><td className="p-3 font-semibold">{a.source}</td><td className="p-3 whitespace-nowrap">{clock(a.publishedAt)}</td><td className="p-3">{a.title}</td><td className="p-3 text-slate-600">{a.description}</td></tr>)}</tbody></table></div></section>
    <section><h2 className="mb-5 text-sm font-bold uppercase tracking-wider text-slate-500">Related articles</h2>
      <div className="grid gap-5 sm:grid-cols-3">{related.map(a=><NewsCard key={a.articleId} a={a}/>)}</div></section></div>}
