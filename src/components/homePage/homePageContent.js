'use client'
import style from '../../../public/styles/pages.module.css'
import HomeCreatePost from '@/components/homePage/homePageCreatePost'
import UsersPosts from '@/components/homePage/homePagePosts'
import { useState } from 'react'

const Content = () => {
    const [updatePost, setUpdatePost] = useState(false)

    return (
        <div className={style.container}>
            <div className={style.content}>
                <div className={style.spacer}>{'-'}</div>
                <HomeCreatePost setUpdatePostProps={setUpdatePost} />
                <UsersPosts onUpdatePost={updatePost} setUpdatePostProps={setUpdatePost} />
                <div className={style.spacer}>{'-'}</div>
            </div>
        </div>
    )
}

export default Content
