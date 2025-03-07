import "./SignIn.css";
import OAuthClient from "./auth/OAuthClient.js";

export default function SignIn() {
    const signInRedirect = async () => {
        const codeCallenge = await OAuthClient.createCodeChallenge();
        window.location.href = `https://us-west-2n9yh2zkeq.auth.us-west-2.amazoncognito.com/login?client_id=2t4vj8qe2792pfcj8jhj5cih6r&response_type=code&scope=email+openid+phone&redirect_uri=http://localhost:8080&code_challenge=${codeCallenge}&code_challenge_method=S256`;
    }

    return (
        <div id="signin">
            <div className="d-flex justify-content-center p-3 signin-outer-container">
                <div className="card bg-secondary d-flex justify-content-center align-items-center signin-inner-container">
                    <p className="text-light">Sign into AWS Cognito</p>
                    <button id="signinButton" onClick={signInRedirect} className="btn btn-primary">Sign in</button>
                </div>
            </div>
        </div>
    );
}