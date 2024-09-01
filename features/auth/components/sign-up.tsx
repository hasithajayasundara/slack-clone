import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { AuthFlow } from "../types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";


type Props = {
  onChangeAuthFlow: (flow: AuthFlow) => void;
};

export const SignUp = (props: Props) => {
  const { onChangeAuthFlow } = props;
  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="p-0 my-0">
        <CardTitle className="mb-[0.5rem]">
          Sign up to continue
        </CardTitle>
      </CardHeader>
      <CardDescription>
        Use your email or another service to continue
      </CardDescription>
      <CardContent className="space-y-5 px-0 pb-0 mt-4">
        <form className="space-y-2.5">
          <Input
            required
            disabled={false}
            value=""
            onChange={() => {}}
            placeholder="Email"
            type="email"
          />
          <Input
            required
            disabled={false}
            value=""
            onChange={() => {}}
            placeholder="Password"
            type="password"
          />
          <Input
            required
            disabled={false}
            value=""
            onChange={() => {}}
            placeholder="Confirm password"
            type="password"
          />
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={false}
          >
            Submit
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            onClick={() => {}}
            variant="outline"
            className="w-full relative"
            size="lg"
            disabled={false}
          >
            <FcGoogle
              className="size-5 absolute top-2.5 left-2.5"
            />
            Continue with Google
          </Button>
          <Button
            onClick={() => {}}
            variant="outline"
            className="w-full relative"
            size="lg"
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
