import { stories } from '../data/data'
import type { Article, Story } from '../types'
// Later: Lambda + DynamoDB story table
export const storyService={list:():Story[]=>stories,get:(id?:string)=>stories.find(s=>s.storyId===id)}
/** MOCK heuristic (tag overlap) - NOT AI. Future: preprocess -> embeddings -> similarity -> existing/new story. */
export const storyGroupingService={
  assign(a:Article,existing:Story[]):{storyId:string|null;score:number}{
    let best={storyId:null as string|null,score:0}
    for(const s of existing){const o=a.tags.filter(t=>s.articles[0].tags.includes(t)).length/Math.max(a.tags.length,1);if(o>best.score)best={storyId:s.storyId,score:o}}
    return best.score>=0.6?best:{storyId:null,score:best.score}}}
