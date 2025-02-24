import Return from './game-buttons/Return'
import Shuffle from './game-buttons/Shuffle'
import Deselect from './game-buttons/Deselect'
import Undo from './game-buttons/Undo'
import Redo from './game-buttons/Redo'
import Restart from './game-buttons/Restart'
import Star from './game-buttons/Star'
import Launch from './game-buttons/Launch'

const ButtonPanel = () => {
  return (
    <div className={`bg-indigo-200 mt-2 mb-2 rounded-lg shadow-lg flex justify-between justify-self-center
        p-[2px]   xs-box:p-[4px]    sm-box:p-[8px]    md-box:p-[16px]
        gap-[2px] xs-box:gap-[4px]  sm-box:gap-[6px]  md-box:gap-[8px]`}>
        <Return/>
        <Shuffle/>
        <Deselect/>
        {/* <Move/> */}
        <Undo/>
        <Redo/>
        <Restart/>
        <Star/>
        <Launch/>
    </div>
  )
}

export default ButtonPanel