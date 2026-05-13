//LoginPage.js
import React from 'react';

const LoginPage = () => {
  const loginUrls = {
    kakao: 'http://everytown-alb-420204792.ap-northeast-2.elb.amazonaws.com/auth/login/kakao',
    google: 'http://everytown-alb-420204792.ap-northeast-2.elb.amazonaws.com/auth/login/google',
    naver: 'http://everytown-alb-420204792.ap-northeast-2.elb.amazonaws.com/auth/login/naver'
  };


  const handleSocialLogin = (platform) => {
    try {
      window.location.href = loginUrls[platform];
    } catch (error) {
      console.error('로그인 실패:', error);
    }
  };

  return (
    <div>
      <button onClick={() => handleSocialLogin('kakao')}>카카오 로그인</button>
      <button onClick={() => handleSocialLogin('google')}>구글 로그인</button>
      <button onClick={() => handleSocialLogin('naver')}>네이버 로그인</button>
    </div>
  );
};

export default LoginPage;