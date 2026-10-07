import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, TrendingUp } from 'lucide-react'
import NewsCard from '../components/NewsCard'
import { storyService } from '../services/storyService'
import { newsService } from '../services/newsService'
import { categories } from '../data/data'
import { ago } from '../utils/format'
export default function Home(){
  const nav=useNavigate();const [q,setQ]=useState('');const stories=storyService.list()
  const go=(e:FormEvent)=>{e.preventDefault();nav(`/search?q=${encodeURIComponent(q)}`)}
  return <div>
    <section className="border-b border-slate-200 bg-slate-50"><div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl">Understand the story, not just the headline.</h1>
      <p className="mt-4 text-slate-600">NewsSphere combines reports from multiple sources into evolving stories, with a timeline of what changed and when.</p>
      <form onSubmit={go} className="relative mt-8"><Search className="absolute left-4 top-3.5 text-slate-400" size={18}/><input aria-label="Search" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search news, topics, events..." className="input py-3 pl-11 text-base shadow-sm"/></form></div></section>
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-10">
      <section><h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-accent"><TrendingUp size={16}/>Trending now</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">{stories.slice(0,4).map(s=>
          <Link key={s.storyId} to={`/story/${s.storyId}`} className="relative h-56 w-80 shrink-0 overflow-hidden rounded-xl">
            <img src={s.articles[0].image} alt="" className="h-full w-full object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 to-transparent"/>
            <div className="absolute bottom-0 p-4 text-white"><div className="text-xs opacity-80">{s.category} · {s.articles.length} sources</div><div className="font-serif text-lg font-semibold leading-snug">{s.title}</div></div></Link>)}</div></section>
      <section><h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">Top stories</h2>
        <div className="mb-6 flex flex-wrap gap-2">{categories.map(c=><Link key={c} to={`/explore?cat=${c}`} className="rounded-full border border-slate-200 px-3 py-1 text-sm hover:border-accent hover:text-accent">{c}</Link>)}</div>
        <div className="grid gap-5 md:grid-cols-2">{stories.slice(0,4).map(s=>
          <Link key={s.storyId} to={`/story/${s.storyId}`} className="rounded-xl border border-slate-200 p-5 transition hover:shadow-md">
            <div className="text-xs text-slate-500">{s.category} · Updated {ago(s.articles[3].publishedAt)}</div><h3 className="mt-1 font-serif text-xl font-semibold">{s.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{s.summary}</p><div className="mt-3 text-xs font-medium text-accent">{s.sources.join(' • ')}</div></Link>)}</div></section>
      <section><h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">Latest stories</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{newsService.search().slice(0,9).map(a=><NewsCard key={a.articleId} a={a}/>)}</div></section></div></div>}
