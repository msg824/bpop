import React, { useState, useEffect } from 'react';
import Signup from './Signup';
import Mypage from './Mypage';
import Home from './Home';
import axios from 'axios';
import './CSS/Base.css';
import NotFound from './NotFound';

import { useCookies } from 'react-cookie';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function Base() {
    // 초기 state
    /**
    const [login, setLogin] = useState(false);
    const [signup, setSignup] = useState(false);
    */
    const [user, setUser] = useState('');               // user 개인
    const [userArray, setUserArray] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cookies, setCookies] = useCookies(['name']);

    // state 변경 함수
    /**
    const setSignupForm = () => setSignup(true);
    const setLoginForm = () => setSignup(false);
    const loginFunc = () => setLogin(true);
    */
    // const logoutFunc = () => setLogin(false);

    useEffect(() => {
        try {
            // 유저 쿠키 확인
            async function fetchCookie() {
                const result = await axios({
                    method: 'post',
                    url: 'http://localhost:5000/verify',
                    headers: {
                        'content-type' : 'text/json',
                        'x-access-token': cookies.user
                    }
                });

                return result.data;
            }
            fetchCookie()
            .then(async (id) => {
                const user_id = id.user_id;
                const result = await axios.get(`http://localhost:5000/users/one?emailId=${user_id}`);
                setUser(result.data);

                // 초기 마운트 끝 부분 로딩완료.
                setLoading(false); 
            });

            async function allUser() {
                const result = await axios.get('http://localhost:5000/users/all');
                const users = result.data;
                setUserArray(users);
            }
            allUser();
            
        } catch (err) {
            console.log('mount', err)
        }

    }, [cookies], [setCookies]);

    return (
        <div className="main-container">
            {
                !loading ?
                <div>
                    <Router>
                        <Switch>
                            <Route exact path="/" render={() => <Home user={user} />} />
                            <Route path="/insert" render={() => <Signup />} />
                            {userArray.map((data, i) => {
                                return <Route key={i}
                                    path={`/${data.nick}`}
                                    render={() => <Mypage user={user} pageUser={data} />} 
                                />
                            })}
                            <Route component={NotFound} />
                        </Switch>
                    </Router>
                </div>
                :
                <div></div>
            }
            
            

            {/* <div className="main-body">
                {
                // 회원가입 페이지 ON OFF
                !signup ?
                <Login signup={setSignupForm} login={loginFunc}/>
                :
                <Signup signup={setLoginForm}/>
                }
            </div> */}
        </div>
    );
}

export default Base;
