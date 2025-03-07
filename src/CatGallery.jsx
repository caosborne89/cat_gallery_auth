import CatImage from "./CatImage";
import data from "./data";
import IdToken from "./auth/IdToken";

export default function CatGallery() {
    const images = data.map(catImageData => (
        <CatImage
            key={catImageData.id}
            {...catImageData}
        />
    ));

    const signOutRedirect = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("id_token");
        localStorage.removeItem("refresh_token");
        window.location.href = `http://localhost:8080`;
    }

    const username = () => {
        const jwt = localStorage.getItem("id_token");
        return new IdToken(jwt).payload["cognito:username"];
    }
    
    return (
        <div className="d-flex justify-content-center mt-5">
            <div className="d-flex flex-column">
                <div className="d-flex justify-content-between m-4 ">
                    <h2>Hello {username()}</h2>
                    <button id="signoutButton" type="button" className="btn btn-outline-primary" onClick={ signOutRedirect }>Sign out</button>
                </div>
                <div className="d-flex flex-row flex-wrap bg-secondary mx-4" style={{maxWidth: 100 + 'rem'}}>
                { images }
                </div>
            </div>
        </div>
    )
    
}
