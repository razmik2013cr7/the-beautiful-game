import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import { SkeletonCard } from './components/Skeleton.jsx'
import { AuthProvider } from './auth.jsx'
import { ensureLeagues } from './store.js'

const Home = lazy(() => import('./pages/Home.jsx'))
const Fixtures = lazy(() => import('./pages/Fixtures.jsx'))
const Tables = lazy(() => import('./pages/Tables.jsx'))
const Leagues = lazy(() => import('./pages/Leagues.jsx'))
const Posts = lazy(() => import('./pages/Posts.jsx'))
const PostDetail = lazy(() => import('./pages/PostDetail.jsx'))
const NewPost = lazy(() => import('./pages/NewPost.jsx'))
const Matches = lazy(() => import('./pages/Matches.jsx'))
const MatchDetail = lazy(() => import('./pages/MatchDetail.jsx'))
const NewMatch = lazy(() => import('./pages/NewMatch.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))
const Register = lazy(() => import('./pages/Register.jsx'))
const Terms = lazy(() => import('./pages/Terms.jsx'))
const Privacy = lazy(() => import('./pages/Privacy.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

function PageLoader() {
  return (
    <div className="page">
      <div className="grid">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  )
}

function Bootstrap() {
  useEffect(() => {
    ensureLeagues().catch(() => {})
  }, [])
  return null
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Bootstrap />
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/fixtures" element={<Fixtures />} />
                <Route path="/tables" element={<Tables />} />
                <Route path="/leagues" element={<Leagues />} />
                <Route path="/matches" element={<Matches />} />
                <Route path="/matches/new" element={<NewMatch />} />
                <Route path="/matches/:matchId" element={<MatchDetail />} />
                <Route path="/posts" element={<Posts />} />
                <Route path="/posts/new" element={<NewPost />} />
                <Route path="/posts/:postId" element={<PostDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  )
}
