// 展示所有post表单
import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { PostAuthor } from './PostAuthor'
import { ReactionButtons } from './ReactionButtons'

import { selectAllPosts } from './postsSlice'

export const PostsList = () =>{
    // useSelector 传入的是一个selector函数，该函数以state为参数返回state的一部分
    const posts = useSelector(selectAllPosts)

    // 根据日期时间字符串，对帖子安装时间倒序进行排序
    // posts.slice()创建了一个数组副本
    const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))
    
    // 利用一个map函数构造出一个posts列表
    const renderedPosts = orderedPosts.map(post => (
        <article className="post-excerpt" key={post.id}>
          <h3>{post.title}</h3>
          <PostAuthor userId={post.user} />
          <p className="post-content">{post.content.substring(0, 100)}</p>
          <ReactionButtons post={post} />
          <Link to={`/posts/${post.id}`} className="button muted-button">
            View Post
          </Link>  
        </article>
    ))

    return (
        <section className='posts-list'>
            <h2>Posts</h2>
            {renderedPosts}
        </section>
    )

}