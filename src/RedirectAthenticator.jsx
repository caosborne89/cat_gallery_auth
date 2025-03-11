import { useState, useEffect } from "react";
import SignIn from "./SignIn";
import { Authenticator } from '@aws-amplify/ui-react';
import { getCurrentUser } from 'aws-amplify/auth';

export default function RedirectAuthenticator({ children }) {
    const [authenticated, setAuthenticated] = useState("configuring");

    useEffect(() => {
        getCurrentUser()
            .then(() => {
                setAuthenticated('authenticated');
            })
      .     catch(() => {
                setAuthenticated('unauthenticated');
            });
    });
    return (
        <Authenticator.Provider>
              {authenticated == "authenticated" ? children : <></>}
              {authenticated == "unauthenticated" ? <SignIn /> : <></>}
        </Authenticator.Provider>
    );
}