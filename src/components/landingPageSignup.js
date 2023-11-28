'use client'
import { useState } from 'react'
import style from '../../public/styles/landingPage.module.css'
import Image from 'next/image'
import bcrypt from 'bcryptjs' // Import bcrypt.js
import { createAccount } from '@/utils/apiData'

const landingPageSignup = () => {
    const [show, setShow] = useState(false)

    async function create() {
        const username = document.getElementById('username').value
        const password = document.getElementById('password').value
        const fname = document.getElementById('fname').value
        const lname = document.getElementById('lname').value
        const email = document.getElementById('email').value
        const birthdate = document.getElementById('birthdate').value

        // Hash the password before sending it to the server
        const hashedPassword = await hashPassword(password)

        const createData = {
            action: 'Create User Account',
            data: {
                username: username,
                password: hashedPassword, // Store the hashed password
                firstname: fname,
                lastname: lname,
                email: email,
                birthdate: birthdate,
                images: [],
                biography: [],
                hobbies: [],
            },
        }

        if (username && password && fname && lname && email && birthdate) {
            try {
                await createAccount(createData)
                setShow(true)
            } catch (error) {
                console.error('Error:', error)
                // Handle error, e.g., show an error message to the user
            }
            // Send the data to your API endpoint
        } else {
            alert('Complete the data')
        }
    }

    // Helper function to hash passwords using bcrypt
    async function hashPassword(password) {
        const saltRounds = 10 // Number of salt rounds
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        return hashedPassword
    }

    return (
        <div className={style.container}>
            <div className={style.logo}>
                <Image src="/images/logo.png" height={300} width={300} />
                <p>Explore and connect with the diverse stories of people from around the world, all in one place.</p>
            </div>
            <div className={style.signup} style={{ display: show ? 'none' : 'flex' }}>
                <section>
                    <h2>Sign up</h2>
                </section>
                <section className={style.input}>
                    <form>
                        <div>
                            <label>Username :</label>
                            <input type="text" name="username" id="username" placeholder="Input Username"></input>
                        </div>
                        <div>
                            <label>Password :</label>
                            <input type="password" name="password" id="password" placeholder="Input Password"></input>
                        </div>
                        <div>
                            <label>Name :</label>
                            <input type="text" name="fname" id="fname" placeholder="First Name"></input>
                        </div>
                        <div>
                            <label>Surname :</label>
                            <input type="text" name="lname" id="lname" placeholder="Last Name"></input>
                        </div>
                        <div>
                            <label>Email :</label>
                            <input type="email" name="email" id="email" placeholder="Input Email"></input>
                        </div>
                        <div>
                            <label>Birthdate :</label>
                            <input type="date" name="birthdate" id="birthdate" placeholder="Input Username"></input>
                        </div>
                    </form>
                </section>
                <section>
                    <div className={style.btn}>
                        <button type="submit" onClick={create}>
                            Create Account
                        </button>
                    </div>
                    <div>
                        <a href="/login">Already have an account ?</a>
                    </div>
                </section>
            </div>
            <div className={style.signup} style={{ display: show ? 'flex' : 'none' }}>
                <h1>Account Successfully Created!</h1>
                <br></br>
                <a href="/login">Login to your account</a>
            </div>
        </div>
    )
}

export default landingPageSignup
