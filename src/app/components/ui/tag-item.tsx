'use client'

import { useEffect, useRef, useState } from 'react'
import { ButtonWithIcon } from './button-with-icon'
import { IconCustom } from './icon-custom'

interface TagItemProps {
  text: string
  onClick?: () => void
  onAddTag?: (tag: string) => void
  type: 'close' | 'input' | 'plus'
}

export const TagItem = ({ text, onClick, onAddTag, type }: TagItemProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-focus when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  // Handle input click
  const handleInputClick = () => {
    if (type === 'input') {
      if (isEditing && inputValue.trim()) {
        onAddTag?.(inputValue.trim())
        setInputValue('')
        setIsEditing(false)
      } else {
        setIsEditing(true)
      }
    }
  }

  // Handle close button click
  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent parent div's onClick from triggering
    if (type === 'input' && isEditing) {
      setInputValue('')
      setIsEditing(false)
    }
  }

  // Handle input change with 30-character limit
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.length <= 30) {
      setInputValue(value)
    }
  }

  // Handle Enter and Escape keys
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      onAddTag?.(inputValue.trim())
      setInputValue('')
      setIsEditing(false)
    } else if (e.key === 'Escape') {
      setInputValue('')
      setIsEditing(false)
    }
  }

  if (type === 'close') {
    return (
      <div className='flex items-center h-10 gap-2 border border-[#3486fe] rounded-lg py-2 pl-4 pr-2 text-[#3486fe] hover:bg-[#f7f7f7] transition-all'>
        <span className='text-[14px] font-medium text-[#4f4f4f]'>{text}</span>
        <ButtonWithIcon
          onClick={onClick}
          iconWrapperClass='h-6 w-6 flex items-center justify-center'
          icon={
            <IconCustom
              name='close'
              className='w-3.5 h-3.5 text-[#F9329C] fill-none'
            />
          }
          isHover
          className='w-6 h-6 flex items-center justify-center rounded-lg'
        />
      </div>
    )
  }

  if (type === 'plus') {
    return (
      <div
        className='flex items-center h-10 gap-2 border border-[#3486fe] rounded-lg py-2 pl-2 pr-4 flex-row-reverse text-[#3486fe] hover:bg-[#f7f7f7] transition-all group cursor-pointer'
        onClick={onClick}
      >
        <span className='text-[14px] font-medium text-[#4f4f4f]'>{text}</span>
        <ButtonWithIcon
          iconWrapperClass='h-6 w-6 flex items-center justify-center'
          icon={
            <IconCustom
              name='plus'
              className='w-6 h-6 group text-[#F9329C] fill-none'
            />
          }
          isHover
          className='w-6 h-6 flex items-center justify-center rounded-lg group'
        />
      </div>
    )
  }

  return (
    <div
      className={`flex items-center h-10 gap-2 group cursor-pointer ${
        isEditing ? 'border border-[#3486fe]' : 'border-none'
      } rounded-lg py-2 text-[#3486fe] hover:bg-[#f7f7f7] transition-all ${
        isEditing ? 'pl-4 pr-2' : 'pl-2 pr-4 flex-row-reverse'
      }`}
      onClick={handleInputClick}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className='text-[14px] font-medium text-[#4f4f4f] bg-transparent outline-none w-[100px] min-w-[50px]'
          style={{ width: `${Math.max(50, inputValue.length * 8 + 20)}px` }}
        />
      ) : (
        <span className='text-[14px] font-medium text-[#4f4f4f]'>{text}</span>
      )}
      <ButtonWithIcon
        onClick={handleCloseClick}
        iconWrapperClass='h-6 w-6 flex items-center justify-center'
        icon={
          <IconCustom
            name={isEditing ? 'close' : 'plus'}
            className={`${
              isEditing ? 'w-3.5 h-3.5' : 'w-6 h-6'
            } text-[#F9329C] fill-none`}
          />
        }
        isHover
        className='w-6 h-6 flex items-center justify-center rounded-lg'
      />
    </div>
  )
}