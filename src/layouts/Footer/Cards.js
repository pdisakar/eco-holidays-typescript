import Image from "next/image";
import Visa from "../../assets/images/card/visa.png";
import Master from "../../assets/images/card/master-card.png";
import Jcb from "../../assets/images/card/jcb.jpg";
import Discover from "../../assets/images/card/discover.jpg";
import UnionPay from "../../assets/images/card/union-pay-logo.jpg"
import DinnerClub from "../../assets/images/card/dinners-club.jpg"
import AmericanExpress from "../../assets/images/card/american-express.jpg"
export default function cards({ props }) {
  return (
    
        <ul>
          <li>
            <span><Image src={Visa} alt="visa card" width={70} height={44} layout="responsive" /></span>
          </li>
          <li>
            <span><Image src={Master} alt="Master card" width={70} height={44} layout="responsive" /></span>
          </li>
          <li>
            <span><Image src={AmericanExpress} alt="American Express" width={70} height={44} layout="responsive" /></span>
          </li>          
          <li>
            <span><Image src={Discover} alt="Discover" width={70} height={44} layout="responsive" /></span>
          </li>
          <li>
            <span><Image src={Jcb} alt="JCB" width={70} height={44} layout="responsive" /></span>
          </li>
          <li>
            <span><Image src={DinnerClub} alt="Dinner Club" width={70} height={44} layout="responsive" /></span>
          </li>
          <li>
            <span><Image src={UnionPay} alt="Union Pay" width={70} height={44} layout="responsive" /></span>
          </li>
        </ul>
  );
}
