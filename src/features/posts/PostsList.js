// 展示所有post表单
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import { Spinner } from '../../components/Spinner'
import { PostAuthor } from './PostAuthor'
import { TimeAgo } from './TimeAgo'
import { ReactionButtons } from './ReactionButtons'

import { fetchPosts, selectAllPosts } from './postsSlice'

const PostExcerpt = ({ post }) => {
  return (
    <article className="post-excerpt" key={post.id}>
      <h3>{post.title}</h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>

      <ReactionButtons post={post} />
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
    </article>
  )
}

export const PostsList = () =>{
  const dispatch = useDispatch();
  // useSelector 传入的是一个selector函数，该函数以state为参数返回state的一部分
  const posts = useSelector(selectAllPosts)

  const postStatus = useSelector(state => state.posts.status)
  const error = useSelector(state => state.posts.error)

  useEffect(() => {
    if (postStatus === 'idle')
      dispatch(fetchPosts())
  },[postStatus,dispatch])

  let content 
  // 根据请求的不同状态渲染不同的内容
  if (postStatus === 'loading'){
    content = <Spinner text="Loading..." />
  }else if (postStatus === 'succeeded'){
    // 根据日期时间字符串，对帖子安装时间倒序进行排序
    // posts.slice()创建了一个数组副本
    const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))
    content = orderedPosts.map(post => (
      <PostExcerpt key={post.id} post={post}></PostExcerpt>
    ))
  }else if(postStatus === 'failed'){
    content = <div>{error}</div>
  }
  
  return (
      <section className='posts-list'>
          <h2>Posts</h2>
          {content}
      </section>
  )

}