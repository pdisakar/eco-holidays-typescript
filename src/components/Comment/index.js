
import { formatDate } from "@/lib/dateFormatter";
export default function Comment({ data, classNamees }) {
  return (
    <div className={classNamees}>
      <h3 className="module-title mb-6">Comments - {data.length}</h3>
      <ul>
        {data.map((itm, idx) => {
         return(
            <li className="clearfix" key={idx}>
            <div className="item-wrap">
              <div className="intro-img">{itm.commentor_name.charAt(0)}</div>
              <div className="intro-text">
                <div className="item-title">
                  <h4>{itm.commentor_name}</h4>
                  <span className="date">
                    {formatDate(itm.created_at, 'Do MMM YYYY')}
                    
                  </span>
                </div>
                <div dangerouslySetInnerHTML={{ __html: itm.comment }}></div>
              </div>
            </div>
            {itm.children.length >= 1 && (
              <ul className="child">
                {itm.children.map((citem, jdx) => {
                  return (
                    <li className="clearfix" key={jdx}>
                      <div className="item-wrap">
                        <div className="intro-img">
                          {citem.commentor_name.charAt(0)}
                        </div>
                        <div className="intro-text">
                          <div className="item-title">
                            <h4>{citem.commentor_name}</h4>
                            <span className="date">
                              {formatDate(citem.created_at, "Do MMM YYYY")}
                            </span>
                          </div>
                          <div
                            dangerouslySetInnerHTML={{ __html: citem.comment }}
                          ></div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
         )
        })}
      </ul>
    </div>
  );
}
