import type { Article, Story } from '../types'
export const sources=['Reuters','BBC','The Hindu','TechCrunch']
export const categories=['Technology','AI','World','Business','Science','Sports','Entertainment','India']
export const topics=['Artificial Intelligence','Space','Technology','Cricket','Business','World','Science','Entertainment','India']
const labels=['Initial announcement','Additional details released','Industry reaction reported','Government response']
const defs:[string,string,string,string,string[],string[]][]=[
['Major breakthrough announced in artificial intelligence','A new AI system has set record benchmark results, with details and reactions emerging through the day.','AI','San Francisco',['Artificial Intelligence','Technology'],['New AI system announced','New AI system achieves record performance','Researchers hail AI benchmark leap','Regulators review new AI model']],
['NASA announces successful satellite mission','A new Earth-observation satellite reached orbit and began collecting data.','Science','Florida, USA',['Space','Science'],['NASA successfully launches new satellite','New NASA satellite reaches orbit','NASA mission marks successful satellite deployment','New satellite begins collecting data']],
['India clinch thrilling series decider','A last-over finish settled the series as analysts weigh the turning points.','Sports','Mumbai',['Cricket','India'],['India win series decider by 4 runs','Last-over drama seals series','Captain praises bowlers after win','Fans celebrate across the country']],
['Global markets react to central bank signal','Equities moved after policy hints, with economists split on next steps.','Business','London',['Business','World'],['Markets rise on rate hints','Central bank signals pause','Economists debate policy path','Rupee firms against dollar']],
['Open-source chip design gains industry backing','Several firms joined an effort to build open hardware designs.','Technology','Bengaluru',['Technology','Artificial Intelligence'],['Open chip alliance launched','Firms back open hardware push','Startups welcome open chip designs','Government eyes domestic chips']],
['Climate summit agrees on emissions framework','Delegates reached a framework deal after extended talks.','World','Geneva',['World','Science'],['Summit reaches emissions deal','Delegates agree framework','Activists react to climate pact','India outlines climate commitments']],
['Streaming platform unveils new film slate','A major platform detailed its upcoming original films.','Entertainment','Los Angeles',['Entertainment'],['Platform reveals film slate','New originals announced','Directors react to slate','Regional films get larger share']],
['Space agency tests reusable lander','A reusable lander completed a key test flight.','Science','Sriharikota',['Space','Technology'],['Reusable lander test succeeds','Test flight meets targets','Engineers explain lander design','Funding boost expected after test']]]
const now=Date.now()
export const stories:Story[]=defs.map(([title,summary,category,location,tags,heads],i)=>{
  const articles:Article[]=heads.map((h,j)=>({articleId:`a${i}-${j}`,title:h,description:`${summary} Reported by ${sources[j]}.`,source:sources[j],category,
    publishedAt:new Date(now-(i*7+(3-j)*2.5)*36e5).toISOString(),image:`https://picsum.photos/seed/ns${i}${j}/640/400`,location,storyId:`s${i}`,tags}))
  return{storyId:`s${i}`,title,summary,category,location,sources,articles,
    timeline:articles.map((a,j)=>({time:a.publishedAt,label:labels[j],articleId:a.articleId})),
    updates:[{field:'Headline',prev:heads[0],next:heads[1]},{field:'Status',prev:'Initial announcement',next:'Officially confirmed'},{field:'Details',prev:'',next:'New figures and reactions added'}]}})
export const articles:Article[]=stories.flatMap(s=>s.articles)
