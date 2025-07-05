import React from 'react'
import { Link } from 'react-router-dom'

const Pagination = ({page, totalPages}) => {
  return (
    <div>
        <Link to={`/shop?page=${page - 1}`} className='bg-gray-200 text-gray-700 px-4 py-2 rounded-md'>Previous</Link>
        <Link to={`/shop?page=${page + 1}`} className='bg-gray-200 text-gray-700 px-4 py-2 rounded-md'>Next</Link>
    </div>
  )
}

export default Pagination
