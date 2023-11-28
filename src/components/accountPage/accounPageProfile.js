import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { getAccount, updateAccount } from '@/utils/apiData'
import style from '../../../public/styles/accountPageProfile.module.css'

const accountPageProfile = () => {
    const [image, setImage] = useState('')
    const [image2, setImage2] = useState('')
    const [show, setShow] = useState(false)
    const [show1, setShow1] = useState(false)
    const [successProfileUpload, setSuccessProfileUpload] = useState(false)
    const [successCoverUpload, setSuccessCoverUpload] = useState(false)
    const [showProfileUpload, setShowProfileUpload] = useState(false)
    const [showCoverUpload, setShowCoverUpload] = useState(false)
    const [userData, setUserData] = useState([])
    const searchParams = useSearchParams()
    const search = searchParams.get('user')

    function profConvertToBase64(e) {
        var reader = new FileReader()
        reader.readAsDataURL(e.target.files[0])
        reader.onload = () => {
            setImage(reader.result)
            setShowProfileUpload(true)
        }
        reader.onerror = (error) => {
            console.log('error', error)
        }
    }

    function coverConvertToBase64(e) {
        var reader = new FileReader()
        reader.readAsDataURL(e.target.files[0])
        reader.onload = () => {
            setImage2(reader.result)
            setShowCoverUpload(true)
        }

        reader,
            (onerror = (error) => {
                console.log('error', error)
            })
    }

    const fetchUserData = async () => {
        try {
            const data = await getAccount(search)

            if (data && data.length > 0) {
                setUserData(data)
                setImage(data[0].images.profile)
                setImage2(data[0].images.cover)
            }
        } catch (error) {
            console.error('Error fetching user data:', error)
        }
    }

    useEffect(() => {
        const isLogedin = localStorage.getItem('isLogedin')

        if (isLogedin === 'true') {
            setShow(true)
        } else {
            setShow(false)
        }

        fetchUserData()
    }, [search])

    const uploadprofile = async () => {
        const jsonData = {
            content: 'profile photo',
            image: image,
            userId: userData[0]._id,
        }

        try {
            await updateAccount(jsonData)
            setSuccessProfileUpload(true)
        } catch (error) {
            console.error('Error fetching user data:', error)
        }
    }

    const uploadcover = async () => {
        const jsonData = {
            content: 'cover photo',
            image: image2,
            userId: userData[0]._id,
        }

        try {
            await updateAccount(jsonData)
            setSuccessCoverUpload(true)
        } catch (error) {
            console.error('Error fetching user data:', error)
        }
    }

    return (
        <>
            {userData &&
                userData.map((user) => (
                    <div className={style.page} key={user._id}>
                        <div>
                            <img width={600} height={200} src={user.images.cover} />
                        </div>
                        <section>
                            <img width={100} height={100} src={user.images.profile} />
                            <span>
                                <h1>{`${user.firstname} ${user.lastname}`}</h1>
                                <p>UserID: {user.username}</p>
                            </span>
                            <button
                                style={{ display: show ? 'block' : 'none' }}
                                onClick={() => {
                                    setShow1(true)
                                }}
                            >
                                Edit Profile
                            </button>
                        </section>
                        <section></section>
                        <section></section>
                    </div>
                ))}
            <div className={style.profile} style={{ display: show1 ? 'block' : 'none' }}>
                <section>
                    <div className={style.editx}>
                        <button
                            onClick={() => {
                                setShow1(false)
                            }}
                        >
                            X
                        </button>
                    </div>
                    <div className={style.upload}>
                        <p>Profile Picture</p>
                        <input accept="image/*" type="file" onChange={profConvertToBase64}></input>
                    </div>
                    <div className={style.uploadOutput}>
                        <img width={100} height={100} src={image} />
                        <button onClick={uploadprofile} style={{ display: showProfileUpload ? 'block' : 'none' }}>
                            Upload Photo
                        </button>
                        {successProfileUpload && <p>Successfully Updated</p>}
                    </div>
                </section>
                <section>
                    <div className={style.upload}>
                        <p>Cover Photo</p>
                        <input accept="image/*" type="file" onChange={coverConvertToBase64}></input>
                    </div>
                    <div className={style.uploadOutput}>
                        <img width={500} height={200} src={image2} />
                        <button onClick={uploadcover} style={{ display: showCoverUpload ? 'block' : 'none' }}>
                            Upload Photo
                        </button>
                        {successCoverUpload && <p>Successfully Updated</p>}
                    </div>
                </section>
                <section>
                    <div className={style.upload}>
                        <p>Biography</p>
                        <button>Update</button>
                    </div>
                    <div className={style.uploadOutput}>
                        <div>
                            <label>About me</label>
                            <input type="text" placeholder="Make an introduction"></input>
                        </div>
                        <div>
                            <label>Work</label>
                            <input type="text" placeholder="Where do you work?"></input>
                        </div>
                        <div>
                            <label>Education</label>
                            <input type="text" placeholder="School you graduated or in right now?"></input>
                        </div>
                        <div>
                            <label>City</label>
                            <input type="text" placeholder="City where you currenty live"></input>
                        </div>
                        <div>
                            <label>Relationship</label>
                            <input type="text" placeholder="Single? Married? or Complicated?"></input>
                        </div>
                    </div>
                </section>
                <section>
                    <div className={style.upload}>
                        <p>Hobbies</p>
                        <button>Add</button>
                    </div>
                    <div className={style.uploadOutput}>
                        <div>
                            <label>Add a hobby</label>
                            <input type="text" placeholder="Add a hobby here...."></input>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}

export default accountPageProfile
