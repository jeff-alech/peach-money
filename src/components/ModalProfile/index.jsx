import { useState, useEffect } from 'react';
import './style.css';
import close from '../../assets/close.png';
import api from '../../api/api';

export default function Modal({ setModalProfile, userName }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [alertSpan, setAlertSpan] = useState(false)
  useEffect(() => {
    const handleUser = async () => {
      try {
        const token = localStorage.getItem('token');
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        const response = await api.get(`/usuario`);
        const data = response.data;
        setNome(data.nome)
        setEmail(data.email)
      } catch (error) {
        console.error(error);
      }
    };
    handleUser();
  }, []);

  const handleEditUser = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem('token');
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const requestData = {
        nome: nome,
        email: email,
        senha: senha,
      };
      if(senha !== confirmarSenha){
        setAlertSpan(true)
        return
      }else{
        setAlertSpan(false)
      }
      const response = await api.put(`/usuario`, requestData);
    } catch (error) {
      console.log(error);
    }
    userName()
    setModalProfile(false)
  };

  return (
    <>
      <div className='container-modal-edit'>
        <div className='modal-content'>
          <div className='title-close-edit'>
            <img src={close} alt='Close Icon' onClick={() => setModalProfile(false)} />
          </div>
            <h1 className='title-edit'>Editar Perfil</h1>
          <div className='inputs-modal-edit'>
            <form className='modal-form' onSubmit={(event) => handleEditUser(event)}>
              <div className='input-value-edit'>
                <span>nome</span>
                <input type='text' name='nome' value={nome} onChange={(event) => setNome(event.target.value)} />
              </div>
              <div className='input-date-edit'>
                <span>email</span>
                <input type='text' name='email' value={email} onChange={(event) => setEmail(event.target.value)} />
              </div>
              <div className='input-description-edit'>
                <span>senha</span>
                <input type='password' name='senha' value={senha} onChange={(event) => setSenha(event.target.value)} placeholder='••••••••'/>
              </div>
              <div className='input-description-edit'>
                <span>confirmação de senha</span>
                <input type='password' name='confirmarSenha' value={confirmarSenha} onChange={(event) => setConfirmarSenha(event.target.value)} placeholder='••••••••' />
                {!alertSpan ? '' : <p className='alert'>As senhas não são compatíveis</p> }
              </div>
              <div className='btn-form-edit'>
                <button type='submit'>Confirmar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
