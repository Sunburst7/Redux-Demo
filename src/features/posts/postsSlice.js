// 对posts数据的处理
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../api/client'
// import { sub } from 'date-fns'

// {
//   多个可能的状态枚举值
//   status: 'idle' | 'loading' | 'succeeded' | 'failed',
//   error: string | null
// }

const initialState = {
    posts: [],
    status: 'idle',
    error: null
}

// 启动应用时获取所有Post的thunk函数
export const fetchPosts = createAsyncThunk('posts/fetchPosts',async () => {
  const response = await client.get('/fakeApi/posts')
  return response.data
})
// 保存Post的thunk函数
export const addNewPost = createAsyncThunk(
  'posts/addNewPost',
  // The payload creator receives the partial `{title, content, user}` object
  async initialPost => {
    // We send the initial data to the fake API server
    const response = await client.post('/fakeApi/posts', initialPost)
    // The response includes the complete post object, including unique ID
    return response.data
  }
)

const postsSlice = createSlice({
    name:'posts',
    initialState,
    reducers:{
      // 添加帖子 原有的reducer被删除了
      // 更新帖子
      postUpdated(state, action){
            const { id, title, content } = action.payload
            const existingPost = state.posts.find(post => post.id === id)
            if(existingPost){
                existingPost.title = title
                existingPost.content = content
            }
      },
      // 更新反应
      reactionAdded(state, action){
        const { postId, reaction } = action.payload
        const existingPost = state.posts.find( post => post.id === postId )
        if(existingPost){
          // mutable
          existingPost.reactions[reaction]++
        }
      }
    },
    extraReducers(builder) {
      builder
        .addCase(fetchPosts.pending, (state, action) => {
          state.status = 'loading'
        })
        .addCase(fetchPosts.fulfilled, (state, action) => {
          state.status = 'succeeded'
          // Add any fetched posts to the array
          state.posts = state.posts.concat(action.payload)
        })
        .addCase(fetchPosts.rejected, (state, action) => {
          state.status = 'failed'
          state.error = action.error.message
        })
      builder
        .addCase(addNewPost.fulfilled, (state, action) => {
          // We can directly add the new post object to our posts array
          state.posts.push(action.payload)
        })
    }
})

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer

// 导出的selector逻辑
export const selectAllPosts = state => state.posts.posts

export const selectPostById = (state, postId) =>
  state.posts.posts.find(post => post.id === postId)