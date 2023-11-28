'use client'
import style from '../../../public/styles/pages.module.css'
import AccountPagePosts from '@/components/accountPage/accountPagePosts'
import AccountPageCreatePost from '@/components/accountPage/accountPageCreatePost'
import AccountPageProfile from '@/components/accountPage/accounPageProfile'
import { useState } from 'react'

const AccountContent = () => {
    const [updatePost, setUpdatePost] = useState(false)
    return (
        <div className={style.container}>
            <div className={style.content}>
                <div className={style.spacer}>{'-'}</div>
                <AccountPageProfile />
                <AccountPageCreatePost setUpdatePostProps={setUpdatePost} />
                <AccountPagePosts onUpdatePost={updatePost} setUpdatePostProps={setUpdatePost} />
                <div className={style.spacer}>{'-'}</div>
            </div>
        </div>
    )
}

export default AccountContent
