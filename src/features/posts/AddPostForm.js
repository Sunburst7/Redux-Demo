// 添加post表单
import React,{useState} from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { addNewPost } from './postsSlice'

export const AddPostForm = () => {
    const [title,setTitle] = useState('')
    const [content,setContent] = useState('')
    const [userId, setUserId] = useState('')
    // 添加post的状态
    const [addRequestStatus, setAddRequestStatus] = useState('idle')

    // 调度action的主方法
    const dispatch = useDispatch();

    const users = useSelector(state => state.users)

    const onTitleChanged = e => setTitle(e.target.value)
    const onContentChanged = e => setContent(e.target.value)
    const onAuthorChanged = e => setUserId(e.target.value)
    
    // 保存按钮的disabled：这三个字段是否都填写了以及
    const canSave = 
      [title, content, userId].every(Boolean) && addRequestStatus === 'idle'
    // button的click函数
    const onSavePostClicked = async () => {
      if (canSave) {
        try {
          setAddRequestStatus('pending')
          await dispatch(addNewPost({ title, content, user: userId })).unwrap()
          setTitle('')
          setContent('')
          setUserId('')
        } catch (err) {
          console.error('Failed to save the post: ', err)
        } finally {
          setAddRequestStatus('idle')
        }
      }
    }
    
    // 用户列表的下拉菜单
    const usersOptions = users.map(user => (
      <option key={user.id} value={user.id}>
        {user.name}
      </option>
    ))

    return (
        <section>
          <h2>添加新帖子</h2>
          <form>
            <label htmlFor="postTitle">帖子标题:</label>
            <input
              type="text"
              id="postTitle"
              name="postTitle"
              value={title}
              onChange={onTitleChanged}
            />
            <label htmlFor="postAuthor">Author:</label>
            <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
              <option value=""></option>
              {usersOptions}
            </select>
            <label htmlFor="postContent">内容：</label>
            <textarea
              id="postContent"
              name="postContent"
              value={content}
              onChange={onContentChanged}
            />
            <button type="button" onClick={onSavePostClicked} disabled={!canSave}>保存帖子</button>
          </form>
        </section>
      )
}