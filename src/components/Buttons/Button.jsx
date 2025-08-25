import './Button.css'

const Button = ({label, onClick}) => {
  return (
    <button type='submit' className='Button' onClick={onClick}>{label}</button>
  )
}

export default Button