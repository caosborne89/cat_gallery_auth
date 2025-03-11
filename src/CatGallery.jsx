import CatImage from "./CatImage";
import data from "./data";
import { useEffect, useState } from 'react';
import { getCurrentUser, signOut } from 'aws-amplify/auth';

export default function CatGallery() {
    const images = data.map(catImageData => (
        <CatImage
            key={catImageData.id}
            {...catImageData}
        />
    ));
    const [username, setUser] = useState(null);
    useEffect(() => {
        const fetchCurrentUser = async () => {
            const { username, userId, signInDetails } = await getCurrentUser();
            setUser(signInDetails.loginId);
        };
    
        fetchCurrentUser();
      }, []);

    const handleSignout = async () => {
        await signOut();
    }
    
    return (
        <div className="d-flex justify-content-center mt-5">
            <div className="d-flex flex-column">
                <div className="d-flex justify-content-between m-4 ">
                    <h2>Hello {username}</h2>
                    <button id="signoutButton" type="button" className="btn btn-outline-primary" onClick={ handleSignout }>Sign out</button>
                </div>
                <div className="d-flex flex-row flex-wrap bg-secondary mx-4" style={{maxWidth: 100 + 'rem'}}>
                { images }
                </div>
            </div>
        </div>
    )
    
}
