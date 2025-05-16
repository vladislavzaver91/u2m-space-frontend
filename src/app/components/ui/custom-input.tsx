// 'use client'

// import { useEffect, useState } from 'react'
// import { UseFormRegisterReturn } from 'react-hook-form'

// interface CustomInputProps {
//   label: string
//   register: UseFormRegisterReturn
//   maxLength: number
//   type?: string
//   error?: string
//   prefix?: string
// }

// export const CustomInput = ({
//   label,
//   register,
//   maxLength,
//   type,
//   error,
//   prefix,
// }: CustomInputProps) => {
//   const [isFocused, setIsFocused] = useState<boolean>(false);
//   const [value, setValue] = useState<string>(''); // Локальное состояние для отслеживания значения

//   const handleFocus = () => setIsFocused(true);
//   const handleBlur = () => setIsFocused(false);

//   // Синхронизируем локальное состояние с значением из формы
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setValue(e.target.value);
//   };

//   const isFilled = !!value;
//   const isMaxLengthReached = value?.length >= maxLength;
//   const showPrefix = prefix && (isFocused  isFilled);

//   return (
//     <div className='relative w-full h-[86px]'>
//       <label
//         htmlFor={`${label.toLowerCase()}-input`}
//         className={`absolute left-0 transition-all duration-300 ease-in-out ${
//           isFocused  isFilled
//             ? 'top-0 text-[13px] font-normal text-[#4f4f4f]'
//             : 'top-[22px] text-[16px] font-bold text-[#4f4f4f]'
//         }`}
//       >
//         {label}
//       </label>
//       <div className='relative'>
//         {showPrefix && (
//           <span
//             className={`absolute left-0 top-[28px] text-[16px] font-bold text-[#4f4f4f] ${
//               error ? 'text-red-500' : ''
//             }`}
//           >
//             {prefix}
//           </span>
//         )}
//         <input
//           id={`${label.toLowerCase()}-input`}
//           type={type}
//           {...register}
//           onFocus={handleFocus}
//           onBlur={handleBlur}
//           onChange={(e) => {
//             register.onChange(e); // Вызываем onChange из register
//             handleChange(e); // Обновляем локальное состояние
//           }}
//           className={`w-full h-[38px] mt-[22px] text-[#4f4f4f] outline-none border-b ${
//             error ? 'border-red-500' : 'border-[#bdbdbd]'
//           } bg-transparent ${
//             label !== 'Description'
//               ? 'text-[16px] font-bold'
//               : 'text-[16px] font-normal'
//           } ${showPrefix ? 'pl-3' : ''}`}
//         />
//       </div>
//       <div className='absolute bottom-0 right-0 flex items-center gap-2'>
//         {label !== 'Price' && (
//           <span className='text-[13px] font-normal text-[#4f4f4f]'>
//             {value?.length || 0}/{maxLength}
//           </span>
//         )}
//         {isMaxLengthReached && (
//           <span className='text-[13px] font-normal text-red-500'>
//             Достигнут лимит символов
//           </span>
//         )}
//         {error && (
//           <span className='text-[13px] font-normal text-red-500'>{error}</span>
//         )}
//       </div>
//     </div>
//   );
// };

'use client'

import { useEffect, useState } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'

interface CustomInputProps {
	label: string
	register: UseFormRegisterReturn
	maxLength: number
	value: string
	type?: string
	error?: string
	prefix?: string
}
export const CustomInput = ({
	label,
	register,
	maxLength,
	value,
	type,
	error,
	prefix,
}: CustomInputProps) => {
	const [isFocused, setIsFocused] = useState<boolean>(false)
	const [isFilled, setIsFilled] = useState<boolean>(false)

	useEffect(() => {
		setIsFilled(!!value)
	}, [value])

	const handleFocus = () => setIsFocused(true)
	const handleBlur = () => setIsFocused(false)

	const isMaxLengthReached = value?.length >= maxLength
	const showPrefix = prefix && (isFocused || isFilled)

	return (
		<div className='relative w-full h-[86px]'>
			<label
				htmlFor={`${label.toLowerCase()}-input`}
				className={`absolute left-0 transition-all duration-300 ease-in-out ${
					isFocused || isFilled
						? 'top-0 text-[13px] font-normal text-[#4f4f4f]'
						: 'top-[22px] text-[16px] font-bold text-[#4f4f4f]'
				}`}
			>
				{label}
			</label>
			<div className='relative'>
				{showPrefix && (
					<span
						className={`absolute left-0 top-[28px] text-[16px] font-bold text-[#4f4f4f] ${
							error ? 'text-red-500' : ''
						}`}
					>
						{prefix}
					</span>
				)}
				<input
					id={`${label.toLowerCase()}-input`}
					type={type}
					{...register}
					onFocus={handleFocus}
					onBlur={handleBlur}
					className={`w-full h-[38px] mt-[22px] text-[#4f4f4f] outline-none border-b ${
						error ? 'border-red-500' : 'border-[#bdbdbd]'
					} bg-transparent ${
						label !== 'Description'
							? 'text-[16px] font-bold'
							: 'text-[16px] font-normal'
					} ${showPrefix ? 'pl-3' : ''}`}
				/>
			</div>
			<div className='absolute bottom-0 right-0 flex items-center gap-2'>
				{label !== 'Price' && (
					<span className='text-[13px] font-normal text-[#4f4f4f]'>
						{value?.length || 0}/{maxLength}
					</span>
				)}
				{isMaxLengthReached && (
					<span className='text-[13px] font-normal text-red-500'>
						Достигнут лимит символов
					</span>
				)}
				{error && (
					<span className='text-[13px] font-normal text-red-500'>{error}</span>
				)}
			</div>
		</div>
	)
}
