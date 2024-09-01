"use client";

import { useState } from "react";
import { AuthFlow } from "../types";
import { SignIn } from "./sign-in";
import { SignUp } from "./sign-up";

export const AuthScreen = () => {
  const [authFlow, setAuthFlow] = useState<AuthFlow>(AuthFlow.SignIn);

  return (
    <div className="h-full flex items-center justify-center bg-[#5c3b58] ">
      <div className="md:h-auto md:w-[420px]">
        {authFlow === AuthFlow.SignIn ? (
          <SignIn
            onChangeAuthFlow={(a) => setAuthFlow(a)} />
        ) : (
          <SignUp
            onChangeAuthFlow={(a) => setAuthFlow(a)}
          />
        )}
      </div>
    </div>
  );
};
