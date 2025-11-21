//Функциональный компонент
import { forwardRef } from 'react';
//Интерфейс
import { IInputComponent } from './inputComponent.interface.ts';

export const InputComponent = forwardRef<HTMLInputElement, IInputComponent>(
	({ className, className2, onChange, icon, icon2, placeholder, type, id, ...rest }, ref) => {
		return (
			<div className={className}>
				<div className='flex pb-[4px] items-center justify-between border-b-[1px] border-[#DCDCDC]'>
					<div className='w-full flex items-center gap-2'>
						{icon}
						<label className='w-full'>
							<input
								id={id}
								type={type}
								placeholder={placeholder}
								onChange={onChange}
								className={`w-full text-dullGray focus:outline-none ${className2}`}
								ref={ref}
								{...rest}
							/>
						</label>
					</div>
					{icon2}
				</div>
			</div>
		);
	}
)
