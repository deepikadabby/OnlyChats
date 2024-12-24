import { Inputt } from "../../components/Inputt"
import Buttown from "../../components/Buttown"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
const Form = ({
    isSignin = true,
}) => {
    const [data, setdata] = useState({
        ...(!isSignin && {
            name: ""
        }),
        email: '',
        password: ''
    })

    const AajoVyi = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8000/api/${isSignin ? 'login' : 'register'}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const resdata = await response.json();
                if (resdata.token) {
                    localStorage.setItem('user:token', resdata.token);
                    localStorage.setItem('user:detail', JSON.stringify(resdata.user));
                    navi('/');
                }
            } else {
                alert(`${isSignin ? 'Invalid Credintials':'Email Already exists'}`);
            }
        } catch (error) {
            console.error('Error occurred:', error);
            alert('Something went wrong. Please try again.');
        }
    };


    const navi = useNavigate();
    return (
        <div className=" h-screen flex items-center justify-center">
            <div className="bg-[#dda15e] w-[600px] h-[600px] shadow-lg rounded-lg flex flex-col justify-center items-center">
                <div className="text-4xl font-extrabold">Welcome {isSignin && "Back"}</div>
                <div className="text-xl font-light mb-10">{isSignin ? "Sign in and start Chatting" : "Sign Up to Get Started"}</div>
                <form className="flex flex-col items-center w-full" onSubmit={(e) => AajoVyi(e)}>
                    {!isSignin && <Inputt label="name" name="name" placeholder="Deepika" className="mb-6" value={data.name} onChange={(e) => setdata({ ...data, name: e.target.value })} />}
                    <Inputt label="Email Address" type="email" name="email" placeholder="deepikadabby@gmail.com" className="mb-6" value={data.email} onChange={(e) => setdata({ ...data, email: e.target.value })} />
                    <Inputt label="Password" type="password" name="pass" placeholder="Siuuuuuuu" className="mb-6" value={data.password} onChange={(e) => setdata({ ...data, password: e.target.value })} />
                    <Buttown label={isSignin ? "Sign in" : "Sign Up"} type="submit" className="mb-3" />
                </form>
                <div>{isSignin ? "Didn't Have an Account?" : "Already Have an Account?"}&nbsp;<span className="text-[#0000EE] cursor-pointer underline" onClick={() => navi(`/user/${isSignin ? 'sign_up' : 'sign_in'}`)}>{isSignin ? "Sign Up" : "Sign in"}</span></div>

            </div>
        </div>
    )
}

export default Form