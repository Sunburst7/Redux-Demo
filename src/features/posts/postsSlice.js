// 对posts数据的处理
import { createSlice } from '@reduxjs/toolkit'
import { nanoid } from '@reduxjs/toolkit'
import { sub } from 'date-fns'

const initialState = [
    {
      id: '1', 
      title: 'First Post', 
      content:'hello!',
      date: sub(new Date(), { minutes: 10 }).toISOString(),
      reactions: {
        thumbsUp: 0,
        hooray: 0,
        heart: 0,
        rocket: 0,
        eyes: 0
      }
    },
    {
      id: '2', 
      title: 'Sceond Post', 
      content:'more',
      date: sub(new Date(), { minutes: 5 }).toISOString(),
      reactions: {
        thumbsUp: 0,
        hooray: 0,
        heart: 0,
        rocket: 0,
        eyes: 0
      }
    },
]

const postsSlice = createSlice({
    name:'posts',
    initialState,
    reducers:{
      // 添加帖子
      postAdded: {
            reducer(state, action) {
              state.push(action.payload)
            },
            prepare(title, content, userId) {
              return {
                payload: {
                  id: nanoid(),
                  date: new Date().toISOString(),
                  title,
                  content,
                  user: userId,
                  reactions: {
                    thumbsUp: 0,
                    hooray: 0,
                    heart: 0,
                    rocket: 0,
                    eyes: 0
                  }
                }
              }
            }
      },
      // 更新帖子
      postUpdated(state, action){
            const { id, title, content } = action.payload
            const existingPost = state.find(post => post.id === id)
            if(existingPost){
                existingPost.title = title
                existingPost.content = content
            }
      },
      // 更新反应
      reactionAdded(state, action){
        const { postId, reaction } = action.payload
        const existingPost = state.find( post => post.id === postId )
        if(existingPost){
          // mutable
          existingPost.reactions[reaction]++
        }
      }
    }
})

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer

// 导出的selector逻辑
export const selectAllPosts = state => state.posts

export const selectPostById = (state, postId) =>
  state.posts.find(post => post.id === postId)