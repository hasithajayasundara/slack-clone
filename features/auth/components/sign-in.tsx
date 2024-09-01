import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { FieldValues, useForm } from "react-hook-form";
import { useAuthActions } from "@convex-dev/auth/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { AuthFlow } from "../types";

type Props = {
  onChangeAuthFlow: (flow: AuthFlow) => void;
};

export const SignIn = (props: Props) => {
  const { onChangeAuthFlow } = props;
  const { signIn } = useAuthActions();

  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const handlePasswordSignIn = (data: FieldValues) => {
    setIsPending(true);
    signIn(
      'password',
      { email: data.email, password: data.password, flow: AuthFlow.SignIn }
    ).finally(() => setIsPending(false));
  };

  const handleSignIn = (value: 'github' | 'google') => {
    setIsPending(true);
    signIn(value).finally(() => setIsPending(false));
  };

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="p-0 my-0">
        <CardTitle className="mb-[0.5rem]">
          Login to continue
        </CardTitle>
      </CardHeader>
      <CardDescription>
        Use your email or another service to continue
      </CardDescription>
      <CardContent className="space-y-5 px-0 pb-0 mt-4">
        <form
          className="space-y-2.5"
          onSubmit={handleSubmit(handlePasswordSignIn)}
        >
          <Input
            required
            placeholder="Email"
            type="email"
            error={errors.email?.message?.toString()}
            {...register(
              'email',
              { required: 'Email is required' }
            )}

          />
          <Input
            required
            placeholder="Password"
            type="password"
            error={errors.password?.message?.toString()}
            {...register(
              'password',
              { required: 'Password is required' }
            )}
          />
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isPending}
          >
            Submit
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            onClick={() => handleSignIn('google')}
            variant="outline"
            className="w-full relative"
            size="lg"
            disabled={isPending}
          >
            <FcGoogle
              className="size-5 absolute top-2.5 left-2.5"
            />
            Continue with Google
          </Button>
          <Button
            onClick={() => handleSignIn('github')}
            variant="outline"
            className="w-full relative"
            size="lg"
            disabled={isPending}
          >
            <FaGithub className="size-5 absolute top-2.5 left-2.5" />
            Continue with Github
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Don&apos;t have an account&nbsp;
          <span
            onClick={() => onChangeAuthFlow(AuthFlow.SignUp)}
            className="text-sky-700 hover:underline cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
