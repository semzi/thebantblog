
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './user/components/layout.tsx';
import HomePage from './user/pages/homepage.tsx';
import BlogReadPage from './user/pages/blog.tsx';
import Dashboard from './admin/dashboard.tsx';
import BlogPostList from './admin/blogpost.tsx';
import SignIn from './admin/sign.tsx';
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="blog" element={<BlogReadPage />} />
          <Route path="admin" element={<Dashboard />} />
          <Route path="signin" element={<SignIn />} />
          <Route path="admin/blogpost" element={  <BlogPostList /> } />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

