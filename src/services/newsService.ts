import { articles } from '../data/data'
export interface Query{q?:string;category?:string;source?:string;days?:number}
// Later: GET {API_BASE}/articles (API Gateway -> Lambda -> DynamoDB)
export const newsService={
  search(f:Query={}){const q=f.q?.toLowerCase().trim()
    return articles.filter(a=>(!q||(a.title+a.description+a.tags.join()).toLowerCase().includes(q))
      &&(!f.category||f.category==='All'||a.category===f.category)&&(!f.source||a.source===f.source)
      &&(!f.days||Date.now()-+new Date(a.publishedAt)<f.days*864e5))
      .sort((a,b)=>+new Date(b.publishedAt)-+new Date(a.publishedAt))}}
