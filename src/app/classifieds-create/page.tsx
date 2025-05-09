'use client'

import { AddPhotoButton } from '../components/ui/add-photo-button'
import { ButtonWithIcon } from '../components/ui/button-with-icon'
import { ClassifiedForm } from '../components/ui/classified-form'
import { IconCustom } from '../components/ui/icon-custom'
import { TagsManager } from '../components/ui/tags-manager'
import { useAuth } from '../helpers/contexts/auth-context'

const AddPhotoSmallBtn = () => {
	return (
		<div className='border-dashed border border-[#4f4f4f] rounded-[13px] bg-transparent hover:bg-[#f7f7f7] hover:border-[#f9329c] group transition-colors flex items-center justify-center max-w-20 h-20 cursor-pointer max-lg:grid max-lg:col-span-3'>
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
				<div className='flex max-md:flex-wrap-reverse max-md:justify-start max-md:mb-4 max-2-5xl:justify-center'>
					{/* кнопки слева */}
					<div className='flex items-center justify-between max-md:w-full md:absolute md:left-0 z-10'>
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
							className='flex justify-center h-10 items-center min-w-[147px] w-fit'
						/>
						<div className='pr-4 md:hidden'>
							<ButtonWithIcon
								text='Publish'
								className='min-w-[95px] w-fit h-10 px-4 bg-[#3486fe]! text-white rounded-lg'
							/>
						</div>
					</div>
					<div className='flex max-md:w-full max-2-5xl:flex-wrap max-2-5xl:items-center max-md:mb-4 max-2-5xl:mb-8 max-md:pl-4 max-sm:py-[11px] 2-5xl:absolute 2-5xl:pl-40 2-5xl:flex-col gap-4'>
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
								<div className='w-full lg:max-w-[855px] lg:mx-auto space-y-4'>
									<div className='grid grid-cols-12 gap-4 lg:grid-cols-6 lg:gap-[60px]'>
										<div className='col-start-1 col-end-13 w-full lg:col-start-1 lg:col-end-5 lg:max-w-[487px]'>
											<AddPhotoButton />

											<div className='grid grid-cols-12 lg:grid-cols-4 p-8 gap-8'>
												{/* моб */}
												<div className='col-start-3 col-end-11 gap-8 lg:hidden'>
													<div className='grid grid-cols-12 gap-8'>
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

												{/* десктоп */}
												<div className='max-lg:hidden contents'>
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
										</div>
										<div className='col-start-4 col-end-10 min-w-full lg:col-start-5 lg:col-end-8 lg:w-[300px] lg:min-w-fit'>
											<ClassifiedForm />
										</div>
									</div>
									<div className='grid grid-cols-12 lg:grid-cols-6 gap-[60px]'>
										<div className='col-start-1 col-end-13 lg:col-start-1 lg:col-end-7 w-full'>
											<TagsManager />
										</div>
									</div>
									<div className='hidden md:flex justify-end'>
										<ButtonWithIcon
											text='Publish'
											className='min-w-[95px] w-fit h-10 px-4 bg-[#3486fe]! text-white rounded-lg'
										/>
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
