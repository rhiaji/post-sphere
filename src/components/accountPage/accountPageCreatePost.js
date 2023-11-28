import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createPost } from '../../utils/apiData'
import style from '../../../public/styles/accountPageCreatePost.module.css'

const accountPageCreatePost = ({ setUpdatePostProps }) => {
    const [show, setShow] = useState(false)
    const [show1, setShow1] = useState(false)
    const [postContent, setPostContent] = useState('')
    const [username, setUsername] = useState('')
    const [name, setname] = useState('')
    const currentDate = new Date()
    const unixTimestamp = Math.floor(currentDate.getTime() / 1000)
    const searchParams = useSearchParams()
    const search = searchParams.get('user')

    useEffect(() => {
        const isLogedin = localStorage.getItem('isLogedin')
        const user = localStorage.getItem('username')
        const name = localStorage.getItem('name')

        if (isLogedin === 'true' && user === search) {
            setShow1(true)
        } else {
            setShow1(false)
        }

        setUsername(user)
        setname(name)
    }, [search])

    const handleInputChange = (event) => {
        setPostContent(event.target.value)
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
            <div className={style.post} style={{ display: show1 ? 'block' : 'none' }}>
                <section>
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
                    <textarea placeholder="Share your thoughts here." value={postContent} onChange={handleInputChange} />
                </section>
                <section className={style.createbtn}>
                    <button onClick={handleCreatePost}>Post Story</button>
                </section>
            </div>
        </>
    )
}

export default accountPageCreatePost
