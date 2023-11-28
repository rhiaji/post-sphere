import React, { useEffect, useState } from 'react'
import style from '../../../public/styles/homePagePosts.module.css'
import { getPosts, createComment, getUsers, deleteUserComment, updateUserComment } from '@/utils/apiData'

const UsersPosts = ({ onUpdatePost, setUpdatePostProps }) => {
    // State variables
    const [editedCommentId, setEditedCommentId] = useState(null)
    const [postComment, setPostComment] = useState('')
    const [editComment, setEditComment] = useState('')
    const [users, setUsers] = useState([])
    const [posts, setPosts] = useState([])
    const [username, setUsername] = useState('')
    const [name, setname] = useState('')
    const currentDate = new Date()
    const unixTimestamp = Math.floor(currentDate.getTime() / 1000)

    // Fetch posts data from the API
    const fetchPostsData = async () => {
        try {
            const data = await getPosts()
            setPosts(data)
        } catch (error) {
            console.error('Error:', error)
        }
    }

    // Fetch users data from the API
    const fetchUsersData = async () => {
        try {
            const data = await getUsers()
            setUsers(data)
        } catch (error) {
            console.error('Error:', error)
        }
    }

    // ComponentDidMount: Fetch initial data
    useEffect(() => {
        const user = localStorage.getItem('username')
        const name = localStorage.getItem('name')

        setUsername(user)
        setname(name)
        fetchPostsData()
        fetchUsersData()
        setUpdatePostProps(false)
    }, [onUpdatePost])

    // Handle change in the comment input
    const handleCommentChange = (event) => {
        setPostComment(event.target.value)
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
                    fetchPostsData()
                }, 2000)
            } catch (error) {
                alert(error)
                console.error('Error:', error)
            }
        } else {
            alert('Complete the data')
        }
    }

    // Format time difference for display
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

    // Set the edited comment ID
    const change = (commentIndex) => {
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
                fetchPostsData()
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
                fetchPostsData()
            }, 2000)
        } catch (error) {
            alert(error)
            console.error('Error:', error)
        }
    }

    // Render the component
    return (
        <>
            {posts &&
                posts.map((results) => {
                    // Find the user whose ID matches the author's ID in the post
                    const authorUser = users.find((user) => user.username === results.author.username)

                    return (
                        <div className={style.allposts} key={results._id}>
                            <section>
                                <div className={style.name}>
                                    {/* Check if authorUser exists before accessing its properties */}
                                    {authorUser && <img src={authorUser.images.profile} height={50} width={50} alt="Profile" />}
                                    <div>
                                        <p>{results.author.name}</p>
                                        <h5 className={style.time}>{formatTimeDifference(results.timestamp)}</h5>
                                    </div>
                                </div>
                                <div></div>
                            </section>
                            <section style={{ whiteSpace: 'pre-line' }}>{results.content}</section>
                            <section>
                                <div>Thumbs Up!</div>
                                <div>Thumbs Down</div>
                            </section>
                            <section>
                                <div className={style.commentArea}>
                                    <textarea placeholder="Write a comment..." onChange={handleCommentChange}></textarea>
                                    <button
                                        onClick={() => {
                                            handleCreateComment(`${results._id}`)
                                        }}
                                    >
                                        Submit
                                    </button>
                                </div>{' '}
                                {/* Map over comments */}
                                {results.comments &&
                                    results.comments
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
                                                            <button onClick={() => change(comment.commentId)}>Edit</button>
                                                            <button onClick={() => deleteComment(comment)}>Delete</button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                            </section>
                        </div>
                    )
                })}
        </>
    )
}

export default UsersPosts
