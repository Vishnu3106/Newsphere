import type { User } from '../types'
// Mock auth. Replace with Amazon Cognito, keeping this interface.
export interface AuthService{current():User|null;login(e:string,p:string):Promise<User>;register(n:string,e:string,p:string):Promise<User>;logout():void}
const K='ns_user'
const set=(u:User)=>(localStorage.setItem(K,JSON.stringify(u)),u)
export const authService:AuthService={
  current(){try{return JSON.parse(localStorage.getItem(K)||'')}catch{return null}},
  async login(e){return set({name:e.split('@')[0]||'Reader',email:e})},
  async register(n,e){return set({name:n,email:e})},
  logout(){localStorage.removeItem(K)}}
