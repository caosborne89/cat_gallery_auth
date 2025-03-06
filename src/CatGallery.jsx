import CatImage from "./CatImage";
import data from "./data";

export default function CatGallery() {
    const images = data.map(catImageData => (
        <CatImage
            id={catImageData.id}
            {...catImageData}
        />
    ));
    return (
        <div className="d-flex justify-content-center mt-5">
            <div className="d-flex flex-column">
                <div className="d-flex justify-content-between m-4 ">
                    {/* <h2>Hello ${username}</h2> */}
                    <button id="signoutButton" type="button" className="btn btn-outline-primary">Sign out</button>
                </div>
                <div className="d-flex flex-row flex-wrap bg-secondary mx-4" style={{maxWidth: 100 + 'rem'}}>
                { images }
                </div>
            </div>
        </div>
    )
}