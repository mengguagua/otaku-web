import React, { useState, useEffect, useRef } from 'react';
import { Input } from 'antd';

const Captcha = ({ onSuccess, width = 120, height = 40 }) => {
  const canvasRef = useRef(null);
  const [captchaCode, setCaptchaCode] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  // 生成随机验证码
  const generateCode = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setUserInput('');
    setIsVerified(false);
  };

  // 绘制验证码
  const drawCaptcha = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);
    
    // 背景
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, width, height);
    
    // 干扰线
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.lineTo(Math.random() * width, Math.random() * height);
      ctx.stroke();
    }
    
    // 噪点
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, ${Math.random()})`;
      ctx.fillRect(Math.random() * width, Math.random() * height, 2, 2);
    }
    
    // 验证码文字
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#333';
    const textWidth = ctx.measureText(captchaCode).width;
    const startX = (width - textWidth) / 2;
    ctx.fillText(captchaCode, startX, 28);
  };

  useEffect(() => {
    generateCode();
  }, []);

  useEffect(() => {
    if (captchaCode) {
      drawCaptcha();
    }
  }, [captchaCode]);

  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    setUserInput(value);
    
    // 当输入长度达到4位时自动验证
    if (value.length === 4) {
      if (value === captchaCode.toUpperCase()) {
        setIsVerified(true);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        // 验证失败，刷新验证码
        setTimeout(() => {
          generateCode();
        }, 500);
      }
    }
  };

  const handleVerify = () => {
    if (userInput.toUpperCase() === captchaCode.toUpperCase()) {
      setIsVerified(true);
      if (onSuccess) {
        onSuccess();
      }
    } else {
      generateCode();
    }
  };

  const handleClick = () => {
    generateCode();
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onClick={handleClick}
        style={{ cursor: 'pointer', borderRadius: '4px' }}
        title="点击刷新验证码"
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <Input
          value={userInput}
          onChange={handleInputChange}
          onPressEnter={handleVerify}
          placeholder="输入验证码"
          maxLength={4}
          style={{ width: 100 }}
          disabled={isVerified}
        />
        {isVerified && (
          <span style={{ color: 'green', fontSize: '12px' }}>✓ 验证成功</span>
        )}
      </div>
    </div>
  );
};

export default Captcha;
