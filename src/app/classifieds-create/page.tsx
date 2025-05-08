'use client'

import { AddPhotoButton } from '../components/ui/add-photo-button'
import { ButtonWithIcon } from '../components/ui/button-with-icon'
import { ClassifiedForm } from '../components/ui/classified-form'
import { IconCustom } from '../components/ui/icon-custom'
import { TagsManager } from '../components/ui/tags-manager'
import { useAuth } from '../helpers/contexts/auth-context'

const AddPhotoSmallBtn = () => {
	return (
		<div className='border-dashed border border-[#4f4f4f] rounded-[13px] bg-transparent hover:bg-[#f7f7f7] hover:border-[#f9329c] group transition-colors flex items-center justify-center max-w-20 h-20 cursor-pointer'>
			<IconCustom
				name='plus'
				hover
				className='w-6 h-6 fill-none text-[#4f4f4f] group'
			/>
		</div>
	)
}

export default function ClassifiedsCreate() {
	const { user, logout } = useAuth()

	const handleBack = () => {
		window.history.back()
	}

	return (
		<div className='min-h-screen flex flex-col'>
			<div className='flex-1 pt-14 pb-10 md:pt-40'>
				<div className='flex'>
					{/* кнопки слева */}
					<ButtonWithIcon
						onClick={handleBack}
						text='Back'
						iconWrapperClass='w-6 h-6'
						icon={
							<IconCustom
								name='arrow-prev'
								hover={true}
								className='w-6 h-6 text-[#3486FE] fill-none'
							/>
						}
						isHover
						className='flex justify-center h-10 items-center min-w-[147px] w-fit absolute left-0 z-10'
					/>
					<div className='flex max-xl:flex-wrap max-xl:items-center max-sm:justify-start max-xl:justify-center max-sm:mb-4 max-xl:mb-8 max-sm:pl-4 max-sm:py-[11px] xl:absolute xl:pl-[180px] xl:flex-col gap-4'>
						<ButtonWithIcon
							text='My Classifieds'
							iconWrapperClass='w-6 h-6 flex items-center justify-center'
							icon={
								<IconCustom
									name='plus'
									className='w-6 h-6 fill-none text-white'
								/>
							}
							className='w-fit min-w-[183px] h-10 flex flex-row-reverse items-center justify-center rounded-lg text-white bg-[#3486fe]!'
						/>
						<ButtonWithIcon
							text='Logout'
							onClick={logout}
							className='w-fit min-w-[92px] h-10 flex items-center justify-center border border-[#4f4f4f] rounded-[8px] hover:bg-[#f7f7f7] hover:border-[#3486fe]'
						/>
					</div>
				</div>

				{/* контент создания продукта */}
				<div className='flex-1 w-full'>
					<div className='custom-container mx-auto'>
						<div className='grid grid-cols-4 sm:grid-cols-12 gap-4 min-[769px]:gap-8 xl:gap-[60px]'>
							<div className='col-start-1 col-end-13'>
								<div className='max-w-[855px] mx-auto space-y-4'>
									<div className='grid grid-cols-6 gap-[60px]'>
										<div className='col-start-1 col-end-5 max-w-[487px]'>
											<AddPhotoButton />
											<div className='p-8 grid grid-cols-4 gap-8'>
												<AddPhotoSmallBtn />
												<AddPhotoSmallBtn />
												<AddPhotoSmallBtn />
												<AddPhotoSmallBtn />
												<AddPhotoSmallBtn />
												<AddPhotoSmallBtn />
												<AddPhotoSmallBtn />
												<AddPhotoSmallBtn />
											</div>
										</div>
										<div className='col-start-5 col-end-8 w-[300px] min-w-fit'>
											<ClassifiedForm />
										</div>
									</div>
									<div className='grid grid-cols-6 gap-[60px]'>
										<div className='col-start-1 col-end-7 w-full'>
											<TagsManager />
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
