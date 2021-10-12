import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';

export default function Blogpost() {
    const history = useHistory();
    const [blogpost,seBlogpost] = useState({
        img: "https://miro.medium.com/max/1400/1*AQSWHe9qZAEuPjHBMgljgg.png",
        title: "TellorX Goes to External Audit",
        link: "/blog"
    })

    return (
        <div className="Blogpost" onClick={() => history.push("/test")}>
            <div className="Blogpost__image">
                <img src={blogpost.img} />
            </div>
            <div className="Blogpost__txt">
                <p>Blogpost</p>
                <h4>{blogpost.title}</h4>
            </div>
        </div>
    )
}
