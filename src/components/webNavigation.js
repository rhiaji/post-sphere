'use client'
import { useEffect, useState } from 'react'
import style from '../../public/styles/navigation.module.css'

const NavigationContent = () => {
    const [show, setShow] = useState(false)
    const [user, setUser] = useState('')
    useEffect(() => {
        const isLogedin = localStorage.getItem('isLogedin')
        const username = localStorage.getItem('username')

        if (isLogedin === 'true') {
            setShow(false)
        } else {
            setShow(true)
        }

        setUser(username)
    }, [])

    function login() {
        window.location.href = '/login'
    }

    function signout() {
        localStorage.clear()
        window.location.href = '/login'
    }
    return (
        <div className={style.container}>
            <section className={style.section}>
                <div className={style.logo}>
                    <span>Post Sphere</span>
                </div>
                <nav>
                    <ul>
                        <li>
                            <a href="/">Home</a>
                        </li>
                        <li>
                            <a href={`/account?user=${user}`}>Account</a>
                        </li>
                        <li>
                            <a href="/settings">Settings</a>
                        </li>
                    </ul>
                </nav>
                <div>
                    <button onClick={login} style={{ display: show ? 'block' : 'none' }}>
                        Login
                    </button>
                    <button onClick={signout} style={{ display: show ? 'none' : 'block' }}>
                        Sign out
                    </button>
                </div>
            </section>
        </div>
    )
}

export default NavigationContent
