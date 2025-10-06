
import Highlight from '../components/highlight.tsx'
import BlogList from '../components/bloglist.tsx'

const homepage = () => {
  return (
    <div className='gap-y-7 flex flex-col'>
        <Highlight />
        <BlogList />
    </div>
  )
}

export default homepage