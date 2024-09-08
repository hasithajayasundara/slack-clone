'use client';

import Image from "next/image";
import Link from "next/link";
import VerificationInput from 'react-verification-input';
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useGetWorkspaceInfo, useJoin, useWorkspaceId } from "@/hooks";
import { cn } from "@/lib/utils";

const JoinPage = () => {
  const workspaceId = useWorkspaceId();

  const router = useRouter();
  const { data, isLoading } = useGetWorkspaceInfo({ id: workspaceId });
  const { joinWorkspace, isJoiningWorkspace } = useJoin();

  const handleComplete = (value: string) => {
    joinWorkspace(
      { id: workspaceId, joinCode: value },
      {
        onSuccess: (id) => {
          toast.success('Joined workspace');
          router.replace(`/workspace/${workspaceId}`);
        },
        onError: () => {
          toast.error('Failed to join workspace');
        }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-md">
      <Image
        width={60}
        height={60}
        src="/join.svg"
        alt="Join workspace"
      />
      <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
        <div className="flex flex-col gap-y-2 items-center justify-center">
          <h1 className="text-2xl font-bold">
            Join workspace {data?.name}
          </h1>
          <p className="text-md text-muted-foreground">
            Enter the workspace code to join
          </p>
        </div>
        <VerificationInput
          autoFocus
          length={6}
          onComplete={handleComplete}

          classNames={{
            container: cn('flex gap-x-2', isJoiningWorkspace && 'opacity-50 cursor-not-allowed'),
            character: 'uppercase h-auto rounded-md border border-grey-300 flex items-center justify-center text-lg font-medium text-grey-500',
            characterInactive: 'bg-muted',
            characterSelected: 'bg-white text-black',
            characterFilled: 'bg-white text-black'
          }}
        />
      </div>
      <div className="flex gap-x-4">
        <Button size="lg" variant="outline" asChild>
          <Link href="/">
            Back to home
          </Link>
        </Button>
      </div>
    </div>
  )
};

export default JoinPage;
