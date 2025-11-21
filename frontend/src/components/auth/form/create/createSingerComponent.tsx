//Функциональный компонент
import {
  FC,
  useState
} from 'react';
import Select, { components } from 'react-select';
import CountryFlag from 'react-country-flag';
//React-Cookie
import Cookies from 'js-cookie';
//Работа с запросами
import axios from 'axios';
//React-hook-form
import {
  useForm,
  SubmitHandler,
  FieldError
} from 'react-hook-form';
//React-icons
import { FaUserAlt } from 'react-icons/fa';
import { RiCalendar2Fill } from 'react-icons/ri';
import { IoIosArrowForward } from 'react-icons/io';
//React-component
import { InputComponent } from '../../../ui/inputComponent/inputComponent.tsx';
import { ButtonComponent } from '../../../ui/buttonComponent/buttonComponent.tsx';
//Валидация
import {
  dateLiveRangeValidation,
  nameValidation
} from '../../../../utils/createSingerUtils.ts';
//Массив со странами
import { countries } from '../../../../utils/countryArray.ts';

//Интерфейс для SubmitHandler
interface IFormsDataSinger {
    name: string;
    dateLive: string;
    country: string;
    photo: FileList;
}

export const CreateSingerComponent: FC = () => {

  //Анимация загрузки
  const [loading, setLoading] = useState(false);
  //Работа с фото
  const [photo, setPhoto] = useState<File | null>(null);
  //Работа с валидацией
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    trigger
  } = useForm<IFormsDataSinger>();
  //Динамический выбор элементов из массива
  const selectedCountry = watch('country');

  //Кнопка для создания певца
  const onSubmit: SubmitHandler<IFormsDataSinger> = async (data: IFormsDataSinger) => {
  setLoading(true);
    try {
      const token = Cookies.get('token');
      if (!token) return;
      if (!token) return;
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('dateLive', data.dateLive);
      formData.append('country', data.country);
      if (photo) formData.append('photo', photo);
      await axios.post('http://localhost:5000/singer/create-singer', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
        },
      });
      setLoading(false);
      location.reload();
    }
    catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error) && error.response) {
          alert(`${error.response.data.message || 'Произошла ошибка'}`);
      }
    }
  };

  //Компонент для отображения флагов
  const Option = (props: any) => (
  <components.Option {...props}>
    <CountryFlag countryCode={props.data.code} svg style={{ width: '20px', marginRight: '10px' }} />
    {props.data.label}
  </components.Option>
  );

  return (
    <form className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col gap-5'>
        {/* Поле для имени */}
        <div>
          <InputComponent
            id='name'
            icon={<FaUserAlt />}
            placeholder='Введите имя певца...'
            {...register('name', nameValidation())}
          />
          {errors.name && (
            <span className='text-sm text-errorText'>
              {(errors.name as FieldError).message}
            </span>
          )}
          </div>
          {/* Поле для даты жизни */}
          <div>
          <InputComponent
            id='dateLive'
            icon={<RiCalendar2Fill />}
            placeholder='Годы жизни'
            type='text'
            {...register('dateLive', dateLiveRangeValidation())}
          />
          {errors.dateLive && (
            <span className='text-sm text-errorText'>
              {(errors.dateLive as FieldError).message}
            </span>
          )}
          </div>
          {/* Поле для выбора страны */}
          <Select
            options={countries}
            {...register('country', { required: 'Требуется указать страну' })}
            placeholder='Выберите страну...'
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.label}
            onChange={(option) => {
              setValue('country', option ? option.label : '');
              trigger('country');
            }}
            value={countries.find(c => c.label === selectedCountry) || null}
            components={{ Option }}
          />
          {errors.country && (
            <span className='text-sm text-errorText'>
              {(errors.country as FieldError).message}
            </span>
          )}
          {/* Поле для фото */}
          <div className='flex flex-col space-y-2'>
            <input
              type='file'
              accept='image/*'
              {...register('photo', { required: 'Требуется загрузить фотографию' })}
              onChange={(e) => setPhoto(e.target.files
                ? e.target.files[0]
                : null)}
              className={`block w-full text-sm text-dullGray border border-[#DCDCDC] rounded-[5px] cursor-pointer focus:outline-none focus:ring-1 focus:ring-royalBlue focus:border-transparent file:mr-4 file:py-2 file:px-4 file:bg-royalBlue file:border-0 file:text-blockWhite 
              ${photo 
                ? 'ring-1 ring-royalBlue border-transparent' 
                : ''}`}
            />
            {errors.photo && (
              <span className='text-sm text-errorText'>
                {(errors.photo as FieldError).message}
              </span>
            )}
          </div>
          {/* Кнопка для отправки формы */}
          <ButtonComponent
            className='border-royalBlue mb-[10px] mt-[10px]'
            icon={<IoIosArrowForward />}
            loading={loading}
          >
            {loading ? 'Добавление...' : 'Добавить певца'}
          </ButtonComponent>
        </div>
    </form>
  );
};