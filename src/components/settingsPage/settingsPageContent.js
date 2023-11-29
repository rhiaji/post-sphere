'use client'
import { useEffect, useState } from 'react'
import style from '../../../public/styles/pages.module.css'
import { deleteAccount, getAccount } from '@/utils/apiData'

const SettingsContent = () => {
    // Check if localStorage is defined (client-side) before using it
    const username = typeof window !== 'undefined' ? localStorage.getItem('username') : null
    const [userId, setUserId] = useState('')

    useEffect(() => {
        fetchUser()
    }, [])

    const fetchUser = async () => {
        try {
            // Make the API call to fetch user data
            const userData = await getAccount(username)

            // Assuming getAccount returns an array of user data, update the state
            setUserId(userData[0]._id)
        } catch (error) {
            console.error('Error:', error)
            // Handle error, e.g., show an error message to the user
        }
    }

    const deleteUser = async () => {
        const deleteData = {
            action: 'Delete User Data',
            data: {
                userId: userId,
                username: username,
            },
        }
        try {
            await deleteAccount(deleteData)
            localStorage.clear()
            location.href = '/login'
        } catch (error) {
            console.error('Error:', error)
            // Handle error, e.g., show an error message to the user
        }
    }

    return (
        <div className={style.container}>
            <div className={style.content}>
                <div className={style.spacer}>{'-'}</div>
                <button onClick={deleteUser}>delete</button>
                <div className={style.spacer}>{'-'}</div>
            </div>
        </div>
    )
}

export default SettingsContent
