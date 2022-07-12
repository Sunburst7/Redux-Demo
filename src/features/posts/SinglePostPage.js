// 每个post单独的页面显示
import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { PostAuthor } from './PostAuthor'
import { ReactionButtons } from './ReactionButtons'

import { selectPostById } from './postsSlice'

export const SinglePostPage = ({ match }) => {
    const { postId } = match.params

    const post = useSelector(state => selectPostById(state, postId))
    console.log('single post:',post); 
    // 根据能否找到id相同的post渲染不同的页面
    if (!post) {
        return (
          <section>
            <h2>页面未找到！</h2>
          </section>
        )
      }
    
    return (
      <section>
        <article className="post">
          <h2>{post.title}</h2>
          <PostAuthor userId={post.user} />
          <p className="post-content">{post.content}</p>
          <ReactionButtons post={post} />
          <Link to={`/editPost/${post.id}`} className="button">
            Edit Post
          </Link>
        </article>
      </section>
    )
}