import SignIn from "./SignIn";
import CatGallery from "./CatGallery";
import OAuthClient from "./auth/OAuthClient.js";

export default function App() {
  const oauthClient = new OAuthClient("2t4vj8qe2792pfcj8jhj5cih6r", "http://localhost:8080", "/auth");
  const authenicated = oauthClient.authenticate();
  let content = authenicated ? <SignIn /> : <CatGallery />;
  
  return (
    <>
      { content }
    </>
  )
}
