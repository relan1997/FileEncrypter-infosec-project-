import React from 'react'
import { Link,NavLink } from 'react-router-dom'
const Navbar = () => {
  return (
    <div>
        <NavLink to='/decText'>Decrypt</NavLink>
        <NavLink to='/encImg'>Encrypt</NavLink>
    </div>
  )
}

export default Navbar