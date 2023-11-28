import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import style from '../../../public/styles/accountPagePosts.module.css'
import { getUserPost, createComment, updateUserPost, deleteUserPost, deleteUserComment, updateUserComment } from '@/utils/apiData'

const accountPagePosts = ({ onUpdatePost, setUpdatePostProps }) => {
    const [editedCommentId, setEditedCommentId] = useState(null)
    const [editComment, setEditComment] = useState('')
    const [editedPostId, setEditedPostId] = useState(null) // Track the edited post ID
    const [username, setUsername] = useState('')
    const [name, setname] = useState('')
    const [userPosts, setUserPosts] = useState([])
    const [postChange, setPostChange] = useState('')
    const [postComment, setPostComment] = useState('')
    const currentDate = new Date()
    const unixTimestamp = Math.floor(currentDate.getTime() / 1000)
    const searchParams = useSearchParams()
    const search = searchParams.get('user')

    // Helper function to format time difference
    const formatTimeDifference = (timestamp) => {
        const currentTimestamp = Math.floor(new Date().getTime() / 1000)
        const secondsDifference = currentTimestamp - timestamp

        const minutes = Math.floor(secondsDifference / 60)
        if (minutes < 1) {
            return 'Just now'
        } else if (minutes === 1) {
            return '1 minute ago'
        } else if (minutes < 60) {
            return `${minutes} minutes ago`
        } else {
            const hours = Math.floor(minutes / 60)
            if (hours === 1) {
                return '1 hour ago'
            } else if (hours < 24) {
                return `${hours} hours ago`
            } else {
                const days = Math.floor(hours / 24)
                if (days === 1) {
                    return '1 day ago'
                } else {
                    return `${days} days ago`
                }
            }
        }
    }

    const fetchUserPosts = async () => {
        try {
            const data = await getUserPost(search)
            setUserPosts(data)

            console.log('UserPosts:', data)
        } catch (error) {
            console.error('Error fetching user posts:', error)
        }
    }

    useEffect(() => {
        const user = localStorage.getItem('username')
        const name = localStorage.getItem('name')

        setUsername(user)
        setname(name)
        fetchUserPosts()

        setUpdatePostProps(false)
    }, [search, onUpdatePost])

    const handleCommentChange = (event) => {
        setPostComment(event.target.value)
    }

    const handlePostChange = (event) => {
        setPostChange(event.target.value)
    }

    // Handle change in the edited comment input
    const handleCommentEdit = (event) => {
        setEditComment(event.target.value)
    }

    // Create a new comment
    const handleCreateComment = async (id) => {
        var hash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

        const commentData = {
            action: 'Create Comment',
            data: {
                author: {
                    name: name,
                    username: username,
                },
                commentId: hash,
                postId: id,
                timestamp: unixTimestamp,
                content: postComment,
            },
        }

        if (postComment) {
            try {
                await createComment(commentData)

                setTimeout(() => {
                    fetchUserPosts()
                }, 2000)
            } catch (error) {
                alert(error)
                console.error('Error:', error)
            }
        } else {
            alert('Complete the data')
        }
    }

    const updatePost = async (id) => {
        const updateData = {
            postId: id,
            content: postChange,
        }

        if (username != search) {
            return
        } else {
            try {
                await updateUserPost(updateData)

                setTimeout(() => {
                    fetchUserPosts()
                }, 3000)

                setEditedPostId(null)
            } catch (error) {
                console.error('Error:', error)
                // Handle error, e.g., show an error message to the user
            }
            // Send the data to your API endpoint
        }
    }

    const deletePost = async (id) => {
        const deleteData = {
            postId: id,
        }

        if (username != search) {
            return
        } else {
            try {
                await deleteUserPost(deleteData)

                setTimeout(() => {
                    fetchUserPosts()
                }, 2000)
            } catch (error) {
                console.error('Error:', error)
                // Handle error, e.g., show an error message to the user
            }
            // Send the data to your API endpoint
        }
    }

    const changePost = async (postId) => {
        setEditedPostId(postId)
    }

    // Set the edited comment ID
    const changeComment = (commentIndex) => {
        setEditedCommentId(commentIndex)
    }

    // Update an existing comment
    const updateComment = async (comment) => {
        const UpdateData = {
            action: 'Update Comment',
            data: {
                author: {
                    name: comment.author,
                    name,
                    username: comment.author.username,
                },
                commentId: comment.commentId,
                postId: comment.postId,
                timestamp: comment.timestamp,
                content: editComment,
            },
        }

        try {
            await updateUserComment(UpdateData)
            setEditedCommentId(null)
            setTimeout(() => {
                fetchUserPosts()
            }, 2000)
        } catch (error) {
            alert(error)
            console.error('Error:', error)
        }
    }

    // Delete a comment
    const deleteComment = async (comment) => {
        const deleteData = {
            action: 'Delete Comment',
            data: comment,
        }

        try {
            await deleteUserComment(deleteData)
            setTimeout(() => {
                fetchUserPosts()
            }, 2000)
        } catch (error) {
            alert(error)
            console.error('Error:', error)
        }
    }

    return (
        <>
            {userPosts &&
                userPosts.map((post) => (
                    <div className={style.allposts} key={post._id}>
                        <section>
                            <div className={style.name}>
                                <p>{post.author.name}</p>
                                <h5 className={style.time}>{formatTimeDifference(post.timestamp)}</h5>
                            </div>
                            {username === search && (
                                <div>
                                    {editedPostId === post._id && (
                                        <>
                                            <button onClick={() => updatePost(post._id)}>UPDATE POST</button>
                                            <button onClick={() => setEditedPostId(null)}>CANCEL</button>
                                        </>
                                    )}
                                    {editedPostId !== post._id && (
                                        <>
                                            <button onClick={() => changePost(post._id)}>EDIT</button>
                                            <button onClick={() => deletePost(post._id)}>DELETE</button>
                                        </>
                                    )}
                                </div>
                            )}
                        </section>
                        <section style={{ whiteSpace: 'pre-line' }}>
                            {editedPostId === post._id && (
                                <>
                                    <textarea className={style.editPost} onChange={handlePostChange} onClick={() => setPostChange(post.content)}>
                                        {post.content}
                                    </textarea>
                                </>
                            )}
                            {editedPostId !== post._id && (
                                <>
                                    <p>{post.content}</p>
                                </>
                            )}
                        </section>
                        <section>
                            <div>Thumbs Up!</div>
                            <div>Thumbs Down!</div>
                        </section>
                        <section>
                            <div className={style.commentArea}>
                                <textarea placeholder="Write a comment..." onChange={handleCommentChange}></textarea>
                                <button
                                    onClick={() => {
                                        handleCreateComment(`${post._id}`)
                                    }}
                                >
                                    submit
                                </button>
                            </div>
                            {/* Map over comments */}
                            {post.comments &&
                                post.comments
                                    .sort((a, b) => b.timestamp - a.timestamp) // Sort comments in descending order
                                    .map((comment) => (
                                        <div className={style.comments} key={comment.commentId}>
                                            <div>
                                                <p className={style.name}>{comment.author.name}</p>
                                                <h6 className={style.time}>*{formatTimeDifference(comment.timestamp)}</h6>
                                            </div>
                                            {editedCommentId !== comment.commentId && username === comment.author.username ? (
                                                <span>{comment.content}</span>
                                            ) : (
                                                <span>
                                                    <textarea onChange={handleCommentEdit} onClick={() => setEditComment(comment.content)}>
                                                        {comment.content}
                                                    </textarea>
                                                </span>
                                            )}
                                            <div>
                                                {editedCommentId === comment.commentId && username === comment.author.username ? (
                                                    <>
                                                        <button onClick={() => updateComment(comment)}>Update</button>
                                                        <button
                                                            onClick={() => {
                                                                setEditedCommentId(null)
                                                                setEditComment(comment.content)
                                                            }}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button onClick={() => changeComment(comment.commentId)}>Edit</button>
                                                        <button onClick={() => deleteComment(comment)}>Delete</button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                        </section>
                    </div>
                ))}
        </>
    )
}

export default accountPagePosts
