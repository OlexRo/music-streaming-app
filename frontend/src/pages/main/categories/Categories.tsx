//Функциональный компонент
import {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
//Навигация по сайту
import { useNavigate } from 'react-router-dom';
//React-component
import { CategoryComponent } from '../../../components/object/categoryComponent.tsx';
import { CardFromComponent } from '../../../components/containers/cardFromComponent/CardFromComponent.tsx';
import { useShowCategory } from '../../../utils/axios/useShowCategory.tsx';
import { LoadingComponent } from '../../../components/ui/loadingComponent.tsx';

export const Categories: FC = () => {

  //Состояние для отслеживания загрузки
  const [loading, setLoading] = useState(true);
  //Вывод данных категории
  const { categories } = useShowCategory();
  //Работа с навигацией
  const navigate = useNavigate();

  //Эффект для управления состоянием загрузки
  useEffect(() => {
    if (categories.length > 0) {
      setLoading(false); // Установите loading в false, когда данные загружены
    }
  }, [categories]);

  //Обработка клика по категории
  const handleCategoryClick = useCallback((categoryId: number) => {
    navigate(`/categoryPage/${categoryId}`);
  }, [navigate]);

  //Меморизация категорий
  const memoizedCategories = useMemo(() => (
    categories.map(category => (
      <CategoryComponent
        id={category.id}
        key={category.id}
        title={category?.title}
        photo={category?.photo
          ? `http://localhost:5000/uploads/categoryPhoto/${category?.photo}`
          : 'path_to_default_image'}
        onClick={() => handleCategoryClick(category.id)}
        className='mb-5'
      />
    ))
  ), [categories, handleCategoryClick]);

  return (
    <main className='custom-scrollbar overflow-y-auto'>
      {loading ? (
        <LoadingComponent/>
      ) : (
        <CardFromComponent title='ВСЕ КАТЕГОРИИ'>
          <div className='w-full flex flex-wrap justify-between gap-0 sm:gap-5'>
            {memoizedCategories}
          </div>
        </CardFromComponent>
      )}
    </main>
  );
};