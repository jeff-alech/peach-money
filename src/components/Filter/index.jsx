import './style.css';

import iconFilter from '../../assets/iconFilter.png';
import iconFilter2 from '../../assets/iconFilter2.png';

import { useState } from 'react';

export default function Filter({ categoryList, infos, setInfos, handleListInfo, btnFilter, setBtnFilter }) {
    const [activeButtons, setActiveButtons] = useState([]);
    let [searchCategory, setSearchCategory] = useState([])

    const handleButtonClick = (categoryId) => {
        if (activeButtons.includes(categoryId)) {
            setActiveButtons(activeButtons.filter((id) => id !== categoryId));
        } else {
            setActiveButtons([...activeButtons, categoryId]);
        }
    };
    const handleClearFilters = () => {
        setActiveButtons([]);
    };

    const handleSaveFilter = () => {
        if (activeButtons.length === 0) {
            handleListInfo();
        }

        const searchCategory = infos.filter((item) => activeButtons.includes(item.categoria_id));
        setSearchCategory(searchCategory);
        setInfos(searchCategory);
    };

    return (
        <div className='main-cointainer'>
            <div className="container-filter">
                <h1 className="title-filter">Categoria</h1>
                <div className="btn-options-box">
                    {categoryList.map((item, index) => (
                        <ul className="ul-btn-filter" key={index}>
                            <li>
                                <button
                                    onClick={() => handleButtonClick(item.id)}
                                    className={`btn-filter-area ${activeButtons.includes(item.id) ? 'actived-btn' : ''
                                        }`}
                                >
                                    {item.descricao}
                                    <img
                                        className="img-btn"
                                        src={activeButtons.includes(item.id) ? iconFilter2 : iconFilter}
                                        alt="Plus Icon"
                                    />
                                </button>
                            </li>
                        </ul>
                    ))}
                    <div className='btn-clean-save'>
                        <button onClick={() => { handleClearFilters(); window.innerWidth < 925 ? setBtnFilter(!btnFilter) : null; }} className='clean'>Limpar Filtros</button>
                        <button onClick={() => {handleSaveFilter(); window.innerWidth < 925 ? setBtnFilter(!btnFilter) : null;}} className='save'>Aplicar Filtros</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
