import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Feed from './pages/Feed'
import StoryDetails from './pages/StoryDetails'
import Auth from './pages/Auth'
import Profile from './pages/Profile'
import { Stories, Saved, Following, ForYou } from './pages/Lists'
export default function App(){return <BrowserRouter><Routes><Route element={<Layout/>}>
  <Route index element={<Home/>}/><Route path="explore" element={<Feed/>}/><Route path="search" element={<Feed search/>}/>
  <Route path="stories" element={<Stories/>}/><Route path="story/:id" element={<StoryDetails/>}/><Route path="saved" element={<Saved/>}/>
  <Route path="following" element={<Following/>}/><Route path="for-you" element={<ForYou/>}/><Route path="profile" element={<Profile/>}/>
  <Route path="login" element={<Auth/>}/><Route path="register" element={<Auth register/>}/></Route></Routes></BrowserRouter>}
