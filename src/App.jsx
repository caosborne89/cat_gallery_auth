import SignIn from "./SignIn";
import CatGallery from "./CatGallery";
import OAuthClient from "./auth/OAuthClient.js";
import { useEffect, useState } from 'react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const authenticate = async () => {
      const oauthClient = new OAuthClient("2t4vj8qe2792pfcj8jhj5cih6r", "http://localhost:8080", "/auth");
      setIsAuthenticated(await oauthClient.authenticate());
    }
    
    authenticate();
  }, []);

  return (
    <>
      { isAuthenticated == true ? <CatGallery /> : <SignIn />  }
    </>
  )
}
