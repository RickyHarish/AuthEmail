import { useState, useEffect,Fragment } from 'react'
import styles from './styles.module.css'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'

const EmailVerify=()=>{
    const [validUrl, setValidUrl] = useState(false)
    const param = useParams()
    useEffect(()=>{
        const verifyEmailUrl = async()=>{
            try {
                console.log("Params:", param);
                const url = `http://localhost:5000/api/users/${param.id}/verify/${param.token}`
                const {data} = await axios.get(url)
                console.log(data)
                setValidUrl(true)
            } catch (error) {
                console.log(error)
                setValidUrl(false)
            }
        }

        verifyEmailUrl()
    }, [param])
    return(
        <Fragment>
            {validUrl?(
                <div className={styles.container}>
                    <img src='https://freerangestock.com/sample/50976/tick-success-shows-progress-checkmark-and-correct.jpg' alt='success' className={styles.success_img} />
                    <h1>Email verified successfully</h1>
                    <Link to='/login'>
                    <button className={styles.green_btn}>Login</button>
                    </Link>
                </div>
            ):(
                <h1>404 Not Found</h1>
            )}
        </Fragment>
    )
}

export default EmailVerify