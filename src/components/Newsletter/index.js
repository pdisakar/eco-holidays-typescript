import { useState } from "react";
import { Cursor } from "react-bootstrap-icons";
import client from "../../services/network";
import { Envelope } from "../svgs";
export default function Newsletter({ title, subTitle, btnLabel }) {
  const resetForm = () => {
    const newsletterForm = document.getElementById("newsletter-form");
    newsletterForm.reset();
  };
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    let data = {
      email: event.target.email.value,
    };
    await client
      .post("/newsletter/subscribe", data, {
        headers: {
          Accept: "application/json",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          resetForm();
          setMessage("Your information has been submitted.");
        } else {
          setMessage("Some error occured");
        }
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  };

  return (
    <aside className="common-box newsletter">
      <div className="container">
        <div className="newsletter-container">
          <div className="newsletter-title">
            <div className="svg-icon">
              <Envelope fill="currentColor" />
            </div>
            <div className="text">
              <h2>{title}</h2>
              <p className="help-text">{subTitle}</p>
            </div>
          </div>
          <div className="newsletter-content">
            <form onSubmit={handleSubmit} id="newsletter-form">
              <input
                type="text"
                name="name"
                id="name"
                className="form-control"
                placeholder="Full Name"
              />
              <input
                type="email"
                name="email"
                id="email"
                className="form-control"
                placeholder="Email Address"
              />
              <button type="submit" className="btn">
                <i className="icon">
                  <Cursor fill="currentColor" />
                </i>
              </button>
            </form>
          </div>
        </div>
      </div>
    </aside>
  );
}
