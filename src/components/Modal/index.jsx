import { useState } from 'react';
import './style.css';

import close from '../../assets/close.png';
import api from '../../api/api'; 

export default function Modal({ setModal, categoryList, handleListInfo }) {
    const [selectButton, setSelectButton] = useState(false);
    const [valor, setValor] = useState('');
    const [categoria, setCategoria] = useState('');
    const [data, setData] = useState('');
    const [descricao, setDescricao] = useState('');
    const [alert, setAlert] = useState('')

    const handleAddTransation = async (event) => {
        event.preventDefault();

        if(!valor){
            setAlert("O valor é obrigatório!")
            return
        }else{
            setAlert('')
        }
        if(!categoria){
            setAlert("Escolha uma categoria!")
            return
        }else{
            setAlert('')
        }
        if(!data){
            setAlert("Preencha a data!")
            return
        }else{
            setAlert('')
        }
        if(!descricao){
            setAlert("Preencha a descrição ou coloque -")
            return
        }else{
            setAlert('')
        }

        try {
            const token = localStorage.getItem('token');
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            const requestData = {
                tipo: selectButton ? 'entrada' : 'saida',
                descricao: descricao,
                valor: valor,
                data: data,
                categoria_id: categoria,
                categoria_nome: 'Roupas'
            };

            const response = await api.post('/transacao', requestData);
        } catch (error) {
            console.error(error);
        }
        handleListInfo()
        setModal(false)
    };
  
    return (
        <>
            <div className='container-modal-add'>
                <div className='modal-content-add'>
                    <div className='title-close-add'>
                        <img src={close} alt='Close Icon' onClick={() => setModal(false)} />
                    </div>
                        <h1 className='title-close-add-h1'>Adicionar Registro</h1>
                    <div className='btn'>
                        <button onClick={() => setSelectButton(true)} className={selectButton ? 'btn-enter btn-blue' : 'btn-enter'}>
                            Entrada
                        </button>
                        <button onClick={() => setSelectButton(false)} className={!selectButton ? 'btn-out btn-red' : 'btn-out'}>
                            Saída
                        </button>
                    </div>
                    <div className='inputs-modal-add'>
                        <form className='modal-form-add' onSubmit={handleAddTransation}>
                            <div className='input-value'>
                                <span>Valor</span>
                                <input type='number' name='valor' value={valor} onChange={(event) => setValor(event.target.value)} />
                            </div>
                            <div className='input-category'>
                                <span>Categoria</span>
                                <select name='categoria' value={categoria} onChange={(event) => setCategoria(event.target.value)}>
                                    <option value={null}>Selecione uma opção...</option>
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
                                {!alert ? '' : <p className='alert'>{alert}</p>}
                            </div>
                            <div className='btn-form-add'>
                                <button type='submit'>Confirmar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}



