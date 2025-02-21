import React from 'react'

export const Inputt = ({
    label = "",
    name = "",
    type = "text",
    className = "",
    isRequired = true,
    placeholder = "",
    value = "",
    onChange = () => {},
}) => {
  return (
    <div className='w-1/2'>
        <label htmlFor={name} className = "block text-sm font-medium text-gray-800">{label}</label>
        <input type={type} id={name} className= {`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark: text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-l-primary ${className}`} placeholder={placeholder} required={isRequired} value={value} onChange={onChange}/>
    </div>
  )
}
