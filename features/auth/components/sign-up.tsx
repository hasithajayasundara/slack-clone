import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useAuthActions } from "@convex-dev/auth/react";
import { TriangleAlert } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthFlow } from "../types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FieldValues, useForm } from "react-hook-form";

type Props = {
  onChangeAuthFlow: (flow: AuthFlow) => void;
};

export const SignUp = (props: Props) => {
  const { onChangeAuthFlow } = props;
  const [isPending, setIsPending] = useState(false);
  const { signIn } = useAuthActions();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handlePasswordSignUp = (data: FieldValues) => {
    setIsPending(true);
    signIn("password", {
      email: data.email,
      password: data.password,
      flow: AuthFlow.SignUp,
    })
      .then(() => {
        reset();
        setError("");
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => setIsPending(false));
  };

  const handleSignUp = (value: "github" | "google") => {
    setIsPending(true);
    signIn(value)
      .catch((err) => {
        setError(err);
      })
      .finally(() => setIsPending(false));
  };

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="p-0 my-0">
        <CardTitle className="mb-[0.5rem]">Sign up to continue</CardTitle>
      </CardHeader>
      {Boolean(error) ? (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
          <TriangleAlert />
          <p>{error}</p>
        </div>
      ) : null}
      <CardDescription>
        Use your email or another service to continue
      </CardDescription>
      <CardContent className="space-y-5 px-0 pb-0 mt-4">
        <form
          className="space-y-2.5"
          onSubmit={handleSubmit(handlePasswordSignUp)}
        >
          <Input
            required
            disabled={isPending}
            placeholder="Email"
            type="email"
            error={errors.email?.message?.toString()}
            {...register("email", { required: "Email is required" })}
          />
          <Input
            required
            disabled={isPending}
            placeholder="Password"
            type="password"
            error={errors.password?.message?.toString()}
            {...register("password", { required: "Password is required" })}
          />
          <Input
            required
            disabled={isPending}
            placeholder="Confirm password"
            type="password"
            error={errors.confirmPassword?.message?.toString()}
            {...register("confirmPassword", {
              required: "Please confirm password",
              validate: (value, formValues) =>
                formValues.password === value || "Passwords do not match",
            })}
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
            variant="outline"
            className="w-full relative"
            size="lg"
            disabled={isPending}
            onClick={() => handleSignUp("google")}
          >
            <FcGoogle className="size-5 absolute top-2.5 left-2.5" />
            Continue with Google
          </Button>
          <Button
            disabled={isPending}
            variant="outline"
            className="w-full relative"
            size="lg"
            onClick={() => handleSignUp("github")}
          >
            <FaGithub className="size-5 absolute top-2.5 left-2.5" />
            Continue with Github
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Already have an account&nbsp;
          <span
            onClick={() => onChangeAuthFlow(AuthFlow.SignIn)}
            className="text-sky-700 hover:underline cursor-pointer"
          >
            Sign in
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
