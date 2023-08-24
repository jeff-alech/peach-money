import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

import './style.css';

import api from '../../api/api';
import Modal from '../../components/Modal';
import ModalEdit from '../../components/ModalEdit';
import ModalProfile from '../../components/ModalProfile'
import Filter from '../../components/Filter';
import SkeletonChildren from '../../components/Skeleton';

import logo from '../../assets/Logo.png';
import logo2 from '../../assets/favicon.png';
import profile from '../../assets/profile.png';
import logOutIcon from '../../assets/logOut.png';
import filter from '../../assets/filter.png';
import polygon from '../../assets/polygon.png';
import edit from '../../assets/edit.png';
import trash from '../../assets/trash.png';

export default function Main() {
  const [modal, setModal] = useState(null);
  const [modalEdit, setModalEdit] = useState(null)
  const [modalProfile, setModalProfile] = useState(null)
  const [modalDelete, setModalDelete] = useState(null)

  const [categoryList, setCategoryList] = useState([])
  const [infos, setInfos] = useState([]);

  const [summaryEntry, setSummaryEntry] = useState(0);
  const [summaryOut, setSummaryOut] = useState(0);
  const [summaryTotal, setSummaryTotal] = useState(0);

  const [idEdit, setIdEdit] = useState('')
  const [name, setName] = useState('')

  const [btnFilter, setBtnFilter] = useState(false)
  const [load, setLoad] = useState(true)

  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    handleListInfo();
  }, []);

  const handleListInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const response = await api.get('/transacao');
      setInfos(response.data);

      let fullEntry = 0;
      let totalOutflow = 0;

      response.data.forEach((transacao) => {
        const dateString = transacao.data;
        const date = new Date(dateString);
        date.setDate(date.getDate() + 1);
        const formattedDate = format(date, 'dd/MM/yy');
        transacao.formattedDate = formattedDate;
        const formattedDayOfWeek = format(date, 'EEEE', { locale: pt });
        transacao.formattedDayOfWeek = formattedDayOfWeek.split('-')[0];
        if (transacao.tipo === 'saida') {
          totalOutflow += transacao.valor;
        } else if (transacao.tipo === 'entrada') {
          fullEntry += transacao.valor;
        }
      });

      setSummaryEntry((fullEntry / 100).toFixed(2).replace('.', ','));
      setSummaryOut((totalOutflow / 100).toFixed(2).replace('.', ','));
      setSummaryTotal(((fullEntry - totalOutflow) / 100).toFixed(2).replace('.', ','));
    } catch (error) {
      console.error(error);
    }
  };

  function LogOut() {
    localStorage.removeItem('token');
  }

  async function userName() {
    try {
      const token = localStorage.getItem('token');
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const response = await api.get('/usuario');
      setName(response.data.nome)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    userName()
  }, [])

  async function handleCategory() {
    try {
      const token = localStorage.getItem('token');
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const response = await api.get('/categoria');
      setCategoryList(response.data)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    handleCategory()
  }, [])

  async function deleteTransation(id) {
    try {
      const token = localStorage.getItem('token');
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await api.delete(`/transacao/${id}`);
      handleListInfo();
    } catch (error) {
      console.error(error);
    }
  }

  function sortData() {
    const sortedDates = [...infos].sort((a, b) => {
      const dateA = Number(a.formattedDate.replaceAll('/', ''));
      const dateB = Number(b.formattedDate.replaceAll('/', ''));
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });

    setInfos(sortedDates);
  }

  useEffect(() => {
    sortData();
  }, [sortDirection]);
  function handleLoading() {
    setTimeout(() => {
      setLoad(false)
    }, 4000)
  }
  useEffect(() => {
    handleLoading()
  }, [])

  return (
    <>
      {load ? <SkeletonChildren /> :
        <div className='container'>
          <header className='header'>
            <img className='logo-header' src={logo} alt='logo' />
            <img className='logo-header2' src={logo2} alt='logo' />
            <div className='div-profile'>
              <img onClick={() => setModalProfile(true)} className='profile-header' src={profile} alt='profile' />
              <span className='span-header'>{name}</span>
              <Link to={'/'}>
                <img
                  className='log-out-header'
                  src={logOutIcon}
                  alt='log out'
                  onClick={LogOut}
                />
              </Link>
            </div>
          </header>
          <main className='main'>
            <div className='container-information'>
              <div className='left-side-main'>
                <div className='box-button'>
                  <button onClick={() => setBtnFilter(!btnFilter)} className='btn-filter'>
                    <img className='filter-icon' src={filter} alt='Filter Icon' />
                    Filtrar
                  </button>
                </div>
                {btnFilter && <Filter className="filter-box" categoryList={categoryList} infos={infos} setInfos={setInfos} handleListInfo={handleListInfo} btnFilter={btnFilter} setBtnFilter={setBtnFilter} />}
                <div className='information-box'>
                  <div className='box'>
                    <ul className='table'>
                      <li className='date'>
                        Data<img onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')} src={polygon} alt='Polygon' />
                      </li>
                      <li className='weekday'>Dia da semana</li>
                      <li className='description'>Descrição</li>
                      <li className='category'>Categoria</li>
                      <li className='value'>Valor</li>
                    </ul>
                    {infos.map((item, index) => (
                      <ul key={index} className={(index +1) % 2 === 0 ?'table-list table-list-line' : 'table-list' }>
                        <li className='date'>{item.formattedDate}</li>
                        <li className='weekday'>{item.formattedDayOfWeek}</li>
                        <li className='description'>{item.descricao}</li>
                        <li className='category'>{item.categoria_nome}</li>
                        <li className={item.tipo === 'entrada' ? 'value enter' : 'value out'}>{`R$: ${(
                          item.valor / 100
                        ).toFixed(2).replace('.', ',')} `}</li>
                        <div className='trashAndEdit'>
                          <li className='edit-pen'>
                            <img onClick={() => { setModalEdit(true); setIdEdit(item.id); }} src={edit} alt='Edit Icon' />
                          </li>
                          <li className='trash-can'>
                            <img onClick={() => setModalDelete(index)} src={trash} alt='Delete Icon' />
                            {modalDelete === index && (
                              <div className='modal-delete'>
                                <h3 className='h3-delete'>Apagar item?</h3>
                                <div className='btn-delete'>
                                  <button className='yes-delete' onClick={() => { deleteTransation(item.id), setModalDelete(null) }}>Sim</button>
                                  <button className='no-delete' onClick={() => setModalDelete(null)}>Não</button>
                                </div>
                              </div>
                            )}
                          </li>
                        </div>
                      </ul>
                    ))}
                  </div>
                </div>
              </div>
              <div className='right-side-main'>
                <div className='resume'>
                  <div className='resume-content'>
                    <h1 className='title-resume'>Resumo</h1>
                    <div className='enter-out-value'>
                      <div className='enter-value'>
                        <span className='span'>Entradas</span>
                        <span className='span-enter'>{`R$: ${summaryEntry}`}</span>
                      </div>
                      <div className='out-value'>
                        <span className='span'>Saídas</span>
                        <span className='span-out'>{`R$: ${summaryOut}`}</span>
                      </div>
                    </div>
                    <div className='total'>
                      <span className='total-text'>Saldo</span>
                      <span className='total-value'>{`R$: ${summaryTotal}`}</span>
                    </div>
                  </div>
                  <button onClick={() => setModal(true)} className='add-register'>
                    Adicionar Registro
                  </button>
                </div>
              </div>

            </div>
          </main>
          {modal && <Modal setModal={setModal} handleListInfo={handleListInfo} categoryList={categoryList} />}
          {modalEdit && <ModalEdit setModalEdit={setModalEdit} idEdit={idEdit} handleListInfo={handleListInfo} categoryList={categoryList} />}
          {modalProfile && <ModalProfile setModalProfile={setModalProfile} userName={userName} />}
        </div>
      }
    </>
  );
}
