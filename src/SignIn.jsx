import "./SignIn.css";
import { signInWithRedirect } from "aws-amplify/auth"

export default function SignIn() {
    const handleSignIn = async () => {
        try {
          await signInWithRedirect();
        } catch (error) {
          console.error('Error signing in with redirect', error);
        }
      };
    return (
        <div id="signin">
            <div className="d-flex justify-content-center p-3 signin-outer-container">
                <div className="card bg-secondary d-flex justify-content-center align-items-center signin-inner-container">
                    <p className="text-light">Sign into AWS Cognito</p>
                    <button id="signinButton" onClick={() => { handleSignIn()}} className="btn btn-primary">Sign in</button>
                </div>
            </div>
        </div>
    );
}