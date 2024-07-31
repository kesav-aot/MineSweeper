import { useState } from 'react'
import Mine from './Components/Mine'
import './App.css'


function App() {
  const[blocks, setBlocks] = useState(3)
  

  return (
    <>
      <h1>Dont Touch The Mine, You Will Die</h1>
      <Mine blocks={blocks} setBlocks={setBlocks} />
    </>
  )
}

export default App
