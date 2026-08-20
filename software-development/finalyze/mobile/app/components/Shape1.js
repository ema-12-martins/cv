import Svg, { Path } from "react-native-svg"
import COLORS from "../constants/colors"

const Shape1 = ({ color = COLORS.secondary, ...props }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    fill="none"
    viewBox="0 0 600 600" 
    preserveAspectRatio="xMidYMid meet"
    {...props}
  >
    <Path
      fill={color}
      d="M257.421 6.153c74.562 8.383 138.947 47.195 191.838 100.415 52.688 53.015 101.896 117.166 98.609 191.838-3.197 72.644-59.666 128.236-114.785 175.662-50.094 43.102-109.818 68.615-175.662 74.247-73.4 6.278-160.99 14.895-208.525-41.385-46.628-55.207 2.576-136.442-2.548-208.524-5.952-83.725-78.511-172.394-29.367-240.44C66.883-11.127 172.724-3.368 257.421 6.154Z"
    />
  </Svg>
)

export default Shape1
