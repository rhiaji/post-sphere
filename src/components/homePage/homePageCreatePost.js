import React, { useEffect, useState } from 'react'
import { createPost } from '@/utils/apiData'
import style from '../../../public/styles/homePageCreatePost.module.css'

const homeCreatePost = ({ setUpdatePostProps }) => {
    const [show, setShow] = useState(false)
    const [show1, setShow1] = useState(false)
    const [postContent, setPostContent] = useState('')
    const [username, setUsername] = useState('')
    const [name, setname] = useState('')
    const currentDate = new Date()
    const unixTimestamp = Math.floor(currentDate.getTime() / 1000)

    useEffect(() => {
        const isLogedin = localStorage.getItem('isLogedin')
        const user = localStorage.getItem('username')
        const name = localStorage.getItem('name')

        if (isLogedin === 'true') {
            setShow1(true)
        } else {
            setShow1(false)
        }

        setUsername(user)
        setname(name)
    }, [])

    const handleInputChange = (event) => {
        setPostContent(event.target.value)
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault() // Prevents the default behavior of Enter key
            // Logic to append text or create a new paragraph
            setPostContent((prevContent) => prevContent + '\n')
        }
    }

    const handleCreatePost = async () => {
        const postData = {
            action: 'Create Post',
            data: {
                author: {
                    name: name,
                    username: username,
                },
                timestamp: unixTimestamp,
                content: postContent,
                comments: [],
            },
        }

        if (postContent) {
            try {
                await createPost(postData)
                setShow(false)
                setTimeout(() => {
                    setUpdatePostProps(true)
                }, 2000)
                // Handle success, e.g., redirect to a new page or show a success message
            } catch (error) {
                console.error('Error:', error)
                // Handle error, e.g., show an error message to the user
            }
            // Send the data to your API endpoint
        } else {
            alert('complete the data')
        }
    }
    return (
        <>
            <div className={style.post}>
                <section style={{ display: show1 ? 'block' : 'none' }}>
                    <button
                        className={style.postbtn}
                        onClick={() => {
                            setShow(true)
                            setPostContent('')
                        }}
                    >
                        What are you thinking about ?
                    </button>
                </section>
                <section style={{ display: show1 ? 'none' : 'block' }}>
                    <button className={style.postbtn}>Log in to share your stories .....</button>
                </section>
            </div>
            <div className={style.postContent} style={{ display: show ? 'block' : 'none' }}>
                <section className={style.head}>
                    <p>Create Post</p>
                    <button onClick={() => setShow(false)}>X</button>
                </section>
                <section className={style.account}>
                    <p>{name}</p>
                </section>
                <section className={style.input}>
                    <textarea placeholder="Share your thoughts here." value={postContent} onChange={handleInputChange} onKeyDown={handleKeyDown} />
                </section>
                <section className={style.createbtn}>
                    <button onClick={handleCreatePost}>Post Story</button>
                </section>
            </div>
        </>
    )
}

export default homeCreatePost
