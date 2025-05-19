import { MdOutlineSportsBaseball } from "react-icons/md";
import { IoPeople } from "react-icons/io5";
import { FaBookOpen } from "react-icons/fa";
import { BiTrip } from "react-icons/bi";
import { IoIosMusicalNotes } from "react-icons/io";
import { FaGamepad } from "react-icons/fa6";
import { BiSolidParty } from "react-icons/bi";
import { BsGraphUpArrow } from "react-icons/bs";
import { ImSpoonKnife } from "react-icons/im";

export default function changeIcon(crewCategory, color = "#6C757D") {
  switch (crewCategory) {
    case "스포츠":
      return <MdOutlineSportsBaseball size={18} color={color} />;
    case "사교":
      return <IoPeople size={18} color={color} />;
    case "독서":
      return <FaBookOpen size={18} color={color} />;
    case "여행":
      return <BiTrip size={18} color={color} />;
    case "음악":
      return <IoIosMusicalNotes size={18} color={color} />;
    case "게임":
      return <FaGamepad size={18} color={color} />;
    case "공연":
      return <BiSolidParty size={18} color={color} />;
    case "자기계발":
      return <BsGraphUpArrow size={18} color={color} />;
    case "요리":
      return <ImSpoonKnife size={18} color={color} />;
    default:
      return <IoPeople size={18} color={color} />;
  }
}
