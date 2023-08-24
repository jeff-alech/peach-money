import { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import axios from '../../api/api';
import logo from '../../assets/favicon.png';
import logo2 from '../../assets/Logo.png';
import './style.css';
import openEye from '../../assets/openEye.png'
import closeEye from '../../assets/closeEye.png'
import peach from '../../assets/grafico2.png'


export default function Login() {
 
  const [showPassword, setShowPassword] = useState(false)
 
  const [userInfo, setUserInfo] = useState({
    email: '',
    senha: '',
  })

  const [errorMessage, setErrorMessage] = useState({
    emailError: '',
    passwordError: '',
  })

  const { emailError, passwordError } = errorMessage;

  const navigate = useNavigate();

  function handleInputChange(event) {
    const { name, value } = event.target;
    setUserInfo((old) => ({
      ...old, [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const { email, senha } = userInfo;

    if (!email) {
      setErrorMessage((old) => ({
        ...old, emailError: 'E-mail obrigatório.'
      }))
    }

    if (!senha) {
      setErrorMessage((old) => ({
        ...old, passwordError: 'Senha obrigatória.'
      }))
      return
    }

    setErrorMessage({
      emailError: '',
      passwordError: '',
    })

    try {
      const response = await axios.post('/login', {
        email,
        senha
      })
      localStorage.setItem('token', response.data.token)
      navigate('/main')
    } catch (error) {
      setErrorMessage((old) => ({
        ...old, passwordError: error.response.data.mensagem
      }))
    }
  }

  return (
    <div className='login-container'>
      <div className='section-box'>
        <section className='section-login'>
          <div className="left-side">
            <header className='header-login'>
              <img className='logo' src={logo}></img>
              <img className='logo2' src={logo2}></img>
            </header>
            <div className='app-intro'>
              <h1>Controle suas <strong>finanças</strong>, sem planilha chata! Com a<strong> Peach Money</strong>.</h1>
             
                <img className='p' src={peach} alt='Logo'></img>
        
            </div>
          </div>
          <div className='right-side'>
            <form className='login-form'>
              <div className='div-h2'>
                <h2 className='h2-login'>Acesse sua conta</h2>
              </div>
              <div className='input-container'>
                <input className='input-login' placeholder='email' type="email" name="email" value={userInfo.email} onChange={handleInputChange}></input>
                <span className='error-message-login'>{emailError}</span>

                <div className='div-eye'>
                  <input className='input-login password-input' placeholder='senha' type={!showPassword ? 'password' : 'text'} name="senha" value={userInfo.senha} onChange={handleInputChange}>
                  </input>
                  <div className='eye-icon-div'>
                    {!showPassword ? <img onClick={() => setShowPassword(!showPassword)} className='eye-image' src={openEye} alt="Eye Icon" />
                      : <img onClick={() => setShowPassword(!showPassword)} className='eye-image' src={closeEye} alt="Eye Icon" />}
                  </div>
                </div>
                <span className='error-message-login'>{passwordError}</span>
              </div>
              <button type='' onClick={handleSubmit}>Entrar</button>
              <div className='message-signUp'>
                <span>Não tem cadastro?</span><Link to={'/sign-up'}>Clique aqui!</Link>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  )
}
