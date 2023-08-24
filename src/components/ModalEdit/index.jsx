import { useState, useEffect } from 'react';
import './style.css';
import close from '../../assets/close.png';
import api from '../../api/api';

export default function Modal({ setModalEdit, categoryList, idEdit, handleListInfo }) {
  const [selectButton, setSelectButton] = useState(false);
  const [valor, setValor] = useState('');
  const [categoria, setCategoria] = useState('');
  const [data, setData] = useState('');
  const [descricao, setDescricao] = useState(''); 

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const token = localStorage.getItem('token');
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        const response = await api.get(`/transacao/${idEdit}`);
        const transactionData = response.data;

        setSelectButton(transactionData.tipo === 'entrada');
        setValor(transactionData.valor);
        setCategoria(transactionData.categoria_id);
        setData(transactionData.data);
        setDescricao(transactionData.descricao);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTransaction();
  }, [idEdit]); 

  const handleEditTransation = async (event, id) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem('token');
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const requestData = {
        tipo: selectButton ? 'entrada' : 'saida',
        descricao: descricao,
        valor: valor,
        data: data,
        categoria_id: categoria,
      };

      const response = await api.put(`/transacao/${id}`, requestData);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
    handleListInfo() 
    setModalEdit(false)
  };

  return (
    <>
      <div className='container-modal-update'>
        <div className='modal-content-update'>
          <div className='title-close-update'>
            <img src={close} alt='Close Icon' onClick={() => setModalEdit(false)} />
          </div>
            <h1 className='title-close-h1'>Editar Registro</h1>
          <div className='btn'>
            <button onClick={() => setSelectButton(true)} className={selectButton ? 'btn-enter btn-blue' : 'btn-enter'}>
              Entrada
            </button>
            <button onClick={() => setSelectButton(false)} className={!selectButton ? 'btn-out btn-red' : 'btn-out'}>
              Saída
            </button>
          </div>
          <div className='inputs-modal-update'>
            <form className='modal-form-update' onSubmit={(event) => handleEditTransation(event, idEdit)}>
              <div className='input-value'>
                <span>Valor</span>
                <input type='number' name='valor' value={valor} onChange={(event) => setValor(event.target.value)} />
              </div>
              <div className='input-category'>
                <span>Categoria</span>
                <select name='categoria' value={categoria} onChange={(event) => setCategoria(event.target.value)}>
                  {categoryList.map((item, index) => {
                    return <option key={index} value={item.id}>{item.descricao}</option>
                  })}
                </select>
              </div>
              <div className='input-date'>
                <span>Data</span>
                <input type='date' name='data' value={data} onChange={(event) => setData(event.target.value)} />
              </div>
              <div className='input-description'>
                <span>Descrição</span>
                <input type='text' name='descricao' value={descricao} onChange={(event) => setDescricao(event.target.value)} />
              </div>
              <div className='btn-form-update'>
                <button type='submit'>Confirmar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
