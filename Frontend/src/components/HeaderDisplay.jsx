import React from 'react'

function HeaderDisplay({children}) {
  return (
    <>
      {console.log({children})}
        <h1>{children}</h1>
    </>
  )
}
export default HeaderDisplay


