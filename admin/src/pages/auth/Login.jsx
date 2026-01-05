import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authApi from '../../api/authApi';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // CHECK LOGIN KHI MOUNT
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        const role = parseInt(user.role_id);

        // Điều hướng thông minh nếu đã login
        if (role === 2176) {
          // Khách hàng -> ko vào đc admin -> ở lại login (hoặc báo lỗi, nhưng ở đây cứ để login)
          return;
        }

        if (role === 3 || role === 5) navigate('/orders');
        else if (role === 4) navigate('/marketing');
        else navigate('/dashboard');

      } catch (e) {
        // Lỗi parse json -> coi như chưa login
        localStorage.clear();
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authApi.login({ username, password });
      const responseData = res.data || res;
      const { access_token, user } = responseData;

      if (access_token && user) {
        const role = parseInt(user.role_id);
        if (role === 2176) {
          setError("Tài khoản Khách hàng không có quyền truy cập trang Quản trị!");
          localStorage.clear();
          setLoading(false);
          return;
        }

        // 2. Lưu thông tin đăng nhập
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('role_id', user.role_id);

        const permissions = user.permissions || [];
        localStorage.setItem('permissions', JSON.stringify(permissions));

        alert(`Xin chào, ${user.full_name || 'Admin'}!`);

        // 3. 🔥 ĐIỀU HƯỚNG THÔNG MINH (Smart Redirect)
        // Vì Role 3, 4, 5 bị ẩn Dashboard nên phải lái sang trang khác
        if (role === 3 || role === 5) {
          navigate('/orders');    // Kho & CSKH -> Vào thẳng Đơn hàng
        } else if (role === 4) {
          navigate('/marketing'); // Marketing -> Vào thẳng trang Marketing
        } else {
          navigate('/dashboard'); // Admin & Quản lý -> Vào Tổng quan
        }

      } else {
        throw new Error('Cấu trúc phản hồi không hợp lệ.');
      }

    } catch (err) {
      console.error("Login Error:", err);
      localStorage.clear();
      const message = err.response?.data?.detail || 'Đăng nhập thất bại. Kiểm tra lại thông tin.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box animate-pop-in">
        <div className="login-header">
          <h2>STYLEX ADMIN</h2>
          <p>Hệ thống quản trị tập trung</p>
        </div>

        <form onSubmit={handleLogin}>
          {error && <div className="error-message" style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '14px' }}>{error}</div>}

          <div className="form-group">
            <label>Tài khoản / Email</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin@stylex.com"
              required autoFocus
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Đang xác thực...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;