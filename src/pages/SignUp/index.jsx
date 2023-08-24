import './style.css'
import axios from '../../api/api'
import logo from '../../assets/favicon.png'
import logo2 from '../../assets/Logo.png'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import openEye from '../../assets/openEye.png'
import closeEye from '../../assets/closeEye.png'
import grafico from '../../assets/grafico3.png'

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  })

  const [errorMessage, setErrorMessage] = useState({
    nameError: '',
    emailError: '',
    passwordError: '',
    passwordCheckError: '',
  })

  const { nameError, emailError, passwordError, passwordCheckError } = errorMessage

  function handleInputChange(event) {
    const { name, value } = event.target;
    setForm((old) => ({
      ...old, [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const { nome, email, senha, confirmarSenha } = form;

    setErrorMessage({
      nameError: '',
      emailError: '',
      passwordError: '',
      passwordCheckError: '',
    })

    if (!nome) {
      setErrorMessage((old) => ({
        ...old, nameError: 'Nome obrigatório.'
      }))
    }

    if (!email) {
      setErrorMessage((old) => ({
        ...old, emailError: 'E-mail obrigatório.'
      }))
    }

    if (!senha) {
      setErrorMessage((old) => ({
        ...old, passwordError: 'Senha obrigatória.'
      }))
    }

    if (!confirmarSenha || senha !== confirmarSenha) {
      setErrorMessage((old) => ({
        ...old, passwordCheckError: 'As senhas devem ser iguais.'
      }))
    }

    if (!nome || !email || !senha || !confirmarSenha || senha !== confirmarSenha) {
      return
    }

    setErrorMessage({
      nameError: '',
      emailError: '',
      passwordError: '',
      passwordCheckError: ''
    })

    try {
      const response = await axios.post('/usuario', {
        nome,
        email,
        senha
      })
      console.log(response)
      navigate('/');
    } catch (error) {
      setErrorMessage((old) => ({
        ...old, passwordCheckError: error.response.data.mensagem
      }))
    }
  }

  return (
    <div className='container-signUp'>
      <header className='header-login-signUp'>
        <img className='logo-signUp' src={logo} alt='logo'></img>
        <img className='logo2-signUp' src={logo2} alt='logo2'></img>
        <img className='grafico' src={grafico} alt='grafico animado'></img>
      </header>
      <section className='section-signUp'>
        <form className='signup-form'>
          <div className='input-container-signUp'>
            <div className='div-h2'>
              <h2>Cadastre-se</h2>
            </div>
            <div className='box-inputs-signUp'>
            <input className='input-signUp' type='text' name='nome' placeholder='nome' value={form.nome} onChange={handleInputChange}></input>
            <span className='error-message'>{nameError}</span>

            <input className='input-signUp' type='email' name='email' placeholder='email' value={form.email} onChange={handleInputChange}></input>
            <span className='error-message'>{emailError}</span>

            <div className='div-eye'>
              <input className='input-signUp password-input' placeholder='senha' type={!showPassword ? 'password' : 'text'} name="senha" value={form.senha} onChange={handleInputChange}>
              </input>
              <div className='eye-icon-div'>
                {!showPassword ? <img onClick={() => setShowPassword(!showPassword)} className='eye-image' src={openEye} alt="Eye Icon" />
                  : <img onClick={() => setShowPassword(!showPassword)} className='eye-image' src={closeEye} alt="Eye Icon" />}
              </div>
            </div>
            <span className='error-message'>{passwordError}</span>
            <input className='input-signUp check-password' type={!showPassword ? 'password' : 'text'} name='confirmarSenha' placeholder='confirmação de senha' value={form.confirmarSenha} onChange={handleInputChange}></input>
            <span className='error-message'>{passwordCheckError}</span>
            </div>
            <button type='' onClick={handleSubmit}>Cadastrar</button>
          </div>
          <span className='login-link'>Já possui cadastro? <Link className='link' to={'/'}> Faça login</Link></span>
        </form>
      </section>
    </div>
  )
}
