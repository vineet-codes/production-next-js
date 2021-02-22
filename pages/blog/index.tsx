import React from 'react'
import { Pane, majorScale } from 'evergreen-ui'
import matter from 'gray-matter'
import path from 'path'
import fs from 'fs'
import orderby from 'lodash.orderby'
import Container from '../../components/container'
import HomeNav from '../../components/homeNav'
import PostPreview from '../../components/postPreview'
import { posts as postsFromCMS } from '../../content'

const Blog = ({ posts }) => {
  return (
    <Pane>
      <header>
        <HomeNav />
      </header>
      <main>
        <Container>
          {posts.map((post) => (
            <Pane key={post.title} marginY={majorScale(5)}>
              <PostPreview post={post} />
            </Pane>
          ))}
        </Container>
      </main>
    </Pane>
  )
}

Blog.defaultProps = {
  posts: [],
}

export default Blog

/**
 * Need to get the posts from the
 * fs and our CMS
 */

export function getStaticProps() {
  // blogs from cms
  const cmsPosts = postsFromCMS.published.map((post) => {
    const { data } = matter(post)
    return data
  })

  // posts from file system
  // 1. get all the filenames in the posts folder
  const postsFolderPath = path.join(process.cwd(), 'posts')
  const fileNames = fs.readdirSync(postsFolderPath)
  // 2. loop over each file ,
  // 3. read its content, and
  // 4. process it with matter
  // return an array of frontmatter data
  const filePosts = fileNames.map((fileName) => {
    const filePath = path.join(postsFolderPath, fileName)
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { data } = matter(fileContent)
    return data
  })

  const posts = [...cmsPosts, ...filePosts]
  return {
    props: {
      posts: posts,
    },
  }
}
