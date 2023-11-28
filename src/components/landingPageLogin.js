'use client'
import { useState } from 'react'
import style from '../../public/styles/landingPage.module.css'
import Image from 'next/image'
import bcrypt from 'bcryptjs'
import { getUsers } from '@/utils/apiData'

const landingPageLogin = () => {
    const [show, setShow] = useState(false)

    async function login() {
        const username = document.getElementById('username').value
        const password = document.getElementById('password').value

        try {
            const data = await getUsers()

            // Find the user with the given username
            const user = data.find((user) => user.username === username)

            if (user) {
                // Compare the hashed password with the input password
                bcrypt.compare(password, user.password, function (err, result) {
                    if (result) {
                        // Passwords match, user is authenticated
                        console.log('User found:', user)
                        localStorage.setItem('_id', user._id)
                        localStorage.setItem('username', user.username)
                        localStorage.setItem('name', `${user.firstname} ${user.lastname}`)
                        localStorage.setItem('isLogedin', 'true')
                        setShow(false)
                        window.location.href = '/'
                    } else {
                        // Passwords don't match
                        console.log('Incorrect password')
                        setShow(true)
                    }
                })
            } else {
                // No user found with the provided username
                console.log('No user found with the provided username')
                setShow(true)
            }
        } catch (error) {
            console.error('Error:', error)
            // Handle error, e.g., show an error message to the user
        }
    }

    return (
        <div className={style.container}>
            <div className={style.logo}>
                <Image src="/images/logo.png" height={300} width={300} />
                <p>Explore and connect with the diverse stories of people from around the world, all in one place.</p>
            </div>
            <div className={style.signup}>
                <section>
                    <h2>Log In</h2>
                </section>
                <section className={style.input}>
                    <div>
                        <label>Username :</label>
                        <input type="text" name="username" id="username" placeholder="Input Username"></input>
                    </div>
                    <div>
                        <label>Password :</label>
                        <input type="password" name="password" id="password" placeholder="Input password"></input>
                    </div>
                    <div>
                        <span style={{ display: show ? 'block' : 'none', color: 'rgb(180, 21, 21)' }}>
                            <h5>Incorrect username or password</h5>
                        </span>
                    </div>
                </section>
                <section>
                    <div className={style.btn}>
                        <button onClick={login}>Log In</button>
                    </div>
                    <div>
                        <a href="/signup">Don't have an account ?</a>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default landingPageLogin
