import shuriken from '../icons/shuriken.png'
import kunai from '../icons/ninjaBlade.png'
export default function Logo() {
    return (
      <div className="logo">
        <span role="img"><img id='logo1' src={shuriken} alt="" /></span>
        <h1>RIZZ NIME</h1>
        <span role="img"><img id='logo1' src={kunai} alt="" /></span>
      </div>
    );
  }